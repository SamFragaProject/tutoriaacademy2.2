import type { PracticeQuestion, PracticeResult, Subject, ReviewMaterial } from '../types';
import { track } from './metrics';
import * as studentProfileSvc from './studentProfile';
import * as studyTopicsSvc from './studyTopics';
import * as srsService from './srs';
import apiDriver from '../src/services/api';

const TOPIC_EXAM_RESULTS_KEY = 'practice:topicExamResults';
const TOPIC_COMPLETION_TIMES_KEY = 'practice:topicCompletionTimes';

const MOCK_QUESTIONS: Record<string, PracticeQuestion[]> = {
    'Fundamentos de Álgebra': [
        { id: 'P_M_E1', subTopic: 'Ecuaciones de primer grado', text: 'Resuelve para x: $$3x + 5 = 14$$', options: ['x = 2', 'x = 3', 'x = 9', 'x = 5/3'], correctIndex: 1, difficulty: 1 },
        { id: 'P_M_F1', subTopic: 'Factorización', text: 'Factoriza la expresión $$x^2 - 9$$', options: ['(x-3)(x-3)', '(x+3)(x+3)', '(x-3)(x+3)', 'No se puede'], correctIndex: 2, difficulty: 2 },
        { id: 'P_M_F2', subTopic: 'Factorización', text: 'Uno de los factores de $$x^2 + 7x + 12$$ es:', options: ['(x+5)', '(x+6)', '(x+4)', '(x-3)'], correctIndex: 2, difficulty: 3 },
    ],
    'Ecuaciones de primer grado': [
        { id: 'P_M_E1', subTopic: 'Ecuaciones de primer grado', text: 'Resuelve para x: $$3x + 5 = 14$$', options: ['x = 2', 'x = 3', 'x = 9', 'x = 5/3'], correctIndex: 1, difficulty: 1 },
        { id: 'P_M_E2', subTopic: 'Ecuaciones de primer grado', text: '¿Cuál es el valor de y si $$10 - 2y = 4$$?', options: ['y = 6', 'y = -3', 'y = 3', 'y = 7'], correctIndex: 2, difficulty: 2 },
        { id: 'P_M_E3', subTopic: 'Ecuaciones de primer grado', text: 'Si un número se duplica y se le resta 7, el resultado es 11. ¿Cuál es el número?', options: ['8', '18', '9', '10'], correctIndex: 2, difficulty: 3 },
    ],
    'Factorización': [
        { id: 'P_M_F1', subTopic: 'Factorización', text: 'Factoriza la expresión $$x^2 - 9$$', options: ['(x-3)(x-3)', '(x+3)(x+3)', '(x-3)(x+3)', 'No se puede'], correctIndex: 2, difficulty: 2 },
        { id: 'P_M_F2', subTopic: 'Factorización', text: 'Uno de los factores de $$x^2 + 7x + 12$$ es:', options: ['(x+5)', '(x+6)', '(x+4)', '(x-3)'], correctIndex: 2, difficulty: 3 },
        { id: 'P_M_F3', subTopic: 'Factorización', text: 'Factoriza completamente: $$2x^2 - 8$$', options: ['2(x-2)(x+2)', '2(x-4)(x+4)', '(2x-4)(x+2)', '2(x^2-4)'], correctIndex: 0, difficulty: 4 },
    ],
    'Idea Principal': [
        { id: 'P_L_I1', subTopic: 'Idea Principal', text: 'Tras leer un texto sobre la deforestación, ¿cuál sería la idea principal más probable?', options: ['Los árboles son importantes para el oxígeno.', 'La pérdida de bosques tiene graves consecuencias ecológicas y climáticas.', 'Hay muchos tipos de árboles en el Amazonas.', 'Se deben plantar más árboles.'], correctIndex: 1, difficulty: 2 },
    ],
     'Agudas, graves y esdrújulas': [
        { id: 'P_L_A1', subTopic: 'Agudas, graves y esdrújulas', text: '¿Cuál de las siguientes palabras es esdrújula?', options: ['canción', 'árbol', 'música', 'reloj'], correctIndex: 2, difficulty: 1 },
        { id: 'P_L_A2', subTopic: 'Agudas, graves y esdrújulas', text: 'Identifica la palabra grave que necesita tilde.', options: ['examen', 'marmol', 'joven', 'crisis'], correctIndex: 1, difficulty: 3 },
    ]
};

// AI Simulation
export const generatePracticeSet = async (
    practiceTopic: { subject: Subject, subTopic: string }, 
    userId: string,
    count = 3
): Promise<PracticeQuestion[]> => {
    await new Promise(res => setTimeout(res, 500));

    const allQuestionsForMainTopic = MOCK_QUESTIONS[practiceTopic.subTopic] || [];
    if (allQuestionsForMainTopic.length === 0) {
        track('practice_session_failed', { subTopic: practiceTopic.subTopic, reason: 'no_questions' });
        return [{ id: 'P_EMPTY', subTopic: practiceTopic.subTopic, text: `No hay preguntas de práctica para "${practiceTopic.subTopic}" todavía.`, options: ['Volver'], correctIndex: 0, difficulty: 1 }];
    }
    
    // --- Adaptive Difficulty Logic ---
    const profile = studentProfileSvc.getStudentProfile(userId);
    const mainTopicData = (await studyTopicsSvc.getSyllabus())[practiceTopic.subject]?.find(mt => mt.name === practiceTopic.subTopic);
    const subTopicNames = mainTopicData ? mainTopicData.subTopics.map(st => st.name) : [practiceTopic.subTopic];

    const subTopicSkills = subTopicNames.map(stName => {
        const skillKey = `${practiceTopic.subject.toLowerCase()}_${stName.replace(/\s+/g, '_')}`;
        return profile.skills[skillKey] || studentProfileSvc.getDefaultSkill();
    });

    const avgDifficulty = subTopicSkills.reduce((sum, skill) => sum + skill.difficulty, 0) / (subTopicSkills.length || 1);
    const targetDifficulty = Math.round(avgDifficulty);
    
    let questions = allQuestionsForMainTopic.filter(q => q.difficulty === targetDifficulty);

    if (questions.length < count) {
        const otherQuestions = allQuestionsForMainTopic.filter(q => q.difficulty !== targetDifficulty);
        otherQuestions.sort((a, b) => Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty));
        questions.push(...otherQuestions.slice(0, count - questions.length));
    }
    
    const finalSet = questions.sort(() => 0.5 - Math.random()).slice(0, count);
    
    track('practice_session_generated', { 
        subTopic: practiceTopic.subTopic, 
        count: finalSet.length,
        targetDifficulty: targetDifficulty 
    });
    
    return finalSet;
};

export const getImmediateFeedback = async (question: PracticeQuestion, selectedIndex: number): Promise<{ isCorrect: boolean, feedback: string }> => {
    await new Promise(res => setTimeout(res, 300));
    const isCorrect = selectedIndex === question.correctIndex;
    let feedback = '';
    if (isCorrect) {
        feedback = `¡Correcto! La respuesta es **${question.options[selectedIndex]}**. Has aplicado el concepto de *${question.subTopic}* de manera excelente.`;
    } else {
        feedback = `No del todo. La respuesta correcta era **${question.options[question.correctIndex]}**. \n\n**Repaso Rápido:** Para resolver este tipo de problemas de *${question.subTopic}*, recuerda siempre [principio clave o paso omitido]. ¡Sigue intentando!`;
    }
    track('practice_feedback_received', { subTopic: question.subTopic, isCorrect });
    return { isCorrect, feedback };
};

export const getDeferredFeedback = async (results: PracticeResult[], subTopic: string): Promise<string> => {
     await new Promise(res => setTimeout(res, 600));
     const correctCount = results.filter(r => r.isCorrect).length;
     const total = results.length;
     if (total === 0) return "No se completó la práctica. ¡Inténtalo de nuevo cuando estés listo!";
     const score = (correctCount / total) * 100;

     if (score >= 80) {
         return `¡Excelente desempeño en **${subTopic}**! Tuviste un ${score.toFixed(0)}% de aciertos. Tu dominio del tema es sólido. El siguiente paso podría ser un tema relacionado o aumentar la dificultad.`;
     } else if (score >= 60) {
         return `¡Buen trabajo en **${subTopic}**! Lograste un ${score.toFixed(0)}% de aciertos. Hay una buena base, pero repasar los puntos donde dudaste solidificará tu conocimiento. Te recomiendo una sesión de repaso en 2 días.`;
     } else {
         return `Esta fue una práctica desafiante en **${subTopic}**, con un ${score.toFixed(0)}% de aciertos. No te preocupes, ¡identificar áreas de oportunidad es el primer paso! Te sugiero volver a la lección de "Aprender" sobre este tema.`;
     }
};

// NEW: Functions for dashboard analytics
export const logTopicCompletion = (topicName: string, timeMillis: number) => {
    try {
        const completions = JSON.parse(localStorage.getItem(TOPIC_COMPLETION_TIMES_KEY) || '{}');
        if (!completions[topicName]) completions[topicName] = [];
        completions[topicName].push(timeMillis);
        localStorage.setItem(TOPIC_COMPLETION_TIMES_KEY, JSON.stringify(completions));
    } catch(e) { console.error("Failed to log topic completion time", e); }
};

export const logTopicExamResult = (userId: string, subject: Subject, topicName: string, score: number) => {
    try {
        const results = JSON.parse(localStorage.getItem(TOPIC_EXAM_RESULTS_KEY) || '{}');
        if (!results[topicName]) results[topicName] = [];
        results[topicName].push({ score, date: new Date().toISOString() });
        localStorage.setItem(TOPIC_EXAM_RESULTS_KEY, JSON.stringify(results));
        
        // NEW: Trigger SRS scheduling
        srsService.scheduleNextReview(userId, subject, topicName, score);

    } catch(e) { console.error("Failed to log topic exam result", e); }
};

export const getTopicStats = (): { avgScore: number, avgTimeMillis: number } => {
    try {
        const results = JSON.parse(localStorage.getItem(TOPIC_EXAM_RESULTS_KEY) || '{}');
        const times = JSON.parse(localStorage.getItem(TOPIC_COMPLETION_TIMES_KEY) || '{}');
        
        const allScores: number[] = Object.values(results).flatMap((topicResults: any) => topicResults.map((r: any) => r.score)) as number[];
        const allTimes: number[] = Object.values(times).flat() as number[];

        const avgScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
        const avgTimeMillis = allTimes.length > 0 ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length : 0;
        
        return { avgScore, avgTimeMillis };
    } catch {
        return { avgScore: 0, avgTimeMillis: 0 };
    }
};

export const getRecentPracticeActivity = (): { date: string, count: number }[] => {
    try {
        const results = JSON.parse(localStorage.getItem(TOPIC_EXAM_RESULTS_KEY) || '{}');
        const activityByDay: Record<string, number> = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayKey = d.toISOString().split('T')[0];
            activityByDay[dayKey] = 0;
        }

        Object.values(results).forEach((topicResults: any) => {
            (topicResults as { score: number; date: string }[]).forEach(result => {
                if (result.date) {
                    const dayKey = result.date.split('T')[0];
                    if (dayKey in activityByDay) {
                        activityByDay[dayKey]++;
                    }
                }
            });
        });

        const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return Object.entries(activityByDay).map(([date, count]) => {
            const d = new Date(date);
            const dayName = weekDays[d.getUTCDay()];
            return { date: dayName, count: count };
        });

    } catch (e) {
        console.error("Failed to get recent practice activity", e);
        return [];
    }
};


export const getTopicAttemptStats = (topicName: string): { attempts: number } => {
    try {
        const results = JSON.parse(localStorage.getItem(TOPIC_EXAM_RESULTS_KEY) || '{}');
        const attemptsForTopic = results[topicName] || [];
        return { attempts: attemptsForTopic.length };
    } catch (e) {
        console.error("Failed to get topic attempt stats", e);
        return { attempts: 0 };
    }
};

// --- LIBRARY FUNCTIONS (delegated to apiDriver) ---

export const libraryGetMaterials = (): Promise<ReviewMaterial[]> => {
    return apiDriver.getLibraryMaterials();
};

export const librarySaveMaterial = (material: Omit<ReviewMaterial, 'id' | 'createdAt'>): Promise<ReviewMaterial> => {
    return apiDriver.saveLibraryMaterial(material);
};

export const libraryDeleteMaterial = (materialId: string): Promise<void> => {
    return apiDriver.deleteLibraryMaterial(materialId);
};
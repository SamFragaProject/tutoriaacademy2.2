import type { ApiDriver } from './';
import type { Subject, Syllabus, MainTopic, SubTopic, AgendaEvent, ReviewMaterial, DashboardInsights, MasteryAnalytics, ExamHistoryEntry, User, DailyMission, SkillRecord } from '../../types';
import * as studentProfileSvc from '../../../services/studentProfile';
import { track } from '../../../services/metrics';
import { BookCopy, Gamepad2, Brain } from 'lucide-react';
import type { Item, ExamBlueprint } from '../../schemas/item';
import type { Flashcard, ReviewOutcome } from '../hooks/srs';


// --- Constants and Mocks (moved from individual services) ---
const SYLLABUS_KEY = 'study:syllabus';
const AGENDA_KEY = 'agenda:events';
const LIBRARY_KEY = 'practice:library';
const USERS_KEY = 'admin:users';
const ITEMS_KEY = 'items:bank';
const BLUEPRINTS_KEY = 'exams:blueprints';

// SRS Constants
const SRS_CARDS_KEY = 'srs:cards';
const SRS_SCHEDULE_KEY = (userId: string) => `srs:schedule:${userId}`;
const SRS_REVIEWS_LOG_KEY = (userId: string) => `srs:reviews:${userId}`;
const SRS_STATS_KEY = (userId: string) => `srs:stats:${userId}`;

interface SRSScheduleItem {
    nextAt: number; // timestamp
    interval: number; // days
    ease: number;
}

const MOCK_TOPICS = {
    'Matemáticas': [
        { id: 'm_algebra', name: 'Álgebra' },
        { id: 'm_geometry', name: 'Geometría' },
        { id: 'm_calculus', name: 'Cálculo' },
    ],
    'Lengua': [
        { id: 'l_grammar', name: 'Gramática' },
        { id: 'l_reading', name: 'Comprensión Lectora' },
    ],
    'Historia': [
        { id: 'h_mexico', name: 'Historia de México' },
        { id: 'h_universal', name: 'Historia Universal' },
    ]
};

const MOCK_ITEMS: Item[] = [
    { id: 'item_1', subjectId: 'Matemáticas', topicId: 'm_algebra', type: 'single', statement: 'Si $$2x+3=7$$, ¿cuál es el valor de x?', choices: [{id:'c1', text:'1', correct:false}, {id:'c2',text:'2', correct:true}, {id:'c3',text:'3', correct:false}, {id:'c4',text:'4', correct:false}], difficulty: 'easy', cognitiveLevel: 'apply', timeExpectedSec: 45, tags: ['ecuaciones'] },
    { id: 'item_2', subjectId: 'Matemáticas', topicId: 'm_algebra', type: 'open', statement: 'Factoriza la expresión $$x^2 - 16$$', answer: '(x-4)(x+4)', difficulty: 'medium', cognitiveLevel: 'apply', timeExpectedSec: 60, tags: ['álgebra', 'factorización'] },
    { id: 'item_3', subjectId: 'Lengua', topicId: 'l_grammar', type: 'single', statement: 'Elige la palabra que está escrita correctamente.', choices: [{id:'c1', text:'Exhorbitante', correct:false}, {id:'c2',text:'Exorbitante', correct:true}], difficulty: 'easy', cognitiveLevel: 'remember', timeExpectedSec: 30, tags: ['ortografía'] },
];

const MOCK_SYLLABUS_DATA: Syllabus = {
    'Matemáticas': [
        { name: 'Fundamentos de Álgebra', subTopics: [ { id: 'm1', name: 'Ecuaciones de primer grado', status: 'available' }, { id: 'm2', name: 'Productos Notables', status: 'locked' }, { id: 'm3', name: 'Factorización', status: 'locked' }, { id: 'm4', name: 'Ecuaciones de segundo grado', status: 'locked' } ] },
        { name: 'Geometría y Trigonometría', subTopics: [ { id: 'm5', name: 'Ángulos y Triángulos', status: 'locked' }, { id: 'm6', name: 'Teorema de Pitágoras', status: 'locked' }, { id: 'm7', name: 'Razones Trigonométricas', status: 'locked' }, { id: 'm8', name: 'Círculo Trigonométrico', status: 'locked' } ] },
        { name: 'Cálculo Diferencial e Integral', subTopics: [ { id: 'm9', name: 'Límites y Continuidad', status: 'locked' }, { id: 'm10', name: 'Definición de la Derivada', status: 'locked' }, { id: 'm11', name: 'Reglas de Derivación', status: 'locked' }, { id: 'm12', name: 'Integrales básicas', status: 'locked' } ] }
    ],
    'Lengua': [
        { name: 'Gramática y Ortografía', subTopics: [ { id: 'l1', name: 'Agudas, graves y esdrújulas', status: 'locked' }, { id: 'l2', name: 'Uso de la coma y punto', status: 'locked' }, { id: 'l3', name: 'Tiempos Verbales (Indicativo)', status: 'locked' }, { id: 'l4', name: 'Uso de Preposiciones', status: 'locked' } ] },
        { name: 'Comprensión Lectora', subTopics: [ { id: 'l5', name: 'Idea Principal y Secundaria', status: 'locked' }, { id: 'l6', name: 'Inferencias y Conclusiones', status: 'locked' }, { id: 'l7', name: 'Análisis de Textos Argumentativos', status: 'locked' }, { id: 'l8', name: 'Tipos de Fichas de Trabajo', status: 'locked' } ] }
    ],
    'Biología': [
        { name: 'Biología Celular', subTopics: [ { id: 'b1', name: 'Teoría Celular', status: 'locked' }, { id: 'b2', name: 'La Célula y sus Organelos', status: 'locked' }, { id: 'b3', name: 'Célula Procariota vs Eucariota', status: 'locked' }, { id: 'b4', name: 'Fotosíntesis y Respiración', status: 'locked' } ] },
        { name: 'Genética y Evolución', subTopics: [ { id: 'b5', name: 'Leyes de Mendel', status: 'locked' }, { id: 'b6', name: 'Estructura del ADN y ARN', status: 'locked' }, { id: 'b7', name: 'Teoría de la Evolución de Darwin', status: 'locked' } ] },
        { name: 'Cuerpo Humano', subTopics: [ { id: 'b8', name: 'Sistema Nervioso', status: 'locked' }, { id: 'b9', name: 'Sistema Circulatorio', status: 'locked' }, { id: 'b10', name: 'Sistema Digestivo', status: 'locked' } ] }
    ],
    'Física': [],
    'Química': [],
    'Historia': [],
};


// --- Helper Functions ---
const get = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  } catch {
    return defaultValue;
  }
};

const set = <T,>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// --- Driver Implementation ---
class LocalDriver implements ApiDriver {
    
    constructor() {
        this.srs.getOrCreateFlashcards();
    }
    
    // --- Syllabus / Plan ---
    async getSyllabus(): Promise<Syllabus> {
        return get(SYLLABUS_KEY, MOCK_SYLLABUS_DATA);
    }

    async getTopicsForSubject(subject: Subject): Promise<MainTopic[]> {
        const syllabus = await this.getSyllabus();
        return syllabus[subject] || [];
    }
    
    async updateTopicStatus(topicId: string, status: SubTopic['status']): Promise<void> {
        const syllabus = await this.getSyllabus();
        let topicFound = false;
        for (const subjectKey in syllabus) {
            const subject = subjectKey as Subject;
            for (const mainTopic of syllabus[subject]) {
                const topicIndex = mainTopic.subTopics.findIndex(t => t.id === topicId);
                if (topicIndex > -1) {
                    mainTopic.subTopics[topicIndex].status = status; topicFound = true; break;
                }
            }
            if (topicFound) break;
        }

        if (status === 'completed' && topicFound) {
            const allSubTopics = (Object.values(syllabus) as MainTopic[][]).flatMap(mainTopics => mainTopics.flatMap(mt => mt.subTopics));
            const completedIndex = allSubTopics.findIndex(t => t.id === topicId);
            if (completedIndex > -1 && completedIndex < allSubTopics.length - 1) {
                const nextTopic = allSubTopics[completedIndex + 1];
                if (nextTopic?.status === 'locked') this.updateTopicStatus(nextTopic.id, 'available');
            }
        }
        
        set(SYLLABUS_KEY, syllabus);
        track('topic_status_updated', { topicId, status });
    }

    async findMainTopicForSubTopic(subTopicName: string): Promise<{ subject: Subject; mainTopic: string } | null> {
        const syllabus = await this.getSyllabus();
        for (const subjectKey of Object.keys(syllabus) as Subject[]) {
            for (const mainTopic of syllabus[subjectKey]) {
                if (mainTopic.subTopics.some(st => st.name === subTopicName)) {
                    return { subject: subjectKey, mainTopic: mainTopic.name };
                }
            }
        }
        return null;
    }

    // --- Library ---
    async getLibraryMaterials(): Promise<ReviewMaterial[]> {
        return get(LIBRARY_KEY, []);
    }

    async saveLibraryMaterial(material: Omit<ReviewMaterial, 'id' | 'createdAt'>): Promise<ReviewMaterial> {
        const materials = await this.getLibraryMaterials();
        const newMaterial: ReviewMaterial = {
            ...material,
            id: `lib-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        materials.unshift(newMaterial);
        set(LIBRARY_KEY, materials);
        track('library_material_saved', { topic: newMaterial.mainTopic });
        this.srs.getOrCreateFlashcards(); // Sync with SRS
        return newMaterial;
    }

    async deleteLibraryMaterial(materialId: string): Promise<void> {
        let materials = await this.getLibraryMaterials();
        materials = materials.filter(m => m.id !== materialId);
        set(LIBRARY_KEY, materials);
        track('library_material_deleted', { materialId });
    }

    // --- Agenda ---
    async getAgenda(): Promise<AgendaEvent[]> {
         const mockAgenda = () => [
            { id: 'a1', dateISO: new Date().toISOString(), subject: 'Matemáticas', subTopic: 'Factorización', type: 'practice', completed: true, icon: 'practice', strategy: 'Práctica intercalada' },
            { id: 'a2', dateISO: new Date().toISOString(), subject: 'Lengua', subTopic: 'Uso de Conectores', type: 'practice', completed: false, icon: 'practice' }
         ];
        return get(AGENDA_KEY, mockAgenda());
    }

    async updateAgendaEvent(eventId: string, updates: Partial<AgendaEvent>): Promise<void> {
        const agenda = await this.getAgenda();
        const eventIndex = agenda.findIndex(e => e.id === eventId);
        if (eventIndex > -1) {
            agenda[eventIndex] = { ...agenda[eventIndex], ...updates };
            set(AGENDA_KEY, agenda);
        }
    }

    async addAgendaEvent(eventData: Omit<AgendaEvent, 'id' | 'completed'>): Promise<void> {
        const agenda = await this.getAgenda();
        const newEvent: AgendaEvent = {
            ...eventData,
            id: `event-${Date.now()}`,
            completed: false,
        };
        agenda.push(newEvent);
        agenda.sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());
        set(AGENDA_KEY, agenda);
    }
    
    // --- Analytics ---
    async getDashboardInsights(userId: string): Promise<DashboardInsights> {
        const profile = studentProfileSvc.getStudentProfile(userId);
        const syllabus = await this.getSyllabus();

        let totalSubTopics = 0;
        let completedSubTopics = 0;
        const subjectsProgress: { name: Subject; progress: number }[] = [];

        (Object.keys(syllabus) as Subject[]).forEach(subject => {
            const mainTopics = syllabus[subject];
            if (mainTopics.length > 0) {
                const allSubTopics = mainTopics.flatMap(mt => mt.subTopics);
                if (allSubTopics.length > 0) {
                    const completed = allSubTopics.filter(st => st.status === 'completed').length;
                    totalSubTopics += allSubTopics.length;
                    completedSubTopics += completed;
                    subjectsProgress.push({ name: subject, progress: (completed / allSubTopics.length) * 100 });
                }
            }
        });

        const topicsMastered = Object.values(profile.skills).filter(s => ((s as Partial<SkillRecord>).accuracy || 0) > 85).length;
        const opportunities = Object.entries(profile.skills)
            .filter(([, skill]) => ((skill as Partial<SkillRecord>).accuracy ?? 100) < 70)
            .sort(([, a], [, b]) => ((a as Partial<SkillRecord>).accuracy ?? 0) - ((b as Partial<SkillRecord>).accuracy ?? 0))
            .slice(0, 3)
            .map(([key, skill]) => {
                const [subjectStr, subTopic] = key.split('_');
                return {
                    area: subTopic.replace(/_/g, ' '),
                    accuracy: (skill as Partial<SkillRecord>).accuracy!,
                    recommendedActions: [
                        { label: 'Aprender', type: 'learn' as const, path: '/app/chat', state: { subTopic } },
                        { label: 'Practicar', type: 'practice' as const, path: '/app/practicas', state: { subTopic } },
                    ]
                };
            });

        const dailyMission: DailyMission = {
            title: "Misión Diaria",
            tasks: [
                { id: 't1', icon: BookCopy, description: 'Completa una sesión de práctica', isCompleted: false, path: '/app/practicas' },
                { id: 't2', icon: Gamepad2, description: 'Juega una partida en el Gimnasio Cognitivo', isCompleted: false, path: '/app/juegos' },
                { id: 't3', icon: Brain, description: 'Usa la autoexplicación en una práctica', isCompleted: false, path: '/app/practicas' }
            ],
            xpBonus: 100
        };

        return {
            progressOverview: {
                totalProgress: totalSubTopics > 0 ? (completedSubTopics / totalSubTopics) * 100 : 0,
                subjects: subjectsProgress.filter(s => s.progress > 0),
            },
            keyInsights: {
                topicsMastered,
                bestDay: 'Miércoles',
                personalizedTip: '¡Sigue así! Enfócate en la práctica de "Factorización" para solidificar tus bases de Álgebra.',
                topicsCompleted: completedSubTopics,
                avgTopicScore: 78,
                avgTopicTime: '12m 30s',
            },
            opportunities,
            dailyMission
        };
    }

    async getMasteryAnalytics(userId: string): Promise<MasteryAnalytics> {
        const profile = studentProfileSvc.getStudentProfile(userId);
        const masteryBySubject = (Object.keys(MOCK_SYLLABUS_DATA) as Subject[])
            .filter(s => MOCK_SYLLABUS_DATA[s].length > 0)
            .map(s => ({
                subject: s,
                mastery: Math.random() * 40 + 50
            }));

        const allSkills = Object.entries(profile.skills);
        const strengths = allSkills.filter(([,s]) => ((s as Partial<SkillRecord>).accuracy ?? 0) > 85).slice(0,3).map(([key, s]) => ({ name: key.split('_')[1].replace(/_/g, ' '), subject: key.split('_')[0] as Subject, mastery: (s as Partial<SkillRecord>).accuracy! }));
        const opportunities = allSkills.filter(([,s]) => ((s as Partial<SkillRecord>).accuracy ?? 100) < 70).slice(0,3).map(([key, s]) => ({ name: key.split('_')[1].replace(/_/g, ' '), subject: key.split('_')[0] as Subject, mastery: (s as Partial<SkillRecord>).accuracy! }));

        return {
            masteryOverTime: [
                { date: '2024-07-01', masteryScore: 780 },
                { date: '2024-07-08', masteryScore: 795 },
                { date: '2024-07-15', masteryScore: 810 },
                { date: '2024-07-22', masteryScore: 820 },
            ],
            masteryBySubject,
            strengths,
            opportunities
        };
    }
    
    async getExamHistory(): Promise<ExamHistoryEntry[]> {
        return [
            { id: 'hist1', date: '15/07/2024', name: 'Diagnóstico de Álgebra', subject: 'Matemáticas', score: 75 },
            { id: 'hist2', date: '18/07/2024', name: 'Simulacro Comprensión Lectora', subject: 'Lengua', score: 82 },
            { id: 'hist3', date: '22/07/2024', name: 'Examen Parcial de Álgebra', subject: 'Matemáticas', score: 88 },
        ];
    }
    
    async getUsers(): Promise<User[]> {
        const MOCK_USERS_INITIAL: User[] = [
            { id: 'user-123', name: 'Estudiante Demo', email: 'alumno@escuela.com', role: 'alumno', schoolId: 'school-01', schoolName: 'Colegio Vanguardia', groupId: 'group-101', groupName: '3er Grado - Grupo A', xp: 1250, accuracy: 88, streak: 12, activeSubjects: 4, tokenSavingMode: false, masteryScore: 820, career: 'unam_area2' },
            { id: 'user-admin-001', name: 'Admin Platform', email: 'admin@tutoria.com', role: 'admin', schoolId: 'platform-wide', schoolName: 'TutoriA Academy HQ', xp: 0, accuracy: 0, streak: 0, activeSubjects: 0, tokenSavingMode: false, masteryScore: 0 },
            { id: 'user-002', name: 'Carlos Gomez', email: 'carlos.g@example.com', role: 'alumno', schoolId: 'school-01', schoolName: 'Colegio Vanguardia', xp: 8500, accuracy: 78, streak: 5, activeSubjects: 3, examDate: '2024-11-20', tokenSavingMode: true, career: 'unam_area1', masteryScore: 780 },
            { id: 'user-003', name: 'Ana Sofia R.', email: 'ana.sofia@example.com', role: 'alumno', schoolId: 'school-01', schoolName: 'Colegio Vanguardia', xp: 14200, accuracy: 92, streak: 25, activeSubjects: 4, examDate: '2024-12-01', tokenSavingMode: false, career: 'unam_area2', masteryScore: 920 },
            { id: 'user-004', name: 'Luis Garcia', email: 'luis.g@example.com', role: 'alumno', schoolId: 'school-01', schoolName: 'Colegio Vanguardia', xp: 3200, accuracy: 65, streak: 2, activeSubjects: 2, examDate: '2025-01-10', tokenSavingMode: false, career: 'ipn_area2', masteryScore: 650 },
        ];
        return get(USERS_KEY, MOCK_USERS_INITIAL);
    }
    
    // --- Item Bank & Exams ---
    items = {
        async list(subjectId?: string): Promise<Item[]> {
            const allItems = get(ITEMS_KEY, MOCK_ITEMS);
            if (!subjectId) return allItems;
            return allItems.filter(item => item.subjectId === subjectId);
        },
        async upsert(item: Item): Promise<Item> {
            const items = await this.list();
            const itemToSave = { ...item };
            const existingIndex = items.findIndex(i => i.id === itemToSave.id);
            if (existingIndex > -1) {
                items[existingIndex] = itemToSave;
            } else {
                itemToSave.id = `item_${Date.now()}`;
                items.push(itemToSave);
            }
            set(ITEMS_KEY, items);
            track('item_edit', { id: itemToSave.id, type: existingIndex > -1 ? 'update' : 'create' });
            return itemToSave;
        },
        async remove(itemId: string): Promise<void> {
            let items = await this.list();
            items = items.filter(i => i.id !== itemId);
            set(ITEMS_KEY, items);
            track('item_remove', { id: itemId });
        }
    };

    exams = {
        async listBlueprints(subjectId: string): Promise<ExamBlueprint[]> {
            const allBlueprints = get<ExamBlueprint[]>(BLUEPRINTS_KEY, []);
            return allBlueprints.filter(bp => bp.subjectId === subjectId);
        },
        async saveBlueprint(blueprint: ExamBlueprint): Promise<ExamBlueprint> {
            const blueprints = get<ExamBlueprint[]>(BLUEPRINTS_KEY, []);
            const bpToSave = { ...blueprint };
            const existingIndex = blueprints.findIndex(b => b.id === bpToSave.id);
            if (existingIndex > -1) {
                blueprints[existingIndex] = bpToSave;
            } else {
                bpToSave.id = `bp_${Date.now()}`;
                blueprints.push(bpToSave);
            }
            set(BLUEPRINTS_KEY, blueprints);
            track('exam_blueprint_save', { id: bpToSave.id, subject: bpToSave.subjectId });
            return bpToSave;
        }
    };
    
    async getTopics(subjectId: string): Promise<{id: string, name: string}[]> {
        return (MOCK_TOPICS as Record<string, {id: string, name: string}[]>)[subjectId] || [];
    }

    // --- SRS ---
    srs = {
        async getOrCreateFlashcards(): Promise<Flashcard[]> {
            let cards = get<Flashcard[]>(SRS_CARDS_KEY, []);
            if (cards.length > 0) return cards;

            // Generate from library if empty
            const materials = get<ReviewMaterial[]>(LIBRARY_KEY, []);
            if (materials.length === 0) { // Add a default material if library is also empty
                 materials.push({
                    id: 'lib-default-1', subject: 'Matemáticas', mainTopic: 'Fundamentos de Álgebra', createdAt: new Date().toISOString(),
                    summary: 'Repaso de ecuaciones lineales y factorización.',
                    flashcards: [
                        { question: '¿Cuál es el primer paso para resolver $$2x+5=11$$?', answer: 'Restar 5 de ambos lados.' },
                        { question: 'Factoriza $$x^2 - 4$$', answer: '$$(x-2)(x+2)$$, es una diferencia de cuadrados.' }
                    ]
                });
                set(LIBRARY_KEY, materials);
            }

            const newCards: Flashcard[] = [];
            materials.forEach(material => {
                material.flashcards.forEach((fc, i) => {
                    newCards.push({
                        id: `${material.id}-fc${i}`,
                        subjectId: material.subject,
                        topicId: material.mainTopic,
                        front: fc.question,
                        back: fc.answer,
                        tags: [material.subject, material.mainTopic]
                    });
                });
            });
            set(SRS_CARDS_KEY, newCards);
            return newCards;
        },

        async getAllFlashcards(userId: string): Promise<Flashcard[]> {
            return await this.getOrCreateFlashcards();
        },
        
        async getDue(userId: string, subjectId?: string): Promise<Flashcard[]> {
            const allCards = await this.getOrCreateFlashcards();
            const schedule = get<Record<string, SRSScheduleItem>>(SRS_SCHEDULE_KEY(userId), {});
            const now = Date.now();

            const dueCards = allCards.filter(card => {
                const cardSchedule = schedule[card.id];
                const isDue = !cardSchedule || cardSchedule.nextAt <= now;
                const subjectMatch = !subjectId || card.subjectId === subjectId;
                return isDue && subjectMatch;
            });
            return dueCards;
        },

        async review(userId: string, cardId: string, outcome: ReviewOutcome): Promise<void> {
            const schedule = get<Record<string, SRSScheduleItem>>(SRS_SCHEDULE_KEY(userId), {});
            const cardSchedule = schedule[cardId] || { nextAt: 0, interval: 1, ease: 2.5 };
            
            const now = Date.now();
            const DAY_MS = 24 * 60 * 60 * 1000;

            switch (outcome) {
                case 'again':
                    cardSchedule.interval = 1;
                    cardSchedule.ease = Math.max(1.3, cardSchedule.ease - 0.2);
                    cardSchedule.nextAt = now + 5 * 60 * 1000; // 5 minutes
                    break;
                case 'hard':
                    cardSchedule.interval = Math.max(1, Math.floor(cardSchedule.interval * 1.2));
                    cardSchedule.ease = Math.max(1.3, cardSchedule.ease - 0.15);
                    cardSchedule.nextAt = now + cardSchedule.interval * DAY_MS;
                    break;
                case 'easy':
                    cardSchedule.interval = Math.max(1, Math.floor(cardSchedule.interval * cardSchedule.ease));
                    cardSchedule.ease = Math.min(2.8, cardSchedule.ease + 0.1);
                    cardSchedule.nextAt = now + cardSchedule.interval * DAY_MS;
                    break;
            }
            
            schedule[cardId] = cardSchedule;
            set(SRS_SCHEDULE_KEY(userId), schedule);
            
            // Log review for stats
            const reviews = get<{cardId: string, timestamp: number}[]>(SRS_REVIEWS_LOG_KEY(userId), []);
            reviews.unshift({ cardId, timestamp: now });
            set(SRS_REVIEWS_LOG_KEY(userId), reviews.slice(0, 500)); // Keep last 500 reviews

            // Update streak
            const stats = get<{lastReviewDate: string, streak: number}>(SRS_STATS_KEY(userId), {lastReviewDate: '', streak: 0});
            const today = new Date(now).toISOString().split('T')[0];
            if (stats.lastReviewDate !== today) {
                const yesterday = new Date(now - DAY_MS).toISOString().split('T')[0];
                stats.streak = stats.lastReviewDate === yesterday ? stats.streak + 1 : 1;
                stats.lastReviewDate = today;
                set(SRS_STATS_KEY(userId), stats);
            }
        },

        async stats(userId: string): Promise<{ weekReviews: number[]; streak: number; totalDue: number; }> {
            const dueCards = await this.getDue(userId);
            const reviews = get<{cardId: string, timestamp: number}[]>(SRS_REVIEWS_LOG_KEY(userId), []);
            const stats = get<{lastReviewDate: string, streak: number}>(SRS_STATS_KEY(userId), {lastReviewDate: '', streak: 0});
            const now = Date.now();

            // Check if streak is broken
            const today = new Date(now).toISOString().split('T')[0];
            const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            if (stats.lastReviewDate < twoDaysAgo) {
                stats.streak = 0;
                set(SRS_STATS_KEY(userId), stats);
            }

            const weekReviews = Array(7).fill(0);
            const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
            reviews.filter(r => r.timestamp >= sevenDaysAgo).forEach(r => {
                const dayIndex = 6 - Math.floor((now - r.timestamp) / (24 * 60 * 60 * 1000));
                if (dayIndex >= 0 && dayIndex < 7) {
                    weekReviews[dayIndex]++;
                }
            });

            return {
                weekReviews,
                streak: stats.streak,
                totalDue: dueCards.length,
            };
        }
    }
}
export const driverLocal = new LocalDriver();
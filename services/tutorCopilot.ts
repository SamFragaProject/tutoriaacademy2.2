import type { TutorCopilotReport, StudentFocusReport, StudentSuggestion, Subject, Reinforcement } from '../types';
import * as studentProfileSvc from './studentProfile';
import * as docSvc from './documents';
import * as agendaSvc from './agenda';
import * as studyTopicsSvc from './studyTopics';
import { BrainCircuit, BookCopy, Calendar, TrendingUp } from 'lucide-react';
import React from 'react';
import { track } from './metrics';


// --- START: REINFORCEMENT SERVICE LOGIC ---
const getReinforcementStorageKey = (userId: string) => `reinforcements:${userId}`;

export const getAssignedReinforcements = (userId: string): Reinforcement[] => {
    if (typeof window === 'undefined') return [];
    try {
        const key = getReinforcementStorageKey(userId);
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveReinforcements = (userId: string, reinforcements: Reinforcement[]): void => {
    if (typeof window === 'undefined') return;
    const key = getReinforcementStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(reinforcements));
};

export const assignReinforcement = (args: {
    teacherName: string;
    studentId: string;
    subject: Subject;
    mainTopic: string;
    note?: string;
}): Reinforcement => {
    const { teacherName, studentId, subject, mainTopic, note } = args;

    const currentReinforcements = getAssignedReinforcements(studentId);
    
    // Avoid duplicate assignments
    const existing = currentReinforcements.find(r => r.mainTopic === mainTopic);
    if (existing) {
        console.warn(`Reinforcement for ${mainTopic} already exists for student ${studentId}.`);
        return existing;
    }

    const newReinforcement: Reinforcement = {
        id: `reinf-${Date.now()}`,
        teacherName,
        subject,
        mainTopic,
        note: note || `He notado que podríamos reforzar un poco el tema de ${mainTopic}. ¡Vamos a darle un repaso juntos!`,
        assignedAt: new Date().toISOString(),
    };
    
    const updatedReinforcements = [newReinforcement, ...currentReinforcements];
    saveReinforcements(studentId, updatedReinforcements);

    track('reinforcement_assigned', { teacherName, studentId, mainTopic });
    
    return newReinforcement;
};

export const completeReinforcement = (userId: string, reinforcementId: string): void => {
    let reinforcements = getAssignedReinforcements(userId);
    const reinforcementToComplete = reinforcements.find(r => r.id === reinforcementId);
    
    if (reinforcementToComplete) {
        reinforcements = reinforcements.filter(r => r.id !== reinforcementId);
        saveReinforcements(userId, reinforcements);
        track('reinforcement_completed', { userId, reinforcementId, mainTopic: reinforcementToComplete.mainTopic });
    }
};
// --- END: REINFORCEMENT SERVICE LOGIC ---


// This is a mock service. In a real app, this would analyze real student data.
export const generateTutorReport = async (): Promise<TutorCopilotReport> => {
    // Simulate API delay for AI generation
    await new Promise(res => setTimeout(res, 1500));

    const studentFocus: StudentFocusReport[] = [
        {
            studentId: "user-123", // Target the demo student
            studentName: "Estudiante Demo",
            performance: "Bajo rendimiento (48%) en el último simulacro de Matemáticas.",
            errorPattern: "Confusión recurrente al resolver ecuaciones de segundo grado por factorización.",
            recommendations: [
                "Asignar la lección interactiva específica sobre 'Factorización'.",
                "Proponer una sesión de práctica guiada con 3 ejercicios de dificultad incremental.",
                "Enviar un mensaje de ánimo y recordarle la importancia de este tema."
            ],
            subject: 'Matemáticas',
            mainTopic: 'Fundamentos de Álgebra'
        },
        {
            studentId: "user-004",
            studentName: "Luis García",
            performance: "Estancamiento en Comprensión Lectora (65-70% en las últimas 3 prácticas).",
            errorPattern: "Dificultad para identificar la idea principal en textos argumentativos complejos.",
            recommendations: [
                "Sugerir el uso de la técnica de resumen y autoexplicación después de cada párrafo.",
                "Asignar el minijuego 'RSVP Gist' para mejorar la velocidad de identificación de ideas clave."
            ],
            subject: 'Lengua',
            mainTopic: 'Comprensión Lectora'
        },
        {
            studentId: "user-003",
            studentName: "Ana Sofia R.",
            performance: "Alto nivel de ansiedad detectado (confianza baja a pesar de respuestas correctas).",
            errorPattern: "Uso excesivo de pistas en el modo de práctica, incluso en temas que domina.",
            recommendations: [
                "Iniciar la próxima sesión con un ejercicio de un tema que domina para construir confianza.",
                "Enviar un recurso sobre técnicas de manejo de la ansiedad ante los exámenes."
            ],
            subject: 'Matemáticas',
            mainTopic: 'Geometría y Trigonometría'
        }
    ];

    const rubricDraft = `
### Rúbrica para Actividad Práctica: "Resolución de Casos de Derecho Administrativo"

| Criterio                     | Nivel 4: Experto (31-40 pts)                                                                  | Nivel 3: Avanzado (21-30 pts)                                                                 | Nivel 2: Intermedio (11-20 pts)                                                             | Nivel 1: Básico (0-10 pts)                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **1. Identificación del Acto** | Identifica con precisión todos los actos administrativos, sus elementos y características.    | Identifica la mayoría de los actos administrativos y sus elementos clave.                     | Identifica algunos actos administrativos, pero con omisiones o errores en sus elementos.    | No logra identificar correctamente los actos administrativos.                             |
| **2. Análisis de Validez**   | Evalúa la validez de cada acto citando correctamente la normativa y jurisprudencia aplicable. | Evalúa la validez de los actos basándose principalmente en la normativa, con alguna omisión. | El análisis de validez es superficial y no se apoya consistentemente en la normativa.       | El análisis de validez es incorrecto o inexistente.                                       |
| **3. Argumentación Jurídica**| Construye una argumentación sólida, coherente y bien estructurada, con lenguaje técnico.    | La argumentación es clara y mayormente coherente, con uso adecuado de la terminología.      | La argumentación es simple, con algunas inconsistencias o uso impreciso de la terminología. | La argumentación es confusa, contradictoria o carece de fundamento jurídico.              |
    `;
    
    return {
        studentFocus,
        rubricDraft
    };
};

// The new function for the student dashboard
export const getStudentSuggestions = async (userId: string): Promise<StudentSuggestion[]> => {
    await new Promise(res => setTimeout(res, 1200)); 

    const suggestions: StudentSuggestion[] = [];
    const profile = studentProfileSvc.getStudentProfile(userId);
    
    // 1. Suggest today's agenda item
    const today = new Date().toISOString().split('T')[0];
    // FIX: Await the promise from getAgenda to ensure 'agenda' is an array.
    const agenda = await agendaSvc.getAgenda();
    const nextEvent = agenda.find(e => e.dateISO.startsWith(today) && !e.completed);
    if (nextEvent) {
        suggestions.push({
            id: 'suggestion-agenda',
            icon: Calendar,
            title: "Tu próximo paso de hoy",
            description: `Según tu agenda, hoy toca: ${nextEvent.subTopic}. ¡La consistencia es clave!`,
            cta: {
                text: "Ir a la Agenda",
                path: '/app/agenda',
            }
        });
    }

    // 2. Suggest reinforcing a weak area
    const weakSkills = Object.entries(profile.skills)
        .filter(([, skill]) => (skill.accuracy ?? 50) < 65)
        .sort(([, a], [, b]) => (a.accuracy ?? 50) - (b.accuracy ?? 50));
    
    if (weakSkills.length > 0 && suggestions.length < 2) {
        const [key, skill] = weakSkills[0];
        const [subjectStr, subTopic] = key.split('_');
        const subTopicClean = subTopic.replace(/_/g, ' ');
        // FIX: Await the promise to resolve before accessing properties.
        const mainTopicInfo = await studyTopicsSvc.findMainTopicForSubTopic(subTopicClean);

        if(mainTopicInfo) {
            suggestions.push({
                id: 'suggestion-weak-skill',
                icon: TrendingUp,
                title: "Oportunidad de Mejora Detectada",
                description: `He notado que tu precisión en "${subTopicClean}" es del ${skill.accuracy?.toFixed(0)}%. ¿Quieres una sesión de tutoría para reforzar este tema?`,
                cta: {
                    text: "Iniciar Tutoría",
                    path: '/app/tutor',
                    state: { startWithTopic: { subject: mainTopicInfo.subject, mainTopic: mainTopicInfo.mainTopic } }
                }
            });
        }
    }

    // 3. Announce new study material
    const allDocs = docSvc.getAllDocuments();
    const newMaterial = allDocs.find(doc => doc.status === 'en_cola'); 
    if (newMaterial && suggestions.length < 2) {
        suggestions.push({
            id: 'suggestion-new-material',
            icon: BookCopy,
            title: "Nuevo Material Disponible",
            description: `Hay una nueva guía sobre "${newMaterial.topic}" (${newMaterial.subject}) lista para ser estudiada. ¡Podría contener información clave para tu examen!`,
            cta: {
                text: "Ver Temario",
                path: `/app/materias/${newMaterial.subject}`,
            }
        });
    }

    // Default suggestion if no other is found
    if (suggestions.length === 0) {
        suggestions.push({
            id: 'suggestion-default',
            icon: BrainCircuit,
            title: "Listo para la siguiente sesión",
            description: "Elige un tema de tu temario y empecemos a estudiar. ¡Cada sesión de estudio te acerca más a tu meta!",
            cta: {
                text: "Ver mis Materias",
                path: '/app/materias',
            }
        });
    }

    return suggestions.slice(0, 2); 
};
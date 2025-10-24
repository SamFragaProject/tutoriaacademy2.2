import type { TutorConfig, TutorId, Subject } from '../types';
import * as docSvc from './documents';

const STORAGE_KEY = 'tutors:configs';

const DEFAULT_CONFIGS: Record<TutorId, TutorConfig> = {
    matematicas: {
        id: 'matematicas',
        name: 'Tutor de Matemáticas',
        subject: 'Matemáticas',
        sourceDocIds: ['doc-mate-1'],
        techniques: {
            socratic: 60,
            hints: 30,
            interleaving: 10,
        },
        difficulty: {
            base: 'medium',
        },
        tone: 'Claro, preciso y motivador. Usa analogías con la tecnología.',
    },
    lengua: {
        id: 'lengua',
        name: 'Tutor de Lengua',
        subject: 'Lengua',
        sourceDocIds: ['doc-leng-1'],
        techniques: {
            socratic: 40,
            hints: 40,
            interleaving: 20,
        },
        difficulty: {
            base: 'medium',
        },
        tone: 'Amigable, encouraging, and gamer-friendly. Explica conceptos como si fueran misiones de un juego.',
    }
};

export const getAllTutorConfigs = (): Record<TutorId, TutorConfig> => {
    if (typeof window === 'undefined') return DEFAULT_CONFIGS;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONFIGS));
            return DEFAULT_CONFIGS;
        }
    } catch {
        return DEFAULT_CONFIGS;
    }
};

export const getTutorConfig = (id: TutorId): TutorConfig => {
    return getAllTutorConfigs()[id];
};

export const saveAllTutorConfigs = (configs: Record<TutorId, TutorConfig>): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
};

export const createTutor = (name: string, subject: Subject): Record<TutorId, TutorConfig> => {
    const allConfigs = getAllTutorConfigs();
    const id = `tutor-${name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;

    const sourceDocIds = docSvc.getAllDocuments()
        .filter(doc => doc.subject === subject && doc.status === 'indexado')
        .map(doc => doc.id);

    const newTutor: TutorConfig = {
        id,
        name,
        subject,
        sourceDocIds,
        techniques: { socratic: 50, hints: 30, interleaving: 20 },
        difficulty: { base: 'medium' },
        tone: 'Amigable y directo.'
    };

    const updatedConfigs = { ...allConfigs, [id]: newTutor };
    saveAllTutorConfigs(updatedConfigs);
    return updatedConfigs;
};
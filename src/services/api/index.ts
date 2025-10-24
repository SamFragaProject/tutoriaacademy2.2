import type { Subject, Syllabus, MainTopic, AgendaEvent, ReviewMaterial, DashboardInsights, MasteryAnalytics, ExamHistoryEntry, User } from '../../types';
import type { Item, ExamBlueprint } from '../../schemas/item';
import type { Flashcard, ReviewOutcome } from '../hooks/srs';

export interface ApiDriver {
    // Syllabus / Plan
    getSyllabus(): Promise<Syllabus>;
    getTopicsForSubject(subject: Subject): Promise<MainTopic[]>;
    updateTopicStatus(topicId: string, status: 'locked' | 'available' | 'completed'): Promise<void>;
    findMainTopicForSubTopic(subTopicName: string): Promise<{ subject: Subject; mainTopic: string } | null>;

    // Library
    getLibraryMaterials(): Promise<ReviewMaterial[]>;
    saveLibraryMaterial(material: Omit<ReviewMaterial, 'id' | 'createdAt'>): Promise<ReviewMaterial>;
    deleteLibraryMaterial(materialId: string): Promise<void>;
    
    // Agenda
    getAgenda(): Promise<AgendaEvent[]>;
    updateAgendaEvent(eventId: string, updates: Partial<AgendaEvent>): Promise<void>;
    addAgendaEvent(eventData: Omit<AgendaEvent, 'id' | 'completed'>): Promise<void>;

    // Analytics
    getDashboardInsights(userId: string): Promise<DashboardInsights>;
    getMasteryAnalytics(userId: string): Promise<MasteryAnalytics>;
    getExamHistory(): Promise<ExamHistoryEntry[]>;

    // Users
    getUsers(): Promise<User[]>;

    // Item Bank
    items: {
        list(subjectId?: string, filters?: any): Promise<Item[]>;
        upsert(item: Item): Promise<Item>;
        remove(itemId: string): Promise<void>;
    };

    // Exams
    exams: {
        listBlueprints(subjectId: string): Promise<ExamBlueprint[]>;
        saveBlueprint(blueprint: ExamBlueprint): Promise<ExamBlueprint>;
    };
    
    // Topics (for editors)
    getTopics(subjectId: string): Promise<{id: string, name: string}[]>;

    // Spaced Repetition System (SRS)
    srs: {
        getAllFlashcards(userId: string): Promise<Flashcard[]>;
        getDue(userId: string, subjectId?: string): Promise<Flashcard[]>;
        review(userId: string, cardId: string, outcome: ReviewOutcome): Promise<void>;
        stats(userId: string): Promise<{ weekReviews: number[]; streak: number; totalDue: number }>;
    };
}

// For this demo, we default to the local driver.
// In a real app, this could be switched based on an environment variable.
// const useHttpDriver = process.env.API_DRIVER === 'http';

import { driverLocal } from './driverLocal';
// import { driverHttp } from './driverHttp';

const apiDriver: ApiDriver = driverLocal; // useHttpDriver ? driverHttp : driverLocal;

export default apiDriver;
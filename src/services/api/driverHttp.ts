import type { ApiDriver } from './';
import type { Subject, Syllabus, MainTopic, AgendaEvent, ReviewMaterial, DashboardInsights, MasteryAnalytics, ExamHistoryEntry, User } from '../../types';
import type { Item, ExamBlueprint } from '../../schemas/item';
import type { Flashcard, ReviewOutcome } from '../hooks/srs';

const API_BASE = '/api/v1'; // Example API base path

class HttpDriver implements ApiDriver {
    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const res = await fetch(`${API_BASE}${endpoint}`, options);
        if (!res.ok) {
            throw new Error(`API request failed: ${res.statusText}`);
        }
        return res.json();
    }

    async getSyllabus(): Promise<Syllabus> {
        return Promise.reject(new Error("HTTP Driver: getSyllabus not implemented."));
    }

    async getTopicsForSubject(subject: Subject): Promise<MainTopic[]> {
        return Promise.reject(new Error("HTTP Driver: getTopicsForSubject not implemented."));
    }

    async updateTopicStatus(topicId: string, status: 'locked' | 'available' | 'completed'): Promise<void> {
        return Promise.reject(new Error("HTTP Driver: updateTopicStatus not implemented."));
    }
    
    async findMainTopicForSubTopic(subTopicName: string): Promise<{ subject: Subject; mainTopic: string } | null> {
         return Promise.reject(new Error("HTTP Driver: findMainTopicForSubTopic not implemented."));
    }

    async getLibraryMaterials(): Promise<ReviewMaterial[]> {
        return Promise.reject(new Error("HTTP Driver: getLibraryMaterials not implemented."));
    }

    async saveLibraryMaterial(material: Omit<ReviewMaterial, 'id' | 'createdAt'>): Promise<ReviewMaterial> {
        return Promise.reject(new Error("HTTP Driver: saveLibraryMaterial not implemented."));
    }

    async deleteLibraryMaterial(materialId: string): Promise<void> {
        return Promise.reject(new Error("HTTP Driver: deleteLibraryMaterial not implemented."));
    }

    async getAgenda(): Promise<AgendaEvent[]> {
        return Promise.reject(new Error("HTTP Driver: getAgenda not implemented."));
    }

    async updateAgendaEvent(eventId: string, updates: Partial<AgendaEvent>): Promise<void> {
        return Promise.reject(new Error("HTTP Driver: updateAgendaEvent not implemented."));
    }

    async addAgendaEvent(eventData: Omit<AgendaEvent, 'id' | 'completed'>): Promise<void> {
        return Promise.reject(new Error("HTTP Driver: addAgendaEvent not implemented."));
    }

    async getDashboardInsights(userId: string): Promise<DashboardInsights> {
        return Promise.reject(new Error("HTTP Driver: getDashboardInsights not implemented."));
    }

    async getMasteryAnalytics(userId: string): Promise<MasteryAnalytics> {
        return Promise.reject(new Error("HTTP Driver: getMasteryAnalytics not implemented."));
    }

    async getExamHistory(): Promise<ExamHistoryEntry[]> {
        return Promise.reject(new Error("HTTP Driver: getExamHistory not implemented."));
    }
    
    async getUsers(): Promise<User[]> {
         return Promise.reject(new Error("HTTP Driver: getUsers not implemented."));
    }

    items = {
        list(subjectId?: string, filters?: any): Promise<Item[]> {
            return Promise.reject(new Error("HTTP Driver: items.list not implemented."));
        },
        upsert(item: Item): Promise<Item> {
            return Promise.reject(new Error("HTTP Driver: items.upsert not implemented."));
        },
        remove(itemId: string): Promise<void> {
            return Promise.reject(new Error("HTTP Driver: items.remove not implemented."));
        }
    };

    exams = {
        listBlueprints(subjectId: string): Promise<ExamBlueprint[]> {
            return Promise.reject(new Error("HTTP Driver: exams.listBlueprints not implemented."));
        },
        saveBlueprint(blueprint: ExamBlueprint): Promise<ExamBlueprint> {
            return Promise.reject(new Error("HTTP Driver: exams.saveBlueprint not implemented."));
        }
    };

    async getTopics(subjectId: string): Promise<{id: string, name: string}[]> {
        return Promise.reject(new Error("HTTP Driver: getTopics not implemented."));
    }

    srs = {
        getAllFlashcards(userId: string): Promise<Flashcard[]> {
            return Promise.reject(new Error("HTTP Driver: srs.getAllFlashcards not implemented."));
        },
        getDue(userId: string, subjectId?: string): Promise<Flashcard[]> {
            return Promise.reject(new Error("HTTP Driver: srs.getDue not implemented."));
        },
        review(userId: string, cardId: string, outcome: ReviewOutcome): Promise<void> {
            return Promise.reject(new Error("HTTP Driver: srs.review not implemented."));
        },
        stats(userId: string): Promise<{ weekReviews: number[]; streak: number; totalDue: number; }> {
            return Promise.reject(new Error("HTTP Driver: srs.stats not implemented."));
        }
    };
}

export const driverHttp = new HttpDriver();
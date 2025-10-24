import type { MasteryAnalytics, ExamHistoryEntry } from '../types';
import apiDriver from '../src/services/api';

export const getAnalytics = (userId: string): Promise<MasteryAnalytics> => {
    return apiDriver.getMasteryAnalytics(userId);
};

export const getExamHistory = (): Promise<ExamHistoryEntry[]> => {
    return apiDriver.getExamHistory();
};
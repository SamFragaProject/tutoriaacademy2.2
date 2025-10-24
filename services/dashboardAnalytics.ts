import type { DashboardInsights } from '../types';
import apiDriver from '../src/services/api';

export const getDashboardInsights = (userId: string): Promise<DashboardInsights> => {
    return apiDriver.getDashboardInsights(userId);
};
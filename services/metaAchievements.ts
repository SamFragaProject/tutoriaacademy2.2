import { META_ACHIEVEMENT_CATALOG } from '../data/metaAchievementsCatalog';
import * as gamSvc from './gamification';
import { getStudentProfile } from './studentProfile';
import { dispatch } from './eventBus';
import type { MetaAchievement, GamificationState, AchievementCategory, Subject, MetaAchievementId } from '../types';

function countAchievementsWithAntiGrind(state: GamificationState, subject: Subject): number {
    const categoryCounts: Record<AchievementCategory, number> = {
        'diagnostic': 0, 'habit': 0, 'mock_exam': 0, 'practice': 0, 'review': 0, 'cognition': 0
    };
    let totalCount = 0;

    Object.values(state.achievements).forEach(ach => {
        if (categoryCounts[ach.category] < 2) {
            categoryCounts[ach.category]++;
            totalCount++;
        }
    });
    return totalCount;
}

export const checkAndUnlockMetaAchievements = () => {
    console.log('Checking for meta-achievements...');
    const gamState = gamSvc.getState();
    const studentProfile = getStudentProfile('user-123'); // Assuming demo user

    let stateChanged = false;

    Object.values(META_ACHIEVEMENT_CATALOG).forEach(collection => {
        collection.achievements.forEach(metaAch => {
            // Skip if already earned
            if (gamState.metaAchievements[metaAch.id]) {
                return;
            }

            // Check requirements
            const { requirements } = metaAch;
            let allMet = true;

            // 1. Base achievements
            const achievementCount = countAchievementsWithAntiGrind(gamState, metaAch.subject);
            if (achievementCount < requirements.baseAchievements) {
                allMet = false;
            }

            // 2. Streak
            if (requirements.minStreak && gamState.streak < requirements.minStreak) {
                allMet = false;
            }

            // 3. Mock exam score
            const lastMock = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('mock:last') || 'null') : null;
            if (requirements.minMockAccuracy && (!lastMock || lastMock.pct < requirements.minMockAccuracy)) {
                allMet = false;
            }
            
            // ... add more requirement checks here as needed based on catalog

            // If all requirements are met, unlock it!
            if (allMet) {
                console.log(`Unlocking meta-achievement: ${metaAch.name}`);
                gamState.metaAchievements[metaAch.id] = { awarded: new Date().toISOString() };
                stateChanged = true;
                
                // Award XP
                gamSvc.addXP(metaAch.xpBonus);
                
                // Dispatch event for UI
                dispatch('meta-achievement-unlocked', metaAch);
            }
        });
    });

    if (stateChanged) {
        gamSvc.setState(gamState);
    }
};

export const getMetaAchievementCatalog = () => META_ACHIEVEMENT_CATALOG;

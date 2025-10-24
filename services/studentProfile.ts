import type { StudentProfile, SkillRecord, Subject } from '../types';
import { track } from './metrics';
import { dispatch } from './eventBus';


const getStorageKey = (userId: string) => `profile:${userId}`;

const getInitialProfile = (userId: string): StudentProfile => ({
    userId,
    skills: {},
    srsData: {},
    learningStyle: 'mixed',
    lastInteraction: {
        matematicas: new Date(0).toISOString(),
        lengua: new Date(0).toISOString(),
    },
    cognitive: {
      autoexplicacionCount: 0,
      autoexplicacionRichCount: 0,
      repasoD10Count: 0,
      practiceHardCount: 0,
      pistasUsadas: 0,
      criticalThinking: 3,
      problemSolving: 3,
    },
    psychoEmotional: {
        motivation: 3,
        stressManagement: 3,
    }
});

export const getStudentProfile = (userId: string): StudentProfile => {
    if (typeof window === 'undefined') return getInitialProfile(userId);
    try {
        const key = getStorageKey(userId);
        const stored = localStorage.getItem(key);
        const baseProfile = getInitialProfile(userId);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Deep merge for nested objects
            parsed.cognitive = { ...baseProfile.cognitive, ...parsed.cognitive };
            parsed.psychoEmotional = { ...baseProfile.psychoEmotional, ...parsed.psychoEmotional };
            parsed.srsData = { ...baseProfile.srsData, ...parsed.srsData };
            return { ...baseProfile, ...parsed };
        }
        return baseProfile;
    } catch {
        return getInitialProfile(userId);
    }
};

export const saveStudentProfile = (profile: StudentProfile): void => {
    if (typeof window === 'undefined') return;
    const key = getStorageKey(profile.userId);
    localStorage.setItem(key, JSON.stringify(profile));
};

const getSkillKey = (subject: Subject, subTopic: string) => `${subject.toLowerCase()}_${subTopic.replace(/\s+/g, '_')}`;

export const getDefaultSkill = (): SkillRecord => ({
    accuracy: 50,
    difficulty: 2.5, // Start at a medium float value
    confidence: 2,
    lastUpdated: new Date().toISOString()
});

export const updateStudentSkill = (
    userId: string,
    subject: Subject,
    subTopic: string,
    update: { 
        isCorrect: boolean;
        questionDifficulty: number;
        confidence?: 1 | 2 | 3 
    }
): void => {
    const profile = getStudentProfile(userId);
    const skillKey = getSkillKey(subject, subTopic);
    const currentSkill = { ...getDefaultSkill(), ...profile.skills[skillKey] };

    // Update accuracy with a simple rolling average (20% weight for new answer)
    const newAccuracy = currentSkill.accuracy * 0.8 + (update.isCorrect ? 100 : 0) * 0.2;

    // Update difficulty based on performance
    let difficultyShift = 0;
    if (update.isCorrect) {
        // Increase difficulty more if a hard question was answered correctly
        difficultyShift = 0.15 + (update.questionDifficulty - currentSkill.difficulty) * 0.05;
    } else {
        // Decrease difficulty more if an easy question was answered incorrectly
        difficultyShift = -0.4 + (update.questionDifficulty - currentSkill.difficulty) * 0.05;
    }
    const newDifficulty = currentSkill.difficulty + difficultyShift;

    const updatedSkill: SkillRecord = {
        ...currentSkill,
        accuracy: Math.max(0, Math.min(100, newAccuracy)),
        difficulty: Math.max(1, Math.min(5, newDifficulty)),
        confidence: update.confidence ?? currentSkill.confidence,
        lastUpdated: new Date().toISOString(),
    };

    profile.skills[skillKey] = updatedSkill;
    saveStudentProfile(profile);

    const delta = updatedSkill.accuracy - currentSkill.accuracy;
    track('skill_update', { 
        userId, 
        subject, 
        subTopic, 
        newAccuracy: updatedSkill.accuracy, 
        newDifficulty: updatedSkill.difficulty, 
        delta, 
        source: 'practice_exam' 
    });
    dispatch('skill_update', { subject, subTopic, delta });
};


export const updateSkillAfterTutorSession = (userId: string, subject: Subject, subTopic: string, sessionResults: any[]): { delta: number } => {
    const profile = getStudentProfile(userId);
    const skillKey = getSkillKey(subject, subTopic);
    const currentSkill = { ...getDefaultSkill(), ...profile.skills[skillKey] };
    
    const exitTicket = sessionResults.find(r => r.step === 'exit_ticket');
    if (!exitTicket) return { delta: 0 };

    const oldAccuracy = currentSkill.accuracy;
    
    // Weighted average: Exit ticket has 70% weight, practice has 30%
    const practice = sessionResults.find(r => r.step === 'practicing');
    let practiceAccuracy = 50; // Assume 50 if no practice
    if (practice && practice.results.length > 0) {
        const correctCount = practice.results.filter((r: any) => r.correct).length;
        practiceAccuracy = (correctCount / practice.results.length) * 100;
    }
    
    const LEARNING_RATE = 0.4;
    const newAccuracy = oldAccuracy * (1 - LEARNING_RATE) + (exitTicket.score * 0.7 + practiceAccuracy * 0.3) * LEARNING_RATE;
    
    // Adjust difficulty: if score > 85, increase difficulty, if < 60, decrease.
    let newDifficulty = currentSkill.difficulty;
    if (exitTicket.score > 85 && newDifficulty < 5) newDifficulty++;
    if (exitTicket.score < 60 && newDifficulty > 1) newDifficulty--;

    // Update average confidence
    const allConfidences = sessionResults.flatMap(r => r.results?.map((pr: any) => pr.confidence) || [r.confidence]).filter(Boolean);
    const avgConfidence = allConfidences.length > 0
        ? allConfidences.reduce((a:number,b:number) => a + b, 0) / allConfidences.length
        : currentSkill.confidence;

    const updatedSkill: SkillRecord = {
        ...currentSkill,
        accuracy: Math.max(0, Math.min(100, newAccuracy)),
        difficulty: newDifficulty,
        confidence: avgConfidence,
        lastUpdated: new Date().toISOString(),
    };

    profile.skills[skillKey] = updatedSkill;
    saveStudentProfile(profile);

    const delta = updatedSkill.accuracy - oldAccuracy;
    track('skill_update', { userId, subTopic, newAccuracy: updatedSkill.accuracy, delta });
    dispatch('skill_update', { subject, subTopic, delta });
    
    return { delta };
};
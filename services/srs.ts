import type { Subject } from '../types';
import * as studentProfileSvc from './studentProfile';
import * as agendaSvc from './agenda';
import { track } from './metrics';

const SRS_INTERVALS_DAYS = [1, 2, 4, 8, 15, 30, 60, 120]; // Spacing intervals

const getTopicId = (subject: Subject, topicName: string) => `${subject.toLowerCase()}_${topicName.replace(/\s+/g, '_')}`;

export const scheduleNextReview = (userId: string, subject: Subject, topicName: string, score: number): void => {
    const profile = studentProfileSvc.getStudentProfile(userId);
    const topicId = getTopicId(subject, topicName);
    
    const srsData = profile.srsData?.[topicId] || { level: 0, lastReviewed: '', due: '', isScheduled: false };
    let newLevel = srsData.level;

    if (score >= 80) {
        newLevel = Math.min(SRS_INTERVALS_DAYS.length - 1, newLevel + 1);
    } else if (score < 60) {
        newLevel = Math.max(0, newLevel - 1);
    }

    const interval = SRS_INTERVALS_DAYS[newLevel];
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + interval);
    
    const updatedSrsData = {
        level: newLevel,
        lastReviewed: today.toISOString(),
        due: dueDate.toISOString(),
        isScheduled: false, // Reset schedule flag for the new due date
    };

    if (!profile.srsData) {
        profile.srsData = {};
    }
    profile.srsData[topicId] = updatedSrsData;
    studentProfileSvc.saveStudentProfile(profile);

    track('srs_scheduled', { userId, topicId, newLevel, score, due: dueDate.toISOString() });
};

export const updateAgendaWithDueReviews = (userId: string): void => {
    const profile = studentProfileSvc.getStudentProfile(userId);
    if (!profile.srsData) return;

    let profileChanged = false;
    const today = new Date();
    // Set to start of day for fair comparison
    today.setHours(0, 0, 0, 0);

    Object.entries(profile.srsData).forEach(([topicId, srsItem]) => {
        const dueDate = new Date(srsItem.due);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate <= today && !srsItem.isScheduled) {
            const [subjectStr, ...topicParts] = topicId.split('_');
            const subject = (subjectStr.charAt(0).toUpperCase() + subjectStr.slice(1)) as Subject;
            const subTopic = topicParts.join(' ');

            agendaSvc.addAgendaEvent({
                dateISO: new Date().toISOString(),
                subject,
                subTopic: `Repaso de ${subTopic}`,
                type: 'review',
                icon: 'review',
                strategy: `Repaso Espaciado (Nivel ${srsItem.level + 1})`,
            });
            
            srsItem.isScheduled = true;
            profileChanged = true;
            track('srs_agenda_added', { userId, topicId });
        }
    });

    if (profileChanged) {
        studentProfileSvc.saveStudentProfile(profile);
    }
};

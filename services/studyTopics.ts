import type { Subject, Syllabus, SubTopic } from '../types';
import apiDriver from '../src/services/api';

export const getSyllabus = (): Promise<Syllabus> => {
    return apiDriver.getSyllabus();
};

export const getTopicsForSubject = (subject: Subject) => {
    return apiDriver.getTopicsForSubject(subject);
};

export const updateTopicStatus = (topicId: string, status: SubTopic['status']): Promise<void> => {
    return apiDriver.updateTopicStatus(topicId, status);
};

export const findMainTopicForSubTopic = (subTopicName: string): Promise<{ subject: Subject; mainTopic: string } | null> => {
    return apiDriver.findMainTopicForSubTopic(subTopicName);
};

export const initializeTopics = (): void => {
    // This logic is now handled by the driver's default/initial state.
    // In a real HTTP driver, this might trigger a user plan creation endpoint.
    console.log("Syllabus initialization is managed by the data driver.");
};
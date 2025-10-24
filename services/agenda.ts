import type { AgendaEvent, Subject } from '../types';
import apiDriver from '../src/services/api';

export const getAgenda = (): Promise<AgendaEvent[]> => {
  return apiDriver.getAgenda();
};

export const updateAgendaEvent = (eventId: string, updates: Partial<AgendaEvent>): Promise<void> => {
  return apiDriver.updateAgendaEvent(eventId, updates);
};

export const addAgendaEvent = (eventData: Omit<AgendaEvent, 'id' | 'completed'>): Promise<void> => {
  return apiDriver.addAgendaEvent(eventData);
};
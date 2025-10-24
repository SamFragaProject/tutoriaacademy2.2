import { MOCK_QS_MATE, MOCK_QS_LENG } from '../data/mockExam';
import * as fairUse from './fairUse';
import { updateStudentSkill } from './studentProfile';
import type { Subject } from '../types';


const API_URL = 'http://localhost:5000/api';
const STORAGE_KEY = 'mock:last';

interface AnswerPayload {
  i: number;
  value: number | null;
  topic: string;
}

interface MockPayload {
  area: string;
  answers: AnswerPayload[];
  elapsedSeconds: number;
}

interface MockResult {
  correct: number;
  pct: number;
  weakTopics: string[];
}

const calculateLocalResults = (payload: MockPayload): MockResult => {
  const qs = payload.area === 'Matemáticas' ? MOCK_QS_MATE : MOCK_QS_LENG;
  let correctCount = 0;
  const topicFrequency: { [key: string]: number } = {};

  const subjectForProfile: Subject = payload.area === 'Matemáticas' ? 'Matemáticas' : 'Lengua';

  payload.answers.forEach((ans) => {
    const question = qs[ans.i];
    const isCorrect = question && ans.value === question.correctIndex;

    if (question) {
      updateStudentSkill('user-123', subjectForProfile, question.topic, {
        isCorrect: !!isCorrect,
        questionDifficulty: 2.5, // Mock exam questions don't have difficulty, assuming average
      });
    }

    if (isCorrect) {
      correctCount++;
    } else {
      if (question) {
        topicFrequency[question.topic] = (topicFrequency[question.topic] || 0) + 1;
      }
    }
  });

  const pct = qs.length > 0 ? Math.round((correctCount / qs.length) * 100) : 0;
  
  const weakTopics = Object.entries(topicFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([topic]) => topic);
  
  return { correct: correctCount, pct, weakTopics };
};

export async function submit(payload: MockPayload): Promise<MockResult> {
  console.log('Submitting mock exam:', payload);
  fairUse.incrementQueryCount();
  try {
    // Backend call is commented out for local-first functionality
    /*
    const response = await fetch(`${API_URL}/mock-exam`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Network error');
    return await response.json();
    */
    await new Promise(res => setTimeout(res, 1000));
    const localResult = calculateLocalResults(payload);
    console.log('Using local fallback for mock exam:', localResult);
    return localResult;
  } catch (error) {
    console.error('Error submitting mock exam, using local fallback:', error);
    return calculateLocalResults(payload);
  }
}

export function saveLocal(result: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  }
}

export function lastLocal(): any | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}
import { DIAG_QS_MATE, DIAG_QS_LENG } from '../data/diagnostic';
import * as fairUse from './fairUse';
import { getStudentProfile, saveStudentProfile, updateStudentSkill } from './studentProfile';
import type { Subject, StudentProfile } from '../types';

const API_URL = 'http://localhost:5000/api'; // Assuming a backend might exist
const STORAGE_KEY = 'diagnostic:last';

interface AnswerPayload {
  i: number;
  correct: boolean;
  topic: string;
}

interface DiagnosticPayload {
  knowledgeAnswers: AnswerPayload[];
  area: 'Matemáticas' | 'Comprensión Lectora';
  learningStyleAnswer: string;
  cognitiveAnswers: Record<string, number>;
  userId: string;
}

interface DiagnosticResult {
  score: number;
  weakTopics: string[];
  profile: StudentProfile;
}

// Fallback function if backend fails or doesn't exist
const calculateLocalResults = (payload: DiagnosticPayload): DiagnosticResult => {
  // 1. Calculate knowledge score and weak topics
  const correctAnswers = payload.knowledgeAnswers.filter(a => a.correct).length;
  const totalAnswered = payload.knowledgeAnswers.length;
  const score = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
  
  const incorrectAnswers = payload.knowledgeAnswers.filter(a => !a.correct);
  const topicFrequency: { [key: string]: number } = {};
  
  incorrectAnswers.forEach(ans => {
    topicFrequency[ans.topic] = (topicFrequency[ans.topic] || 0) + 1;
  });

  const weakTopics = Object.entries(topicFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([topic]) => topic);

  // 2. Generate full student profile
  const profile = getStudentProfile(payload.userId);

  // Map learning style answer to profile type
  const styleMap: Record<string, StudentProfile['learningStyle']> = { A: 'auditory', B: 'visual', C: 'reading', D: 'kinesthetic' };
  profile.learningStyle = styleMap[payload.learningStyleAnswer] || 'mixed';
  
  // Map cognitive answers
  profile.cognitive.criticalThinking = payload.cognitiveAnswers['critical-thinking'];
  profile.cognitive.problemSolving = payload.cognitiveAnswers['problem-solving'];
  profile.psychoEmotional = {
      motivation: payload.cognitiveAnswers['motivation'],
      stressManagement: payload.cognitiveAnswers['stress-management'],
  };

  // 3. Save the new comprehensive profile
  saveStudentProfile(profile);
  
  // 4. Update individual skill records from the knowledge test
  const questions = payload.area === 'Matemáticas' ? DIAG_QS_MATE : DIAG_QS_LENG;
  const subjectForProfile: Subject = payload.area === 'Matemáticas' ? 'Matemáticas' : 'Lengua';
  payload.knowledgeAnswers.forEach(ans => {
    const question = questions[ans.i];
    if (question) {
      updateStudentSkill(payload.userId, subjectForProfile, question.topic, { 
          isCorrect: ans.correct,
          questionDifficulty: 2.5
      });
    }
  });

  return { score, weakTopics, profile };
};

export async function submitDiagnostic(payload: DiagnosticPayload): Promise<DiagnosticResult> {
  console.log('Submitting comprehensive diagnostic:', payload);
  fairUse.incrementQueryCount();
  try {
    // This part is commented out as there is no live backend.
    
    // Simulate network delay and use local fallback
    await new Promise(res => setTimeout(res, 1200));
    const result = calculateLocalResults(payload);
    console.log('Using local fallback result for comprehensive diagnostic.');
    return result;

  } catch (error) {
    console.error('Error submitting diagnostic, using local fallback:', error);
    const result = calculateLocalResults(payload);
    return result;
  }
}

export function saveLocal(result: any): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch (error) {
    console.error('Failed to save diagnostic result to localStorage:', error);
  }
}

export function lastLocal(): any | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to retrieve diagnostic result from localStorage:', error);
    return null;
  }
}
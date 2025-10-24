/**
 * Motor de Adaptación Multimodal
 * Adapta el contenido y la experiencia según el perfil de aprendizaje del estudiante
 */

import * as studentProfileService from './studentProfile';
import type { StudentProfile } from '../types';

// Tipos para el perfil de aprendizaje
export interface LearningModality {
  visual: number;      // 0-100
  auditory: number;
  kinesthetic: number;
  reading: number;
}

export interface CognitiveStyle {
  sequential: number;   // vs. global (0=global, 100=sequential)
  active: number;       // vs. reflective (0=reflective, 100=active)
  sensing: number;      // vs. intuitive (0=intuitive, 100=sensing)
  verbal: number;       // vs. visual (0=visual, 100=verbal)
}

export interface LearningPreferences {
  optimalSessionDuration: number; // minutos
  bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  attentionSpan: number; // minutos antes de necesitar break
  preferredPace: 'slow' | 'medium' | 'fast';
  needsFrequentBreaks: boolean;
  prefersStructure: boolean; // vs. exploración libre
}

export interface ContentAdaptation {
  format: 'text' | 'video' | 'audio' | 'interactive' | 'game' | 'mixed';
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: number; // minutos estimados
  interactivityLevel: 'low' | 'medium' | 'high';
  visualAids: boolean;
  audioSupport: boolean;
  practicalExamples: boolean;
  multipleRepresentations: boolean; // mostrar el mismo concepto de varias formas
}

export interface EmotionalState {
  engagement: number; // 0-100
  frustrationLevel: number; // 0-100
  confidence: number; // 0-100
  motivation: number; // 0-100
  cognitiveLoad: 'low' | 'optimal' | 'overload';
  flowState: boolean; // ¿está en estado de flow?
}

export interface AdaptationRecommendation {
  action: 'continue' | 'increase_difficulty' | 'decrease_difficulty' | 
          'change_modality' | 'take_break' | 'provide_hint' | 'gamify';
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  specificChanges: {
    difficulty?: number;
    format?: ContentAdaptation['format'];
    duration?: number;
    breakDuration?: number;
  };
}

// Storage temporal (migrar a base de datos en producción)
const learningProfiles = new Map<string, {
  modality: LearningModality;
  cognitiveStyle: CognitiveStyle;
  preferences: LearningPreferences;
  history: Array<{
    timestamp: string;
    activity: string;
    performance: number;
    emotionalState: EmotionalState;
  }>;
}>();

/**
 * Detecta la modalidad de aprendizaje preferida del estudiante
 */
export function detectLearningModality(
  studentId: string,
  interactions: Array<{
    type: 'text' | 'video' | 'audio' | 'interactive';
    performanceScore: number; // 0-100
    completionTime: number; // minutos
    engagement: number; // 0-100
  }>
): LearningModality {
  // Agrupar por tipo
  const byType = {
    visual: interactions.filter(i => i.type === 'video' || i.type === 'interactive'),
    auditory: interactions.filter(i => i.type === 'audio'),
    reading: interactions.filter(i => i.type === 'text'),
    kinesthetic: interactions.filter(i => i.type === 'interactive')
  };

  // Calcular scores promedio
  const calculateScore = (items: typeof interactions) => {
    if (items.length === 0) return 50; // neutral
    const avgPerformance = items.reduce((sum, i) => sum + i.performanceScore, 0) / items.length;
    const avgEngagement = items.reduce((sum, i) => sum + i.engagement, 0) / items.length;
    return (avgPerformance * 0.6 + avgEngagement * 0.4); // Peso 60% performance, 40% engagement
  };

  return {
    visual: calculateScore(byType.visual),
    auditory: calculateScore(byType.auditory),
    kinesthetic: calculateScore(byType.kinesthetic),
    reading: calculateScore(byType.reading)
  };
}

/**
 * Analiza el estado emocional basado en patrones de interacción
 */
export function analyzeEmotionalState(
  studentId: string,
  sessionData: {
    responses: Array<{
      isCorrect: boolean;
      timeSpent: number;
      changedAnswer: boolean;
      requestedHelp: boolean;
    }>;
    totalDuration: number;
    abandonedTasks: number;
    pauseFrequency: number; // pausas por minuto
  }
): EmotionalState {
  const { responses, totalDuration, abandonedTasks, pauseFrequency } = sessionData;

  // 1. Calcular engagement
  const avgTimePerResponse = totalDuration / responses.length;
  const hasConsistentPace = responses.every((r, i) => {
    if (i === 0) return true;
    const timeDiff = Math.abs(r.timeSpent - responses[i-1].timeSpent);
    return timeDiff < avgTimePerResponse * 0.5; // Variación menor al 50%
  });
  
  const engagement = Math.max(0, Math.min(100, 
    70 - (abandonedTasks * 10) - (pauseFrequency * 20) + (hasConsistentPace ? 20 : 0)
  ));

  // 2. Calcular frustración
  const recentErrors = responses.slice(-5).filter(r => !r.isCorrect).length;
  const changedAnswers = responses.filter(r => r.changedAnswer).length;
  const helpRequests = responses.filter(r => r.requestedHelp).length;
  
  const frustrationLevel = Math.min(100,
    (recentErrors * 15) + (changedAnswers * 10) + (helpRequests * 5)
  );

  // 3. Calcular confianza
  const correctRate = responses.filter(r => r.isCorrect).length / responses.length * 100;
  const quickCorrectResponses = responses.filter(r => 
    r.isCorrect && r.timeSpent < avgTimePerResponse && !r.changedAnswer
  ).length;
  
  const confidence = Math.min(100, correctRate + (quickCorrectResponses * 5));

  // 4. Calcular motivación
  const completionRate = (responses.length - abandonedTasks) / responses.length * 100;
  const motivation = Math.max(0, Math.min(100,
    completionRate - (pauseFrequency * 10)
  ));

  // 5. Determinar carga cognitiva
  const avgResponseTime = responses.reduce((sum, r) => sum + r.timeSpent, 0) / responses.length;
  const longResponses = responses.filter(r => r.timeSpent > avgResponseTime * 1.5).length;
  const cognitiveLoad: EmotionalState['cognitiveLoad'] = 
    longResponses > responses.length * 0.4 ? 'overload' :
    longResponses > responses.length * 0.2 ? 'optimal' : 'low';

  // 6. Detectar flow state
  const flowState = engagement > 80 && frustrationLevel < 30 && cognitiveLoad === 'optimal';

  return {
    engagement,
    frustrationLevel,
    confidence,
    motivation,
    cognitiveLoad,
    flowState
  };
}

/**
 * Genera recomendaciones de adaptación basadas en el estado actual
 */
export function generateAdaptationRecommendations(
  emotionalState: EmotionalState,
  currentDifficulty: number,
  sessionDuration: number
): AdaptationRecommendation[] {
  const recommendations: AdaptationRecommendation[] = [];

  // 1. Si hay frustración alta
  if (emotionalState.frustrationLevel > 70) {
    recommendations.push({
      action: 'decrease_difficulty',
      reason: 'Nivel de frustración elevado - reducir dificultad temporalmente',
      urgency: 'high',
      specificChanges: {
        difficulty: Math.max(1, currentDifficulty - 1)
      }
    });

    recommendations.push({
      action: 'provide_hint',
      reason: 'Ofrecer pistas para reducir frustración',
      urgency: 'high',
      specificChanges: {}
    });
  }

  // 2. Si hay aburrimiento (engagement bajo pero sin frustración)
  if (emotionalState.engagement < 40 && emotionalState.frustrationLevel < 30) {
    recommendations.push({
      action: 'increase_difficulty',
      reason: 'Engagement bajo - el contenido podría ser demasiado fácil',
      urgency: 'medium',
      specificChanges: {
        difficulty: Math.min(5, currentDifficulty + 1)
      }
    });

    recommendations.push({
      action: 'gamify',
      reason: 'Agregar elementos de gamificación para aumentar engagement',
      urgency: 'medium',
      specificChanges: {}
    });
  }

  // 3. Si está en flow state
  if (emotionalState.flowState) {
    recommendations.push({
      action: 'continue',
      reason: 'Estado de flow detectado - mantener el ritmo actual',
      urgency: 'low',
      specificChanges: {}
    });
  }

  // 4. Si hay sobrecarga cognitiva
  if (emotionalState.cognitiveLoad === 'overload') {
    recommendations.push({
      action: 'take_break',
      reason: 'Sobrecarga cognitiva detectada - break recomendado',
      urgency: 'high',
      specificChanges: {
        breakDuration: 5 // minutos
      }
    });

    recommendations.push({
      action: 'change_modality',
      reason: 'Cambiar formato de contenido para reducir carga cognitiva',
      urgency: 'medium',
      specificChanges: {
        format: 'interactive' // Más interactivo = menos carga
      }
    });
  }

  // 5. Si la sesión es muy larga
  if (sessionDuration > 45) {
    recommendations.push({
      action: 'take_break',
      reason: 'Sesión prolongada - break para mantener efectividad',
      urgency: 'medium',
      specificChanges: {
        breakDuration: 10
      }
    });
  }

  // 6. Si la confianza está baja pero no hay frustración
  if (emotionalState.confidence < 40 && emotionalState.frustrationLevel < 50) {
    recommendations.push({
      action: 'decrease_difficulty',
      reason: 'Construir confianza con ejercicios más accesibles',
      urgency: 'medium',
      specificChanges: {
        difficulty: Math.max(1, currentDifficulty - 1)
      }
    });
  }

  // Ordenar por urgencia
  return recommendations.sort((a, b) => {
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });
}

/**
 * Adapta el contenido según la modalidad preferida
 */
export function adaptContentForModality(
  modality: LearningModality,
  baseContent: {
    topic: string;
    difficulty: number;
  }
): ContentAdaptation {
  // Encontrar modalidad dominante
  const dominant = Object.entries(modality).reduce((a, b) => 
    modality[a[0] as keyof LearningModality] > modality[b[0] as keyof LearningModality] ? a : b
  )[0] as keyof LearningModality;

  let format: ContentAdaptation['format'];
  let visualAids = false;
  let audioSupport = false;
  let multipleRepresentations = false;

  switch (dominant) {
    case 'visual':
      format = modality.kinesthetic > 60 ? 'interactive' : 'video';
      visualAids = true;
      multipleRepresentations = true;
      break;
    case 'auditory':
      format = 'audio';
      audioSupport = true;
      break;
    case 'kinesthetic':
      format = 'interactive';
      visualAids = true;
      multipleRepresentations = true;
      break;
    case 'reading':
      format = 'text';
      visualAids = modality.visual > 50;
      break;
    default:
      format = 'mixed';
      visualAids = true;
      audioSupport = true;
      multipleRepresentations = true;
  }

  // Si las modalidades están balanceadas, usar mixed
  const maxModalityScore = Math.max(...Object.values(modality));
  const modalitiesAbove60 = Object.values(modality).filter(v => v > 60).length;
  
  if (modalitiesAbove60 >= 2 || maxModalityScore < 70) {
    format = 'mixed';
    visualAids = true;
    audioSupport = true;
    multipleRepresentations = true;
  }

  return {
    format,
    difficulty: baseContent.difficulty as ContentAdaptation['difficulty'],
    duration: 15, // Por defecto 15 minutos
    interactivityLevel: modality.kinesthetic > 60 ? 'high' : 
                       modality.kinesthetic > 40 ? 'medium' : 'low',
    visualAids,
    audioSupport,
    practicalExamples: modality.kinesthetic > 50,
    multipleRepresentations
  };
}

/**
 * Obtiene el perfil completo de aprendizaje de un estudiante
 */
export function getLearningProfile(studentId: string): {
  modality: LearningModality;
  cognitiveStyle: CognitiveStyle;
  preferences: LearningPreferences;
} | null {
  return learningProfiles.get(studentId) || null;
}

/**
 * Actualiza el perfil de aprendizaje con nueva información
 */
export function updateLearningProfile(
  studentId: string,
  updates: Partial<{
    modality: Partial<LearningModality>;
    cognitiveStyle: Partial<CognitiveStyle>;
    preferences: Partial<LearningPreferences>;
  }>
): void {
  const current = learningProfiles.get(studentId) || {
    modality: { visual: 50, auditory: 50, kinesthetic: 50, reading: 50 },
    cognitiveStyle: { sequential: 50, active: 50, sensing: 50, verbal: 50 },
    preferences: {
      optimalSessionDuration: 30,
      bestTimeOfDay: 'afternoon',
      attentionSpan: 20,
      preferredPace: 'medium',
      needsFrequentBreaks: false,
      prefersStructure: true
    },
    history: []
  };

  if (updates.modality) {
    current.modality = { ...current.modality, ...updates.modality };
  }
  if (updates.cognitiveStyle) {
    current.cognitiveStyle = { ...current.cognitiveStyle, ...updates.cognitiveStyle };
  }
  if (updates.preferences) {
    current.preferences = { ...current.preferences, ...updates.preferences };
  }

  learningProfiles.set(studentId, current);
}

/**
 * Registra una sesión de aprendizaje en el historial
 */
export function logLearningSession(
  studentId: string,
  session: {
    activity: string;
    performance: number;
    emotionalState: EmotionalState;
  }
): void {
  const profile = learningProfiles.get(studentId);
  if (profile) {
    profile.history.push({
      timestamp: new Date().toISOString(),
      ...session
    });

    // Mantener solo las últimas 50 sesiones
    if (profile.history.length > 50) {
      profile.history = profile.history.slice(-50);
    }

    learningProfiles.set(studentId, profile);
  }
}

/**
 * Inicializa perfiles mock para desarrollo
 */
export function initializeMockProfiles(): void {
  // Perfil 1: Estudiante visual-kinestésico
  learningProfiles.set('student-1', {
    modality: { visual: 85, auditory: 40, kinesthetic: 75, reading: 50 },
    cognitiveStyle: { sequential: 60, active: 80, sensing: 70, verbal: 40 },
    preferences: {
      optimalSessionDuration: 25,
      bestTimeOfDay: 'afternoon',
      attentionSpan: 18,
      preferredPace: 'fast',
      needsFrequentBreaks: true,
      prefersStructure: false
    },
    history: []
  });

  // Perfil 2: Estudiante auditivo-lectura
  learningProfiles.set('student-2', {
    modality: { visual: 45, auditory: 80, kinesthetic: 35, reading: 85 },
    cognitiveStyle: { sequential: 75, active: 40, sensing: 50, verbal: 80 },
    preferences: {
      optimalSessionDuration: 40,
      bestTimeOfDay: 'morning',
      attentionSpan: 30,
      preferredPace: 'medium',
      needsFrequentBreaks: false,
      prefersStructure: true
    },
    history: []
  });

  console.log('Adaptive learning profiles initialized');
}

// Exportar funciones de utilidad
export function getModalityName(modality: LearningModality): string {
  const dominant = Object.entries(modality).reduce((a, b) => 
    modality[a[0] as keyof LearningModality] > modality[b[0] as keyof LearningModality] ? a : b
  )[0];

  const names = {
    visual: 'Visual',
    auditory: 'Auditivo',
    kinesthetic: 'Kinestésico',
    reading: 'Lectura/Escritura'
  };

  return names[dominant as keyof typeof names];
}

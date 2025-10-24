/**
 * Sistema de Análisis Emocional y Engagement
 * Detecta estados emocionales y ajusta la experiencia en tiempo real
 */

import type { EmotionalState } from './adaptiveLearning';

export interface InteractionPattern {
  timestamp: string;
  action: 'answer' | 'pause' | 'help_request' | 'skip' | 'retry' | 'abandon';
  duration: number; // milisegundos
  metadata?: Record<string, any>;
}

export interface EmotionalTrend {
  timeRange: string; // e.g. "last_10_minutes"
  engagement: { current: number; trend: 'up' | 'down' | 'stable' };
  frustration: { current: number; trend: 'up' | 'down' | 'stable' };
  confidence: { current: number; trend: 'up' | 'down' | 'stable' };
}

export interface AutoIntervention {
  trigger: 'high_frustration' | 'low_engagement' | 'cognitive_overload' | 'long_session';
  action: 'suggest_break' | 'reduce_difficulty' | 'provide_encouragement' | 
          'change_activity' | 'offer_hint' | 'celebrate_progress';
  message: string;
  priority: 'low' | 'medium' | 'high';
}

// Storage temporal
const emotionalHistory = new Map<string, EmotionalState[]>();
const interventionLog = new Map<string, AutoIntervention[]>();

/**
 * Detecta patrones emocionales en tiempo real
 */
export function detectEmotionalPatterns(
  studentId: string,
  recentInteractions: InteractionPattern[]
): {
  patterns: string[];
  concerns: string[];
  strengths: string[];
} {
  const patterns: string[] = [];
  const concerns: string[] = [];
  const strengths: string[] = [];

  // 1. Analizar frecuencia de pausas
  const pauses = recentInteractions.filter(i => i.action === 'pause');
  if (pauses.length > recentInteractions.length * 0.3) {
    patterns.push('Frecuentes pausas - posible distracción o fatiga');
    concerns.push('Alta frecuencia de pausas');
  }

  // 2. Analizar solicitudes de ayuda
  const helpRequests = recentInteractions.filter(i => i.action === 'help_request');
  if (helpRequests.length > 5) {
    patterns.push('Múltiples solicitudes de ayuda - posible frustración');
    concerns.push('Necesita apoyo adicional');
  } else if (helpRequests.length === 0 && recentInteractions.length > 10) {
    strengths.push('Autónomo - no requiere ayuda externa');
  }

  // 3. Analizar intentos y reintentos
  const retries = recentInteractions.filter(i => i.action === 'retry');
  if (retries.length > 3) {
    patterns.push('Persistencia alta - reintenta cuando falla');
    strengths.push('Muestra persistencia y determinación');
  }

  // 4. Analizar abandonos
  const abandons = recentInteractions.filter(i => i.action === 'abandon');
  if (abandons.length > 2) {
    patterns.push('Abandona tareas frecuentemente - posible frustración o aburrimiento');
    concerns.push('Baja tasa de finalización');
  }

  // 5. Analizar velocidad de respuesta
  const answers = recentInteractions.filter(i => i.action === 'answer');
  if (answers.length > 0) {
    const avgDuration = answers.reduce((sum, a) => sum + a.duration, 0) / answers.length;
    if (avgDuration < 3000) { // menos de 3 segundos
      patterns.push('Respuestas muy rápidas - posible impulsividad o facilidad excesiva');
    } else if (avgDuration > 60000) { // más de 1 minuto
      patterns.push('Respuestas muy lentas - posible dificultad o sobrecarga cognitiva');
      concerns.push('Tiempo de respuesta elevado');
    } else {
      strengths.push('Ritmo de respuesta apropiado');
    }
  }

  return { patterns, concerns, strengths };
}

/**
 * Calcula tendencias emocionales a lo largo del tiempo
 */
export function calculateEmotionalTrends(
  studentId: string,
  history: EmotionalState[]
): EmotionalTrend {
  if (history.length < 2) {
    return {
      timeRange: 'insufficient_data',
      engagement: { current: 50, trend: 'stable' },
      frustration: { current: 50, trend: 'stable' },
      confidence: { current: 50, trend: 'stable' }
    };
  }

  const recent = history.slice(-5); // últimos 5 estados
  const older = history.slice(-10, -5); // 5 anteriores a esos

  const getTrend = (recentValues: number[], olderValues: number[]): 'up' | 'down' | 'stable' => {
    const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const olderAvg = olderValues.reduce((a, b) => a + b, 0) / olderValues.length;
    const diff = recentAvg - olderAvg;
    
    if (Math.abs(diff) < 10) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  return {
    timeRange: 'last_10_datapoints',
    engagement: {
      current: recent[recent.length - 1].engagement,
      trend: getTrend(
        recent.map(s => s.engagement),
        older.map(s => s.engagement)
      )
    },
    frustration: {
      current: recent[recent.length - 1].frustrationLevel,
      trend: getTrend(
        recent.map(s => s.frustrationLevel),
        older.map(s => s.frustrationLevel)
      )
    },
    confidence: {
      current: recent[recent.length - 1].confidence,
      trend: getTrend(
        recent.map(s => s.confidence),
        older.map(s => s.confidence)
      )
    }
  };
}

/**
 * Genera intervenciones automáticas basadas en el estado emocional
 */
export function generateAutoInterventions(
  emotionalState: EmotionalState,
  sessionDuration: number,
  trends: EmotionalTrend
): AutoIntervention[] {
  const interventions: AutoIntervention[] = [];

  // 1. Frustración alta y creciente
  if (emotionalState.frustrationLevel > 70 && trends.frustration.trend === 'up') {
    interventions.push({
      trigger: 'high_frustration',
      action: 'suggest_break',
      message: '💭 Parece que esto está siendo difícil. ¿Qué tal si tomas un break de 5 minutos?',
      priority: 'high'
    });

    interventions.push({
      trigger: 'high_frustration',
      action: 'reduce_difficulty',
      message: '💡 Veo que este tema es complejo. Te propongo empezar con algo más sencillo para construir confianza.',
      priority: 'high'
    });

    interventions.push({
      trigger: 'high_frustration',
      action: 'offer_hint',
      message: '🎯 ¿Necesitas una pista para avanzar?',
      priority: 'medium'
    });
  }

  // 2. Engagement bajo
  if (emotionalState.engagement < 40 && trends.engagement.trend === 'down') {
    interventions.push({
      trigger: 'low_engagement',
      action: 'change_activity',
      message: '🎮 ¿Qué tal si probamos algo diferente? Tengo un mini-juego que te puede interesar.',
      priority: 'high'
    });

    interventions.push({
      trigger: 'low_engagement',
      action: 'celebrate_progress',
      message: '⭐ ¡Hey! Ya completaste el 60% de esta sección. ¡Vas muy bien!',
      priority: 'medium'
    });
  }

  // 3. Sobrecarga cognitiva
  if (emotionalState.cognitiveLoad === 'overload') {
    interventions.push({
      trigger: 'cognitive_overload',
      action: 'suggest_break',
      message: '🧠 Tu cerebro está trabajando mucho. Un break de 10 minutos puede ayudarte a consolidar lo aprendido.',
      priority: 'high'
    });

    interventions.push({
      trigger: 'cognitive_overload',
      action: 'reduce_difficulty',
      message: '📉 Vamos a reducir un poco la complejidad para que puedas procesar mejor la información.',
      priority: 'medium'
    });
  }

  // 4. Sesión muy larga
  if (sessionDuration > 50) {
    interventions.push({
      trigger: 'long_session',
      action: 'suggest_break',
      message: '⏰ Llevas más de 50 minutos estudiando. ¡Es tiempo de un descanso merecido!',
      priority: 'medium'
    });
  }

  // 5. Confianza baja pero sin frustración (oportunidad de animar)
  if (emotionalState.confidence < 40 && emotionalState.frustrationLevel < 50) {
    interventions.push({
      trigger: 'high_frustration', // reusing trigger
      action: 'provide_encouragement',
      message: '💪 Recuerda: cada error es una oportunidad para aprender. ¡Tú puedes!',
      priority: 'low'
    });
  }

  // 6. Estado de flow (celebrar pero no interrumpir)
  if (emotionalState.flowState) {
    interventions.push({
      trigger: 'low_engagement', // reusing trigger
      action: 'celebrate_progress',
      message: '🔥 ¡Estás en racha! Sigue así.',
      priority: 'low'
    });
  }

  // Ordenar por prioridad
  return interventions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Registra el estado emocional en el historial
 */
export function logEmotionalState(studentId: string, state: EmotionalState): void {
  const history = emotionalHistory.get(studentId) || [];
  history.push(state);
  
  // Mantener solo los últimos 100 estados
  if (history.length > 100) {
    history.shift();
  }
  
  emotionalHistory.set(studentId, history);
}

/**
 * Obtiene el historial emocional de un estudiante
 */
export function getEmotionalHistory(studentId: string): EmotionalState[] {
  return emotionalHistory.get(studentId) || [];
}

/**
 * Registra una intervención ejecutada
 */
export function logIntervention(studentId: string, intervention: AutoIntervention): void {
  const log = interventionLog.get(studentId) || [];
  log.push(intervention);
  
  // Mantener solo las últimas 50 intervenciones
  if (log.length > 50) {
    log.shift();
  }
  
  interventionLog.set(studentId, log);
}

/**
 * Obtiene el log de intervenciones de un estudiante
 */
export function getInterventionLog(studentId: string): AutoIntervention[] {
  return interventionLog.get(studentId) || [];
}

/**
 * Genera un reporte de bienestar emocional para profesores
 */
export function generateWellbeingReport(studentId: string): {
  overall: 'excellent' | 'good' | 'concerning' | 'critical';
  metrics: {
    avgEngagement: number;
    avgFrustration: number;
    avgConfidence: number;
    flowStatePercentage: number;
  };
  recommendations: string[];
  alerts: string[];
} {
  const history = getEmotionalHistory(studentId);
  
  if (history.length === 0) {
    return {
      overall: 'good',
      metrics: { avgEngagement: 50, avgFrustration: 50, avgConfidence: 50, flowStatePercentage: 0 },
      recommendations: ['Recopilar más datos de interacción'],
      alerts: []
    };
  }

  const metrics = {
    avgEngagement: history.reduce((sum, s) => sum + s.engagement, 0) / history.length,
    avgFrustration: history.reduce((sum, s) => sum + s.frustrationLevel, 0) / history.length,
    avgConfidence: history.reduce((sum, s) => sum + s.confidence, 0) / history.length,
    flowStatePercentage: (history.filter(s => s.flowState).length / history.length) * 100
  };

  const recommendations: string[] = [];
  const alerts: string[] = [];

  // Determinar estado general
  let overall: 'excellent' | 'good' | 'concerning' | 'critical';
  
  if (metrics.avgEngagement > 70 && metrics.avgFrustration < 30 && metrics.avgConfidence > 60) {
    overall = 'excellent';
    recommendations.push('Mantener el nivel actual de dificultad');
    recommendations.push('Considerar material de enriquecimiento');
  } else if (metrics.avgFrustration > 60 || metrics.avgConfidence < 30) {
    overall = metrics.avgFrustration > 80 ? 'critical' : 'concerning';
    alerts.push('Nivel de frustración elevado - intervención recomendada');
    recommendations.push('Revisar dificultad del material');
    recommendations.push('Proporcionar apoyo adicional individualizado');
    if (metrics.avgConfidence < 30) {
      alerts.push('Confianza muy baja - puede afectar rendimiento');
      recommendations.push('Trabajar en construcción de confianza con éxitos pequeños');
    }
  } else {
    overall = 'good';
    recommendations.push('Continuar monitoreando progreso');
  }

  if (metrics.flowStatePercentage < 10) {
    recommendations.push('Buscar oportunidades para facilitar estado de flow');
  }

  return { overall, metrics, recommendations, alerts };
}

/**
 * Exporta métricas emocionales para analytics
 */
export function exportEmotionalMetrics(studentId: string): {
  studentId: string;
  totalSessions: number;
  avgSessionEngagement: number;
  highFrustrationEpisodes: number;
  lowEngagementEpisodes: number;
  flowStateSessions: number;
  interventionsTriggered: number;
} {
  const history = getEmotionalHistory(studentId);
  const interventions = getInterventionLog(studentId);

  return {
    studentId,
    totalSessions: history.length,
    avgSessionEngagement: history.reduce((sum, s) => sum + s.engagement, 0) / (history.length || 1),
    highFrustrationEpisodes: history.filter(s => s.frustrationLevel > 70).length,
    lowEngagementEpisodes: history.filter(s => s.engagement < 40).length,
    flowStateSessions: history.filter(s => s.flowState).length,
    interventionsTriggered: interventions.length
  };
}

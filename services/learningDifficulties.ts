/**
 * Sistema de Detección de Dificultades de Aprendizaje
 * Detecta patrones que podrían indicar dislexia, discalculia, disgrafía, TDAH, etc.
 */

import type {
  LearningDifficultyType,
  ScreeningTest,
  ScreeningAlert,
  ScreeningIndicator,
  DyslexiaIndicators,
  DyscalculiaIndicators,
  DysgraphiaIndicators,
  ADHDIndicators,
  AlertLevel,
  Accommodation
} from '../types';

// Placeholder - In production, use a database
const screeningTests: Map<string, ScreeningTest[]> = new Map();
const screeningAlerts: Map<string, ScreeningAlert[]> = new Map();
const accommodations: Map<string, Accommodation[]> = new Map();

/**
 * Calcula el score de riesgo de dislexia
 */
export function calculateDyslexiaRisk(studentId: string, indicators: DyslexiaIndicators): ScreeningTest {
  let score = 0;
  let confidence = 0;
  const detectedIndicators: ScreeningIndicator[] = [];

  // Análisis de confusión de letras (peso: 25%)
  const totalLetterConfusions = Object.values(indicators.letterConfusion).reduce((a, b) => a + b, 0);
  if (totalLetterConfusions > 10) {
    score += 25;
    detectedIndicators.push({
      pattern: 'Confusión frecuente de letras similares (b/d, p/q, m/n)',
      severity: totalLetterConfusions > 20 ? 'high' : totalLetterConfusions > 15 ? 'medium' : 'low',
      frequency: totalLetterConfusions,
      examples: Object.entries(indicators.letterConfusion)
        .filter(([_, count]) => count > 0)
        .map(([pair, count]) => `${pair}: ${count} veces`),
      timestamp: new Date().toISOString()
    });
  }

  // Análisis de velocidad de lectura (peso: 30%)
  if (indicators.readingSpeed.percentile < 20) {
    score += 30;
    detectedIndicators.push({
      pattern: 'Velocidad de lectura significativamente por debajo del promedio',
      severity: indicators.readingSpeed.percentile < 10 ? 'high' : 'medium',
      frequency: 1,
      examples: [
        `${indicators.readingSpeed.wordsPerMinute} ppm (esperado: ${indicators.readingSpeed.expectedForGrade})`,
        `Percentil: ${indicators.readingSpeed.percentile}`
      ],
      timestamp: new Date().toISOString()
    });
  }

  // Análisis de errores ortográficos (peso: 25%)
  if (indicators.spellingErrors.phoneticErrors > 10) {
    score += 25;
    detectedIndicators.push({
      pattern: 'Errores ortográficos de tipo fonético',
      severity: indicators.spellingErrors.phoneticErrors > 20 ? 'high' : 'medium',
      frequency: indicators.spellingErrors.phoneticErrors,
      examples: ['Escritura fonética: "kasa" en lugar de "casa"'],
      timestamp: new Date().toISOString()
    });
  }

  // Análisis de inversión de sílabas (peso: 20%)
  if (indicators.syllableReversal.frequency > 5) {
    score += 20;
    detectedIndicators.push({
      pattern: 'Inversión de sílabas al escribir',
      severity: indicators.syllableReversal.frequency > 10 ? 'high' : 'medium',
      frequency: indicators.syllableReversal.frequency,
      examples: indicators.syllableReversal.examples,
      timestamp: new Date().toISOString()
    });
  }

  // Calcular confianza basado en cantidad de datos
  confidence = Math.min(100, detectedIndicators.length * 20 + 20);

  const likelihood = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
  const alertLevel: AlertLevel = score > 70 ? 'red' : score > 50 ? 'orange' : score > 30 ? 'yellow' : 'green';

  const recommendations = generateDyslexiaRecommendations(score, indicators);

  return {
    id: `dys-${studentId}-${Date.now()}`,
    studentId,
    type: 'dyslexia',
    score,
    confidence,
    likelihood,
    indicators: detectedIndicators,
    recommendations,
    testDate: new Date().toISOString(),
    alertLevel
  };
}

function generateDyslexiaRecommendations(score: number, indicators: DyslexiaIndicators): string[] {
  const recommendations: string[] = [];

  if (score > 70) {
    recommendations.push('Derivar a especialista en dislexia para evaluación completa');
    recommendations.push('Considerar evaluación psicopedagógica formal');
  }

  recommendations.push('Usar fuente OpenDyslexic o fuentes sans-serif grandes');
  recommendations.push('Aumentar espaciado entre líneas y palabras');
  recommendations.push('Habilitar lector de pantalla (Text-to-Speech)');
  
  if (indicators.readingSpeed.percentile < 20) {
    recommendations.push('Proporcionar 50% más de tiempo en evaluaciones');
    recommendations.push('Dividir lecturas largas en secciones más pequeñas');
  }

  recommendations.push('Usar códigos de color para resaltar información importante');
  recommendations.push('Permitir respuestas orales en lugar de escritas cuando sea posible');
  recommendations.push('Proporcionar material de apoyo visual');

  return recommendations;
}

/**
 * Calcula el score de riesgo de discalculia
 */
export function calculateDyscalculiaRisk(studentId: string, indicators: DyscalculiaIndicators): ScreeningTest {
  let score = 0;
  const detectedIndicators: ScreeningIndicator[] = [];

  // Análisis de operaciones básicas (peso: 30%)
  const avgErrors = [
    indicators.basicOperations.addition.errors,
    indicators.basicOperations.subtraction.errors,
    indicators.basicOperations.multiplication.errors,
    indicators.basicOperations.division.errors
  ].reduce((a, b) => a + b, 0) / 4;

  if (avgErrors > 5) {
    score += 30;
    detectedIndicators.push({
      pattern: 'Dificultad persistente con operaciones básicas',
      severity: avgErrors > 10 ? 'high' : 'medium',
      frequency: Math.round(avgErrors),
      examples: [
        `Suma: ${indicators.basicOperations.addition.errors} errores`,
        `Resta: ${indicators.basicOperations.subtraction.errors} errores`,
        `Multiplicación: ${indicators.basicOperations.multiplication.errors} errores`,
        `División: ${indicators.basicOperations.division.errors} errores`
      ],
      timestamp: new Date().toISOString()
    });
  }

  // Análisis de sentido numérico (peso: 25%)
  if (indicators.numberSense.magnitudeComparison < 60) {
    score += 25;
    detectedIndicators.push({
      pattern: 'Dificultad para comparar magnitudes numéricas',
      severity: indicators.numberSense.magnitudeComparison < 40 ? 'high' : 'medium',
      frequency: 1,
      examples: [`Score de comparación: ${indicators.numberSense.magnitudeComparison}%`],
      timestamp: new Date().toISOString()
    });
  }

  // Confusión de símbolos (peso: 20%)
  const symbolConfusions = Object.values(indicators.symbolConfusion).reduce((a, b) => a + b, 0);
  if (symbolConfusions > 5) {
    score += 20;
    detectedIndicators.push({
      pattern: 'Confusión de símbolos matemáticos',
      severity: symbolConfusions > 10 ? 'high' : 'medium',
      frequency: symbolConfusions,
      examples: Object.entries(indicators.symbolConfusion)
        .filter(([_, count]) => count > 0)
        .map(([symbols, count]) => `${symbols}: ${count} veces`),
      timestamp: new Date().toISOString()
    });
  }

  // Ansiedad matemática (peso: 25%)
  if (indicators.anxiety.abandonmentRate > 30) {
    score += 25;
    detectedIndicators.push({
      pattern: 'Signos de ansiedad matemática',
      severity: indicators.anxiety.abandonmentRate > 50 ? 'high' : 'medium',
      frequency: 1,
      examples: [
        `Tasa de abandono: ${indicators.anxiety.abandonmentRate}%`,
        `Tiempo para empezar: ${indicators.anxiety.timeToStart}s`,
        `Solicitudes de ayuda: ${indicators.anxiety.helpRequests}`
      ],
      timestamp: new Date().toISOString()
    });
  }

  const confidence = Math.min(100, detectedIndicators.length * 20 + 20);
  const likelihood = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
  const alertLevel: AlertLevel = score > 70 ? 'red' : score > 50 ? 'orange' : score > 30 ? 'yellow' : 'green';

  const recommendations = generateDyscalculiaRecommendations(score, indicators);

  return {
    id: `dysc-${studentId}-${Date.now()}`,
    studentId,
    type: 'dyscalculia',
    score,
    confidence,
    likelihood,
    indicators: detectedIndicators,
    recommendations,
    testDate: new Date().toISOString(),
    alertLevel
  };
}

function generateDyscalculiaRecommendations(score: number, indicators: DyscalculiaIndicators): string[] {
  const recommendations: string[] = [];

  if (score > 70) {
    recommendations.push('Derivar a especialista en discalculia para evaluación');
  }

  recommendations.push('Proporcionar ayudas visuales (rectas numéricas, bloques)');
  recommendations.push('Permitir uso de calculadora');
  recommendations.push('Enseñar estrategias paso a paso explícitas');
  recommendations.push('Reducir ansiedad matemática con enfoque positivo');
  recommendations.push('Usar manipulativos y objetos concretos');
  recommendations.push('Dividir problemas complejos en pasos más pequeños');

  if (indicators.anxiety.abandonmentRate > 30) {
    recommendations.push('Eliminar cronómetros visibles durante ejercicios');
    recommendations.push('Refuerzo positivo frecuente');
  }

  return recommendations;
}

/**
 * Ejecuta screening completo para un estudiante
 */
export function runFullScreening(studentId: string): ScreeningTest[] {
  // En producción, esto recopilaría datos reales del estudiante
  // Por ahora, retornamos un array vacío
  const tests: ScreeningTest[] = [];

  // Guardar en caché
  screeningTests.set(studentId, tests);

  return tests;
}

/**
 * Obtiene todas las alertas activas de un estudiante
 */
export function getActiveAlerts(studentId: string): ScreeningAlert[] {
  return screeningAlerts.get(studentId) || [];
}

/**
 * Crea una alerta basada en un test de screening
 */
export function createAlertFromTest(test: ScreeningTest, studentName: string): ScreeningAlert | null {
  if (test.alertLevel === 'green') {
    return null; // No crear alerta si está en verde
  }

  const alert: ScreeningAlert = {
    id: `alert-${test.id}`,
    studentId: test.studentId,
    studentName,
    type: test.type,
    level: test.alertLevel,
    score: test.score,
    confidence: test.confidence,
    detectedAt: test.testDate,
    status: 'pending',
    notifiedTo: ['teacher'], // Siempre notificar al profesor
  };

  // Notificar a director si es naranja o rojo
  if (test.alertLevel === 'orange' || test.alertLevel === 'red') {
    alert.notifiedTo.push('director');
  }

  // Guardar alerta
  const existingAlerts = screeningAlerts.get(test.studentId) || [];
  screeningAlerts.set(test.studentId, [...existingAlerts, alert]);

  return alert;
}

/**
 * Obtiene accommodations activas para un estudiante
 */
export function getAccommodations(studentId: string): Accommodation[] {
  return accommodations.get(studentId) || [];
}

/**
 * Aplica accommodations automáticas basadas en alertas
 */
export function applyAutoAccommodations(studentId: string, alert: ScreeningAlert): Accommodation {
  const accommodation: Accommodation = {
    id: `acc-${studentId}-${alert.type}`,
    studentId,
    type: alert.type,
    enabled: true,
    settings: {}
  };

  switch (alert.type) {
    case 'dyslexia':
      accommodation.settings = {
        dyslexiaFont: true,
        fontSize: 1.2,
        lineSpacing: 1.5,
        wordSpacing: 1.2,
        textToSpeech: true,
        highlightWords: true,
        reducedTextPerPage: true,
        extraTime: 1.5
      };
      break;

    case 'dyscalculia':
      accommodation.settings = {
        visualAids: true,
        numberLine: true,
        calculator: true,
        stepByStepGuidance: true,
        noTimers: true
      };
      break;

    case 'dysgraphia':
      accommodation.settings = {
        voiceToText: true,
        enhancedSpellCheck: true,
        wordPrediction: true,
        keyboardShortcuts: true,
        reducedWriting: true
      };
      break;

    case 'adhd':
      accommodation.settings = {
        shortSessions: true,
        sessionLength: 15,
        frequentBreaks: true,
        breakReminders: true,
        gamificationLevel: 'high',
        minimizeDistractions: true
      };
      break;
  }

  // Guardar accommodation
  const existing = accommodations.get(studentId) || [];
  accommodations.set(studentId, [...existing, accommodation]);

  return accommodation;
}

/**
 * Obtiene todas las alertas de un grupo (para profesores)
 */
export function getGroupAlerts(groupId: string, studentIds: string[]): ScreeningAlert[] {
  const allAlerts: ScreeningAlert[] = [];
  
  for (const studentId of studentIds) {
    const studentAlerts = getActiveAlerts(studentId);
    allAlerts.push(...studentAlerts);
  }

  // Ordenar por nivel de alerta (rojo primero)
  return allAlerts.sort((a, b) => {
    const levelOrder = { red: 0, orange: 1, yellow: 2, green: 3 };
    return levelOrder[a.level] - levelOrder[b.level];
  });
}

/**
 * Actualiza el estado de una alerta
 */
export function updateAlertStatus(
  alertId: string,
  status: 'pending' | 'acknowledged' | 'in_progress' | 'resolved',
  notes?: string
): void {
  for (const [_, alerts] of screeningAlerts.entries()) {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
      if (notes) {
        alert.notes = notes;
      }
      break;
    }
  }
}

// Mock data para desarrollo
export function initializeMockScreeningData(): void {
  // Aquí puedes agregar datos de prueba
  console.log('Screening system initialized');
}

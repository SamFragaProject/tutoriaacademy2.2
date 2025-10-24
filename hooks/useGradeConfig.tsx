/**
 * Hook para adaptar la plataforma según el nivel educativo del usuario
 * Configura: vocabulario, complejidad UI, funcionalidades, navegación, gamificación
 */

import React, { useMemo } from 'react';
import type { GradeLevel } from '../types';
import { useAuth } from './useAuth';

export interface GradeConfig {
  // Identidad
  level: GradeLevel;
  displayName: string;
  emoji: string;
  
  // UI/UX Simplification
  uiComplexity: 'simple' | 'intermediate' | 'advanced';
  showAdvancedFeatures: boolean;
  navigationStyle: 'icons-and-text' | 'icons-only' | 'text-only';
  
  // Vocabulario adaptado
  vocabulary: {
    dashboard: string;
    exam: string;
    assignment: string;
    grade: string;
    submit: string;
    teacher: string;
    subject: string;
    practice: string;
    achievement: string;
  };
  
  // Funcionalidades habilitadas
  features: {
    canTakeExams: boolean;
    canSubmitAssignments: boolean;
    canViewDetailedStats: boolean;
    canAccessCognitiveGames: boolean;
    canChatWithAI: boolean;
    canManageSchedule: boolean;
    canViewRanking: boolean;
    canExportReports: boolean;
    canCustomizeTheme: boolean;
  };
  
  // Gamificación adaptada
  gamification: {
    xpMultiplier: number;
    showLeaderboard: boolean;
    achievementDifficulty: 'easy' | 'medium' | 'hard';
    rewardsStyle: 'playful' | 'balanced' | 'professional';
  };
  
  // Colores y estilo
  theme: {
    primaryGradient: string;
    accentColor: string;
    cardStyle: 'playful' | 'standard' | 'minimal';
    iconSize: 'large' | 'medium' | 'small';
  };
  
  // Complejidad de exámenes
  examConfig: {
    maxTimeMinutes: number;
    allowReview: boolean;
    showExplanations: boolean;
    questionTypes: string[];
    difficultyRange: [number, number]; // 1-5 scale
  };
  
  // Sistema de calificaciones
  gradingSystem: {
    scale: 'numeric' | 'letter' | 'emoji';
    showPercentage: boolean;
    showDetailedFeedback: boolean;
    allowSelfReview: boolean;
  };
}

export const GRADE_CONFIGS: Record<GradeLevel, GradeConfig> = {
  primaria: {
    level: 'primaria',
    displayName: 'Primaria',
    emoji: '🎨',
    
    uiComplexity: 'simple',
    showAdvancedFeatures: false,
    navigationStyle: 'icons-and-text',
    
    vocabulary: {
      dashboard: '🏠 Mi Espacio',
      exam: '📝 Examen',
      assignment: '✏️ Tarea',
      grade: '⭐ Calificación',
      submit: '📤 Entregar',
      teacher: '👨‍🏫 Maestro/a',
      subject: '📚 Materia',
      practice: '🎯 Práctica',
      achievement: '🏆 Logro',
    },
    
    features: {
      canTakeExams: true,
      canSubmitAssignments: true,
      canViewDetailedStats: false, // Stats simplificadas
      canAccessCognitiveGames: true,
      canChatWithAI: true, // Con lenguaje simplificado
      canManageSchedule: false, // Profesor maneja
      canViewRanking: true, // Gamificado
      canExportReports: false,
      canCustomizeTheme: false,
    },
    
    gamification: {
      xpMultiplier: 1.5, // Más XP para motivar
      showLeaderboard: true,
      achievementDifficulty: 'easy',
      rewardsStyle: 'playful', // Stickers, emojis, animaciones
    },
    
    theme: {
      primaryGradient: 'from-yellow-500 to-orange-500',
      accentColor: 'orange',
      cardStyle: 'playful',
      iconSize: 'large',
    },
    
    examConfig: {
      maxTimeMinutes: 30,
      allowReview: true,
      showExplanations: true, // Siempre explicaciones
      questionTypes: ['multiple-choice', 'true-false', 'matching'],
      difficultyRange: [1, 3], // Básico a intermedio
    },
    
    gradingSystem: {
      scale: 'emoji', // 😊 Excelente, 😐 Bien, 😕 Puede mejorar
      showPercentage: false,
      showDetailedFeedback: true,
      allowSelfReview: false,
    },
  },
  
  secundaria: {
    level: 'secundaria',
    displayName: 'Secundaria',
    emoji: '📚',
    
    uiComplexity: 'intermediate',
    showAdvancedFeatures: true,
    navigationStyle: 'icons-and-text',
    
    vocabulary: {
      dashboard: '📊 Dashboard',
      exam: '📋 Examen',
      assignment: '📝 Tarea',
      grade: '💯 Calificación',
      submit: '✅ Enviar',
      teacher: '👩‍🏫 Profesor/a',
      subject: '📖 Asignatura',
      practice: '🎯 Práctica',
      achievement: '🏅 Logro',
    },
    
    features: {
      canTakeExams: true,
      canSubmitAssignments: true,
      canViewDetailedStats: true, // Stats intermedias
      canAccessCognitiveGames: true,
      canChatWithAI: true,
      canManageSchedule: true, // Agenda básica
      canViewRanking: true,
      canExportReports: false,
      canCustomizeTheme: true, // Temas predefinidos
    },
    
    gamification: {
      xpMultiplier: 1.2,
      showLeaderboard: true,
      achievementDifficulty: 'medium',
      rewardsStyle: 'balanced',
    },
    
    theme: {
      primaryGradient: 'from-blue-500 to-cyan-500',
      accentColor: 'blue',
      cardStyle: 'standard',
      iconSize: 'medium',
    },
    
    examConfig: {
      maxTimeMinutes: 45,
      allowReview: true,
      showExplanations: true,
      questionTypes: ['multiple-choice', 'short-answer', 'essay', 'matching'],
      difficultyRange: [2, 4], // Intermedio a avanzado
    },
    
    gradingSystem: {
      scale: 'numeric', // 5-10 o 0-100
      showPercentage: true,
      showDetailedFeedback: true,
      allowSelfReview: true,
    },
  },
  
  preparatoria: {
    level: 'preparatoria',
    displayName: 'Preparatoria',
    emoji: '🎓',
    
    uiComplexity: 'advanced',
    showAdvancedFeatures: true,
    navigationStyle: 'icons-only',
    
    vocabulary: {
      dashboard: '📈 Dashboard',
      exam: '📄 Evaluación',
      assignment: '📋 Entregable',
      grade: '📊 Calificación',
      submit: '🚀 Enviar',
      teacher: '🎓 Docente',
      subject: '📚 Materia',
      practice: '💪 Ejercicio',
      achievement: '🏆 Logro',
    },
    
    features: {
      canTakeExams: true,
      canSubmitAssignments: true,
      canViewDetailedStats: true, // Analytics completos
      canAccessCognitiveGames: true,
      canChatWithAI: true,
      canManageSchedule: true, // Agenda avanzada
      canViewRanking: true,
      canExportReports: true, // PDF, CSV
      canCustomizeTheme: true, // Personalización completa
    },
    
    gamification: {
      xpMultiplier: 1.0,
      showLeaderboard: true,
      achievementDifficulty: 'hard',
      rewardsStyle: 'professional',
    },
    
    theme: {
      primaryGradient: 'from-purple-500 to-pink-500',
      accentColor: 'purple',
      cardStyle: 'minimal',
      iconSize: 'small',
    },
    
    examConfig: {
      maxTimeMinutes: 60,
      allowReview: true,
      showExplanations: false, // Opcional
      questionTypes: ['multiple-choice', 'short-answer', 'essay', 'problem-solving', 'code'],
      difficultyRange: [3, 5], // Avanzado
    },
    
    gradingSystem: {
      scale: 'letter', // A+, A, B+, etc.
      showPercentage: true,
      showDetailedFeedback: true,
      allowSelfReview: true,
    },
  },
  
  universidad: {
    level: 'universidad',
    displayName: 'Universidad',
    emoji: '🎯',
    
    uiComplexity: 'advanced',
    showAdvancedFeatures: true,
    navigationStyle: 'text-only',
    
    vocabulary: {
      dashboard: 'Dashboard',
      exam: 'Examen',
      assignment: 'Assignment',
      grade: 'Grade',
      submit: 'Submit',
      teacher: 'Professor',
      subject: 'Course',
      practice: 'Exercise',
      achievement: 'Achievement',
    },
    
    features: {
      canTakeExams: true,
      canSubmitAssignments: true,
      canViewDetailedStats: true,
      canAccessCognitiveGames: true,
      canChatWithAI: true,
      canManageSchedule: true,
      canViewRanking: false, // Más profesional
      canExportReports: true,
      canCustomizeTheme: true,
    },
    
    gamification: {
      xpMultiplier: 0.8,
      showLeaderboard: false,
      achievementDifficulty: 'hard',
      rewardsStyle: 'professional',
    },
    
    theme: {
      primaryGradient: 'from-indigo-600 to-blue-600',
      accentColor: 'indigo',
      cardStyle: 'minimal',
      iconSize: 'small',
    },
    
    examConfig: {
      maxTimeMinutes: 90,
      allowReview: true,
      showExplanations: false,
      questionTypes: ['multiple-choice', 'short-answer', 'essay', 'problem-solving', 'code', 'research'],
      difficultyRange: [4, 5],
    },
    
    gradingSystem: {
      scale: 'letter',
      showPercentage: true,
      showDetailedFeedback: true,
      allowSelfReview: true,
    },
  },
};

/**
 * Hook principal para obtener configuración del nivel educativo actual
 */
export function useGradeConfig(): GradeConfig {
  const { user } = useAuth();
  
  const config = useMemo(() => {
    const gradeLevel = user?.gradeLevel || 'preparatoria';
    return GRADE_CONFIGS[gradeLevel];
  }, [user?.gradeLevel]);
  
  return config;
}

/**
 * Hook para verificar si una funcionalidad está disponible
 */
export function useFeatureAccess(feature: keyof GradeConfig['features']): boolean {
  const config = useGradeConfig();
  return config.features[feature];
}

/**
 * Hook para obtener vocabulario adaptado
 */
export function useAdaptiveVocabulary() {
  const config = useGradeConfig();
  return config.vocabulary;
}

/**
 * Componente HOC para condicionar renderizado según nivel
 */
export function withGradeLevel<P extends object>(
  Component: React.ComponentType<P>,
  allowedLevels: GradeLevel[]
) {
  return (props: P) => {
    const config = useGradeConfig();
    
    if (!allowedLevels.includes(config.level)) {
      return null;
    }
    
    return <Component {...props} />;
  };
}

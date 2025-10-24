// services/flowAutoCompletion.ts
import * as flowService from './userFlows';
import type { UserRole } from '../types';

/**
 * Sistema de auto-completado de etapas
 * Detecta automáticamente cuando usuario completa criterios y marca etapas como completas
 */

export interface CompletionEvent {
  userId: string;
  stageId: string;
  eventType: string;
  metadata?: Record<string, any>;
}

/**
 * Hook principal para detectar eventos de completado
 * Debe ser llamado desde las páginas cuando ocurren eventos significativos
 */
export function trackCompletionEvent(event: CompletionEvent): void {
  const { userId, stageId, eventType, metadata } = event;
  
  console.log(`[FlowAutoCompletion] Event tracked:`, event);
  
  // Obtener el flujo actual del usuario
  const flowState = flowService.getUserFlow(userId);
  if (!flowState) return;
  
  // Verificar si la etapa ya está completada
  if (flowState.completedStages.includes(stageId)) return;
  
  // Obtener la etapa actual
  const stages = flowService.getFlowForRole(flowState.role as UserRole);
  const stage = stages.find(s => s.id === stageId);
  if (!stage) return;
  
  // Verificar si se cumplen los criterios de completado
  const isComplete = checkCompletionCriteria(userId, stage.id, eventType, metadata);
  
  if (isComplete) {
    console.log(`[FlowAutoCompletion] Stage ${stageId} autocompleted for user ${userId}`);
    
    // Marcar etapa como completa
    flowService.completeStage(userId, stageId);
    
    // Disparar evento personalizado para notificaciones
    window.dispatchEvent(new CustomEvent('stageCompleted', {
      detail: { userId, stageId, stageName: stage.name }
    }));
  } else {
    // Actualizar progreso parcial
    const progress = calculatePartialProgress(userId, stage.id, eventType, metadata);
    flowService.updateStageProgress(userId, stageId, progress);
  }
}

/**
 * Verifica si se cumplen los criterios de completado para una etapa
 */
function checkCompletionCriteria(
  userId: string,
  stageId: string,
  eventType: string,
  metadata?: Record<string, any>
): boolean {
  
  // ESTUDIANTE: Onboarding
  if (stageId === 'student-onboarding') {
    const profileComplete = localStorage.getItem(`profile_complete_${userId}`) === 'true';
    const tourCompleted = localStorage.getItem(`tour_completed_${userId}`) === 'true';
    
    if (eventType === 'profile_completed') {
      localStorage.setItem(`profile_complete_${userId}`, 'true');
    }
    
    if (eventType === 'tour_completed') {
      localStorage.setItem(`tour_completed_${userId}`, 'true');
    }
    
    return profileComplete && tourCompleted;
  }
  
  // ESTUDIANTE: Diagnóstico
  if (stageId === 'student-diagnosis') {
    if (eventType === 'diagnosis_completed') {
      const subject = metadata?.subject;
      const completed = JSON.parse(localStorage.getItem(`diagnosis_completed_${userId}`) || '[]');
      if (subject && !completed.includes(subject)) {
        completed.push(subject);
        localStorage.setItem(`diagnosis_completed_${userId}`, JSON.stringify(completed));
      }
      
      // Requiere completar diagnóstico de al menos 2 materias
      return completed.length >= 2;
    }
    return false;
  }
  
  // ESTUDIANTE: Aprendizaje
  if (stageId === 'student-learning') {
    if (eventType === 'topic_completed') {
      const topicsCompleted = parseInt(localStorage.getItem(`topics_completed_${userId}`) || '0');
      localStorage.setItem(`topics_completed_${userId}`, (topicsCompleted + 1).toString());
      
      // Requiere completar al menos 10 temas
      return topicsCompleted + 1 >= 10;
    }
    
    if (eventType === 'study_session_completed') {
      const sessions = parseInt(localStorage.getItem(`study_sessions_${userId}`) || '0');
      localStorage.setItem(`study_sessions_${userId}`, (sessions + 1).toString());
      
      // Requiere al menos 20 sesiones de estudio
      return sessions + 1 >= 20;
    }
    return false;
  }
  
  // ESTUDIANTE: Evaluación
  if (stageId === 'student-evaluation') {
    if (eventType === 'simulacro_completed') {
      const simulacros = parseInt(localStorage.getItem(`simulacros_completed_${userId}`) || '0');
      localStorage.setItem(`simulacros_completed_${userId}`, (simulacros + 1).toString());
      
      // Requiere completar al menos 5 simulacros
      return simulacros + 1 >= 5;
    }
    
    if (eventType === 'practice_completed') {
      const practices = parseInt(localStorage.getItem(`practices_completed_${userId}`) || '0');
      localStorage.setItem(`practices_completed_${userId}`, (practices + 1).toString());
      
      // Requiere al menos 15 prácticas
      return practices + 1 >= 15;
    }
    return false;
  }
  
  // ESTUDIANTE: Mantenimiento
  if (stageId === 'student-maintenance') {
    if (eventType === 'daily_streak_updated') {
      const streak = parseInt(metadata?.streak || '0');
      // Requiere racha de 30 días
      return streak >= 30;
    }
    return false;
  }
  
  // PROFESOR: Configuración
  if (stageId === 'teacher-setup') {
    if (eventType === 'profile_completed') {
      localStorage.setItem(`teacher_profile_${userId}`, 'complete');
    }
    
    if (eventType === 'group_created') {
      const groups = parseInt(localStorage.getItem(`groups_created_${userId}`) || '0');
      localStorage.setItem(`groups_created_${userId}`, (groups + 1).toString());
    }
    
    const profileComplete = localStorage.getItem(`teacher_profile_${userId}`) === 'complete';
    const groupsCreated = parseInt(localStorage.getItem(`groups_created_${userId}`) || '0') >= 1;
    
    return profileComplete && groupsCreated;
  }
  
  // PROFESOR: Preparación de contenido
  if (stageId === 'teacher-content') {
    if (eventType === 'question_bank_created') {
      const banks = parseInt(localStorage.getItem(`question_banks_${userId}`) || '0');
      localStorage.setItem(`question_banks_${userId}`, (banks + 1).toString());
    }
    
    if (eventType === 'exam_created') {
      const exams = parseInt(localStorage.getItem(`exams_created_${userId}`) || '0');
      localStorage.setItem(`exams_created_${userId}`, (exams + 1).toString());
    }
    
    const banksCreated = parseInt(localStorage.getItem(`question_banks_${userId}`) || '0') >= 1;
    const examsCreated = parseInt(localStorage.getItem(`exams_created_${userId}`) || '0') >= 2;
    
    return banksCreated && examsCreated;
  }
  
  // PROFESOR: Docencia
  if (stageId === 'teacher-teaching') {
    if (eventType === 'task_assigned') {
      const tasks = parseInt(localStorage.getItem(`tasks_assigned_${userId}`) || '0');
      localStorage.setItem(`tasks_assigned_${userId}`, (tasks + 1).toString());
      
      return tasks + 1 >= 10; // Al menos 10 tareas asignadas
    }
    return false;
  }
  
  // PROFESOR: Evaluación
  if (stageId === 'teacher-evaluation') {
    if (eventType === 'grading_completed') {
      const graded = parseInt(localStorage.getItem(`tasks_graded_${userId}`) || '0');
      localStorage.setItem(`tasks_graded_${userId}`, (graded + 1).toString());
      
      return graded + 1 >= 20; // Al menos 20 tareas calificadas
    }
    return false;
  }
  
  // PROFESOR: Optimización
  if (stageId === 'teacher-optimization') {
    if (eventType === 'analytics_reviewed') {
      const reviews = parseInt(localStorage.getItem(`analytics_reviews_${userId}`) || '0');
      localStorage.setItem(`analytics_reviews_${userId}`, (reviews + 1).toString());
      
      return reviews + 1 >= 5; // Al menos 5 revisiones de analytics
    }
    return false;
  }
  
  // DIRECTOR: Configuración
  if (stageId === 'director-setup') {
    if (eventType === 'school_configured') {
      localStorage.setItem(`school_configured_${userId}`, 'true');
    }
    
    if (eventType === 'teacher_invited') {
      const invited = parseInt(localStorage.getItem(`teachers_invited_${userId}`) || '0');
      localStorage.setItem(`teachers_invited_${userId}`, (invited + 1).toString());
    }
    
    const schoolConfigured = localStorage.getItem(`school_configured_${userId}`) === 'true';
    const teachersInvited = parseInt(localStorage.getItem(`teachers_invited_${userId}`) || '0') >= 3;
    
    return schoolConfigured && teachersInvited;
  }
  
  // DIRECTOR: Monitoreo
  if (stageId === 'director-monitoring') {
    if (eventType === 'dashboard_reviewed') {
      const reviews = parseInt(localStorage.getItem(`dashboard_reviews_${userId}`) || '0');
      localStorage.setItem(`dashboard_reviews_${userId}`, (reviews + 1).toString());
      
      return reviews + 1 >= 10; // 10 revisiones del dashboard
    }
    return false;
  }
  
  // DIRECTOR: Intervención
  if (stageId === 'director-intervention') {
    if (eventType === 'intervention_created') {
      const interventions = parseInt(localStorage.getItem(`interventions_${userId}`) || '0');
      localStorage.setItem(`interventions_${userId}`, (interventions + 1).toString());
      
      return interventions + 1 >= 3; // Al menos 3 intervenciones
    }
    return false;
  }
  
  return false;
}

/**
 * Calcula el progreso parcial de una etapa basado en eventos
 */
function calculatePartialProgress(
  userId: string,
  stageId: string,
  eventType: string,
  metadata?: Record<string, any>
): number {
  const flowState = flowService.getUserFlow(userId);
  if (!flowState) return 0;
  
  const currentProgress = flowState.stageProgress[stageId] || 0;
  
  // ESTUDIANTE: Diagnóstico - 50% por materia
  if (stageId === 'student-diagnosis' && eventType === 'diagnosis_completed') {
    const completed = JSON.parse(localStorage.getItem(`diagnosis_completed_${userId}`) || '[]');
    return Math.min(100, completed.length * 50);
  }
  
  // ESTUDIANTE: Aprendizaje - 10% por cada 2 temas
  if (stageId === 'student-learning' && eventType === 'topic_completed') {
    const topicsCompleted = parseInt(localStorage.getItem(`topics_completed_${userId}`) || '0');
    return Math.min(100, Math.floor(topicsCompleted / 2) * 10);
  }
  
  // ESTUDIANTE: Evaluación - 20% por simulacro
  if (stageId === 'student-evaluation' && eventType === 'simulacro_completed') {
    const simulacros = parseInt(localStorage.getItem(`simulacros_completed_${userId}`) || '0');
    return Math.min(100, simulacros * 20);
  }
  
  // PROFESOR: Contenido - 33% por cada logro
  if (stageId === 'teacher-content') {
    const banks = parseInt(localStorage.getItem(`question_banks_${userId}`) || '0') >= 1 ? 33 : 0;
    const exams = parseInt(localStorage.getItem(`exams_created_${userId}`) || '0') >= 1 ? 34 : 0;
    const materials = 0; // Por implementar
    return Math.min(100, banks + exams + materials);
  }
  
  // PROFESOR: Docencia - 10% por cada tarea asignada
  if (stageId === 'teacher-teaching' && eventType === 'task_assigned') {
    const tasks = parseInt(localStorage.getItem(`tasks_assigned_${userId}`) || '0');
    return Math.min(100, tasks * 10);
  }
  
  // PROFESOR: Evaluación - 5% por cada tarea calificada
  if (stageId === 'teacher-evaluation' && eventType === 'grading_completed') {
    const graded = parseInt(localStorage.getItem(`tasks_graded_${userId}`) || '0');
    return Math.min(100, graded * 5);
  }
  
  // Por defecto, incrementar 10% cada evento significativo
  return Math.min(100, currentProgress + 10);
}

/**
 * Helper para tracking rápido desde componentes
 */
export function trackStageActivity(
  userId: string,
  role: UserRole,
  activityType: string,
  metadata?: Record<string, any>
): void {
  const currentStage = flowService.getCurrentStage(userId);
  if (!currentStage) return;
  
  trackCompletionEvent({
    userId,
    stageId: currentStage.id,
    eventType: activityType,
    metadata,
  });
}

/**
 * Resetear progreso de una etapa (para testing)
 */
export function resetStageProgress(userId: string, stageId: string): void {
  // Limpiar localStorage específico de la etapa
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes(userId) && key.includes(stageId)) {
      localStorage.removeItem(key);
    }
  });
  
  // Resetear progreso en el flowService
  flowService.updateStageProgress(userId, stageId, 0);
  
  console.log(`[FlowAutoCompletion] Reset progress for stage ${stageId}`);
}

/**
 * Obtener métricas de progreso de una etapa
 */
export function getStageMetrics(userId: string, stageId: string): Record<string, any> {
  const metrics: Record<string, any> = {};
  
  // Recopilar todas las métricas de localStorage relacionadas
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes(userId)) {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          metrics[key] = JSON.parse(value);
        } catch {
          metrics[key] = value;
        }
      }
    }
  });
  
  return metrics;
}

// services/flowNotifications.ts
import * as flowService from './userFlows';
import type { UserRole } from '../types';

/**
 * Sistema de notificaciones inteligentes basado en el flujo del usuario
 * Impulsa automáticamente al usuario al siguiente paso
 */

export interface FlowNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'action';
  icon: string;
  actionLabel?: string;
  actionRoute?: string;
  priority: 'high' | 'medium' | 'low';
  dismissible: boolean;
  timestamp: Date;
}

/**
 * Genera notificaciones contextuales basadas en el estado del flujo del usuario
 */
export function getFlowNotifications(userId: string, role: UserRole): FlowNotification[] {
  const notifications: FlowNotification[] = [];
  const flowState = flowService.getUserFlow(userId);
  
  if (!flowState) return [];

  const currentStage = flowService.getCurrentStage(userId);
  if (!currentStage) return [];

  const stageProgress = flowState.stageProgress[currentStage.id] || 0;
  const completedStages = flowState.completedStages.length;
  const allStages = flowService.getFlowForRole(role);

  // 1. NOTIFICACIÓN DE BIENVENIDA (Primera vez)
  if (completedStages === 0 && stageProgress === 0) {
    notifications.push({
      id: 'welcome',
      title: `¡Bienvenido a TutoriA Academy! 🎉`,
      message: `Comencemos tu viaje. Tu primera etapa: ${currentStage.name}`,
      type: 'info',
      icon: '👋',
      actionLabel: 'Comenzar',
      actionRoute: currentStage.actions.find(a => a.isPrimary)?.route,
      priority: 'high',
      dismissible: false,
      timestamp: new Date(),
    });
  }

  // 2. NOTIFICACIÓN DE PROGRESO EN ETAPA ACTUAL
  if (stageProgress > 0 && stageProgress < 100) {
    const primaryAction = currentStage.actions.find(a => a.isPrimary);
    notifications.push({
      id: 'stage-progress',
      title: `Continúa con: ${currentStage.name}`,
      message: `Llevas ${stageProgress}% completado. ${currentStage.objective}`,
      type: 'action',
      icon: '🎯',
      actionLabel: primaryAction?.label,
      actionRoute: primaryAction?.route,
      priority: 'high',
      dismissible: true,
      timestamp: new Date(),
    });
  }

  // 3. NOTIFICACIÓN DE ETAPA CASI COMPLETA
  if (stageProgress >= 80 && stageProgress < 100) {
    notifications.push({
      id: 'stage-almost-done',
      title: '¡Casi terminas esta etapa! 🔥',
      message: `Solo falta un ${100 - stageProgress}% para completar ${currentStage.name}`,
      type: 'success',
      icon: '⚡',
      priority: 'medium',
      dismissible: true,
      timestamp: new Date(),
    });
  }

  // 4. NOTIFICACIÓN DE ETAPA COMPLETADA
  if (stageProgress === 100 && !flowState.completedStages.includes(currentStage.id)) {
    const nextStage = flowService.getNextStage(userId);
    notifications.push({
      id: 'stage-completed',
      title: `¡Etapa completada! 🎉`,
      message: nextStage 
        ? `Excelente trabajo en ${currentStage.name}. Siguiente: ${nextStage.name}`
        : `¡Felicitaciones! Has completado todas las etapas.`,
      type: 'success',
      icon: '✅',
      actionLabel: nextStage ? `Ir a ${nextStage.name}` : undefined,
      actionRoute: nextStage?.actions.find(a => a.isPrimary)?.route,
      priority: 'high',
      dismissible: false,
      timestamp: new Date(),
    });
  }

  // 5. NOTIFICACIONES ESPECÍFICAS POR ROL
  if (role === 'alumno') {
    notifications.push(...getStudentNotifications(userId, currentStage, stageProgress));
  } else if (role === 'docente') {
    notifications.push(...getTeacherNotifications(userId, currentStage, stageProgress));
  } else if (role === 'director') {
    notifications.push(...getDirectorNotifications(userId, currentStage, stageProgress));
  }

  // 6. NOTIFICACIÓN DE BLOQUEOS
  if (flowState.blockers && flowState.blockers.length > 0) {
    flowState.blockers.forEach((blocker, index) => {
      notifications.push({
        id: `blocker-${index}`,
        title: '⚠️ Atención requerida',
        message: blocker,
        type: 'warning',
        icon: '🚧',
        priority: 'high',
        dismissible: true,
        timestamp: new Date(),
      });
    });
  }

  // 7. NOTIFICACIÓN DE MOTIVACIÓN (Si lleva días inactivo)
  const daysSinceLastUpdate = flowState.daysInactive || 0;
  if (daysSinceLastUpdate >= 3) {
    notifications.push({
      id: 'motivation',
      title: '¡Te extrañamos! 😊',
      message: `Han pasado ${daysSinceLastUpdate} días. Continuemos con ${currentStage.name}`,
      type: 'info',
      icon: '💪',
      actionLabel: 'Continuar',
      actionRoute: currentStage.actions.find(a => a.isPrimary)?.route,
      priority: 'medium',
      dismissible: true,
      timestamp: new Date(),
    });
  }

  // Ordenar por prioridad
  return notifications.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * Notificaciones específicas para estudiantes
 */
function getStudentNotifications(
  userId: string,
  currentStage: any,
  stageProgress: number
): FlowNotification[] {
  const notifications: FlowNotification[] = [];

  // Etapa de Bienvenida
  if (currentStage.id === 'student-onboarding') {
    if (stageProgress === 0) {
      notifications.push({
        id: 'student-tour',
        title: '📚 Comienza tu aventura',
        message: 'Realiza el tour guiado para conocer todas las funciones',
        type: 'action',
        icon: '🎓',
        actionLabel: 'Hacer Tour',
        actionRoute: '/app/dashboard',
        priority: 'high',
        dismissible: false,
        timestamp: new Date(),
      });
    }
  }

  // Etapa de Diagnóstico
  if (currentStage.id === 'student-diagnosis') {
    if (stageProgress < 50) {
      notifications.push({
        id: 'diagnosis-pending',
        title: '🎯 Diagnóstico pendiente',
        message: 'Completa tu diagnóstico para recibir un plan personalizado',
        type: 'action',
        icon: '📊',
        actionLabel: 'Hacer Diagnóstico',
        actionRoute: '/app/diagnostico',
        priority: 'high',
        dismissible: true,
        timestamp: new Date(),
      });
    }
  }

  // Etapa de Aprendizaje
  if (currentStage.id === 'student-learning') {
    // Recordatorio de estudio diario
    notifications.push({
      id: 'daily-study',
      title: '💡 Momento de estudiar',
      message: 'Dedica 30 minutos a repasar tus materias',
      type: 'info',
      icon: '📖',
      actionLabel: 'Estudiar Ahora',
      actionRoute: '/app/materias',
      priority: 'medium',
      dismissible: true,
      timestamp: new Date(),
    });
  }

  // Etapa de Evaluación
  if (currentStage.id === 'student-evaluation') {
    notifications.push({
      id: 'practice-test',
      title: '✍️ Practica para tu examen',
      message: 'Realiza simulacros para medir tu preparación',
      type: 'action',
      icon: '📝',
      actionLabel: 'Hacer Simulacro',
      actionRoute: '/app/simulacro',
      priority: 'medium',
      dismissible: true,
      timestamp: new Date(),
    });
  }

  return notifications;
}

/**
 * Notificaciones específicas para profesores
 */
function getTeacherNotifications(
  userId: string,
  currentStage: any,
  stageProgress: number
): FlowNotification[] {
  const notifications: FlowNotification[] = [];

  // Etapa de Configuración
  if (currentStage.id === 'teacher-setup') {
    if (stageProgress < 100) {
      notifications.push({
        id: 'teacher-setup',
        title: '⚙️ Configura tu perfil docente',
        message: 'Completa tu perfil y preferencias para comenzar',
        type: 'action',
        icon: '👨‍🏫',
        actionLabel: 'Configurar',
        actionRoute: '/docente/dashboard',
        priority: 'high',
        dismissible: false,
        timestamp: new Date(),
      });
    }
  }

  // Etapa de Preparación de Contenido
  if (currentStage.id === 'teacher-content') {
    notifications.push({
      id: 'create-content',
      title: '📚 Prepara tus materiales',
      message: 'Crea exámenes y bancos de preguntas con IA',
      type: 'action',
      icon: '✨',
      actionLabel: 'Crear Examen',
      actionRoute: '/docente/crear-examen-ia',
      priority: 'high',
      dismissible: true,
      timestamp: new Date(),
    });
  }

  // Etapa de Docencia
  if (currentStage.id === 'teacher-teaching') {
    // Notificación de tareas pendientes por calificar
    notifications.push({
      id: 'pending-grading',
      title: '📝 Tareas por calificar',
      message: 'Tienes trabajos pendientes de revisión',
      type: 'warning',
      icon: '⏰',
      actionLabel: 'Ver Calificaciones',
      actionRoute: '/docente/calificaciones',
      priority: 'high',
      dismissible: true,
      timestamp: new Date(),
    });
  }

  // Etapa de Evaluación
  if (currentStage.id === 'teacher-evaluation') {
    notifications.push({
      id: 'check-results',
      title: '📊 Revisa el rendimiento',
      message: 'Analiza los resultados de tus grupos',
      type: 'info',
      icon: '📈',
      actionLabel: 'Ver Resultados',
      actionRoute: '/docente/resultados',
      priority: 'medium',
      dismissible: true,
      timestamp: new Date(),
    });
  }

  // Alertas de screening (siempre activas)
  notifications.push({
    id: 'screening-alerts',
    title: '🔍 Alertas de Screening',
    message: 'Revisa posibles dificultades de aprendizaje en alumnos',
    type: 'warning',
    icon: '⚠️',
    actionLabel: 'Ver Screening',
    actionRoute: '/docente/screening',
    priority: 'high',
    dismissible: true,
    timestamp: new Date(),
  });

  return notifications;
}

/**
 * Notificaciones específicas para directores
 */
function getDirectorNotifications(
  userId: string,
  currentStage: any,
  stageProgress: number
): FlowNotification[] {
  const notifications: FlowNotification[] = [];

  // Etapa de Configuración
  if (currentStage.id === 'director-setup') {
    notifications.push({
      id: 'school-setup',
      title: '🏫 Configura tu institución',
      message: 'Completa los datos de tu escuela y añade profesores',
      type: 'action',
      icon: '⚙️',
      actionLabel: 'Configurar Escuela',
      actionRoute: '/director/escuela',
      priority: 'high',
      dismissible: false,
      timestamp: new Date(),
    });
  }

  // Etapa de Monitoreo
  if (currentStage.id === 'director-monitoring') {
    notifications.push({
      id: 'check-metrics',
      title: '📊 Métricas institucionales',
      message: 'Revisa el rendimiento general de tu institución',
      type: 'info',
      icon: '📈',
      actionLabel: 'Ver Dashboard',
      actionRoute: '/director/dashboard',
      priority: 'medium',
      dismissible: true,
      timestamp: new Date(),
    });
  }

  // Etapa de Intervención
  if (currentStage.id === 'director-intervention') {
    notifications.push({
      id: 'interventions-needed',
      title: '🎯 Intervenciones requeridas',
      message: 'Identifica áreas que necesitan atención',
      type: 'warning',
      icon: '⚠️',
      actionLabel: 'Ver Análisis',
      actionRoute: '/director/analisis',
      priority: 'high',
      dismissible: true,
      timestamp: new Date(),
    });
  }

  return notifications;
}

/**
 * Marca una notificación como leída/descartada
 */
export function dismissNotification(userId: string, notificationId: string): void {
  const dismissed = localStorage.getItem(`dismissed_notifications_${userId}`);
  const dismissedList = dismissed ? JSON.parse(dismissed) : [];
  dismissedList.push(notificationId);
  localStorage.setItem(`dismissed_notifications_${userId}`, JSON.stringify(dismissedList));
}

/**
 * Verifica si una notificación fue descartada
 */
export function isNotificationDismissed(userId: string, notificationId: string): boolean {
  const dismissed = localStorage.getItem(`dismissed_notifications_${userId}`);
  if (!dismissed) return false;
  const dismissedList = JSON.parse(dismissed);
  return dismissedList.includes(notificationId);
}

/**
 * Filtra notificaciones descartadas
 */
export function getActiveNotifications(userId: string, role: UserRole): FlowNotification[] {
  const allNotifications = getFlowNotifications(userId, role);
  return allNotifications.filter(notification => 
    !isNotificationDismissed(userId, notification.id)
  );
}

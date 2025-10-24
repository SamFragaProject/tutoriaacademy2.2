// services/userFlows.ts
import type { User } from '../types';

// ============================================================================
// DEFINICIÓN DE FLUJOS POR ROL
// ============================================================================

export type FlowStage = {
  id: string;
  name: string;
  description: string;
  objective: string;
  actions: FlowAction[];
  completionCriteria: CompletionCriteria;
  estimatedTime: string;
  kpis: KPI[];
};

export type FlowAction = {
  id: string;
  label: string;
  route: string;
  icon: string;
  isPrimary: boolean;
  description: string;
};

export type CompletionCriteria = {
  type: 'manual' | 'automatic' | 'hybrid';
  conditions: string[];
  checkFunction?: (userId: string) => boolean;
};

export type KPI = {
  id: string;
  label: string;
  target: number;
  current: number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
};

export interface UserFlowState {
  userId: string;
  role: string;
  currentStageId: string;
  completedStages: string[];
  stageProgress: { [stageId: string]: number }; // 0-100
  kpiValues: { [kpiId: string]: number };
  blockers: string[];
  lastActivityDate: string;
  daysInactive: number;
  flowCompletionPercentage: number;
}

// ============================================================================
// FLUJO ESTUDIANTE: Aprendizaje Completo
// ============================================================================

export const STUDENT_FLOW: FlowStage[] = [
  {
    id: 'onboarding',
    name: 'Bienvenida e Introducción',
    description: 'Configura tu perfil y conoce la plataforma',
    objective: 'Completar perfil básico y entender cómo funciona TutoriA',
    estimatedTime: '10-15 min',
    actions: [
      {
        id: 'complete-profile',
        label: 'Completar Perfil',
        route: '/app/configuracion',
        icon: '👤',
        isPrimary: true,
        description: 'Información personal y preferencias de estudio',
      },
      {
        id: 'tour-platform',
        label: 'Tour de la Plataforma',
        route: '/app/dashboard',
        icon: '🎯',
        isPrimary: true,
        description: 'Conoce las funcionalidades principales',
      },
    ],
    completionCriteria: {
      type: 'automatic',
      conditions: ['Perfil completado', 'Tour visto'],
    },
    kpis: [
      { id: 'profile_completion', label: 'Perfil completado', target: 100, current: 0, unit: '%' },
      { id: 'platform_explored', label: 'Secciones visitadas', target: 5, current: 0, unit: 'páginas' },
    ],
  },
  {
    id: 'diagnosis',
    name: 'Diagnóstico Inicial',
    description: 'Evaluación de tu nivel actual en cada materia',
    objective: 'Realizar diagnóstico para generar plan de estudio personalizado',
    estimatedTime: '30-45 min',
    actions: [
      {
        id: 'start-diagnosis',
        label: 'Iniciar Diagnóstico',
        route: '/app/diagnostico',
        icon: '🧠',
        isPrimary: true,
        description: 'Prueba adaptativa para medir tu nivel',
      },
      {
        id: 'view-results',
        label: 'Ver Resultados',
        route: '/app/progreso',
        icon: '📊',
        isPrimary: false,
        description: 'Análisis de tus fortalezas y áreas de mejora',
      },
    ],
    completionCriteria: {
      type: 'automatic',
      conditions: ['Diagnóstico completado', 'Plan generado'],
    },
    kpis: [
      { id: 'diagnosis_completed', label: 'Diagnóstico realizado', target: 1, current: 0, unit: 'examen' },
      { id: 'subjects_evaluated', label: 'Materias evaluadas', target: 4, current: 0, unit: 'materias' },
    ],
  },
  {
    id: 'learning',
    name: 'Aprendizaje Activo',
    description: 'Estudia, practica y domina los temas',
    objective: 'Avanzar en tu plan de estudio y mejorar tu dominio',
    estimatedTime: 'Continuo',
    actions: [
      {
        id: 'study-topics',
        label: 'Estudiar Temas',
        route: '/app/materias',
        icon: '📚',
        isPrimary: true,
        description: 'Revisa temarios y recursos',
      },
      {
        id: 'chat-tutor',
        label: 'Consultar Tutor IA',
        route: '/app/chat',
        icon: '🤖',
        isPrimary: true,
        description: 'Resuelve dudas con tu asistente',
      },
      {
        id: 'practice',
        label: 'Practicar',
        route: '/app/practicas',
        icon: '✏️',
        isPrimary: true,
        description: 'Ejercicios adaptativos',
      },
      {
        id: 'play-games',
        label: 'Juegos Cognitivos',
        route: '/app/juegos',
        icon: '🎮',
        isPrimary: false,
        description: 'Mejora atención y memoria',
      },
    ],
    completionCriteria: {
      type: 'hybrid',
      conditions: [
        'Mínimo 50% de dominio en cada materia',
        'Al menos 20 sesiones de estudio',
        'Racha de 7 días',
      ],
    },
    kpis: [
      { id: 'mastery_score', label: 'Puntaje de dominio', target: 800, current: 0, unit: 'pts' },
      { id: 'study_streak', label: 'Racha de estudio', target: 7, current: 0, unit: 'días' },
      { id: 'topics_mastered', label: 'Temas dominados', target: 20, current: 0, unit: 'temas' },
      { id: 'practice_sessions', label: 'Sesiones de práctica', target: 20, current: 0, unit: 'sesiones' },
    ],
  },
  {
    id: 'evaluation',
    name: 'Evaluación y Simulacros',
    description: 'Mide tu progreso con exámenes de práctica',
    objective: 'Alcanzar 80%+ en simulacros tipo examen',
    estimatedTime: 'Continuo',
    actions: [
      {
        id: 'take-mock',
        label: 'Simulacro Completo',
        route: '/app/simulacro',
        icon: '📝',
        isPrimary: true,
        description: 'Examen completo en condiciones reales',
      },
      {
        id: 'review-stats',
        label: 'Analizar Estadísticas',
        route: '/app/progreso',
        icon: '📈',
        isPrimary: true,
        description: 'Identifica áreas a mejorar',
      },
    ],
    completionCriteria: {
      type: 'automatic',
      conditions: ['Promedio de simulacros >= 80%', 'Al menos 3 simulacros completos'],
    },
    kpis: [
      { id: 'mock_avg_score', label: 'Promedio simulacros', target: 80, current: 0, unit: '%' },
      { id: 'mocks_completed', label: 'Simulacros realizados', target: 3, current: 0, unit: 'exámenes' },
      { id: 'weak_topics', label: 'Temas débiles restantes', target: 0, current: 10, unit: 'temas' },
    ],
  },
  {
    id: 'maintenance',
    name: 'Mantenimiento y Mejora',
    description: 'Mantén tu nivel y continúa mejorando',
    objective: 'Mantener dominio y prepararte para el examen real',
    estimatedTime: 'Continuo',
    actions: [
      {
        id: 'daily-review',
        label: 'Repaso Diario',
        route: '/app/biblioteca',
        icon: '🔄',
        isPrimary: true,
        description: 'Refuerza lo aprendido',
      },
      {
        id: 'compete',
        label: 'Competir en Rankings',
        route: '/app/ranking',
        icon: '🏆',
        isPrimary: false,
        description: 'Compite con otros estudiantes',
      },
      {
        id: 'scheduled-study',
        label: 'Seguir Agenda',
        route: '/app/agenda',
        icon: '📅',
        isPrimary: true,
        description: 'Mantén rutina de estudio',
      },
    ],
    completionCriteria: {
      type: 'manual',
      conditions: ['Mantener racha de 30 días', 'Dominio >= 85% en todas las materias'],
    },
    kpis: [
      { id: 'overall_mastery', label: 'Dominio general', target: 85, current: 0, unit: '%' },
      { id: 'long_streak', label: 'Racha continua', target: 30, current: 0, unit: 'días' },
      { id: 'review_sessions', label: 'Sesiones de repaso', target: 50, current: 0, unit: 'sesiones' },
    ],
  },
];

// ============================================================================
// FLUJO PROFESOR: Enseñanza Efectiva
// ============================================================================

export const TEACHER_FLOW: FlowStage[] = [
  {
    id: 'setup',
    name: 'Configuración Inicial',
    description: 'Prepara tu entorno de enseñanza',
    objective: 'Crear grupos, configurar materias y conocer herramientas',
    estimatedTime: '20-30 min',
    actions: [
      {
        id: 'create-groups',
        label: 'Crear Grupos',
        route: '/docente/grupos',
        icon: '👥',
        isPrimary: true,
        description: 'Organiza a tus estudiantes',
      },
      {
        id: 'setup-subjects',
        label: 'Configurar Materias',
        route: '/docente/banco-preguntas',
        icon: '📚',
        isPrimary: true,
        description: 'Define tus materias y temas',
      },
      {
        id: 'explore-tools',
        label: 'Explorar Herramientas',
        route: '/docente/dashboard',
        icon: '🛠️',
        isPrimary: false,
        description: 'Conoce las funcionalidades',
      },
    ],
    completionCriteria: {
      type: 'automatic',
      conditions: ['Al menos 1 grupo creado', 'Al menos 1 materia configurada'],
    },
    kpis: [
      { id: 'groups_created', label: 'Grupos creados', target: 1, current: 0, unit: 'grupos' },
      { id: 'students_added', label: 'Estudiantes agregados', target: 5, current: 0, unit: 'alumnos' },
    ],
  },
  {
    id: 'content',
    name: 'Creación de Contenido',
    description: 'Genera exámenes, tareas y materiales',
    objective: 'Crear banco de evaluaciones y actividades',
    estimatedTime: '1-2 horas',
    actions: [
      {
        id: 'create-exam',
        label: 'Crear Examen con IA',
        route: '/docente/crear-examen-ia',
        icon: '📝',
        isPrimary: true,
        description: 'Genera exámenes automáticamente',
      },
      {
        id: 'create-tasks',
        label: 'Asignar Tareas',
        route: '/docente/tareas',
        icon: '✅',
        isPrimary: true,
        description: 'Crea actividades para tus alumnos',
      },
      {
        id: 'question-bank',
        label: 'Banco de Preguntas',
        route: '/docente/banco-preguntas',
        icon: '🗂️',
        isPrimary: false,
        description: 'Organiza tus preguntas',
      },
    ],
    completionCriteria: {
      type: 'automatic',
      conditions: ['Al menos 2 exámenes creados', 'Al menos 3 tareas asignadas'],
    },
    kpis: [
      { id: 'exams_created', label: 'Exámenes creados', target: 2, current: 0, unit: 'exámenes' },
      { id: 'tasks_assigned', label: 'Tareas asignadas', target: 3, current: 0, unit: 'tareas' },
      { id: 'questions_bank', label: 'Preguntas en banco', target: 50, current: 0, unit: 'preguntas' },
    ],
  },
  {
    id: 'teaching',
    name: 'Enseñanza Activa',
    description: 'Imparte clases y da seguimiento',
    objective: 'Mantener engagement y monitorear progreso',
    estimatedTime: 'Continuo',
    actions: [
      {
        id: 'monitor-progress',
        label: 'Monitorear Progreso',
        route: '/docente/dashboard',
        icon: '📊',
        isPrimary: true,
        description: 'Revisa avances de estudiantes',
      },
      {
        id: 'communicate',
        label: 'Comunicarse',
        route: '/docente/comunicacion',
        icon: '💬',
        isPrimary: true,
        description: 'Mensajes y anuncios',
      },
      {
        id: 'screening',
        label: 'Screening de Dificultades',
        route: '/docente/screening',
        icon: '🔍',
        isPrimary: false,
        description: 'Detecta problemas de aprendizaje',
      },
    ],
    completionCriteria: {
      type: 'hybrid',
      conditions: [
        'Revisar dashboard diariamente',
        'Responder mensajes en < 24h',
        'Identificar 100% de alertas',
      ],
    },
    kpis: [
      { id: 'avg_student_progress', label: 'Progreso promedio alumnos', target: 75, current: 0, unit: '%' },
      { id: 'response_time', label: 'Tiempo de respuesta', target: 24, current: 0, unit: 'horas' },
      { id: 'alerts_addressed', label: 'Alertas atendidas', target: 100, current: 0, unit: '%' },
    ],
  },
  {
    id: 'evaluation',
    name: 'Evaluación y Retroalimentación',
    description: 'Califica y proporciona feedback',
    objective: 'Calificar con IA y dar retroalimentación de calidad',
    estimatedTime: 'Continuo',
    actions: [
      {
        id: 'grade',
        label: 'Calificar',
        route: '/docente/calificaciones',
        icon: '⭐',
        isPrimary: true,
        description: 'Sistema inteligente de calificación',
      },
      {
        id: 'review-results',
        label: 'Analizar Resultados',
        route: '/docente/resultados',
        icon: '📈',
        isPrimary: true,
        description: 'Identifica tendencias',
      },
      {
        id: 'ai-assistant',
        label: 'Asistente IA',
        route: '/docente/copiloto',
        icon: '🤖',
        isPrimary: false,
        description: 'Sugerencias automatizadas',
      },
    ],
    completionCriteria: {
      type: 'automatic',
      conditions: ['Calificar >= 90% de tareas pendientes', 'Feedback en todas las evaluaciones'],
    },
    kpis: [
      { id: 'grading_rate', label: 'Tasa de calificación', target: 90, current: 0, unit: '%' },
      { id: 'avg_feedback_length', label: 'Calidad de feedback', target: 50, current: 0, unit: 'palabras' },
      { id: 'time_saved', label: 'Tiempo ahorrado con IA', target: 5, current: 0, unit: 'horas/semana' },
    ],
  },
  {
    id: 'optimization',
    name: 'Optimización Continua',
    description: 'Mejora tus métodos de enseñanza',
    objective: 'Analizar datos y optimizar estrategias',
    estimatedTime: 'Continuo',
    actions: [
      {
        id: 'analytics',
        label: 'Analíticas Avanzadas',
        route: '/docente/resultados',
        icon: '📊',
        isPrimary: true,
        description: 'Insights profundos',
      },
      {
        id: 'adjust-content',
        label: 'Ajustar Contenido',
        route: '/docente/examenes',
        icon: '🔧',
        isPrimary: true,
        description: 'Basado en resultados',
      },
    ],
    completionCriteria: {
      type: 'manual',
      conditions: ['Revisar métricas semanalmente', 'Ajustar contenido según datos'],
    },
    kpis: [
      { id: 'student_satisfaction', label: 'Satisfacción estudiantes', target: 4.5, current: 0, unit: '/5' },
      { id: 'pass_rate', label: 'Tasa de aprobación', target: 85, current: 0, unit: '%' },
      { id: 'improvements_made', label: 'Ajustes realizados', target: 10, current: 0, unit: 'cambios' },
    ],
  },
];

// ============================================================================
// FLUJO DIRECTOR: Gestión Institucional
// ============================================================================

export const DIRECTOR_FLOW: FlowStage[] = [
  {
    id: 'setup',
    name: 'Configuración Institucional',
    description: 'Establece la estructura de tu escuela',
    objective: 'Configurar escuela y equipos',
    estimatedTime: '30-60 min',
    actions: [
      {
        id: 'school-config',
        label: 'Configurar Escuela',
        route: '/director/escuela',
        icon: '🏫',
        isPrimary: true,
        description: 'Información institucional',
      },
      {
        id: 'add-teachers',
        label: 'Agregar Profesores',
        route: '/director/docentes',
        icon: '👨‍🏫',
        isPrimary: true,
        description: 'Invita a tu equipo docente',
      },
      {
        id: 'add-students',
        label: 'Agregar Estudiantes',
        route: '/director/alumnos',
        icon: '👨‍🎓',
        isPrimary: true,
        description: 'Registro masivo de alumnos',
      },
    ],
    completionCriteria: {
      type: 'automatic',
      conditions: ['Información escolar completa', 'Al menos 3 profesores', 'Al menos 20 estudiantes'],
    },
    kpis: [
      { id: 'teachers_active', label: 'Profesores activos', target: 3, current: 0, unit: 'docentes' },
      { id: 'students_enrolled', label: 'Estudiantes inscritos', target: 20, current: 0, unit: 'alumnos' },
    ],
  },
  {
    id: 'monitoring',
    name: 'Monitoreo Académico',
    description: 'Supervisa el rendimiento institucional',
    objective: 'Monitorear KPIs y detectar problemas',
    estimatedTime: 'Continuo',
    actions: [
      {
        id: 'dashboard',
        label: 'Dashboard General',
        route: '/director/dashboard',
        icon: '📊',
        isPrimary: true,
        description: 'Vista general de la institución',
      },
      {
        id: 'academic-analysis',
        label: 'Análisis Académico',
        route: '/director/analisis',
        icon: '📈',
        isPrimary: true,
        description: 'Métricas detalladas',
      },
    ],
    completionCriteria: {
      type: 'hybrid',
      conditions: ['Revisar dashboard semanalmente', 'Identificar tendencias negativas'],
    },
    kpis: [
      { id: 'overall_performance', label: 'Rendimiento general', target: 80, current: 0, unit: '%' },
      { id: 'teacher_engagement', label: 'Engagement docentes', target: 90, current: 0, unit: '%' },
      { id: 'student_retention', label: 'Retención de alumnos', target: 95, current: 0, unit: '%' },
    ],
  },
  {
    id: 'intervention',
    name: 'Intervención y Mejora',
    description: 'Actúa sobre los datos',
    objective: 'Implementar mejoras basadas en datos',
    estimatedTime: 'Continuo',
    actions: [
      {
        id: 'support-teachers',
        label: 'Apoyar Profesores',
        route: '/director/docentes',
        icon: '🤝',
        isPrimary: true,
        description: 'Capacitación y recursos',
      },
      {
        id: 'support-students',
        label: 'Apoyar Estudiantes',
        route: '/director/alumnos',
        icon: '💪',
        isPrimary: true,
        description: 'Programas de apoyo',
      },
    ],
    completionCriteria: {
      type: 'manual',
      conditions: ['Implementar al menos 3 mejoras mensuales'],
    },
    kpis: [
      { id: 'interventions_made', label: 'Intervenciones realizadas', target: 3, current: 0, unit: 'acciones/mes' },
      { id: 'improvement_rate', label: 'Tasa de mejora', target: 15, current: 0, unit: '%' },
    ],
  },
];

// ============================================================================
// GESTIÓN DE ESTADO DE FLUJOS
// ============================================================================

const STORAGE_KEY = 'userFlow';

export function getUserFlow(userId: string): UserFlowState | null {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}:${userId}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function initializeUserFlow(user: User): UserFlowState {
  const existing = getUserFlow(user.id);
  if (existing) return existing;

  const flow = getFlowForRole(user.role);
  const firstStage = flow[0];

  const newState: UserFlowState = {
    userId: user.id,
    role: user.role,
    currentStageId: firstStage.id,
    completedStages: [],
    stageProgress: {},
    kpiValues: {},
    blockers: [],
    lastActivityDate: new Date().toISOString(),
    daysInactive: 0,
    flowCompletionPercentage: 0,
  };

  saveUserFlow(newState);
  return newState;
}

export function saveUserFlow(state: UserFlowState): void {
  localStorage.setItem(`${STORAGE_KEY}:${state.userId}`, JSON.stringify(state));
}

export function getFlowForRole(role: string): FlowStage[] {
  switch (role) {
    case 'alumno':
      return STUDENT_FLOW;
    case 'docente':
      return TEACHER_FLOW;
    case 'director':
      return DIRECTOR_FLOW;
    default:
      return [];
  }
}

export function getCurrentStage(userId: string): FlowStage | null {
  const state = getUserFlow(userId);
  if (!state) return null;

  const flow = getFlowForRole(state.role);
  return flow.find(s => s.id === state.currentStageId) || null;
}

export function getNextStage(userId: string): FlowStage | null {
  const state = getUserFlow(userId);
  if (!state) return null;

  const flow = getFlowForRole(state.role);
  const currentIndex = flow.findIndex(s => s.id === state.currentStageId);

  if (currentIndex >= 0 && currentIndex < flow.length - 1) {
    return flow[currentIndex + 1];
  }

  return null;
}

export function completeStage(userId: string, stageId: string): UserFlowState {
  const state = getUserFlow(userId);
  if (!state) throw new Error('User flow not initialized');

  if (!state.completedStages.includes(stageId)) {
    state.completedStages.push(stageId);
  }

  state.stageProgress[stageId] = 100;

  // Avanzar al siguiente stage
  const nextStage = getNextStage(userId);
  if (nextStage) {
    state.currentStageId = nextStage.id;
  }

  // Calcular porcentaje total de completación
  const flow = getFlowForRole(state.role);
  state.flowCompletionPercentage = Math.round((state.completedStages.length / flow.length) * 100);

  state.lastActivityDate = new Date().toISOString();
  state.daysInactive = 0;

  saveUserFlow(state);
  return state;
}

export function updateStageProgress(userId: string, stageId: string, progress: number): void {
  const state = getUserFlow(userId);
  if (!state) return;

  state.stageProgress[stageId] = Math.max(0, Math.min(100, progress));
  state.lastActivityDate = new Date().toISOString();
  saveUserFlow(state);
}

export function updateKPI(userId: string, kpiId: string, value: number): void {
  const state = getUserFlow(userId);
  if (!state) return;

  state.kpiValues[kpiId] = value;
  saveUserFlow(state);
}

export function addBlocker(userId: string, blocker: string): void {
  const state = getUserFlow(userId);
  if (!state) return;

  if (!state.blockers.includes(blocker)) {
    state.blockers.push(blocker);
    saveUserFlow(state);
  }
}

export function removeBlocker(userId: string, blocker: string): void {
  const state = getUserFlow(userId);
  if (!state) return;

  state.blockers = state.blockers.filter(b => b !== blocker);
  saveUserFlow(state);
}

export function calculateDaysInactive(userId: string): number {
  const state = getUserFlow(userId);
  if (!state) return 0;

  const lastActivity = new Date(state.lastActivityDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastActivity.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  state.daysInactive = diffDays;
  saveUserFlow(state);

  return diffDays;
}

export function getPrioritizedActions(userId: string): FlowAction[] {
  const currentStage = getCurrentStage(userId);
  if (!currentStage) return [];

  // Ordenar: primarias primero
  return [...currentStage.actions].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return 0;
  });
}

export function getCompletionSuggestion(userId: string): string {
  const state = getUserFlow(userId);
  const currentStage = getCurrentStage(userId);

  if (!state || !currentStage) {
    return 'Continúa explorando la plataforma';
  }

  const progress = state.stageProgress[currentStage.id] || 0;

  if (progress < 25) {
    return `Comienza con: ${currentStage.actions[0].label}`;
  } else if (progress < 75) {
    return `Sigue avanzando en: ${currentStage.name}`;
  } else {
    const nextStage = getNextStage(userId);
    if (nextStage) {
      return `¡Casi listo! Luego: ${nextStage.name}`;
    }
    return '¡Excelente progreso! Continúa así';
  }
}

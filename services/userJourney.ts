// services/userJourney.ts
import type { User } from '../types';

// Definición de pasos del onboarding para cada rol
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  completed: boolean;
  optional?: boolean;
}

export interface UserJourneyState {
  userId: string;
  role: string;
  currentStep: number;
  completedSteps: string[];
  skippedSteps: string[];
  onboardingCompleted: boolean;
  lastVisitedPage: string;
  tourSeen: { [key: string]: boolean };
  achievements: string[];
}

const STORAGE_KEY = 'userJourney';

// Pasos de onboarding por rol
export const ONBOARDING_STEPS: Record<string, OnboardingStep[]> = {
  alumno: [
    {
      id: 'welcome',
      title: '¡Bienvenido a TutoriA!',
      description: 'Conoce las funcionalidades principales de la plataforma',
      route: '/app/dashboard',
      icon: 'home',
      completed: false,
    },
    {
      id: 'profile',
      title: 'Completa tu perfil',
      description: 'Configura tu información personal y preferencias',
      route: '/app/configuracion',
      icon: 'user',
      completed: false,
    },
    {
      id: 'diagnosis',
      title: 'Diagnóstico inicial',
      description: 'Realiza una evaluación para personalizar tu plan de estudio',
      route: '/app/diagnostico',
      icon: 'brain',
      completed: false,
    },
    {
      id: 'subjects',
      title: 'Explora tus materias',
      description: 'Conoce el contenido y temarios disponibles',
      route: '/app/materias',
      icon: 'book',
      completed: false,
    },
    {
      id: 'chat',
      title: 'Conoce a tu tutor IA',
      description: 'Aprende a usar el asistente virtual para resolver dudas',
      route: '/app/chat',
      icon: 'bot',
      completed: false,
    },
    {
      id: 'practice',
      title: 'Primera práctica',
      description: 'Realiza tu primer ejercicio guiado',
      route: '/app/practicas',
      icon: 'pencil',
      completed: false,
      optional: true,
    },
  ],
  docente: [
    {
      id: 'welcome',
      title: '¡Bienvenido, Profesor!',
      description: 'Descubre las herramientas para gestionar tus clases',
      route: '/docente/dashboard',
      icon: 'home',
      completed: false,
    },
    {
      id: 'groups',
      title: 'Crea tus grupos',
      description: 'Organiza a tus estudiantes en grupos y materias',
      route: '/docente/grupos',
      icon: 'users',
      completed: false,
    },
    {
      id: 'exams',
      title: 'Crea tu primer examen',
      description: 'Usa el creador de exámenes con IA para generar evaluaciones',
      route: '/docente/crear-examen-ia',
      icon: 'file',
      completed: false,
    },
    {
      id: 'tasks',
      title: 'Asigna tareas',
      description: 'Gestiona actividades y tareas para tus estudiantes',
      route: '/docente/tareas',
      icon: 'checklist',
      completed: false,
    },
    {
      id: 'grading',
      title: 'Sistema de calificaciones',
      description: 'Aprende a calificar de manera eficiente',
      route: '/docente/calificaciones',
      icon: 'star',
      completed: false,
    },
    {
      id: 'communication',
      title: 'Comunícate con estudiantes',
      description: 'Usa el hub de comunicación para mensajes y anuncios',
      route: '/docente/comunicacion',
      icon: 'message',
      completed: false,
      optional: true,
    },
  ],
  director: [
    {
      id: 'welcome',
      title: '¡Bienvenido, Director!',
      description: 'Panel de control para gestionar toda la institución',
      route: '/director/dashboard',
      icon: 'home',
      completed: false,
    },
    {
      id: 'school',
      title: 'Configura tu escuela',
      description: 'Establece la información institucional',
      route: '/director/escuela',
      icon: 'building',
      completed: false,
    },
    {
      id: 'teachers',
      title: 'Gestiona profesores',
      description: 'Invita y administra al equipo docente',
      route: '/director/docentes',
      icon: 'users',
      completed: false,
    },
    {
      id: 'students',
      title: 'Gestiona estudiantes',
      description: 'Administra el registro de alumnos',
      route: '/director/alumnos',
      icon: 'graduation',
      completed: false,
    },
    {
      id: 'analytics',
      title: 'Analíticas académicas',
      description: 'Revisa el rendimiento general de la institución',
      route: '/director/analisis',
      icon: 'chart',
      completed: false,
    },
  ],
  admin: [
    {
      id: 'welcome',
      title: 'Panel de administración',
      description: 'Gestión completa de la plataforma',
      route: '/admin/dashboard',
      icon: 'shield',
      completed: false,
    },
  ],
};

// Tooltips contextuales por ruta
export const ROUTE_TOOLTIPS: Record<string, Array<{ selector: string; title: string; content: string; position: 'top' | 'bottom' | 'left' | 'right' }>> = {
  '/app/dashboard': [
    {
      selector: '[data-tour="stats"]',
      title: 'Tus estadísticas',
      content: 'Aquí puedes ver tu progreso general, XP acumulado y racha de estudio',
      position: 'bottom',
    },
    {
      selector: '[data-tour="subjects"]',
      title: 'Materias activas',
      content: 'Accede rápidamente a las materias que estás cursando',
      position: 'top',
    },
    {
      selector: '[data-tour="next-steps"]',
      title: 'Próximos pasos',
      content: 'Sugerencias personalizadas basadas en tu progreso',
      position: 'left',
    },
  ],
  '/docente/dashboard': [
    {
      selector: '[data-tour="overview"]',
      title: 'Vista general',
      content: 'Métricas clave de tus grupos y actividad reciente',
      position: 'bottom',
    },
    {
      selector: '[data-tour="quick-actions"]',
      title: 'Acciones rápidas',
      content: 'Atajos para las tareas más comunes',
      position: 'top',
    },
  ],
};

// Sugerencias contextuales por página
export const PAGE_SUGGESTIONS: Record<string, string[]> = {
  '/app/dashboard': [
    '💡 Consejo: Completa tu diagnóstico para obtener un plan de estudio personalizado',
    '🎯 Meta: Mantén una racha de estudio de 7 días para desbloquear un logro',
    '📚 Tip: Revisa tus materias para ver el progreso detallado',
  ],
  '/app/materias': [
    '📖 Explora los temarios para conocer todos los temas disponibles',
    '✨ Usa el chat con IA si tienes dudas sobre algún tema',
    '🎓 Los temas que dominas se marcan con ✓',
  ],
  '/app/chat': [
    '🤖 El tutor IA puede explicarte cualquier tema del temario',
    '💬 Puedes pedir ejemplos, ejercicios o explicaciones paso a paso',
    '📝 Usa el modo guiado para sesiones de estudio estructuradas',
  ],
  '/docente/dashboard': [
    '⚡ Usa el creador de exámenes con IA para ahorrar tiempo',
    '📊 Revisa las analíticas de tus grupos regularmente',
    '✅ El sistema de calificaciones incluye sugerencias de IA',
  ],
  '/docente/crear-examen-ia': [
    '🎯 Define claramente el tema y dificultad para mejores resultados',
    '🔄 Puedes regenerar preguntas individuales si no te convencen',
    '👀 Revisa siempre las preguntas antes de asignar el examen',
  ],
  '/docente/calificaciones': [
    '⚡ Usa los atajos de teclado para calificar más rápido',
    '🤖 La IA puede sugerir retroalimentación automática',
    '📊 Las estadísticas se actualizan en tiempo real',
  ],
};

// Quick actions por rol y página
export const QUICK_ACTIONS: Record<string, Array<{ label: string; icon: string; route: string; description: string }>> = {
  alumno: [
    { label: 'Practicar', icon: 'pencil', route: '/app/practicas', description: 'Ejercicios adaptativos' },
    { label: 'Consultar IA', icon: 'bot', route: '/app/chat', description: 'Resuelve tus dudas' },
    { label: 'Ver progreso', icon: 'chart', route: '/app/progreso', description: 'Estadísticas detalladas' },
    { label: 'Jugar', icon: 'gamepad', route: '/app/juegos', description: 'Juegos cognitivos' },
  ],
  docente: [
    { label: 'Crear examen', icon: 'file', route: '/docente/crear-examen-ia', description: 'Con IA' },
    { label: 'Calificar', icon: 'star', route: '/docente/calificaciones', description: 'Pendientes' },
    { label: 'Nueva tarea', icon: 'plus', route: '/docente/tareas', description: 'Asignar actividad' },
    { label: 'Mensaje', icon: 'message', route: '/docente/comunicacion', description: 'Contactar estudiantes' },
  ],
  director: [
    { label: 'Analíticas', icon: 'chart', route: '/director/analisis', description: 'Rendimiento general' },
    { label: 'Profesores', icon: 'users', route: '/director/docentes', description: 'Gestionar equipo' },
    { label: 'Estudiantes', icon: 'graduation', route: '/director/alumnos', description: 'Administrar alumnos' },
  ],
};

// Funciones del servicio
export function getUserJourney(userId: string): UserJourneyState | null {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}:${userId}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function initializeUserJourney(user: User): UserJourneyState {
  const existing = getUserJourney(user.id);
  if (existing) return existing;

  const newState: UserJourneyState = {
    userId: user.id,
    role: user.role,
    currentStep: 0,
    completedSteps: [],
    skippedSteps: [],
    onboardingCompleted: false,
    lastVisitedPage: '',
    tourSeen: {},
    achievements: [],
  };

  saveUserJourney(newState);
  return newState;
}

export function saveUserJourney(state: UserJourneyState): void {
  localStorage.setItem(`${STORAGE_KEY}:${state.userId}`, JSON.stringify(state));
}

export function completeStep(userId: string, stepId: string): UserJourneyState {
  const state = getUserJourney(userId);
  if (!state) throw new Error('User journey not initialized');

  if (!state.completedSteps.includes(stepId)) {
    state.completedSteps.push(stepId);
  }

  // Actualizar paso actual
  const steps = ONBOARDING_STEPS[state.role] || [];
  const nextIncompleteIndex = steps.findIndex(s => !state.completedSteps.includes(s.id) && !s.optional);
  state.currentStep = nextIncompleteIndex >= 0 ? nextIncompleteIndex : steps.length;

  // Verificar si el onboarding está completo
  const requiredSteps = steps.filter(s => !s.optional);
  const completedRequired = requiredSteps.filter(s => state.completedSteps.includes(s.id));
  state.onboardingCompleted = completedRequired.length === requiredSteps.length;

  saveUserJourney(state);
  return state;
}

export function skipStep(userId: string, stepId: string): UserJourneyState {
  const state = getUserJourney(userId);
  if (!state) throw new Error('User journey not initialized');

  if (!state.skippedSteps.includes(stepId)) {
    state.skippedSteps.push(stepId);
  }

  const steps = ONBOARDING_STEPS[state.role] || [];
  state.currentStep = Math.min(state.currentStep + 1, steps.length);

  saveUserJourney(state);
  return state;
}

export function markTourSeen(userId: string, tourKey: string): void {
  const state = getUserJourney(userId);
  if (!state) return;

  state.tourSeen[tourKey] = true;
  saveUserJourney(state);
}

export function shouldShowTour(userId: string, tourKey: string): boolean {
  const state = getUserJourney(userId);
  if (!state) return true;
  return !state.tourSeen[tourKey];
}

export function updateLastVisitedPage(userId: string, page: string): void {
  const state = getUserJourney(userId);
  if (!state) return;

  state.lastVisitedPage = page;
  saveUserJourney(state);
}

export function getOnboardingProgress(userId: string): { completed: number; total: number; percentage: number } {
  const state = getUserJourney(userId);
  if (!state) return { completed: 0, total: 0, percentage: 0 };

  const steps = ONBOARDING_STEPS[state.role] || [];
  const requiredSteps = steps.filter(s => !s.optional);
  const completed = requiredSteps.filter(s => state.completedSteps.includes(s.id)).length;

  return {
    completed,
    total: requiredSteps.length,
    percentage: Math.round((completed / requiredSteps.length) * 100),
  };
}

export function getCurrentStepInfo(userId: string): OnboardingStep | null {
  const state = getUserJourney(userId);
  if (!state) return null;

  const steps = ONBOARDING_STEPS[state.role] || [];
  return steps[state.currentStep] || null;
}

export function getNextSuggestedAction(userId: string, currentRoute: string): { title: string; description: string; route: string; icon: string } | null {
  const state = getUserJourney(userId);
  if (!state) return null;

  // Si el onboarding no está completo, sugerir siguiente paso
  if (!state.onboardingCompleted) {
    const currentStep = getCurrentStepInfo(userId);
    if (currentStep) {
      return {
        title: currentStep.title,
        description: currentStep.description,
        route: currentStep.route,
        icon: currentStep.icon,
      };
    }
  }

  // Sugerencias contextuales basadas en la ruta actual
  const suggestions = PAGE_SUGGESTIONS[currentRoute];
  if (suggestions && suggestions.length > 0) {
    // Retornar una sugerencia aleatoria
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    return {
      title: '💡 Sugerencia',
      description: randomSuggestion,
      route: currentRoute,
      icon: 'lightbulb',
    };
  }

  return null;
}

export function resetUserJourney(userId: string): void {
  localStorage.removeItem(`${STORAGE_KEY}:${userId}`);
}

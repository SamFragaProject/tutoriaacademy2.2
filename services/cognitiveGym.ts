// services/cognitiveGym.ts
/**
 * GIMNASIO COGNITIVO COMPLETO
 * Sistema gamificado para entrenar diferentes áreas cognitivas
 * con progreso, niveles, desafíos y recompensas
 */

import { Brain, Eye, Zap, Shuffle, Trophy, Target, Dumbbell, Star } from 'lucide-react';
import React from 'react';

// ============================================================================
// TIPOS Y ESTRUCTURAS
// ============================================================================

export type GymAreaId = 'memoria' | 'atencion' | 'velocidad' | 'flexibilidad' | 'logica' | 'creatividad';
export type DifficultyLevel = 'principiante' | 'intermedio' | 'avanzado' | 'experto' | 'maestro';
export type ActivityType = 'juego' | 'ejercicio' | 'desafio' | 'rutina';

export interface CognitiveSkillMetric {
  name: string;
  value: number; // 0-100
  maxValue: number;
  icon: React.ElementType;
  color: string;
  gradient: string;
  description: string;
}

export interface GymArea {
  id: GymAreaId;
  name: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  description: string;
  benefits: string[];
  skills: CognitiveSkillMetric[];
  activities: GymActivity[];
  totalXP: number;
  level: number;
  currentXP: number;
  nextLevelXP: number;
}

export interface GymActivity {
  id: string;
  areaId: GymAreaId;
  type: ActivityType;
  name: string;
  description: string;
  shortDescription: string;
  icon: React.ElementType;
  difficulty: DifficultyLevel;
  duration: number; // minutos estimados
  xpReward: number;
  coinReward: number;
  requiredLevel?: number;
  unlocked: boolean;
  completed: boolean;
  bestScore?: number;
  timesPlayed: number;
  tags: string[];
}

export interface GymChallenge {
  id: string;
  type: 'diario' | 'semanal' | 'mensual' | 'especial';
  name: string;
  description: string;
  icon: React.ElementType;
  areaId?: GymAreaId; // undefined = challenge global
  target: number;
  current: number;
  reward: {
    xp: number;
    coins: number;
    badge?: string;
  };
  expiresAt: Date;
  completed: boolean;
}

export interface GymAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'común' | 'raro' | 'épico' | 'legendario';
  areaId?: GymAreaId;
  requirement: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  total?: number;
}

export interface GymStats {
  totalWorkouts: number;
  totalTimeMinutes: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  coins: number;
  areasCompleted: number;
  activitiesCompleted: number;
  challengesCompleted: number;
  achievementsUnlocked: number;
  favoriteArea?: GymAreaId;
  lastWorkoutDate?: Date;
}

export interface GymUserProfile {
  userId: string;
  stats: GymStats;
  areas: Map<GymAreaId, {
    level: number;
    xp: number;
    completedActivities: string[];
    bestScores: Map<string, number>;
  }>;
  challenges: GymChallenge[];
  achievements: GymAchievement[];
  preferences: {
    dailyGoalMinutes: number;
    notificationsEnabled: boolean;
    favoriteAreas: GymAreaId[];
  };
}

// ============================================================================
// DEFINICIÓN DE ÁREAS DEL GIMNASIO
// ============================================================================

export const GYM_AREAS: Record<GymAreaId, Omit<GymArea, 'totalXP' | 'level' | 'currentXP' | 'nextLevelXP' | 'activities'>> = {
  memoria: {
    id: 'memoria',
    name: 'Memoria de Trabajo',
    icon: Brain,
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Entrena tu capacidad para retener y manipular información a corto plazo',
    benefits: [
      'Mejor cálculo mental',
      'Resolución de problemas complejos',
      'Seguimiento de múltiples pasos',
      'Comprensión de lecturas largas'
    ],
    skills: [
      {
        name: 'Span Visual',
        value: 60,
        maxValue: 100,
        icon: Eye,
        color: 'text-purple-500',
        gradient: 'from-purple-500 to-pink-500',
        description: 'Capacidad para recordar patrones visuales'
      },
      {
        name: 'Span Auditivo',
        value: 55,
        maxValue: 100,
        icon: Brain,
        color: 'text-purple-600',
        gradient: 'from-purple-600 to-pink-600',
        description: 'Capacidad para recordar secuencias de palabras'
      }
    ]
  },
  atencion: {
    id: 'atencion',
    name: 'Atención Sostenida',
    icon: Eye,
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Mejora tu capacidad de concentración y resistencia a distracciones',
    benefits: [
      'Mayor concentración en clase',
      'Menos errores por descuido',
      'Mejor rendimiento en exámenes',
      'Estudio más eficiente'
    ],
    skills: [
      {
        name: 'Atención Selectiva',
        value: 70,
        maxValue: 100,
        icon: Target,
        color: 'text-blue-500',
        gradient: 'from-blue-500 to-cyan-500',
        description: 'Capacidad para enfocarte en lo importante'
      },
      {
        name: 'Resistencia Mental',
        value: 65,
        maxValue: 100,
        icon: Dumbbell,
        color: 'text-blue-600',
        gradient: 'from-blue-600 to-cyan-600',
        description: 'Mantener concentración por períodos largos'
      }
    ]
  },
  velocidad: {
    id: 'velocidad',
    name: 'Velocidad de Procesamiento',
    icon: Zap,
    color: 'text-yellow-500',
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Aumenta tu rapidez mental para procesar información',
    benefits: [
      'Lectura más rápida',
      'Respuestas más ágiles',
      'Mejor gestión del tiempo',
      'Reacciones más rápidas'
    ],
    skills: [
      {
        name: 'Velocidad Lectora',
        value: 58,
        maxValue: 100,
        icon: Zap,
        color: 'text-yellow-500',
        gradient: 'from-yellow-500 to-orange-500',
        description: 'Palabras por minuto con comprensión'
      },
      {
        name: 'Velocidad de Decisión',
        value: 62,
        maxValue: 100,
        icon: Target,
        color: 'text-yellow-600',
        gradient: 'from-yellow-600 to-orange-600',
        description: 'Rapidez para tomar decisiones correctas'
      }
    ]
  },
  flexibilidad: {
    id: 'flexibilidad',
    name: 'Flexibilidad Cognitiva',
    icon: Shuffle,
    color: 'text-green-500',
    gradient: 'from-green-500 to-emerald-500',
    description: 'Desarrolla tu capacidad para cambiar entre tareas y perspectivas',
    benefits: [
      'Mejor adaptación a cambios',
      'Resolución creativa de problemas',
      'Manejo de múltiples materias',
      'Pensamiento alternativo'
    ],
    skills: [
      {
        name: 'Cambio de Tarea',
        value: 66,
        maxValue: 100,
        icon: Shuffle,
        color: 'text-green-500',
        gradient: 'from-green-500 to-emerald-500',
        description: 'Rapidez para cambiar entre actividades'
      },
      {
        name: 'Pensamiento Alternativo',
        value: 60,
        maxValue: 100,
        icon: Brain,
        color: 'text-green-600',
        gradient: 'from-green-600 to-emerald-600',
        description: 'Capacidad de ver problemas desde diferentes ángulos'
      }
    ]
  },
  logica: {
    id: 'logica',
    name: 'Razonamiento Lógico',
    icon: Trophy,
    color: 'text-red-500',
    gradient: 'from-red-500 to-rose-500',
    description: 'Fortalece tu capacidad para resolver problemas y pensar de forma lógica',
    benefits: [
      'Mejor desempeño en matemáticas',
      'Detección de patrones',
      'Resolución sistemática',
      'Análisis crítico'
    ],
    skills: [
      {
        name: 'Razonamiento Deductivo',
        value: 72,
        maxValue: 100,
        icon: Target,
        color: 'text-red-500',
        gradient: 'from-red-500 to-rose-500',
        description: 'Capacidad de llegar a conclusiones lógicas'
      },
      {
        name: 'Detección de Patrones',
        value: 68,
        maxValue: 100,
        icon: Brain,
        color: 'text-red-600',
        gradient: 'from-red-600 to-rose-600',
        description: 'Identificar relaciones y secuencias'
      }
    ]
  },
  creatividad: {
    id: 'creatividad',
    name: 'Pensamiento Creativo',
    icon: Star,
    color: 'text-pink-500',
    gradient: 'from-pink-500 to-fuchsia-500',
    description: 'Estimula tu creatividad y pensamiento divergente',
    benefits: [
      'Soluciones innovadoras',
      'Mejor expresión escrita',
      'Conexiones inesperadas',
      'Aprendizaje memorable'
    ],
    skills: [
      {
        name: 'Fluidez de Ideas',
        value: 64,
        maxValue: 100,
        icon: Star,
        color: 'text-pink-500',
        gradient: 'from-pink-500 to-fuchsia-500',
        description: 'Generar múltiples soluciones'
      },
      {
        name: 'Originalidad',
        value: 58,
        maxValue: 100,
        icon: Brain,
        color: 'text-pink-600',
        gradient: 'from-pink-600 to-fuchsia-600',
        description: 'Pensar fuera de lo convencional'
      }
    ]
  }
};

// ============================================================================
// ACTIVIDADES DEL GIMNASIO
// ============================================================================

export const GYM_ACTIVITIES: GymActivity[] = [
  // ========== MEMORIA ==========
  {
    id: 'n-track',
    areaId: 'memoria',
    type: 'juego',
    name: 'N-Track Challenge',
    description: 'Juego clásico de memoria de trabajo. Recuerda si el símbolo actual es igual al que apareció N posiciones atrás.',
    shortDescription: 'Entrena tu memoria de trabajo',
    icon: Brain,
    difficulty: 'intermedio',
    duration: 5,
    xpReward: 50,
    coinReward: 10,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['memoria', 'concentración', 'clásico']
  },
  {
    id: 'memory-matrix',
    areaId: 'memoria',
    type: 'ejercicio',
    name: 'Matriz de Memoria',
    description: 'Memoriza la posición de elementos en una cuadrícula y recréala de memoria.',
    shortDescription: 'Memoriza patrones espaciales',
    icon: Target,
    difficulty: 'principiante',
    duration: 3,
    xpReward: 30,
    coinReward: 5,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['memoria', 'visual', 'espacial']
  },
  {
    id: 'digit-span',
    areaId: 'memoria',
    type: 'ejercicio',
    name: 'Span de Dígitos',
    description: 'Recuerda secuencias de números cada vez más largas.',
    shortDescription: 'Aumenta tu capacidad de memoria',
    icon: Brain,
    difficulty: 'principiante',
    duration: 2,
    xpReward: 25,
    coinReward: 5,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['memoria', 'números', 'clásico']
  },
  {
    id: 'chunking-master',
    areaId: 'memoria',
    type: 'rutina',
    name: 'Maestro del Chunking',
    description: 'Aprende técnicas de agrupación para memorizar fórmulas y conceptos complejos.',
    shortDescription: 'Técnica de agrupación efectiva',
    icon: Dumbbell,
    difficulty: 'avanzado',
    duration: 10,
    xpReward: 100,
    coinReward: 25,
    requiredLevel: 5,
    unlocked: false,
    completed: false,
    timesPlayed: 0,
    tags: ['memoria', 'técnica', 'estudio']
  },

  // ========== ATENCIÓN ==========
  {
    id: 'focus-switch',
    areaId: 'atencion',
    type: 'juego',
    name: 'Focus Switch',
    description: 'Cambia rápidamente entre diferentes reglas de clasificación (color vs forma).',
    shortDescription: 'Entrena tu atención selectiva',
    icon: Shuffle,
    difficulty: 'intermedio',
    duration: 4,
    xpReward: 45,
    coinReward: 10,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['atención', 'flexibilidad', 'velocidad']
  },
  {
    id: 'stroop-effect',
    areaId: 'atencion',
    type: 'ejercicio',
    name: 'Efecto Stroop',
    description: 'Nombra el color de la tinta ignorando la palabra escrita. Clásico test de atención selectiva.',
    shortDescription: 'Control inhibitorio',
    icon: Eye,
    difficulty: 'principiante',
    duration: 3,
    xpReward: 35,
    coinReward: 7,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['atención', 'control', 'clásico']
  },
  {
    id: 'target-hunt',
    areaId: 'atencion',
    type: 'juego',
    name: 'Caza de Objetivos',
    description: 'Encuentra objetivos específicos entre distractores en tiempo límite.',
    shortDescription: 'Búsqueda visual rápida',
    icon: Target,
    difficulty: 'principiante',
    duration: 3,
    xpReward: 30,
    coinReward: 6,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['atención', 'visual', 'velocidad']
  },
  {
    id: 'sustained-attention',
    areaId: 'atencion',
    type: 'desafio',
    name: 'Maratón de Atención',
    description: 'Mantén tu concentración durante 20 minutos seguidos respondiendo a estímulos.',
    shortDescription: 'Resistencia atencional',
    icon: Dumbbell,
    difficulty: 'experto',
    duration: 20,
    xpReward: 200,
    coinReward: 50,
    requiredLevel: 10,
    unlocked: false,
    completed: false,
    timesPlayed: 0,
    tags: ['atención', 'resistencia', 'desafío']
  },

  // ========== VELOCIDAD ==========
  {
    id: 'rsvp-gist',
    areaId: 'velocidad',
    type: 'juego',
    name: 'RSVP Speed Reader',
    description: 'Lee palabras presentadas a alta velocidad y responde preguntas de comprensión.',
    shortDescription: 'Aumenta tu velocidad lectora',
    icon: Zap,
    difficulty: 'intermedio',
    duration: 4,
    xpReward: 40,
    coinReward: 8,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['velocidad', 'lectura', 'comprensión']
  },
  {
    id: 'rapid-math',
    areaId: 'velocidad',
    type: 'ejercicio',
    name: 'Matemáticas Rápidas',
    description: 'Resuelve operaciones aritméticas simples lo más rápido posible.',
    shortDescription: 'Cálculo mental veloz',
    icon: Zap,
    difficulty: 'principiante',
    duration: 2,
    xpReward: 25,
    coinReward: 5,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['velocidad', 'matemáticas', 'mental']
  },
  {
    id: 'reaction-time',
    areaId: 'velocidad',
    type: 'ejercicio',
    name: 'Tiempo de Reacción',
    description: 'Mide y mejora tu velocidad de respuesta a estímulos visuales.',
    shortDescription: 'Reflejos mentales',
    icon: Target,
    difficulty: 'principiante',
    duration: 2,
    xpReward: 20,
    coinReward: 4,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['velocidad', 'reacción', 'simple']
  },
  {
    id: 'speed-circuit',
    areaId: 'velocidad',
    type: 'rutina',
    name: 'Circuito de Velocidad',
    description: 'Completa una serie de 5 ejercicios de velocidad consecutivos.',
    shortDescription: 'Entrenamiento intensivo',
    icon: Dumbbell,
    difficulty: 'avanzado',
    duration: 15,
    xpReward: 150,
    coinReward: 35,
    requiredLevel: 7,
    unlocked: false,
    completed: false,
    timesPlayed: 0,
    tags: ['velocidad', 'rutina', 'completo']
  },

  // ========== FLEXIBILIDAD ==========
  {
    id: 'set-switching',
    areaId: 'flexibilidad',
    type: 'ejercicio',
    name: 'Cambio de Set',
    description: 'Alterna entre diferentes reglas de clasificación rápidamente.',
    shortDescription: 'Flexibilidad mental',
    icon: Shuffle,
    difficulty: 'intermedio',
    duration: 4,
    xpReward: 40,
    coinReward: 8,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['flexibilidad', 'categorización', 'cambio']
  },
  {
    id: 'perspective-shift',
    areaId: 'flexibilidad',
    type: 'juego',
    name: 'Cambio de Perspectiva',
    description: 'Resuelve problemas mirándolos desde diferentes ángulos y enfoques.',
    shortDescription: 'Pensamiento alternativo',
    icon: Brain,
    difficulty: 'avanzado',
    duration: 6,
    xpReward: 60,
    coinReward: 15,
    requiredLevel: 3,
    unlocked: false,
    completed: false,
    timesPlayed: 0,
    tags: ['flexibilidad', 'creatividad', 'problema']
  },
  {
    id: 'multi-task-trainer',
    areaId: 'flexibilidad',
    type: 'desafio',
    name: 'Entrenador Multitarea',
    description: 'Maneja dos tareas simultáneas sin perder rendimiento en ninguna.',
    shortDescription: 'Multitarea eficiente',
    icon: Dumbbell,
    difficulty: 'experto',
    duration: 8,
    xpReward: 120,
    coinReward: 30,
    requiredLevel: 8,
    unlocked: false,
    completed: false,
    timesPlayed: 0,
    tags: ['flexibilidad', 'multitarea', 'avanzado']
  },

  // ========== LÓGICA ==========
  {
    id: 'pattern-finder',
    areaId: 'logica',
    type: 'ejercicio',
    name: 'Buscador de Patrones',
    description: 'Identifica patrones numéricos y completa secuencias lógicas.',
    shortDescription: 'Reconocimiento de patrones',
    icon: Target,
    difficulty: 'principiante',
    duration: 3,
    xpReward: 30,
    coinReward: 6,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['lógica', 'patrones', 'secuencias']
  },
  {
    id: 'logic-puzzles',
    areaId: 'logica',
    type: 'juego',
    name: 'Acertijos Lógicos',
    description: 'Resuelve acertijos que requieren razonamiento deductivo.',
    shortDescription: 'Razonamiento deductivo',
    icon: Trophy,
    difficulty: 'intermedio',
    duration: 5,
    xpReward: 50,
    coinReward: 12,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['lógica', 'deducción', 'puzzle']
  },
  {
    id: 'syllogisms',
    areaId: 'logica',
    type: 'ejercicio',
    name: 'Silogismos',
    description: 'Evalúa la validez de argumentos lógicos basados en premisas.',
    shortDescription: 'Lógica formal',
    icon: Brain,
    difficulty: 'avanzado',
    duration: 4,
    xpReward: 55,
    coinReward: 13,
    requiredLevel: 4,
    unlocked: false,
    completed: false,
    timesPlayed: 0,
    tags: ['lógica', 'argumentación', 'formal']
  },

  // ========== CREATIVIDAD ==========
  {
    id: 'word-association',
    areaId: 'creatividad',
    type: 'ejercicio',
    name: 'Asociación de Palabras',
    description: 'Genera tantas asociaciones creativas como puedas en tiempo límite.',
    shortDescription: 'Fluidez de ideas',
    icon: Star,
    difficulty: 'principiante',
    duration: 3,
    xpReward: 30,
    coinReward: 6,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['creatividad', 'lenguaje', 'fluidez']
  },
  {
    id: 'alternative-uses',
    areaId: 'creatividad',
    type: 'juego',
    name: 'Usos Alternativos',
    description: 'Piensa en usos creativos e inusuales para objetos cotidianos.',
    shortDescription: 'Pensamiento divergente',
    icon: Brain,
    difficulty: 'intermedio',
    duration: 5,
    xpReward: 45,
    coinReward: 10,
    unlocked: true,
    completed: false,
    timesPlayed: 0,
    tags: ['creatividad', 'divergente', 'innovación']
  },
  {
    id: 'story-builder',
    areaId: 'creatividad',
    type: 'rutina',
    name: 'Constructor de Historias',
    description: 'Crea historias originales conectando conceptos aparentemente no relacionados.',
    shortDescription: 'Narrativa creativa',
    icon: Star,
    difficulty: 'avanzado',
    duration: 10,
    xpReward: 80,
    coinReward: 20,
    requiredLevel: 5,
    unlocked: false,
    completed: false,
    timesPlayed: 0,
    tags: ['creatividad', 'narrativa', 'conexiones']
  }
];

// ============================================================================
// LOGROS DEL GIMNASIO
// ============================================================================

export const GYM_ACHIEVEMENTS: Omit<GymAchievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  // Generales
  {
    id: 'first-workout',
    name: 'Primera Sesión',
    description: 'Completa tu primer entrenamiento en el gimnasio',
    icon: '🎯',
    rarity: 'común',
    requirement: 'Completar 1 actividad',
    total: 1
  },
  {
    id: 'gym-regular',
    name: 'Asiduo del Gimnasio',
    description: 'Entrena 7 días consecutivos',
    icon: '🔥',
    rarity: 'raro',
    requirement: 'Racha de 7 días',
    total: 7
  },
  {
    id: 'gym-addict',
    name: 'Adicto al Entrenamiento',
    description: 'Entrena 30 días consecutivos',
    icon: '💪',
    rarity: 'épico',
    requirement: 'Racha de 30 días',
    total: 30
  },
  {
    id: 'gym-legend',
    name: 'Leyenda del Gimnasio',
    description: 'Alcanza el nivel máximo en todas las áreas',
    icon: '👑',
    rarity: 'legendario',
    requirement: 'Nivel 20 en todas las áreas',
    total: 6
  },
  
  // Por área
  {
    id: 'memory-master',
    name: 'Maestro de la Memoria',
    description: 'Alcanza nivel 10 en Memoria de Trabajo',
    icon: '🧠',
    rarity: 'épico',
    areaId: 'memoria',
    requirement: 'Nivel 10 en Memoria',
    total: 10
  },
  {
    id: 'attention-expert',
    name: 'Experto en Atención',
    description: 'Alcanza nivel 10 en Atención Sostenida',
    icon: '👁️',
    rarity: 'épico',
    areaId: 'atencion',
    requirement: 'Nivel 10 en Atención',
    total: 10
  },
  {
    id: 'speed-demon',
    name: 'Demonio de la Velocidad',
    description: 'Alcanza nivel 10 en Velocidad de Procesamiento',
    icon: '⚡',
    rarity: 'épico',
    areaId: 'velocidad',
    requirement: 'Nivel 10 en Velocidad',
    total: 10
  },
  {
    id: 'flexibility-pro',
    name: 'Pro de la Flexibilidad',
    description: 'Alcanza nivel 10 en Flexibilidad Cognitiva',
    icon: '🔄',
    rarity: 'épico',
    areaId: 'flexibilidad',
    requirement: 'Nivel 10 en Flexibilidad',
    total: 10
  },
  {
    id: 'logic-wizard',
    name: 'Mago de la Lógica',
    description: 'Alcanza nivel 10 en Razonamiento Lógico',
    icon: '🎲',
    rarity: 'épico',
    areaId: 'logica',
    requirement: 'Nivel 10 en Lógica',
    total: 10
  },
  {
    id: 'creative-genius',
    name: 'Genio Creativo',
    description: 'Alcanza nivel 10 en Pensamiento Creativo',
    icon: '✨',
    rarity: 'épico',
    areaId: 'creatividad',
    requirement: 'Nivel 10 en Creatividad',
    total: 10
  },

  // Por actividades
  {
    id: 'completionist',
    name: 'Completista',
    description: 'Completa todas las actividades disponibles',
    icon: '🏆',
    rarity: 'legendario',
    requirement: 'Completar todas las actividades',
    total: GYM_ACTIVITIES.length
  },
  {
    id: 'challenger',
    name: 'Desafiante',
    description: 'Completa 10 desafíos',
    icon: '⚔️',
    rarity: 'raro',
    requirement: 'Completar 10 desafíos',
    total: 10
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Obtén puntuación perfecta en 5 actividades diferentes',
    icon: '💎',
    rarity: 'épico',
    requirement: 'Puntuación perfecta x5',
    total: 5
  }
];

// ============================================================================
// FUNCIONES DE GESTIÓN
// ============================================================================

const STORAGE_KEY = 'cognitive_gym_profile';

/**
 * Inicializa el perfil del gimnasio para un usuario
 */
export const initializeGymProfile = (userId: string): GymUserProfile => {
  const profile: GymUserProfile = {
    userId,
    stats: {
      totalWorkouts: 0,
      totalTimeMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalXP: 0,
      level: 1,
      coins: 0,
      areasCompleted: 0,
      activitiesCompleted: 0,
      challengesCompleted: 0,
      achievementsUnlocked: 0
    },
    areas: new Map(),
    challenges: generateDailyChallenges(),
    achievements: GYM_ACHIEVEMENTS.map(ach => ({
      ...ach,
      unlocked: false,
      progress: 0
    })),
    preferences: {
      dailyGoalMinutes: 15,
      notificationsEnabled: true,
      favoriteAreas: []
    }
  };

  // Inicializar todas las áreas
  Object.keys(GYM_AREAS).forEach((areaId) => {
    profile.areas.set(areaId as GymAreaId, {
      level: 1,
      xp: 0,
      completedActivities: [],
      bestScores: new Map()
    });
  });

  saveGymProfile(profile);
  return profile;
};

/**
 * Obtiene el perfil del gimnasio del usuario
 */
export const getGymProfile = (userId: string): GymUserProfile => {
  const stored = localStorage.getItem(`${STORAGE_KEY}:${userId}`);
  if (stored) {
    const parsed = JSON.parse(stored);
    // Reconstruir Map objects
    parsed.areas = new Map(Object.entries(parsed.areas || {}));
    parsed.areas.forEach((area: any) => {
      area.bestScores = new Map(Object.entries(area.bestScores || {}));
    });
    return parsed;
  }
  return initializeGymProfile(userId);
};

/**
 * Guarda el perfil del gimnasio
 */
export const saveGymProfile = (profile: GymUserProfile): void => {
  // Convertir Maps a objetos para serializar
  const toSave: any = {
    ...profile,
    areas: Object.fromEntries(profile.areas),
  };
  
  // Convertir nested Maps
  Object.keys(toSave.areas).forEach(key => {
    toSave.areas[key].bestScores = Object.fromEntries(toSave.areas[key].bestScores);
  });
  
  localStorage.setItem(`${STORAGE_KEY}:${profile.userId}`, JSON.stringify(toSave));
};

/**
 * Completa una actividad y actualiza el perfil
 */
export const completeActivity = (
  userId: string,
  activityId: string,
  score: number,
  timeSpent: number
): { xpGained: number; coinsGained: number; leveledUp: boolean; areaLeveledUp: boolean; newAchievements: string[] } => {
  const profile = getGymProfile(userId);
  const activity = GYM_ACTIVITIES.find(a => a.id === activityId);
  
  if (!activity) {
    throw new Error(`Activity ${activityId} not found`);
  }

  const areaData = profile.areas.get(activity.areaId)!;
  const newAchievements: string[] = [];
  
  // Actualizar stats globales
  profile.stats.totalWorkouts++;
  profile.stats.totalTimeMinutes += timeSpent;
  profile.stats.totalXP += activity.xpReward;
  profile.stats.coins += activity.coinReward;
  
  // Actualizar streak
  const today = new Date().toDateString();
  const lastWorkout = profile.stats.lastWorkoutDate ? new Date(profile.stats.lastWorkoutDate).toDateString() : null;
  
  if (lastWorkout !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastWorkout === yesterday) {
      profile.stats.currentStreak++;
    } else {
      profile.stats.currentStreak = 1;
    }
    profile.stats.lastWorkoutDate = new Date();
    profile.stats.longestStreak = Math.max(profile.stats.longestStreak, profile.stats.currentStreak);
  }
  
  // Actualizar área específica
  if (!areaData.completedActivities.includes(activityId)) {
    areaData.completedActivities.push(activityId);
    profile.stats.activitiesCompleted++;
  }
  
  // Actualizar best score
  const currentBest = areaData.bestScores.get(activityId) || 0;
  if (score > currentBest) {
    areaData.bestScores.set(activityId, score);
  }
  
  // Agregar XP al área
  areaData.xp += activity.xpReward;
  const oldAreaLevel = areaData.level;
  areaData.level = calculateLevel(areaData.xp);
  const areaLeveledUp = areaData.level > oldAreaLevel;
  
  // Calcular nivel global
  const oldLevel = profile.stats.level;
  profile.stats.level = calculateLevel(profile.stats.totalXP);
  const leveledUp = profile.stats.level > oldLevel;
  
  // Actualizar challenges
  profile.challenges.forEach(challenge => {
    if (!challenge.completed) {
      if (challenge.areaId === activity.areaId || !challenge.areaId) {
        challenge.current = Math.min(challenge.current + 1, challenge.target);
        if (challenge.current >= challenge.target) {
          challenge.completed = true;
          profile.stats.challengesCompleted++;
          profile.stats.totalXP += challenge.reward.xp;
          profile.stats.coins += challenge.reward.coins;
        }
      }
    }
  });
  
  // Verificar logros
  profile.achievements.forEach(achievement => {
    if (!achievement.unlocked) {
      let shouldUnlock = false;
      
      // Lógica de desbloqueo según el logro
      switch (achievement.id) {
        case 'first-workout':
          shouldUnlock = profile.stats.totalWorkouts >= 1;
          achievement.progress = profile.stats.totalWorkouts;
          break;
        case 'gym-regular':
          shouldUnlock = profile.stats.currentStreak >= 7;
          achievement.progress = profile.stats.currentStreak;
          break;
        case 'gym-addict':
          shouldUnlock = profile.stats.currentStreak >= 30;
          achievement.progress = profile.stats.currentStreak;
          break;
        case 'gym-legend':
          const allAreasMaxLevel = Array.from(profile.areas.values()).every(a => a.level >= 20);
          shouldUnlock = allAreasMaxLevel;
          achievement.progress = Array.from(profile.areas.values()).filter(a => a.level >= 20).length;
          break;
        case 'memory-master':
        case 'attention-expert':
        case 'speed-demon':
        case 'flexibility-pro':
        case 'logic-wizard':
        case 'creative-genius':
          if (achievement.areaId) {
            const area = profile.areas.get(achievement.areaId);
            shouldUnlock = area ? area.level >= 10 : false;
            achievement.progress = area?.level || 0;
          }
          break;
        case 'completionist':
          shouldUnlock = profile.stats.activitiesCompleted >= GYM_ACTIVITIES.length;
          achievement.progress = profile.stats.activitiesCompleted;
          break;
        case 'challenger':
          shouldUnlock = profile.stats.challengesCompleted >= 10;
          achievement.progress = profile.stats.challengesCompleted;
          break;
        case 'perfectionist':
          const perfectScores = Array.from(profile.areas.values())
            .flatMap(a => Array.from(a.bestScores.values()))
            .filter(s => s >= 100).length;
          shouldUnlock = perfectScores >= 5;
          achievement.progress = perfectScores;
          break;
      }
      
      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        newAchievements.push(achievement.id);
        profile.stats.achievementsUnlocked++;
      }
    }
  });
  
  saveGymProfile(profile);
  
  return {
    xpGained: activity.xpReward,
    coinsGained: activity.coinReward,
    leveledUp,
    areaLeveledUp,
    newAchievements
  };
};

/**
 * Calcula el nivel basado en XP acumulado
 */
export const calculateLevel = (xp: number): number => {
  // Fórmula: nivel = √(xp / 100)
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

/**
 * Calcula XP necesario para el siguiente nivel
 */
export const getXPForNextLevel = (currentLevel: number): number => {
  // Fórmula inversa: xp = (nivel - 1)² * 100
  return Math.pow(currentLevel, 2) * 100;
};

/**
 * Genera desafíos diarios aleatorios
 */
export const generateDailyChallenges = (): GymChallenge[] => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);
  
  return [
    {
      id: 'daily-1',
      type: 'diario',
      name: 'Calentamiento Diario',
      description: 'Completa 3 actividades hoy',
      icon: Dumbbell,
      target: 3,
      current: 0,
      reward: { xp: 50, coins: 10 },
      expiresAt: tomorrow,
      completed: false
    },
    {
      id: 'daily-2',
      type: 'diario',
      name: 'Especialista',
      description: 'Entrena un área específica 2 veces',
      icon: Target,
      areaId: 'memoria',
      target: 2,
      current: 0,
      reward: { xp: 30, coins: 5 },
      expiresAt: tomorrow,
      completed: false
    },
    {
      id: 'daily-3',
      type: 'diario',
      name: 'Velocista',
      description: 'Completa una actividad en menos de 3 minutos',
      icon: Zap,
      target: 1,
      current: 0,
      reward: { xp: 40, coins: 8 },
      expiresAt: tomorrow,
      completed: false
    }
  ];
};

/**
 * Obtiene las actividades de un área específica
 */
export const getAreaActivities = (areaId: GymAreaId): GymActivity[] => {
  return GYM_ACTIVITIES.filter(a => a.areaId === areaId);
};

/**
 * Obtiene los datos completos de un área con progreso del usuario
 */
export const getAreaWithProgress = (userId: string, areaId: GymAreaId): GymArea => {
  const profile = getGymProfile(userId);
  const areaData = profile.areas.get(areaId)!;
  const baseArea = GYM_AREAS[areaId];
  const activities = getAreaActivities(areaId);
  
  // Actualizar unlocked status de actividades
  const activitiesWithStatus = activities.map(activity => ({
    ...activity,
    unlocked: !activity.requiredLevel || areaData.level >= activity.requiredLevel,
    completed: areaData.completedActivities.includes(activity.id),
    bestScore: areaData.bestScores.get(activity.id),
    timesPlayed: areaData.completedActivities.filter(id => id === activity.id).length
  }));
  
  return {
    ...baseArea,
    activities: activitiesWithStatus,
    totalXP: areaData.xp,
    level: areaData.level,
    currentXP: areaData.xp - getXPForNextLevel(areaData.level - 1),
    nextLevelXP: getXPForNextLevel(areaData.level) - getXPForNextLevel(areaData.level - 1)
  };
};

/**
 * Obtiene estadísticas resumidas del gimnasio
 */
export const getGymSummary = (userId: string) => {
  const profile = getGymProfile(userId);
  
  const allAreas = Object.keys(GYM_AREAS).map(areaId => 
    getAreaWithProgress(userId, areaId as GymAreaId)
  );
  
  const totalActivities = GYM_ACTIVITIES.length;
  const completedActivities = profile.stats.activitiesCompleted;
  const completionPercentage = Math.round((completedActivities / totalActivities) * 100);
  
  const activeChallenges = profile.challenges.filter(c => !c.completed);
  const todayChallenges = activeChallenges.filter(c => c.type === 'diario');
  
  return {
    profile,
    allAreas,
    completionPercentage,
    activeChallenges: todayChallenges.length,
    recentAchievements: profile.achievements
      .filter(a => a.unlocked)
      .sort((a, b) => {
        const dateA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
        const dateB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 3)
  };
};

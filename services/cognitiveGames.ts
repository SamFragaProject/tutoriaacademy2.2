// services/cognitiveGames.ts
import { Brain, Shuffle, FastForward, Grid, GitCompareArrows, Map, Hash, Zap, Eye, Timer } from 'lucide-react';
import React from 'react';

export type GradeLevel = 'primaria' | 'secundaria' | 'preparatoria';

export interface CognitiveGame {
  id: 'n-track' | 'focus-switch' | 'rsvp-gist' | 'memory-matrix' | 'chunking-tiles' | 'dual-code-match' | 'sequence-builder' | 'digit-span' | 'reaction-time' | 'stroop-effect' | 'visual-search';
  title: string;
  description: string;
  subject: 'Matemáticas' | 'Lengua';
  available: boolean;
  Icon: React.ElementType;
  gradeLevels: GradeLevel[]; // Niveles educativos donde está disponible este juego
  difficulty: 'básico' | 'intermedio' | 'avanzado'; // Dificultad general del juego
}

export const COGNITIVE_GAMES: CognitiveGame[] = [
  {
    id: 'n-track',
    title: 'N-Track',
    description: 'Entrena tu memoria de trabajo para el cálculo mental y seguimiento de pasos en problemas complejos.',
    subject: 'Matemáticas',
    available: true,
    Icon: Brain,
    gradeLevels: ['secundaria', 'preparatoria'], // Requiere capacidad de abstracción
    difficulty: 'intermedio',
  },
  {
    id: 'focus-switch',
    title: 'Focus Switch',
    description: 'Aumenta tu flexibilidad cognitiva para cambiar entre diferentes operaciones y conceptos algebraicos.',
    subject: 'Matemáticas',
    available: true,
    Icon: Shuffle,
    gradeLevels: ['primaria', 'secundaria', 'preparatoria'], // Universal, adaptado por dificultad
    difficulty: 'básico',
  },
  {
    id: 'rsvp-gist',
    title: 'RSVP Gist',
    description: 'Aumenta tu velocidad de lectura y comprensión de enunciados en problemas.',
    subject: 'Lengua',
    available: true,
    Icon: FastForward,
    gradeLevels: ['secundaria', 'preparatoria'], // Requiere velocidad de lectura avanzada
    difficulty: 'intermedio',
  },
  {
    id: 'memory-matrix',
    title: 'Memory Matrix',
    description: 'Fortalece tu memoria espacial visual recordando posiciones en un grid. Mejora tu capacidad de retención.',
    subject: 'Matemáticas',
    available: true,
    Icon: Grid,
    gradeLevels: ['primaria', 'secundaria', 'preparatoria'], // Universal, adaptado por dificultad
    difficulty: 'básico',
  },
  {
    id: 'chunking-tiles',
    title: 'Chunking Tiles',
    description: 'Aprende a agrupar información para memorizar fórmulas y secuencias de manera más eficiente.',
    subject: 'Matemáticas',
    available: false,
    Icon: Grid,
    gradeLevels: ['secundaria', 'preparatoria'], // Requiere comprensión de patrones
    difficulty: 'intermedio',
  },
  {
    id: 'dual-code-match',
    title: 'Dual-Code Match',
    description: 'Conecta conceptos visuales (gráficas) y textuales (ecuaciones) para una codificación dual.',
    subject: 'Matemáticas',
    available: false,
    Icon: GitCompareArrows,
    gradeLevels: ['preparatoria'], // Solo para nivel avanzado
    difficulty: 'avanzado',
  },
  {
    id: 'sequence-builder',
    title: 'Sequence Builder',
    description: 'Usa el método de loci para memorizar secuencias y procedimientos de resolución.',
    subject: 'Lengua',
    available: false,
    Icon: Map,
    gradeLevels: ['secundaria', 'preparatoria'], // Requiere pensamiento secuencial
    difficulty: 'intermedio',
  },
  // ===== Quick Win Games (Sin API) =====
  {
    id: 'digit-span',
    title: 'Digit Span',
    description: 'Entrena tu memoria de trabajo recordando secuencias de dígitos cada vez más largas.',
    subject: 'Matemáticas',
    available: true,
    Icon: Hash,
    gradeLevels: ['primaria', 'secundaria', 'preparatoria'], // Universal, adaptado por longitud
    difficulty: 'básico',
  },
  {
    id: 'reaction-time',
    title: 'Reaction Time',
    description: 'Mide y mejora tu velocidad de reacción ante estímulos visuales. Esencial para respuestas rápidas.',
    subject: 'Matemáticas',
    available: true,
    Icon: Zap,
    gradeLevels: ['primaria', 'secundaria', 'preparatoria'], // Universal
    difficulty: 'básico',
  },
  {
    id: 'stroop-effect',
    title: 'Stroop Effect',
    description: 'Desafía tu control atencional identificando colores mientras ignoras palabras. Mejora tu concentración.',
    subject: 'Lengua',
    available: true,
    Icon: Brain,
    gradeLevels: ['primaria', 'secundaria', 'preparatoria'], // Universal, adaptado por complejidad
    difficulty: 'intermedio',
  },
  {
    id: 'visual-search',
    title: 'Visual Search',
    description: 'Desarrolla tu atención visual buscando objetivos específicos en grids complejos.',
    subject: 'Lengua',
    available: true,
    Icon: Eye,
    gradeLevels: ['primaria', 'secundaria', 'preparatoria'], // Universal, adaptado por tamaño de grid
    difficulty: 'básico',
  },
];

/**
 * Filtra juegos disponibles según el nivel educativo del usuario
 */
export const getGamesForGradeLevel = (gradeLevel: GradeLevel): CognitiveGame[] => {
  return COGNITIVE_GAMES.filter(game => 
    game.available && game.gradeLevels.includes(gradeLevel)
  );
};

/**
 * Obtiene todos los juegos (incluidos los no disponibles) para un nivel
 */
export const getAllGamesForGradeLevel = (gradeLevel: GradeLevel): CognitiveGame[] => {
  return COGNITIVE_GAMES.filter(game => 
    game.gradeLevels.includes(gradeLevel)
  );
};
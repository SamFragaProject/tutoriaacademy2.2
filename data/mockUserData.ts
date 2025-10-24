/**
 * Datos mock precargados para usuarios de demostración
 * Estos datos se cargan automáticamente cuando un usuario inicia sesión con quick login
 */

// ============================================================================
// DATOS PARA ANA GARCÍA - PRIMARIA (6TO GRADO)
// ============================================================================

export const MOCK_DATA_PRIMARIA = {
  userId: 'mock-primaria-001',
  
  // Progreso general
  progress: {
    completed: 8,
    total: 20,
    streak: 5,
    lastActivityISO: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 horas atrás
  },

  // Resultados de diagnóstico
  diagnostic: {
    at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 días atrás
    results: {
      'matematicas': { correct: 6, total: 10, percentage: 60 },
      'espanol': { correct: 8, total: 10, percentage: 80 },
      'ciencias': { correct: 7, total: 10, percentage: 70 },
    },
    recommendations: [
      { area: 'Matemáticas', topic: 'Fracciones', level: 'basico' },
      { area: 'Matemáticas', topic: 'Multiplicación', level: 'intermedio' },
      { area: 'Español', topic: 'Comprensión lectora', level: 'intermedio' },
    ]
  },

  // Historial de práctica
  practiceHistory: [
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      area: 'Matemáticas',
      topic: 'Fracciones',
      score: 85,
      questionsAnswered: 10,
      timeSpent: 15 * 60, // 15 minutos en segundos
    },
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      area: 'Español',
      topic: 'Ortografía',
      score: 90,
      questionsAnswered: 8,
      timeSpent: 12 * 60,
    },
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      area: 'Ciencias',
      topic: 'El cuerpo humano',
      score: 75,
      questionsAnswered: 12,
      timeSpent: 20 * 60,
    },
  ],

  // Gamificación
  gamification: {
    xp: 520,
    level: 3,
    achievements: ['first_practice', 'streak_5', 'perfect_score'],
    badges: ['matematicas_basico', 'espanol_basico'],
  },

  // Juegos cognitivos
  cognitiveGames: {
    lastPlayed: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    nBackHighScore: 4,
    focusSwitchBestTime: 35,
    speedReaderWPM: 120,
  },
};

// ============================================================================
// DATOS PARA CARLOS MENDOZA - SECUNDARIA (2DO GRADO)
// ============================================================================

export const MOCK_DATA_SECUNDARIA = {
  userId: 'mock-secundaria-001',
  
  progress: {
    completed: 15,
    total: 25,
    streak: 8,
    lastActivityISO: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 horas atrás
  },

  diagnostic: {
    at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 días atrás
    results: {
      'matematicas': { correct: 12, total: 15, percentage: 80 },
      'espanol': { correct: 13, total: 15, percentage: 87 },
      'ciencias': { correct: 11, total: 15, percentage: 73 },
      'historia': { correct: 14, total: 15, percentage: 93 },
      'ingles': { correct: 10, total: 15, percentage: 67 },
    },
    recommendations: [
      { area: 'Matemáticas', topic: 'Álgebra básica', level: 'intermedio' },
      { area: 'Ciencias', topic: 'Química - Tabla periódica', level: 'intermedio' },
      { area: 'Inglés', topic: 'Gramática - Present Perfect', level: 'basico' },
    ]
  },

  practiceHistory: [
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      area: 'Matemáticas',
      topic: 'Ecuaciones lineales',
      score: 88,
      questionsAnswered: 15,
      timeSpent: 25 * 60,
    },
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      area: 'Historia',
      topic: 'Revolución Mexicana',
      score: 92,
      questionsAnswered: 12,
      timeSpent: 18 * 60,
    },
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      area: 'Ciencias',
      topic: 'Estructura atómica',
      score: 78,
      questionsAnswered: 10,
      timeSpent: 22 * 60,
    },
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      area: 'Inglés',
      topic: 'Tiempos verbales',
      score: 70,
      questionsAnswered: 14,
      timeSpent: 20 * 60,
    },
  ],

  gamification: {
    xp: 1050,
    level: 6,
    achievements: [
      'first_practice', 'streak_5', 'streak_7', 'perfect_score', 
      'practice_marathon', 'quick_learner'
    ],
    badges: [
      'matematicas_intermedio', 'historia_avanzado', 'espanol_intermedio',
      'ciencias_basico', 'ingles_basico'
    ],
  },

  cognitiveGames: {
    lastPlayed: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    nBackHighScore: 6,
    focusSwitchBestTime: 28,
    speedReaderWPM: 180,
  },
};

// ============================================================================
// DATOS PARA MARÍA RODRÍGUEZ - PREPARATORIA (3ER SEMESTRE)
// ============================================================================

export const MOCK_DATA_PREPARATORIA = {
  userId: 'mock-preparatoria-001',
  
  progress: {
    completed: 22,
    total: 30,
    streak: 15,
    lastActivityISO: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 horas atrás
  },

  diagnostic: {
    at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 días atrás
    results: {
      'matematicas': { correct: 17, total: 20, percentage: 85 },
      'fisica': { correct: 16, total: 20, percentage: 80 },
      'quimica': { correct: 18, total: 20, percentage: 90 },
      'literatura': { correct: 19, total: 20, percentage: 95 },
      'ingles': { correct: 17, total: 20, percentage: 85 },
      'historia': { correct: 18, total: 20, percentage: 90 },
    },
    recommendations: [
      { area: 'Matemáticas', topic: 'Cálculo diferencial', level: 'avanzado' },
      { area: 'Física', topic: 'Mecánica clásica', level: 'avanzado' },
      { area: 'Química', topic: 'Estequiometría', level: 'intermedio' },
    ]
  },

  practiceHistory: [
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      area: 'Matemáticas',
      topic: 'Derivadas',
      score: 94,
      questionsAnswered: 20,
      timeSpent: 35 * 60,
    },
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      area: 'Física',
      topic: 'Cinemática',
      score: 88,
      questionsAnswered: 15,
      timeSpent: 28 * 60,
    },
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      area: 'Química',
      topic: 'Reacciones químicas',
      score: 92,
      questionsAnswered: 18,
      timeSpent: 30 * 60,
    },
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      area: 'Literatura',
      topic: 'Análisis literario',
      score: 96,
      questionsAnswered: 12,
      timeSpent: 40 * 60,
    },
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      area: 'Inglés',
      topic: 'Academic writing',
      score: 90,
      questionsAnswered: 16,
      timeSpent: 32 * 60,
    },
  ],

  gamification: {
    xp: 2340,
    level: 12,
    achievements: [
      'first_practice', 'streak_5', 'streak_7', 'streak_14', 'perfect_score',
      'practice_marathon', 'quick_learner', 'knowledge_master', 'consistency_champion',
      'all_star_student'
    ],
    badges: [
      'matematicas_avanzado', 'fisica_avanzado', 'quimica_avanzado',
      'literatura_avanzado', 'ingles_avanzado', 'historia_avanzado'
    ],
  },

  cognitiveGames: {
    lastPlayed: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    nBackHighScore: 8,
    focusSwitchBestTime: 22,
    speedReaderWPM: 250,
  },
};

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Carga los datos mock para un usuario específico en localStorage
 */
export function loadMockDataForUser(gradeLevel: 'primaria' | 'secundaria' | 'preparatoria') {
  let mockData;
  
  switch (gradeLevel) {
    case 'primaria':
      mockData = MOCK_DATA_PRIMARIA;
      break;
    case 'secundaria':
      mockData = MOCK_DATA_SECUNDARIA;
      break;
    case 'preparatoria':
      mockData = MOCK_DATA_PREPARATORIA;
      break;
    default:
      return;
  }

  // Guardar en localStorage
  try {
    // Diagnóstico
    localStorage.setItem('diagnostic:last', JSON.stringify(mockData.diagnostic));
    
    // Progreso
    localStorage.setItem(`progress:${mockData.userId}`, JSON.stringify(mockData.progress));
    
    // Historial de práctica
    localStorage.setItem(`practice:history:${mockData.userId}`, JSON.stringify(mockData.practiceHistory));
    
    // Gamificación
    localStorage.setItem(`gamification:${mockData.userId}`, JSON.stringify(mockData.gamification));
    
    // Juegos cognitivos
    localStorage.setItem(`cognitive:stats:${mockData.userId}`, JSON.stringify(mockData.cognitiveGames));
    
    console.log(`✅ Datos mock cargados para usuario ${gradeLevel}`);
  } catch (error) {
    console.error('Error al cargar datos mock:', error);
  }
}

/**
 * Limpia todos los datos mock del localStorage
 */
export function clearMockData() {
  const keysToRemove = [
    'diagnostic:last',
    'progress:mock-primaria-001',
    'progress:mock-secundaria-001',
    'progress:mock-preparatoria-001',
    'practice:history:mock-primaria-001',
    'practice:history:mock-secundaria-001',
    'practice:history:mock-preparatoria-001',
    'gamification:mock-primaria-001',
    'gamification:mock-secundaria-001',
    'gamification:mock-preparatoria-001',
    'cognitive:stats:mock-primaria-001',
    'cognitive:stats:mock-secundaria-001',
    'cognitive:stats:mock-preparatoria-001',
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log('🗑️ Datos mock limpiados');
}

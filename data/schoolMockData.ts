import type { School, GroupoEscolar, User, Tarea, Examen } from '../types';

// ============================================
// ESCUELA PRINCIPAL
// ============================================

export const SCHOOL_TUTORIA: School = {
  id: 'school-tutoria-001',
  nombre: 'Colegio TutoriA',
  direccion: 'Av. Educación 123, Col. del Saber',
  ciudad: 'Ciudad de México',
  estado: 'CDMX',
  codigoPostal: '01000',
  telefono: '55-1234-5678',
  email: 'contacto@colegiotutoria.edu.mx',
  directorId: 'admin-director-001',
  logo: '/assets/logo-tutoria.png',
  niveles: ['secundaria', 'preparatoria'],
  totalAlumnos: 110,
  totalProfesores: 2,
  totalGrupos: 6,
  activo: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date()
};

// ============================================
// GRUPOS
// ============================================

export const GROUPS_MOCK: GroupoEscolar[] = [
  // SECUNDARIA
  {
    id: 'group-3a-mat',
    nombre: '3A - Matemáticas',
    nivel: 'secundaria',
    grado: 3,
    materia: 'matematicas',
    profesorId: 'teacher-juan-001',
    profesorNombre: 'Juan Martínez',
    schoolId: 'school-tutoria-001',
    schoolNombre: 'Colegio TutoriA',
    alumnosIds: ['student-carlos-001', 'student-ana-002', 'student-luis-003'],
    totalAlumnos: 15,
    horario: {
      lunes: '08:00-09:30',
      miercoles: '08:00-09:30',
      viernes: '08:00-09:30'
    },
    activo: true,
    createdAt: new Date('2024-09-01')
  },
  {
    id: 'group-3b-sci',
    nombre: '3B - Ciencias',
    nivel: 'secundaria',
    grado: 3,
    materia: 'fisica',
    profesorId: 'teacher-juan-001',
    profesorNombre: 'Juan Martínez',
    schoolId: 'school-tutoria-001',
    schoolNombre: 'Colegio TutoriA',
    alumnosIds: ['student-ana-002'],
    totalAlumnos: 18,
    horario: {
      martes: '10:00-11:30',
      jueves: '10:00-11:30'
    },
    activo: true,
    createdAt: new Date('2024-09-01')
  },
  {
    id: 'group-3c-qui',
    nombre: '3C - Química',
    nivel: 'secundaria',
    grado: 3,
    materia: 'quimica',
    profesorId: 'teacher-maria-001',
    profesorNombre: 'María López',
    schoolId: 'school-tutoria-001',
    schoolNombre: 'Colegio TutoriA',
    alumnosIds: ['student-luis-003'],
    totalAlumnos: 16,
    horario: {
      lunes: '10:00-11:30',
      miercoles: '10:00-11:30',
      viernes: '10:00-11:30'
    },
    activo: true,
    createdAt: new Date('2024-09-01')
  },

  // PREPARATORIA
  {
    id: 'group-6a-fis',
    nombre: '6A - Física',
    nivel: 'preparatoria',
    grado: 6,
    materia: 'fisica',
    profesorId: 'teacher-juan-001',
    profesorNombre: 'Juan Martínez',
    schoolId: 'school-tutoria-001',
    schoolNombre: 'Colegio TutoriA',
    alumnosIds: ['student-maria-004', 'student-pedro-005'],
    totalAlumnos: 20,
    horario: {
      lunes: '13:00-14:30',
      miercoles: '13:00-14:30',
      viernes: '13:00-14:30'
    },
    activo: true,
    createdAt: new Date('2024-09-01')
  },
  {
    id: 'group-6b-mat',
    nombre: '6B - Matemáticas',
    nivel: 'preparatoria',
    grado: 6,
    materia: 'matematicas',
    profesorId: 'teacher-juan-001',
    profesorNombre: 'Juan Martínez',
    schoolId: 'school-tutoria-001',
    schoolNombre: 'Colegio TutoriA',
    alumnosIds: ['student-pedro-005'],
    totalAlumnos: 22,
    horario: {
      martes: '13:00-14:30',
      jueves: '13:00-14:30'
    },
    activo: true,
    createdAt: new Date('2024-09-01')
  },
  {
    id: 'group-6c-qui',
    nombre: '6C - Química Avanzada',
    nivel: 'preparatoria',
    grado: 6,
    materia: 'quimica',
    profesorId: 'teacher-maria-001',
    profesorNombre: 'María López',
    schoolId: 'school-tutoria-001',
    schoolNombre: 'Colegio TutoriA',
    alumnosIds: ['student-laura-006'],
    totalAlumnos: 19,
    horario: {
      martes: '10:00-11:30',
      jueves: '10:00-11:30',
      viernes: '10:00-11:30'
    },
    activo: true,
    createdAt: new Date('2024-09-01')
  }
];

// ============================================
// USUARIOS AMPLIADOS
// ============================================

export const USERS_SCHOOL_MOCK: User[] = [
  // PROFESORES
  {
    id: 'teacher-juan-001',
    name: 'Juan Martínez',
    email: 'juan.martinez@colegiotutoria.edu.mx',
    role: 'docente',
    schoolId: 'school-tutoria-001',
    schoolName: 'Colegio TutoriA',
    groupId: 'multiple', // Tiene múltiples grupos
    groupName: '4 grupos (3A, 3B, 6A, 6B)',
    xp: 15000,
    accuracy: 95,
    streak: 150,
    activeSubjects: 4,
    tokenSavingMode: false,
    masteryScore: 950,
    gradeLevel: 'preparatoria'
  },
  {
    id: 'teacher-maria-001',
    name: 'María López',
    email: 'maria.lopez@colegiotutoria.edu.mx',
    role: 'docente',
    schoolId: 'school-tutoria-001',
    schoolName: 'Colegio TutoriA',
    groupId: 'multiple',
    groupName: '2 grupos (3C, 6C)',
    xp: 12500,
    accuracy: 93,
    streak: 120,
    activeSubjects: 2,
    tokenSavingMode: false,
    masteryScore: 930,
    gradeLevel: 'preparatoria'
  },

  // ALUMNOS DE SECUNDARIA
  {
    id: 'student-carlos-001',
    name: 'Carlos Gómez',
    email: 'carlos.gomez@colegiotutoria.edu.mx',
    role: 'alumno',
    schoolId: 'school-tutoria-001',
    schoolName: 'Colegio TutoriA',
    groupId: 'group-3a-mat',
    groupName: '3A - Matemáticas',
    xp: 3500,
    accuracy: 78,
    streak: 12,
    activeSubjects: 3,
    examDate: '2025-11-15',
    tokenSavingMode: false,
    career: 'unam_area1',
    masteryScore: 780,
    gradeLevel: 'secundaria'
  },
  {
    id: 'student-ana-002',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@colegiotutoria.edu.mx',
    role: 'alumno',
    schoolId: 'school-tutoria-001',
    schoolName: 'Colegio TutoriA',
    groupId: 'group-3b-sci',
    groupName: '3B - Ciencias',
    xp: 4200,
    accuracy: 85,
    streak: 18,
    activeSubjects: 4,
    examDate: '2025-11-15',
    tokenSavingMode: false,
    career: 'unam_area2',
    masteryScore: 850,
    gradeLevel: 'secundaria'
  },
  {
    id: 'student-luis-003',
    name: 'Luis Hernández',
    email: 'luis.hernandez@colegiotutoria.edu.mx',
    role: 'alumno',
    schoolId: 'school-tutoria-001',
    schoolName: 'Colegio TutoriA',
    groupId: 'group-3c-qui',
    groupName: '3C - Química',
    xp: 3800,
    accuracy: 82,
    streak: 15,
    activeSubjects: 3,
    examDate: '2025-11-15',
    tokenSavingMode: false,
    career: 'unam_area2',
    masteryScore: 820,
    gradeLevel: 'secundaria'
  },

  // ALUMNOS DE PREPARATORIA
  {
    id: 'student-maria-004',
    name: 'María González',
    email: 'maria.gonzalez@colegiotutoria.edu.mx',
    role: 'alumno',
    schoolId: 'school-tutoria-001',
    schoolName: 'Colegio TutoriA',
    groupId: 'group-6a-fis',
    groupName: '6A - Física',
    xp: 5500,
    accuracy: 88,
    streak: 25,
    activeSubjects: 5,
    examDate: '2025-06-15',
    tokenSavingMode: false,
    career: 'unam_area1',
    masteryScore: 880,
    gradeLevel: 'preparatoria'
  },
  {
    id: 'student-pedro-005',
    name: 'Pedro Sánchez',
    email: 'pedro.sanchez@colegiotutoria.edu.mx',
    role: 'alumno',
    schoolId: 'school-tutoria-001',
    schoolName: 'Colegio TutoriA',
    groupId: 'group-6b-mat',
    groupName: '6B - Matemáticas',
    xp: 6200,
    accuracy: 91,
    streak: 30,
    activeSubjects: 6,
    examDate: '2025-06-15',
    tokenSavingMode: false,
    career: 'ipn_area1',
    masteryScore: 910,
    gradeLevel: 'preparatoria'
  },
  {
    id: 'student-laura-006',
    name: 'Laura Ramírez',
    email: 'laura.ramirez@colegiotutoria.edu.mx',
    role: 'alumno',
    schoolId: 'school-tutoria-001',
    schoolName: 'Colegio TutoriA',
    groupId: 'group-6c-qui',
    groupName: '6C - Química Avanzada',
    xp: 7100,
    accuracy: 93,
    streak: 35,
    activeSubjects: 6,
    examDate: '2025-06-15',
    tokenSavingMode: false,
    career: 'unam_area2',
    masteryScore: 930,
    gradeLevel: 'preparatoria'
  }
];

// ============================================
// TAREAS MOCK
// ============================================

export const TAREAS_MOCK: Tarea[] = [
  // Profesor Juan - Grupo 3A (Matemáticas Secundaria)
  {
    id: 'tarea-001',
    titulo: 'Teorema de Pitágoras',
    descripcion: 'Resolver 10 problemas aplicando el Teorema de Pitágoras en diferentes contextos',
    materia: 'matematicas',
    grupoId: 'group-3a-mat',
    grupoNombre: '3A - Matemáticas',
    profesorId: 'teacher-juan-001',
    profesorNombre: 'Juan Martínez',
    fechaCreacion: new Date('2025-09-20'),
    fechaEntrega: new Date('2025-10-01'),
    puntos: 100,
    archivoAdjunto: '/assets/tareas/pitagoras.pdf',
    instrucciones: 'Entregar en formato PDF con procedimientos completos',
    entregas: [
      {
        id: 'entrega-001-carlos',
        tareaId: 'tarea-001',
        alumnoId: 'student-carlos-001',
        alumnoNombre: 'Carlos Gómez',
        fechaEntrega: new Date('2025-09-30'),
        archivo: '/uploads/carlos-pitagoras.pdf',
        calificacion: 85,
        comentarios: 'Buen trabajo, algunos errores menores en los problemas 7 y 9',
        estado: 'calificada'
      }
    ],
    estadisticas: {
      total: 15,
      entregadas: 12,
      pendientes: 3,
      calificadas: 12,
      promedioCalificacion: 82
    }
  },
  {
    id: 'tarea-002',
    titulo: 'Ecuaciones de Segundo Grado',
    descripcion: 'Resolver ecuaciones cuadráticas usando la fórmula general',
    materia: 'matematicas',
    grupoId: 'group-3a-mat',
    grupoNombre: '3A - Matemáticas',
    profesorId: 'teacher-juan-001',
    profesorNombre: 'Juan Martínez',
    fechaCreacion: new Date('2025-10-01'),
    fechaEntrega: new Date('2025-10-12'),
    puntos: 100,
    instrucciones: 'Mostrar el desarrollo completo de cada ecuación',
    entregas: [
      {
        id: 'entrega-002-carlos',
        tareaId: 'tarea-002',
        alumnoId: 'student-carlos-001',
        alumnoNombre: 'Carlos Gómez',
        fechaEntrega: new Date('2025-10-08'),
        estado: 'entregada'
      }
    ],
    estadisticas: {
      total: 15,
      entregadas: 8,
      pendientes: 7,
      calificadas: 0,
      promedioCalificacion: 0
    }
  },

  // Profesor Juan - Grupo 6A (Física Preparatoria)
  {
    id: 'tarea-003',
    titulo: 'Leyes de Newton',
    descripcion: 'Problemas aplicando las tres leyes de Newton',
    materia: 'fisica',
    grupoId: 'group-6a-fis',
    grupoNombre: '6A - Física',
    profesorId: 'teacher-juan-001',
    profesorNombre: 'Juan Martínez',
    fechaCreacion: new Date('2025-09-15'),
    fechaEntrega: new Date('2025-09-30'),
    puntos: 120,
    entregas: [
      {
        id: 'entrega-003-maria',
        tareaId: 'tarea-003',
        alumnoId: 'student-maria-004',
        alumnoNombre: 'María González',
        fechaEntrega: new Date('2025-09-28'),
        calificacion: 95,
        comentarios: 'Excelente análisis y procedimiento',
        estado: 'calificada'
      }
    ],
    estadisticas: {
      total: 20,
      entregadas: 18,
      pendientes: 2,
      calificadas: 18,
      promedioCalificacion: 87
    }
  },
  {
    id: 'tarea-004',
    titulo: 'Cinemática - Movimiento Rectilíneo',
    descripcion: 'Análisis de movimiento con velocidad constante y acelerada',
    materia: 'fisica',
    grupoId: 'group-6a-fis',
    grupoNombre: '6A - Física',
    profesorId: 'teacher-juan-001',
    profesorNombre: 'Juan Martínez',
    fechaCreacion: new Date('2025-10-01'),
    fechaEntrega: new Date('2025-10-10'),
    puntos: 100,
    entregas: [],
    estadisticas: {
      total: 20,
      entregadas: 5,
      pendientes: 15,
      calificadas: 0,
      promedioCalificacion: 0
    }
  },

  // Profesora María - Grupo 3C (Química Secundaria)
  {
    id: 'tarea-005',
    titulo: 'Tabla Periódica',
    descripcion: 'Memorizar y clasificar elementos de la tabla periódica',
    materia: 'quimica',
    grupoId: 'group-3c-qui',
    grupoNombre: '3C - Química',
    profesorId: 'teacher-maria-001',
    profesorNombre: 'María López',
    fechaCreacion: new Date('2025-09-10'),
    fechaEntrega: new Date('2025-09-25'),
    puntos: 100,
    entregas: [
      {
        id: 'entrega-005-luis',
        tareaId: 'tarea-005',
        alumnoId: 'student-luis-003',
        alumnoNombre: 'Luis Hernández',
        fechaEntrega: new Date('2025-09-24'),
        calificacion: 90,
        comentarios: 'Muy buen dominio de la tabla periódica',
        estado: 'calificada'
      }
    ],
    estadisticas: {
      total: 16,
      entregadas: 14,
      pendientes: 2,
      calificadas: 14,
      promedioCalificacion: 85
    }
  },
  {
    id: 'tarea-006',
    titulo: 'Enlaces Químicos',
    descripcion: 'Identificar y explicar diferentes tipos de enlaces químicos',
    materia: 'quimica',
    grupoId: 'group-3c-qui',
    grupoNombre: '3C - Química',
    profesorId: 'teacher-maria-001',
    profesorNombre: 'María López',
    fechaCreacion: new Date('2025-09-28'),
    fechaEntrega: new Date('2025-10-14'),
    puntos: 100,
    entregas: [],
    estadisticas: {
      total: 16,
      entregadas: 3,
      pendientes: 13,
      calificadas: 0,
      promedioCalificacion: 0
    }
  },

  // Profesora María - Grupo 6C (Química Preparatoria)
  {
    id: 'tarea-007',
    titulo: 'Reacciones Químicas',
    descripcion: 'Balancear ecuaciones químicas y clasificar reacciones',
    materia: 'quimica',
    grupoId: 'group-6c-qui',
    grupoNombre: '6C - Química Avanzada',
    profesorId: 'teacher-maria-001',
    profesorNombre: 'María López',
    fechaCreacion: new Date('2025-09-20'),
    fechaEntrega: new Date('2025-10-05'),
    puntos: 120,
    entregas: [
      {
        id: 'entrega-007-laura',
        tareaId: 'tarea-007',
        alumnoId: 'student-laura-006',
        alumnoNombre: 'Laura Ramírez',
        fechaEntrega: new Date('2025-10-03'),
        calificacion: 98,
        comentarios: '¡Excelente! Dominaste todas las reacciones',
        estado: 'calificada'
      }
    ],
    estadisticas: {
      total: 19,
      entregadas: 16,
      pendientes: 3,
      calificadas: 16,
      promedioCalificacion: 89
    }
  }
];

// ============================================
// EXÁMENES MOCK
// ============================================

export const EXAMENES_MOCK: Examen[] = [
  // Examen próximo - Química (Prof. María)
  {
    id: 'exam-001',
    titulo: 'Examen de Química - Unidad 2',
    descripcion: 'Evaluación de tabla periódica, enlaces químicos y reacciones',
    materia: 'quimica',
    grupoId: 'group-3c-qui',
    grupoNombre: '3C - Química',
    profesorId: 'teacher-maria-001',
    profesorNombre: 'María López',
    fechaExamen: new Date('2025-10-12'), // En 5 días
    duracion: 60,
    puntosTotales: 100,
    preguntas: [],
    calificaciones: [],
    medallaAsociada: {
      id: 'medal-marie-curie',
      nombre: 'Medalla Marie Curie',
      cientifico: 'Marie Curie',
      criterio: 90
    },
    estadisticas: {
      total: 16,
      presentados: 0,
      aprobados: 0,
      reprobados: 0,
      promedioGrupo: 0,
      calificacionMaxima: 0,
      calificacionMinima: 0
    }
  },

  // Examen próximo - Física (Prof. Juan)
  {
    id: 'exam-002',
    titulo: 'Examen de Física - Mecánica',
    descripcion: 'Leyes de Newton, cinemática y dinámica',
    materia: 'fisica',
    grupoId: 'group-6a-fis',
    grupoNombre: '6A - Física',
    profesorId: 'teacher-juan-001',
    profesorNombre: 'Juan Martínez',
    fechaExamen: new Date('2025-10-17'), // En 10 días
    duracion: 90,
    puntosTotales: 100,
    preguntas: [],
    calificaciones: [],
    medallaAsociada: {
      id: 'medal-einstein',
      nombre: 'Medalla Albert Einstein',
      cientifico: 'Albert Einstein',
      criterio: 90
    },
    estadisticas: {
      total: 20,
      presentados: 0,
      aprobados: 0,
      reprobados: 0,
      promedioGrupo: 0,
      calificacionMaxima: 0,
      calificacionMinima: 0
    }
  },

  // Examen completado - Matemáticas (Prof. Juan)
  {
    id: 'exam-003',
    titulo: 'Examen de Matemáticas - Geometría Básica',
    descripcion: 'Teorema de Pitágoras y áreas',
    materia: 'matematicas',
    grupoId: 'group-3a-mat',
    grupoNombre: '3A - Matemáticas',
    profesorId: 'teacher-juan-001',
    profesorNombre: 'Juan Martínez',
    fechaExamen: new Date('2025-09-25'),
    duracion: 60,
    puntosTotales: 100,
    preguntas: [],
    calificaciones: [
      {
        id: 'cal-001-carlos',
        examenId: 'exam-003',
        alumnoId: 'student-carlos-001',
        alumnoNombre: 'Carlos Gómez',
        calificacion: 82,
        respuestas: [],
        fechaPresentacion: new Date('2025-09-25'),
        tiempoEmpleado: 55,
        aprobado: true,
        medallaObtenida: 'medal-pitagoras'
      }
    ],
    medallaAsociada: {
      id: 'medal-pitagoras',
      nombre: 'Medalla Pitágoras',
      cientifico: 'Pitágoras',
      criterio: 80
    },
    estadisticas: {
      total: 15,
      presentados: 15,
      aprobados: 12,
      reprobados: 3,
      promedioGrupo: 82,
      calificacionMaxima: 95,
      calificacionMinima: 58
    }
  }
];

// Helpers
export const getGroupsByTeacher = (teacherId: string) => {
  return GROUPS_MOCK.filter(g => g.profesorId === teacherId);
};

export const getStudentsByGroup = (groupId: string) => {
  const group = GROUPS_MOCK.find(g => g.id === groupId);
  if (!group) return [];
  return USERS_SCHOOL_MOCK.filter(u => group.alumnosIds.includes(u.id));
};

export const getTareasByGroup = (groupId: string) => {
  return TAREAS_MOCK.filter(t => t.grupoId === groupId);
};

export const getExamenesByGroup = (groupId: string) => {
  return EXAMENES_MOCK.filter(e => e.grupoId === groupId);
};

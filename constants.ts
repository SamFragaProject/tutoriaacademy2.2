import type { User, BlogPost, Subject, AssignedExam, EarlyAlert, QuestionAnalytics, DirectorKpis, TeacherKpis, PracticeQuestion, Group, SubtopicResult, TeacherInfo, SchoolSubscription, GroupReport, SchoolRanking } from './types';
import { Scale, Brain, Briefcase, Stethoscope, Cog } from 'lucide-react';
import React from 'react';

// --- B2B MOCK USERS ---

// Usuario Primaria - Perfil Junior
export const MOCK_USER_PRIMARIA: User = {
  id: 'user-primaria-001',
  name: 'Ana García',
  email: 'ana.primaria@escuela.com',
  role: 'alumno',
  schoolId: 'school-01',
  schoolName: 'Colegio Vanguardia',
  groupId: 'group-primaria-6',
  groupName: '6to Grado - Grupo B',
  xp: 520,
  accuracy: 82,
  streak: 5,
  activeSubjects: 3,
  tokenSavingMode: false,
  masteryScore: 450,
  career: undefined, // No tiene carrera aún
  gradeLevel: 'primaria',
};

// Usuario Secundaria - Perfil Intermedio
export const MOCK_USER_SECUNDARIA: User = {
  id: 'user-secundaria-001',
  name: 'Carlos Mendoza',
  email: 'carlos.secundaria@escuela.com',
  role: 'alumno',
  schoolId: 'school-01',
  schoolName: 'Colegio Vanguardia',
  groupId: 'group-secundaria-2',
  groupName: '2do Secundaria - Grupo A',
  xp: 1050,
  accuracy: 85,
  streak: 8,
  activeSubjects: 5,
  tokenSavingMode: false,
  masteryScore: 680,
  career: undefined, // Aún no elige carrera
  gradeLevel: 'secundaria',
};

// Usuario Preparatoria - Perfil Avanzado
export const MOCK_USER_PREPARATORIA: User = {
  id: 'user-prepa-001',
  name: 'María Rodríguez',
  email: 'maria.prepa@escuela.com',
  role: 'alumno',
  schoolId: 'school-01',
  schoolName: 'Colegio Vanguardia',
  groupId: 'group-prepa-3',
  groupName: '3er Semestre - Grupo C',
  xp: 2340,
  accuracy: 91,
  streak: 15,
  activeSubjects: 6,
  tokenSavingMode: false,
  masteryScore: 1150,
  career: 'unam_area2', // Preparándose para Ciencias Sociales
  gradeLevel: 'preparatoria',
};

// Usuario genérico (mantener para compatibilidad)
export const MOCK_USER_ALUMNO: User = MOCK_USER_PREPARATORIA;

export const MOCK_USER_DOCENTE: User = {
    id: 'teacher-juan-001',
    name: 'Juan Martínez',
    email: 'juan.martinez@colegiotutoria.edu.mx',
    role: 'docente',
    schoolId: 'school-tutoria-001',
    schoolName: 'Colegio TutoriA',
    groupId: 'multiple',
    groupName: '4 grupos (3A, 3B, 6A, 6B)',
    xp: 15000,
    accuracy: 95,
    streak: 150,
    activeSubjects: 4,
    tokenSavingMode: false,
    masteryScore: 950,
};

export const MOCK_USER_DIRECTOR: User = {
    id: 'user-789',
    name: 'Dir. Elena Torres',
    email: 'director@escuela.com',
    role: 'director',
    schoolId: 'school-01',
    schoolName: 'Colegio Vanguardia',
    xp: 0, accuracy: 0, streak: 0, activeSubjects: 0, tokenSavingMode: false, masteryScore: 0,
};

export const MOCK_USER_ADMIN: User = {
  id: 'user-admin-001',
  name: 'Admin Platform',
  email: 'admin@tutoria.com',
  role: 'admin',
  schoolId: 'platform-wide',
  schoolName: 'TutoriA Academy HQ',
  xp: 0, accuracy: 0, streak: 0, activeSubjects: 0, tokenSavingMode: false, masteryScore: 0,
};


export const MOCK_EARLY_ALERTS: EarlyAlert[] = [
    { id: 'alert-1', studentName: 'Carlos Gomez', type: 'Bajo Rendimiento', description: 'Promedio de 55% en los últimos 3 exámenes de Álgebra.', studentId: 'user-002' },
    { id: 'alert-2', studentName: 'Luis Garcia', type: 'Baja Actividad', description: 'No ha completado ninguna práctica en los últimos 5 días.', studentId: 'user-004' },
    { id: 'alert-3', studentName: 'Ana Sofia R.', type: 'Bajo Rendimiento', description: 'Errores persistentes en "Uso de la coma y punto".', studentId: 'user-003' },
];

// Mock data for the new B2B student dashboard
export const MOCK_ASSIGNED_EXAMS: AssignedExam[] = [
    { id: 'exam-01', title: 'Diagnóstico de Álgebra', subject: 'Matemáticas', dueDate: '2024-08-15T23:59:59Z', type: 'Diagnóstico' },
    { id: 'exam-02', title: 'Primer Examen Parcial', subject: 'Historia', dueDate: '2024-08-22T23:59:59Z', type: 'Sumativo' },
    { id: 'exam-03', title: 'Práctica de Ortografía', subject: 'Lengua', dueDate: '2024-09-01T23:59:59Z', type: 'Sumativo' },
];

export const MOCK_ALUMNO_SUBJECTS: Subject[] = ['Matemáticas', 'Historia', 'Lengua', 'Física'];

export const MOCK_EXAM_QUESTIONS: Record<string, { title: string, questions: PracticeQuestion[] }> = {
    'exam-01': {
        title: 'Diagnóstico de Álgebra',
        questions: [
            { id: 'MOCK_M01', subTopic: 'Álgebra', text: 'Si $$2x + y = 7$$ y $$x - y = 2$$, ¿cuál es el valor de x?', options: ['3', '2', '5', '1'], correctIndex: 0, difficulty: 2 },
            { id: 'M03', subTopic: 'Ecuaciones', text: 'Resuelve para x: $$5x - 8 = 2x + 7$$', options: ['x = 3', 'x = 15', 'x = 5', 'x = -1/3'], correctIndex: 2, difficulty: 2 },
            { id: 'M08', subTopic: 'Álgebra', text: 'Factoriza el siguiente trinomio: $$x^2 - 5x + 6$$', options: ['(x - 6)(x + 1)', '(x - 2)(x - 3)', '(x + 2)(x + 3)', '(x + 6)(x - 1)'], correctIndex: 1, difficulty: 3 },
            { id: 'MOCK_M06', subTopic: 'Ecuaciones', text: 'Resuelve la ecuación cuadrática: $$x^2 - 4x - 5 = 0$$', options: ['x=5, x=-1', 'x=-5, x=1', 'x=4, x=1', 'x=5, x=1'], correctIndex: 0, difficulty: 3 },
            // FIX: Removed extra properties 'questionText', 'successRate', 'avgTimeSeconds', and 'flag' not defined in PracticeQuestion type.
            { id: 'P_M_F2', subTopic: 'Factorización', text: 'Uno de los factores de x^2 + 7x + 12 es:', options:['(x-4)', '(x+3)', '(x+6)', '(x-3)'], correctIndex: 1, difficulty: 3},
        ]
    },
    'exam-02': {
        title: 'Primer Examen Parcial',
        questions: [
            { id: 'H01', subTopic: 'Historia Universal', text: '¿Cuál de estos eventos marcó el inicio de la Edad Media?', options: ['La caída del Imperio Romano de Occidente', 'El descubrimiento de América', 'La Revolución Francesa', 'La invención de la imprenta'], correctIndex: 0, difficulty: 2 },
        ]
    },
     'exam-03': {
        title: 'Práctica de Ortografía',
        questions: [
            // FIX: Removed extra properties 'questionText', 'successRate', 'avgTimeSeconds', and 'flag' not defined in PracticeQuestion type.
             { id: 'P_L_A1', subTopic: 'Acentuación', text: '¿Cuál de las siguientes palabras es esdrújula?', options: ['canción', 'árbol', 'música', 'reloj'], correctIndex: 2, difficulty: 1 },
        ]
    }
};


// --- P2: GAMIFICATION ---
export interface GroupRanking {
  id: string;
  name: string;
  masteryScore: number;
  teacher: string;
}

export const MOCK_GROUP_RANKING: GroupRanking[] = [
    { id: 'group-102', name: '3er Grado - Grupo B', masteryScore: 855, teacher: 'Prof. García' },
    { id: 'group-101', name: '3er Grado - Grupo A', masteryScore: 820, teacher: 'Prof. Rodríguez' },
    { id: 'group-201', name: '2do Grado - Grupo A', masteryScore: 790, teacher: 'Prof. Martínez' },
    { id: 'group-202', name: '2do Grado - Grupo B', masteryScore: 785, teacher: 'Prof. Hernandez' },
];

export const MOCK_SCHOOL_RANKING: SchoolRanking[] = [
    { id: 'school-01', name: 'Colegio Vanguardia', masteryScore: 835 },
    { id: 'school-02', name: 'Instituto Galileo', masteryScore: 810 },
    { id: 'school-03', name: 'Liceo Moderno', masteryScore: 795 },
];

export const MOCK_QUESTION_ANALYTICS: QuestionAnalytics[] = [
    { questionId: 'MOCK_M01', questionText: 'Si 2x + y = 7 y x - y = 2, ¿cuál es el valor de x?', subTopic: 'Álgebra', successRate: 92, avgTimeSeconds: 25, flag: 'none' },
    { questionId: 'P_M_F2', questionText: 'Uno de los factores de x^2 + 7x + 12 es:', subTopic: 'Factorización', successRate: 58, avgTimeSeconds: 48, flag: 'weak' },
    { questionId: 'P_L_A1', questionText: '¿Cuál de las siguientes palabras es esdrújula?', subTopic: 'Acentuación', successRate: 98, avgTimeSeconds: 15, flag: 'too_easy' },
    { questionId: 'P_M_E3', questionText: 'Si un número se duplica y se le resta 7, el resultado es 11...', subTopic: 'Ecuaciones', successRate: 65, avgTimeSeconds: 41, flag: 'weak' },
    { questionId: 'MOCK_L03', questionText: 'El informe meteorológico anunciaba cielos despejados...', subTopic: 'Inferencias', successRate: 85, avgTimeSeconds: 35, flag: 'none' },
];

// --- B2B Success Metrics ---
export const MOCK_DIRECTOR_KPIS: DirectorKpis = {
  weeklyActiveCoverage: { value: 92, trend: '+3% vs semana pasada' },
  learningLift: { value: 18, trend: '+2% vs mes pasado' },
  reportsDownloaded: 12,
  interventions: [
    "Refuerzo grupal en 'Factorización' para 3er Grado - Grupo A.",
    "Plan de tutoría 1:1 para 5 alumnos con baja actividad.",
    "Revisión de ítems de 'Comprensión Lectora' con docentes."
  ],
  renewalIntent: 95,
};

export const MOCK_TEACHER_KPIS: TeacherKpis = {
  reinforcementsSent: 8,
  groupLearningLift: {
    value: 21,
    description: 'Mejora promedio (Diag. vs Sum.)'
  }
};

// --- B2B Teacher Mocks ---
export const MOCK_TEACHER_GROUPS: Group[] = [
    { id: 'group-101', name: '3er Grado - Grupo A', studentCount: 28, subject: 'Matemáticas' },
    { id: 'group-103', name: '3er Grado - Grupo A', studentCount: 28, subject: 'Lengua' },
    { id: 'group-102', name: '2do Grado - Grupo C', studentCount: 32, subject: 'Historia' },
];

export const MOCK_HEATMAP_DATA: SubtopicResult[] = [
    { 
        subtopic: 'Ecuaciones de 1er Grado', 
        results: [
            { studentId: 's1', studentName: 'Ana Pérez', score: 95 },
            { studentId: 's2', studentName: 'Luis García', score: 82 },
            { studentId: 's3', studentName: 'Carlos Gomez', score: 88 },
            { studentId: 's4', studentName: 'Sofía Martínez', score: 91 },
        ]
    },
    { 
        subtopic: 'Factorización', 
        results: [
            { studentId: 's1', studentName: 'Ana Pérez', score: 65 },
            { studentId: 's2', studentName: 'Luis García', score: 72 },
            { studentId: 's3', studentName: 'Carlos Gomez', score: 55 },
            { studentId: 's4', studentName: 'Sofía Martínez', score: 68 },
        ]
    },
    { 
        subtopic: 'Teorema de Pitágoras', 
        results: [
            { studentId: 's1', studentName: 'Ana Pérez', score: 100 },
            { studentId: 's2', studentName: 'Luis García', score: 91 },
            { studentId: 's3', studentName: 'Carlos Gomez', score: 94 },
            { studentId: 's4', studentName: 'Sofía Martínez', score: 98 },
        ]
    },
    { 
        subtopic: 'Razones Trigonométricas', 
        results: [
            { studentId: 's1', studentName: 'Ana Pérez', score: 45 },
            { studentId: 's2', studentName: 'Luis García', score: 38 },
            { studentId: 's3', studentName: 'Carlos Gomez', score: 52 },
            { studentId: 's4', studentName: 'Sofía Martínez', score: 61 },
        ]
    }
];

// --- B2B Director Mocks ---
export const MOCK_TEACHERS: TeacherInfo[] = [
    { id: 't1', name: 'Prof. Ana Rodríguez', email: 'ana.r@escuela.com', groups: ['3A - Matemáticas', '3A - Lengua'] },
    { id: 't2', name: 'Prof. David García', email: 'david.g@escuela.com', groups: ['3B - Matemáticas', '3B - Lengua'] },
    { id: 't3', name: 'Prof. Laura Martínez', email: 'laura.m@escuela.com', groups: ['2A - Historia'] },
];

export const MOCK_SCHOOL_SUBSCRIPTION: SchoolSubscription = {
    planName: 'Plan Escolar Pro',
    status: 'active',
    studentLicenses: { total: 150, used: 128 },
    teacherLicenses: { total: 10, used: 8 },
    renewalDate: '2025-08-01T00:00:00Z',
};

export const MOCK_GROUP_REPORTS: GroupReport[] = [
    { groupId: 'group-101', groupName: '3er Grado - Grupo A', subject: 'Matemáticas', avgProgress: 72, avgActivity: 3.5, weakestSubtopic: 'Factorización' },
    { groupId: 'group-103', groupName: '3er Grado - Grupo A', subject: 'Lengua', avgProgress: 81, avgActivity: 2.8, weakestSubtopic: 'Uso de la coma' },
    // FIX: Replaced 'name' property with 'groupName' to match the GroupReport type definition.
    { groupId: 'group-102', groupName: '2do Grado - Grupo C', subject: 'Historia', avgProgress: 65, avgActivity: 4.1, weakestSubtopic: 'Revolución Francesa' },
];

// --- NEW DIRECTOR MOCKS ---
export const MOCK_ACADEMIC_ANALYSIS_DATA = {
  subjectMastery: [
    { subject: 'Matemáticas', A: 78 },
    { subject: 'Lengua', A: 85 },
    { subject: 'Biología', A: 72 },
    { subject: 'Historia', A: 68 },
    { subject: 'Física', A: 65 },
  ],
  teacherPerformance: [
    { name: 'Prof. Rodríguez', progress: 82 },
    { name: 'Prof. García', progress: 75 },
    { name: 'Prof. Martínez', progress: 88 },
    { name: 'Prof. Hernandez', progress: 71 },
  ],
  schoolStrengths: [
    { topic: 'Ecuaciones de 1er Grado', mastery: 92 },
    { topic: 'Teorema de Pitágoras', mastery: 91 },
    { topic: 'Idea Principal', mastery: 89 },
  ],
  schoolOpportunities: [
    { topic: 'Factorización', mastery: 58 },
    { topic: 'Uso de la Coma', mastery: 61 },
    { topic: 'Razones Trigonométricas', mastery: 64 },
  ]
};

export const MOCK_SCHOOL_STUDENTS = [
    { id: 's1', name: 'Ana Sofía R.', group: '3A', masteryScore: 920, progress: 95, activity: 'Alta' },
    { id: 's2', name: 'Carlos Gomez', group: '3A', masteryScore: 710, progress: 68, activity: 'Media' },
    { id: 's3', name: 'Luis Garcia', group: '3B', masteryScore: 680, progress: 65, activity: 'Baja' },
    { id: 's4', name: 'Elena Torres', group: '3B', masteryScore: 890, progress: 91, activity: 'Alta' },
    { id: 's5', name: 'Pedro Morales', group: '2A', masteryScore: 780, progress: 75, activity: 'Media' },
];


// --- LEGACY/UNUSED CONSTANTS ---
export const MOCK_USER_STUDENT: User = MOCK_USER_ALUMNO; // For compatibility if referenced elsewhere

const UNAMLogo = () => React.createElement('div', { className: "w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center font-bold text-white ring-2 ring-yellow-400" }, 'U');
const IPNLogo = () => React.createElement('div', { className: "w-10 h-10 bg-red-900 rounded-full flex items-center justify-center font-bold text-white ring-2 ring-yellow-400" }, 'IPN');

export const UNIVERSITY_OPTIONS = [
    {
        id: 'unam',
        name: 'UNAM',
        Logo: UNAMLogo,
        areas: [
            { id: 'unam_area1', name: 'Físico-Matemáticas e Ingenierías', Icon: Cog, subjects: ['Matemáticas'] as Subject[] },
            { id: 'unam_area2', name: 'Ciencias Biológicas y de la Salud', Icon: Stethoscope, subjects: ['Biología', 'Matemáticas', 'Lengua'] as Subject[] },
            { id: 'unam_area3', name: 'Ciencias Sociales', Icon: Scale, subjects: ['Lengua', 'Matemáticas'] as Subject[] },
            { id: 'unam_area4', name: 'Humanidades y de las Artes', Icon: Brain, subjects: ['Lengua'] as Subject[] },
        ]
    },
    {
        id: 'ipn',
        name: 'IPN',
        Logo: IPNLogo,
        areas: [
            { id: 'ipn_area1', name: 'Ingeniería y Cs. Físico Matemáticas', Icon: Cog, subjects: ['Matemáticas'] as Subject[] },
            { id: 'ipn_area2', name: 'Ciencias Médico Biológicas', Icon: Stethoscope, subjects: ['Biología', 'Lengua'] as Subject[] },
            { id: 'ipn_area3', name: 'Ciencias Sociales y Administrativas', Icon: Briefcase, subjects: ['Lengua', 'Matemáticas'] as Subject[] },
        ]
    }
];


export const AREA_TO_DIAGNOSIS_SUBJECT: Record<string, 'Matemáticas' | 'Comprensión Lectora'> = {
    unam_area1: 'Matemáticas',
    unam_area2: 'Comprensión Lectora',
    unam_area3: 'Comprensión Lectora',
    unam_area4: 'Comprensión Lectora',
    ipn_area1: 'Matemáticas',
    ipn_area2: 'Comprensión Lectora',
    ipn_area3: 'Matemáticas',
};

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: 'como-usar-tutor-con-rag',
        title: 'Cómo Aprovechar al Máximo tu Tutor IA con RAG',
        excerpt: 'Descubre cómo nuestro tutor IA utiliza RAG para darte respuestas precisas y citadas directamente de las guías de estudio.',
        content: `...`,
        author: 'Equipo TutoriA',
        date: '2024-07-10'
    },
];

export const RANKING_DATA = [
    { rank: 1, name: 'CyberPilot', xp: 15200, medals: 5 },
    { rank: 2, name: 'QuantumLeap', xp: 14850, medals: 3 },
    { rank: 3, name: 'NovaGamer', xp: 14500, medals: 4 },
    { rank: 4, name: 'Estudiante Demo', xp: 1250, medals: 2, isCurrentUser: true },
    { rank: 5, name: 'SyntaxError', xp: 11900, medals: 1 },
];

export const STATISTICS_DATA = {
  accuracy: [
    { name: 'Matemáticas', value: 85 },
    { name: 'Lengua', value: 92 },
  ],
  studyTime: [
    { name: 'Lun', value: 120 }, { name: 'Mar', value: 150 },
  ],
  progress: [
    { name: 'Sem 1', value: 10 }, { name: 'Sem 2', value: 25 },
  ],
};
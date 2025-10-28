

import React from 'react';
export type SubscriptionStatus = 'none' | 'active' | 'past_due' | 'canceled';

export interface Subscription {
  status: SubscriptionStatus;
  expiresISO?: string; // For demo mode
}

export interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  activateDemo: () => void;
}

export type UserRole = 'director' | 'docente' | 'alumno' | 'admin';

export type GradeLevel = 'primaria' | 'secundaria' | 'preparatoria' | 'universidad';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId: string;
  schoolName: string;
  groupId?: string;
  groupName?: string;
  xp: number;
  accuracy: number;
  streak: number;
  activeSubjects: number;
  examDate?: string;
  tokenSavingMode: boolean;
  career?: string;
  masteryScore: number;
  gradeLevel?: GradeLevel;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
  updateUser: (data: Partial<User>) => void;
}

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
}

export type TutorId = string;

export interface TutorConfig {
    id: TutorId;
    name: string;
    subject: Subject;
    sourceDocIds: string[];
    techniques: {
        socratic: number;
        hints: number;
        interleaving: number;
    };
    difficulty: {
        base: 'easy' | 'medium' | 'hard';
    };
    tone: string;
}

export interface SkillRecord {
  accuracy: number; // 0-100
  difficulty: number; // 1-5, recommended difficulty for next session
  confidence: number; // 1-3, user's average confidence
  lastUpdated: string;
}

// --- SRS ---
export interface SrsData {
  level: number;
  lastReviewed: string; // ISO date string
  due: string; // ISO date string
  isScheduled: boolean;
}

export interface StudentProfile {
    userId: string;
    skills: Record<string, Partial<SkillRecord>>; // e.g. "mate_álgebra" -> SkillRecord
    srsData?: Record<string, SrsData>; // NEW for SRS
    learningStyle: 'visual' | 'kinesthetic' | 'auditory' | 'reading' | 'mixed';
    lastInteraction: Record<string, string>;
    cognitive: {
      autoexplicacionCount: number;
      autoexplicacionRichCount: number;
      repasoD10Count: number;
      practiceHardCount: number;
      pistasUsadas: number;
      // NEW from diagnosis
      criticalThinking?: number; // 1-5
      problemSolving?: number; // 1-5
    };
    psychoEmotional?: { // NEW
      motivation: number; // 1-5
      stressManagement: number; // 1-5
    };
}

// --- Gamificación y Metalogros ---

export type AchievementId = 
  'primer_paso' | 'ritmo_3' | 'ritmo_5' | 'ritmo_7' | 'ritmo_10' | 
  'sim_60' | 'sim_65' | 'sim_75' | 'mejora_10' | 
  'primera_practica' | 'practica_10' | 'practica_dificil_3' |
  'autoexplicacion_3' | 'autoexplicacion_rica_3' |
  'repaso_d10_2' | 'pretest_2' |
  'nback_2' | 'nback_3' | 'switch_cost_300' | 'rsvp_wpm_300';
  
export type AchievementCategory = 'diagnostic' | 'habit' | 'mock_exam' | 'practice' | 'review' | 'cognition';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
}

export type Subject = 'Matemáticas' | 'Lengua' | 'Biología' | 'Física' | 'Química' | 'Historia';
export type MetaAchievementLevel = 'Bronce' | 'Plata' | 'Oro' | 'Platino';

export type MetaAchievementId = 
  'gauss' | 'noether' | 'ramanujan' | 'euler' |
  'sor_juana' | 'cervantes' | 'borges' | 'mistral';

export interface MetaAchievement {
  id: MetaAchievementId;
  subject: Subject;
  level: MetaAchievementLevel;
  name: string;
  description: string;
  bio: string;
  icon: string; // TaIcon name
  xpBonus: number;
  requirements: {
    baseAchievements: number;
    minStreak?: number;
    minMockAccuracy?: number;
    improvedMock?: boolean;
    practiceHardCount?: number;
    autoexplicacionRichCount?: number;
    repasoD10Count?: number;
    pretestCount?: number;
    minPracticeAccuracy?: number;
    pistasRate?: number;
  };
}

export interface MetaAchievementCollection {
    subject: Subject;
    name: string;
    achievements: MetaAchievement[];
}

export interface GamificationState {
  xp: number;
  streak: number;
  lastVisit: string;
  achievements: { [key in AchievementId]?: { awarded: string, category: AchievementCategory } };
  metaAchievements: { [key in MetaAchievementId]?: { awarded: string } };
}

export type FairUseState = 'normal' | 'pre-cap' | 'capped';

// --- Tutor Pro ---
export type TutorMode = 'learn' | 'practice' | 'review';

export interface Chunk {
  id: string;
  documentId: string;
  documentTitle: string;
  content: string;
  subTopic: string;
}

export interface Document {
  id: string;
  title: string;
  subject: Subject;
  topic: string; // e.g. Algebra
  subTopics: string[]; // e.g. Ecuaciones lineales
  type: 'pdf' | 'txt' | 'md';
  status: 'en_cola' | 'procesando' | 'indexado';
}

// State for each mode
export interface LearnContent {
  objectives: string[];
  introduction: string;
  mainContent: {
    title: string;
    text: string;
    example: string;
    visualAidDescription?: string;
  }[];
  summary: string;
}

export interface LearnState {
  step: 'explanation'; // Only one step now
  content: LearnContent;
  citations: Chunk[];
}

export interface PracticeState {
  question: string;
  hints: string[];
  solution: string;
  currentHintIndex: number;
  userConfidence?: 1 | 2 | 3;
  citations: Chunk[];
}

export interface ReviewState {
  flashcards: { front: string; back: string }[];
  currentCardIndex: number;
  isFlipped: boolean;
}

export interface ExitTicketItem {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ExitTicketState {
  items: ExitTicketItem[];
  answers: (number | null)[];
  currentIndex: number;
  startTime: number;
}

export type TutorInteractionState =
  | { mode: 'learn'; state: LearnState; subTopic: string }
  | { mode: 'practice'; state: PracticeState; subTopic: string }
  | { mode: 'review'; state: ReviewState; subTopic: string }
  | { mode: 'exit_ticket'; state: ExitTicketState; subTopic: string }
  | null;

export interface AgendaEvent {
  id: string;
  dateISO: string;
  subject: Subject;
  subTopic: string;
  type: 'practice' | 'review' | 'simulacro' | 'game';
  completed: boolean;
  icon: 'practice' | 'review' | 'simulacro' | 'game';
  strategy?: string;
}

// --- Plan de Estudio Jerárquico ---
export interface SubTopic {
  id: string;
  name: string;
  status: 'locked' | 'available' | 'completed';
}

export interface MainTopic {
  name: string;
  subTopics: SubTopic[];
}

export type Syllabus = Record<Subject, MainTopic[]>;


// Block 5: Nudges for Free Study
export interface Nudge {
  id: string;
  icon: 'zap' | 'brain' | 'trending_up';
  title: string;
  description: string;
  cta: string;
  action: {
    path: string;
    state?: any;
  };
}

// Block 7: Dashboard Analytics
export interface SubjectProgress {
  name: Subject;
  progress: number; // 0-100
}

export interface Opportunity {
  area: string;
  accuracy: number; // 0-100
  recommendedActions: {
    label: string;
    type: 'learn' | 'practice' | 'game';
    path: string;
    state?: any;
  }[];
}

// NEW TYPES FOR DAILY MISSION
export interface MissionTask {
  id: string;
  icon: React.ElementType;
  description: string;
  isCompleted: boolean;
  path: string;
}

export interface DailyMission {
  title: string;
  tasks: MissionTask[];
  xpBonus: number;
}

export interface DashboardInsights {
  progressOverview: {
    totalProgress: number; // 0-100
    subjects: SubjectProgress[];
  };
  keyInsights: {
    topicsMastered: number;
    bestDay: string;
    personalizedTip: string;
    // NEW METRICS
    topicsCompleted: number;
    avgTopicScore: number;
    avgTopicTime: string;
  };
  opportunities: Opportunity[];
  dailyMission?: DailyMission; // NEW
}

// Block 8: Tutor Copilot
export interface StudentFocusReport {
  studentId: string;
  studentName: string;
  performance: string;
  errorPattern: string;
  recommendations: string[];
  subject: Subject;
  mainTopic: string;
}

export interface TutorCopilotReport {
  studentFocus: StudentFocusReport[];
  rubricDraft: string; // Markdown format
}

export interface EarlyAlert {
  id: string;
  studentName: string;
  type: 'Bajo Rendimiento' | 'Baja Actividad';
  description: string;
  studentId: string;
}

// User Preferences
export type StudyBlockTiming = '50/10' | '25/5';

export interface UserPreferences {
  tokenSavingModeForced: boolean;
  studyBlockTiming: StudyBlockTiming;
  accommodations: {
    extraTime: boolean;
    highContrast: boolean;
  };
}

// Block 9: Continuous Assessment
export interface PracticeQuestion {
    id: string;
    subTopic: string;
    text: string;
    options: string[];
    correctIndex: number;
    difficulty: number; // 1-5
}

export interface PracticeResult {
    question: PracticeQuestion;
    isCorrect: boolean;
    selectedIndex: number | null;
}

// Chat
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  interactiveQuestion?: InteractiveQuestion;
}

// NEW TYPE for interactive content in chat
export interface InteractiveQuestion {
  type: 'quick_quiz';
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}


// NEW TYPE
export interface StudentSuggestion {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  cta: {
    text: string;
    path: string;
    state?: any;
  };
}

// NEW TYPES for Review Library
export interface Flashcard {
  question: string;
  answer: string;
}

export interface ReviewMaterial {
  id: string;
  subject: Subject;
  mainTopic: string;
  createdAt: string; // ISO Date String
  summary: string;
  flashcards: Flashcard[];
}

// NEW TYPE for Teacher Reinforcements
export interface Reinforcement {
  id: string;
  teacherName: string;
  subject: Subject;
  mainTopic: string;
  note?: string;
  assignedAt: string; // ISO Date String
}

// --- B2B MODEL TYPES ---
export interface AssignedExam {
  id: string;
  title: string;
  subject: Subject;
  dueDate: string; // ISO Date String
  type: 'Diagnóstico' | 'Sumativo';
}

export interface QuestionAnalytics {
  questionId: string;
  questionText: string;
  subTopic: string;
  successRate: number; // 0-100
  avgTimeSeconds: number;
  flag: 'none' | 'weak' | 'too_easy';
}

// --- B2B Success Metrics ---
export interface DirectorKpis {
  weeklyActiveCoverage: {
    value: number; // percentage
    trend: string;
  };
  learningLift: {
    value: number; // percentage
    trend: string;
  };
  reportsDownloaded: number;
  interventions: string[];
  renewalIntent: number; // percentage
}

export interface TeacherKpis {
  reinforcementsSent: number;
  groupLearningLift: {
    value: number; // percentage
    description: string;
  };
}

// B2B Teacher Types
export interface Group {
    id: string;
    name: string;
    studentCount: number;
    subject: Subject;
}

export interface StudentResult {
    studentId: string;
    studentName: string;
    score: number; // 0-100
}

export interface SubtopicResult {
    subtopic: string;
    results: StudentResult[];
}

// --- B2B Director Types ---
export interface TeacherInfo {
    id: string;
    name: string;
    email: string;
    groups: string[];
}

export interface SchoolSubscription {
    planName: string;
    status: 'active' | 'past_due' | 'canceled';
    studentLicenses: {
        total: number;
        used: number;
    };
    teacherLicenses: {
        total: number;
        used: number;
    };
    renewalDate: string; // ISO Date string
}

export interface GroupReport {
    groupId: string;
    groupName: string;
    subject: Subject;
    avgProgress: number; // 0-100
    avgActivity: number; // hours per week
    weakestSubtopic: string;
}


// --- NEW TYPES ---
export interface GameSession {
    gameId: 'n-track' | 'focus-switch' | 'rsvp-gist';
    userName: string;
    timestamp: string; // ISO Date String
    score: number;
    metrics: {
        maxN?: number; // for n-track
        switchCostMs?: number; // for focus-switch
        wpm?: number; // for rsvp-gist
        comprehension?: boolean; // for rsvp-gist
    };
}

// FIX: Add ScoreEntry type definition for game rankings.
export interface ScoreEntry {
    name: string;
    score: number;
}

export interface ExamHistoryEntry {
    id: string;
    date: string; // "DD/MM/YYYY"
    name: string;
    subject: Subject;
    score: number;
}

export interface MasteryPoint {
    date: string; // "YYYY-MM-DD"
    masteryScore: number;
}

export interface SubjectMastery {
    subject: Subject;
    mastery: number; // 0-100
}

export interface TopicMastery {
    name: string;
    subject: Subject;
    mastery: number; // 0-100
}

export interface MasteryAnalytics {
    masteryOverTime: MasteryPoint[];
    masteryBySubject: SubjectMastery[];
    strengths: TopicMastery[];
    opportunities: TopicMastery[];
}
export interface SchoolRanking {
  id: string;
  name: string;
  masteryScore: number;
}

// --- SCREENING SYSTEM TYPES ---

export type LearningDifficultyType = 'dyslexia' | 'dyscalculia' | 'dysgraphia' | 'adhd' | 'dyspraxia';
export type AlertLevel = 'green' | 'yellow' | 'orange' | 'red';
export type IndicatorSeverity = 'low' | 'medium' | 'high';

export interface ScreeningIndicator {
  pattern: string;
  severity: IndicatorSeverity;
  frequency: number;
  examples: string[];
  timestamp: string; // ISO Date
}

export interface ScreeningTest {
  id: string;
  studentId: string;
  type: LearningDifficultyType;
  score: number; // 0-100
  confidence: number; // 0-100
  likelihood: 'low' | 'medium' | 'high';
  indicators: ScreeningIndicator[];
  recommendations: string[];
  testDate: string; // ISO Date
  alertLevel: AlertLevel;
}

export interface ScreeningAlert {
  id: string;
  studentId: string;
  studentName: string;
  type: LearningDifficultyType;
  level: AlertLevel;
  score: number;
  confidence: number;
  detectedAt: string; // ISO Date
  status: 'pending' | 'acknowledged' | 'in_progress' | 'resolved';
  notifiedTo: ('teacher' | 'director' | 'parent')[];
  notes?: string;
}

export interface Accommodation {
  id: string;
  studentId: string;
  type: LearningDifficultyType;
  enabled: boolean;
  settings: {
    // Dislexia
    dyslexiaFont?: boolean;
    fontSize?: number;
    lineSpacing?: number;
    wordSpacing?: number;
    textToSpeech?: boolean;
    highlightWords?: boolean;
    reducedTextPerPage?: boolean;
    extraTime?: number; // multiplicador (1.5 = 50% más tiempo)
    
    // Discalculia
    visualAids?: boolean;
    numberLine?: boolean;
    calculator?: boolean;
    stepByStepGuidance?: boolean;
    noTimers?: boolean;
    
    // Disgrafía
    voiceToText?: boolean;
    enhancedSpellCheck?: boolean;
    wordPrediction?: boolean;
    keyboardShortcuts?: boolean;
    reducedWriting?: boolean;
    
    // TDAH
    shortSessions?: boolean;
    sessionLength?: number; // minutos
    frequentBreaks?: boolean;
    breakReminders?: boolean;
    gamificationLevel?: 'low' | 'medium' | 'high';
    minimizeDistractions?: boolean;
  };
}

// Indicadores específicos por tipo

export interface DyslexiaIndicators {
  letterConfusion: Record<string, number>; // 'b/d': 5
  syllableReversal: { frequency: number; examples: string[] };
  readingSpeed: { wordsPerMinute: number; expectedForGrade: number; percentile: number };
  spellingErrors: { phoneticErrors: number; visualErrors: number; total: number };
  sequencingIssues: { monthsOfYear: number; daysOfWeek: number; alphabetRecitation: number };
}

export interface DyscalculiaIndicators {
  basicOperations: {
    addition: { errors: number; avgTime: number };
    subtraction: { errors: number; avgTime: number };
    multiplication: { errors: number; avgTime: number };
    division: { errors: number; avgTime: number };
  };
  numberSense: {
    magnitudeComparison: number; // score 0-100
    numberLine: number;
    estimation: number;
  };
  symbolConfusion: Record<string, number>; // '+/-': 3
  placeValue: { errors: number; understandingScore: number };
  anxiety: { timeToStart: number; abandonmentRate: number; helpRequests: number };
}

export interface DysgraphiaIndicators {
  legibility: { ocrConfidence: number; letterFormation: number };
  spacing: {
    betweenLetters: { variance: number; consistency: number };
    betweenWords: { variance: number; consistency: number };
  };
  casing: { inappropriateMixing: number; consistency: number };
  speed: { charactersPerMinute: number; expectedForGrade: number; percentile: number };
  pressure?: { variance: number; heavyStrokes: number; lightStrokes: number };
  fatigue: { qualityDegradation: number; sessionDuration: number };
}

export interface ADHDIndicators {
  attention: {
    averageSessionDuration: number;
    sessionsAbandoned: number;
    taskSwitching: number;
  };
  impulsivity: {
    averageResponseTime: number;
    errorsFromHaste: number;
    reviewBeforeSubmit: boolean;
  };
  followThrough: {
    multiStepCompletion: number;
    instructionErrors: number;
  };
  hyperactivity?: {
    clicksPerMinute: number;
    scrollingBehavior: number;
  };
  consistency: {
    performanceVariance: number;
    goodDays: number;
    badDays: number;
  };
}

export interface ScreeningReport {
  studentId: string;
  studentName: string;
  generatedAt: string; // ISO Date
  tests: ScreeningTest[];
  currentAlerts: ScreeningAlert[];
  accommodations: Accommodation[];
  historicalTrend: {
    type: LearningDifficultyType;
    scores: Array<{ date: string; score: number }>;
  }[];
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    resources: Array<{ title: string; url: string; type: 'article' | 'video' | 'tool' }>;
  };
}

// ==========================================
// CONTENT MANAGEMENT SYSTEM (CMS) TYPES
// ==========================================

export type ContentType = 'task' | 'review' | 'exam' | 'lesson' | 'resource';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching' | 'fill_blank' | 'numeric';
export type GradingType = 'auto' | 'manual' | 'mixed';

export interface ContentAttachment {
  id: string;
  filename: string;
  url: string;
  type: 'pdf' | 'image' | 'video' | 'audio' | 'document';
  size: number; // bytes
  uploadedAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string; // explicación de por qué es correcta/incorrecta
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string; // puede contener LaTeX
  points: number;
  options?: QuestionOption[]; // para multiple_choice
  correctAnswer?: string; // para short_answer, true_false, numeric
  acceptableAnswers?: string[]; // respuestas alternativas aceptables
  caseSensitive?: boolean;
  rubric?: string; // para essay y short_answer
  explanation?: string; // explicación de la respuesta correcta
  hints?: string[]; // pistas progresivas
  tags: string[]; // ej: ['algebra', 'ecuaciones', 'primer-grado']
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime?: number; // segundos
  attachments?: ContentAttachment[];
}

export interface TeacherContent {
  id: string;
  teacherId: string;
  teacherName: string;
  schoolId: string;
  
  // Metadata
  type: ContentType;
  title: string;
  description?: string;
  subject: string;
  topic?: string;
  subtopic?: string;
  tags: string[];
  status: ContentStatus;
  
  // Content
  instructions?: string; // texto enriquecido con LaTeX
  questions: Question[];
  totalPoints: number;
  
  // Config
  gradingType: GradingType;
  allowLateSubmission: boolean;
  lateSubmissionPenalty?: number; // porcentaje de penalización por día
  maxAttempts?: number;
  showCorrectAnswers: boolean;
  showCorrectAnswersAfter?: 'immediate' | 'after_due' | 'never';
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  requireProctoring?: boolean;
  
  // Assignment info
  assignedGroups: string[]; // IDs de grupos
  dueDate?: string; // ISO Date
  availableFrom?: string; // ISO Date
  availableUntil?: string; // ISO Date
  estimatedDuration?: number; // minutos
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  
  // Attachments
  attachments: ContentAttachment[];
  
  // Analytics
  stats?: {
    totalAssigned: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    avgScore: number;
    avgTimeSpent: number; // minutos
  };
}

export interface StudentSubmission {
  id: string;
  contentId: string;
  studentId: string;
  studentName: string;
  groupId: string;
  
  // Submission
  submittedAt?: string; // ISO Date
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'returned';
  isLate: boolean;
  attemptNumber: number;
  
  // Answers
  answers: Array<{
    questionId: string;
    answer: string | string[]; // string[] for matching questions
    points?: number; // asignado después de calificar
    feedback?: string; // del profesor
    isCorrect?: boolean;
    timeSpent?: number; // segundos
  }>;
  
  // Grading
  score?: number;
  maxScore: number;
  percentage?: number;
  grade?: string; // A+, A, B+, etc.
  gradedBy?: string; // teacherId
  gradedAt?: string;
  teacherComments?: string;
  
  // Time tracking
  startedAt?: string;
  timeSpent?: number; // minutos
  lastActivity?: string;
  
  // Attachments (para essays y trabajos)
  attachments?: ContentAttachment[];
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: ContentType;
  subject: string;
  tags: string[];
  questions: Question[];
  createdBy: string;
  isPublic: boolean;
  usageCount: number;
}

export interface GradingRubric {
  id: string;
  name: string;
  criteria: Array<{
    name: string;
    description: string;
    maxPoints: number;
    levels: Array<{
      name: string; // ej: "Excelente", "Bueno", "Regular", "Insuficiente"
      points: number;
      description: string;
    }>;
  }>;
  totalPoints: number;
}

// ============================================
// SISTEMA EDUCATIVO COMPLETO
// ============================================

export type Materia = 'matematicas' | 'fisica' | 'quimica' | 'biologia' | 'historia' | 'literatura' | 'ingles';

export interface School {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  telefono: string;
  email: string;
  directorId?: string;
  logo?: string;
  niveles: GradeLevel[];
  totalAlumnos: number;
  totalProfesores: number;
  totalGrupos: number;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupoEscolar {
  id: string;
  nombre: string; // ej: "3A - Matemáticas"
  nivel: GradeLevel;
  grado: number; // 1-6 para primaria, 1-3 para secundaria, 1-3 para preparatoria
  materia: Materia;
  profesorId: string;
  profesorNombre?: string;
  schoolId: string;
  schoolNombre?: string;
  alumnosIds: string[];
  totalAlumnos: number;
  horario?: {
    [dia: string]: string; // ej: "lunes": "08:00-09:30"
  };
  activo: boolean;
  createdAt: Date;
}

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  materia: Materia;
  grupoId: string;
  grupoNombre?: string;
  profesorId: string;
  profesorNombre?: string;
  fechaCreacion: Date;
  fechaEntrega: Date;
  puntos: number;
  archivoAdjunto?: string;
  instrucciones?: string;
  entregas: TareaEntrega[];
  estadisticas: {
    total: number;
    entregadas: number;
    pendientes: number;
    calificadas: number;
    promedioCalificacion: number;
  };
}

export interface TareaEntrega {
  id: string;
  tareaId: string;
  alumnoId: string;
  alumnoNombre?: string;
  fechaEntrega: Date;
  archivo?: string;
  contenido?: string;
  calificacion?: number;
  comentarios?: string;
  estado: 'pendiente' | 'entregada' | 'calificada' | 'tarde';
}

export interface Examen {
  id: string;
  titulo: string;
  descripcion: string;
  materia: Materia;
  grupoId: string;
  grupoNombre?: string;
  profesorId: string;
  profesorNombre?: string;
  fechaExamen: Date;
  duracion: number; // minutos
  puntosTotales: number;
  preguntas: Question[];
  calificaciones: ExamenCalificacion[];
  medallaAsociada?: {
    id: string;
    nombre: string;
    cientifico: string;
    criterio: number; // calificación mínima para obtenerla
  };
  estadisticas: {
    total: number;
    presentados: number;
    aprobados: number;
    reprobados: number;
    promedioGrupo: number;
    calificacionMaxima: number;
    calificacionMinima: number;
  };
}

export interface ExamenCalificacion {
  id: string;
  examenId: string;
  alumnoId: string;
  alumnoNombre?: string;
  calificacion: number;
  respuestas: any[];
  fechaPresentacion: Date;
  tiempoEmpleado: number; // minutos
  aprobado: boolean;
  medallaObtenida?: string;
}

export interface Medalla {
  id: string;
  nombre: string;
  descripcion: string;
  cientifico: {
    nombre: string;
    imagen: string;
    bio: string;
    logro: string;
    fechaNacimiento?: string;
    nacionalidad?: string;
  };
  materia?: Materia;
  tipo: 'examen' | 'tarea' | 'juego' | 'racha' | 'especial';
  nivel: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  xpRequerido?: number;
  criterio: string;
  rareza: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icono: string;
  color: string;
  otorgadaA: string[]; // IDs de usuarios que la tienen
  totalOtorgadas: number;
  createdAt: Date;
}

export interface UserMedalla {
  medallaId: string;
  medalla?: Medalla;
  userId: string;
  fechaObtencion: Date;
  contexto: string; // ej: "Examen de Química - 95/100"
  esVisible: boolean;
}

export interface Notificacion {
  id: string;
  userId: string;
  tipo: 'tarea' | 'examen' | 'calificacion' | 'medalla' | 'sistema';
  titulo: string;
  mensaje: string;
  icono?: string;
  link?: string;
  leida: boolean;
  fechaCreacion: Date;
}

export interface ActividadReciente {
  id: string;
  userId: string;
  userName?: string;
  tipo: 'tarea_entregada' | 'examen_presentado' | 'medalla_obtenida' | 'comentario' | 'calificacion';
  descripcion: string;
  entidad: string; // ID de la tarea, examen, etc.
  fecha: Date;
}
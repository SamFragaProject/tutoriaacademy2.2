/**
 * Sistema de Gestión de Contenido (CMS) para Profesores
 * Permite crear, editar y gestionar tareas, repasos y exámenes
 */

import type { 
  TeacherContent, 
  StudentSubmission, 
  Question, 
  ContentTemplate,
  GradingRubric,
  ContentType,
  ContentStatus 
} from '../types';

// Storage temporal (migrar a DB)
const contents = new Map<string, TeacherContent>();
const submissions = new Map<string, StudentSubmission>();
const templates = new Map<string, ContentTemplate>();
const rubrics = new Map<string, GradingRubric>();

/**
 * Genera un ID único
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Crea un nuevo contenido educativo
 */
export function createContent(
  teacherId: string,
  teacherName: string,
  schoolId: string,
  content: Partial<TeacherContent>
): TeacherContent {
  const id = generateId();
  
  const newContent: TeacherContent = {
    id,
    teacherId,
    teacherName,
    schoolId,
    type: content.type || 'task',
    title: content.title || 'Sin título',
    description: content.description,
    subject: content.subject || '',
    topic: content.topic,
    subtopic: content.subtopic,
    tags: content.tags || [],
    status: 'draft',
    instructions: content.instructions,
    questions: content.questions || [],
    totalPoints: calculateTotalPoints(content.questions || []),
    gradingType: content.gradingType || 'auto',
    allowLateSubmission: content.allowLateSubmission ?? true,
    lateSubmissionPenalty: content.lateSubmissionPenalty,
    maxAttempts: content.maxAttempts,
    showCorrectAnswers: content.showCorrectAnswers ?? true,
    showCorrectAnswersAfter: content.showCorrectAnswersAfter || 'after_due',
    shuffleQuestions: content.shuffleQuestions ?? false,
    shuffleOptions: content.shuffleOptions ?? false,
    requireProctoring: content.requireProctoring,
    assignedGroups: content.assignedGroups || [],
    dueDate: content.dueDate,
    availableFrom: content.availableFrom,
    availableUntil: content.availableUntil,
    estimatedDuration: content.estimatedDuration,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attachments: content.attachments || []
  };
  
  contents.set(id, newContent);
  return newContent;
}

/**
 * Calcula el puntaje total sumando los puntos de todas las preguntas
 */
function calculateTotalPoints(questions: Question[]): number {
  return questions.reduce((total, q) => total + q.points, 0);
}

/**
 * Actualiza un contenido existente
 */
export function updateContent(
  contentId: string,
  updates: Partial<TeacherContent>
): TeacherContent | null {
  const content = contents.get(contentId);
  if (!content) return null;
  
  const updated: TeacherContent = {
    ...content,
    ...updates,
    id: contentId, // no permitir cambiar el ID
    updatedAt: new Date().toISOString(),
    totalPoints: updates.questions 
      ? calculateTotalPoints(updates.questions)
      : content.totalPoints
  };
  
  contents.set(contentId, updated);
  return updated;
}

/**
 * Publica un contenido (cambia status a published)
 */
export function publishContent(contentId: string): TeacherContent | null {
  const content = contents.get(contentId);
  if (!content) return null;
  
  const published: TeacherContent = {
    ...content,
    status: 'published',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  contents.set(contentId, published);
  
  // Crear submissions para todos los estudiantes asignados
  createSubmissionsForContent(published);
  
  return published;
}

/**
 * Archiva un contenido
 */
export function archiveContent(contentId: string): TeacherContent | null {
  const content = contents.get(contentId);
  if (!content) return null;
  
  const archived: TeacherContent = {
    ...content,
    status: 'archived',
    updatedAt: new Date().toISOString()
  };
  
  contents.set(contentId, archived);
  return archived;
}

/**
 * Elimina un contenido (solo drafts)
 */
export function deleteContent(contentId: string): boolean {
  const content = contents.get(contentId);
  if (!content || content.status !== 'draft') return false;
  
  return contents.delete(contentId);
}

/**
 * Obtiene un contenido por ID
 */
export function getContent(contentId: string): TeacherContent | null {
  return contents.get(contentId) || null;
}

/**
 * Obtiene todos los contenidos de un profesor
 */
export function getTeacherContents(
  teacherId: string,
  filters?: {
    type?: ContentType;
    status?: ContentStatus;
    subject?: string;
    search?: string;
  }
): TeacherContent[] {
  let results = Array.from(contents.values())
    .filter(c => c.teacherId === teacherId);
  
  if (filters?.type) {
    results = results.filter(c => c.type === filters.type);
  }
  
  if (filters?.status) {
    results = results.filter(c => c.status === filters.status);
  }
  
  if (filters?.subject) {
    results = results.filter(c => c.subject === filters.subject);
  }
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(c => 
      c.title.toLowerCase().includes(searchLower) ||
      c.description?.toLowerCase().includes(searchLower) ||
      c.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  // Ordenar por fecha de actualización (más recientes primero)
  return results.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * Obtiene contenidos asignados a un grupo específico
 */
export function getGroupContents(groupId: string): TeacherContent[] {
  return Array.from(contents.values())
    .filter(c => 
      c.status === 'published' && 
      c.assignedGroups.includes(groupId)
    )
    .sort((a, b) => {
      // Ordenar por fecha de entrega (próximos primero)
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
}

/**
 * Crea submissions iniciales para un contenido publicado
 */
function createSubmissionsForContent(content: TeacherContent): void {
  // En producción, esto consultaría la DB para obtener estudiantes del grupo
  // Por ahora, es una función placeholder
  console.log(`Creating submissions for content ${content.id} for groups:`, content.assignedGroups);
}

/**
 * Registra el inicio de un estudiante en un contenido
 */
export function startSubmission(
  contentId: string,
  studentId: string,
  studentName: string,
  groupId: string
): StudentSubmission {
  const content = contents.get(contentId);
  if (!content) throw new Error('Content not found');
  
  const submissionId = `${contentId}-${studentId}`;
  
  // Verificar si ya existe una submission
  let submission = submissions.get(submissionId);
  
  if (!submission) {
    // Crear nueva submission
    submission = {
      id: submissionId,
      contentId,
      studentId,
      studentName,
      groupId,
      status: 'in_progress',
      isLate: content.dueDate ? new Date() > new Date(content.dueDate) : false,
      attemptNumber: 1,
      answers: [],
      maxScore: content.totalPoints,
      startedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
  } else {
    // Actualizar submission existente
    submission.status = 'in_progress';
    submission.lastActivity = new Date().toISOString();
    if (!submission.startedAt) {
      submission.startedAt = new Date().toISOString();
    }
  }
  
  submissions.set(submissionId, submission);
  return submission;
}

/**
 * Guarda una respuesta de estudiante
 */
export function saveAnswer(
  submissionId: string,
  questionId: string,
  answer: string | string[],
  timeSpent?: number
): StudentSubmission | null {
  const submission = submissions.get(submissionId);
  if (!submission) return null;
  
  // Buscar si ya existe una respuesta para esta pregunta
  const existingIndex = submission.answers.findIndex(a => a.questionId === questionId);
  
  const answerData = {
    questionId,
    answer,
    timeSpent
  };
  
  if (existingIndex >= 0) {
    submission.answers[existingIndex] = answerData;
  } else {
    submission.answers.push(answerData);
  }
  
  submission.lastActivity = new Date().toISOString();
  submissions.set(submissionId, submission);
  
  return submission;
}

/**
 * Envía la submission para calificación
 */
export function submitSubmission(submissionId: string): StudentSubmission | null {
  const submission = submissions.get(submissionId);
  if (!submission) return null;
  
  const content = contents.get(submission.contentId);
  if (!content) return null;
  
  submission.submittedAt = new Date().toISOString();
  submission.status = 'submitted';
  submission.isLate = content.dueDate 
    ? new Date(submission.submittedAt) > new Date(content.dueDate)
    : false;
  
  // Calcular tiempo total
  if (submission.startedAt) {
    const start = new Date(submission.startedAt).getTime();
    const end = new Date(submission.submittedAt).getTime();
    submission.timeSpent = Math.round((end - start) / 60000); // minutos
  }
  
  // Auto-calificar si es posible
  if (content.gradingType === 'auto') {
    autoGradeSubmission(submission, content);
  }
  
  submissions.set(submissionId, submission);
  return submission;
}

/**
 * Calificación automática
 */
function autoGradeSubmission(submission: StudentSubmission, content: TeacherContent): void {
  let totalScore = 0;
  
  for (const answer of submission.answers) {
    const question = content.questions.find(q => q.id === answer.questionId);
    if (!question) continue;
    
    let points = 0;
    let isCorrect = false;
    
    switch (question.type) {
      case 'multiple_choice':
        const correctOption = question.options?.find(o => o.isCorrect);
        if (correctOption && answer.answer === correctOption.id) {
          points = question.points;
          isCorrect = true;
        }
        break;
      
      case 'true_false':
        if (answer.answer.toString().toLowerCase() === question.correctAnswer?.toLowerCase()) {
          points = question.points;
          isCorrect = true;
        }
        break;
      
      case 'numeric':
        const numAnswer = parseFloat(answer.answer.toString());
        const numCorrect = parseFloat(question.correctAnswer || '0');
        if (!isNaN(numAnswer) && !isNaN(numCorrect) && Math.abs(numAnswer - numCorrect) < 0.01) {
          points = question.points;
          isCorrect = true;
        }
        break;
      
      case 'short_answer':
        const studentAnswer = answer.answer.toString();
        if (question.correctAnswer) {
          const isMatch = question.caseSensitive
            ? studentAnswer === question.correctAnswer
            : studentAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
          
          if (isMatch || question.acceptableAnswers?.some(a => 
            question.caseSensitive ? a === studentAnswer : a.toLowerCase() === studentAnswer.toLowerCase()
          )) {
            points = question.points;
            isCorrect = true;
          }
        }
        break;
      
      case 'fill_blank':
        // Similar a short_answer
        if (question.correctAnswer === answer.answer) {
          points = question.points;
          isCorrect = true;
        }
        break;
      
      default:
        // essay y matching requieren calificación manual
        break;
    }
    
    answer.points = points;
    answer.isCorrect = isCorrect;
    totalScore += points;
  }
  
  submission.score = totalScore;
  submission.maxScore = content.totalPoints;
  submission.percentage = content.totalPoints > 0 
    ? Math.round((totalScore / content.totalPoints) * 100)
    : 0;
  submission.status = content.gradingType === 'auto' ? 'graded' : 'submitted';
  submission.gradedAt = new Date().toISOString();
  submission.gradedBy = 'auto-grader';
  
  // Asignar letra de calificación
  submission.grade = calculateLetterGrade(submission.percentage);
}

/**
 * Convierte un porcentaje a letra de calificación
 */
function calculateLetterGrade(percentage: number): string {
  if (percentage >= 95) return 'A+';
  if (percentage >= 90) return 'A';
  if (percentage >= 85) return 'B+';
  if (percentage >= 80) return 'B';
  if (percentage >= 75) return 'C+';
  if (percentage >= 70) return 'C';
  if (percentage >= 65) return 'D+';
  if (percentage >= 60) return 'D';
  return 'F';
}

/**
 * Calificación manual por el profesor
 */
export function gradeSubmission(
  submissionId: string,
  teacherId: string,
  grades: Array<{ questionId: string; points: number; feedback?: string }>,
  teacherComments?: string
): StudentSubmission | null {
  const submission = submissions.get(submissionId);
  if (!submission) return null;
  
  let totalScore = 0;
  
  for (const grade of grades) {
    const answer = submission.answers.find(a => a.questionId === grade.questionId);
    if (answer) {
      answer.points = grade.points;
      answer.feedback = grade.feedback;
      totalScore += grade.points;
    }
  }
  
  submission.score = totalScore;
  submission.percentage = submission.maxScore > 0 
    ? Math.round((totalScore / submission.maxScore) * 100)
    : 0;
  submission.grade = calculateLetterGrade(submission.percentage);
  submission.status = 'graded';
  submission.gradedBy = teacherId;
  submission.gradedAt = new Date().toISOString();
  submission.teacherComments = teacherComments;
  
  submissions.set(submissionId, submission);
  return submission;
}

/**
 * Obtiene todas las submissions de un contenido
 */
export function getContentSubmissions(contentId: string): StudentSubmission[] {
  return Array.from(submissions.values())
    .filter(s => s.contentId === contentId)
    .sort((a, b) => {
      // Ordenar por fecha de envío
      if (!a.submittedAt) return 1;
      if (!b.submittedAt) return -1;
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    });
}

/**
 * Obtiene la submission de un estudiante específico
 */
export function getStudentSubmission(
  contentId: string,
  studentId: string
): StudentSubmission | null {
  const submissionId = `${contentId}-${studentId}`;
  return submissions.get(submissionId) || null;
}

/**
 * Obtiene todas las submissions de un estudiante
 */
export function getStudentSubmissions(studentId: string): StudentSubmission[] {
  return Array.from(submissions.values())
    .filter(s => s.studentId === studentId)
    .sort((a, b) => {
      const aDate = a.submittedAt || a.lastActivity || a.startedAt || '';
      const bDate = b.submittedAt || b.lastActivity || b.startedAt || '';
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
}

/**
 * Genera estadísticas del contenido
 */
export function updateContentStats(contentId: string): void {
  const content = contents.get(contentId);
  if (!content) return;
  
  const contentSubmissions = getContentSubmissions(contentId);
  
  const completed = contentSubmissions.filter(s => s.status === 'graded' || s.status === 'returned').length;
  const inProgress = contentSubmissions.filter(s => s.status === 'in_progress' || s.status === 'submitted').length;
  const notStarted = contentSubmissions.filter(s => s.status === 'not_started').length;
  
  const gradedSubmissions = contentSubmissions.filter(s => s.score !== undefined);
  const avgScore = gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length
    : 0;
  
  const submissionsWithTime = contentSubmissions.filter(s => s.timeSpent !== undefined);
  const avgTimeSpent = submissionsWithTime.length > 0
    ? submissionsWithTime.reduce((sum, s) => sum + (s.timeSpent || 0), 0) / submissionsWithTime.length
    : 0;
  
  content.stats = {
    totalAssigned: contentSubmissions.length,
    completed,
    inProgress,
    notStarted,
    avgScore: Math.round(avgScore * 10) / 10,
    avgTimeSpent: Math.round(avgTimeSpent)
  };
  
  contents.set(contentId, content);
}

/**
 * Duplica un contenido
 */
export function duplicateContent(
  contentId: string,
  newTitle?: string
): TeacherContent | null {
  const original = contents.get(contentId);
  if (!original) return null;
  
  const duplicate: TeacherContent = {
    ...original,
    id: generateId(),
    title: newTitle || `${original.title} (copia)`,
    status: 'draft',
    assignedGroups: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: undefined,
    stats: undefined
  };
  
  contents.set(duplicate.id, duplicate);
  return duplicate;
}

/**
 * Crea una plantilla desde un contenido
 */
export function createTemplateFromContent(
  contentId: string,
  name: string,
  description: string,
  isPublic: boolean = false
): ContentTemplate | null {
  const content = contents.get(contentId);
  if (!content) return null;
  
  const template: ContentTemplate = {
    id: generateId(),
    name,
    description,
    type: content.type,
    subject: content.subject,
    tags: content.tags,
    questions: content.questions,
    createdBy: content.teacherId,
    isPublic,
    usageCount: 0
  };
  
  templates.set(template.id, template);
  return template;
}

/**
 * Crea contenido desde una plantilla
 */
export function createContentFromTemplate(
  templateId: string,
  teacherId: string,
  teacherName: string,
  schoolId: string,
  customizations?: Partial<TeacherContent>
): TeacherContent | null {
  const template = templates.get(templateId);
  if (!template) return null;
  
  // Incrementar contador de uso
  template.usageCount++;
  templates.set(templateId, template);
  
  return createContent(teacherId, teacherName, schoolId, {
    type: template.type,
    subject: template.subject,
    tags: template.tags,
    questions: template.questions,
    ...customizations
  });
}

/**
 * Obtiene plantillas disponibles
 */
export function getTemplates(
  filters?: {
    type?: ContentType;
    subject?: string;
    createdBy?: string;
    search?: string;
  }
): ContentTemplate[] {
  let results = Array.from(templates.values());
  
  if (filters?.type) {
    results = results.filter(t => t.type === filters.type);
  }
  
  if (filters?.subject) {
    results = results.filter(t => t.subject === filters.subject);
  }
  
  if (filters?.createdBy) {
    results = results.filter(t => t.createdBy === filters.createdBy);
  }
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(t => 
      t.name.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  // Ordenar por uso (más usadas primero)
  return results.sort((a, b) => b.usageCount - a.usageCount);
}

/**
 * Exporta estadísticas para analytics
 */
export function exportContentAnalytics(teacherId: string): {
  totalContents: number;
  byType: Record<ContentType, number>;
  byStatus: Record<ContentStatus, number>;
  avgCompletionRate: number;
  avgScore: number;
  totalSubmissions: number;
} {
  const teacherContents = getTeacherContents(teacherId);
  
  const byType = teacherContents.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1;
    return acc;
  }, {} as Record<ContentType, number>);
  
  const byStatus = teacherContents.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<ContentStatus, number>);
  
  const contentsWithStats = teacherContents.filter(c => c.stats);
  const totalAssigned = contentsWithStats.reduce((sum, c) => sum + (c.stats?.totalAssigned || 0), 0);
  const totalCompleted = contentsWithStats.reduce((sum, c) => sum + (c.stats?.completed || 0), 0);
  const avgCompletionRate = totalAssigned > 0 ? (totalCompleted / totalAssigned) * 100 : 0;
  
  const avgScore = contentsWithStats.length > 0
    ? contentsWithStats.reduce((sum, c) => sum + (c.stats?.avgScore || 0), 0) / contentsWithStats.length
    : 0;
  
  const totalSubmissions = Array.from(submissions.values())
    .filter(s => {
      const content = contents.get(s.contentId);
      return content?.teacherId === teacherId;
    }).length;
  
  return {
    totalContents: teacherContents.length,
    byType,
    byStatus,
    avgCompletionRate: Math.round(avgCompletionRate),
    avgScore: Math.round(avgScore * 10) / 10,
    totalSubmissions
  };
}

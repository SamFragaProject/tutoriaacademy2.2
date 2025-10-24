import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Clock, AlertCircle, Filter, Search, Download,
  ChevronLeft, ChevronRight, Star, MessageSquare, Paperclip,
  Copy, ThumbsUp, Send, Sparkles, BarChart3, TrendingUp,
  Eye, FileText, Calendar, Users, Award, Zap
} from 'lucide-react';
import { useGradeConfig } from '../../hooks/useGradeConfig';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Types
interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  assignmentTitle: string;
  submittedAt: Date;
  dueDate: Date;
  status: 'pending' | 'graded' | 'late';
  attachments: string[];
  content?: string;
  grade?: number;
  feedback?: string;
  rubricScores?: Record<string, number>;
}

interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: {
    points: number;
    description: string;
  }[];
}

interface QuickComment {
  id: string;
  text: string;
  category: 'positive' | 'improvement' | 'neutral';
  icon: string;
}

const QUICK_COMMENTS: QuickComment[] = [
  { id: '1', text: '¡Excelente trabajo! Demuestras comprensión profunda del tema.', category: 'positive', icon: '⭐' },
  { id: '2', text: 'Muy buen esfuerzo. Se nota tu dedicación.', category: 'positive', icon: '👏' },
  { id: '3', text: 'Respuesta creativa e innovadora.', category: 'positive', icon: '💡' },
  { id: '4', text: 'Podrías profundizar más en este punto.', category: 'improvement', icon: '📝' },
  { id: '5', text: 'Revisa la ortografía y gramática.', category: 'improvement', icon: '✏️' },
  { id: '6', text: 'Considera agregar ejemplos para apoyar tu respuesta.', category: 'improvement', icon: '📚' },
  { id: '7', text: 'Trabajo completo y bien estructurado.', category: 'neutral', icon: '✅' },
  { id: '8', text: 'Cumple con los requisitos solicitados.', category: 'neutral', icon: '👍' },
];

const SAMPLE_RUBRIC: RubricCriterion[] = [
  {
    id: '1',
    name: 'Comprensión del tema',
    description: 'Demuestra entendimiento de conceptos clave',
    maxPoints: 30,
    levels: [
      { points: 30, description: 'Excelente comprensión, ejemplos claros' },
      { points: 20, description: 'Buena comprensión con algunos errores' },
      { points: 10, description: 'Comprensión básica, falta profundidad' },
      { points: 0, description: 'No demuestra comprensión' },
    ],
  },
  {
    id: '2',
    name: 'Organización y estructura',
    description: 'Claridad en la presentación de ideas',
    maxPoints: 25,
    levels: [
      { points: 25, description: 'Muy bien organizado y estructurado' },
      { points: 15, description: 'Organización aceptable' },
      { points: 5, description: 'Poco organizado, difícil de seguir' },
      { points: 0, description: 'Sin estructura clara' },
    ],
  },
  {
    id: '3',
    name: 'Originalidad',
    description: 'Pensamiento crítico y aportaciones propias',
    maxPoints: 20,
    levels: [
      { points: 20, description: 'Ideas originales y creativas' },
      { points: 12, description: 'Algunas ideas propias' },
      { points: 5, description: 'Mayormente información básica' },
      { points: 0, description: 'Sin originalidad' },
    ],
  },
  {
    id: '4',
    name: 'Ortografía y gramática',
    description: 'Corrección en el uso del lenguaje',
    maxPoints: 15,
    levels: [
      { points: 15, description: 'Sin errores o muy pocos' },
      { points: 10, description: 'Algunos errores menores' },
      { points: 5, description: 'Múltiples errores' },
      { points: 0, description: 'Muchos errores que dificultan lectura' },
    ],
  },
  {
    id: '5',
    name: 'Referencias y fuentes',
    description: 'Uso apropiado de fuentes y citas',
    maxPoints: 10,
    levels: [
      { points: 10, description: 'Referencias completas y bien citadas' },
      { points: 6, description: 'Referencias básicas' },
      { points: 2, description: 'Pocas o incorrectas referencias' },
      { points: 0, description: 'Sin referencias' },
    ],
  },
];

// Mock data
const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: '1',
    studentId: 's1',
    studentName: 'Ana García',
    studentAvatar: '👧',
    assignmentTitle: 'Ensayo sobre Fotosíntesis',
    submittedAt: new Date('2025-10-05T14:30:00'),
    dueDate: new Date('2025-10-05T23:59:00'),
    status: 'pending',
    attachments: ['ensayo_fotosintesis.pdf'],
    content: 'La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar en energía química...',
  },
  {
    id: '2',
    studentId: 's2',
    studentName: 'Carlos Mendoza',
    studentAvatar: '👦',
    assignmentTitle: 'Ensayo sobre Fotosíntesis',
    submittedAt: new Date('2025-10-04T20:15:00'),
    dueDate: new Date('2025-10-05T23:59:00'),
    status: 'pending',
    attachments: ['fotosintesis_carlos.docx', 'diagrama.jpg'],
    content: 'En este ensayo explicaré el proceso de fotosíntesis y su importancia para los ecosistemas...',
  },
  {
    id: '3',
    studentId: 's3',
    studentName: 'María Rodríguez',
    studentAvatar: '👩',
    assignmentTitle: 'Ensayo sobre Fotosíntesis',
    submittedAt: new Date('2025-10-03T18:45:00'),
    dueDate: new Date('2025-10-05T23:59:00'),
    status: 'graded',
    attachments: ['maria_ensayo.pdf'],
    grade: 95,
    feedback: 'Excelente trabajo, María. Tu análisis es profundo y las referencias son apropiadas.',
    rubricScores: { '1': 30, '2': 25, '3': 18, '4': 15, '5': 7 },
  },
  {
    id: '4',
    studentId: 's4',
    studentName: 'Juan López',
    studentAvatar: '👨',
    assignmentTitle: 'Ensayo sobre Fotosíntesis',
    submittedAt: new Date('2025-10-06T08:30:00'),
    dueDate: new Date('2025-10-05T23:59:00'),
    status: 'late',
    attachments: ['ensayo_juan.pdf'],
    content: 'La fotosíntesis es importante porque las plantas producen oxígeno...',
  },
];

export const GradingInterface: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const taskId = searchParams.get('taskId');
  const studentId = searchParams.get('studentId');

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'graded' | 'late'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRubric, setShowRubric] = useState(true);
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [gradingMode, setGradingMode] = useState<'rubric' | 'numeric' | 'quick'>('numeric');
  const [numericGrade, setNumericGrade] = useState<number | null>(null);
  const [aiSuggestionLoading, setAiSuggestionLoading] = useState(false);

  const gradeConfig = useGradeConfig();

  // Load submissions from localStorage
  const loadSubmissions = (taskIdParam: string): Submission[] => {
    try {
      const stored = localStorage.getItem(`submissions_${taskIdParam}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((s: any) => ({
          ...s,
          submittedAt: new Date(s.submittedAt),
          dueDate: new Date() // TODO: Load from task
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading submissions:', error);
      return [];
    }
  };

  // Save submissions to localStorage
  const saveSubmissions = (taskIdParam: string, subs: Submission[]) => {
    try {
      localStorage.setItem(`submissions_${taskIdParam}`, JSON.stringify(subs));
    } catch (error) {
      console.error('Error saving submissions:', error);
    }
  };

  // Load initial submissions
  useEffect(() => {
    if (taskId) {
      const loadedSubmissions = loadSubmissions(taskId);
      setSubmissions(loadedSubmissions);
      
      // Select specific student if provided
      if (studentId && loadedSubmissions.length > 0) {
        const targetSubmission = loadedSubmissions.find(s => s.studentId === studentId);
        if (targetSubmission) {
          const index = loadedSubmissions.indexOf(targetSubmission);
          setSelectedSubmission(targetSubmission);
          setCurrentIndex(index);
          setRubricScores(targetSubmission.rubricScores || {});
          setFeedback(targetSubmission.feedback || '');
          setNumericGrade(targetSubmission.grade || null);
        } else {
          setSelectedSubmission(loadedSubmissions[0]);
        }
      } else if (loadedSubmissions.length > 0) {
        setSelectedSubmission(loadedSubmissions[0]);
      }
    } else {
      // Fallback to mock data if no taskId
      setSubmissions(MOCK_SUBMISSIONS);
      setSelectedSubmission(MOCK_SUBMISSIONS[0]);
    }
  }, [taskId, studentId]);

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
      const matchesSearch = sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sub.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [submissions, filterStatus, searchTerm]);

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const gradedCount = submissions.filter(s => s.status === 'graded').length;
  const lateCount = submissions.filter(s => s.status === 'late').length;

  // Calculate total from rubric
  const totalRubricScore = useMemo(() => {
    return Object.values(rubricScores).reduce((sum: number, score) => sum + (score as number), 0);
  }, [rubricScores]);

  const maxRubricScore = SAMPLE_RUBRIC.reduce((sum, criterion) => sum + criterion.maxPoints, 0);

  const handleSelectSubmission = (submission: Submission, index: number) => {
    setSelectedSubmission(submission);
    setCurrentIndex(index);
    setRubricScores(submission.rubricScores || {});
    setFeedback(submission.feedback || '');
    setNumericGrade(submission.grade || null);
  };

  const handleNextSubmission = () => {
    if (currentIndex < filteredSubmissions.length - 1) {
      const nextIndex = currentIndex + 1;
      handleSelectSubmission(filteredSubmissions[nextIndex], nextIndex);
    }
  };

  const handlePreviousSubmission = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      handleSelectSubmission(filteredSubmissions[prevIndex], prevIndex);
    }
  };

  const handleRubricScoreChange = (criterionId: string, points: number) => {
    setRubricScores(prev => ({ ...prev, [criterionId]: points }));
  };

  const handleQuickComment = (comment: string) => {
    setFeedback(prev => prev ? `${prev}\n\n${comment}` : comment);
  };

  const handleAISuggestion = async () => {
    setAiSuggestionLoading(true);
    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const suggestions = [
      `Excelente trabajo, ${selectedSubmission?.studentName}. Tu ensayo demuestra una comprensión sólida del tema.

**Fortalezas:**
- Estructura clara y lógica
- Buenos ejemplos que ilustran los conceptos
- Referencias apropiadas

**Áreas de mejora:**
- Podrías profundizar en la fase oscura de la fotosíntesis
- Considera agregar un diagrama para visualizar el proceso

**Sugerencia:** Para el próximo trabajo, intenta relacionar este tema con aplicaciones reales en agricultura o cambio climático.

Calificación sugerida: 88/100`,
      
      `Buen esfuerzo, ${selectedSubmission?.studentName}. Se nota que investigaste el tema.

**Aspectos positivos:**
- Cumples con los requisitos básicos
- Presentación ordenada

**Por mejorar:**
- Falta mayor profundidad en algunos conceptos
- Revisa la ortografía (encontré algunos errores)
- Las referencias son limitadas

**Recomendación:** Te sugiero revisar fuentes adicionales para ampliar tu comprensión. ¡Sigue así!

Calificación sugerida: 75/100`,
    ];

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setFeedback(randomSuggestion);
    setAiSuggestionLoading(false);
  };

  const handleSubmitGrade = () => {
    if (!selectedSubmission) return;

    const finalGrade = gradingMode === 'rubric' 
      ? Math.round((totalRubricScore / maxRubricScore) * 100)
      : numericGrade;

    const updatedSubmissions = submissions.map(sub =>
      sub.id === selectedSubmission.id
        ? {
            ...sub,
            status: 'graded' as const,
            grade: finalGrade || 0,
            feedback,
            rubricScores: gradingMode === 'rubric' ? rubricScores : undefined,
          }
        : sub
    );

    setSubmissions(updatedSubmissions);
    
    // Save to localStorage
    if (taskId) {
      // Convert back to the TaskSubmission format for localStorage
      const taskSubmissions = updatedSubmissions.map(sub => ({
        id: sub.id,
        taskId: taskId,
        studentId: sub.studentId,
        studentName: sub.studentName,
        submittedAt: sub.submittedAt,
        status: sub.status === 'late' ? 'late' as const : 'on_time' as const,
        score: sub.grade,
        feedback: sub.feedback,
        attachments: sub.attachments
      }));
      
      saveSubmissions(taskId, updatedSubmissions);
      
      // Show success message
      alert(`✅ Calificación guardada!\n\n👤 ${selectedSubmission.studentName}\n⭐ ${finalGrade} puntos\n📝 Retroalimentación agregada`);
    }
    
    // Move to next pending submission
    const nextPending = filteredSubmissions.find((sub, idx) => 
      idx > currentIndex && sub.status === 'pending'
    );
    
    if (nextPending) {
      const nextIndex = filteredSubmissions.findIndex(sub => sub.id === nextPending.id);
      handleSelectSubmission(nextPending, nextIndex);
    } else {
      handleNextSubmission();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Sistema de Calificaciones
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Califica tareas y exámenes de forma eficiente
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg
                         shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              icon={<Clock className="w-5 h-5" />}
              label="Pendientes"
              value={pendingCount}
              color="from-yellow-500 to-orange-500"
            />
            <StatsCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              label="Calificadas"
              value={gradedCount}
              color="from-green-500 to-emerald-500"
            />
            <StatsCard
              icon={<AlertCircle className="w-5 h-5" />}
              label="Tardías"
              value={lateCount}
              color="from-red-500 to-rose-500"
            />
            <StatsCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Promedio"
              value="87%"
              color="from-blue-500 to-indigo-500"
            />
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Submissions List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-12 lg:col-span-4 xl:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900/30 overflow-hidden">
              {/* Search and Filters */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar estudiante..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border-0 
                             focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>

                <div className="flex gap-2">
                  {['all', 'pending', 'graded', 'late'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status as any)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filterStatus === status
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? 'Todas' : status === 'pending' ? 'Pendientes' : 
                       status === 'graded' ? 'Calificadas' : 'Tardías'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submissions List */}
              <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                {filteredSubmissions.map((submission, index) => (
                  <motion.div
                    key={submission.id}
                    whileHover={{ x: 4 }}
                    onClick={() => handleSelectSubmission(submission, index)}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all ${
                      selectedSubmission?.id === submission.id
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{submission.studentAvatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                            {submission.studentName}
                          </h4>
                          <StatusBadge status={submission.status} />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                          {submission.assignmentTitle}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {submission.submittedAt.toLocaleDateString()}
                        </div>
                        {submission.grade !== undefined && (
                          <div className="mt-2">
                            <GradeBadge grade={submission.grade} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Center Panel - Submission Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-12 lg:col-span-8 xl:col-span-6"
          >
            {selectedSubmission ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900/30 overflow-hidden">
                {/* Navigation */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{selectedSubmission.studentAvatar}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedSubmission.studentName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedSubmission.assignmentTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePreviousSubmission}
                      disabled={currentIndex === 0}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentIndex + 1} / {filteredSubmissions.length}
                    </span>
                    <button
                      onClick={handleNextSubmission}
                      disabled={currentIndex === filteredSubmissions.length - 1}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[calc(100vh-500px)] overflow-y-auto">
                  {/* Submission Info */}
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Entregado: {selectedSubmission.submittedAt.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Límite: {selectedSubmission.dueDate.toLocaleString()}
                      </span>
                    </div>
                    <StatusBadge status={selectedSubmission.status} />
                  </div>

                  {/* Attachments */}
                  {selectedSubmission.attachments.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        Archivos adjuntos
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubmission.attachments.map((file, idx) => (
                          <motion.a
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            href="#"
                            className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30
                                     rounded-lg flex items-center gap-2 hover:shadow-md transition-all"
                          >
                            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium text-purple-900 dark:text-purple-200">{file}</span>
                            <Eye className="w-4 h-4 text-gray-500" />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  {selectedSubmission.content && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contenido</h4>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {selectedSubmission.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900/30 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Selecciona una entrega para calificar</p>
              </div>
            )}
          </motion.div>

          {/* Right Panel - Grading Tools */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-12 xl:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900/30 overflow-hidden">
              {/* Mode Selector */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Modo de calificación</h3>
                <div className="flex gap-2">
                  {[
                    { mode: 'rubric', label: 'Rúbrica', icon: BarChart3 },
                    { mode: 'numeric', label: 'Numérica', icon: Star },
                  ].map(({ mode, label, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setGradingMode(mode as any)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        gradingMode === mode
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 max-h-[calc(100vh-500px)] overflow-y-auto">
                {gradingMode === 'rubric' ? (
                  <>
                    {/* Rubric */}
                    <div className="space-y-4 mb-6">
                      {SAMPLE_RUBRIC.map((criterion) => (
                        <div key={criterion.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                {criterion.name}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {criterion.description}
                              </p>
                            </div>
                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                              {rubricScores[criterion.id] || 0}/{criterion.maxPoints}
                            </span>
                          </div>

                          <div className="space-y-2 mt-3">
                            {criterion.levels.map((level, idx) => (
                              <motion.button
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRubricScoreChange(criterion.id, level.points)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                                  rubricScores[criterion.id] === level.points
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold">{level.points} pts</span>
                                  {rubricScores[criterion.id] === level.points && <CheckCircle2 className="w-4 h-4" />}
                                </div>
                                <p className="opacity-90">{level.description}</p>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Score */}
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-4 text-white mb-6">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Calificación Total</span>
                        <div className="text-right">
                          <div className="text-3xl font-bold">{totalRubricScore}/{maxRubricScore}</div>
                          <div className="text-sm opacity-90">
                            {Math.round((totalRubricScore / maxRubricScore) * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Numeric Grading */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Calificación numérica
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={numericGrade || ''}
                        onChange={(e) => setNumericGrade(Number(e.target.value))}
                        placeholder="0-100"
                        className="w-full px-4 py-3 text-2xl font-bold text-center bg-gray-50 dark:bg-gray-900 
                                 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                      {numericGrade !== null && (
                        <div className="mt-3">
                          <GradeBadge grade={numericGrade} size="large" />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Feedback */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Retroalimentación
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAISuggestion}
                      disabled={aiSuggestionLoading}
                      className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg
                               text-xs font-medium flex items-center gap-1 hover:shadow-md transition-all
                               disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      {aiSuggestionLoading ? 'Generando...' : 'IA'}
                    </motion.button>
                  </div>

                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Escribe tu retroalimentación aquí..."
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border-0 
                             focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  />

                  {/* Quick Comments */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Comentarios rápidos:</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_COMMENTS.slice(0, 4).map((comment) => (
                        <button
                          key={comment.id}
                          onClick={() => handleQuickComment(comment.text)}
                          className="px-2 py-1 bg-white dark:bg-gray-700 rounded-lg text-xs 
                                   hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all
                                   border border-gray-200 dark:border-gray-600"
                          title={comment.text}
                        >
                          {comment.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitGrade}
                  disabled={
                    (gradingMode === 'rubric' && totalRubricScore === 0) ||
                    (gradingMode === 'numeric' && numericGrade === null)
                  }
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl
                           font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  Guardar y Continuar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatsCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-center gap-3">
      <div className={`p-3 bg-gradient-to-r ${color} rounded-lg text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    </div>
  </motion.div>
);

const StatusBadge: React.FC<{ status: Submission['status'] }> = ({ status }) => {
  const config = {
    pending: { label: 'Pendiente', color: 'from-yellow-500 to-orange-500', icon: Clock },
    graded: { label: 'Calificada', color: 'from-green-500 to-emerald-500', icon: CheckCircle2 },
    late: { label: 'Tardía', color: 'from-red-500 to-rose-500', icon: AlertCircle },
  };

  const { label, color, icon: Icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${color} text-white`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const GradeBadge: React.FC<{ grade: number; size?: 'normal' | 'large' }> = ({ grade, size = 'normal' }) => {
  const getGradeColor = () => {
    if (grade >= 90) return 'from-green-500 to-emerald-500';
    if (grade >= 80) return 'from-blue-500 to-indigo-500';
    if (grade >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getGradeEmoji = () => {
    if (grade >= 90) return '⭐';
    if (grade >= 80) return '😊';
    if (grade >= 70) return '😐';
    return '😕';
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${getGradeColor()} text-white ${
      size === 'large' ? 'text-lg' : 'text-sm'
    } font-bold`}>
      <span>{getGradeEmoji()}</span>
      <span>{grade}/100</span>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit2, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  Upload,
  BookOpen,
  Brain,
  Target,
  Clock,
  Users,
  Settings,
  Save,
  Send,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Card } from '../ui';
import { useAuth } from '../../hooks/useAuth';

// ============================
// INTERFACES Y TIPOS
// ============================

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_blank';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  explanation?: string;
  imageUrl?: string;
}

interface ExamConfig {
  title: string;
  subject: string;
  topic: string;
  grade: string;
  duration: number; // minutes
  totalPoints: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionTypes: string[];
  questionCount: number;
  assignTo: 'all' | 'group' | 'individual';
  selectedStudents: string[];
  dueDate: string;
  instructions: string;
}

interface AIGenerationParams {
  subject: string;
  topic: string;
  grade: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionCount: number;
  questionTypes: string[];
  language: 'es' | 'en';
  includeExplanations: boolean;
}

// ============================
// MOCK DATA
// ============================

const MOCK_SUBJECTS = [
  'Matemáticas', 'Física', 'Química', 'Biología', 'Historia',
  'Geografía', 'Lengua y Literatura', 'Inglés', 'Filosofía', 'Arte'
];

const MOCK_TOPICS_BY_SUBJECT: Record<string, string[]> = {
  'Matemáticas': ['Álgebra', 'Geometría', 'Cálculo', 'Estadística', 'Trigonometría'],
  'Física': ['Mecánica', 'Termodinámica', 'Electromagnetismo', 'Óptica', 'Física Moderna'],
  'Química': ['Estructura Atómica', 'Enlaces Químicos', 'Reacciones', 'Ácidos y Bases', 'Orgánica'],
  'Biología': ['Célula', 'Genética', 'Evolución', 'Ecología', 'Anatomía Humana'],
  'Historia': ['Antigua', 'Medieval', 'Moderna', 'Contemporánea', 'Regional'],
};

const MOCK_GENERATED_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'multiple_choice',
    question: '¿Cuál es el resultado de resolver la ecuación 2x + 5 = 13?',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    correctAnswer: 'x = 4',
    points: 2,
    difficulty: 'easy',
    topic: 'Álgebra',
    explanation: 'Restamos 5 de ambos lados: 2x = 8, luego dividimos entre 2: x = 4'
  },
  {
    id: 'q2',
    type: 'multiple_choice',
    question: 'Si f(x) = x² + 3x - 2, ¿cuál es el valor de f(2)?',
    options: ['6', '8', '10', '12'],
    correctAnswer: '8',
    points: 3,
    difficulty: 'medium',
    topic: 'Álgebra',
    explanation: 'f(2) = (2)² + 3(2) - 2 = 4 + 6 - 2 = 8'
  },
  {
    id: 'q3',
    type: 'true_false',
    question: 'El teorema de Pitágoras solo se aplica a triángulos rectángulos.',
    correctAnswer: 'Verdadero',
    points: 1,
    difficulty: 'easy',
    topic: 'Geometría',
    explanation: 'El teorema de Pitágoras (a² + b² = c²) es exclusivo de triángulos rectángulos.'
  },
  {
    id: 'q4',
    type: 'short_answer',
    question: '¿Cuál es la derivada de f(x) = 3x² + 2x - 5?',
    correctAnswer: '6x + 2',
    points: 4,
    difficulty: 'hard',
    topic: 'Cálculo',
    explanation: 'Usando la regla de potencias: f\'(x) = 6x + 2'
  }
];

const MOCK_STUDENTS = [
  { id: 's1', name: 'Ana García', group: '3° A' },
  { id: 's2', name: 'Carlos Rodríguez', group: '3° A' },
  { id: 's3', name: 'María López', group: '3° B' },
  { id: 's4', name: 'Juan Martínez', group: '3° B' },
  { id: 's5', name: 'Pedro Sánchez', group: '3° C' },
];

const QUESTION_TYPE_OPTIONS = [
  { value: 'multiple_choice', label: 'Opción Múltiple', icon: Target },
  { value: 'true_false', label: 'Verdadero/Falso', icon: CheckCircle },
  { value: 'short_answer', label: 'Respuesta Corta', icon: Edit2 },
  { value: 'essay', label: 'Desarrollo', icon: BookOpen },
  { value: 'fill_blank', label: 'Completar', icon: Brain },
];

// ============================
// COMPONENTE PRINCIPAL
// ============================

export const AIExamCreator: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<'config' | 'generate' | 'edit' | 'preview' | 'assign'>('config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  
  const [examConfig, setExamConfig] = useState<ExamConfig>({
    title: '',
    subject: '',
    topic: '',
    grade: '',
    duration: 60,
    totalPoints: 0,
    difficulty: 'medium',
    questionTypes: ['multiple_choice'],
    questionCount: 10,
    assignTo: 'all',
    selectedStudents: [],
    dueDate: '',
    instructions: ''
  });

  // ============================
  // HANDLERS
  // ============================

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    
    // Simular llamada a API de IA
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // En producción: const questions = await generateQuestionsWithAI(params);
    setGeneratedQuestions(MOCK_GENERATED_QUESTIONS);
    setSelectedQuestions(MOCK_GENERATED_QUESTIONS.map(q => q.id));
    setIsGenerating(false);
    setStep('edit');
  };

  const handleRegenerateQuestion = async (questionId: string) => {
    // Simular regeneración individual
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newQuestion: Question = {
      ...MOCK_GENERATED_QUESTIONS[0],
      id: `q${Date.now()}`,
      question: '¿Cuál es el valor de x en 5x - 3 = 12?'
    };
    
    setGeneratedQuestions(prev => 
      prev.map(q => q.id === questionId ? newQuestion : q)
    );
  };

  const handleToggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleDeleteQuestion = (questionId: string) => {
    setGeneratedQuestions(prev => prev.filter(q => q.id !== questionId));
    setSelectedQuestions(prev => prev.filter(id => id !== questionId));
  };

  const handleDuplicateQuestion = (questionId: string) => {
    const question = generatedQuestions.find(q => q.id === questionId);
    if (question) {
      const newQuestion = { ...question, id: `q${Date.now()}` };
      setGeneratedQuestions(prev => [...prev, newQuestion]);
    }
  };

  const calculateTotalPoints = () => {
    return generatedQuestions
      .filter(q => selectedQuestions.includes(q.id))
      .reduce((sum, q) => sum + q.points, 0);
  };

  const handleSaveExam = () => {
    const finalExam = {
      ...examConfig,
      questions: generatedQuestions.filter(q => selectedQuestions.includes(q.id)),
      totalPoints: calculateTotalPoints(),
      createdAt: new Date(),
      createdBy: user?.id
    };
    
    console.log('Guardando examen:', finalExam);
    // En producción: await saveExam(finalExam);
    
    alert('¡Examen guardado exitosamente!');
  };

  const handleAssignExam = () => {
    const assignment = {
      examId: `exam_${Date.now()}`,
      ...examConfig,
      questions: generatedQuestions.filter(q => selectedQuestions.includes(q.id)),
      totalPoints: calculateTotalPoints(),
      assignedAt: new Date(),
      assignedBy: user?.id
    };
    
    console.log('Asignando examen:', assignment);
    // En producción: await assignExam(assignment);
    
    alert('¡Examen asignado exitosamente a los estudiantes seleccionados!');
  };

  // ============================
  // RENDER STEPS
  // ============================

  const renderConfigStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Crear Examen con IA
          </h2>
          <p className="text-white/60 mt-1">
            Configura los parámetros y deja que la IA genere las preguntas
          </p>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-purple-500" />
        </motion.div>
      </div>

      {/* Config Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Información Básica
          </h3>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">Título del Examen</label>
            <input
              type="text"
              value={examConfig.title}
              onChange={e => setExamConfig(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ej: Examen de Álgebra - Unidad 3"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Materia</label>
            <select
              value={examConfig.subject}
              onChange={e => setExamConfig(prev => ({ ...prev, subject: e.target.value, topic: '' }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">Selecciona una materia</option>
              {MOCK_SUBJECTS.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {examConfig.subject && (
            <div>
              <label className="block text-sm text-white/60 mb-2">Tema</label>
              <select
                value={examConfig.topic}
                onChange={e => setExamConfig(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Selecciona un tema</option>
                {(MOCK_TOPICS_BY_SUBJECT[examConfig.subject] || []).map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm text-white/60 mb-2">Grado/Nivel</label>
            <input
              type="text"
              value={examConfig.grade}
              onChange={e => setExamConfig(prev => ({ ...prev, grade: e.target.value }))}
              placeholder="Ej: 3° Secundaria"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </Card>

        {/* AI Config */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Configuración de IA
          </h3>

          <div>
            <label className="block text-sm text-white/60 mb-2">Dificultad</label>
            <div className="grid grid-cols-4 gap-2">
              {['easy', 'medium', 'hard', 'mixed'].map(level => (
                <button
                  key={level}
                  onClick={() => setExamConfig(prev => ({ ...prev, difficulty: level as any }))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    examConfig.difficulty === level
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {level === 'easy' ? 'Fácil' : level === 'medium' ? 'Media' : level === 'hard' ? 'Difícil' : 'Mixta'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Número de Preguntas</label>
            <input
              type="number"
              value={examConfig.questionCount}
              onChange={e => setExamConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 0 }))}
              min="1"
              max="50"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Tipos de Preguntas</label>
            <div className="space-y-2">
              {QUESTION_TYPE_OPTIONS.map(type => {
                const Icon = type.icon;
                const isSelected = examConfig.questionTypes.includes(type.value);
                return (
                  <button
                    key={type.value}
                    onClick={() => {
                      setExamConfig(prev => ({
                        ...prev,
                        questionTypes: isSelected
                          ? prev.questionTypes.filter(t => t !== type.value)
                          : [...prev.questionTypes, type.value]
                      }));
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-white/40'}`} />
                    <span className={isSelected ? 'text-white' : 'text-white/60'}>{type.label}</span>
                    {isSelected && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Duración (minutos)
            </label>
            <input
              type="number"
              value={examConfig.duration}
              onChange={e => setExamConfig(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
              min="5"
              max="300"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateQuestions}
          disabled={!examConfig.subject || !examConfig.topic || examConfig.questionCount < 1}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          Generar Preguntas con IA
        </motion.button>
      </div>
    </motion.div>
  );

  const renderEditStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Editar y Seleccionar Preguntas
          </h2>
          <p className="text-white/60 mt-1">
            Revisa, edita y selecciona las preguntas generadas por la IA
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-white/60">Preguntas Seleccionadas</p>
            <p className="text-2xl font-bold text-white">
              {selectedQuestions.length} / {generatedQuestions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60">Puntos Totales</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {calculateTotalPoints()}
            </p>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {generatedQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              isSelected={selectedQuestions.includes(question.id)}
              onToggle={() => handleToggleQuestion(question.id)}
              onRegenerate={() => handleRegenerateQuestion(question.id)}
              onDelete={() => handleDeleteQuestion(question.id)}
              onDuplicate={() => handleDuplicateQuestion(question.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep('config')}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-colors"
        >
          Volver a Configuración
        </button>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep('preview')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold"
          >
            <Eye className="w-5 h-5" />
            Vista Previa
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep('assign')}
            disabled={selectedQuestions.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            Asignar Examen
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const renderPreviewStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Vista Previa del Examen</h2>
        <button
          onClick={() => setStep('edit')}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
        >
          Volver a Edición
        </button>
      </div>

      {/* Exam Preview */}
      <Card className="p-8">
        {/* Exam Header */}
        <div className="border-b border-white/10 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            {examConfig.title || 'Examen Sin Título'}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-white/60">
            <span>Materia: {examConfig.subject}</span>
            <span>•</span>
            <span>Tema: {examConfig.topic}</span>
            <span>•</span>
            <span>Duración: {examConfig.duration} min</span>
            <span>•</span>
            <span>Puntos Totales: {calculateTotalPoints()}</span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {generatedQuestions
            .filter(q => selectedQuestions.includes(q.id))
            .map((question, index) => (
              <div key={question.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-white font-medium">{question.question}</p>
                    <span className="text-xs text-white/40">({question.points} puntos)</span>
                  </div>
                </div>
                
                {question.type === 'multiple_choice' && question.options && (
                  <div className="ml-11 space-y-2">
                    {question.options.map((option, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                        <span className="text-white/80">{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'true_false' && (
                  <div className="ml-11 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                      <span className="text-white/80">Verdadero</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                      <span className="text-white/80">Falso</span>
                    </div>
                  </div>
                )}
                
                {(question.type === 'short_answer' || question.type === 'essay') && (
                  <div className="ml-11">
                    <div className="w-full h-20 border-2 border-dashed border-white/20 rounded-lg" />
                  </div>
                )}
              </div>
            ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep('edit')}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-colors"
        >
          Editar Preguntas
        </button>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveExam}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold"
          >
            <Save className="w-5 h-5" />
            Guardar como Borrador
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep('assign')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold"
          >
            <Send className="w-5 h-5" />
            Asignar a Estudiantes
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const renderAssignStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <h2 className="text-2xl font-bold text-white">Asignar Examen</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment Config */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Destinatarios
          </h3>

          <div>
            <label className="block text-sm text-white/60 mb-2">Asignar a</label>
            <div className="space-y-2">
              {['all', 'group', 'individual'].map(option => (
                <button
                  key={option}
                  onClick={() => setExamConfig(prev => ({ ...prev, assignTo: option as any }))}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    examConfig.assignTo === option
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className={examConfig.assignTo === option ? 'text-white' : 'text-white/60'}>
                    {option === 'all' ? 'Todos los estudiantes' : option === 'group' ? 'Grupos específicos' : 'Estudiantes individuales'}
                  </span>
                  {examConfig.assignTo === option && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {examConfig.assignTo !== 'all' && (
            <div>
              <label className="block text-sm text-white/60 mb-2">Seleccionar Estudiantes</label>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {MOCK_STUDENTS.map(student => {
                  const isSelected = examConfig.selectedStudents.includes(student.id);
                  return (
                    <button
                      key={student.id}
                      onClick={() => {
                        setExamConfig(prev => ({
                          ...prev,
                          selectedStudents: isSelected
                            ? prev.selectedStudents.filter(id => id !== student.id)
                            : [...prev.selectedStudents, student.id]
                        }));
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-white/20'}`} />
                      <div className="flex-1 text-left">
                        <p className="text-white text-sm">{student.name}</p>
                        <p className="text-white/40 text-xs">{student.group}</p>
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-white/60 mb-2">Fecha de Entrega</label>
            <input
              type="datetime-local"
              value={examConfig.dueDate}
              onChange={e => setExamConfig(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </Card>

        {/* Exam Summary */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Resumen del Examen
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/60">Título</span>
              <span className="text-white font-medium">{examConfig.title}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/60">Materia</span>
              <span className="text-white font-medium">{examConfig.subject}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/60">Tema</span>
              <span className="text-white font-medium">{examConfig.topic}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/60">Preguntas</span>
              <span className="text-white font-medium">{selectedQuestions.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/60">Puntos Totales</span>
              <span className="text-green-400 font-bold">{calculateTotalPoints()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/60">Duración</span>
              <span className="text-white font-medium">{examConfig.duration} min</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-white/60">Destinatarios</span>
              <span className="text-white font-medium">
                {examConfig.assignTo === 'all' ? 'Todos' : `${examConfig.selectedStudents.length} seleccionados`}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-sm text-white/60 mb-2">Instrucciones Adicionales</label>
            <textarea
              value={examConfig.instructions}
              onChange={e => setExamConfig(prev => ({ ...prev, instructions: e.target.value }))}
              rows={4}
              placeholder="Instrucciones especiales para los estudiantes..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep('preview')}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-colors"
        >
          Volver a Vista Previa
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAssignExam}
          disabled={examConfig.assignTo !== 'all' && examConfig.selectedStudents.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          Asignar Examen Ahora
        </motion.button>
      </div>
    </motion.div>
  );

  // ============================
  // RENDER PRINCIPAL
  // ============================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[
              { key: 'config', label: 'Configuración', icon: Settings },
              { key: 'edit', label: 'Edición', icon: Edit2 },
              { key: 'preview', label: 'Vista Previa', icon: Eye },
              { key: 'assign', label: 'Asignar', icon: Send }
            ].map((s, i, arr) => {
              const Icon = s.icon;
              const isActive = step === s.key;
              const isCompleted = arr.findIndex(x => x.key === step) > i;
              
              return (
                <React.Fragment key={s.key}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110'
                        : isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-white/10'
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xs mt-2 ${isActive ? 'text-white font-semibold' : 'text-white/60'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                      isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-white/10'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <Card className="p-8 text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-16 h-16 text-purple-500 mx-auto" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Generando Preguntas...</h3>
                <p className="text-white/60">La IA está creando preguntas personalizadas para tu examen</p>
                <div className="flex items-center justify-center gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="w-3 h-3 bg-purple-500 rounded-full"
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Content */}
        {step === 'config' && renderConfigStep()}
        {step === 'edit' && renderEditStep()}
        {step === 'preview' && renderPreviewStep()}
        {step === 'assign' && renderAssignStep()}
      </div>
    </div>
  );
};

// ============================
// SUB-COMPONENTES
// ============================

interface QuestionCardProps {
  question: Question;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
  onRegenerate: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  isSelected,
  onToggle,
  onRegenerate,
  onDelete,
  onDuplicate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const difficultyColors = {
    easy: 'from-green-500 to-emerald-500',
    medium: 'from-yellow-500 to-orange-500',
    hard: 'from-red-500 to-rose-500'
  };

  const typeLabels = {
    multiple_choice: 'Opción Múltiple',
    true_false: 'V/F',
    short_answer: 'Corta',
    essay: 'Desarrollo',
    fill_blank: 'Completar'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`border rounded-lg transition-all ${
        isSelected
          ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30'
          : 'bg-white/5 border-white/10'
      }`}
    >
      {/* Header */}
      <div className="p-4 flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-blue-500 border-blue-500'
              : 'border-white/30 hover:border-white/50'
          }`}
        >
          {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Question Header */}
          <div className="flex items-start gap-3 mb-2">
            <span className="flex-shrink-0 text-white/40 font-mono">#{index + 1}</span>
            <p className="flex-1 text-white font-medium">{question.question}</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 rounded text-xs font-semibold bg-gradient-to-r ${difficultyColors[question.difficulty]} text-white`}>
              {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Media' : 'Difícil'}
            </span>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-white/10 text-white">
              {typeLabels[question.type]}
            </span>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400">
              {question.points} pts
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
              {question.topic}
            </span>
          </div>

          {/* Options Preview (Collapsed) */}
          {!isExpanded && question.type === 'multiple_choice' && question.options && (
            <div className="text-sm text-white/60 line-clamp-2">
              {question.options.join(' • ')}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={isExpanded ? 'Colapsar' : 'Expandir'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </button>
          <button
            onClick={onRegenerate}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Regenerar"
          >
            <RefreshCw className="w-5 h-5 text-blue-400" />
          </button>
          <button
            onClick={onDuplicate}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Duplicar"
          >
            <Copy className="w-5 h-5 text-green-400" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Options */}
              {question.type === 'multiple_choice' && question.options && (
                <div className="space-y-2">
                  <p className="text-sm text-white/60 font-semibold">Opciones:</p>
                  {question.options.map((option, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 p-2 rounded ${
                        option === question.correctAnswer
                          ? 'bg-green-500/20 border border-green-500/30'
                          : 'bg-white/5'
                      }`}
                    >
                      <span className="text-white/60">{String.fromCharCode(65 + i)}.</span>
                      <span className="text-white">{option}</span>
                      {option === question.correctAnswer && (
                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* True/False */}
              {question.type === 'true_false' && (
                <div className="space-y-2">
                  <p className="text-sm text-white/60 font-semibold">Respuesta Correcta:</p>
                  <div className={`p-2 rounded ${
                    question.correctAnswer === 'Verdadero'
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                    <span className="text-white font-semibold">{question.correctAnswer}</span>
                  </div>
                </div>
              )}

              {/* Short Answer / Essay */}
              {(question.type === 'short_answer' || question.type === 'essay') && question.correctAnswer && (
                <div className="space-y-2">
                  <p className="text-sm text-white/60 font-semibold">Respuesta Esperada:</p>
                  <div className="p-3 bg-white/5 rounded border border-white/10">
                    <p className="text-white">{question.correctAnswer}</p>
                  </div>
                </div>
              )}

              {/* Explanation */}
              {question.explanation && (
                <div className="space-y-2">
                  <p className="text-sm text-white/60 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Explicación:
                  </p>
                  <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                    <p className="text-white/80">{question.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

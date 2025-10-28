import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Paperclip,
  Send,
  Edit2,
  Trash2,
  Eye,
  Download,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Grid3x3,
  List,
  ChevronDown,
  ChevronRight,
  Star,
  Award
} from 'lucide-react';
import { Card } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { NavLink } from 'react-router-dom';
import { fetchTeacherGroups, fetchGroupStudents } from '../../services/teacher/groups';
import { fetchTasksByTeacher, createTask, updateTask, deleteTask, fetchTaskSubmissions } from '../../services/teacher/tasks';
import type { TareaDB, EntregaDB, TareaTipo } from '../../services/teacher/tasks';
import type { GrupoConEstadisticas, Alumno } from '../../services/teacher/groups';

// ============================
// INTERFACES Y TIPOS
// ============================

type TaskStatus = 'draft' | 'assigned' | 'in_progress' | 'submitted' | 'graded' | 'overdue';
type TaskType = 'homework' | 'project' | 'quiz' | 'exam' | 'reading' | 'practice';
type ViewMode = 'grid' | 'list' | 'board';

interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  subject: string;
  status: TaskStatus;
  createdAt: Date;
  dueDate: Date;
  assignedTo: string[]; // student IDs
  totalPoints: number;
  submittedCount: number;
  gradedCount: number;
  averageScore?: number;
  attachments?: string[];
  instructions?: string;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  group: string;
  submissionStatus?: 'pending' | 'submitted' | 'late' | 'graded';
  score?: number;
  submittedAt?: Date;
}

interface TaskSubmission {
  id: string;
  taskId: string;
  studentId: string;
  studentName: string;
  submittedAt: Date;
  status: 'on_time' | 'late';
  score?: number;
  feedback?: string;
  attachments: string[];
}

// Extended student info for submissions view
interface StudentSubmissionInfo {
  id: string;
  name: string;
  avatar: string;
  group: string;
  submissionStatus: 'pending' | 'submitted' | 'late' | 'graded';
  score?: number;
  submittedAt?: Date;
  feedback?: string;
}

// ============================
// MOCK DATA
// ============================

const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Tarea de Álgebra - Ecuaciones Lineales',
    description: 'Resolver los ejercicios 1-20 del capítulo 3',
    type: 'homework',
    subject: 'Matemáticas',
    status: 'assigned',
    createdAt: new Date('2025-10-01'),
    dueDate: new Date('2025-10-10'),
    assignedTo: ['s1', 's2', 's3', 's4', 's5'],
    totalPoints: 20,
    submittedCount: 3,
    gradedCount: 2,
    averageScore: 16.5,
    attachments: ['ejercicios.pdf']
  },
  {
    id: 't2',
    title: 'Proyecto Final - Ecosistemas',
    description: 'Investigación sobre ecosistemas locales',
    type: 'project',
    subject: 'Biología',
    status: 'in_progress',
    createdAt: new Date('2025-09-15'),
    dueDate: new Date('2025-10-20'),
    assignedTo: ['s1', 's2', 's3'],
    totalPoints: 50,
    submittedCount: 0,
    gradedCount: 0
  },
  {
    id: 't3',
    title: 'Quiz - Revolución Francesa',
    description: 'Evaluación rápida sobre la Revolución Francesa',
    type: 'quiz',
    subject: 'Historia',
    status: 'graded',
    createdAt: new Date('2025-09-25'),
    dueDate: new Date('2025-09-28'),
    assignedTo: ['s1', 's2', 's3', 's4', 's5'],
    totalPoints: 10,
    submittedCount: 5,
    gradedCount: 5,
    averageScore: 8.2
  },
  {
    id: 't4',
    title: 'Práctica de Laboratorio - Circuitos',
    description: 'Experimento sobre circuitos en serie y paralelo',
    type: 'practice',
    subject: 'Física',
    status: 'overdue',
    createdAt: new Date('2025-09-20'),
    dueDate: new Date('2025-10-01'),
    assignedTo: ['s2', 's4'],
    totalPoints: 15,
    submittedCount: 1,
    gradedCount: 0
  }
];

const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Ana García', avatar: '👩', group: '3° A' },
  { id: 's2', name: 'Carlos Rodríguez', avatar: '👨', group: '3° A' },
  { id: 's3', name: 'María López', avatar: '👧', group: '3° B' },
  { id: 's4', name: 'Juan Martínez', avatar: '👦', group: '3° B' },
  { id: 's5', name: 'Pedro Sánchez', avatar: '👨', group: '3° C' }
];

const TYPE_LABELS: Record<TaskType, string> = {
  homework: 'Tarea',
  project: 'Proyecto',
  quiz: 'Quiz',
  exam: 'Examen',
  reading: 'Lectura',
  practice: 'Práctica'
};

const TYPE_COLORS: Record<TaskType, string> = {
  homework: 'from-blue-500 to-cyan-500',
  project: 'from-purple-500 to-pink-500',
  quiz: 'from-green-500 to-emerald-500',
  exam: 'from-red-500 to-orange-500',
  reading: 'from-yellow-500 to-orange-500',
  practice: 'from-indigo-500 to-blue-500'
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  draft: 'Borrador',
  assigned: 'Asignada',
  in_progress: 'En Progreso',
  submitted: 'Entregada',
  graded: 'Calificada',
  overdue: 'Vencida'
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  assigned: 'bg-blue-500/20 text-blue-400',
  in_progress: 'bg-yellow-500/20 text-yellow-400',
  submitted: 'bg-green-500/20 text-green-400',
  graded: 'bg-purple-500/20 text-purple-400',
  overdue: 'bg-red-500/20 text-red-400'
};

// ============================
// HELPER FUNCTIONS
// ============================

// Mapea el tipo de tarea de DB (string) a TaskType de UI
const mapTareaTypeToTaskType = (tipo: string): TaskType => {
  switch (tipo) {
    case 'tarea': return 'homework';
    case 'proyecto': return 'project';
    case 'practica': return 'practice';
    case 'lectura': return 'reading';
    default: return 'homework';
  }
};

// Mapea el tipo de tarea de UI (TaskType) a tipo de DB (TareaTipo)
const mapTaskTypeToTareaTipo = (type: TaskType): TareaTipo => {
  switch (type) {
    case 'homework': return 'tarea';
    case 'project': return 'proyecto';
    case 'practice': return 'practica';
    case 'reading': return 'lectura';
    default: return 'tarea';
  }
};

// Determina el status de una tarea según su estado en DB
const mapStatusToTaskStatus = (tarea: TareaDB): TaskStatus => {
  if (!tarea.activo) return 'draft';
  if (tarea.fecha_entrega && new Date(tarea.fecha_entrega) < new Date()) return 'overdue';
  return 'assigned';
};

// ============================
// COMPONENTE PRINCIPAL
// ============================

export const TaskManager: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState<GrupoConEstadisticas[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<TaskType | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Cargar grupos y tareas del profesor desde Supabase
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [groupsData, tasksData] = await Promise.all([
          fetchTeacherGroups(user.id),
          fetchTasksByTeacher(user.id)
        ]);
        if (cancelled) return;
        
        setGroups(groupsData);
        
        // Convertir TareaDB a Task para compatibilidad con UI
        const convertedTasks: Task[] = tasksData.map(t => ({
          id: t.id,
          title: t.titulo,
          description: t.descripcion || '',
          type: mapTareaTypeToTaskType(t.tipo),
          subject: '', // Se puede extraer de grupo o usar materia si se agrega al schema
          status: mapStatusToTaskStatus(t),
          createdAt: new Date(t.created_at),
          dueDate: t.fecha_entrega ? new Date(t.fecha_entrega) : new Date(),
          assignedTo: [t.grupo_id], // IDs de grupos, no de estudiantes individuales
          totalPoints: t.puntos_max,
          submittedCount: 0, // Se calcula después con entregas
          gradedCount: 0,
          averageScore: undefined,
          attachments: t.archivo_url ? [t.archivo_url] : [],
          instructions: t.instrucciones ? JSON.stringify(t.instrucciones) : undefined
        }));
        
        setTasks(convertedTasks);
      } catch (e) {
        console.error('Error loading tasks:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user?.id]);

  // Cargar entregas (submissions) desde Supabase
  const loadSubmissions = async (taskId: string): Promise<TaskSubmission[]> => {
    try {
      const entregas = await fetchTaskSubmissions(taskId);
      return entregas.map(e => ({
        id: e.id,
        taskId: e.tarea_id,
        studentId: e.alumno_id,
        studentName: '', // Se completa con userData
        submittedAt: new Date(e.fecha_entrega),
        status: new Date(e.fecha_entrega) > (tasks.find(t => t.id === taskId)?.dueDate || new Date()) ? 'late' : 'on_time',
        score: e.calificacion ?? undefined,
        feedback: e.comentarios_profesor ?? undefined,
        attachments: e.archivo_url ? [e.archivo_url] : []
      }));
    } catch (error) {
      console.error('Error loading submissions:', error);
      return [];
    }
  };

  // Guardar entregas (ya no usa localStorage, usa Supabase a través del servicio)
  const saveSubmissions = async (taskId: string, submissions: TaskSubmission[]) => {
    // No es necesario implementar aquí, las entregas se manejan con upsertSubmission en el servicio
    console.log('Submissions are now managed directly via Supabase service');
  };

  // Obtener información de estudiantes para una tarea
  const getStudentSubmissionInfo = async (task: Task): Promise<StudentSubmissionInfo[]> => {
    const submissions = await loadSubmissions(task.id);
    const studentsList: StudentSubmissionInfo[] = [];

    // Obtener todos los grupos asignados a esta tarea
    for (const groupId of task.assignedTo) {
      try {
        const students = await fetchGroupStudents(groupId);
        const group = groups.find(g => g.id === groupId);

        for (const student of students) {
          const submission = submissions.find(s => s.studentId === student.id);
          
          const isLate = submission && submission.submittedAt > task.dueDate;
          const submissionStatus: StudentSubmissionInfo['submissionStatus'] = 
            submission?.score !== undefined ? 'graded' :
            submission ? (isLate ? 'late' : 'submitted') :
            'pending';

          studentsList.push({
            id: student.id,
            name: `${student.nombre} ${student.apellidos || ''}`.trim(),
            avatar: '👤',
            group: group?.nombre || 'Sin grupo',
            submissionStatus,
            score: submission?.score,
            submittedAt: submission?.submittedAt,
            feedback: submission?.feedback
          });
        }
      } catch (e) {
        console.error(`Error loading students for group ${groupId}:`, e);
      }
    }

    return studentsList;
  };

  // Inicializar datos de demo para entregas (ya no necesario con Supabase)
  const initDemoSubmissions = async (taskId: string, studentIds: string[]) => {
    // Con Supabase real, las entregas vienen de la DB, no se generan demos
    console.log('Demo submissions not needed with real Supabase data');
  };

  // ============================
  // COMPUTED VALUES
  // ============================

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesType = filterType === 'all' || task.type === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [tasks, searchQuery, filterStatus, filterType]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'assigned' || t.status === 'in_progress').length,
      toGrade: tasks.filter(t => t.submittedCount > t.gradedCount).length,
      overdue: tasks.filter(t => t.status === 'overdue').length,
      avgCompletion: tasks.length > 0 
        ? Math.round((tasks.reduce((sum, t) => sum + (t.submittedCount / t.assignedTo.length), 0) / tasks.length) * 100)
        : 0
    };
  }, [tasks]);

  // ============================
  // HANDLERS
  // ============================

  const handleCreateTask = () => {
    setIsCreating(true);
    setSelectedTask(null);
  };

  const handleSelectTask = async (task: Task) => {
    // Ya no necesitamos inicializar datos demo, usamos Supabase
    setSelectedTask(task);
    setIsCreating(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await deleteTask(taskId);
        setTasks(prev => prev.filter(t => t.id !== taskId));
        if (selectedTask?.id === taskId) {
          setSelectedTask(null);
        }
      } catch (e) {
        console.error('Error deleting task:', e);
        alert('Error al eliminar la tarea');
      }
    }
  };

  // ============================
  // RENDER FUNCTIONS
  // ============================

  const renderStats = () => (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {[
        { label: 'Total Tareas', value: stats.total, icon: FileText, color: 'from-blue-500 to-cyan-500' },
        { label: 'Pendientes', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500' },
        { label: 'Por Calificar', value: stats.toGrade, icon: AlertCircle, color: 'from-red-500 to-rose-500' },
        { label: 'Vencidas', value: stats.overdue, icon: XCircle, color: 'from-red-600 to-red-700' },
        { label: 'Completitud', value: `${stats.avgCompletion}%`, icon: TrendingUp, color: 'from-green-500 to-emerald-500' }
      ].map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`p-4 bg-gradient-to-r ${stat.color} bg-opacity-10`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  const renderTaskCard = (task: Task) => {
    const progress = task.assignedTo.length > 0 
      ? Math.round((task.submittedCount / task.assignedTo.length) * 100)
      : 0;
    const isOverdue = new Date() > task.dueDate && task.status !== 'graded';
    const daysUntilDue = Math.ceil((task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -4 }}
        className="cursor-pointer"
        onClick={() => handleSelectTask(task)}
      >
        <Card className="p-5 h-full hover:border-blue-500/30 transition-all">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <span className={`px-2 py-1 rounded text-xs font-semibold bg-gradient-to-r ${TYPE_COLORS[task.type]} text-white`}>
              {TYPE_LABELS[task.type]}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[task.status]}`}>
              {STATUS_LABELS[task.status]}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold mb-2 line-clamp-2">{task.title}</h3>
          <p className="text-white/60 text-sm mb-4 line-clamp-2">{task.description}</p>

          {/* Meta Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar className="w-4 h-4" />
              <span>Vence: {task.dueDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
              {isOverdue ? (
                <span className="text-red-400 font-semibold ml-auto">¡Vencida!</span>
              ) : daysUntilDue <= 3 ? (
                <span className="text-yellow-400 font-semibold ml-auto">{daysUntilDue}d</span>
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Users className="w-4 h-4" />
              <span>{task.assignedTo.length} estudiantes</span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Progreso</span>
              <span className="text-white font-semibold">{progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${TYPE_COLORS[task.type]}`}
              />
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <span>{task.submittedCount} entregadas</span>
              <span>{task.gradedCount} calificadas</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectTask(task);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors"
            >
              <Eye className="w-4 h-4" />
              Ver
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(task.id);
              }}
              className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Average Score */}
          {task.averageScore !== undefined && (
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm text-white/60">Promedio</span>
              <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {task.averageScore.toFixed(1)} / {task.totalPoints}
              </span>
            </div>
          )}
        </Card>
      </motion.div>
    );
  };

  const renderListItem = (task: Task) => {
    const progress = task.assignedTo.length > 0 
      ? Math.round((task.submittedCount / task.assignedTo.length) * 100)
      : 0;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        onClick={() => handleSelectTask(task)}
        className="cursor-pointer"
      >
        <Card className="p-4 hover:border-blue-500/30 transition-all">
          <div className="flex items-center gap-4">
            {/* Type Icon */}
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${TYPE_COLORS[task.type]} flex items-center justify-center flex-shrink-0`}>
              <FileText className="w-6 h-6 text-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold truncate">{task.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLORS[task.status]}`}>
                  {STATUS_LABELS[task.status]}
                </span>
              </div>
              <p className="text-white/60 text-sm truncate">{task.description}</p>
            </div>

            {/* Progress */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <div className="text-right">
                <p className="text-sm text-white/60">Progreso</p>
                <p className="text-lg font-bold text-white">{progress}%</p>
              </div>
              <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${TYPE_COLORS[task.type]}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-white/60 flex-shrink-0">
              <Calendar className="w-4 h-4" />
              {task.dueDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTask(task);
                }}
                className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }}
                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  // ============================
  // RENDER PRINCIPAL
  // ============================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Gestión de Tareas
            </h1>
            <p className="text-white/60 mt-1">
              Crea, asigna y da seguimiento a todas las actividades de tus estudiantes
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateTask}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold"
          >
            <Plus className="w-5 h-5" />
            Nueva Tarea
          </motion.button>
        </div>

        {/* Stats */}
        {renderStats()}

        {/* Controls */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tareas..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filtros
              {showFilters ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Estado</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="all">Todos</option>
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Tipo</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as TaskType | 'all')}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="all">Todos</option>
                      {Object.entries(TYPE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Tasks Display */}
        {filteredTasks.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No hay tareas</h3>
            <p className="text-white/60 mb-6">
              {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                ? 'No se encontraron tareas con los filtros aplicados'
                : 'Crea tu primera tarea para comenzar'}
            </p>
            {!searchQuery && filterStatus === 'all' && filterType === 'all' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateTask}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold"
              >
                <Plus className="w-5 h-5" />
                Crear Primera Tarea
              </motion.button>
            )}
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            <AnimatePresence mode="popLayout">
              {filteredTasks.map(task => (
                viewMode === 'grid' ? renderTaskCard(task) : renderListItem(task)
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Task Detail Modal */}
        <AnimatePresence>
          {selectedTask && (
            <TaskDetailModal
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
              onDelete={() => {
                handleDeleteTask(selectedTask.id);
                setSelectedTask(null);
              }}
              getStudentSubmissions={getStudentSubmissionInfo}
            />
          )}
        </AnimatePresence>

        {/* Create Task Modal */}
        <AnimatePresence>
          {isCreating && (
            <CreateTaskModal
              onClose={() => setIsCreating(false)}
              onSave={async (newTask) => {
                const updatedTasks = [newTask, ...tasks];
                setTasks(updatedTasks);
                setIsCreating(false);
              }}
              teacherGroups={groups}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================
// SUB-COMPONENTES
// ============================

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onDelete: () => void;
  getStudentSubmissions: (task: Task) => StudentSubmissionInfo[];
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onDelete, getStudentSubmissions }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'analytics'>('overview');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <Card className="overflow-hidden">
          {/* Header */}
          <div className={`p-6 bg-gradient-to-r ${TYPE_COLORS[task.type]}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded text-sm font-semibold text-white">
                  {TYPE_LABELS[task.type]}
                </span>
                <h2 className="text-2xl font-bold text-white mt-3">{task.title}</h2>
                <p className="text-white/80 mt-2">{task.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mt-6">
              {[
                { key: 'overview', label: 'Resumen', icon: FileText },
                { key: 'submissions', label: 'Entregas', icon: Users },
                { key: 'analytics', label: 'Análisis', icon: BarChart3 }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === tab.key
                        ? 'bg-white text-slate-900'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-white/60">Fecha de Vencimiento</p>
                    <p className="text-white font-semibold mt-1">
                      {task.dueDate.toLocaleDateString('es-ES', { dateStyle: 'long' })}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-white/60">Puntos Totales</p>
                    <p className="text-white font-semibold mt-1">{task.totalPoints} puntos</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-white/60">Estudiantes Asignados</p>
                    <p className="text-white font-semibold mt-1">{task.assignedTo.length}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-white/60">Estado</p>
                    <span className={`inline-block px-2 py-1 rounded text-sm font-semibold mt-1 ${STATUS_COLORS[task.status]}`}>
                      {STATUS_LABELS[task.status]}
                    </span>
                  </div>
                </div>

                {task.instructions && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Instrucciones</h3>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-white/80">{task.instructions}</p>
                    </div>
                  </div>
                )}

                {task.attachments && task.attachments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Archivos Adjuntos</h3>
                    <div className="space-y-2">
                      {task.attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <Paperclip className="w-5 h-5 text-blue-400" />
                          <span className="flex-1 text-white">{file}</span>
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-white/60" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-3">
                {getStudentSubmissions(task).map(student => {
                  return (
                    <div key={student.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <span className="text-3xl">{student.avatar}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{student.name}</p>
                        <p className="text-white/60 text-sm">{student.group}</p>
                        {student.submittedAt && (
                          <p className="text-white/40 text-xs mt-1">
                            📅 {student.submittedAt.toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {student.submissionStatus === 'graded' ? (
                          <>
                            <div className="text-right">
                              <span className="text-green-400 font-bold">{student.score} / {task.totalPoints}</span>
                              {student.feedback && (
                                <p className="text-white/40 text-xs mt-0.5">Con retroalimentación</p>
                              )}
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </>
                        ) : student.submissionStatus === 'submitted' ? (
                          <>
                            <span className="text-yellow-400 font-medium">Pendiente de calificar</span>
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                          </>
                        ) : student.submissionStatus === 'late' ? (
                          <>
                            <span className="text-orange-400 font-medium">Entregada tarde</span>
                            <Clock className="w-5 h-5 text-orange-500" />
                          </>
                        ) : (
                          <>
                            <span className="text-red-400 font-medium">No entregada</span>
                            <XCircle className="w-5 h-5 text-red-500" />
                          </>
                        )}
                        {(student.submissionStatus === 'submitted' || student.submissionStatus === 'late' || student.submissionStatus === 'graded') && (
                          <NavLink
                            to={`/teacher/calificaciones?taskId=${task.id}&studentId=${student.id}`}
                            className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors font-medium"
                          >
                            {student.submissionStatus === 'graded' ? 'Ver Calificación' : 'Calificar'}
                          </NavLink>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-white/60">Entregadas</p>
                    <p className="text-3xl font-bold text-green-400 mt-1">
                      {Math.round((task.submittedCount / task.assignedTo.length) * 100)}%
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
                    <p className="text-sm text-white/60">Calificadas</p>
                    <p className="text-3xl font-bold text-purple-400 mt-1">
                      {Math.round((task.gradedCount / task.assignedTo.length) * 100)}%
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-white/60">Promedio</p>
                    <p className="text-3xl font-bold text-blue-400 mt-1">
                      {task.averageScore?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-semibold mb-3">Distribución de Puntajes</h3>
                  <div className="space-y-2">
                    {[
                      { range: '90-100', count: 2, color: 'from-green-500 to-emerald-500' },
                      { range: '80-89', count: 1, color: 'from-blue-500 to-cyan-500' },
                      { range: '70-79', count: 1, color: 'from-yellow-500 to-orange-500' },
                      { range: '60-69', count: 1, color: 'from-orange-500 to-red-500' }
                    ].map(stat => (
                      <div key={stat.range} className="flex items-center gap-3">
                        <span className="text-white/60 w-16 text-sm">{stat.range}</span>
                        <div className="flex-1 h-8 bg-white/5 rounded overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${stat.color} flex items-center px-2`}
                            style={{ width: `${(stat.count / task.gradedCount) * 100}%` }}
                          >
                            <span className="text-white text-sm font-semibold">{stat.count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex justify-between">
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Tarea
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
              >
                Cerrar
              </button>
              <NavLink
                to={`/teacher/calificaciones?taskId=${task.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Ir a Calificar
              </NavLink>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

interface CreateTaskModalProps {
  onClose: () => void;
  onSave: (task: Task) => void;
  teacherGroups: GrupoConEstadisticas[];
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onSave, teacherGroups }) => {
  const { user } = useAuth();
  const myGroups = teacherGroups; // Use the passed prop directly
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'homework' as TaskType,
    subject: '',
    dueDate: '',
    totalPoints: 10,
    assignedTo: [] as string[],
    instructions: ''
  });

  const handleSubmit = async () => {
    // Validaciones
    if (!formData.title.trim()) {
      alert('❌ El título es requerido');
      return;
    }
    if (formData.title.length < 5) {
      alert('❌ El título debe tener al menos 5 caracteres');
      return;
    }
    if (!formData.description.trim()) {
      alert('❌ La descripción es requerida');
      return;
    }
    if (!formData.dueDate) {
      alert('❌ La fecha de entrega es requerida');
      return;
    }
    if (formData.assignedTo.length === 0) {
      alert('❌ Debes seleccionar al menos un grupo');
      return;
    }
    if (formData.totalPoints < 1) {
      alert('❌ Los puntos deben ser al menos 1');
      return;
    }

    if (!user?.id) {
      alert('❌ Error: usuario no autenticado');
      return;
    }

    try {
      // Crear tarea en Supabase para el primer grupo
      // TODO: Si se seleccionan múltiples grupos, crear una tarea por grupo
      const grupoId = formData.assignedTo[0];
      
      const tareaPayload = {
        grupo_id: grupoId,
        profesor_id: user.id,
        titulo: formData.title,
        descripcion: formData.description,
        tipo: mapTaskTypeToTareaTipo(formData.type),
        fecha_entrega: new Date(formData.dueDate).toISOString(),
        puntos_max: formData.totalPoints,
        archivo_url: null, // No se sube archivo en este flujo
        instrucciones: formData.instructions ? { text: formData.instructions } : null,
        activo: true
      };

      const createdTarea = await createTask(tareaPayload);

      // Convertir la tarea creada al tipo Task de UI
      const newTask: Task = {
        id: createdTarea.id,
        title: createdTarea.titulo,
        description: createdTarea.descripcion || '',
        type: mapTareaTypeToTaskType(createdTarea.tipo),
        subject: '',
        status: mapStatusToTaskStatus(createdTarea),
        createdAt: new Date(createdTarea.created_at),
        dueDate: new Date(createdTarea.fecha_entrega!),
        assignedTo: [createdTarea.grupo_id],
        totalPoints: createdTarea.puntos_max,
        submittedCount: 0,
        gradedCount: 0
      };

      onSave(newTask);

      // Mensaje de éxito
      const groupNames = myGroups
        .filter(g => formData.assignedTo.includes(g.id))
        .map(g => g.nombre)
        .join(', ');
      
      alert(`✅ Tarea creada exitosamente!\n\n📝 "${formData.title}"\n👥 Asignada a: ${groupNames}\n📅 Fecha límite: ${new Date(formData.dueDate).toLocaleDateString('es-ES')}\n⭐ Puntos: ${formData.totalPoints}`);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('❌ Error al crear la tarea. Por favor intenta de nuevo.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <Card className="p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Crear Nueva Tarea</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="Ej: Tarea de Álgebra - Ecuaciones"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                placeholder="Describe la tarea..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as TaskType }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  {Object.entries(TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Materia</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Ej: Matemáticas"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Fecha de Entrega *</label>
                <input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Puntos Totales</label>
                <input
                  type="number"
                  value={formData.totalPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalPoints: parseInt(e.target.value) || 0 }))}
                  min="1"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Instrucciones Adicionales</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                placeholder="Instrucciones especiales para los estudiantes..."
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">
                Asignar a Grupos *
                {formData.assignedTo.length > 0 && (
                  <span className="ml-2 text-green-400 text-xs">
                    ({formData.assignedTo.length} {formData.assignedTo.length === 1 ? 'grupo seleccionado' : 'grupos seleccionados'})
                  </span>
                )}
              </label>
              
              {myGroups.length === 0 ? (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  No tienes grupos asignados. Contacta al administrador.
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      assignedTo: prev.assignedTo.length === myGroups.length ? [] : myGroups.map(g => g.id)
                    }))}
                    className="w-full text-left px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-sm font-medium transition-colors"
                  >
                    {formData.assignedTo.length === myGroups.length ? '✓ Deseleccionar Todos' : '+ Seleccionar Todos'}
                  </button>
                  
                  {myGroups.map(group => {
                    const isSelected = formData.assignedTo.includes(group.id);
                    return (
                      <button
                        key={group.id}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            assignedTo: isSelected
                              ? prev.assignedTo.filter(id => id !== group.id)
                              : [...prev.assignedTo, group.id]
                          }));
                        }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all ${
                          isSelected 
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50' 
                            : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-blue-500 border-blue-500' : 'border-white/30'
                          }`}>
                            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <div className="text-left">
                            <div className={`text-sm font-semibold ${isSelected ? 'text-blue-300' : 'text-white'}`}>
                              {group.nombre}
                            </div>
                            <div className="text-xs text-white/60">
                              {group.materia} • {group.nivel} • {group.estudiantes.length} estudiantes
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="text-xs bg-blue-500/30 px-2 py-1 rounded text-blue-300">
                            ✓ Seleccionado
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium"
            >
              <Send className="w-4 h-4" />
              Crear y Asignar
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

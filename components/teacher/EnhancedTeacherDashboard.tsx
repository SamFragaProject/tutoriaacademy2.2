import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, Users,
  Zap, Calendar, Star, Award, Target, Activity, BarChart3, MessageSquare,
  Send, FilePlus, ClipboardList, BrainCircuit, ArrowRight, Bell,
  BookOpen, FileText, Timer, Sparkles, Trophy, ChevronRight, Eye,
  ThumbsUp, Flame, Heart, Brain, PlayCircle, Coffee
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../ui';
import FlowProgress from '../FlowProgress';
import FlowNotificationBanner from '../FlowNotificationBanner';

// Types
interface KPIData {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: string;
}

interface Alert {
  id: string;
  type: 'urgent' | 'warning' | 'success' | 'info';
  studentName: string;
  message: string;
  action: string;
  actionLink: string;
  timestamp: Date;
}

interface Event {
  id: string;
  title: string;
  time: string;
  type: 'exam' | 'meeting' | 'deadline' | 'class';
  color: string;
}

interface StudentNeedingAttention {
  id: string;
  name: string;
  avatar: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  score: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: Date;
}

// Mock Data
const MOCK_KPIS: KPIData[] = [
  {
    label: 'Estudiantes Activos',
    value: 127,
    change: 5.2,
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    label: 'Por Calificar',
    value: 23,
    change: -8,
    trend: 'down',
    icon: Clock,
    color: 'from-amber-500 to-orange-500'
  },
  {
    label: 'Promedio Grupal',
    value: '87.5%',
    change: 2.3,
    trend: 'up',
    icon: Target,
    color: 'from-green-500 to-emerald-500'
  },
  {
    label: 'Tiempo Ahorrado',
    value: '12.5h',
    change: 45,
    trend: 'up',
    icon: Zap,
    color: 'from-purple-500 to-pink-500'
  },
];

const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'urgent',
    studentName: 'María González',
    message: 'Bajó 15% su promedio en las últimas 2 semanas',
    action: 'Ver Detalles',
    actionLink: '/docente/grupos',
    timestamp: new Date('2025-10-06T10:30:00')
  },
  {
    id: '2',
    type: 'warning',
    studentName: 'Carlos Ramírez',
    message: '3 tareas sin entregar consecutivas',
    action: 'Enviar Mensaje',
    actionLink: '/docente/grupos',
    timestamp: new Date('2025-10-06T09:15:00')
  },
  {
    id: '3',
    type: 'success',
    studentName: 'Ana Martínez',
    message: '¡Logró 95+ en 3 tareas seguidas!',
    action: 'Felicitar',
    actionLink: '/docente/grupos',
    timestamp: new Date('2025-10-06T08:00:00')
  },
  {
    id: '4',
    type: 'info',
    studentName: 'Juan López',
    message: 'Completó módulo de matemáticas avanzadas',
    action: 'Ver Progreso',
    actionLink: '/docente/grupos',
    timestamp: new Date('2025-10-05T16:45:00')
  },
];

const TODAY_EVENTS: Event[] = [
  { id: '1', title: 'Examen Matemáticas 3ro A', time: '10:00', type: 'exam', color: 'text-red-500' },
  { id: '2', title: 'Reunión con padres', time: '14:30', type: 'meeting', color: 'text-blue-500' },
  { id: '3', title: 'Clase de Física', time: '16:00', type: 'class', color: 'text-green-500' },
];

const WEEK_EVENTS: Event[] = [
  { id: '4', title: '15 tareas pendientes', time: 'Miércoles', type: 'deadline', color: 'text-orange-500' },
  { id: '5', title: 'Examen Final Química', time: 'Viernes', type: 'exam', color: 'text-red-500' },
  { id: '6', title: 'Junta de profesores', time: 'Viernes', type: 'meeting', color: 'text-purple-500' },
];

const STUDENTS_NEEDING_ATTENTION: StudentNeedingAttention[] = [
  { id: '1', name: 'Pedro Sánchez', avatar: '👨', reason: 'Bajo rendimiento', priority: 'high', score: 62 },
  { id: '2', name: 'Lucía Torres', avatar: '👧', reason: 'Ausencias frecuentes', priority: 'high', score: 68 },
  { id: '3', name: 'Diego Morales', avatar: '👦', reason: 'Tareas incompletas', priority: 'medium', score: 74 },
  { id: '4', name: 'Sofia Ruiz', avatar: '👩', reason: 'Necesita refuerzo', priority: 'medium', score: 78 },
];

const RECENT_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: '50 Tareas Calificadas', description: 'Esta semana', icon: '🎯', date: new Date() },
  { id: '2', title: '95% Entregas a Tiempo', description: 'Grupo 3ro A', icon: '⭐', date: new Date() },
  { id: '3', title: 'Semana Perfecta', description: 'Sin tareas pendientes', icon: '🏆', date: new Date() },
];

const PROGRESS_DATA = [
  { week: 'Sem 1', value: 75 },
  { week: 'Sem 2', value: 78 },
  { week: 'Sem 3', value: 82 },
  { week: 'Sem 4', value: 87 },
];

export const EnhancedTeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const currentDate = useMemo(() => {
    const date = new Date();
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} ${date.getFullYear()}`;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 pb-8">
      {/* Notificaciones inteligentes */}
      <FlowNotificationBanner maxVisible={2} className="mb-6" />
      
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              👋 Bienvenido, {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {currentDate}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all relative"
            >
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                4
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Asistente IA
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {MOCK_KPIS.map((kpi, index) => (
          <KPICard key={index} data={kpi} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Alerts Panel - Takes 2 columns */}
        <div className="lg:col-span-2">
          <AlertsPanel alerts={MOCK_ALERTS} onSelectAlert={setSelectedAlert} />
        </div>

        {/* Calendar Panel */}
        <div>
          <CalendarPanel todayEvents={TODAY_EVENTS} weekEvents={WEEK_EVENTS} />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2">
          <ProgressChart data={PROGRESS_DATA} />
        </div>

        {/* Students Needing Attention */}
        <div>
          <StudentsAttentionWidget students={STUDENTS_NEEDING_ATTENTION} />
        </div>
      </div>

      {/* Teacher Flow Progress */}
      <div className="mb-8">
        <FlowProgress />
      </div>

      {/* Quick Actions */}
      <QuickActionsPanel />

      {/* Achievements */}
      <AchievementsPanel achievements={RECENT_ACHIEVEMENTS} />
    </div>
  );
};

// KPI Card Component
const KPICard: React.FC<{ data: KPIData; index: number }> = ({ data, index }) => {
  const Icon = data.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Card className="p-6 border-2 border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-900/50 transition-all relative overflow-hidden group">
        <div className={`absolute inset-0 bg-gradient-to-r ${data.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${data.color} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
              data.trend === 'up' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : data.trend === 'down'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
            }`}>
              {data.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(data.change)}%
            </div>
          </div>
          
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {data.value}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.label}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

// Alerts Panel Component
const AlertsPanel: React.FC<{ alerts: Alert[]; onSelectAlert: (alert: Alert) => void }> = ({ alerts, onSelectAlert }) => {
  const getAlertStyle = (type: Alert['type']) => {
    switch (type) {
      case 'urgent':
        return 'from-red-500/10 to-rose-500/10 border-red-500/30 hover:border-red-500/50';
      case 'warning':
        return 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30 hover:border-yellow-500/50';
      case 'success':
        return 'from-green-500/10 to-emerald-500/10 border-green-500/30 hover:border-green-500/50';
      case 'info':
        return 'from-blue-500/10 to-cyan-500/10 border-blue-500/30 hover:border-blue-500/50';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'success': return <Star className="w-5 h-5 text-green-500" />;
      case 'info': return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <Card className="p-6 border-2 border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Alertas Inteligentes
          </h2>
        </div>
        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
          {alerts.length} Activas
        </span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            className={`p-4 rounded-xl bg-gradient-to-r ${getAlertStyle(alert.type)} border-2 transition-all cursor-pointer`}
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: alert.type === 'urgent' ? [0, -10, 10, 0] : 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0 mt-1"
              >
                {getAlertIcon(alert.type)}
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white mb-1">
                  {alert.studentName}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {alert.message}
                </p>
                
                <div className="flex items-center gap-2">
                  <NavLink to={alert.actionLink}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                    >
                      {alert.action}
                    </motion.button>
                  </NavLink>
                  
                  <button className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Descartar
                  </button>
                </div>
              </div>

              <span className="text-xs text-gray-500 dark:text-gray-500">
                {alert.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

// Calendar Panel Component
const CalendarPanel: React.FC<{ todayEvents: Event[]; weekEvents: Event[] }> = ({ todayEvents, weekEvents }) => {
  return (
    <Card className="p-6 border-2 border-gray-100 dark:border-gray-800 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Agenda
        </h2>
      </div>

      {/* Today */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Hoy
        </h3>
        <div className="space-y-2">
          {todayEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ x: 4 }}
              className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {event.title}
                </span>
                <span className={`text-sm font-bold ${event.color}`}>
                  {event.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* This Week */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Esta Semana
        </h3>
        <div className="space-y-2">
          {weekEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ x: 4 }}
              className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {event.title}
                </span>
                <span className={`text-sm font-bold ${event.color}`}>
                  {event.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Progress Chart Component
const ProgressChart: React.FC<{ data: typeof PROGRESS_DATA }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card className="p-6 border-2 border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Progreso del Grupo - Últimos 30 Días
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all"
        >
          Ver Detalle
        </motion.button>
      </div>

      <div className="flex items-end justify-between h-48 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg relative group cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
              >
                {item.value}%
              </motion.div>
            </motion.div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {item.week}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/30">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">
            +12% de mejora en las últimas 4 semanas
          </span>
        </div>
      </div>
    </Card>
  );
};

// Students Attention Widget
const StudentsAttentionWidget: React.FC<{ students: StudentNeedingAttention[] }> = ({ students }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <Card className="p-6 border-2 border-gray-100 dark:border-gray-800 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
          <Eye className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Requieren Atención
        </h2>
      </div>

      <div className="space-y-3">
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{student.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {student.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {student.reason}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getPriorityColor(student.priority)}`}>
                {student.score}%
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${student.score}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className={`h-full ${
                    student.score >= 75 ? 'bg-green-500' : 
                    student.score >= 70 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        Ver Todos
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </Card>
  );
};

// Quick Actions Panel
const QuickActionsPanel: React.FC = () => {
  const actions = [
    { icon: FilePlus, label: 'Crear Examen', link: '/docente/examenes', color: 'from-green-500 to-emerald-500' },
    { icon: ClipboardList, label: 'Banco de Preguntas', link: '/docente/banco-preguntas', color: 'from-blue-500 to-cyan-500' },
    { icon: CheckCircle, label: 'Calificar Tareas', link: '/docente/calificaciones', color: 'from-amber-500 to-orange-500' },
    { icon: BrainCircuit, label: 'Detección Dificultades', link: '/docente/screening', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <Card className="p-6 border-2 border-gray-100 dark:border-gray-800 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Acciones Rápidas
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <NavLink key={index} to={action.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative h-32 rounded-2xl bg-gradient-to-br ${action.color}/10 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all overflow-hidden cursor-pointer`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color}/10 opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative h-full flex flex-col items-center justify-center p-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-text-primary text-center">
                    {action.label}
                  </span>
                </div>
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </Card>
  );
};

// Achievements Panel
const AchievementsPanel: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  return (
    <Card className="p-6 border-2 border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Logros Recientes
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
            className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border-2 border-yellow-200 dark:border-yellow-900/30 cursor-pointer"
          >
            <div className="text-4xl mb-2 text-center">{achievement.icon}</div>
            <h3 className="font-bold text-gray-900 dark:text-white text-center mb-1">
              {achievement.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {achievement.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

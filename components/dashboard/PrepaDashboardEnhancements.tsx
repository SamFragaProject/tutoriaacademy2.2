// components/dashboard/PrepaDashboardEnhancements.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar,
  Trophy,
  Brain,
  Zap,
  Star,
  Award,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../ui';

interface PrepaDashboardEnhancementsProps {
  userId: string;
  examDate?: string;
}

const PrepaDashboardEnhancements: React.FC<PrepaDashboardEnhancementsProps> = ({ 
  userId, 
  examDate 
}) => {
  // Calcular días hasta el examen
  const daysUntilExam = examDate 
    ? Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">
      {/* Banner de preparación para examen */}
      {daysUntilExam && daysUntilExam > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden"
        >
          {/* Efectos de fondo */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <GraduationCap className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-1">Preparación para Examen</h3>
                <p className="text-white/90 font-medium">
                  Quedan <span className="font-black text-yellow-300">{daysUntilExam} días</span> para tu examen
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-white/80 mb-1">Fecha del Examen</p>
              <p className="text-xl font-black">{new Date(examDate).toLocaleDateString('es-MX', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cards de áreas clave para preparatoria */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Habilidades Cognitivas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20 hover:shadow-xl transition-all cursor-pointer group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-black text-text-primary mb-2">Gimnasio Cognitivo</h3>
                <p className="text-sm text-text-secondary mb-3">
                  Entrena habilidades específicas para mejorar tu desempeño en el examen
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-semibold text-text-secondary">
                    Memoria de trabajo, Atención, Velocidad de procesamiento
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs font-bold text-text-tertiary">Actividades especializadas</span>
                <div className="px-2 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">
                  NUEVO
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Exámenes de Práctica */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:shadow-xl transition-all cursor-pointer group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-black text-text-primary mb-2">Exámenes Simulados</h3>
                <p className="text-sm text-text-secondary mb-3">
                  Practica con exámenes tipo COMIPEMS/UNAM con retroalimentación detallada
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-semibold text-text-secondary">
                    Condiciones reales, cronómetro, análisis de resultados
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs font-bold text-text-tertiary">Modalidad examen</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-text-tertiary" />
                  <span className="text-xs font-bold text-text-tertiary">120 min</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Análisis de Rendimiento */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20 hover:shadow-xl transition-all cursor-pointer group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-black text-text-primary mb-2">Análisis Inteligente</h3>
                <p className="text-sm text-text-secondary mb-3">
                  IA que identifica tus áreas fuertes y débiles para optimizar tu estudio
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-semibold text-text-secondary">
                    Recomendaciones personalizadas, Plan de estudio adaptativo
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs font-bold text-text-tertiary">Powered by AI</span>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs font-bold text-text-tertiary">En tiempo real</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Metas semanales específicas de preparatoria */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-text-primary">Metas de Preparación</h3>
              <p className="text-sm text-text-secondary">Plan semanal optimizado para preparatoria</p>
            </div>
          </div>
          <Calendar className="w-6 h-6 text-text-tertiary" />
        </div>

        <div className="space-y-3">
          {[
            { label: 'Exámenes de práctica completados', current: 3, target: 5, icon: BookOpen, color: 'blue' },
            { label: 'Sesiones de Gimnasio Cognitivo', current: 7, target: 10, icon: Brain, color: 'purple' },
            { label: 'Temas dominados', current: 12, target: 20, icon: Target, color: 'green' },
            { label: 'Horas de estudio acumuladas', current: 8, target: 15, icon: Clock, color: 'orange' },
          ].map((goal, index) => {
            const Icon = goal.icon;
            const percentage = Math.round((goal.current / goal.target) * 100);
            const colorClasses = {
              blue: { bg: 'bg-blue-500', text: 'text-blue-600' },
              purple: { bg: 'bg-purple-500', text: 'text-purple-600' },
              green: { bg: 'bg-green-500', text: 'text-green-600' },
              orange: { bg: 'bg-orange-500', text: 'text-orange-600' },
            }[goal.color];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${colorClasses.text}`} />
                    <span className="text-sm font-semibold text-text-secondary">{goal.label}</span>
                  </div>
                  <span className="text-sm font-bold text-text-primary">
                    {goal.current} / {goal.target}
                  </span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                    className={`h-full ${colorClasses.bg} rounded-full`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default PrepaDashboardEnhancements;

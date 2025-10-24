/**
 * Componente de Dashboard Adaptativo por Nivel Educativo
 * Demuestra cómo usar useGradeConfig para adaptar la UI
 */

import React from 'react';
import { useGradeConfig, useFeatureAccess, useAdaptiveVocabulary } from '../../hooks/useGradeConfig';
import { Card } from '../ui';
import { motion } from 'framer-motion';
import { 
  Home, BookOpen, FileText, BarChart, Trophy, Calendar, 
  Settings, Download, Sparkles 
} from 'lucide-react';

export const AdaptiveDashboardHeader: React.FC = () => {
  const config = useGradeConfig();
  const vocab = useAdaptiveVocabulary();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${config.theme.primaryGradient}`}
    >
      {/* Elementos decorativos según nivel */}
      {config.level === 'primaria' && (
        <>
          <div className="absolute top-0 right-0 text-9xl opacity-10">🎨</div>
          <div className="absolute bottom-0 left-0 text-7xl opacity-10">✨</div>
        </>
      )}
      
      {config.level === 'secundaria' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      )}
      
      {config.level === 'preparatoria' && (
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 h-full">
            {[...Array(32)].map((_, i) => (
              <div key={i} className="border border-white/20 rounded" />
            ))}
          </div>
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{config.emoji}</span>
          <h1 className="text-3xl font-black text-white">
            {vocab.dashboard}
          </h1>
        </div>
        
        <p className="text-white/90 text-lg">
          {config.level === 'primaria' && '¡Bienvenido a tu espacio de aprendizaje! 🌟'}
          {config.level === 'secundaria' && 'Gestiona tus estudios de forma inteligente 📚'}
          {config.level === 'preparatoria' && 'Panel de control académico 🎯'}
        </p>
      </div>
    </motion.div>
  );
};

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  description,
  disabled,
  onClick,
}) => {
  const config = useGradeConfig();
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -4 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left p-6 rounded-xl transition-all duration-300
        ${config.theme.cardStyle === 'playful' ? 'bg-gradient-to-br from-surface-1 to-surface-2 border-2 border-primary/30' : ''}
        ${config.theme.cardStyle === 'standard' ? 'bg-surface-1 border border-border hover:border-primary/50' : ''}
        ${config.theme.cardStyle === 'minimal' ? 'bg-surface-1/50 border border-border/50 backdrop-blur' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`
          flex-shrink-0 rounded-xl flex items-center justify-center
          ${config.theme.iconSize === 'large' ? 'w-16 h-16 text-2xl' : ''}
          ${config.theme.iconSize === 'medium' ? 'w-12 h-12 text-xl' : ''}
          ${config.theme.iconSize === 'small' ? 'w-10 h-10 text-lg' : ''}
          bg-gradient-to-br ${config.theme.primaryGradient}
        `}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className={`
            font-bold text-text-primary mb-1
            ${config.theme.iconSize === 'large' ? 'text-lg' : 'text-base'}
          `}>
            {title}
          </h3>
          <p className="text-sm text-text-secondary">
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

export const AdaptiveQuickActions: React.FC = () => {
  const vocab = useAdaptiveVocabulary();
  const canTakeExams = useFeatureAccess('canTakeExams');
  const canSubmitAssignments = useFeatureAccess('canSubmitAssignments');
  const canManageSchedule = useFeatureAccess('canManageSchedule');
  const canViewDetailedStats = useFeatureAccess('canViewDetailedStats');
  const canExportReports = useFeatureAccess('canExportReports');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {canSubmitAssignments && (
        <QuickActionCard
          icon={<FileText />}
          title={vocab.assignment}
          description="Ver y entregar tareas pendientes"
          onClick={() => {/* navigate */}}
        />
      )}
      
      {canTakeExams && (
        <QuickActionCard
          icon={<BookOpen />}
          title={vocab.exam}
          description="Realizar evaluaciones programadas"
          onClick={() => {/* navigate */}}
        />
      )}
      
      {canManageSchedule && (
        <QuickActionCard
          icon={<Calendar />}
          title="Agenda"
          description="Organiza tus actividades"
          onClick={() => {/* navigate */}}
        />
      )}
      
      {canViewDetailedStats && (
        <QuickActionCard
          icon={<BarChart />}
          title="Estadísticas"
          description="Analiza tu progreso detallado"
          onClick={() => {/* navigate */}}
        />
      )}
      
      <QuickActionCard
        icon={<Trophy />}
        title={vocab.achievement}
        description="Ve tus logros y medallas"
        onClick={() => {/* navigate */}}
      />
      
      {canExportReports && (
        <QuickActionCard
          icon={<Download />}
          title="Exportar"
          description="Descarga reportes en PDF"
          onClick={() => {/* navigate */}}
        />
      )}
    </div>
  );
};

/**
 * Ejemplo de badge de calificación adaptativo
 */
interface AdaptiveGradeBadgeProps {
  score: number;
  maxScore: number;
}

export const AdaptiveGradeBadge: React.FC<AdaptiveGradeBadgeProps> = ({ score, maxScore }) => {
  const config = useGradeConfig();
  const percentage = (score / maxScore) * 100;
  
  const getGrade = () => {
    if (config.gradingSystem.scale === 'emoji') {
      if (percentage >= 90) return { emoji: '😊', text: 'Excelente', color: 'text-green-500' };
      if (percentage >= 70) return { emoji: '😐', text: 'Bien', color: 'text-yellow-500' };
      return { emoji: '😕', text: 'Puede mejorar', color: 'text-orange-500' };
    }
    
    if (config.gradingSystem.scale === 'numeric') {
      const grade = Math.round((percentage / 10));
      return { text: `${grade}/10`, color: grade >= 7 ? 'text-green-500' : 'text-orange-500' };
    }
    
    // Letter grade
    if (percentage >= 93) return { text: 'A+', color: 'text-green-600' };
    if (percentage >= 90) return { text: 'A', color: 'text-green-500' };
    if (percentage >= 87) return { text: 'B+', color: 'text-blue-500' };
    if (percentage >= 83) return { text: 'B', color: 'text-blue-400' };
    if (percentage >= 80) return { text: 'B-', color: 'text-blue-300' };
    if (percentage >= 77) return { text: 'C+', color: 'text-yellow-500' };
    if (percentage >= 70) return { text: 'C', color: 'text-orange-500' };
    return { text: 'D', color: 'text-red-500' };
  };
  
  const grade = getGrade();
  
  return (
    <div className={`
      inline-flex items-center gap-2 px-4 py-2 rounded-full
      ${config.theme.cardStyle === 'playful' ? 'bg-gradient-to-r from-surface-2 to-surface-1 border-2 border-primary/30' : 'bg-surface-1 border border-border'}
    `}>
      {grade.emoji && <span className="text-2xl">{grade.emoji}</span>}
      <span className={`text-lg font-bold ${grade.color}`}>
        {grade.text}
      </span>
      {config.gradingSystem.showPercentage && (
        <span className="text-sm text-text-secondary ml-2">
          ({percentage.toFixed(0)}%)
        </span>
      )}
    </div>
  );
};

/**
 * Card de estadísticas adaptativo
 */
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export const AdaptiveStatCard: React.FC<StatCardProps> = ({ label, value, icon, trend }) => {
  const config = useGradeConfig();
  
  return (
    <Card className={`
      ${config.theme.cardStyle === 'playful' ? 'bg-gradient-to-br from-surface-1 to-surface-2' : ''}
      ${config.theme.cardStyle === 'minimal' ? 'bg-surface-1/50 backdrop-blur' : ''}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`
            text-text-secondary mb-1
            ${config.theme.iconSize === 'large' ? 'text-base' : 'text-sm'}
          `}>
            {label}
          </p>
          <p className={`
            font-black bg-clip-text text-transparent bg-gradient-to-r ${config.theme.primaryGradient}
            ${config.theme.iconSize === 'large' ? 'text-4xl' : 'text-2xl'}
          `}>
            {value}
          </p>
        </div>
        
        <div className={`
          rounded-xl flex items-center justify-center bg-gradient-to-br ${config.theme.primaryGradient}
          ${config.theme.iconSize === 'large' ? 'w-14 h-14' : 'w-12 h-12'}
        `}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
      
      {trend && config.uiComplexity !== 'simple' && (
        <div className="mt-3 flex items-center gap-1">
          <Sparkles className={`
            w-4 h-4
            ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}
          `} />
          <span className="text-xs text-text-secondary">
            {trend === 'up' && '↗ Mejorando'}
            {trend === 'down' && '↘ En descenso'}
            {trend === 'neutral' && '→ Estable'}
          </span>
        </div>
      )}
    </Card>
  );
};

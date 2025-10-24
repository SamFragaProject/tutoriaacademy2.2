// components/cognitiveGym/GymAreaDetail.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Lock, CheckCircle2, Star, Trophy, 
  Clock, Zap, Target, TrendingUp, Award
} from 'lucide-react';
import { Card, PrimaryButton } from '../ui';
import { 
  getAreaWithProgress, 
  type GymAreaId, 
  type GymActivity,
  type DifficultyLevel
} from '../../services/cognitiveGym';

interface GymAreaDetailProps {
  userId: string;
  areaId: GymAreaId;
  onBack: () => void;
  onStartActivity: (activity: GymActivity) => void;
}

const difficultyColors: Record<DifficultyLevel, { bg: string; text: string; border: string }> = {
  principiante: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/30' },
  intermedio: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
  avanzado: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' },
  experto: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/30' },
  maestro: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/30' }
};

const activityTypeIcons = {
  juego: '🎮',
  ejercicio: '📝',
  desafio: '⚔️',
  rutina: '🏋️'
};

const GymAreaDetail: React.FC<GymAreaDetailProps> = ({ 
  userId, 
  areaId, 
  onBack, 
  onStartActivity 
}) => {
  const [area, setArea] = useState<ReturnType<typeof getAreaWithProgress> | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'todos' | DifficultyLevel>('todos');
  const [selectedActivity, setSelectedActivity] = useState<GymActivity | null>(null);

  useEffect(() => {
    const areaData = getAreaWithProgress(userId, areaId);
    setArea(areaData);
  }, [userId, areaId]);

  if (!area) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-text-secondary">Cargando área...</div>
      </div>
    );
  }

  const Icon = area.icon;
  const progressPercent = Math.round((area.currentXP / area.nextLevelXP) * 100);
  
  const filteredActivities = selectedFilter === 'todos' 
    ? area.activities 
    : area.activities.filter(a => a.difficulty === selectedFilter);

  const completedCount = area.activities.filter(a => a.completed).length;
  const unlockedCount = area.activities.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header con botón volver */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-semibold"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al Hub
      </motion.button>

      {/* Hero del área */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${area.gradient}`}
      >
        {/* Efectos de fondo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Título y descripción */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-white flex-1">
                <h1 className="text-4xl font-black mb-2">{area.name}</h1>
                <p className="text-white/90 font-medium">{area.description}</p>
              </div>
            </div>

            {/* Progreso de nivel */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-white/90 text-sm font-semibold">
                <span>Nivel {area.level}</span>
                <span>{area.currentXP} / {area.nextLevelXP} XP ({progressPercent}%)</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-white rounded-full shadow-lg"
                />
              </div>
            </div>

            {/* Beneficios */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Beneficios del Entrenamiento
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {area.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-white/90 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats del área */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
              <div className="text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">Completadas</span>
                  </div>
                  <span className="text-2xl font-black">{completedCount}/{area.activities.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    <span className="font-semibold">Desbloqueadas</span>
                  </div>
                  <span className="text-2xl font-black">{unlockedCount}/{area.activities.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">XP Total</span>
                  </div>
                  <span className="text-2xl font-black">{area.totalXP}</span>
                </div>
              </div>
            </div>

            {/* Habilidades específicas */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Habilidades
              </h3>
              <div className="space-y-3">
                {area.skills.map((skill, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-white/90 text-sm">
                      <span className="font-semibold">{skill.name}</span>
                      <span className="font-bold">{skill.value}/{skill.maxValue}</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.value / skill.maxValue) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className={`h-full bg-gradient-to-r ${skill.gradient} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info rápida del área */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-text-primary">{completedCount}</p>
              <p className="text-xs font-semibold text-text-secondary">Completadas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-text-primary">{unlockedCount}</p>
              <p className="text-xs font-semibold text-text-secondary">Desbloqueadas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-text-primary">{area.activities.length}</p>
              <p className="text-xs font-semibold text-text-secondary">Total</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-text-primary">{area.level}</p>
              <p className="text-xs font-semibold text-text-secondary">Tu Nivel</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros de actividades */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedFilter('todos')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            selectedFilter === 'todos'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-surface-2 text-text-secondary hover:bg-surface-1'
          }`}
        >
          Todas ({area.activities.length})
        </button>
        {Object.keys(difficultyColors).map((diff) => {
          const count = area.activities.filter(a => a.difficulty === diff).length;
          if (count === 0) return null;
          
          return (
            <button
              key={diff}
              onClick={() => setSelectedFilter(diff as DifficultyLevel)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                selectedFilter === diff
                  ? `${difficultyColors[diff as DifficultyLevel].bg} ${difficultyColors[diff as DifficultyLevel].text} border ${difficultyColors[diff as DifficultyLevel].border}`
                  : 'bg-surface-2 text-text-secondary hover:bg-surface-1'
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Mensaje motivacional */}
      {completedCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-text-primary mb-2">¡Comienza tu entrenamiento!</h3>
              <p className="text-sm text-text-secondary">
                Completa actividades para ganar XP, desbloquear logros y mejorar tus habilidades cognitivas. 
                Cada actividad está diseñada para potenciar diferentes aspectos de tu aprendizaje.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {filteredActivities.length === 0 && (
        <Card className="p-12 text-center">
          <Lock className="w-16 h-16 mx-auto text-text-tertiary mb-4" />
          <p className="text-xl font-bold text-text-secondary mb-2">No hay actividades disponibles</p>
          <p className="text-text-tertiary">Cambia el filtro o sube de nivel para desbloquear más contenido</p>
        </Card>
      )}

      {/* Lista de actividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredActivities.map((activity, index) => {
          const ActivityIcon = activity.icon;
          const isLocked = !activity.unlocked;
          const diffStyle = difficultyColors[activity.difficulty];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`p-6 relative overflow-hidden transition-all ${
                  isLocked 
                    ? 'opacity-60' 
                    : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                }`}
                onClick={() => !isLocked && setSelectedActivity(activity)}
              >
                {/* Indicador de completado */}
                {activity.completed && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Indicador de bloqueado */}
                {isLocked && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center shadow-lg">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${area.gradient} flex items-center justify-center shadow-lg`}>
                      <ActivityIcon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{activityTypeIcons[activity.type]}</span>
                        <h3 className="text-lg font-black text-text-primary">{activity.name}</h3>
                      </div>
                      <p className="text-sm text-text-secondary">{activity.shortDescription}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${diffStyle.bg} ${diffStyle.text} border ${diffStyle.border}`}>
                      {activity.difficulty.toUpperCase()}
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                      {activity.type.toUpperCase()}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm font-black text-text-primary">{activity.duration}m</span>
                      </div>
                      <p className="text-xs text-text-tertiary">Duración</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-black text-text-primary">+{activity.xpReward}</span>
                      </div>
                      <p className="text-xs text-text-tertiary">XP</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Trophy className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-black text-text-primary">+{activity.coinReward}</span>
                      </div>
                      <p className="text-xs text-text-tertiary">Monedas</p>
                    </div>
                  </div>

                  {/* Información adicional */}
                  {activity.bestScore !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold text-text-secondary">
                        Mejor puntuación: <span className="text-text-primary">{activity.bestScore}</span>
                      </span>
                    </div>
                  )}

                  {isLocked && activity.requiredLevel && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Lock className="w-4 h-4" />
                      <span className="font-semibold">
                        Requiere nivel {activity.requiredLevel}
                      </span>
                    </div>
                  )}

                  {/* Botón de acción */}
                  {!isLocked && (
                    <PrimaryButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartActivity(activity);
                      }}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      {activity.completed ? 'Jugar de Nuevo' : 'Comenzar'}
                    </PrimaryButton>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Modal de detalle de actividad */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${area.gradient} flex items-center justify-center shadow-lg`}>
                    <selectedActivity.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-black text-text-primary mb-2">
                      {selectedActivity.name}
                    </h2>
                    <p className="text-text-secondary">{selectedActivity.description}</p>
                  </div>
                </div>

                {/* Detalles */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-text-secondary" />
                      <span className="font-bold text-text-primary">Duración Estimada</span>
                    </div>
                    <p className="text-2xl font-black text-text-primary">{selectedActivity.duration} minutos</p>
                  </div>
                  <div className="bg-background-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-text-secondary" />
                      <span className="font-bold text-text-primary">Dificultad</span>
                    </div>
                    <p className="text-2xl font-black text-text-primary capitalize">{selectedActivity.difficulty}</p>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-bold text-text-primary mb-2">Habilidades que entrena:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedActivity.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-semibold border border-purple-500/30">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recompensas */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/30">
                  <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Recompensas al completar
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-black text-text-primary">+{selectedActivity.xpReward}</p>
                        <p className="text-xs text-text-secondary">Puntos de experiencia</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-orange-500" />
                      <div>
                        <p className="text-2xl font-black text-text-primary">+{selectedActivity.coinReward}</p>
                        <p className="text-xs text-text-secondary">Monedas</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="flex-1 px-6 py-3 rounded-xl bg-background-secondary text-text-primary font-bold hover:bg-background-tertiary transition-colors"
                  >
                    Cerrar
                  </button>
                  <PrimaryButton
                    onClick={() => {
                      onStartActivity(selectedActivity);
                      setSelectedActivity(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    {selectedActivity.completed ? 'Jugar de Nuevo' : 'Comenzar Ahora'}
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GymAreaDetail;

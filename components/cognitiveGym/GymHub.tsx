// components/cognitiveGym/GymHub.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Trophy, Target, Zap, TrendingUp, Calendar, 
  Clock, Award, Star, ChevronRight, Lock, CheckCircle2, Sparkles
} from 'lucide-react';
import { Card } from '../ui';
import { 
  getGymSummary, 
  getGymProfile,
  type GymAreaId,
  GYM_AREAS
} from '../../services/cognitiveGym';
import type { GradeLevel } from '../../services/cognitiveGames';

interface GymHubProps {
  userId: string;
  onSelectArea: (areaId: GymAreaId) => void;
  gradeLevel?: GradeLevel;
}

const GymHub: React.FC<GymHubProps> = ({ userId, onSelectArea, gradeLevel = 'preparatoria' }) => {
  const [summary, setSummary] = useState<ReturnType<typeof getGymSummary> | null>(null);
  const [selectedTab, setSelectedTab] = useState<'areas' | 'challenges' | 'achievements'>('areas');

  useEffect(() => {
    const data = getGymSummary(userId);
    setSummary(data);
  }, [userId]);

  // Texto motivacional según el nivel
  const getLevelMessage = () => {
    switch (gradeLevel) {
      case 'primaria':
        return '¡Entrena tu cerebro con juegos divertidos! 🎮';
      case 'secundaria':
        return 'Desarrolla tus habilidades cognitivas 🧠';
      case 'preparatoria':
        return 'Entrena tu mente para el éxito académico 🎓';
      default:
        return 'Entrena tu cerebro';
    }
  };

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Brain className="w-16 h-16 mx-auto text-purple-500 animate-pulse mb-4" />
          <p className="text-text-secondary">Cargando gimnasio...</p>
        </div>
      </div>
    );
  }

  const { profile, allAreas, completionPercentage, activeChallenges, recentAchievements } = summary;

  return (
    <div className="space-y-6">
      {/* Header del Gimnasio */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600"
      >
        {/* Efectos de fondo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats principales */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Brain className="w-10 h-10 text-white" />
              </motion.div>
              <div className="text-white">
                <h1 className="text-4xl font-black">Gimnasio Cognitivo</h1>
                <p className="text-white/80 font-medium">Nivel {profile.stats.level} • {profile.stats.totalXP.toLocaleString()} XP</p>
                <div className="flex items-center gap-2 mt-2">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <p className="text-sm text-yellow-200 font-semibold">{getLevelMessage()}</p>
                </div>
              </div>
            </div>

            {/* Barra de progreso general */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-white/90 text-sm font-semibold">
                <span>Progreso General</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                />
              </div>
            </div>

            {/* Stats rápidos */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <p className="text-2xl font-black text-white">{profile.stats.achievementsUnlocked}</p>
                </div>
                <p className="text-white/70 text-xs font-semibold">Logros</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Target className="w-5 h-5 text-green-300" />
                  <p className="text-2xl font-black text-white">{activeChallenges}</p>
                </div>
                <p className="text-white/70 text-xs font-semibold">Desafíos Activos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-orange-300" />
                  <p className="text-2xl font-black text-white">{profile.stats.currentStreak}</p>
                </div>
                <p className="text-white/70 text-xs font-semibold">Días de Racha</p>
              </div>
            </div>
          </div>

          {/* Stat card derecha */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
            <div className="text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">Entrenamientos</span>
                </div>
                <span className="text-2xl font-black">{profile.stats.totalWorkouts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Tiempo Total</span>
                </div>
                <span className="text-2xl font-black">{Math.floor(profile.stats.totalTimeMinutes / 60)}h {profile.stats.totalTimeMinutes % 60}m</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">Mejor Racha</span>
                </div>
                <span className="text-2xl font-black">{profile.stats.longestStreak} días</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs de navegación */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: 'areas', label: 'Áreas de Entrenamiento', icon: Brain },
          { id: 'challenges', label: 'Desafíos', icon: Target },
          { id: 'achievements', label: 'Logros', icon: Trophy }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-bold transition-all ${
              selectedTab === tab.id
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de tabs */}
      <AnimatePresence mode="wait">
        {selectedTab === 'areas' && (
          <motion.div
            key="areas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {allAreas.map((area, index) => {
              const Icon = area.icon;
              const progressPercent = Math.round((area.currentXP / area.nextLevelXP) * 100);
              
              return (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
                    onClick={() => onSelectArea(area.id)}
                  >
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    
                    <div className="relative z-10 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${area.gradient} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-text-secondary">Nivel</p>
                          <p className="text-2xl font-black text-text-primary">{area.level}</p>
                        </div>
                      </div>

                      {/* Nombre y descripción */}
                      <div>
                        <h3 className="text-xl font-black text-text-primary mb-1">{area.name}</h3>
                        <p className="text-sm text-text-secondary line-clamp-2">{area.description}</p>
                      </div>

                      {/* Progreso */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                          <span>Progreso</span>
                          <span>{area.currentXP} / {area.nextLevelXP} XP</span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                            className={`h-full bg-gradient-to-r ${area.gradient} rounded-full`}
                          />
                        </div>
                      </div>

                      {/* Actividades completadas */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-text-secondary">
                            {area.activities.filter(a => a.completed).length}/{area.activities.length} Actividades
                          </span>
                        </div>
                        <ChevronRight className={`w-5 h-5 ${area.color} group-hover:translate-x-1 transition-transform`} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {selectedTab === 'challenges' && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {profile.challenges.length === 0 ? (
              <Card className="p-12 text-center">
                <Target className="w-16 h-16 mx-auto text-text-tertiary mb-4" />
                <p className="text-xl font-bold text-text-secondary">No hay desafíos activos</p>
                <p className="text-text-tertiary">Los desafíos se actualizan diariamente</p>
              </Card>
            ) : (
              profile.challenges.map((challenge, index) => {
                const Icon = challenge.icon;
                const progress = Math.round((challenge.current / challenge.target) * 100);
                const area = challenge.areaId ? GYM_AREAS[challenge.areaId] : null;

                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`p-6 ${challenge.completed ? 'opacity-60' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${
                          area 
                            ? `bg-gradient-to-br ${area.gradient}` 
                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                        } flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-black text-text-primary">{challenge.name}</h4>
                                {challenge.completed && (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                              <p className="text-sm text-text-secondary">{challenge.description}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30">
                                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                                  {challenge.type.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Progreso */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                              <span>Progreso</span>
                              <span>{challenge.current} / {challenge.target}</span>
                            </div>
                            <div className="h-2 bg-border rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Recompensas */}
                          <div className="flex items-center gap-4 text-sm font-semibold">
                            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                              <Star className="w-4 h-4" />
                              <span>+{challenge.reward.xp} XP</span>
                            </div>
                            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                              <Trophy className="w-4 h-4" />
                              <span>+{challenge.reward.coins} Monedas</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {selectedTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {profile.achievements.map((achievement, index) => {
              const rarityColors = {
                'común': 'from-gray-500 to-gray-600',
                'raro': 'from-blue-500 to-blue-600',
                'épico': 'from-purple-500 to-pink-600',
                'legendario': 'from-yellow-500 to-orange-600'
              };

              const rarityBorders = {
                'común': 'border-gray-500/30',
                'raro': 'border-blue-500/30',
                'épico': 'border-purple-500/30',
                'legendario': 'border-yellow-500/30'
              };

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`p-6 relative overflow-hidden ${
                      achievement.unlocked ? '' : 'opacity-50'
                    } border ${rarityBorders[achievement.rarity]}`}
                  >
                    {/* Glow effect para desbloqueados */}
                    {achievement.unlocked && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[achievement.rarity]} opacity-5`} />
                    )}

                    <div className="relative z-10 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        {achievement.unlocked ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <Lock className="w-6 h-6 text-text-tertiary" />
                        )}
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-text-primary mb-1">
                          {achievement.name}
                        </h4>
                        <p className="text-xs text-text-secondary mb-2">
                          {achievement.description}
                        </p>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white`}>
                          {achievement.rarity.toUpperCase()}
                        </div>
                      </div>

                      {/* Barra de progreso si no está desbloqueado */}
                      {!achievement.unlocked && achievement.progress !== undefined && achievement.total && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                            <span>Progreso</span>
                            <span>{achievement.progress} / {achievement.total}</span>
                          </div>
                          <div className="h-1.5 bg-border rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${rarityColors[achievement.rarity]} rounded-full`}
                              style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-text-tertiary">
                          Desbloqueado: {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GymHub;

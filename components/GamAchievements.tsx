import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Sparkles, CheckCircle } from 'lucide-react';
import { ACHIEVEMENTS } from '../services/gamification';
import type { GamificationState } from '../types';

interface GamAchievementsProps {
  achievements: GamificationState['achievements'];
}

const GamAchievements: React.FC<GamAchievementsProps> = ({ achievements }) => {
  const allAchievements = Object.values(ACHIEVEMENTS);
  const awardedCount = Object.keys(achievements).length;
  const progressPercentage = (awardedCount / allAchievements.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 via-amber-500/10 to-orange-500/10 border-2 border-yellow-500/30 overflow-hidden"
    >
      {/* Glow de fondo */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 blur-2xl"
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-text-secondary">Logros Desbloqueados</h3>
          </div>
          
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </motion.div>
        </div>

        {/* Progreso general */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-text-primary">Progreso Total</span>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-600">
              {awardedCount}/{allAchievements.length}
            </span>
          </div>
          
          <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-full relative"
            >
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* Lista de logros */}
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {allAchievements.map((ach, index) => {
            const isAwarded = !!achievements[ach.id];
            
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${isAwarded 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50' 
                    : 'bg-surface-2/50 border-border opacity-60'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Icono del logro */}
                  <div className={`
                    relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                    ${isAwarded 
                      ? 'bg-gradient-to-br from-yellow-500 to-amber-600' 
                      : 'bg-surface-2'
                    }
                  `}>
                    {isAwarded ? (
                      <>
                        <motion.div
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0.8, 0.5]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-yellow-500/30 blur-lg rounded-xl"
                        />
                        <span className="relative filter drop-shadow-lg">{ach.icon}</span>
                      </>
                    ) : (
                      <Lock className="w-5 h-5 text-text-secondary/50" />
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`
                        text-sm font-bold
                        ${isAwarded ? 'text-text-primary' : 'text-text-secondary'}
                      `}>
                        {ach.title}
                      </h4>
                      
                      {isAwarded && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.2 }}
                        >
                          <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        </motion.div>
                      )}
                    </div>
                    
                    <p className={`
                      text-xs
                      ${isAwarded ? 'text-text-secondary' : 'text-text-secondary/70'}
                    `}>
                      {ach.description}
                    </p>

                    {/* Badge de categoría si está desbloqueado */}
                    {isAwarded && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-md bg-yellow-500/20 border border-yellow-500/30"
                      >
                        <CheckCircle className="w-3 h-3 text-yellow-600" />
                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                          Desbloqueado
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mensaje motivacional */}
        {progressPercentage === 100 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 rounded-xl bg-gradient-to-r from-yellow-500/30 to-amber-500/30 border-2 border-yellow-500/50 text-center"
          >
            <p className="text-sm font-black text-yellow-600 dark:text-yellow-400">
              🎉 ¡Felicitaciones! Has desbloqueado todos los logros
            </p>
          </motion.div>
        ) : progressPercentage >= 50 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-center"
          >
            <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
              💪 ¡Vas por buen camino! Sigue desbloqueando logros
            </p>
          </motion.div>
        ) : null}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--surface-2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #eab308, #f59e0b);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ca8a04, #d97706);
        }
      `}</style>
    </motion.div>
  );
};

export default GamAchievements;
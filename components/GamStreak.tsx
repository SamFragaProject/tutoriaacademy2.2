import React from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Calendar } from 'lucide-react';

interface GamStreakProps {
  streak: number;
}

const GamStreak: React.FC<GamStreakProps> = ({ streak }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 border-2 border-orange-500/30 overflow-hidden group"
    >
      {/* Glow animado de fondo */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 blur-2xl"
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-text-secondary">Racha de Estudio</h3>
          </div>
          
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </motion.div>
        </div>

        {/* Contenido principal */}
        <div className="flex items-center gap-6">
          {/* Emoji de fuego con animación */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [-5, 5, -5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <motion.div
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.3, 1]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full"
            />
            <span className="relative text-6xl filter drop-shadow-lg" role="img" aria-label="Fuego">
              🔥
            </span>
          </motion.div>

          {/* Números y texto */}
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
              >
                {streak}
              </motion.span>
              <span className="text-xl font-semibold text-text-secondary">días</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="font-semibold">¡Sigue así!</span>
            </div>
          </div>
        </div>

        {/* Barra de progreso hacia siguiente hito */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
            <span className="font-semibold">Próximo hito: {Math.ceil(streak / 5) * 5} días</span>
            <span className="font-bold">{streak % 5}/5</span>
          </div>
          <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(streak % 5) * 20}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full relative"
            >
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* Mensaje motivacional */}
        {streak >= 7 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-4 p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
          >
            <p className="text-xs font-bold text-center text-orange-600 dark:text-orange-400">
              {streak >= 30 
                ? '🏆 ¡Increíble! Eres una leyenda del estudio' 
                : streak >= 14
                ? '🌟 ¡Extraordinario! Tu disciplina es admirable'
                : '💪 ¡Excelente! Vas por buen camino'
              }
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GamStreak;

import React from 'react';
import { Star, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface GamXPBadgeProps {
  level: number;
  levelXP: number;
  xpToNext: number;
}

const GamXPBadge: React.FC<GamXPBadgeProps> = ({ level, levelXP, xpToNext }) => {
  const percentage = (levelXP / xpToNext) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 via-amber-500/10 to-orange-500/10 border-2 border-yellow-500/30 hover:border-yellow-500/60 backdrop-blur-sm overflow-hidden group transition-all duration-300"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl"
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">Experiencia</h3>
          </div>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg">
              <Star size={24} className="text-white fill-current" />
            </div>
            <div>
              <span className="text-3xl font-black text-text-primary block">Nivel {level}</span>
              <span className="text-xs text-text-secondary font-medium">Seguí así! 🔥</span>
            </div>
          </motion.div>
          <div className="text-right">
            <span className="text-lg font-bold text-yellow-400 block">{levelXP}</span>
            <span className="text-xs text-text-secondary font-medium">/ {xpToNext} XP</span>
          </div>
        </div>
        
        <div className="relative h-3 bg-surface-2 rounded-full overflow-hidden border border-border">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-full relative overflow-hidden"
          >
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-text-secondary font-medium">Progreso al siguiente nivel</span>
          <motion.span 
            key={percentage}
            initial={{ scale: 1.2, color: '#facc15' }}
            animate={{ scale: 1, color: '#9ca3af' }}
            className="font-black"
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default GamXPBadge;

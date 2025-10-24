import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Eye, TrendingUp } from 'lucide-react';
import { Card } from '../ui';

interface CognitiveSkill {
  name: string;
  value: number;
  maxValue: number;
  icon: React.ElementType;
  color: string;
  gradient: string;
  trend: number; // percentage change
}

interface CognitiveMetricsCardProps {
  skills?: CognitiveSkill[];
}

const defaultSkills: CognitiveSkill[] = [
  {
    name: 'Memoria de Trabajo',
    value: 7,
    maxValue: 10,
    icon: Brain,
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-pink-500',
    trend: 15
  },
  {
    name: 'Atención Sostenida',
    value: 8,
    maxValue: 10,
    icon: Eye,
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    trend: 22
  },
  {
    name: 'Velocidad de Procesamiento',
    value: 6,
    maxValue: 10,
    icon: Zap,
    color: 'text-yellow-500',
    gradient: 'from-yellow-500 to-orange-500',
    trend: 8
  }
];

const CognitiveMetricsCard: React.FC<CognitiveMetricsCardProps> = ({ 
  skills = defaultSkills 
}) => {
  return (
    <Card className="p-6 border-2 border-border/50 bg-gradient-to-br from-purple-500/5 to-pink-500/5 relative overflow-hidden">
      {/* Glow animado */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-2xl"
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg"
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-black text-text-primary">Gimnasio Cognitivo</h3>
              <p className="text-sm text-text-secondary font-semibold">Habilidades mentales</p>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
          >
            <span className="text-xs font-bold text-green-600 dark:text-green-400">
              En Progreso
            </span>
          </motion.div>
        </div>

        {/* Skills Grid */}
        <div className="space-y-5">
          {skills.map((skill, index) => {
            const percentage = (skill.value / skill.maxValue) * 100;
            const Icon = skill.icon;

            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                {/* Skill Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${skill.gradient} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-text-primary">{skill.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Trend indicator */}
                    {skill.trend > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/20"
                      >
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs font-bold text-green-600 dark:text-green-400">
                          +{skill.trend}%
                        </span>
                      </motion.div>
                    )}
                    
                    {/* Value */}
                    <span className={`text-sm font-black ${skill.color}`}>
                      {skill.value}/{skill.maxValue}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-surface-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${skill.gradient} rounded-full relative`}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>

                  {/* Milestone markers */}
                  {[0.25, 0.5, 0.75].map((milestone, i) => (
                    <div
                      key={i}
                      className="absolute top-0 h-full w-0.5 bg-border"
                      style={{ left: `${milestone * 100}%` }}
                    />
                  ))}
                </div>

                {/* Level labels */}
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-text-secondary/70">Nivel {Math.floor(skill.value / 2.5)}</span>
                  <span className="text-xs text-text-secondary/70">Próximo: {Math.ceil(skill.value / 2.5) * 2.5}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-border"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-text-primary mb-1">
                {skills.reduce((acc, s) => acc + s.value, 0)}
              </div>
              <div className="text-xs text-text-secondary font-semibold">Puntos Totales</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-1">
                {Math.round(skills.reduce((acc, s) => acc + s.trend, 0) / skills.length)}%
              </div>
              <div className="text-xs text-text-secondary font-semibold">Mejora Promedio</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-black text-text-primary mb-1">
                {skills.filter(s => s.value >= s.maxValue * 0.7).length}/{skills.length}
              </div>
              <div className="text-xs text-text-secondary font-semibold">Avanzadas</div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Brain className="w-5 h-5" />
          Entrenar Ahora
        </motion.button>
      </div>
    </Card>
  );
};

export default CognitiveMetricsCard;

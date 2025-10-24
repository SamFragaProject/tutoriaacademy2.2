import React from 'react';
import { NavLink } from 'react-router-dom';
import { Award, AlertTriangle, TrendingUp, Sparkles, CheckCircle, Target, Rocket } from 'lucide-react';
import { PrimaryButton, SecondaryButton, Card } from './ui';
import { motion } from 'framer-motion';

interface ResultCardProps {
  score: number;
  weakTopics: string[];
  onRestart: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ score, weakTopics, onRestart }) => {
  const getScoreConfig = () => {
    if (score >= 80) return {
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: '🎉',
      message: '¡Excelente desempeño!',
      emoji: '🌟'
    };
    if (score >= 60) return {
      gradient: 'from-yellow-500 to-amber-600',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: '👍',
      message: '¡Buen trabajo!',
      emoji: '⭐'
    };
    return {
      gradient: 'from-orange-500 to-red-600',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      icon: '💪',
      message: '¡Vamos a mejorar!',
      emoji: '🎯'
    };
  };

  const config = getScoreConfig();

  return (
    <div className="max-w-3xl mx-auto space-y-6" aria-live="polite">
      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`relative overflow-hidden text-center border-2 ${config.border}`} gradient={`${config.gradient.replace('from-', 'from-').replace(' to-', '/5 to-')}/5`}>
          {/* Animated background elements */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${config.gradient} opacity-10 rounded-full blur-3xl`}
          />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-2xl mx-auto`}>
                <Award className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-black text-text-primary mb-2"
            >
              Resultados del Diagnóstico {config.icon}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`text-lg font-bold ${config.text} mb-6`}
            >
              {config.message}
            </motion.p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="mb-6"
            >
              <span className={`text-7xl font-black ${config.text} block mb-2`}>
                {score}%
              </span>
              <span className="text-text-secondary font-semibold text-lg">Precisión General</span>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-4 max-w-md mx-auto"
            >
              <div className="p-4 bg-surface-2/50 rounded-xl backdrop-blur-sm">
                <TrendingUp className={`w-6 h-6 ${config.text} mx-auto mb-2`} />
                <p className="text-sm text-text-secondary font-medium">Nivel</p>
                <p className="text-xl font-black text-text-primary">
                  {score >= 80 ? 'Alto' : score >= 60 ? 'Medio' : 'Inicial'}
                </p>
              </div>
              <div className="p-4 bg-surface-2/50 rounded-xl backdrop-blur-sm">
                <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-text-secondary font-medium">Áreas</p>
                <p className="text-xl font-black text-text-primary">{weakTopics.length || 0}</p>
              </div>
              <div className="p-4 bg-surface-2/50 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm text-text-secondary font-medium">Plan</p>
                <p className="text-xl font-black text-text-primary">Listo</p>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Weak Topics Card */}
      {weakTopics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-2 border-orange-500/30" gradient="from-orange-500/5 to-red-500/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-text-primary">Áreas a Reforzar</h3>
                <p className="text-sm text-text-secondary">Tu plan se enfocará en estos temas</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {weakTopics.map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-surface-2/50 backdrop-blur-sm rounded-xl border border-border hover:border-orange-500/50 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-orange-500/30">
                    <span className="text-orange-400 font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-text-primary font-medium group-hover:text-orange-400 transition-colors">
                    {topic}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Info and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Card className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-2 border-primary/30">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-primary/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-black text-text-primary mb-2">¿Qué sigue?</h4>
              <p className="text-text-secondary leading-relaxed">
                Hemos guardado tus resultados y generado un <span className="text-primary font-bold">plan de estudio personalizado</span>. 
                El sistema se enfocará en estas áreas para maximizar tu progreso y preparación.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <SecondaryButton onClick={onRestart} className="flex-1 sm:flex-initial">
              Repetir Diagnóstico
            </SecondaryButton>
            <PrimaryButton className="flex-1 sm:flex-initial" icon={Rocket}>
              <NavLink to="/app/generating-plan">Continuar a mi plan</NavLink>
            </PrimaryButton>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResultCard;
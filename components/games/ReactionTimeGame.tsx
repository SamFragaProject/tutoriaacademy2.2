// components/games/ReactionTimeGame.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, RotateCcw, TrendingUp, Award, Timer, Target } from 'lucide-react';
import { PrimaryButton, SecondaryButton, Card } from '../ui';
import type { GradeLevel } from '../../services/cognitiveGames';

interface ReactionTimeGameProps {
  onGameEnd: (result: GameResult) => void;
  gradeLevel: GradeLevel;
}

interface GameResult {
  gameId: string;
  score: number;
  metrics: {
    avgReactionTime: number;
    bestReactionTime: number;
    consistency: number;
    totalTrials: number;
    validTrials: number;
  };
}

type GamePhase = 'intro' | 'ready' | 'waiting' | 'go' | 'result' | 'summary';

// Configuración por nivel educativo
const LEVEL_CONFIG = {
  primaria: {
    totalTrials: 8,
    minDelay: 2000,
    maxDelay: 5000,
    targetScore: 400,
  },
  secundaria: {
    totalTrials: 10,
    minDelay: 1500,
    maxDelay: 4000,
    targetScore: 350,
  },
  preparatoria: {
    totalTrials: 12,
    minDelay: 1000,
    maxDelay: 3000,
    targetScore: 300,
  },
};

const ReactionTimeGame: React.FC<ReactionTimeGameProps> = ({ onGameEnd, gradeLevel }) => {
  const config = LEVEL_CONFIG[gradeLevel];
  
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [trial, setTrial] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentReactionTime, setCurrentReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [tooEarly, setTooEarly] = useState(false);
  const [score, setScore] = useState(0);

  const waitingTimeoutRef = useRef<NodeJS.Timeout>();
  const gameStartedRef = useRef(false);

  // Iniciar nuevo trial
  const startTrial = useCallback(() => {
    if (trial >= config.totalTrials) {
      setPhase('summary');
      return;
    }

    setTooEarly(false);
    setCurrentReactionTime(null);
    setPhase('ready');

    // Después de 1 segundo, entrar en fase de espera
    setTimeout(() => {
      setPhase('waiting');
      
      // Esperar un tiempo aleatorio antes de mostrar el estímulo
      const delay = config.minDelay + Math.random() * (config.maxDelay - config.minDelay);
      
      waitingTimeoutRef.current = setTimeout(() => {
        setStartTime(Date.now());
        setPhase('go');
        gameStartedRef.current = true;
      }, delay);
    }, 1000);
  }, [trial, config]);

  // Manejar clic del usuario
  const handleClick = useCallback(() => {
    // Si está en fase waiting, clic temprano
    if (phase === 'waiting') {
      if (waitingTimeoutRef.current) {
        clearTimeout(waitingTimeoutRef.current);
      }
      setTooEarly(true);
      setPhase('result');
      setTimeout(() => {
        setTrial(trial + 1);
        startTrial();
      }, 2000);
      return;
    }

    // Si está en fase go, medir tiempo de reacción
    if (phase === 'go' && gameStartedRef.current) {
      const reactionTime = Date.now() - startTime;
      setCurrentReactionTime(reactionTime);
      setReactionTimes([...reactionTimes, reactionTime]);
      
      // Calcular puntos (menor tiempo = más puntos)
      const points = Math.max(0, 1000 - reactionTime);
      setScore(score + points);
      
      gameStartedRef.current = false;
      setPhase('result');
      
      setTimeout(() => {
        setTrial(trial + 1);
        startTrial();
      }, 2000);
    }
  }, [phase, startTime, trial, reactionTimes, score, startTrial]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (waitingTimeoutRef.current) {
        clearTimeout(waitingTimeoutRef.current);
      }
    };
  }, []);

  // Terminar juego
  const endGame = useCallback(() => {
    const validTimes = reactionTimes.filter(t => t > 0);
    const avgReactionTime = validTimes.length > 0
      ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length
      : 0;
    const bestReactionTime = validTimes.length > 0 ? Math.min(...validTimes) : 0;
    
    // Calcular consistencia (menor desviación estándar = mayor consistencia)
    let consistency = 100;
    if (validTimes.length > 1) {
      const mean = avgReactionTime;
      const variance = validTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / validTimes.length;
      const stdDev = Math.sqrt(variance);
      consistency = Math.max(0, 100 - (stdDev / mean) * 100);
    }

    const result: GameResult = {
      gameId: 'reaction-time',
      score,
      metrics: {
        avgReactionTime: Math.round(avgReactionTime),
        bestReactionTime: Math.round(bestReactionTime),
        consistency: Math.round(consistency),
        totalTrials: config.totalTrials,
        validTrials: validTimes.length,
      },
    };

    onGameEnd(result);
  }, [score, reactionTimes, config.totalTrials, onGameEnd]);

  // Renderizar intro
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8">
            <div className="text-center space-y-6">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <Zap className="w-20 h-20 text-yellow-600" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-black text-text-primary mb-2">Reaction Time</h1>
                <p className="text-lg text-text-secondary">Prueba tu velocidad de reacción</p>
              </div>

              <div className="bg-surface-2 rounded-xl p-6 space-y-4 text-left">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <Target className="w-5 h-5 text-yellow-500" />
                  ¿Cómo jugar?
                </h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">1.</span>
                    <span>Espera a que la pantalla cambie de color (de rojo a verde)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">2.</span>
                    <span>Cuando veas el color verde, haz clic lo más rápido posible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">3.</span>
                    <span>⚠️ ¡No hagas clic antes de tiempo! Espera el color verde</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">4.</span>
                    <span>Completa {config.totalTrials} intentos y obtén tu tiempo promedio</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-yellow-500/10 rounded-lg p-3">
                  <p className="text-2xl font-black text-yellow-600">{config.totalTrials}</p>
                  <p className="text-xs text-text-secondary font-semibold">Intentos</p>
                </div>
                <div className="bg-orange-500/10 rounded-lg p-3">
                  <p className="text-2xl font-black text-orange-600">&lt;{config.targetScore}ms</p>
                  <p className="text-xs text-text-secondary font-semibold">Meta</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3">
                  <p className="text-2xl font-black text-green-600 capitalize">{gradeLevel}</p>
                  <p className="text-xs text-text-secondary font-semibold">Nivel</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-4">
                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-semibold">
                  💡 Consejo: Mantén tu dedo sobre el ratón y concéntrate en la pantalla
                </p>
              </div>

              <PrimaryButton onClick={startTrial} className="w-full">
                <Play className="w-5 h-5 mr-2" />
                Comenzar
              </PrimaryButton>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Renderizar fase ready
  if (phase === 'ready') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-blue-500 cursor-wait"
        onClick={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white space-y-4"
        >
          <Timer className="w-16 h-16 mx-auto" />
          <h2 className="text-3xl font-black">Prepárate...</h2>
          <p className="text-xl opacity-80">Espera el color verde</p>
          <p className="text-sm opacity-60">Intento {trial + 1} de {config.totalTrials}</p>
        </motion.div>
      </div>
    );
  }

  // Renderizar fase waiting (esperando momento aleatorio)
  if (phase === 'waiting') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-red-600 cursor-not-allowed"
        onClick={handleClick}
      >
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center text-white space-y-4"
        >
          <div className="w-20 h-20 rounded-full border-4 border-white mx-auto animate-pulse" />
          <h2 className="text-3xl font-black">Espera...</h2>
          <p className="text-xl opacity-80">No hagas clic todavía</p>
          <p className="text-sm opacity-60">Intento {trial + 1} de {config.totalTrials}</p>
        </motion.div>
      </div>
    );
  }

  // Renderizar fase go (momento de hacer clic)
  if (phase === 'go') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-green-500 cursor-pointer"
        onClick={handleClick}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-center text-white space-y-4"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Zap className="w-24 h-24 mx-auto" />
          </motion.div>
          <h2 className="text-5xl font-black">¡AHORA!</h2>
          <p className="text-2xl opacity-80">Haz clic lo más rápido posible</p>
        </motion.div>
      </div>
    );
  }

  // Renderizar resultado del intento
  if (phase === 'result') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <AnimatePresence mode="wait">
          {tooEarly ? (
            <motion.div
              key="too-early"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center mx-auto">
                  <span className="text-5xl">⚠️</span>
                </div>
              </motion.div>
              <div>
                <h3 className="text-3xl font-black text-red-600">¡Muy temprano!</h3>
                <p className="text-text-secondary mt-2">Espera a que aparezca el color verde</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto">
                  <Zap className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              <div>
                <h3 className="text-5xl font-black text-yellow-600">{currentReactionTime}ms</h3>
                <p className="text-text-secondary mt-2">Tiempo de reacción</p>
                {currentReactionTime && currentReactionTime < config.targetScore && (
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-600 font-bold mt-2"
                  >
                    ✨ ¡Excelente velocidad!
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Renderizar resumen final
  if (phase === 'summary') {
    const validTimes = reactionTimes.filter(t => t > 0);
    const avgReactionTime = validTimes.length > 0
      ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length
      : 0;
    const bestReactionTime = validTimes.length > 0 ? Math.min(...validTimes) : 0;
    const consistency = validTimes.length > 1
      ? 100 - (Math.sqrt(validTimes.reduce((sum, t) => sum + Math.pow(t - avgReactionTime, 2), 0) / validTimes.length) / avgReactionTime * 100)
      : 100;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8">
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <div>
                <h2 className="text-3xl font-black text-text-primary mb-2">¡Juego Completado!</h2>
                <p className="text-text-secondary">Resultados de tu velocidad de reacción</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-yellow-600">{Math.round(avgReactionTime)}ms</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Tiempo Promedio</p>
                </div>
                <div className="bg-orange-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-orange-600">{Math.round(bestReactionTime)}ms</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Mejor Tiempo</p>
                </div>
                <div className="bg-green-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-green-600">{Math.round(consistency)}%</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Consistencia</p>
                </div>
                <div className="bg-blue-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-blue-600">{score}</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Puntos</p>
                </div>
              </div>

              <div className="bg-surface-2 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-text-primary text-sm">Todos tus tiempos:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {reactionTimes.map((time, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        time === bestReactionTime
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-text-secondary'
                      }`}
                    >
                      {time}ms
                    </span>
                  ))}
                </div>
              </div>

              {avgReactionTime < config.targetScore && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4"
                >
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold">¡Meta alcanzada!</p>
                  <p className="text-sm opacity-90">Lograste un tiempo promedio menor a {config.targetScore}ms</p>
                </motion.div>
              )}

              <div className="flex gap-3">
                <SecondaryButton onClick={() => {
                  setPhase('intro');
                  setTrial(0);
                  setReactionTimes([]);
                  setScore(0);
                }} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reintentar
                </SecondaryButton>
                <PrimaryButton onClick={endGame} className="flex-1">
                  Finalizar
                </PrimaryButton>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default ReactionTimeGame;

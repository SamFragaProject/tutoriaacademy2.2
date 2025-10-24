// components/games/StroopEffectGame.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Play, RotateCcw, TrendingUp, Award, Zap, Timer } from 'lucide-react';
import { PrimaryButton, SecondaryButton, Card } from '../ui';
import type { GradeLevel } from '../../services/cognitiveGames';

interface StroopEffectGameProps {
  onGameEnd: (result: GameResult) => void;
  gradeLevel: GradeLevel;
}

interface GameResult {
  gameId: string;
  score: number;
  metrics: {
    accuracy: number;
    avgResponseTime: number;
    congruentAccuracy: number;
    incongruentAccuracy: number;
    totalQuestions: number;
    correctAnswers: number;
  };
}

type GamePhase = 'intro' | 'countdown' | 'playing' | 'result';

interface StroopStimulus {
  word: string;
  color: string;
  isCongruent: boolean;
}

const COLORS = [
  { name: 'rojo', value: 'text-red-600', bg: 'bg-red-500' },
  { name: 'azul', value: 'text-blue-600', bg: 'bg-blue-500' },
  { name: 'verde', value: 'text-green-600', bg: 'bg-green-500' },
  { name: 'amarillo', value: 'text-yellow-600', bg: 'bg-yellow-500' },
  { name: 'morado', value: 'text-purple-600', bg: 'bg-purple-500' },
  { name: 'naranja', value: 'text-orange-600', bg: 'bg-orange-500' },
];

// Configuración por nivel educativo
const LEVEL_CONFIG = {
  primaria: {
    totalQuestions: 12,
    timeLimit: 60000, // 60 segundos
    incongruentRatio: 0.5, // 50% incongruentes
    colorCount: 4, // Solo usar 4 colores
  },
  secundaria: {
    totalQuestions: 15,
    timeLimit: 45000, // 45 segundos
    incongruentRatio: 0.6, // 60% incongruentes
    colorCount: 5,
  },
  preparatoria: {
    totalQuestions: 20,
    timeLimit: 40000, // 40 segundos
    incongruentRatio: 0.7, // 70% incongruentes
    colorCount: 6,
  },
};

const StroopEffectGame: React.FC<StroopEffectGameProps> = ({ onGameEnd, gradeLevel }) => {
  const config = LEVEL_CONFIG[gradeLevel];
  const availableColors = COLORS.slice(0, config.colorCount);
  
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [stimulus, setStimulus] = useState<StroopStimulus | null>(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [congruentCorrect, setCongruentCorrect] = useState(0);
  const [congruentTotal, setCongruentTotal] = useState(0);
  const [incongruentCorrect, setIncongruentCorrect] = useState(0);
  const [incongruentTotal, setIncongruentTotal] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(config.timeLimit);
  const [countdown, setCountdown] = useState(3);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Generar estímulo Stroop
  const generateStimulus = useCallback((): StroopStimulus => {
    const isCongruent = Math.random() > config.incongruentRatio;
    
    const wordColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    
    let displayColor;
    if (isCongruent) {
      displayColor = wordColor;
    } else {
      // Asegurar que el color de display sea diferente al de la palabra
      const otherColors = availableColors.filter(c => c.name !== wordColor.name);
      displayColor = otherColors[Math.floor(Math.random() * otherColors.length)];
    }
    
    return {
      word: wordColor.name,
      color: displayColor.value,
      isCongruent,
    };
  }, [availableColors, config.incongruentRatio]);

  // Iniciar nueva pregunta
  const startNewQuestion = useCallback(() => {
    if (currentQuestion >= config.totalQuestions) {
      setPhase('result');
      return;
    }

    const newStimulus = generateStimulus();
    setStimulus(newStimulus);
    setQuestionStartTime(Date.now());
    setFeedback(null);

    if (newStimulus.isCongruent) {
      setCongruentTotal(congruentTotal + 1);
    } else {
      setIncongruentTotal(incongruentTotal + 1);
    }
  }, [currentQuestion, config.totalQuestions, generateStimulus, congruentTotal, incongruentTotal]);

  // Countdown inicial
  useEffect(() => {
    if (phase === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('playing');
        startNewQuestion();
      }
    }
  }, [phase, countdown, startNewQuestion]);

  // Timer del juego
  useEffect(() => {
    if (phase === 'playing' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 0) {
            setPhase('result');
            return 0;
          }
          return time - 100;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [phase, timeRemaining]);

  // Manejar respuesta del usuario
  const handleAnswer = useCallback((selectedColor: string) => {
    if (!stimulus || feedback !== null) return;

    const responseTime = Date.now() - questionStartTime;
    setResponseTimes([...responseTimes, responseTime]);

    // Obtener el color real (no la palabra)
    const correctColorName = availableColors.find(c => c.value === stimulus.color)?.name;
    const isCorrect = selectedColor === correctColorName;

    if (isCorrect) {
      const points = Math.max(50, 200 - Math.floor(responseTime / 50));
      setScore(score + points);
      setCorrectAnswers(correctAnswers + 1);
      
      if (stimulus.isCongruent) {
        setCongruentCorrect(congruentCorrect + 1);
      } else {
        setIncongruentCorrect(incongruentCorrect + 1);
      }
    }

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      setCurrentQuestion(currentQuestion + 1);
      startNewQuestion();
    }, 800);
  }, [
    stimulus,
    questionStartTime,
    responseTimes,
    score,
    correctAnswers,
    congruentCorrect,
    incongruentCorrect,
    currentQuestion,
    availableColors,
    startNewQuestion,
    feedback,
  ]);

  // Iniciar juego
  const startGame = () => {
    setPhase('countdown');
    setCountdown(3);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setCongruentCorrect(0);
    setCongruentTotal(0);
    setIncongruentCorrect(0);
    setIncongruentTotal(0);
    setResponseTimes([]);
    setTimeRemaining(config.timeLimit);
  };

  // Terminar juego
  const endGame = useCallback(() => {
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    const accuracy = config.totalQuestions > 0 
      ? (correctAnswers / Math.min(currentQuestion, config.totalQuestions)) * 100 
      : 0;
    
    const congruentAcc = congruentTotal > 0 ? (congruentCorrect / congruentTotal) * 100 : 0;
    const incongruentAcc = incongruentTotal > 0 ? (incongruentCorrect / incongruentTotal) * 100 : 0;

    const result: GameResult = {
      gameId: 'stroop-effect',
      score,
      metrics: {
        accuracy,
        avgResponseTime: Math.round(avgResponseTime),
        congruentAccuracy: Math.round(congruentAcc),
        incongruentAccuracy: Math.round(incongruentAcc),
        totalQuestions: Math.min(currentQuestion, config.totalQuestions),
        correctAnswers,
      },
    };

    onGameEnd(result);
  }, [
    score,
    correctAnswers,
    currentQuestion,
    congruentCorrect,
    congruentTotal,
    incongruentCorrect,
    incongruentTotal,
    responseTimes,
    config.totalQuestions,
    onGameEnd,
  ]);

  // Renderizar intro
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8">
            <div className="text-center space-y-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <Brain className="w-20 h-20 text-pink-600" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-black text-text-primary mb-2">Stroop Effect</h1>
                <p className="text-lg text-text-secondary">Desafía tu control atencional</p>
              </div>

              <div className="bg-surface-2 rounded-xl p-6 space-y-4 text-left">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <Zap className="w-5 h-5 text-pink-500" />
                  ¿Cómo jugar?
                </h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 font-bold">1.</span>
                    <span>Verás una palabra de color escrita en un color diferente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 font-bold">2.</span>
                    <span>⚠️ <strong>Ignora la palabra</strong> y selecciona el COLOR en que está escrita</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 font-bold">3.</span>
                    <span>Ejemplo: Si ves <span className="text-blue-600 font-bold">"ROJO"</span> en azul, selecciona AZUL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 font-bold">4.</span>
                    <span>¡Responde lo más rápido posible antes de que acabe el tiempo!</span>
                  </li>
                </ul>
              </div>

              {/* Ejemplo visual */}
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-2 border-pink-500/30 rounded-xl p-6">
                <p className="text-sm text-text-secondary mb-3">Ejemplo de estímulo incongruente:</p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3">
                  <p className="text-5xl font-black text-green-600">ROJO</p>
                </div>
                <p className="text-sm text-pink-600 font-bold">
                  ✓ Respuesta correcta: VERDE (el color de la palabra, no lo que dice)
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-pink-500/10 rounded-lg p-3">
                  <p className="text-2xl font-black text-pink-600">{config.totalQuestions}</p>
                  <p className="text-xs text-text-secondary font-semibold">Preguntas</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-3">
                  <p className="text-2xl font-black text-purple-600">{config.timeLimit / 1000}s</p>
                  <p className="text-xs text-text-secondary font-semibold">Tiempo Límite</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-2xl font-black text-blue-600 capitalize">{gradeLevel}</p>
                  <p className="text-xs text-text-secondary font-semibold">Nivel</p>
                </div>
              </div>

              <PrimaryButton onClick={startGame} className="w-full">
                <Play className="w-5 h-5 mr-2" />
                Comenzar
              </PrimaryButton>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Renderizar countdown
  if (phase === 'countdown') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="text-center"
        >
          <p className="text-8xl font-black text-pink-600">{countdown}</p>
          <p className="text-xl text-text-secondary mt-4">Prepárate...</p>
          <p className="text-sm text-text-tertiary mt-2">Recuerda: selecciona el COLOR, no la palabra</p>
        </motion.div>
      </div>
    );
  }

  // Renderizar juego
  if (phase === 'playing' && stimulus) {
    const progress = (currentQuestion / config.totalQuestions) * 100;
    const timeProgress = (timeRemaining / config.timeLimit) * 100;

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        {/* Header con progreso y timer */}
        <div className="bg-white dark:bg-gray-800 shadow-sm p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Progreso de preguntas */}
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-text-secondary">
                Pregunta {currentQuestion + 1} de {config.totalQuestions}
              </span>
              <span className="font-bold text-text-primary">
                {score} puntos
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-600 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            {/* Timer */}
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-text-tertiary" />
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full transition-colors ${
                    timeProgress > 50 ? 'bg-green-500' : timeProgress > 25 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${timeProgress}%` }}
                />
              </div>
              <span className={`text-sm font-bold ${
                timeProgress < 25 ? 'text-red-600' : 'text-text-secondary'
              }`}>
                {Math.ceil(timeRemaining / 1000)}s
              </span>
            </div>
          </div>
        </div>

        {/* Área de estímulo */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-8 max-w-2xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="space-y-6"
              >
                {/* Estímulo Stroop */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl">
                  <motion.p
                    animate={feedback === 'incorrect' ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`text-7xl font-black uppercase ${stimulus.color}`}
                  >
                    {stimulus.word}
                  </motion.p>
                </div>

                {/* Feedback visual */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`inline-block px-4 py-2 rounded-full font-bold ${
                        feedback === 'correct'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {feedback === 'correct' ? '✓ Correcto' : '✗ Incorrecto'}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botones de colores */}
                {feedback === null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-3"
                  >
                    {availableColors.map((color) => (
                      <motion.button
                        key={color.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswer(color.name)}
                        className={`${color.bg} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow capitalize`}
                      >
                        {color.name}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar resultado
  if (phase === 'result') {
    const accuracy = config.totalQuestions > 0 
      ? (correctAnswers / Math.min(currentQuestion, config.totalQuestions)) * 100 
      : 0;
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
    const congruentAcc = congruentTotal > 0 ? (congruentCorrect / congruentTotal) * 100 : 0;
    const incongruentAcc = incongruentTotal > 0 ? (incongruentCorrect / incongruentTotal) * 100 : 0;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
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
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <div>
                <h2 className="text-3xl font-black text-text-primary mb-2">¡Juego Completado!</h2>
                <p className="text-text-secondary">Resultados del efecto Stroop</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pink-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-pink-600">{score}</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Puntos Totales</p>
                </div>
                <div className="bg-purple-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-purple-600">{accuracy.toFixed(0)}%</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Precisión</p>
                </div>
                <div className="bg-blue-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-blue-600">{(avgResponseTime / 1000).toFixed(2)}s</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Tiempo Promedio</p>
                </div>
                <div className="bg-green-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-green-600">{correctAnswers}/{currentQuestion}</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Correctas</p>
                </div>
              </div>

              {/* Análisis por tipo de estímulo */}
              <div className="bg-surface-2 rounded-xl p-6 space-y-3">
                <h4 className="font-bold text-text-primary text-sm">Análisis por tipo:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-text-tertiary mb-1">Congruentes</p>
                    <p className="text-2xl font-black text-green-600">{congruentAcc.toFixed(0)}%</p>
                    <p className="text-xs text-text-tertiary">{congruentCorrect}/{congruentTotal}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary mb-1">Incongruentes</p>
                    <p className="text-2xl font-black text-orange-600">{incongruentAcc.toFixed(0)}%</p>
                    <p className="text-xs text-text-tertiary">{incongruentCorrect}/{incongruentTotal}</p>
                  </div>
                </div>
              </div>

              {accuracy >= 80 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl p-4"
                >
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold">¡Excelente control atencional!</p>
                  <p className="text-sm opacity-90">Lograste una precisión superior al 80%</p>
                </motion.div>
              )}

              <div className="flex gap-3">
                <SecondaryButton onClick={startGame} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Jugar de nuevo
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

export default StroopEffectGame;

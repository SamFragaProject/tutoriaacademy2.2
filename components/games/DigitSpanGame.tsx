// components/games/DigitSpanGame.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Play, RotateCcw, Volume2, TrendingUp, Award, Zap } from 'lucide-react';
import { PrimaryButton, SecondaryButton, Card } from '../ui';
import type { GradeLevel } from '../../services/cognitiveGames';

interface DigitSpanGameProps {
  onGameEnd: (result: GameResult) => void;
  gradeLevel: GradeLevel;
}

interface GameResult {
  gameId: string;
  score: number;
  metrics: {
    longestSequence: number;
    accuracy: number;
    avgResponseTime: number;
    correctSequences: number;
    totalSequences: number;
  };
}

type GamePhase = 'intro' | 'countdown' | 'show' | 'input' | 'feedback' | 'result';

// Configuración por nivel educativo
const LEVEL_CONFIG = {
  primaria: {
    startLength: 3,
    maxLength: 6,
    showDuration: 1000, // ms por dígito
    sequenceCount: 8,
  },
  secundaria: {
    startLength: 4,
    maxLength: 8,
    showDuration: 800,
    sequenceCount: 10,
  },
  preparatoria: {
    startLength: 5,
    maxLength: 10,
    showDuration: 600,
    sequenceCount: 12,
  },
};

const DigitSpanGame: React.FC<DigitSpanGameProps> = ({ onGameEnd, gradeLevel }) => {
  const config = LEVEL_CONFIG[gradeLevel];
  
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentSequence, setCurrentSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [currentLength, setCurrentLength] = useState(config.startLength);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [longestSequence, setLongestSequence] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [roundStartTime, setRoundStartTime] = useState<number>(0);
  const [countdown, setCountdown] = useState(3);

  // Generar secuencia aleatoria de dígitos
  const generateSequence = useCallback((length: number): number[] => {
    const sequence: number[] = [];
    for (let i = 0; i < length; i++) {
      sequence.push(Math.floor(Math.random() * 10));
    }
    return sequence;
  }, []);

  // Iniciar nuevo round
  const startNewRound = useCallback(() => {
    if (round >= config.sequenceCount) {
      // Juego terminado
      setPhase('result');
      return;
    }

    const sequence = generateSequence(currentLength);
    setCurrentSequence(sequence);
    setUserInput('');
    setCurrentDigitIndex(0);
    setPhase('countdown');
    setCountdown(3);
  }, [round, currentLength, config.sequenceCount, generateSequence]);

  // Countdown antes de mostrar secuencia
  useEffect(() => {
    if (phase === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('show');
      }
    }
  }, [phase, countdown]);

  // Mostrar secuencia dígito por dígito
  useEffect(() => {
    if (phase === 'show') {
      if (currentDigitIndex < currentSequence.length) {
        const timer = setTimeout(() => {
          setCurrentDigitIndex(currentDigitIndex + 1);
        }, config.showDuration);
        return () => clearTimeout(timer);
      } else {
        // Secuencia completa mostrada, pasar a input
        setPhase('input');
        setRoundStartTime(Date.now());
      }
    }
  }, [phase, currentDigitIndex, currentSequence.length, config.showDuration]);

  // Verificar respuesta
  const checkAnswer = useCallback(() => {
    const responseTime = Date.now() - roundStartTime;
    setResponseTimes([...responseTimes, responseTime]);

    const userSequence = userInput.split('').map(Number);
    const isCorrect = JSON.stringify(userSequence) === JSON.stringify(currentSequence);

    if (isCorrect) {
      const points = currentLength * 10;
      setScore(score + points);
      setCorrectCount(correctCount + 1);
      
      if (currentLength > longestSequence) {
        setLongestSequence(currentLength);
      }

      // Aumentar dificultad
      if (currentLength < config.maxLength) {
        setCurrentLength(currentLength + 1);
      }
    } else {
      // Reducir dificultad si falla
      if (currentLength > config.startLength) {
        setCurrentLength(Math.max(config.startLength, currentLength - 1));
      }
    }

    setPhase('feedback');
    setTimeout(() => {
      setRound(round + 1);
      startNewRound();
    }, 2000);
  }, [
    userInput,
    currentSequence,
    currentLength,
    score,
    correctCount,
    longestSequence,
    round,
    roundStartTime,
    responseTimes,
    config,
    startNewRound,
  ]);

  // Manejar input del usuario
  const handleDigitInput = (digit: string) => {
    const newInput = userInput + digit;
    setUserInput(newInput);

    // Auto-submit cuando completa la secuencia
    if (newInput.length === currentSequence.length) {
      setTimeout(() => checkAnswer(), 500);
    }
  };

  // Terminar juego y enviar resultados
  const endGame = useCallback(() => {
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    const accuracy = config.sequenceCount > 0 ? (correctCount / config.sequenceCount) * 100 : 0;

    const result: GameResult = {
      gameId: 'digit-span',
      score,
      metrics: {
        longestSequence,
        accuracy,
        avgResponseTime: Math.round(avgResponseTime),
        correctSequences: correctCount,
        totalSequences: config.sequenceCount,
      },
    };

    onGameEnd(result);
  }, [score, longestSequence, correctCount, responseTimes, config.sequenceCount, onGameEnd]);

  // Renderizar intro
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8">
            <div className="text-center space-y-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Brain className="w-20 h-20 text-purple-600" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-black text-text-primary mb-2">Digit Span</h1>
                <p className="text-lg text-text-secondary">Entrena tu memoria de trabajo</p>
              </div>

              <div className="bg-surface-2 rounded-xl p-6 space-y-4 text-left">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  ¿Cómo jugar?
                </h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">1.</span>
                    <span>Memoriza la secuencia de dígitos que aparece en pantalla</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">2.</span>
                    <span>Escribe los dígitos en el mismo orden</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">3.</span>
                    <span>Si aciertas, la secuencia será más larga la próxima vez</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">4.</span>
                    <span>¡Intenta alcanzar la secuencia más larga posible!</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-purple-500/10 rounded-lg p-3">
                  <p className="text-2xl font-black text-purple-600">{config.sequenceCount}</p>
                  <p className="text-xs text-text-secondary font-semibold">Secuencias</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-2xl font-black text-blue-600">{config.startLength}-{config.maxLength}</p>
                  <p className="text-xs text-text-secondary font-semibold">Dígitos</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3">
                  <p className="text-2xl font-black text-green-600">{gradeLevel}</p>
                  <p className="text-xs text-text-secondary font-semibold">Nivel</p>
                </div>
              </div>

              <PrimaryButton onClick={startNewRound} className="w-full">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="text-center"
        >
          <p className="text-8xl font-black text-purple-600">{countdown}</p>
          <p className="text-xl text-text-secondary mt-4">Prepárate...</p>
          <p className="text-sm text-text-tertiary mt-2">Secuencia {round + 1} de {config.sequenceCount}</p>
        </motion.div>
      </div>
    );
  }

  // Renderizar secuencia
  if (phase === 'show') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-2 text-text-tertiary">
            <Volume2 className="w-5 h-5" />
            <p className="text-sm font-semibold">Memoriza la secuencia...</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentDigitIndex}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="inline-block"
            >
              <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl">
                <span className="text-8xl font-black text-white">
                  {currentSequence[currentDigitIndex - 1] ?? ''}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2 justify-center">
            {currentSequence.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index < currentDigitIndex ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-text-tertiary">
            Secuencia {round + 1} de {config.sequenceCount} • {currentLength} dígitos
          </p>
        </div>
      </div>
    );
  }

  // Renderizar input
  if (phase === 'input') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-black text-text-primary mb-2">¡Escribe la secuencia!</h2>
            <p className="text-text-secondary">Ingresa los {currentLength} dígitos en orden</p>
          </div>

          {/* Display de dígitos ingresados */}
          <div className="flex gap-3 justify-center flex-wrap">
            {Array.from({ length: currentLength }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black border-2 ${
                  index < userInput.length
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white dark:bg-gray-800 text-text-tertiary border-gray-300 dark:border-gray-700'
                }`}
              >
                {userInput[index] || ''}
              </motion.div>
            ))}
          </div>

          {/* Teclado numérico */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'borrar', 0, '✓'].map((key, index) => {
              if (key === 'borrar') {
                return (
                  <button
                    key={index}
                    onClick={() => setUserInput(userInput.slice(0, -1))}
                    className="p-4 rounded-xl bg-red-500/10 text-red-600 font-bold hover:bg-red-500/20 transition-colors"
                  >
                    ← Borrar
                  </button>
                );
              }
              if (key === '✓') {
                return (
                  <button
                    key={index}
                    onClick={checkAnswer}
                    disabled={userInput.length !== currentLength}
                    className="p-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✓ OK
                  </button>
                );
              }
              return (
                <button
                  key={index}
                  onClick={() => handleDigitInput(String(key))}
                  disabled={userInput.length >= currentLength}
                  className="p-4 rounded-xl bg-purple-600 text-white text-2xl font-black hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {key}
                </button>
              );
            })}
          </div>

          <div className="text-center text-sm text-text-tertiary">
            Secuencia {round + 1} de {config.sequenceCount} • Puntos: {score}
          </div>
        </div>
      </div>
    );
  }

  // Renderizar feedback
  if (phase === 'feedback') {
    const isCorrect = userInput === currentSequence.join('');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: isCorrect ? [0, 360] : [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            {isCorrect ? (
              <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                <Award className="w-12 h-12 text-white" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center mx-auto">
                <RotateCcw className="w-12 h-12 text-white" />
              </div>
            )}
          </motion.div>

          <div>
            <h3 className={`text-3xl font-black ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? '¡Correcto!' : 'Incorrecto'}
            </h3>
            <p className="text-text-secondary mt-2">
              Secuencia correcta: {currentSequence.join(' ')}
            </p>
            {isCorrect && (
              <p className="text-purple-600 font-bold mt-2">
                +{currentLength * 10} puntos
              </p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Renderizar resultado final
  if (phase === 'result') {
    const accuracy = (correctCount / config.sequenceCount) * 100;
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
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
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <div>
                <h2 className="text-3xl font-black text-text-primary mb-2">¡Juego Completado!</h2>
                <p className="text-text-secondary">Excelente trabajo entrenando tu memoria</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-purple-600">{score}</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Puntos Totales</p>
                </div>
                <div className="bg-blue-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-blue-600">{accuracy.toFixed(0)}%</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Precisión</p>
                </div>
                <div className="bg-green-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-green-600">{longestSequence}</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Secuencia Máxima</p>
                </div>
                <div className="bg-orange-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-orange-600">{(avgResponseTime / 1000).toFixed(1)}s</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Tiempo Promedio</p>
                </div>
              </div>

              <div className="bg-surface-2 rounded-xl p-4">
                <p className="text-sm text-text-secondary">
                  <span className="font-bold text-text-primary">{correctCount}</span> de{' '}
                  <span className="font-bold text-text-primary">{config.sequenceCount}</span>{' '}
                  secuencias correctas
                </p>
              </div>

              <PrimaryButton onClick={endGame} className="w-full">
                Finalizar
              </PrimaryButton>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default DigitSpanGame;

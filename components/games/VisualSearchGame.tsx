// components/games/VisualSearchGame.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, RotateCcw, TrendingUp, Award, Target, Timer } from 'lucide-react';
import { PrimaryButton, SecondaryButton, Card } from '../ui';
import type { GradeLevel } from '../../services/cognitiveGames';

interface VisualSearchGameProps {
  onGameEnd: (result: GameResult) => void;
  gradeLevel: GradeLevel;
}

interface GameResult {
  gameId: string;
  score: number;
  metrics: {
    accuracy: number;
    avgResponseTime: number;
    totalRounds: number;
    correctRounds: number;
    avgTargetsFound: number;
  };
}

type GamePhase = 'intro' | 'countdown' | 'playing' | 'feedback' | 'result';

interface SearchGrid {
  items: string[];
  targets: string[];
  gridSize: number;
}

// Emojis para usar en el juego
const EMOJI_SETS = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅'],
  fruits: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🍆', '🥔', '🥕'],
  symbols: ['⭐', '❤️', '💎', '🎯', '🎨', '🎭', '🎪', '🎬', '🎮', '🎲', '🎳', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '🎼', '🎵'],
};

// Configuración por nivel educativo
const LEVEL_CONFIG = {
  primaria: {
    totalRounds: 6,
    gridSize: 4, // 4x4 = 16 items
    targetCount: 2,
    timePerRound: 20000, // 20 segundos
    emojiSet: 'animals' as const,
  },
  secundaria: {
    totalRounds: 8,
    gridSize: 5, // 5x5 = 25 items
    targetCount: 3,
    timePerRound: 25000, // 25 segundos
    emojiSet: 'fruits' as const,
  },
  preparatoria: {
    totalRounds: 10,
    gridSize: 6, // 6x6 = 36 items
    targetCount: 4,
    timePerRound: 30000, // 30 segundos
    emojiSet: 'symbols' as const,
  },
};

const VisualSearchGame: React.FC<VisualSearchGameProps> = ({ onGameEnd, gradeLevel }) => {
  const config = LEVEL_CONFIG[gradeLevel];
  const emojiPool = EMOJI_SETS[config.emojiSet];
  
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [round, setRound] = useState(0);
  const [grid, setGrid] = useState<SearchGrid | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [correctRounds, setCorrectRounds] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [targetsFoundPerRound, setTargetsFoundPerRound] = useState<number[]>([]);
  const [roundStartTime, setRoundStartTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(config.timePerRound);
  const [countdown, setCountdown] = useState(3);
  const [isCorrect, setIsCorrect] = useState(false);

  // Generar grid de búsqueda
  const generateGrid = useCallback((): SearchGrid => {
    const gridItemCount = config.gridSize * config.gridSize;
    
    // Seleccionar targets aleatorios
    const shuffledEmojis = [...emojiPool].sort(() => Math.random() - 0.5);
    const targets = shuffledEmojis.slice(0, config.targetCount);
    
    // Seleccionar distractores
    const distractors = shuffledEmojis.slice(config.targetCount, config.targetCount + 10);
    
    // Crear grid con targets y distractores
    const items: string[] = [];
    
    // Agregar targets (aparecer 1-2 veces cada uno)
    targets.forEach(target => {
      const occurrences = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < occurrences; i++) {
        items.push(target);
      }
    });
    
    // Llenar el resto con distractores aleatorios
    while (items.length < gridItemCount) {
      const distractor = distractors[Math.floor(Math.random() * distractors.length)];
      items.push(distractor);
    }
    
    // Mezclar items
    items.sort(() => Math.random() - 0.5);
    
    return {
      items,
      targets,
      gridSize: config.gridSize,
    };
  }, [config, emojiPool]);

  // Iniciar nuevo round
  const startNewRound = useCallback(() => {
    if (round >= config.totalRounds) {
      setPhase('result');
      return;
    }

    const newGrid = generateGrid();
    setGrid(newGrid);
    setSelectedItems(new Set());
    setRoundStartTime(Date.now());
    setTimeRemaining(config.timePerRound);
    setPhase('playing');
  }, [round, config, generateGrid]);

  // Countdown inicial
  useEffect(() => {
    if (phase === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        startNewRound();
      }
    }
  }, [phase, countdown, startNewRound]);

  // Timer del round
  useEffect(() => {
    if (phase === 'playing' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 0) {
            checkAnswers();
            return 0;
          }
          return time - 100;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [phase, timeRemaining]);

  // Manejar selección de item
  const handleItemClick = (index: number) => {
    if (phase !== 'playing' || !grid) return;

    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  // Verificar respuestas
  const checkAnswers = useCallback(() => {
    if (!grid) return;

    const responseTime = Date.now() - roundStartTime;
    setResponseTimes([...responseTimes, responseTime]);

    // Contar cuántos targets encontró correctamente
    let targetsFound = 0;
    let incorrectSelections = 0;

    selectedItems.forEach(index => {
      const item = grid.items[index];
      if (grid.targets.includes(item)) {
        targetsFound++;
      } else {
        incorrectSelections++;
      }
    });

    // Verificar si encontró todos los targets únicos
    const uniqueTargetsFound = new Set(
      Array.from(selectedItems).map(index => grid.items[index])
    );
    const foundAllTargets = grid.targets.every(target => uniqueTargetsFound.has(target));

    const roundCorrect = foundAllTargets && incorrectSelections === 0;

    if (roundCorrect) {
      const timeBonus = Math.floor(timeRemaining / 100);
      const points = 500 + timeBonus;
      setScore(score + points);
      setCorrectRounds(correctRounds + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setTargetsFoundPerRound([...targetsFoundPerRound, targetsFound]);
    setPhase('feedback');

    setTimeout(() => {
      setRound(round + 1);
      startNewRound();
    }, 2500);
  }, [
    grid,
    selectedItems,
    roundStartTime,
    responseTimes,
    timeRemaining,
    score,
    correctRounds,
    targetsFoundPerRound,
    round,
    startNewRound,
  ]);

  // Iniciar juego
  const startGame = () => {
    setPhase('countdown');
    setCountdown(3);
    setRound(0);
    setScore(0);
    setCorrectRounds(0);
    setResponseTimes([]);
    setTargetsFoundPerRound([]);
  };

  // Terminar juego
  const endGame = useCallback(() => {
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    const accuracy = config.totalRounds > 0 ? (correctRounds / config.totalRounds) * 100 : 0;
    
    const avgTargetsFound = targetsFoundPerRound.length > 0
      ? targetsFoundPerRound.reduce((a, b) => a + b, 0) / targetsFoundPerRound.length
      : 0;

    const result: GameResult = {
      gameId: 'visual-search',
      score,
      metrics: {
        accuracy,
        avgResponseTime: Math.round(avgResponseTime),
        totalRounds: config.totalRounds,
        correctRounds,
        avgTargetsFound: Math.round(avgTargetsFound * 10) / 10,
      },
    };

    onGameEnd(result);
  }, [score, correctRounds, responseTimes, targetsFoundPerRound, config.totalRounds, onGameEnd]);

  // Renderizar intro
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8">
            <div className="text-center space-y-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Search className="w-20 h-20 text-blue-600" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-black text-text-primary mb-2">Visual Search</h1>
                <p className="text-lg text-text-secondary">Entrena tu atención visual</p>
              </div>

              <div className="bg-surface-2 rounded-xl p-6 space-y-4 text-left">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  ¿Cómo jugar?
                </h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">1.</span>
                    <span>Se mostrarán los emojis que debes encontrar en la parte superior</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">2.</span>
                    <span>Busca y selecciona TODOS los emojis objetivo en la cuadrícula</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">3.</span>
                    <span>⚠️ No selecciones emojis que no sean objetivos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">4.</span>
                    <span>Cuando encuentres todos, haz clic en "Verificar" o espera que acabe el tiempo</span>
                  </li>
                </ul>
              </div>

              {/* Ejemplo visual */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-xl p-6">
                <p className="text-sm text-text-secondary mb-3">Busca estos objetivos:</p>
                <div className="flex gap-3 justify-center text-4xl mb-3">
                  <span>🎯</span>
                  <span>⭐</span>
                  <span>💎</span>
                </div>
                <p className="text-sm text-blue-600 font-bold">
                  Encuentra TODAS las veces que aparezcan en la cuadrícula
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-2xl font-black text-blue-600">{config.totalRounds}</p>
                  <p className="text-xs text-text-secondary font-semibold">Rondas</p>
                </div>
                <div className="bg-cyan-500/10 rounded-lg p-3">
                  <p className="text-2xl font-black text-cyan-600">{config.gridSize}×{config.gridSize}</p>
                  <p className="text-xs text-text-secondary font-semibold">Cuadrícula</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-3">
                  <p className="text-2xl font-black text-purple-600 capitalize">{gradeLevel}</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="text-center"
        >
          <p className="text-8xl font-black text-blue-600">{countdown}</p>
          <p className="text-xl text-text-secondary mt-4">Prepárate...</p>
          <p className="text-sm text-text-tertiary mt-2">Ronda {round + 1} de {config.totalRounds}</p>
        </motion.div>
      </div>
    );
  }

  // Renderizar juego
  if (phase === 'playing' && grid) {
    const progress = (round / config.totalRounds) * 100;
    const timeProgress = (timeRemaining / config.timePerRound) * 100;

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm p-4">
          <div className="max-w-6xl mx-auto space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-text-secondary">
                Ronda {round + 1} de {config.totalRounds}
              </span>
              <span className="font-bold text-text-primary">
                {score} puntos
              </span>
            </div>
            
            {/* Progreso */}
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-600"
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

        {/* Área de juego */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          {/* Objetivos a buscar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <p className="text-sm font-semibold text-text-secondary mb-3 text-center">
              Encuentra estos {config.targetCount} emojis:
            </p>
            <div className="flex gap-4 justify-center">
              {grid.targets.map((target, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-5xl"
                >
                  {target}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Grid de búsqueda */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${grid.gridSize}, 1fr)`,
              gap: '0.5rem',
              maxWidth: '600px',
            }}
          >
            {grid.items.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleItemClick(index)}
                className={`aspect-square rounded-lg flex items-center justify-center text-4xl transition-all ${
                  selectedItems.has(index)
                    ? 'bg-blue-500 shadow-lg ring-4 ring-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {item}
              </motion.button>
            ))}
          </motion.div>

          {/* Botón verificar */}
          <PrimaryButton
            onClick={checkAnswers}
            className="px-8"
            disabled={selectedItems.size === 0}
          >
            Verificar ({selectedItems.size} seleccionados)
          </PrimaryButton>
        </div>
      </div>
    );
  }

  // Renderizar feedback
  if (phase === 'feedback' && grid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={isCorrect ? { rotate: [0, 360] } : { rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
              isCorrect ? 'bg-green-500' : 'bg-orange-500'
            }`}>
              {isCorrect ? (
                <Award className="w-12 h-12 text-white" />
              ) : (
                <Target className="w-12 h-12 text-white" />
              )}
            </div>
          </motion.div>

          <div>
            <h3 className={`text-3xl font-black ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
              {isCorrect ? '¡Perfecto!' : '¡Casi!'}
            </h3>
            <p className="text-text-secondary mt-2">
              {isCorrect 
                ? 'Encontraste todos los objetivos correctamente' 
                : 'Algunos objetivos faltaron o sobraron selecciones'}
            </p>
          </div>

          {/* Mostrar objetivos y selecciones */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-text-tertiary mb-2">Objetivos:</p>
                <div className="flex gap-2 justify-center text-3xl">
                  {grid.targets.map((target, i) => (
                    <span key={i}>{target}</span>
                  ))}
                </div>
              </div>
              <div className="text-text-secondary">
                Seleccionaste: {selectedItems.size} items
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Renderizar resultado
  if (phase === 'result') {
    const accuracy = config.totalRounds > 0 ? (correctRounds / config.totalRounds) * 100 : 0;
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
    const avgTargetsFound = targetsFoundPerRound.length > 0
      ? targetsFoundPerRound.reduce((a, b) => a + b, 0) / targetsFoundPerRound.length
      : 0;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
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
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <div>
                <h2 className="text-3xl font-black text-text-primary mb-2">¡Juego Completado!</h2>
                <p className="text-text-secondary">Resultados de búsqueda visual</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-blue-600">{score}</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Puntos Totales</p>
                </div>
                <div className="bg-cyan-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-cyan-600">{accuracy.toFixed(0)}%</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Precisión</p>
                </div>
                <div className="bg-green-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-green-600">{(avgResponseTime / 1000).toFixed(1)}s</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Tiempo Promedio</p>
                </div>
                <div className="bg-purple-500/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-purple-600">{correctRounds}/{config.totalRounds}</p>
                  <p className="text-sm text-text-secondary font-semibold mt-1">Rondas Perfectas</p>
                </div>
              </div>

              <div className="bg-surface-2 rounded-xl p-4">
                <p className="text-sm text-text-secondary">
                  Promedio de objetivos encontrados:{' '}
                  <span className="font-bold text-text-primary">{avgTargetsFound.toFixed(1)}</span>
                  {' '}de {config.targetCount}
                </p>
              </div>

              {accuracy >= 70 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-4"
                >
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold">¡Excelente atención visual!</p>
                  <p className="text-sm opacity-90">Lograste una precisión superior al 70%</p>
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

export default VisualSearchGame;

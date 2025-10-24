import React, { useEffect, useState, useCallback } from 'react';
import { Card, PrimaryButton } from '../ui';
import { Circle, Square, Triangle, Hexagon, Star, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GradeLevel } from '../../types';

const ICONS = [Circle, Square, Triangle, Hexagon, Star];
const GAME_DURATION = 60; // seconds
const FEEDBACK_DURATION = 800; // ms

// Configuración adaptativa por nivel educativo
const LEVEL_CONFIG = {
  primaria: {
    turnDuration: 3500,
    maxLevel: 2,
    streakToLevelUp: 5,
    streakToLevelDown: 2,
    matchProbability: 0.4,
    instructions: 'Observa la figura. Presiona el botón si es la misma que viste hace poco. ¡Empieza con solo recordar la anterior!'
  },
  secundaria: {
    turnDuration: 2500,
    maxLevel: 3,
    streakToLevelUp: 4,
    streakToLevelDown: 3,
    matchProbability: 0.35,
    instructions: 'Observa la secuencia. Presiona el botón si la figura actual es la misma que apareció hace N turnos. El valor de N se muestra en pantalla.'
  },
  preparatoria: {
    turnDuration: 2000,
    maxLevel: 5,
    streakToLevelUp: 4,
    streakToLevelDown: 3,
    matchProbability: 0.35,
    instructions: 'Observa la secuencia. Presiona el botón si la figura actual es la misma que apareció hace N turnos. Demuestra tu capacidad de memoria de trabajo.'
  }
};

const generateSequence = (level: number, matchProbability: number = 0.35): number[] => {
  const newSequence = [];
  for (let i = 0; i < 50; i++) {
    const match = Math.random() < matchProbability;
    if (i >= level && match) {
      newSequence.push(newSequence[i - level]);
    } else {
      let iconIndex;
      do {
        iconIndex = Math.floor(Math.random() * ICONS.length);
      } while (i >= level && iconIndex === newSequence[i - level]);
      newSequence.push(iconIndex);
    }
  }
  return newSequence;
};

interface NBackGameProps {
  onGameEnd: (result: any) => void;
  gradeLevel?: GradeLevel;
}

const NBackGame: React.FC<NBackGameProps> = ({ onGameEnd, gradeLevel = 'preparatoria' }) => {
  const config = LEVEL_CONFIG[gradeLevel];
  
  // Game state
  const [phase, setPhase] = useState<'intro' | 'countdown' | 'playing' | 'ended'>('intro');
  const [countdown, setCountdown] = useState(3);
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [position, setPosition] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | 'missed'; key: number } | null>(null);
  const [answeredThisTurn, setAnsweredThisTurn] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [mistakeStreak, setMistakeStreak] = useState(0);
  const [levelChangeIndicator, setLevelChangeIndicator] = useState<'up' | 'down' | null>(null);

  // Start game
  const startGame = () => {
    setPhase('countdown');
    setCountdown(3);
    setLevel(1);
    setSequence(generateSequence(1, config.matchProbability));
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setCurrentIndex(0);
    setCorrectStreak(0);
    setMistakeStreak(0);
    setPosition(4);
  };

  // Countdown timer
  useEffect(() => {
    if (phase !== 'countdown') return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          setPhase('playing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Game timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPhase('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Turn advancement
  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(() => {
      advanceTurn();
    }, config.turnDuration);
    return () => clearInterval(timer);
  }, [phase, currentIndex, answeredThisTurn, level, sequence, config.turnDuration]);

  const advanceTurn = () => {
    const wasMatch = currentIndex >= level && sequence[currentIndex] === sequence[currentIndex - level];
    
    // Handle missed match
    if (wasMatch && !answeredThisTurn) {
      setScore(prev => Math.max(0, prev - 5));
      setFeedback({ type: 'missed', key: Date.now() });
      setMistakeStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak >= config.streakToLevelDown && level > 1) {
          setLevel(prev => prev - 1);
          setLevelChangeIndicator('down');
          setTimeout(() => setLevelChangeIndicator(null), 2000);
          return 0;
        }
        return newStreak;
      });
      setCorrectStreak(0);
    } else if (!wasMatch && !answeredThisTurn) {
      setScore(prev => prev + 5); // Reward for correct inaction
    }

    // Move to next position
    let newPosition;
    do {
      newPosition = Math.floor(Math.random() * 9);
    } while (newPosition === position);
    
    setPosition(newPosition);
    setCurrentIndex(prev => prev + 1);
    setAnsweredThisTurn(false);
  };

  // Handle user response
  const handleResponse = useCallback(() => {
    if (answeredThisTurn || phase !== 'playing') return;
    
    const isMatch = currentIndex >= level && sequence[currentIndex] === sequence[currentIndex - level];
    setAnsweredThisTurn(true);
    
    if (isMatch) {
      setScore(prev => prev + 10 * level);
      setFeedback({ type: 'correct', key: Date.now() });
      setMistakeStreak(0);
      setCorrectStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak >= config.streakToLevelUp && level < config.maxLevel) {
          setLevel(prevLevel => {
            const newLevel = prevLevel + 1;
            setSequence(generateSequence(newLevel, config.matchProbability));
            return newLevel;
          });
          setLevelChangeIndicator('up');
          setTimeout(() => setLevelChangeIndicator(null), 2000);
          return 0;
        }
        return newStreak;
      });
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setFeedback({ type: 'incorrect', key: Date.now() });
      setCorrectStreak(0);
      setMistakeStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak >= config.streakToLevelDown && level > 1) {
          setLevel(prevLevel => {
            const newLevel = prevLevel - 1;
            setSequence(generateSequence(newLevel, config.matchProbability));
            return newLevel;
          });
          setLevelChangeIndicator('down');
          setTimeout(() => setLevelChangeIndicator(null), 2000);
          return 0;
        }
        return newStreak;
      });
    }
  }, [answeredThisTurn, phase, currentIndex, level, sequence, config]);

  // Feedback clear
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), FEEDBACK_DURATION);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // End game handler
  useEffect(() => {
    if (phase === 'ended') {
      const achievementsUnlocked = [];
      if (level >= 3) achievementsUnlocked.push('nback_3');
      else if (level >= 2) achievementsUnlocked.push('nback_2');
      onGameEnd({
        gameId: 'n-track',
        gameTitle: 'N-Track',
        xpEarned: score,
        metrics: [
          { label: 'Puntuación', value: score.toString() },
          { label: 'Nivel Máx.', value: level.toString() }
        ],
        rawMetrics: { score, maxN: level },
        achievementsUnlocked,
      });
    }
  }, [phase, level, score, onGameEnd]);

  // Keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && phase === 'playing') {
      e.preventDefault();
      handleResponse();
    }
  }, [phase, handleResponse]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const IconComponent = sequence.length > 0 ? ICONS[sequence[currentIndex]] : null;
  const progress = (timeLeft / GAME_DURATION) * 100;

  if (phase === 'intro') {
    return (
      <div className="flex justify-center items-center min-h-full">
        <Card className="max-w-md w-full text-center">
          <Brain size={40} className="mx-auto text-info mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">N-Track</h1>
          <div className="inline-block px-3 py-1 rounded-full bg-surface-2 text-sm text-text-secondary mb-4">
            Nivel: {gradeLevel.charAt(0).toUpperCase() + gradeLevel.slice(1)}
          </div>
          <p className="text-text-secondary my-4">{config.instructions}</p>
          <div className="text-sm text-muted mb-4">
            <p>• Máximo nivel {config.maxLevel}-Back</p>
            <p>• {config.turnDuration / 1000}s por turno</p>
          </div>
          <PrimaryButton onClick={startGame} className="w-full justify-center">
            Comenzar (1 min)
          </PrimaryButton>
        </Card>
      </div>
    );
  }

  if (phase === 'countdown') {
    return (
      <div className="flex justify-center items-center min-h-full">
        <div className="text-7xl font-bold text-text-primary animate-ping">{countdown}</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-full p-4">
      <div className="w-full max-w-sm p-6 bg-surface-1 rounded-card border border-border">
        <div className="flex justify-between items-center text-sm text-text-secondary mb-3">
          <div>
            Nivel: <span className="font-bold text-info text-base">{level}-Back</span>
          </div>
          <div>
            Puntos: <span className="font-bold text-info text-base">{score}</span>
          </div>
          <div>
            Tiempo: <span className="font-bold text-info text-base">{timeLeft}s</span>
          </div>
        </div>
        <div className="w-full bg-surface-2 rounded-full h-1.5 my-4">
          <div
            className="bg-info h-1.5 rounded-full"
            style={{ width: `${progress}%`, transition: 'width 1s linear' }}
          ></div>
        </div>

        <div className="relative aspect-square w-full my-6">
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg bg-surface-2/50 border border-border transition-colors`}
              />
            ))}
          </div>

          <AnimatePresence>
            {levelChangeIndicator && (
              <motion.div
                key={levelChangeIndicator}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex justify-center items-center font-bold text-2xl z-20"
              >
                {levelChangeIndicator === 'up' ? (
                  <span className="text-green-400">¡Nivel {level}! 🎉</span>
                ) : (
                  <span className="text-orange-400">Nivel {level}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {IconComponent && phase === 'playing' && (
              <motion.div
                key={currentIndex}
                className="absolute flex items-center justify-center pointer-events-none z-10"
                style={{
                  width: '33.33%',
                  height: '33.33%',
                  top: `${Math.floor(position / 3) * 33.33}%`,
                  left: `${(position % 3) * 33.33}%`,
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <IconComponent
                  className="w-2/3 h-2/3 text-text-primary"
                  style={{
                    filter: `drop-shadow(0 0 10px ${
                      feedback?.type === 'correct'
                        ? 'var(--color-info)'
                        : feedback?.type === 'incorrect'
                        ? 'var(--color-accent-a)'
                        : feedback?.type === 'missed'
                        ? 'var(--color-accent-b)'
                        : 'var(--color-info)'
                    })`,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onClick={handleResponse}
          whileTap={{ scale: 0.95 }}
          className="w-full justify-center text-lg font-semibold py-4 bg-surface-2 border-2 border-border rounded-button text-text-primary hover:border-info focus:border-info focus:outline-none transition-colors"
        >
          COINCIDE
        </motion.button>
        <p className="text-center text-xs text-muted mt-2">(Barra Espaciadora)</p>
      </div>
    </div>
  );
};

export default NBackGame;

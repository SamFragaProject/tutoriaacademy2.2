import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, PrimaryButton } from '../ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { GradeLevel } from '../../types';

const COLORS = ['#00E7FF', '#FF3DCE', '#FFE45B']; // Cyan, Fuchsia, Yellow
const SHAPES = ['Círculo', 'Cuadrado'];
const GAME_DURATION = 60; // seconds

// Configuración adaptativa por nivel educativo
const LEVEL_CONFIG = {
  primaria: {
    switchProbability: 0.25,
    totalTrials: 40,
    practiceTrials: 5,
    instructions: 'Clasifica la figura según la regla que aparece arriba. La regla puede cambiar. Usa las flechas ⬅️ y ➡️ del teclado.'
  },
  secundaria: {
    switchProbability: 0.35,
    totalTrials: 60,
    practiceTrials: 3,
    instructions: 'Una regla aparecerá en pantalla. Usa las flechas ⬅️ y ➡️ para clasificar la figura. ¡La regla puede cambiar en cualquier momento!'
  },
  preparatoria: {
    switchProbability: 0.45,
    totalTrials: 80,
    practiceTrials: 0,
    instructions: 'Clasifica el estímulo según la regla activa. Adapta tu respuesta rápidamente cuando cambie la regla. Minimiza el costo de cambio cognitivo.'
  }
};

interface Trial {
  color: string;
  shape: string;
  rule: 'color' | 'shape';
  isSwitch: boolean;
}

interface FocusSwitchGameProps {
  onGameEnd: (result: any) => void;
  gradeLevel?: GradeLevel;
}

const FocusSwitchGame: React.FC<FocusSwitchGameProps> = ({ onGameEnd, gradeLevel = 'preparatoria' }) => {
  const config = LEVEL_CONFIG[gradeLevel];
  
  const [phase, setPhase] = useState<'intro' | 'practice' | 'playing' | 'ended'>('intro');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState<string>('');
  const [practiceComplete, setPracticeComplete] = useState(false);
  
  const startTime = useRef<number>(Date.now());
  const reactionTimes = useRef<{ time: number; isSwitch: boolean }[]>([]);

  // Generate trials
  const generateTrials = useCallback((isPractice: boolean = false) => {
    const newTrials: Trial[] = [];
    let currentRule: 'color' | 'shape' = Math.random() < 0.5 ? 'color' : 'shape';
    const trialCount = isPractice ? config.practiceTrials : config.totalTrials;

    for (let i = 0; i < trialCount; i++) {
      const shouldSwitch = i > 0 && Math.random() < config.switchProbability;
      if (shouldSwitch) {
        currentRule = currentRule === 'color' ? 'shape' : 'color';
      }
      newTrials.push({
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        rule: currentRule,
        isSwitch: shouldSwitch,
      });
    }
    return newTrials;
  }, [config]);

  const startGame = () => {
    if (config.practiceTrials > 0) {
      setPhase('practice');
      setTrials(generateTrials(true));
    } else {
      setPhase('playing');
      setTrials(generateTrials(false));
      setTimeLeft(GAME_DURATION);
    }
    setCurrentIndex(0);
    setScore(0);
    reactionTimes.current = [];
    startTime.current = Date.now();
  };

  const startMainGame = () => {
    setPhase('playing');
    setTrials(generateTrials(false));
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    reactionTimes.current = [];
    startTime.current = Date.now();
  };

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

  const nextTrial = useCallback(() => {
    setFeedback('');
    setCurrentIndex(prev => {
      const next = prev + 1;
      if (phase === 'practice' && next >= trials.length) {
        setPracticeComplete(true);
        return prev;
      } else if (phase === 'playing' && next >= trials.length) {
        setPhase('ended');
        return prev;
      }
      return next;
    });
  }, [phase, trials.length]);

  const handleResponse = useCallback(
    (response: 'left' | 'right') => {
      if (feedback || currentIndex >= trials.length) return;

      const trial = trials[currentIndex];
      const reactionTime = Date.now() - startTime.current;

      let correctResponse: 'left' | 'right';
      if (trial.rule === 'color') {
        correctResponse = COLORS.indexOf(trial.color) < 2 ? 'left' : 'right';
      } else {
        correctResponse = trial.shape === 'Círculo' ? 'left' : 'right';
      }

      if (response === correctResponse) {
        setScore(s => s + 10);
        setFeedback('✔️');
        if (phase === 'playing') {
          reactionTimes.current.push({ time: reactionTime, isSwitch: trial.isSwitch });
        }
      } else {
        setFeedback('❌');
      }

      setTimeout(nextTrial, 500);
    },
    [feedback, trials, currentIndex, nextTrial, phase]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phase !== 'playing' && phase !== 'practice') return;
      if (e.key === 'ArrowLeft') handleResponse('left');
      if (e.key === 'ArrowRight') handleResponse('right');
    },
    [handleResponse, phase]
  );

  useEffect(() => {
    if (phase === 'playing' || phase === 'practice') {
      window.addEventListener('keydown', handleKeyDown);
      startTime.current = Date.now();
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleKeyDown]);

  // End game handler
  useEffect(() => {
    if (phase === 'ended') {
      const switchTrials = reactionTimes.current.filter(rt => rt.isSwitch);
      const noSwitchTrials = reactionTimes.current.filter(rt => !rt.isSwitch);
      const avgSwitchTime = switchTrials.length > 0
        ? switchTrials.reduce((sum, rt) => sum + rt.time, 0) / switchTrials.length
        : 0;
      const avgNoSwitchTime = noSwitchTrials.length > 0
        ? noSwitchTrials.reduce((sum, rt) => sum + rt.time, 0) / noSwitchTrials.length
        : 0;
      const switchCost = avgSwitchTime - avgNoSwitchTime;

      const achievementsUnlocked = [];
      if (score >= 300) achievementsUnlocked.push('focus_master');
      else if (score >= 200) achievementsUnlocked.push('focus_advanced');

      onGameEnd({
        gameId: 'focus-switch',
        gameTitle: 'Focus Switch',
        xpEarned: score,
        metrics: [
          { label: 'Puntuación', value: score.toString() },
          { label: 'Precisión', value: `${Math.round((score / (trials.length * 10)) * 100)}%` },
          { label: 'Costo de Cambio', value: `${Math.round(switchCost)}ms` }
        ],
        rawMetrics: { score, switchCost, trials: trials.length },
        achievementsUnlocked,
      });
    }
  }, [phase, score, onGameEnd, trials.length]);

  const currentTrial = trials[currentIndex];
  const progress = (timeLeft / GAME_DURATION) * 100;

  if (phase === 'intro') {
    return (
      <div className="flex justify-center items-center min-h-full">
        <Card className="max-w-md w-full text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-white mb-2">Focus Switch</h1>
          <div className="inline-block px-3 py-1 rounded-full bg-surface-2 text-sm text-text-secondary mb-4">
            Nivel: {gradeLevel.charAt(0).toUpperCase() + gradeLevel.slice(1)}
          </div>
          <p className="text-text-secondary my-4">{config.instructions}</p>
          <div className="text-sm text-muted mb-4">
            <p>• {config.totalTrials} ensayos</p>
            {config.practiceTrials > 0 && <p>• {config.practiceTrials} ensayos de práctica</p>}
            <p>• Probabilidad de cambio: {Math.round(config.switchProbability * 100)}%</p>
          </div>
          <PrimaryButton onClick={startGame} className="w-full justify-center">
            Comenzar (1 min)
          </PrimaryButton>
        </Card>
      </div>
    );
  }

  if (phase === 'practice' && practiceComplete) {
    return (
      <div className="flex justify-center items-center min-h-full">
        <Card className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">✨</div>
          <h2 className="text-xl font-bold text-white mb-4">¡Práctica Completada!</h2>
          <p className="text-text-secondary mb-6">
            Ahora entiendes cómo funciona. ¡Vamos con el juego real!
          </p>
          <PrimaryButton onClick={startMainGame} className="w-full justify-center">
            Comenzar Juego Real
          </PrimaryButton>
        </Card>
      </div>
    );
  }

  if (!currentTrial) return null;

  return (
    <div className="flex justify-center items-center min-h-full">
      <div className="ta-game-container">
        {phase === 'playing' && (
          <div className="w-full bg-surface rounded-full h-2 mb-4">
            <div
              className="bg-purple h-2 rounded-full"
              style={{ width: `${progress}%`, transition: 'width 1s linear' }}
            ></div>
          </div>
        )}
        
        {phase === 'practice' && (
          <div className="text-center mb-4 text-sm bg-info/20 text-info py-2 px-4 rounded-button">
            🎓 Modo Práctica ({currentIndex + 1}/{config.practiceTrials})
          </div>
        )}

        <div className="ta-rule-box">
          Regla:{' '}
          <span className="font-bold">
            {currentTrial.rule === 'color' ? 'Clasifica por COLOR' : 'Clasifica por FORMA'}
          </span>
        </div>
        <div className="ta-stimulus-box">
          <div
            style={{
              width: 100,
              height: 100,
              backgroundColor: currentTrial.color,
              borderRadius: currentTrial.shape === 'Círculo' ? '50%' : '10px',
              transition: 'all 0.2s',
            }}
          />
          {feedback && (
            <div className="absolute text-5xl font-bold text-white">{feedback}</div>
          )}
        </div>
        <div className="ta-instructions">
          <div>
            <ArrowLeft /> {currentTrial.rule === 'color' ? 'Cian/Fucsia' : 'Círculo'}
          </div>
          <div>
            {currentTrial.rule === 'color' ? 'Amarillo' : 'Cuadrado'} <ArrowRight />
          </div>
        </div>
        <p className="text-center text-xs text-muted mt-4">Usa las teclas de flecha</p>
        <style>{`
          .ta-game-container {
            width: 100%;
            max-width: 400px;
            padding: 1.5rem;
            background: var(--surface);
            border-radius: var(--radius-card);
            border: 1px solid var(--border);
          }
          .ta-rule-box {
            text-align: center;
            padding: 0.75rem;
            background: var(--bg);
            border-radius: var(--radius-button);
            color: var(--text-primary);
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
          }
          .ta-stimulus-box {
            height: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
          .ta-instructions {
            display: flex;
            justify-content: space-between;
            margin-top: 1.5rem;
            padding: 0 1rem;
            color: var(--text-secondary);
            font-size: 0.9rem;
          }
          .ta-instructions > div {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
        `}</style>
      </div>
    </div>
  );
};

export default FocusSwitchGame;

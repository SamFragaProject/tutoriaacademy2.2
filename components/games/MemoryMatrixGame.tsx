import React, { useState, useEffect, useCallback } from 'react';
import { Card, PrimaryButton } from '../ui';
import { Brain, Grid as GridIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GradeLevel } from '../../types';

// Iconos para el grid
const ICONS = ['🎯', '⭐', '🎨', '🎵', '🎮', '🏆', '💎', '🔥', '⚡', '🌟'];
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52BE80'];

// Configuración por nivel educativo
const LEVEL_CONFIG = {
  primaria: {
    gridSize: 3,
    itemsToShow: 3,
    showDuration: 3000,
    instructions: '¡Mira bien! Recuerda dónde están las figuras. Luego tendrás que encontrarlas.'
  },
  secundaria: {
    gridSize: 4,
    itemsToShow: 5,
    showDuration: 2500,
    instructions: 'Memoriza las posiciones de los iconos en el grid. Después deberás recordar dónde estaban.'
  },
  preparatoria: {
    gridSize: 5,
    itemsToShow: 7,
    showDuration: 2000,
    instructions: 'Observa y memoriza las posiciones. Entrena tu memoria espacial de trabajo con este grid complejo.'
  }
};

interface GridCell {
  id: number;
  icon: string;
  color: string;
  isTarget: boolean;
}

interface MemoryMatrixGameProps {
  onGameEnd: (result: any) => void;
  gradeLevel?: GradeLevel;
}

const MemoryMatrixGame: React.FC<MemoryMatrixGameProps> = ({ 
  onGameEnd, 
  gradeLevel = 'preparatoria' 
}) => {
  const config = LEVEL_CONFIG[gradeLevel];
  
  // Game state
  const [phase, setPhase] = useState<'intro' | 'countdown' | 'show' | 'hide' | 'recall' | 'result' | 'ended'>('intro');
  const [countdown, setCountdown] = useState(3);
  const [round, setRound] = useState(1);
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [totalMisses, setTotalMisses] = useState(0);
  const [roundResults, setRoundResults] = useState<{ hits: number; misses: number; round: number }[]>([]);
  
  const maxRounds = 5;
  const gridSize = config.gridSize;
  const totalCells = gridSize * gridSize;

  // Generate grid for new round
  const generateGrid = useCallback(() => {
    const cells: GridCell[] = [];
    const targetIndices = new Set<number>();
    
    // Select random positions for targets
    while (targetIndices.size < config.itemsToShow) {
      targetIndices.add(Math.floor(Math.random() * totalCells));
    }
    
    // Create grid cells
    for (let i = 0; i < totalCells; i++) {
      const isTarget = targetIndices.has(i);
      cells.push({
        id: i,
        icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        isTarget
      });
    }
    
    setGrid(cells);
    setSelectedCells([]);
  }, [config.itemsToShow, totalCells]);

  // Start game
  const startGame = () => {
    setPhase('countdown');
    setCountdown(3);
    setRound(1);
    setScore(0);
    setTotalHits(0);
    setTotalMisses(0);
    setRoundResults([]);
    generateGrid();
  };

  // Countdown timer
  useEffect(() => {
    if (phase !== 'countdown') return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          setPhase('show');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [phase]);

  // Show phase timer
  useEffect(() => {
    if (phase !== 'show') return;
    
    const timer = setTimeout(() => {
      setPhase('hide');
    }, config.showDuration);
    
    return () => clearTimeout(timer);
  }, [phase, config.showDuration]);

  // Handle cell selection
  const handleCellClick = (cellId: number) => {
    if (phase !== 'hide') return;
    
    if (selectedCells.includes(cellId)) {
      setSelectedCells(prev => prev.filter(id => id !== cellId));
    } else {
      setSelectedCells(prev => [...prev, cellId]);
    }
  };

  // Submit round
  const submitRound = () => {
    const targets = grid.filter(cell => cell.isTarget).map(cell => cell.id);
    const hits = selectedCells.filter(id => targets.includes(id)).length;
    const misses = selectedCells.filter(id => !targets.includes(id)).length;
    const missed = targets.length - hits;
    
    const roundScore = (hits * 10) - (misses * 5);
    const newTotalHits = totalHits + hits;
    const newTotalMisses = totalMisses + misses + missed;
    
    setScore(prev => prev + Math.max(0, roundScore));
    setTotalHits(newTotalHits);
    setTotalMisses(newTotalMisses);
    setRoundResults(prev => [...prev, { hits, misses: misses + missed, round }]);
    
    setPhase('result');
    
    setTimeout(() => {
      if (round < maxRounds) {
        setRound(prev => prev + 1);
        generateGrid();
        setPhase('show');
      } else {
        setPhase('ended');
      }
    }, 2000);
  };

  // End game
  useEffect(() => {
    if (phase === 'ended') {
      const accuracy = totalHits + totalMisses > 0 
        ? (totalHits / (totalHits + totalMisses)) * 100 
        : 0;
      
      const achievementsUnlocked = [];
      if (accuracy >= 90) achievementsUnlocked.push('memory_master');
      else if (accuracy >= 75) achievementsUnlocked.push('memory_expert');
      
      onGameEnd({
        gameId: 'memory-matrix',
        gameTitle: 'Memory Matrix',
        xpEarned: score,
        metrics: [
          { label: 'Puntuación', value: score.toString() },
          { label: 'Precisión', value: `${Math.round(accuracy)}%` },
          { label: 'Aciertos', value: totalHits.toString() }
        ],
        rawMetrics: { 
          score, 
          accuracy, 
          totalHits, 
          totalMisses,
          rounds: roundResults
        },
        achievementsUnlocked,
      });
    }
  }, [phase, score, totalHits, totalMisses, roundResults, onGameEnd]);

  // Calculate progress
  const showProgress = (config.showDuration - 0) / config.showDuration * 100;
  const targets = grid.filter(cell => cell.isTarget);

  if (phase === 'intro') {
    return (
      <div className="flex justify-center items-center min-h-full">
        <Card className="max-w-md w-full text-center">
          <Brain size={40} className="mx-auto text-purple-500 mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">Memory Matrix</h1>
          <div className="inline-block px-3 py-1 rounded-full bg-surface-2 text-sm text-text-secondary mb-4">
            Nivel: {gradeLevel.charAt(0).toUpperCase() + gradeLevel.slice(1)}
          </div>
          <p className="text-text-secondary my-4">{config.instructions}</p>
          
          <div className="text-sm text-muted mb-6 space-y-2">
            <p>• Grid de {gridSize}×{gridSize}</p>
            <p>• {config.itemsToShow} iconos a memorizar</p>
            <p>• {config.showDuration / 1000}s para observar</p>
            <p>• {maxRounds} rondas</p>
          </div>

          <div className="bg-surface-2 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-text-primary mb-2">Cómo jugar:</h3>
            <ol className="text-sm text-text-secondary space-y-1">
              <li>1. Observa el grid con atención</li>
              <li>2. Memoriza las posiciones de los iconos</li>
              <li>3. Cuando se oculten, haz clic donde estaban</li>
              <li>4. ¡Gana puntos por cada acierto!</li>
            </ol>
          </div>

          <PrimaryButton onClick={startGame} className="w-full justify-center">
            Comenzar ({maxRounds} rondas)
          </PrimaryButton>
        </Card>
      </div>
    );
  }

  if (phase === 'countdown') {
    return (
      <div className="flex justify-center items-center min-h-full">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl font-bold text-purple-500"
        >
          {countdown}
        </motion.div>
      </div>
    );
  }

  if (phase === 'result') {
    const lastResult = roundResults[roundResults.length - 1];
    const targets = grid.filter(cell => cell.isTarget);
    const hits = selectedCells.filter(id => targets.some(t => t.id === id)).length;
    
    return (
      <div className="flex justify-center items-center min-h-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">
            {hits === targets.length ? '🎉' : hits > 0 ? '👍' : '😅'}
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            Ronda {round} Completa
          </h2>
          <p className="text-xl text-text-secondary">
            {lastResult.hits} aciertos • {lastResult.misses} errores
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-full p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-text-secondary">
            Ronda: <span className="font-bold text-purple-500">{round}/{maxRounds}</span>
          </div>
          <div className="text-sm text-text-secondary">
            Puntos: <span className="font-bold text-purple-500">{score}</span>
          </div>
        </div>

        {/* Phase indicator */}
        <div className="mb-4 text-center">
          {phase === 'show' && (
            <div>
              <p className="text-lg font-semibold text-text-primary mb-2">
                👀 ¡Memoriza las posiciones!
              </p>
              <div className="w-full bg-surface-2 rounded-full h-2">
                <motion.div
                  className="bg-purple-500 h-2 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: config.showDuration / 1000, ease: 'linear' }}
                />
              </div>
            </div>
          )}
          {phase === 'hide' && (
            <div>
              <p className="text-lg font-semibold text-text-primary mb-2">
                🧠 ¿Dónde estaban los iconos?
              </p>
              <p className="text-sm text-text-secondary">
                Seleccionados: {selectedCells.length}/{config.itemsToShow}
              </p>
            </div>
          )}
        </div>

        {/* Grid */}
        <div 
          className="grid gap-2 mb-4 mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            maxWidth: `${gridSize * 80}px`
          }}
        >
          <AnimatePresence>
            {grid.map((cell) => (
              <motion.button
                key={cell.id}
                onClick={() => handleCellClick(cell.id)}
                disabled={phase === 'show'}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  aspect-square rounded-lg border-2 transition-all
                  flex items-center justify-center text-3xl
                  ${phase === 'show' && cell.isTarget 
                    ? 'border-purple-500 shadow-lg' 
                    : 'border-border'
                  }
                  ${phase === 'hide' && selectedCells.includes(cell.id)
                    ? 'bg-purple-500/20 border-purple-500'
                    : 'bg-surface-2'
                  }
                  ${phase === 'hide' ? 'hover:bg-surface-1 cursor-pointer' : ''}
                `}
                style={{
                  backgroundColor: phase === 'show' && cell.isTarget 
                    ? `${cell.color}20` 
                    : undefined
                }}
              >
                {phase === 'show' && cell.isTarget ? cell.icon : ''}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Submit button */}
        {phase === 'hide' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PrimaryButton
              onClick={submitRound}
              disabled={selectedCells.length === 0}
              className="w-full justify-center"
            >
              Confirmar Selección ({selectedCells.length} seleccionados)
            </PrimaryButton>
            <p className="text-center text-xs text-muted mt-2">
              +10 pts por acierto • -5 pts por error
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MemoryMatrixGame;

import React, { useState } from 'react';
import { useStudyTimer } from '../contexts/StudyTimerContext';
import { Play, Pause, Coffee, Clock, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const StudyTimerWidget: React.FC = () => {
  const { mode, timeLeft, isRunning, duration, startTimer, pauseTimer, resetAndSwitchMode, currentTiming, changeTiming } = useStudyTimer();
  const [isOpen, setIsOpen] = useState(false);
  
  const progress = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const isFinished = timeLeft <= 0 && !isRunning;

  const getRingColor = () => {
    if (isFinished) return 'stroke-accent-b';
    if (mode === 'break') return 'stroke-accent-a';
    return 'stroke-primary';
  }
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-64 p-4 bg-surface-1 border border-border rounded-card shadow-card mb-3"
          >
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-text-primary">{mode === 'study' ? 'Tiempo de Estudio' : 'Descanso'}</h4>
                <div className="flex gap-1 p-1 bg-surface-2 rounded-button border border-border">
                    <button onClick={() => changeTiming('50/10')} className={`px-2 py-0.5 text-xs rounded-button ${currentTiming === '50/10' ? 'bg-primary text-white' : 'text-text-secondary'}`}>50/10</button>
                    <button onClick={() => changeTiming('25/5')} className={`px-2 py-0.5 text-xs rounded-button ${currentTiming === '25/5' ? 'bg-primary text-white' : 'text-text-secondary'}`}>25/5</button>
                </div>
            </div>
            
            <p className="text-5xl text-center font-bold my-4 text-text-primary">{formatTime(timeLeft)}</p>

            {isFinished ? (
              <button onClick={resetAndSwitchMode} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-button">
                {mode === 'study' ? <Coffee size={16}/> : <Play size={16}/>}
                {mode === 'study' ? 'Iniciar Descanso' : 'Siguiente Bloque'}
              </button>
            ) : isRunning ? (
              <button onClick={pauseTimer} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-surface-2 border border-border text-text-primary font-semibold rounded-button hover:border-primary/50">
                <Pause size={16}/> Pausar
              </button>
            ) : (
              <button onClick={startTimer} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-button">
                <Play size={16}/> Iniciar
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-16 h-16 rounded-full flex items-center justify-center relative group transition-transform duration-200 hover:scale-105 shadow-card-hover"
        aria-label="Abrir temporizador"
      >
        <div className="absolute inset-0 rounded-full bg-surface-1"></div>
        <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_6px_rgba(0,0,0,0.1)] ring-1 ring-inset ring-border"></div>
        
        <svg width="64" height="64" viewBox="0 0 64 64" className="absolute top-0 left-0">
            <circle cx="32" cy="32" r="29" fill="none" strokeWidth="4" className="stroke-surface-2" />
            <circle cx="32" cy="32" r="29" fill="none" strokeWidth="4" 
                className={`transition-all duration-1000 linear ${getRingColor()}`}
                style={{ strokeDasharray: 182.2, strokeDashoffset: 182.2 * (1 - progress / 100), transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
        </svg>

        <Clock size={24} className={`relative z-10 transition-colors group-hover:text-primary ${isFinished ? 'text-accent-b animate-pulse' : 'text-text-primary'}`} />
      </button>
    </div>
  );
};

export default StudyTimerWidget;
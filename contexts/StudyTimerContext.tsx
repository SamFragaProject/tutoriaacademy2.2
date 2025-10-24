import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getPreferences, savePreferences, StudyBlockTiming } from '../services/preferences';
import { track } from '../services/metrics';
import { useAuth } from '../hooks/useAuth';

type StudyMode = 'study' | 'break';

interface StudyTimerContextType {
  mode: StudyMode;
  timeLeft: number;
  isRunning: boolean;
  duration: number; // Duration of the current mode in seconds
  startTimer: () => void;
  pauseTimer: () => void;
  resetAndSwitchMode: () => void;
  currentTiming: StudyBlockTiming;
  changeTiming: (timing: StudyBlockTiming) => void;
}

export const StudyTimerContext = createContext<StudyTimerContextType | null>(null);

export const StudyTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(getPreferences());
  const [mode, setMode] = useState<StudyMode>('study');
  const [isRunning, setIsRunning] = useState(false);
  
  const getDurations = useCallback(() => {
    return prefs.studyBlockTiming === '50/10' 
      ? { study: 50 * 60, break: 10 * 60 } 
      : { study: 25 * 60, break: 5 * 60 };
  }, [prefs.studyBlockTiming]);

  const [durations, setDurations] = useState(getDurations());
  const [timeLeft, setTimeLeft] = useState(durations.study);

  const resetTimerOnLogout = useCallback(() => {
    setIsRunning(false);
    setMode('study');
    setTimeLeft(getDurations().study);
    track('study:timer_reset', { reason: 'logout' });
  }, [getDurations]);

  useEffect(() => {
    if (!user) {
      resetTimerOnLogout();
    }
  }, [user, resetTimerOnLogout]);

  useEffect(() => {
    const handlePrefsChange = () => {
      setPrefs(getPreferences());
    };
    window.addEventListener('preferences-updated', handlePrefsChange);
    return () => window.removeEventListener('preferences-updated', handlePrefsChange);
  }, []);

  useEffect(() => {
    setDurations(getDurations());
  }, [getDurations]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      setIsRunning(false);
      track(mode === 'study' ? 'study:block_end' : 'study:break_end', { timing: prefs.studyBlockTiming });
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, prefs.studyBlockTiming]);

  const startTimer = () => {
    if (!user) return;
    setIsRunning(true);
    track('study:block_start', { timing: prefs.studyBlockTiming });
  };
  const pauseTimer = () => {
    setIsRunning(false);
    track('study:block_pause', { timeLeft });
  };
  
  const resetAndSwitchMode = () => {
    if (!user) return;
    const nextMode = mode === 'study' ? 'break' : 'study';
    setMode(nextMode);
    setTimeLeft(durations[nextMode]);
    setIsRunning(true);
    track(nextMode === 'break' ? 'study:break_start' : 'study:block_start', { timing: prefs.studyBlockTiming });
  };
  
  const changeTiming = (timing: StudyBlockTiming) => {
    savePreferences({ studyBlockTiming: timing });
  };

  useEffect(() => {
    setIsRunning(false);
    setMode('study');
    setTimeLeft(durations.study);
  }, [durations]);

  const value = {
    mode,
    timeLeft,
    isRunning,
    duration: durations[mode],
    startTimer,
    pauseTimer,
    resetAndSwitchMode,
    currentTiming: prefs.studyBlockTiming,
    changeTiming,
  };

  return <StudyTimerContext.Provider value={value}>{children}</StudyTimerContext.Provider>;
};

export const useStudyTimer = (): StudyTimerContextType => {
  const context = useContext(StudyTimerContext);
  if (!context) {
    throw new Error('useStudyTimer must be used within a StudyTimerProvider');
  }
  return context;
};
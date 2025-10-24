import { track } from './metrics';
import * as metaAchievementsService from './metaAchievements';

const STORAGE_KEY = 'gam:state';

import type { Achievement, AchievementId, GamificationState } from '../types';

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  // Diagnóstico
  primer_paso: { id: 'primer_paso', title: 'Primer Paso', description: 'Completa tu primer diagnóstico.', icon: '🚀', category: 'diagnostic' },
  pretest_2: { id: 'pretest_2', title: 'Curiosidad Activa', description: 'Completa 2 pretests con recuerdo libre.', icon: '🧠', category: 'diagnostic' },

  // Hábitos
  ritmo_3: { id: 'ritmo_3', title: 'Buen Comienzo', description: 'Mantén una racha de 3 días.', icon: '🔥', category: 'habit' },
  ritmo_5: { id: 'ritmo_5', title: 'Ritmo Constante', description: 'Mantén una racha de 5 días.', icon: '🏃', category: 'habit' },
  ritmo_7: { id: 'ritmo_7', title: 'Imparable', description: 'Mantén una racha de 7 días.', icon: '⚡', category: 'habit' },
  ritmo_10: { id: 'ritmo_10', title: 'Leyenda', description: 'Mantén una racha de 10 días.', icon: '🏆', category: 'habit' },

  // Simulacro
  sim_60: { id: 'sim_60', title: 'Simulador Aprobado', description: 'Obtén 60% o más en un simulacro.', icon: '🎯', category: 'mock_exam' },
  sim_65: { id: 'sim_65', title: 'Buen Desempeño', description: 'Obtén 65% o más en un simulacro.', icon: '📈', category: 'mock_exam' },
  sim_75: { id: 'sim_75', title: 'Maestría a la Vista', description: 'Obtén 75% o más en un simulacro.', icon: '🏅', category: 'mock_exam' },
  mejora_10: { id: 'mejora_10', title: 'Salto Cuántico', description: 'Mejora tu puntaje en un simulacro por 10 puntos.', icon: '🌠', category: 'mock_exam' },
  
  // Práctica
  primera_practica: { id: 'primera_practica', title: 'A Calentar Motores', description: 'Completa tu primera sesión de práctica formativa.', icon: '💪', category: 'practice' },
  practica_10: { id: 'practica_10', title: 'Practicante', description: 'Completa 10 ejercicios de práctica.', icon: '✏️', category: 'practice' },
  practica_dificil_3: { id: 'practica_dificil_3', title: 'Reto Aceptado', description: 'Completa 3 sesiones de práctica difícil (dif. 4+).', icon: '🧗', category: 'practice' },

  // Cognición (Metacognición y Estudio)
  autoexplicacion_3: { id: 'autoexplicacion_3', title: 'Metacognición', description: 'Usa la autoexplicación 3 veces.', icon: '💡', category: 'cognition' },
  autoexplicacion_rica_3: { id: 'autoexplicacion_rica_3', title: 'Explicador Experto', description: 'Escribe 3 autoexplicaciones ricas (15+ palabras).', icon: '✍️', category: 'cognition' },
  
  // Cognición (Minijuegos)
  nback_2: { id: 'nback_2', title: 'Memoria de Trabajo', description: 'Alcanza el nivel 2-back en N-Track.', icon: '🧠', category: 'cognition' },
  nback_3: { id: 'nback_3', title: 'Concentración Profunda', description: 'Alcanza el nivel 3-back en N-Track.', icon: '🧘', category: 'cognition' },
  switch_cost_300: { id: 'switch_cost_300', title: 'Mente Flexible', description: 'Logra un coste de cambio menor a 300ms en Focus Switch.', icon: '🤸', category: 'cognition' },
  rsvp_wpm_300: { id: 'rsvp_wpm_300', title: 'Lector Veloz', description: 'Supera las 300 PPM con buena comprensión.', icon: '⚡', category: 'cognition' },

  // Repaso
  repaso_d10_2: { id: 'repaso_d10_2', title: 'Memoria de Acero', description: 'Completa 2 repasos D10 de temas débiles.', icon: '💾', category: 'review' },
};

const getInitialState = (): GamificationState => ({
  xp: 0,
  streak: 0,
  lastVisit: new Date(0).toISOString().split('T')[0],
  achievements: {},
  metaAchievements: {},
});

const loadState = (): GamificationState => {
  if (typeof window === 'undefined') return getInitialState();
  try {
    // Intentar cargar desde el usuario actual
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const userGamification = localStorage.getItem(`gamification:${user.id}`);
      if (userGamification) {
        const data = JSON.parse(userGamification);
        return {
          xp: data.xp || 0,
          streak: 0, // La racha se calcula desde el progreso
          lastVisit: new Date().toISOString().split('T')[0],
          achievements: {},
          metaAchievements: {},
        };
      }
    }
    
    // Fallback al método anterior
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...getInitialState(), ...JSON.parse(stored) } : getInitialState();
  } catch (e) {
    console.error("Failed to load gamification state:", e);
    return getInitialState();
  }
};

const saveState = (state: GamificationState): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save gamification state:", e);
  }
};

const getLevelFromXP = (xp: number) => {
    const xpPerLevel = 1000;
    return {
        level: Math.floor(xp / xpPerLevel) + 1,
        levelXP: xp % xpPerLevel,
        xpToNext: xpPerLevel,
    };
};

export const getState = (): GamificationState => {
  return loadState();
}
export const setState = (state: GamificationState): void => {
  saveState(state);
}

export const getSummary = async () => {
    await new Promise(res => setTimeout(res, 50));
    const state = loadState();
    return {
        ...state,
        ...getLevelFromXP(state.xp),
    };
};

export const addXP = (amount: number) => {
    const state = loadState();
    state.xp += amount;
    saveState(state);
    track('add_xp', { amount, total: state.xp });
    metaAchievementsService.checkAndUnlockMetaAchievements();
};

export const touchStreak = () => {
    const state = loadState();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    if (state.lastVisit === todayStr) {
        return;
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (state.lastVisit === yesterdayStr) {
        state.streak += 1;
    } else {
        state.streak = 1;
    }

    state.lastVisit = todayStr;
    
    if (state.streak >= 10) award('ritmo_10');
    else if (state.streak >= 7) award('ritmo_7');
    else if (state.streak >= 5) award('ritmo_5');
    else if (state.streak >= 3) award('ritmo_3');

    saveState(state);
    track('touch_streak', { newStreak: state.streak });
    metaAchievementsService.checkAndUnlockMetaAchievements();
};

export const award = (id: AchievementId) => {
    const state = loadState();
    if (!state.achievements[id]) {
        const achievement = ACHIEVEMENTS[id];
        state.achievements[id] = { awarded: new Date().toISOString(), category: achievement.category };
        saveState(state);
        track('achievement_awarded', { id });
        metaAchievementsService.checkAndUnlockMetaAchievements();
    }
};
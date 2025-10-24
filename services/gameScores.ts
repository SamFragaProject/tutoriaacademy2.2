// services/gameScores.ts
import type { GameSession, ScoreEntry } from '../types';

const GAME_HISTORY_KEY_PREFIX = 'gameHistory:';

export const getGameHistory = (gameId: string): GameSession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = `${GAME_HISTORY_KEY_PREFIX}${gameId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addScore = (
  gameId: 'n-track' | 'focus-switch' | 'rsvp-gist', 
  userName: string, 
  score: number,
  metrics: GameSession['metrics']
): void => {
  if (typeof window === 'undefined' || !score || score <= 0) return;
  try {
    const history = getGameHistory(gameId);
    
    const newSession: GameSession = {
      gameId,
      userName,
      score,
      metrics,
      timestamp: new Date().toISOString()
    };
    
    history.unshift(newSession); // Add to the beginning
    
    // Keep last 50 sessions per game
    if (history.length > 50) {
      history.length = 50;
    }
      
    localStorage.setItem(`${GAME_HISTORY_KEY_PREFIX}${gameId}`, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save game session", e);
  }
};

// This function now processes the history to provide a simple leaderboard
// It maintains compatibility with the existing GameRanking component.
export const getScores = (gameId: string): ScoreEntry[] => {
  const history = getGameHistory(gameId);
  if (history.length === 0) {
      // Provide some mock data if no history exists yet for a better demo
      const names = ['QuantumLeap', 'NovaGamer', 'SyntaxError', 'PixelPioneer', 'LogicLord'];
      return names.map((name, i) => ({
        name,
        score: Math.floor(Math.random() * (800 - 200) + 200) + (5 - i) * 50,
      })).sort((a, b) => b.score - a.score);
  }

  const userHighScores: { [key: string]: number } = {};

  history.forEach(session => {
    if (!userHighScores[session.userName] || session.score > userHighScores[session.userName]) {
      userHighScores[session.userName] = session.score;
    }
  });

  return Object.entries(userHighScores)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
};
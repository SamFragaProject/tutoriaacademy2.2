import React, { useState, useEffect } from 'react';
import { Card } from '../ui';
import { getScores } from '../../services/gameScores';
// FIX: Import ScoreEntry from types.ts instead of gameScores service.
import type { ScoreEntry } from '../../types';
import { Trophy } from 'lucide-react';

interface GameRankingProps {
  gameId: string;
  gameTitle: string;
  currentUserName: string;
  rankingKey: number; // To force re-render
}

const GameRanking: React.FC<GameRankingProps> = ({ gameId, gameTitle, currentUserName, rankingKey }) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    setScores(getScores(gameId));
  }, [gameId, rankingKey]); // Depend on rankingKey to refresh

  return (
    <Card className="p-4">
      <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
        <Trophy size={18} className="text-accent" />
        {gameTitle}
      </h3>
      {scores.length > 0 ? (
        <ol className="space-y-2 text-sm">
          {scores.slice(0, 5).map((entry, index) => {
            const isCurrentUser = entry.name === currentUserName;
            return (
              <li key={index} className={`flex justify-between items-center p-2 rounded-md ${isCurrentUser ? 'bg-cyan/10' : ''}`}>
                <span className={`font-semibold truncate ${isCurrentUser ? 'text-cyan' : 'text-text-primary'}`}>
                  {index + 1}. {entry.name}
                </span>
                <span className={`font-bold flex-shrink-0 ml-2 ${isCurrentUser ? 'text-cyan' : 'text-accent'}`}>
                  {entry.score.toLocaleString()}
                </span>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-xs text-muted text-center py-4">Aún no hay puntajes. ¡Sé el primero!</p>
      )}
    </Card>
  );
};

export default GameRanking;
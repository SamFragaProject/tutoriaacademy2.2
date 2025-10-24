import React from 'react';
import type { CognitiveGame } from '../../services/cognitiveGames';
import { Card, PrimaryButton } from '../ui';
import { Lock } from 'lucide-react';

interface GameCardProps {
  game: CognitiveGame;
  onPlay: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  const colorClass = game.subject === 'Matemáticas' ? 'border-cyan shadow-glowCyan' : 'border-purple shadow-glowPurple';
  const accentColor = game.subject === 'Matemáticas' ? 'text-cyan' : 'text-purple';

  return (
    <Card className={`flex flex-col ${colorClass} transition-all hover:-translate-y-1`}>
      <div className="flex items-center gap-4 mb-3">
        <div className={`p-2 bg-black/20 rounded-lg`}>
            <game.Icon className={`h-6 w-6 ${accentColor}`} />
        </div>
        <h2 className="text-xl font-bold text-white">{game.title}</h2>
      </div>
      <p className="text-text-secondary text-sm flex-grow">{game.description}</p>
      <div className="mt-6">
        {game.available ? (
          <PrimaryButton onClick={onPlay} className="w-full justify-center">Jugar</PrimaryButton>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full px-6 py-2.5 font-semibold text-muted bg-surface/50 rounded-pill border border-border">
            <Lock size={16} />
            Próximamente
          </div>
        )}
      </div>
    </Card>
  );
};

export default GameCard;
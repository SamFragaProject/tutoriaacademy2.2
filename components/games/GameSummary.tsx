import React from 'react';
import { Card, PrimaryButton, SecondaryButton } from '../ui';
import { Award, Star } from 'lucide-react';
import { ACHIEVEMENTS } from '../../services/gamification';

interface GameSummaryProps {
  result: {
    gameId: string;
    gameTitle: string;
    metrics: { label: string; value: string }[];
    xpEarned: number;
    achievementsUnlocked?: string[];
  };
  onPlayAgain: () => void;
  onExit: () => void;
}

const GameSummary: React.FC<GameSummaryProps> = ({ result, onPlayAgain, onExit }) => {
  return (
    <div className="flex justify-center items-center min-h-full">
      <Card className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white">Ronda Completada</h1>
        <p className="text-lg text-cyan font-semibold">{result.gameTitle}</p>

        <div className="my-6 space-y-3">
            {result.metrics.map(metric => (
                <div key={metric.label} className="flex justify-between items-baseline p-3 bg-bg/50 rounded-lg">
                    <span className="text-text-secondary">{metric.label}</span>
                    <span className="text-xl font-bold text-white">{metric.value}</span>
                </div>
            ))}
        </div>
        
        <div className="flex justify-center items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-6">
            <Star size={24} className="text-accent" />
            <span className="text-2xl font-bold text-accent">+{result.xpEarned} XP</span>
        </div>

        {result.achievementsUnlocked && result.achievementsUnlocked.length > 0 && (
            <div className="mb-6">
                <h3 className="font-semibold text-white mb-2">¡Logros Desbloqueados!</h3>
                <div className="space-y-2">
                {result.achievementsUnlocked.map(achId => {
                    const ach = (ACHIEVEMENTS as any)[achId];
                    if (!ach) return null;
                    return (
                        <div key={achId} className="flex items-center gap-3 p-2 bg-surface rounded-md text-left">
                            <span className="text-2xl">{ach.icon}</span>
                            <div>
                                <p className="font-semibold text-text-primary">{ach.title}</p>
                                <p className="text-xs text-text-secondary">{ach.description}</p>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>
        )}

        <div className="flex gap-4">
            <SecondaryButton onClick={onExit} className="w-full justify-center">Menú</SecondaryButton>
            <PrimaryButton onClick={onPlayAgain} className="w-full justify-center">Jugar de Nuevo</PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default GameSummary;
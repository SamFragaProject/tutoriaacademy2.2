import React from 'react';
import { Card } from './ui';

interface GamRankingDemoProps {
  currentUserXP: number;
  currentUserName: string;
}

const GamRankingDemo: React.FC<GamRankingDemoProps> = ({ currentUserXP, currentUserName }) => {
  const MOCK_RANKING = [
    { name: 'CyberPilot', xp: 15200 },
    { name: 'QuantumLeap', xp: 14850 },
    { name: 'NovaGamer', xp: 14500 },
    { name: 'SyntaxError', xp: 11900 },
    { name: 'PixelPioneer', xp: 11250 },
  ];

  const fullRanking = [
    ...MOCK_RANKING,
    { name: currentUserName, xp: currentUserXP }
  ].sort((a, b) => b.xp - a.xp);

  return (
    <Card>
      <h3 className="text-md font-semibold text-white mb-4">Ranking (Top 5)</h3>
      <ul className="space-y-2">
        {fullRanking.slice(0, 5).map((user, index) => {
          const isCurrentUser = user.name === currentUserName;
          return (
            <li key={index} className={`flex items-center gap-4 p-2 rounded-lg ${isCurrentUser ? 'bg-cyan/10' : ''}`}>
              <span className={`w-6 text-center font-bold text-lg ${isCurrentUser ? 'text-cyan' : 'text-text-secondary'}`}>{index + 1}</span>
              <span className={`flex-grow font-medium truncate ${isCurrentUser ? 'text-white' : 'text-text-primary'}`}>{user.name}</span>
              <span className={`font-semibold text-sm ${isCurrentUser ? 'text-cyan' : 'text-text-secondary'}`}>{user.xp.toLocaleString()} XP</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default GamRankingDemo;

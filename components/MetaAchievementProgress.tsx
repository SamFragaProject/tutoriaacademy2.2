import React from 'react';
import type { GamificationState, MetaAchievement } from '../types';
import { META_ACHIEVEMENT_CATALOG } from '../data/metaAchievementsCatalog';
import { TaIcon } from './TaIcons';

interface MetaAchievementProgressProps {
  achievements: GamificationState['metaAchievements'];
}

const RequirementTooltip: React.FC<{ achievement: MetaAchievement }> = ({ achievement }) => (
  <div className="ta-tooltip-content">
    <h4 className="font-bold text-white">{achievement.name} ({achievement.level})</h4>
    <p className="text-xs text-text-secondary italic mb-2">"{achievement.description}"</p>
    <ul className="text-xs text-text-secondary space-y-1">
      <li>• {achievement.requirements.baseAchievements} logros base</li>
      {achievement.requirements.minStreak && <li>• Racha de {achievement.requirements.minStreak} días</li>}
      {achievement.requirements.minMockAccuracy && <li>• {achievement.requirements.minMockAccuracy}%+ en simulacro</li>}
    </ul>
  </div>
);

const MetaAchievementProgress: React.FC<MetaAchievementProgressProps> = ({ achievements }) => {
  return (
    <div className="ta-gam-card">
      <h3 className="ta-gam-card-title">Colecciones de Logros</h3>
      <div className="space-y-4">
        {Object.values(META_ACHIEVEMENT_CATALOG).map(collection => (
          <div key={collection.subject}>
            <h4 className="text-sm font-semibold text-white mb-2">{collection.name}</h4>
            <div className="flex justify-between items-center gap-2">
              {collection.achievements.map((ach, index) => {
                const isUnlocked = !!achievements[ach.id];
                const color = collection.subject === 'Matemáticas' ? 'cyan' : 'purple';
                return (
                  <div key={ach.id} className="ta-meta-badge-wrapper group">
                    <div className={`ta-meta-badge ${isUnlocked ? 'unlocked' : ''} ${color}`}>
                      <TaIcon name={ach.icon} className="w-6 h-6" />
                    </div>
                    {/* Tooltip */}
                    <div className="ta-meta-tooltip">
                      <RequirementTooltip achievement={ach} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .ta-gam-card {
            padding: 1rem;
            background-color: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius);
        }
        .ta-gam-card-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 0.75rem;
        }
        .ta-meta-badge-wrapper {
            position: relative;
            flex-grow: 1;
            display: flex;
            justify-content: center;
        }
        .ta-meta-badge {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--border);
            background-color: var(--bg);
            color: var(--muted);
            transition: all 0.3s ease;
            filter: grayscale(80%) opacity(0.6);
        }
        .ta-meta-badge.unlocked {
            filter: grayscale(0%) opacity(1);
        }
        .ta-meta-badge.unlocked.cyan {
            background-color: var(--cyan);
            color: var(--bg);
            border-color: var(--cyan);
            box-shadow: 0 0 12px var(--cyan);
        }
        .ta-meta-badge.unlocked.purple {
            background-color: var(--purple);
            color: var(--bg);
            border-color: var(--purple);
            box-shadow: 0 0 12px var(--purple);
        }
        .ta-meta-tooltip {
            position: absolute;
            bottom: 110%;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            padding: 0.75rem;
            background-color: var(--bg);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
            z-index: 10;
        }
        .ta-meta-badge-wrapper:hover .ta-meta-tooltip {
            opacity: 1;
            visibility: visible;
        }
      `}</style>
    </div>
  );
};

export default MetaAchievementProgress;

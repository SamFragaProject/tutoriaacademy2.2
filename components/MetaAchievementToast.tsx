import React from 'react';
import type { MetaAchievement } from '../types';
import { TaIcon } from './TaIcons';
import { motion } from 'framer-motion';

interface MetaAchievementToastProps {
  achievement: MetaAchievement;
}

const MetaAchievementToast: React.FC<MetaAchievementToastProps> = ({ achievement }) => {
  const color = achievement.subject === 'Matemáticas' ? 'cyan' : 'purple';
  const colorHex = achievement.subject === 'Matemáticas' ? 'var(--cyan)' : 'var(--purple)';

  return (
    <motion.div 
        className="ta-meta-toast noise-overlay"
        style={{ '--glow-color': colorHex } as React.CSSProperties}
    >
      <div className="ta-meta-toast-header">
        <span className="ta-meta-toast-title">Metalogro Desbloqueado</span>
        <div className={`ta-meta-toast-badge ${color}`}>{achievement.level}</div>
      </div>

      <div className="ta-meta-toast-body">
        <div className={`ta-meta-toast-icon ${color}`}>
            <TaIcon name={achievement.icon} className="w-8 h-8" />
        </div>
        <div>
            <h3 className="ta-meta-toast-name">{achievement.name}</h3>
            <p className="ta-meta-toast-bio">{achievement.bio}</p>
        </div>
      </div>
      
      <div className="ta-meta-toast-footer">
        <span>+{achievement.xpBonus} XP</span>
      </div>

      <style>{`
        .ta-meta-toast {
            width: 380px;
            padding: 1rem;
            border-radius: var(--radius);
            border: 1px solid var(--border);
            background-color: var(--surface);
            backdrop-filter: blur(16px);
            color: var(--text-primary);
            box-shadow: 0 0 25px var(--glow-color);
            border-left: 4px solid var(--glow-color);
        }
        .ta-meta-toast-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
        }
        .ta-meta-toast-title {
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
        }
        .ta-meta-toast-badge {
            font-size: 0.75rem;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 99px;
        }
        .ta-meta-toast-badge.cyan { background-color: var(--cyan); color: var(--bg); }
        .ta-meta-toast-badge.purple { background-color: var(--purple); color: var(--bg); }
        
        .ta-meta-toast-body {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }
        .ta-meta-toast-icon {
            flex-shrink: 0;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .ta-meta-toast-icon.cyan { background-color: var(--cyan); color: var(--bg); }
        .ta-meta-toast-icon.purple { background-color: var(--purple); color: var(--bg); }
        
        .ta-meta-toast-name {
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1.1;
            font-family: 'Sora', sans-serif;
        }
        .ta-meta-toast-bio {
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
        }
        
        .ta-meta-toast-footer {
            margin-top: 0.75rem;
            text-align: right;
            font-weight: 700;
            color: var(--accent);
        }
      `}</style>
    </motion.div>
  );
};

export default MetaAchievementToast;

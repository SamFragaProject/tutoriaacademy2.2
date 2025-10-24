import React from 'react';
import type { TutorMode } from '../../types';

interface Props {
  currentMode: TutorMode;
  onModeChange: (mode: TutorMode) => void;
}

const ModeSelector: React.FC<Props> = ({ currentMode, onModeChange }) => {
  const modes: { id: TutorMode; label: string }[] = [
    { id: 'learn', label: 'Aprender' },
    { id: 'practice', label: 'Practicar' },
    { id: 'review', label: 'Repasar' },
  ];

  return (
    <div className="bg-surface-2 border border-border p-1 rounded-button flex gap-1">
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`px-4 py-1.5 text-sm font-semibold rounded-button transition-colors duration-200 ${
            currentMode === mode.id
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:bg-surface-1'
          }`}
          aria-pressed={currentMode === mode.id}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
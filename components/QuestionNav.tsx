import React from 'react';

interface QuestionNavProps {
  total: number;
  current: number;
  answered: Set<number>;
  onJump: (index: number) => void;
}

const QuestionNav: React.FC<QuestionNavProps> = ({ total, current, answered, onJump }) => {
  return (
    <div role="listbox" className="ta-qnav-container no-scrollbar">
      {Array.from({ length: total }, (_, i) => {
        const isAnswered = answered.has(i);
        const isCurrent = current === i;
        let stateClass = '';
        if (isCurrent) stateClass = 'current';
        else if (isAnswered) stateClass = 'answered';

        return (
          <button
            key={i}
            role="option"
            aria-selected={isCurrent}
            onClick={() => onJump(i)}
            className={`ta-qnav-item ${stateClass}`}
          >
            {i + 1}
          </button>
        );
      })}
      <style>{`
        .ta-qnav-container {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem;
          background-color: var(--surface-1);
          border: 1px solid var(--border);
          border-radius: var(--radius-button);
          overflow-x: auto;
        }
        .ta-qnav-item {
          flex-shrink: 0;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 2px solid var(--border);
          background-color: transparent;
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ta-qnav-item.answered {
          background-color: var(--primary);
          border-color: var(--primary);
          color: white;
        }
        .ta-qnav-item.current {
          border-color: var(--primary);
          color: var(--primary);
          transform: scale(1.1);
        }
        .ta-qnav-item:hover:not(.current) {
          background-color: var(--surface-2);
        }
      `}</style>
    </div>
  );
};

export default QuestionNav;
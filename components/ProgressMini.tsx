import React from 'react';

interface ProgressMiniProps {
  current: number;
  total: number;
}

const ProgressMini: React.FC<ProgressMiniProps> = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="ta-progress-mini">
      <span className="ta-progress-label">
        Progreso: {current} / {total}
      </span>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        className="ta-progress-bar-container"
      >
        <div
          className="ta-progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <style>{`
        .ta-progress-mini {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          max-width: 300px;
        }
        .ta-progress-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }
        .ta-progress-bar-container {
          flex-grow: 1;
          height: 8px;
          background-color: var(--surface);
          border-radius: 999px;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .ta-progress-bar-fill {
          height: 100%;
          background-color: var(--cyan);
          border-radius: 999px;
          transition: width 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProgressMini;

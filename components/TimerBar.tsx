import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerBarProps {
  seconds?: number;
  onExpire?: () => void;
}

const TimerBar: React.FC<TimerBarProps> = ({ seconds = 900, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) {
        onExpire();
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onExpire]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / seconds) * 100;

  return (
    <div className="ta-timer-bar">
      <Clock size={16} className="ta-timer-icon" />
      <span className="ta-timer-text">{formatTime(timeLeft)}</span>
      <div className="ta-timer-progress-container">
        <div
          className="ta-timer-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <style>{`
        .ta-timer-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--surface-1);
          border: 1px solid var(--border);
          border-radius: var(--radius-button);
          padding: 6px 12px;
          width: 100%;
          max-width: 200px;
        }
        .ta-timer-icon {
          color: var(--text-secondary);
        }
        .ta-timer-text {
          font-weight: 500;
          color: var(--text-primary);
          font-size: 0.875rem;
        }
        .ta-timer-progress-container {
          flex-grow: 1;
          height: 6px;
          background-color: var(--surface-2);
          border-radius: 999px;
          overflow: hidden;
        }
        .ta-timer-progress-fill {
          height: 100%;
          background-image: linear-gradient(to right, var(--primary), var(--accent-a));
          border-radius: 999px;
          transition: width 1s linear;
        }
      `}</style>
    </div>
  );
};

export default TimerBar;
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, change, changeType = 'positive' }) => {
  const isPositive = changeType === 'positive';
  const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="ta-metrics-card">
      <p className="ta-metrics-title">{title}</p>
      <p className="ta-metrics-value">{value}</p>
      {change && (
        <div className={`ta-metrics-change ${colorClass}`}>
          <Icon size={14} className="mr-1" />
          <span>{change}</span>
        </div>
      )}
      <style>{`
        .ta-metrics-card {
          padding: 1rem;
          background-color: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          position: relative;
          overflow: hidden;
        }
        .ta-metrics-title {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }
        .ta-metrics-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .ta-metrics-change {
          display: flex;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default MetricsCard;
import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className }) => {
  return (
    <div className={`ta-chart-card ${className || ''}`}>
      <h3 className="ta-chart-title">{title}</h3>
      <div className="ta-chart-content">
        {children}
      </div>
      <style>{`
        .ta-chart-card {
          padding: 1.5rem;
          background-color: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
        }
        .ta-chart-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }
        .ta-chart-content {
          /* The child (ResponsiveContainer) will handle the height */
        }
      `}</style>
    </div>
  );
};

export default ChartCard;
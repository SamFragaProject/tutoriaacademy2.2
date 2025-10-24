import React, { useState } from 'react';
import type { DateRange } from '../../services/adminMetrics';

interface FilterBarProps {
  onChange: (filters: { dateRange: DateRange }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onChange }) => {
  const [activeRange, setActiveRange] = useState<DateRange>('7d');

  const handleRangeChange = (range: DateRange) => {
    setActiveRange(range);
    onChange({ dateRange: range });
  };

  const ranges: { id: DateRange, label: string }[] = [
    { id: 'today', label: 'Hoy' },
    { id: '7d', label: '7 Días' },
    { id: '30d', label: '30 Días' },
  ];

  return (
    <div className="ta-filter-bar">
      <div className="ta-filter-group">
        {ranges.map(range => (
          <button
            key={range.id}
            onClick={() => handleRangeChange(range.id)}
            className={`ta-filter-btn ${activeRange === range.id ? 'active' : ''}`}
          >
            {range.label}
          </button>
        ))}
      </div>
      <style>{`
        .ta-filter-bar {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          background-color: var(--surface-1);
          border: 1px solid var(--border);
          border-radius: var(--radius-card);
        }
        .ta-filter-group {
          display: inline-flex;
          background-color: var(--surface-2);
          border-radius: var(--radius-button);
          padding: 0.25rem;
        }
        .ta-filter-btn {
          padding: 0.5rem 1rem;
          border: none;
          background-color: transparent;
          color: var(--text-secondary);
          border-radius: var(--radius-button);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        .ta-filter-btn:hover:not(.active) {
          background-color: var(--surface-1);
        }
        .ta-filter-btn.active {
          background-color: var(--primary);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default FilterBar;
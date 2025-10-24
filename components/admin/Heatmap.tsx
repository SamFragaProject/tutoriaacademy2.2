import React from 'react';

interface HeatmapProps {
  data: number[][]; // 7 days (rows) x 24 hours (cols)
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const hours = Array.from({ length: 12 }, (_, i) => `${i * 2}:00`); // Simplified labels

  return (
    <div className="ta-heatmap-container">
      <div className="ta-heatmap-y-axis">
        {days.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="ta-heatmap-grid">
        {data.flat().map((value, i) => (
          <div
            key={i}
            className="ta-heatmap-cell"
            style={{ backgroundColor: `rgba(0, 231, 255, ${value / 100})` }}
          >
            <div className="ta-heatmap-tooltip">{`${Math.floor(i / 24)}h, Día ${i % 7}: ${value} eventos`}</div>
          </div>
        ))}
      </div>
       <div className="ta-heatmap-x-axis">
        {hours.map(hour => <div key={hour}>{hour}</div>)}
      </div>
      <style>{`
        .ta-heatmap-container {
            display: grid;
            grid-template-areas: "y-axis grid" "empty x-axis";
            grid-template-columns: auto 1fr;
            grid-template-rows: 1fr auto;
            gap: 0.5rem;
            font-size: 0.75rem;
            color: var(--text-secondary);
        }
        .ta-heatmap-y-axis {
            grid-area: y-axis;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            text-align: right;
            padding-right: 0.5rem;
        }
        .ta-heatmap-x-axis {
            grid-area: x-axis;
            display: flex;
            justify-content: space-between;
            padding-top: 0.5rem;
        }
        .ta-heatmap-grid {
          grid-area: grid;
          display: grid;
          grid-template-columns: repeat(24, 1fr);
          grid-template-rows: repeat(7, 1fr);
          gap: 3px;
          background-color: rgba(0,0,0,0.2);
          padding: 5px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
        }
        .ta-heatmap-cell {
          aspect-ratio: 1.5 / 1;
          border-radius: 2px;
          position: relative;
          transition: transform 0.2s;
        }
        .ta-heatmap-cell:hover {
            transform: scale(1.2);
            z-index: 10;
            border: 1px solid white;
        }
        .ta-heatmap-tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 5px;
            background-color: var(--bg);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            white-space: nowrap;
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
        }
        .ta-heatmap-cell:hover .ta-heatmap-tooltip {
            visibility: visible;
            opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Heatmap;
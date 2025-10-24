import React from 'react';
import { ChevronsRight } from 'lucide-react';

interface FunnelChartProps {
  data: { step: string; value: number }[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxVal = data[0].value;

  return (
    <div className="ta-funnel-container">
      {data.map((item, index) => {
        const prevValue = index > 0 ? data[index - 1].value : 0;
        const dropOff = prevValue > 0 ? 100 - (item.value / prevValue * 100) : 0;

        return (
          <React.Fragment key={item.step}>
            {index > 0 && (
              <div className="ta-funnel-connector">
                <ChevronsRight size={24} className="text-muted" />
                <span className="ta-funnel-dropoff">-{dropOff.toFixed(1)}%</span>
              </div>
            )}
            <div className="ta-funnel-step">
              <div className="ta-funnel-label">{item.step}</div>
              <div className="ta-funnel-bar-wrapper">
                <div 
                  className="ta-funnel-bar" 
                  style={{ width: `${(item.value / maxVal) * 100}%` }}
                />
              </div>
              <div className="ta-funnel-value">{item.value.toLocaleString()}</div>
            </div>
          </React.Fragment>
        );
      })}
      <style>{`
        .ta-funnel-container {
          display: flex;
          align-items: center;
          gap: .5rem;
          padding: 1.5rem;
          background: var(--bg);
          border-radius: var(--radius);
          overflow-x: auto;
        }
        .ta-funnel-step {
          flex: 1;
          min-width: 150px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: .5rem;
        }
        .ta-funnel-label { font-size: .8rem; color: var(--text-secondary); font-weight: 500; }
        .ta-funnel-bar-wrapper { background: var(--surface); border-radius: 4px; height: 30px; }
        .ta-funnel-bar { height: 100%; background: linear-gradient(90deg, var(--purple), var(--cyan)); border-radius: 4px; transition: width .5s; }
        .ta-funnel-value { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }
        .ta-funnel-connector { display: flex; flex-direction: column; align-items: center; gap: .25rem; text-align: center; }
        .ta-funnel-dropoff { font-size: .75rem; color: var(--text-secondary); background: var(--surface); padding: 2px 6px; border-radius: 99px; }
      `}</style>
    </div>
  );
};

export default FunnelChart;

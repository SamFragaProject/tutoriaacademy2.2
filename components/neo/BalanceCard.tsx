import React from 'react';

export const BalanceCard: React.FC = () => {
  // Small illustrative data
  const data = [65, 92, 48, 80, 110, 74, 96];
  const max = Math.max(...data);
  return (
    <section className="neo-card">
      <div className="neo-card-header">
        <div className="neo-card-title">Balance</div>
        <div className="neo-muted" style={{fontSize:12}}>This month</div>
      </div>
      <div className="neo-card-body">
        <div className="neo-bars" aria-hidden>
          {data.map((v, i) => (
            <div key={i} className={`neo-bar ${i % 2 ? '' : ''}`} style={{height: `${(v/max)*100}%`}}>
              <div className="neo-bar-tip">{v}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex', justifyContent:'space-between', marginTop:8}}>
          <div className="neo-muted" style={{fontSize:12}}>Incoming <span style={{color:'var(--neo-primary)', fontWeight:700}}>$ 2032.20</span></div>
          <div className="neo-muted" style={{fontSize:12}}>Outgoing <span style={{color:'var(--neo-danger)', fontWeight:700}}>$ 3295.03</span></div>
        </div>
      </div>
    </section>
  );
};

export default BalanceCard;

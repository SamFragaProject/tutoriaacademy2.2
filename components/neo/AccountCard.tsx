import React from 'react';

type Tx = { title: string; subtitle: string; amount: number; fee?: number };

const Row: React.FC<{ tx: Tx }> = ({ tx }) => {
  const positive = tx.amount > 0;
  const clazz = positive ? 'neo-amount-pos' : tx.amount < 0 ? 'neo-amount-neg' : 'neo-amount-neu';
  const formatted = `${positive ? '+' : ''}${tx.amount.toLocaleString(undefined,{style:'currency',currency:'USD'})}`;
  return (
    <div className="neo-row" role="row">
      <div className="neo-row-ico" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
      </div>
      <div>
        <div className="neo-row-title">{tx.title}</div>
        <div className="neo-row-sub">{tx.subtitle} {tx.fee != null && <span className="neo-fee">• Fee {tx.fee.toFixed(2)}</span>}</div>
      </div>
      <div className={clazz} style={{justifySelf:'end'}}>{formatted}</div>
    </div>
  );
};

export const AccountCard: React.FC = () => {
  const txs: Tx[] = [
    { title: 'Transfer to Mike Davids', subtitle: '22/04/2025 12:52 • Sent', amount: -254.00 },
    { title: 'Refund Online Store', subtitle: '22/04/2025 12:30 • Received', amount: 42.14 },
    { title: 'Exchange', subtitle: '22/04/2025 06:51 • Sent', amount: 50.00, fee: 0.50 },
    { title: 'Subscription', subtitle: '16/04/2025 16:12 • Payment', amount: -12.99 },
    { title: 'Transfer to Antonio', subtitle: '09/04/2025 01:02 • Sent', amount: -254.00 },
  ];

  return (
    <section className="neo-card">
      <div className="neo-card-header">
        <div className="neo-card-title">My Account</div>
        <div>
          <span className="neo-pill">USD</span>
        </div>
      </div>
      <div className="neo-card-body">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
          <div>
            <div className="neo-muted" style={{fontSize:12}}>Available balance</div>
            <div className="neo-kpi" style={{color:'var(--neo-primary)'}}>$ 122,402.05</div>
          </div>
          <div style={{display:'flex', gap:10}}>
            <button className="neo-cta">+ Add</button>
            <button className="neo-cta" style={{background:'linear-gradient(135deg,#22C55E,#7C6BFF)'}}>Send</button>
          </div>
        </div>
        <div className="neo-muted" style={{fontSize:12, marginBottom:8}}>Transactions History</div>
        <div className="neo-list" role="table">
          {txs.map((t, i) => <Row key={i} tx={t} />)}
        </div>
      </div>
    </section>
  );
};

export default AccountCard;

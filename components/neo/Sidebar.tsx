import React from 'react';

type Item = { key: string; label: string; icon?: React.ReactNode; active?: boolean; };

const Icon = ({ path }: { path: string }) => (
  <svg className="neo-side-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={path} />
  </svg>
);

const items: Item[] = [
  { key: 'overview', label: 'Overview', active: true, icon: <Icon path="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h4v-6h6v6h4a1 1 0 001-1V10"/> },
  { key: 'transactions', label: 'Transactions', icon: <Icon path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 5v14"/> },
  { key: 'investing', label: 'Investing', icon: <Icon path="M3 3v18h18M7 15l3-3 4 4 4-6"/> },
  { key: 'cards', label: 'Cards', icon: <Icon path="M2 7h20v6H2z M2 13h20v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/> },
  { key: 'store', label: 'Store', icon: <Icon path="M3 7h18l-1 10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L3 7zm3-4h12l2 4H4l2-4z"/> },
  { key: 'statements', label: 'Statements', icon: <Icon path="M14 2H6a2 2 0 0 0-2 2v16l4-4h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/> },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="neo-card neo-sidebar">
      <div className="neo-brand">
        <div style={{width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#8b5cf6,#7c6bff)'}} />
        <span>Neo UI</span>
      </div>
      <ul className="neo-side-list">
        {items.map(it => (
          <li key={it.key}>
            <a className={`neo-side-item ${it.active ? 'active' : ''}`} href="#">
              {it.icon}
              <span>{it.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div style={{marginTop:'auto'}}>
        <div className="neo-card" style={{padding:16,borderRadius:18}}>
          <div className="neo-h1" style={{fontSize:14, marginBottom:6}}>Upgrade</div>
          <div className="neo-muted" style={{fontSize:12, marginBottom:10}}>Get more features and better limits.</div>
          <a className="neo-cta" href="#" aria-label="Upgrade plan">Go Pro</a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

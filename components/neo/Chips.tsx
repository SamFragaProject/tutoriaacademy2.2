import React from 'react';

type Chip = { icon: React.ReactNode; title: string; subtitle?: string };

export const ChipsRow: React.FC = () => {
  const chips: Chip[] = [
    { icon: flame(), title: 'Popular actions', subtitle: 'Shortcuts' },
    { icon: calendar(), title: 'Upcoming events', subtitle: '2 this week' },
    { icon: shield(), title: 'Security tips', subtitle: 'Review setup' },
    { icon: refresh(), title: 'New features', subtitle: 'Explore' },
    { icon: coin(), title: 'Rewards center', subtitle: 'Earn +120' },
  ];

  return (
    <div className="neo-chips" aria-label="Quick info">
      {chips.map((c, i) => (
        <div key={i} className="neo-chip">
          <div className="neo-chip-icon" aria-hidden>{c.icon}</div>
          <div>
            <div className="neo-chip-title">{c.title}</div>
            {c.subtitle && <div className="neo-chip-sub">{c.subtitle}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

const icon = (d: string) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);
const flame = () => icon("M8.5 14A3.5 3.5 0 0 0 12 17.5A3.5 3.5 0 0 0 15.5 14C15.5 10 12 7 12 7C12 7 8.5 10 8.5 14Z M12 22c5 0 8-3.5 8-8c0-4-3-7-8-11c-5 4-8 7-8 11c0 4.5 3 8 8 8z");
const calendar = () => icon("M3 8h18M8 2v4m8-4v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z");
const shield = () => icon("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z");
const refresh = () => icon("M21 12a9 9 0 1 1-2.64-6.36M21 3v7h-7");
const coin = () => icon("M12 3c4.97 0 9 2.24 9 5s-4.03 5-9 5s-9-2.24-9-5s4.03-5 9-5zm0 10c4.97 0 9 2.24 9 5s-4.03 5-9 5s-9-2.24-9-5s4.03-5 9-5z");

export default ChipsRow;

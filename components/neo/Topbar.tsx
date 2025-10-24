import React from 'react';

export const Topbar: React.FC = () => {
  return (
    <div className="neo-card neo-topbar">
      <div className="neo-search" role="search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input placeholder="Search for anything…" aria-label="Search" />
      </div>
      <button className="neo-cta">Create New</button>
      <div className="neo-avatar" aria-label="Profile" />
    </div>
  );
};

export default Topbar;

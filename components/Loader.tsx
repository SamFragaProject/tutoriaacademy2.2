import React from 'react';

const Loader: React.FC = () => (
  <div className="ta-loader-overlay">
    <div className="ta-loader-spinner"></div>
    <style>{`
      .ta-loader-overlay {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        min-height: 100px;
      }
      .ta-loader-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid var(--border);
        border-top-color: var(--cyan);
        border-radius: 50%;
        animation: ta-spin 0.8s linear infinite;
      }
      @keyframes ta-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);

export default Loader;
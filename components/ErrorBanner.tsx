import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => (
  <div role="alert" className="ta-error-banner">
    <AlertTriangle className="ta-error-icon" />
    <span className="ta-error-message">{message}</span>
    {onRetry && (
      <button onClick={onRetry} className="ta-retry-btn" aria-label="Reintentar">
        <RefreshCw size={16} />
        Reintentar
      </button>
    )}
    <style>{`
      .ta-error-banner {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: var(--radius);
        background-color: rgba(255, 77, 79, 0.1);
        border: 1px solid rgba(255, 77, 79, 0.2);
        color: #ff8a8b;
        margin: 1rem 0;
      }
      .ta-error-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
      }
      .ta-error-message {
        flex-grow: 1;
        font-size: 0.9rem;
      }
      .ta-retry-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 500;
        transition: background-color 0.2s;
        cursor: pointer;
      }
      .ta-retry-btn:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      .ta-retry-btn:focus-visible {
         outline: 2px solid var(--cyan);
         outline-offset: 2px;
      }
    `}</style>
  </div>
);

export default ErrorBanner;

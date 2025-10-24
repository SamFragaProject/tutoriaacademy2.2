import React from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './ui';

interface ResultSummaryProps {
  pct: number;
  correct: number;
  total: number;
  weakTopics: string[];
  elapsedSec: number;
  onRepeat: () => void;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ pct, correct, total, weakTopics, elapsedSec, onRepeat }) => {
  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="ta-result-card" aria-live="polite">
      <h2 className="ta-result-title">Simulacro Finalizado</h2>
      <div className="ta-summary-grid">
        <div className="ta-summary-item">
          <CheckCircle size={24} className="text-green-400" />
          <div>
            <p className="text-2xl font-bold">{pct}%</p>
            <p className="text-sm text-text-secondary">Aciertos ({correct}/{total})</p>
          </div>
        </div>
        <div className="ta-summary-item">
          <Clock size={24} className="text-primary" />
          <div>
            <p className="text-2xl font-bold">{formatTime(elapsedSec)}</p>
            <p className="text-sm text-text-secondary">Tiempo total</p>
          </div>
        </div>
      </div>

      <div className="ta-weak-topics-container">
        <h3 className="ta-weak-topics-title">
          <AlertTriangle size={18} />
          Temas a Repasar
        </h3>
        {weakTopics.length > 0 ? (
          <ul className="ta-weak-topics-list">
            {weakTopics.map((topic, i) => <li key={i}>{topic}</li>)}
          </ul>
        ) : <p className="text-text-secondary">¡Felicidades! No hay temas con errores recurrentes.</p>}
      </div>

      <div className="ta-result-actions">
        <SecondaryButton onClick={onRepeat}>Repetir Simulacro</SecondaryButton>
        <PrimaryButton><NavLink to="/app/dashboard">Volver al Dashboard</NavLink></PrimaryButton>
      </div>
      <style>{`
        /* Reusing some styles from ResultCard via class names */
        .ta-result-card { text-align: center; padding: 2.5rem; background-color: var(--surface-1); border: 1px solid var(--border); border-radius: var(--radius-card); max-width: 600px; margin: auto; }
        .ta-result-title { font-size: 1.75rem; font-weight: bold; color: var(--text-primary); margin-bottom: 2rem; }
        .ta-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
        .ta-summary-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background-color: var(--surface-2); border-radius: var(--radius-card); }
        .ta-weak-topics-container, .ta-result-actions { /* Styles defined in ResultCard.tsx */ }
        .ta-weak-topics-container { margin-bottom: 2rem; padding: 1.5rem; background-color: var(--surface-2); border-radius: var(--radius-card); text-align: left; }
        .ta-weak-topics-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1rem; }
        .ta-weak-topics-list { display: flex; flex-direction: column; gap: 0.5rem; list-style-position: inside; color: var(--text-secondary); }
        .ta-weak-topics-list li { background-color: var(--surface-1); padding: 8px 12px; border-radius: var(--radius-button); border: 1px solid var(--border); }
        .ta-result-actions { display: flex; justify-content: center; gap: 1rem; }
      `}</style>
    </div>
  );
};

export default ResultSummary;
import React from 'react';
import TopicSelector from './TopicSelector';
import type { Subject } from '../../types';

interface TutorControlPanelProps {
  onStartSession: (subject: Subject, topic: string, subTopic: string) => void;
  loading: boolean;
  difficulty: number; // Keep prop for future use, but don't display
}

const TutorControlPanel: React.FC<TutorControlPanelProps> = ({ onStartSession, loading }) => {
  const [selection, setSelection] = React.useState<{ subject: Subject, topic: string, subTopic: string } | null>(null);

  const handleTopicSelect = (subject: Subject, topic: string, subTopic: string) => {
    setSelection({ subject, topic, subTopic });
  };
  
  const handleStart = () => {
    if (selection) {
      onStartSession(selection.subject, selection.topic, selection.subTopic);
    }
  };

  return (
    <div className="ta-control-panel">
      <div className="ta-card p-4">
        <TopicSelector onTopicSelect={handleTopicSelect} />
        <button onClick={handleStart} className="ta-btn ta-btn--pri w-full mt-4" disabled={loading || !selection}>
          {loading ? 'Cargando...' : 'Iniciar Sesión Guiada'}
        </button>
      </div>

      <style>{`
        .ta-control-panel { display: flex; flex-direction: column; gap: 1rem; }
      `}</style>
    </div>
  );
};

export default TutorControlPanel;
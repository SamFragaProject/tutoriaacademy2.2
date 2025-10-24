import React, { useState, useEffect } from 'react';
import { Card, SecondaryButton } from '../ui';
import { Lightbulb, Edit2, PlusCircle, Check } from 'lucide-react';

interface TutorInsightsPanelProps {
  subTopic: string | null;
  onScheduleReview: (delay: number) => void;
}

const TutorInsightsPanel: React.FC<TutorInsightsPanelProps> = ({ subTopic, onScheduleReview }) => {
  const [notes, setNotes] = useState('');
  const [scheduled, setScheduled] = useState<number[]>([]);

  useEffect(() => {
    if (subTopic) {
        const savedNotes = localStorage.getItem(`notes:${subTopic}`);
        if (savedNotes) setNotes(savedNotes);
        setScheduled([]); // Reset on new topic
    }
    
    return () => {
        setNotes('');
    }
  }, [subTopic]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    if(subTopic) {
        localStorage.setItem(`notes:${subTopic}`, e.target.value);
    }
  };

  const handleScheduleClick = (delay: number) => {
    onScheduleReview(delay);
    setScheduled(prev => [...prev, delay]);
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <Card className="p-4">
        <h3 className="flex items-center gap-2 font-semibold text-text-secondary text-sm mb-3">
            <Lightbulb size={16} /> Acciones Rápidas
        </h3>
        <div className="space-y-2">
            {[1, 4, 10].map(delay => (
                <SecondaryButton 
                    key={delay} 
                    onClick={() => handleScheduleClick(delay)}
                    className="w-full justify-start text-xs py-1.5"
                    disabled={scheduled.includes(delay)}
                >
                    {scheduled.includes(delay) ? <Check size={14} className="text-green-400"/> : <PlusCircle size={14}/>}
                    <span>Agendar Repaso D{delay}</span>
                </SecondaryButton>
            ))}
        </div>
      </Card>
      <Card className="p-4 flex-grow flex flex-col">
        <h3 className="flex items-center gap-2 font-semibold text-text-secondary text-sm mb-3">
            <Edit2 size={16} /> Notas de la Sesión
        </h3>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder={`Anota aquí tus dudas o puntos clave sobre ${subTopic}...`}
          className="flex-grow w-full bg-surface border-border rounded-lg p-2 text-sm text-text-primary resize-none focus:ring-cyan focus:border-cyan"
        />
      </Card>
    </div>
  );
};

export default TutorInsightsPanel;
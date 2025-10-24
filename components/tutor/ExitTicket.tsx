import React, { useState } from 'react';
import type { ExitTicketState } from '../../types';
import { PrimaryButton, SecondaryButton } from '../ui';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface Props {
  state: ExitTicketState;
  onComplete: (score: number, confidence: number, timeMs: number) => void;
}

const ExitTicket: React.FC<Props> = ({ state, onComplete }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(state.answers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [confidence, setConfidence] = useState(0);

  const currentItem = state.items[currentIndex];

  const handleSelectOption = (optIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optIndex;
    setAnswers(newAnswers);
  };
  
  const handleFinish = () => {
    if (confidence === 0) {
        alert("Por favor, indica tu confianza general antes de finalizar.");
        return;
    }
    const correctCount = answers.filter((ans, i) => ans === state.items[i].correctIndex).length;
    const score = (correctCount / state.items.length) * 100;
    const timeMs = Date.now() - state.startTime;
    onComplete(score, confidence, timeMs);
  };

  const isLastQuestion = currentIndex === state.items.length - 1;

  return (
    <div className="flex flex-col items-center gap-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-white">Exit Ticket (Pregunta {currentIndex + 1} de {state.items.length})</h2>
      
      <div className="w-full bg-surface p-4 rounded-lg">
        <p className="font-semibold text-text-primary mb-4">{currentItem.question}</p>
        <div className="space-y-2">
            {currentItem.options.map((opt, i) => (
                <button key={i} onClick={() => handleSelectOption(i)} className={`w-full text-left p-3 border rounded-md transition-colors ${answers[currentIndex] === i ? 'bg-cyan/20 border-cyan' : 'bg-bg/50 border-border hover:border-purple'}`}>
                    {opt}
                </button>
            ))}
        </div>
      </div>
      
      <div className="flex justify-between w-full">
        <SecondaryButton onClick={() => setCurrentIndex(i => i - 1)} disabled={currentIndex === 0}><ArrowLeft size={16}/></SecondaryButton>
        {!isLastQuestion && <PrimaryButton onClick={() => setCurrentIndex(i => i + 1)} disabled={answers[currentIndex] === null}>Siguiente <ArrowRight size={16}/></PrimaryButton>}
      </div>

      {isLastQuestion && (
         <div className="mt-4 p-4 border-t border-border w-full space-y-3">
             <h4 className="text-sm font-semibold text-text-secondary mb-2 text-center">En general, ¿qué tan bien crees que te fue?</h4>
             <div className="flex justify-center gap-2">
                {[1,2,3,4,5].map(level => (
                    <button key={level} onClick={() => setConfidence(level)} className={`w-10 h-10 rounded-full border ${confidence === level ? 'bg-purple border-purple' : 'border-border'}`}>{level}</button>
                ))}
             </div>
            <PrimaryButton onClick={handleFinish} disabled={answers.includes(null)} className="w-full mt-2"><Check size={16}/> Finalizar y Ver Progreso</PrimaryButton>
         </div>
      )}
    </div>
  );
};

export default ExitTicket;

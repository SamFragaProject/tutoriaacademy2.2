import React, { useState } from 'react';
import type { PracticeState, Subject } from '../../types';
import MathMarkdown from '../MathMarkdown';
import { PrimaryButton, SecondaryButton } from '../ui';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { track } from '../../services/metrics';
import { useAuth } from '../../hooks/useAuth';
import * as studentProfileSvc from '../../services/studentProfile';
import DiscreteCitations from './DiscreteCitations';


interface Props {
  state: PracticeState;
  subject: Subject;
  subTopic: string;
  onComplete: () => void;
}

const PracticeInteraction: React.FC<Props> = ({ state, subject, subTopic, onComplete }) => {
  const { user } = useAuth();
  const [confidence, setConfidence] = useState<1 | 2 | 3 | undefined>();
  const [hintIndex, setHintIndex] = useState(-1);
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleConfidenceSelect = (level: 1 | 2 | 3) => {
    setConfidence(level);
    track('tutor_pro_interaction', { type: 'confidence_select', level, subTopic, userId: user?.id });
  };

  const handleShowHint = () => {
    setHintIndex(prev => {
        const nextIndex = Math.min(state.hints.length - 1, prev + 1);
        track('tutor_pro_interaction', { type: 'hint_used', hint: nextIndex + 1, subTopic, userId: user?.id });
        return nextIndex;
    });
  };
  
  const handleAnswerSubmit = (correct: boolean) => {
    setIsCorrect(correct);
    setShowSolution(true);
     if (user) {
        // FIX: Object literal may only specify known properties, and 'accuracyDelta' does not exist in type '{ isCorrect: boolean; questionDifficulty: number; confidence?: 1 | 2 | 3; }'.
        // The property `accuracyDelta` is not supported. Refactored to pass `isCorrect`
        // and a default `questionDifficulty`.
        studentProfileSvc.updateStudentSkill(user.id, subject, subTopic, {
            isCorrect: correct,
            questionDifficulty: 2.5, // Assuming average difficulty as question object is not available
            confidence
        });
    }
  };

  if (showSolution) {
    return (
      <div className="space-y-4">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
           {isCorrect ? <CheckCircle /> : <XCircle />}
           {isCorrect ? "¡Respuesta Correcta!" : "Repasemos la solución"}
        </h3>
        <div className="prose prose-invert text-text-primary max-w-none p-4 bg-surface-2 rounded-lg border border-border">
            <MathMarkdown content={state.solution} />
        </div>
        <DiscreteCitations citations={state.citations} />
        <div className="text-center mt-6 border-t border-border pt-4">
            <PrimaryButton onClick={onComplete}>Entendido, ir al Exit Ticket</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-2">Pregunta de Práctica</h3>
        <div className="prose prose-invert text-text-primary max-w-none">
            <MathMarkdown content={state.question} />
        </div>
      </div>

      {!confidence ? (
        <div>
          <h4 className="text-sm font-semibold text-text-secondary mb-2 text-center">¿Qué tan seguro te sientes de tu respuesta?</h4>
          <div className="flex justify-center gap-2">
            <button onClick={() => handleConfidenceSelect(1)} className="px-4 py-2 bg-surface-1 border border-border rounded-button hover:bg-red-500/20">1 (Baja)</button>
            <button onClick={() => handleConfidenceSelect(2)} className="px-4 py-2 bg-surface-1 border border-border rounded-button hover:bg-yellow-500/20">2 (Media)</button>
            <button onClick={() => handleConfidenceSelect(3)} className="px-4 py-2 bg-surface-1 border border-border rounded-button hover:bg-green-500/20">3 (Alta)</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
            {hintIndex >= 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-text-secondary mb-2">Pistas</h4>
                    <ul className="space-y-1">
                        {state.hints.slice(0, hintIndex + 1).map((hint, i) => (
                            <li key={i} className="text-xs text-text-secondary p-2 bg-surface-2/50 rounded-md flex gap-2 items-start">
                                <Lightbulb size={14} className="flex-shrink-0 mt-0.5 text-yellow-300"/>
                                <span>{hint}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-border">
                <SecondaryButton onClick={handleShowHint} disabled={hintIndex >= state.hints.length - 1}>
                    <Lightbulb size={16} /> Pedir Pista
                </SecondaryButton>
                <button onClick={() => handleAnswerSubmit(false)} className="px-6 py-2.5 font-semibold bg-red-900/50 text-red-300 border border-red-500/30 rounded-button hover:bg-red-900/80">Me equivoqué</button>
                <button onClick={() => handleAnswerSubmit(true)} className="px-6 py-2.5 font-semibold bg-green-900/50 text-green-300 border border-green-500/30 rounded-button hover:bg-green-900/80">¡La tengo!</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default PracticeInteraction;
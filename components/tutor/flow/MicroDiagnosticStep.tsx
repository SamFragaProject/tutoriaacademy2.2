import React, { useState } from 'react';
import type { PracticeState } from '../../../types';
import MathMarkdown from '../../MathMarkdown';
import { PrimaryButton } from '../../ui';
import DiscreteCitations from '../DiscreteCitations';

interface Props {
  item: PracticeState;
  onComplete: (result: { correct: boolean; confidence: 1 | 2 | 3 }) => void;
}

const MicroDiagnosticStep: React.FC<Props> = ({ item, onComplete }) => {
  const [confidence, setConfidence] = useState<1 | 2 | 3 | null>(null);
  const [answer, setAnswer] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (confidence === null || answer === null) return;
    onComplete({ correct: answer, confidence });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-cyan mb-2">Micro-Diagnóstico Rápido</h3>
        <div className="prose prose-invert text-text-primary max-w-none p-4 bg-bg/50 rounded-lg border border-border">
          <MathMarkdown content={item.question} />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-text-secondary mb-2 text-center">¿Conoces la respuesta?</h4>
        <div className="flex justify-center gap-4">
            <button onClick={() => setAnswer(true)} className={`px-6 py-2.5 rounded-pill border transition-colors ${answer === true ? 'bg-green-500/20 border-green-400' : 'bg-surface border-border hover:border-purple'}`}>Sí, la sé</button>
            <button onClick={() => setAnswer(false)} className={`px-6 py-2.5 rounded-pill border transition-colors ${answer === false ? 'bg-red-500/20 border-red-400' : 'bg-surface border-border hover:border-purple'}`}>No, necesito ayuda</button>
        </div>
      </div>

      {answer !== null && (
        <div>
          <h4 className="text-sm font-semibold text-text-secondary mb-2 text-center">¿Qué tan seguro te sientes?</h4>
          <div className="flex justify-center gap-2">
            <button onClick={() => setConfidence(1)} className={`px-4 py-2 rounded-pill border transition-colors ${confidence === 1 ? 'bg-purple/30 border-purple' : 'bg-surface border-border hover:border-purple'}`}>1 (Poco)</button>
            <button onClick={() => setConfidence(2)} className={`px-4 py-2 rounded-pill border transition-colors ${confidence === 2 ? 'bg-purple/30 border-purple' : 'bg-surface border-border hover:border-purple'}`}>2 (Medio)</button>
            <button onClick={() => setConfidence(3)} className={`px-4 py-2 rounded-pill border transition-colors ${confidence === 3 ? 'bg-purple/30 border-purple' : 'bg-surface border-border hover:border-purple'}`}>3 (Muy)</button>
          </div>
        </div>
      )}

      <DiscreteCitations citations={item.citations} />

      <div className="text-center pt-4 border-t border-border">
        <PrimaryButton onClick={handleSubmit} disabled={confidence === null || answer === null}>
          Continuar
        </PrimaryButton>
      </div>
    </div>
  );
};
export default MicroDiagnosticStep;
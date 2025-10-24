import React from 'react';
import { SecondaryButton } from '../../../components/ui';
import { Lightbulb, RefreshCw, ChevronsRight, BookOpen } from 'lucide-react';
import { track } from '../../shared/telemetry';

interface TutorControlsProps {
  step: 'explain' | 'workedExample' | 'practice' | 'check' | 'reflect';
  onHint: () => void;
  onAnotherExample: () => void;
  onExplainDifferently: () => void;
  onShowSteps: () => void; // For worked examples/practice
  isHintDisabled?: boolean;
  isLoading: boolean;
}

const TutorControls: React.FC<TutorControlsProps> = ({
  step,
  onHint,
  onAnotherExample,
  onExplainDifferently,
  onShowSteps,
  isHintDisabled,
  isLoading
}) => {
    const handleTrackedClick = (action: string, callback: () => void) => {
        track('tutor_action', { action, step });
        callback();
    };

  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
      {step === 'practice' && (
        <SecondaryButton onClick={() => handleTrackedClick('hint', onHint)} disabled={isHintDisabled || isLoading} className="text-sm">
          <Lightbulb size={16} className="mr-2" /> Pista
        </SecondaryButton>
      )}
      {step === 'explain' && (
         <SecondaryButton onClick={() => handleTrackedClick('explain_differently', onExplainDifferently)} disabled={isLoading} className="text-sm">
          <RefreshCw size={16} className="mr-2" /> Explicar Diferente
        </SecondaryButton>
      )}
      {(step === 'explain' || step === 'workedExample') && (
        <SecondaryButton onClick={() => handleTrackedClick('another_example', onAnotherExample)} disabled={isLoading} className="text-sm">
          <BookOpen size={16} className="mr-2" /> Otro Ejemplo
        </SecondaryButton>
      )}
      {(step === 'workedExample' || step === 'practice') && (
        <SecondaryButton onClick={() => handleTrackedClick('show_steps', onShowSteps)} disabled={isLoading} className="text-sm">
          <ChevronsRight size={16} className="mr-2" /> Mostrar Pasos
        </SecondaryButton>
      )}
    </div>
  );
};

export default TutorControls;
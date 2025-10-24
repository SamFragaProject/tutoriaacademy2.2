


import React from 'react';

const STEPS = ['Tema', 'Aprender', 'Evaluar', 'Resumen'];

interface TutorStepperProps {
  currentStep: number; // 0-indexed
}

const TutorStepper: React.FC<TutorStepperProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8 p-4 bg-surface/50 rounded-pill border border-border">
      {STEPS.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center text-center w-20">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold ${
              index < currentStep 
                ? 'bg-cyan border-cyan text-bg' 
                : index === currentStep
                ? 'bg-transparent border-cyan text-cyan scale-110'
                : 'bg-surface border-border text-text-secondary'
            }`}>
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className={`mt-2 text-xs font-medium transition-colors ${
              index <= currentStep ? 'text-text-primary' : 'text-muted'
            }`}>{step}</span>
          </div>
          {index < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
              index < currentStep ? 'bg-cyan' : 'bg-border'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TutorStepper;
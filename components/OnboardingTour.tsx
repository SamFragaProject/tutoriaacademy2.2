// components/OnboardingTour.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check, SkipForward, Home, User as UserIcon, Brain, Book, Bot, Pencil, Users, FileText, CheckSquare, Star, MessageSquare, Building, GraduationCap, BarChart3, Shield, Zap } from 'lucide-react';
import { Card, PrimaryButton, SecondaryButton, ProgressBar } from './ui';
import { useAuth } from '../hooks/useAuth';
import * as journeyService from '../services/userJourney';
import type { OnboardingStep } from '../services/userJourney';

const ICON_MAP: Record<string, React.ReactNode> = {
  home: <Home size={24} />,
  user: <UserIcon size={24} />,
  brain: <Brain size={24} />,
  book: <Book size={24} />,
  bot: <Bot size={24} />,
  pencil: <Pencil size={24} />,
  users: <Users size={24} />,
  file: <FileText size={24} />,
  checklist: <CheckSquare size={24} />,
  star: <Star size={24} />,
  message: <MessageSquare size={24} />,
  building: <Building size={24} />,
  graduation: <GraduationCap size={24} />,
  chart: <BarChart3 size={24} />,
  shield: <Shield size={24} />,
};

interface OnboardingTourProps {
  onComplete?: () => void;
  onDismiss?: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete, onDismiss }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [journeyState, setJourneyState] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Inicializar o cargar journey state
    const state = journeyService.getUserJourney(user.id) || journeyService.initializeUserJourney(user);
    setJourneyState(state);

    // Cargar pasos según el rol
    const roleSteps = journeyService.ONBOARDING_STEPS[user.role] || [];
    setSteps(roleSteps);

    // Establecer índice actual
    setCurrentStepIndex(state.currentStep);

    // Si el onboarding ya está completo, no mostrar
    if (state.onboardingCompleted) {
      setIsVisible(false);
    }
  }, [user]);

  if (!user || !isVisible || steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (currentStep) {
      // Marcar paso actual como completado
      const updatedState = journeyService.completeStep(user.id, currentStep.id);
      setJourneyState(updatedState);

      // Si hay más pasos, avanzar
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        // Onboarding completo
        handleComplete();
      }
    }
  };

  const handleSkip = () => {
    if (currentStep && currentStep.optional) {
      journeyService.skipStep(user.id, currentStep.id);
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleGoToStep = () => {
    if (currentStep) {
      // Marcar paso como completado y navegar
      journeyService.completeStep(user.id, currentStep.id);
      navigate(currentStep.route);
      
      // Si es el último paso, cerrar el tour
      if (isLastStep) {
        handleComplete();
      }
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={handleDismiss}
          />

          {/* Modal del tour */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-2xl mx-4"
          >
            <Card className="p-0 overflow-hidden border-2 border-primary/30">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10" />
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
                >
                  <X size={24} />
                </button>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      {ICON_MAP[currentStep?.icon] || <Zap size={24} />}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-1">
                        Paso {currentStepIndex + 1} de {steps.length}
                      </div>
                      <h2 className="text-2xl font-bold">{currentStep?.title}</h2>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <p className="text-lg text-text-secondary leading-relaxed">
                  {currentStep?.description}
                </p>

                {/* Lista de pasos completados */}
                <div className="bg-surface-2/50 rounded-xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-text-secondary mb-3">Tu progreso</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {steps.map((step, index) => {
                      const isCompleted = journeyState?.completedSteps?.includes(step.id);
                      const isCurrent = index === currentStepIndex;
                      const isSkipped = journeyState?.skippedSteps?.includes(step.id);

                      return (
                        <div
                          key={step.id}
                          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                            isCurrent
                              ? 'bg-primary/20 border border-primary/50'
                              : isCompleted
                              ? 'bg-green-500/10 border border-green-500/30'
                              : isSkipped
                              ? 'bg-slate-500/10 border border-slate-500/30'
                              : 'bg-surface-1 border border-border'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCompleted
                                ? 'bg-green-500 text-white'
                                : isCurrent
                                ? 'bg-primary text-white'
                                : isSkipped
                                ? 'bg-slate-500 text-white'
                                : 'bg-surface-2 text-text-secondary'
                            }`}
                          >
                            {isCompleted ? <Check size={14} /> : index + 1}
                          </div>
                          <span className="text-xs font-medium text-text-secondary truncate">
                            {step.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    {currentStep?.optional && (
                      <SecondaryButton onClick={handleSkip} className="text-sm">
                        <SkipForward size={16} />
                        Omitir (opcional)
                      </SecondaryButton>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {currentStepIndex > 0 && (
                      <SecondaryButton
                        onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                        className="text-sm"
                      >
                        <ChevronLeft size={16} />
                        Anterior
                      </SecondaryButton>
                    )}

                    <PrimaryButton onClick={handleGoToStep} className="text-sm">
                      {isLastStep ? (
                        <>
                          <Check size={16} />
                          ¡Empezar!
                        </>
                      ) : (
                        <>
                          Ir a esta sección
                          <ChevronRight size={16} />
                        </>
                      )}
                    </PrimaryButton>
                  </div>
                </div>

                {/* Hint */}
                <div className="text-center">
                  <p className="text-xs text-text-secondary">
                    💡 Completa estos pasos para aprovechar al máximo TutoriA Academy
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;

// components/GettingStartedCard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Sparkles, X } from 'lucide-react';
import { Card, PrimaryButton, SecondaryButton } from './ui';
import { useAuth } from '../hooks/useAuth';
import * as journeyService from '../services/userJourney';
import type { OnboardingStep } from '../services/userJourney';

interface GettingStartedCardProps {
  className?: string;
}

const GettingStartedCard: React.FC<GettingStartedCardProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });

  useEffect(() => {
    if (!user) return;

    // Verificar si el usuario ya lo cerró
    const dismissed = localStorage.getItem(`gettingStarted:${user.id}:dismissed`);
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Cargar pasos y progreso
    const roleSteps = journeyService.ONBOARDING_STEPS[user.role] || [];
    setSteps(roleSteps);

    const progressData = journeyService.getOnboardingProgress(user.id);
    setProgress(progressData);

    // Si ya completó todo, auto-cerrar
    if (progressData.percentage === 100) {
      setIsDismissed(true);
    }
  }, [user]);

  const handleDismiss = () => {
    if (user) {
      localStorage.setItem(`gettingStarted:${user.id}:dismissed`, 'true');
    }
    setIsDismissed(true);
  };

  const handleStepClick = (step: OnboardingStep) => {
    navigate(step.route);
  };

  if (!user || isDismissed || progress.percentage === 100) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="relative overflow-hidden border-2 border-primary/30">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className="relative p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-text-primary mb-2">
                ¡Comencemos! 🚀
              </h3>
              <p className="text-sm text-text-secondary">
                Completa estos pasos para configurar tu cuenta y aprovechar al máximo TutoriA Academy
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-secondary">
                Progreso general
              </span>
              <span className="text-xs font-bold text-primary">
                {progress.percentage}% completado
              </span>
            </div>
            <div className="h-3 bg-surface-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full"
              />
            </div>
            <p className="text-xs text-text-secondary mt-2">
              {progress.completed} de {progress.total} pasos completados
            </p>
          </div>

          {/* Steps list */}
          <div className="space-y-2">
            {steps.slice(0, 5).map((step, index) => {
              const isCompleted = user && journeyService.getUserJourney(user.id)?.completedSteps?.includes(step.id);

              return (
                <motion.button
                  key={step.id}
                  onClick={() => handleStepClick(step)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isCompleted
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-surface-2 border border-border hover:border-primary/50'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-surface-1 text-text-secondary border-2 border-border'
                    }`}
                  >
                    {isCompleted ? <Check size={14} /> : index + 1}
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={`text-sm font-medium ${
                        isCompleted ? 'text-green-400 line-through' : 'text-text-primary'
                      }`}
                    >
                      {step.title}
                    </p>
                    {!isCompleted && (
                      <p className="text-xs text-text-secondary">{step.description}</p>
                    )}
                  </div>
                  {!isCompleted && (
                    <ChevronRight size={16} className="text-text-secondary flex-shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <PrimaryButton
              onClick={() => {
                const nextStep = steps.find(s => !journeyService.getUserJourney(user.id)?.completedSteps?.includes(s.id));
                if (nextStep) navigate(nextStep.route);
              }}
              className="flex-1"
            >
              Continuar configuración
              <ChevronRight size={16} />
            </PrimaryButton>
            <SecondaryButton onClick={handleDismiss} className="text-sm">
              Más tarde
            </SecondaryButton>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default GettingStartedCard;

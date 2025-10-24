// components/FlowProgress.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle, Circle, ChevronRight, Zap } from 'lucide-react';
import { Card, PrimaryButton } from './ui';
import { useAuth } from '../hooks/useAuth';
import * as flowService from '../services/userFlows';
import type { FlowStage } from '../services/userFlows';

interface FlowProgressProps {
  className?: string;
  compact?: boolean;
}

const FlowProgress: React.FC<FlowProgressProps> = ({ className = '', compact = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [flowState, setFlowState] = useState<any>(null);
  const [allStages, setAllStages] = useState<FlowStage[]>([]);
  const [currentStage, setCurrentStage] = useState<FlowStage | null>(null);

  useEffect(() => {
    if (!user) return;

    // Cargar estado del flujo
    const state = flowService.getUserFlow(user.id) || flowService.initializeUserFlow(user);
    setFlowState(state);

    // Cargar todas las etapas
    const stages = flowService.getFlowForRole(user.role);
    setAllStages(stages);

    // Cargar etapa actual
    const current = flowService.getCurrentStage(user.id);
    setCurrentStage(current);
  }, [user]);

  if (!user || !flowState || allStages.length === 0) return null;

  const completionPercentage = flowState.flowCompletionPercentage || 0;
  const currentStageProgress = currentStage ? (flowState.stageProgress[currentStage.id] || 0) : 0;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target size={20} className="text-primary" />
              <h3 className="font-bold text-text-primary">Tu Recorrido</h3>
            </div>
            <span className="text-sm font-bold text-primary">{completionPercentage}%</span>
          </div>

          <div className="h-2 bg-surface-2 rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            />
          </div>

          {currentStage && (
            <div className="text-sm">
              <p className="text-text-secondary mb-1">Etapa actual:</p>
              <p className="font-semibold text-text-primary">{currentStage.name}</p>
            </div>
          )}
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Tu Recorrido de Aprendizaje</h3>
            <p className="text-sm text-text-secondary">
              Progreso general: {flowState.completedStages.length} de {allStages.length} etapas completadas
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {completionPercentage}%
            </div>
            <p className="text-xs text-text-secondary">Completado</p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-surface-2 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Stages Timeline */}
        <div className="space-y-4">
          {allStages.map((stage, index) => {
            const isCompleted = flowState.completedStages.includes(stage.id);
            const isCurrent = currentStage?.id === stage.id;
            const stageProgress = flowState.stageProgress[stage.id] || 0;
            const isLocked = !isCompleted && !isCurrent && index > 0 && !flowState.completedStages.includes(allStages[index - 1].id);

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-4 ${isLocked ? 'opacity-50' : ''}`}
              >
                {/* Icon/Status */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500'
                        : isCurrent
                        ? 'bg-primary/20 border-primary'
                        : 'bg-surface-2 border-border'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={24} className="text-white" />
                    ) : isCurrent ? (
                      <Target size={24} className="text-primary" />
                    ) : (
                      <Circle size={24} className="text-text-secondary" />
                    )}
                  </div>
                  {index < allStages.length - 1 && (
                    <div className="w-0.5 h-full bg-border my-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`font-bold ${isCurrent ? 'text-primary' : 'text-text-primary'}`}>
                        {stage.name}
                      </h4>
                      <p className="text-sm text-text-secondary mt-1">{stage.description}</p>
                    </div>
                    {isCurrent && (
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
                        Activo
                      </span>
                    )}
                  </div>

                  {/* Progress for current/incomplete stages */}
                  {(isCurrent || stageProgress > 0) && !isCompleted && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-text-secondary">Progreso</span>
                        <span className="font-bold text-primary">{stageProgress}%</span>
                      </div>
                      <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stageProgress}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions for current stage */}
                  {isCurrent && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stage.actions.slice(0, 2).map(action => (
                        <motion.button
                          key={action.id}
                          onClick={() => navigate(action.route)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            action.isPrimary
                              ? 'bg-primary text-white hover:bg-primary/90'
                              : 'bg-surface-2 text-text-primary border border-border hover:border-primary'
                          }`}
                        >
                          <span>{action.icon}</span>
                          <span>{action.label}</span>
                          <ChevronRight size={16} />
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Objective */}
                  {isCurrent && (
                    <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-400 mb-1">🎯 Objetivo</p>
                      <p className="text-xs text-text-secondary">{stage.objective}</p>
                    </div>
                  )}

                  {/* Completion badge */}
                  {isCompleted && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                      <CheckCircle size={14} />
                      Completado
                    </div>
                  )}

                  {/* Estimated time */}
                  <p className="text-xs text-text-secondary mt-2">
                    ⏱️ {stage.estimatedTime}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        {currentStage && (
          <div className="mt-6 pt-6 border-t border-border">
            <PrimaryButton
              onClick={() => {
                const primaryAction = currentStage.actions.find(a => a.isPrimary);
                if (primaryAction) navigate(primaryAction.route);
              }}
              className="w-full"
            >
              <Zap size={18} />
              Continuar con: {currentStage.name}
              <ChevronRight size={18} />
            </PrimaryButton>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default FlowProgress;

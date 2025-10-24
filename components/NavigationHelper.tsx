// components/NavigationHelper.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, X, ChevronDown, ChevronUp, Lightbulb, Zap, ArrowRight, HelpCircle } from 'lucide-react';
import { Card } from './ui';
import { useAuth } from '../hooks/useAuth';
import * as journeyService from '../services/userJourney';

const NavigationHelper: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [quickActions, setQuickActions] = useState<any[]>([]);
  const [nextAction, setNextAction] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // Actualizar última página visitada
    journeyService.updateLastVisitedPage(user.id, location.pathname);

    // Obtener sugerencias para la página actual
    const pageSuggestions = journeyService.PAGE_SUGGESTIONS[location.pathname] || [];
    setSuggestions(pageSuggestions);

    // Obtener quick actions según el rol
    const actions = journeyService.QUICK_ACTIONS[user.role] || [];
    setQuickActions(actions);

    // Obtener siguiente acción sugerida
    const suggested = journeyService.getNextSuggestedAction(user.id, location.pathname);
    setNextAction(suggested);
  }, [user, location.pathname]);

  if (!user) return null;

  // Si está minimizado, solo mostrar botón flotante
  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Compass size={24} className="group-hover:rotate-12 transition-transform" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
    >
      <Card className="p-0 overflow-hidden border-2 border-primary/30 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Compass size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Asistente de Navegación</h3>
              <p className="text-xs text-white/80">¿Qué quieres hacer ahora?</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/80 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                {/* Siguiente acción sugerida */}
                {nextAction && (
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Lightbulb size={20} className="text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-text-primary mb-1">
                          {nextAction.title}
                        </h4>
                        <p className="text-xs text-text-secondary mb-3">
                          {nextAction.description}
                        </p>
                        {nextAction.route !== location.pathname && (
                          <button
                            onClick={() => navigate(nextAction.route)}
                            className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                          >
                            Ir ahora
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div>
                  <h4 className="text-xs font-semibold text-text-secondary mb-3 flex items-center gap-2">
                    <Zap size={14} />
                    Acciones rápidas
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={index}
                        onClick={() => navigate(action.route)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-xl text-left transition-all ${
                          location.pathname === action.route
                            ? 'bg-primary/20 border-2 border-primary/50'
                            : 'bg-surface-2 border border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="text-2xl mb-2">{getIconEmoji(action.icon)}</div>
                        <div className="font-semibold text-xs text-text-primary mb-0.5">
                          {action.label}
                        </div>
                        <div className="text-[10px] text-text-secondary">
                          {action.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Sugerencias contextuales */}
                {suggestions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-text-secondary mb-3 flex items-center gap-2">
                      <HelpCircle size={14} />
                      Tips para esta página
                    </h4>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-xs text-text-secondary bg-surface-2 p-3 rounded-lg border border-border"
                        >
                          {suggestion}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progreso del onboarding */}
                {user && (
                  <OnboardingProgressWidget userId={user.id} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

// Widget de progreso del onboarding
const OnboardingProgressWidget: React.FC<{ userId: string }> = ({ userId }) => {
  const progress = journeyService.getOnboardingProgress(userId);

  if (progress.percentage === 100) return null;

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-text-primary">
          Configuración inicial
        </h4>
        <span className="text-xs font-bold text-purple-400">
          {progress.percentage}%
        </span>
      </div>
      <div className="h-2 bg-surface-1 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress.percentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        />
      </div>
      <p className="text-[10px] text-text-secondary">
        {progress.completed} de {progress.total} pasos completados
      </p>
    </div>
  );
};

// Helper para convertir nombres de iconos a emojis
function getIconEmoji(icon: string): string {
  const emojiMap: Record<string, string> = {
    pencil: '✏️',
    bot: '🤖',
    chart: '📊',
    gamepad: '🎮',
    file: '📄',
    star: '⭐',
    plus: '➕',
    message: '💬',
    users: '👥',
    graduation: '🎓',
  };
  return emojiMap[icon] || '⚡';
}

export default NavigationHelper;

// components/UnifiedAssistant.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Minimize2, Maximize2, Send, Sparkles, 
  Navigation, HelpCircle, Target, TrendingUp, Zap, ChevronRight,
  Bot, User as UserIcon, Lightbulb, CheckCircle, AlertTriangle
} from 'lucide-react';
import { Card, PrimaryButton, SecondaryButton } from './ui';
import { useAuth } from '../hooks/useAuth';
import * as flowService from '../services/userFlows';
import * as journeyService from '../services/userJourney';
import * as flowAssistantAI from '../services/flowAssistantAI';
import type { FlowStage, FlowAction, KPI } from '../services/userFlows';
import { useNavigate } from 'react-router-dom';

type AssistantTab = 'chat' | 'flow' | 'help' | 'kpis';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const UnifiedAssistant: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<AssistantTab>('flow');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Flow state
  const [currentStage, setCurrentStage] = useState<FlowStage | null>(null);
  const [flowState, setFlowState] = useState<any>(null);
  const [nextStage, setNextStage] = useState<FlowStage | null>(null);

  useEffect(() => {
    if (!user) return;

    // Inicializar flow
    const state = flowService.getUserFlow(user.id) || flowService.initializeUserFlow(user);
    setFlowState(state);

    // Cargar etapa actual
    const current = flowService.getCurrentStage(user.id);
    setCurrentStage(current);

    // Cargar siguiente etapa
    const next = flowService.getNextStage(user.id);
    setNextStage(next);

    // Cargar historial de conversación
    const savedHistory = flowAssistantAI.loadConversationHistory(user.id);
    if (savedHistory.length > 0) {
      setMessages(savedHistory.map((msg, idx) => ({
        id: idx.toString(),
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        suggestions: msg.role === 'assistant' ? flowAssistantAI.getContextualSuggestions(user.id, user.role) : undefined,
      })));
    } else {
      // Mensaje de bienvenida
      const suggestions = flowAssistantAI.getContextualSuggestions(user.id, user.role);
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `¡Hola ${user.name}! 👋 Soy tu asistente inteligente. Estoy aquí para ayudarte a navegar, resolver dudas y guiarte en tu progreso.\n\n¿En qué puedo ayudarte hoy?`,
          timestamp: new Date(),
          suggestions,
        },
      ]);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // Generar respuesta con IA real
      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }));

      const aiResponse = await flowAssistantAI.generateAssistantResponse(
        user.id,
        content,
        conversationHistory,
        user.role
      );

      const suggestions = flowAssistantAI.getContextualSuggestions(user.id, user.role);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        suggestions,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Guardar historial
      flowAssistantAI.saveConversationHistory(
        user.id,
        finalMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        }))
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback si falla la IA
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Disculpa, tuve un problema al procesar tu mensaje. ¿Puedes intentar de nuevo?',
        timestamp: new Date(),
        suggestions: ['¿Qué debo hacer ahora?', 'Ver mi progreso'],
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNavigateToAction = (action: FlowAction) => {
    navigate(action.route);
    // Actualizar progreso del stage
    if (user && currentStage) {
      const currentProgress = flowState?.stageProgress[currentStage.id] || 0;
      flowService.updateStageProgress(user.id, currentStage.id, Math.min(100, currentProgress + 20));
    }
  };

  if (!user) return null;

  // Vista minimizada
  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => {
          setIsMinimized(false);
          setIsOpen(true);
        }}
        className="fixed bottom-6 right-6 z-[60] w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center group"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
          {flowState && flowState.flowCompletionPercentage < 100 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center animate-pulse">
              !
            </div>
          )}
        </div>
      </motion.button>
    );
  }

  // Vista cerrada (solo botón)
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center group"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
      </motion.button>
    );
  }

  // Vista completa
  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-6 right-6 z-[60] w-[420px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)]"
    >
      <Card className="p-0 overflow-hidden border-2 border-primary/30 shadow-2xl h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Asistente Inteligente</h3>
              <p className="text-xs text-white/80">Siempre aquí para ayudarte</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <Minimize2 size={18} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-surface-1">
          {[
            { id: 'flow', label: 'Mi Flujo', icon: Target },
            { id: 'chat', label: 'Chat', icon: MessageSquare },
            { id: 'kpis', label: 'KPIs', icon: TrendingUp },
            { id: 'help', label: 'Ayuda', icon: HelpCircle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AssistantTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-background">
          <AnimatePresence mode="wait">
            {activeTab === 'flow' && (
              <FlowTab
                currentStage={currentStage}
                nextStage={nextStage}
                flowState={flowState}
                onNavigate={handleNavigateToAction}
                userId={user.id}
              />
            )}

            {activeTab === 'chat' && (
              <ChatTab
                messages={messages}
                isTyping={isTyping}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSendMessage={handleSendMessage}
                messagesEndRef={messagesEndRef}
              />
            )}

            {activeTab === 'kpis' && (
              <KPIsTab currentStage={currentStage} flowState={flowState} />
            )}

            {activeTab === 'help' && (
              <HelpTab role={user.role} />
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const FlowTab: React.FC<{
  currentStage: FlowStage | null;
  nextStage: FlowStage | null;
  flowState: any;
  onNavigate: (action: FlowAction) => void;
  userId: string;
}> = ({ currentStage, nextStage, flowState, onNavigate, userId }) => {
  if (!currentStage) {
    return (
      <div className="text-center py-8 text-text-secondary">
        <Target size={48} className="mx-auto mb-4 opacity-50" />
        <p>No hay flujo inicializado</p>
      </div>
    );
  }

  const progress = flowState?.stageProgress[currentStage.id] || 0;
  const completionPercentage = flowState?.flowCompletionPercentage || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-bold text-text-primary">Progreso General</h4>
          <span className="text-lg font-bold text-primary">{completionPercentage}%</span>
        </div>
        <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        </div>
      </div>

      {/* Current Stage */}
      <div className="bg-surface-2 rounded-xl p-4 border border-border">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Target size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-text-primary mb-1">{currentStage.name}</h4>
            <p className="text-xs text-text-secondary">{currentStage.description}</p>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-text-secondary">Progreso de etapa</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 bg-surface-1 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-3">
          <p className="text-xs font-semibold text-amber-400 mb-1">🎯 Objetivo</p>
          <p className="text-xs text-text-secondary">{currentStage.objective}</p>
        </div>

        <p className="text-xs text-text-secondary mb-3">
          ⏱️ Tiempo estimado: {currentStage.estimatedTime}
        </p>

        {/* Actions */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-secondary">Acciones recomendadas:</p>
          {currentStage.actions.map(action => (
            <motion.button
              key={action.id}
              onClick={() => onNavigate(action)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                action.isPrimary
                  ? 'bg-primary/20 border-2 border-primary/50 hover:border-primary'
                  : 'bg-surface-1 border border-border hover:border-primary/30'
              }`}
            >
              <span className="text-2xl">{action.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-text-primary">{action.label}</p>
                <p className="text-xs text-text-secondary">{action.description}</p>
              </div>
              <ChevronRight size={16} className="text-text-secondary" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Next Stage Preview */}
      {nextStage && progress > 70 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <p className="text-xs font-semibold text-green-400 mb-2">🎉 Próxima etapa</p>
          <p className="text-sm font-bold text-text-primary mb-1">{nextStage.name}</p>
          <p className="text-xs text-text-secondary">{nextStage.description}</p>
        </div>
      )}
    </motion.div>
  );
};

const ChatTab: React.FC<{
  messages: Message[];
  isTyping: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}> = ({ messages, isTyping, inputValue, onInputChange, onSendMessage, messagesEndRef }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full"
    >
      {/* Messages */}
      <div className="flex-1 space-y-4 mb-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user'
                ? 'bg-primary'
                : 'bg-gradient-to-br from-blue-500 to-purple-500'
            }`}>
              {message.role === 'user' ? (
                <UserIcon size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>
            <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-xl max-w-[85%] ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-surface-2 text-text-primary border border-border'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onSendMessage(suggestion)}
                      className="text-xs px-3 py-1.5 rounded-full bg-surface-2 border border-border hover:border-primary hover:bg-primary/10 transition-all text-text-secondary hover:text-primary"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-surface-2 border border-border rounded-xl p-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-text-secondary"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => onInputChange(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && onSendMessage(inputValue)}
          placeholder="Escribe tu pregunta..."
          className="flex-1 px-4 py-2 rounded-xl bg-surface-2 border border-border focus:border-primary focus:outline-none text-sm text-text-primary placeholder-text-secondary"
        />
        <button
          onClick={() => onSendMessage(inputValue)}
          disabled={!inputValue.trim()}
          className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  );
};

const KPIsTab: React.FC<{
  currentStage: FlowStage | null;
  flowState: any;
}> = ({ currentStage, flowState }) => {
  if (!currentStage) {
    return (
      <div className="text-center py-8 text-text-secondary">
        <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
        <p>No hay KPIs disponibles</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="bg-surface-2 rounded-xl p-4 border border-border">
        <h4 className="font-bold text-text-primary mb-3">KPIs de: {currentStage.name}</h4>
        <div className="space-y-3">
          {currentStage.kpis.map(kpi => {
            const current = flowState?.kpiValues[kpi.id] || kpi.current;
            const percentage = Math.min(100, (current / kpi.target) * 100);
            const isCompleted = current >= kpi.target;

            return (
              <div key={kpi.id} className="bg-surface-1 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">{kpi.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary">
                      {current} / {kpi.target} {kpi.unit}
                    </span>
                    {isCompleted && <CheckCircle size={16} className="text-green-500" />}
                  </div>
                </div>
                <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${
                      isCompleted ? 'bg-green-500' : 'bg-primary'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const HelpTab: React.FC<{ role: string }> = ({ role }) => {
  const helpContent = {
    alumno: [
      {
        icon: '📚',
        title: 'Cómo estudiar',
        description: 'Usa el tutor IA, revisa temarios y practica regularmente',
      },
      {
        icon: '🎯',
        title: 'Seguir tu progreso',
        description: 'Revisa dashboard, estadísticas y tu plan de estudio',
      },
      {
        icon: '🤖',
        title: 'Usar el tutor IA',
        description: 'Haz preguntas específicas, pide ejemplos y ejercicios',
      },
    ],
    docente: [
      {
        icon: '📝',
        title: 'Crear evaluaciones',
        description: 'Usa el creador con IA para generar exámenes rápidamente',
      },
      {
        icon: '⭐',
        title: 'Calificar eficientemente',
        description: 'Sistema inteligente con sugerencias de IA',
      },
      {
        icon: '📊',
        title: 'Monitorear estudiantes',
        description: 'Dashboard con métricas en tiempo real',
      },
    ],
    director: [
      {
        icon: '🏫',
        title: 'Gestión institucional',
        description: 'Configura escuela, profesores y estudiantes',
      },
      {
        icon: '📈',
        title: 'Analytics avanzados',
        description: 'Métricas de rendimiento y tendencias',
      },
      {
        icon: '🎯',
        title: 'Intervenciones',
        description: 'Identifica y actúa sobre problemas',
      },
    ],
  };

  const content = helpContent[role as keyof typeof helpContent] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
        <Lightbulb size={32} className="text-blue-400 mb-3" />
        <h4 className="font-bold text-text-primary mb-2">Centro de Ayuda</h4>
        <p className="text-sm text-text-secondary">
          Guías rápidas y tips para aprovechar al máximo la plataforma
        </p>
      </div>

      <div className="space-y-3">
        {content.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface-2 rounded-xl p-4 border border-border hover:border-primary transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{item.icon}</span>
              <div className="flex-1">
                <h5 className="font-semibold text-sm text-text-primary mb-1">{item.title}</h5>
                <p className="text-xs text-text-secondary">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <p className="text-sm font-semibold text-amber-400 mb-2">💬 ¿Necesitas más ayuda?</p>
        <p className="text-xs text-text-secondary mb-3">
          Usa el chat para hacer preguntas específicas o contacta a soporte
        </p>
        <button className="w-full px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-medium transition-all">
          Contactar Soporte
        </button>
      </div>
    </motion.div>
  );
};

export default UnifiedAssistant;

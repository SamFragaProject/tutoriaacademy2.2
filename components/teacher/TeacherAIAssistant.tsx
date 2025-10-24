/**
 * TeacherAIAssistant - Chatbot flotante para asistencia docente
 * Ayuda con: creación de exámenes, sugerencias pedagógicas, dudas, feedback
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Sparkles, FileText, HelpCircle, 
  Lightbulb, BookOpen, Loader2, Copy, ThumbsUp, ThumbsDown,
  Wand2, CheckCircle
} from 'lucide-react';
import { Card } from '../ui';
import MathMarkdown from '../MathMarkdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'suggestion' | 'question' | 'feedback' | 'help';
}

interface QuickAction {
  icon: React.ElementType;
  label: string;
  prompt: string;
  gradient: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: FileText,
    label: 'Crear Examen',
    prompt: 'Ayúdame a crear un examen de [materia] para [nivel educativo] sobre el tema [tema específico]',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    icon: Lightbulb,
    label: 'Ideas Pedagógicas',
    prompt: 'Dame ideas pedagógicas innovadoras para enseñar [tema] a estudiantes de [nivel]',
    gradient: 'from-yellow-500 to-orange-600',
  },
  {
    icon: Wand2,
    label: 'Generar Preguntas',
    prompt: 'Genera 5 preguntas de opción múltiple sobre [tema] con nivel de dificultad [fácil/medio/difícil]',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: BookOpen,
    label: 'Retroalimentación',
    prompt: 'Ayúdame a redactar feedback constructivo para un estudiante que [situación]',
    gradient: 'from-blue-500 to-cyan-600',
  },
];

export const TeacherAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu asistente de enseñanza inteligente. Estoy aquí para ayudarte con:\n\n• Crear exámenes y preguntas\n• Sugerencias pedagógicas\n• Redactar retroalimentación\n• Resolver dudas sobre enseñanza\n\n¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simular respuesta de IA (aquí integrarías con Gemini/OpenAI)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(content),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase();
    
    if (lower.includes('examen') || lower.includes('evaluación')) {
      return `# 📝 Sugerencias para tu Examen\n\nBasándome en tu solicitud, te recomiendo:\n\n## Estructura Sugerida\n\n1. **Sección de Opción Múltiple** (40%)\n   - 10 preguntas de nivel básico\n   - 5 preguntas de nivel intermedio\n\n2. **Preguntas Abiertas** (30%)\n   - 3 preguntas que requieran análisis\n\n3. **Resolución de Problemas** (30%)\n   - 2 problemas aplicados\n\n## Ejemplos de Preguntas\n\n**Opción Múltiple:**\n¿Cuál de las siguientes opciones describe mejor...?\n\nA) Opción 1\nB) Opción 2 ✓\nC) Opción 3\nD) Opción 4\n\n*Justificación:* Esta pregunta evalúa comprensión conceptual.\n\n¿Te gustaría que desarrolle más preguntas específicas?`;
    }
    
    if (lower.includes('pregunta') || lower.includes('generar')) {
      return `# 🎯 Preguntas Generadas\n\nAquí tienes 5 preguntas diseñadas según tus criterios:\n\n## Pregunta 1 (Nivel: Medio)\n**¿Cuál es la diferencia principal entre...?**\n\nA) Primera opción\nB) Segunda opción ✓\nC) Tercera opción\nD) Cuarta opción\n\n*Respuesta correcta:* B\n*Explicación:* La opción B es correcta porque...\n\n## Pregunta 2 (Nivel: Medio)\n**Relaciona los siguientes conceptos...**\n\n¿Necesitas que ajuste el nivel de dificultad o genere más preguntas?`;
    }
    
    if (lower.includes('feedback') || lower.includes('retroalimentación') || lower.includes('comentario')) {
      return `# 💬 Plantilla de Retroalimentación\n\nBasándome en la situación que describes, aquí tienes un feedback constructivo:\n\n## Aspectos Positivos\n\n✅ **Esfuerzo demostrado:** Reconoce el trabajo realizado\n✅ **Fortalezas identificadas:** Menciona áreas donde destacó\n\n## Áreas de Mejora\n\n📈 **Oportunidades de crecimiento:** [Área específica]\n   - Sugerencia concreta de mejora\n   - Recursos recomendados\n\n📈 **Siguiente paso:** [Acción específica]\n\n## Mensaje de Cierre\n\n"Confío en tu capacidad para mejorar en estas áreas. Si necesitas apoyo adicional, no dudes en acercarte."\n\n¿Te gustaría que personalice más este feedback?`;
    }
    
    if (lower.includes('pedagógica') || lower.includes('enseñar') || lower.includes('didáctica')) {
      return `# 💡 Estrategias Pedagógicas\n\nTe sugiero estas metodologías efectivas:\n\n## 1. Aprendizaje Activo\n\n🎯 **Técnica:** Aula invertida (Flipped Classroom)\n- Los estudiantes revisan material en casa\n- En clase: actividades prácticas y resolución de dudas\n- Aumenta participación y comprensión\n\n## 2. Gamificación\n\n🎮 **Técnica:** Sistema de puntos y niveles\n- Crea retos y misiones\n- Recompensas por logros\n- Fomenta competencia sana\n\n## 3. Pensamiento Visual\n\n🎨 **Técnica:** Mapas mentales y organizadores gráficos\n- Facilita comprensión de relaciones\n- Memoria visual más efectiva\n- Herramientas: MindMeister, Canva\n\n## 4. Evaluación Formativa\n\n📊 **Técnica:** Quizzes frecuentes y retroalimentación inmediata\n- Identifica dificultades temprano\n- Ajusta enseñanza en tiempo real\n\n¿Te gustaría profundizar en alguna estrategia?`;
    }
    
    return `Entiendo tu consulta. Para poder ayudarte mejor, ¿podrías darme más detalles sobre:\n\n• ¿Qué nivel educativo? (primaria, secundaria, preparatoria)\n• ¿Qué materia específica?\n• ¿Qué objetivo buscas lograr?\n\nMientras tanto, puedo ayudarte con:\n\n✓ Generar preguntas de examen\n✓ Crear rúbricas de evaluación\n✓ Sugerir actividades didácticas\n✓ Redactar retroalimentación\n✓ Resolver dudas pedagógicas`;
  };

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aquí podrías agregar un toast de confirmación
  };

  return (
    <>
      {/* Botón Flotante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl flex items-center justify-center group"
          >
            <MessageCircle className="w-7 h-7 text-white" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-purple-500/30 -z-10"
            />
            
            {/* Badge de notificación */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Ventana de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[450px] h-[650px] flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-surface-1 border-2 border-border"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Asistente Docente</h3>
                  <p className="text-white/80 text-xs">Powered by IA</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Acciones Rápidas */}
            <div className="p-4 bg-surface-2 border-b border-border">
              <p className="text-xs font-bold text-text-secondary mb-2">ACCIONES RÁPIDAS</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction(action.prompt)}
                    className={`
                      p-3 rounded-lg bg-gradient-to-br ${action.gradient} 
                      text-white text-left flex items-center gap-2 text-sm font-semibold
                      shadow-md hover:shadow-lg transition-all
                    `}
                  >
                    <action.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] rounded-2xl p-3
                    ${message.role === 'user' 
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' 
                      : 'bg-surface-2 text-text-primary border border-border'
                    }
                  `}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <MathMarkdown content={message.content} />
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                    
                    {/* Acciones del mensaje */}
                    {message.role === 'assistant' && idx > 0 && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copiar
                        </button>
                        <button className="text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button className="text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1">
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-surface-2 rounded-2xl p-3 border border-border">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-text-secondary">Pensando...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-surface-2">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Escribe tu pregunta..."
                  disabled={isLoading}
                  className="flex-1 bg-surface-1 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              <p className="text-xs text-text-secondary mt-2 text-center">
                💡 Consejo: Sé específico para obtener mejores respuestas
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

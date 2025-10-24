// components/ContextualHelp.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Lightbulb, BookOpen, Video, MessageCircle } from 'lucide-react';
import { Card, SecondaryButton } from './ui';

interface HelpContent {
  title: string;
  description: string;
  tips?: string[];
  videoUrl?: string;
  docsUrl?: string;
}

interface ContextualHelpProps {
  content: HelpContent;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({
  content,
  position = 'top-right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };

  const modalPosition = {
    'top-right': 'top-12 right-0',
    'top-left': 'top-12 left-0',
    'bottom-right': 'bottom-12 right-0',
    'bottom-left': 'bottom-12 left-0',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Help button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 flex items-center justify-center transition-all hover:scale-110"
        aria-label="Ayuda"
      >
        <HelpCircle size={18} />
      </button>

      {/* Help modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60]"
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute ${modalPosition[position]} z-[61] w-80 max-w-[calc(100vw-2rem)]`}
            >
              <Card className="p-0 overflow-hidden shadow-2xl border-2 border-blue-500/30">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb size={20} />
                      <h3 className="font-bold text-sm">Ayuda</h3>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <h4 className="font-semibold text-sm text-text-primary mb-2">
                      {content.title}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {content.description}
                    </p>
                  </div>

                  {/* Tips */}
                  {content.tips && content.tips.length > 0 && (
                    <div>
                      <h5 className="text-xs font-semibold text-text-secondary mb-2">
                        💡 Tips útiles
                      </h5>
                      <ul className="space-y-2">
                        {content.tips.map((tip, index) => (
                          <li
                            key={index}
                            className="text-xs text-text-secondary bg-surface-2 p-2 rounded-lg flex items-start gap-2"
                          >
                            <span className="text-blue-400 flex-shrink-0">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Links */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    {content.videoUrl && (
                      <a
                        href={content.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        <Video size={14} />
                        Ver video tutorial
                      </a>
                    )}
                    {content.docsUrl && (
                      <a
                        href={content.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        <BookOpen size={14} />
                        Leer documentación
                      </a>
                    )}
                    <button className="flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary transition-colors">
                      <MessageCircle size={14} />
                      Contactar soporte
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Hook para usar ayuda contextual fácilmente
export const useContextualHelp = () => {
  // Catálogo de ayudas predefinidas por página
  const helpCatalog: Record<string, HelpContent> = {
    'dashboard': {
      title: 'Tu Dashboard',
      description: 'Aquí puedes ver un resumen de tu actividad, progreso y próximas tareas. Las tarjetas se actualizan en tiempo real.',
      tips: [
        'Revisa tu racha de estudio diariamente para mantenerla activa',
        'Las materias con menor progreso aparecen destacadas',
        'Haz clic en cualquier tarjeta para ver más detalles',
      ],
    },
    'materias': {
      title: 'Tus Materias',
      description: 'Explora los temarios completos de cada materia. Los temas están organizados por complejidad.',
      tips: [
        'Los temas verdes ya los dominas',
        'Los temas naranjas necesitan refuerzo',
        'Haz clic en un tema para ver recursos y practicar',
      ],
    },
    'chat': {
      title: 'Tutor con IA',
      description: 'Tu asistente virtual puede explicarte cualquier tema, resolver dudas y generar ejercicios personalizados.',
      tips: [
        'Sé específico en tus preguntas para mejores respuestas',
        'Puedes pedir ejemplos, explicaciones paso a paso o ejercicios',
        'El modo guiado te ofrece una sesión de estudio estructurada',
      ],
    },
    'docente-dashboard': {
      title: 'Dashboard Docente',
      description: 'Vista general de tus grupos, actividad reciente y métricas clave de rendimiento.',
      tips: [
        'Los números se actualizan en tiempo real',
        'Usa las acciones rápidas para tareas comunes',
        'Revisa las alertas para identificar estudiantes que necesitan apoyo',
      ],
    },
    'crear-examen-ia': {
      title: 'Creador de Exámenes con IA',
      description: 'Genera exámenes automáticamente usando inteligencia artificial. Define el tema, dificultad y cantidad de preguntas.',
      tips: [
        'Define claramente el tema para mejores resultados',
        'Puedes regenerar preguntas individuales',
        'Revisa siempre las preguntas antes de asignar',
        'Usa la vista previa para ver cómo lo verán los estudiantes',
      ],
    },
    'calificaciones': {
      title: 'Sistema de Calificaciones',
      description: 'Califica de manera eficiente con sugerencias de IA y retroalimentación automática.',
      tips: [
        'Usa atajos de teclado (1-10) para calificar más rápido',
        'La IA puede sugerir comentarios de retroalimentación',
        'Filtra por estado para organizar tu trabajo',
        'Las estadísticas se actualizan automáticamente',
      ],
    },
  };

  const getHelpForPage = (pageKey: string): HelpContent => {
    return helpCatalog[pageKey] || {
      title: 'Ayuda',
      description: 'Si necesitas ayuda, contacta a nuestro equipo de soporte.',
      tips: [],
    };
  };

  return { getHelpForPage };
};

export default ContextualHelp;

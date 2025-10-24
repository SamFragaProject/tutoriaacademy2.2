import React from 'react';
import type { MockQ } from '../data/mockExam';
import { X, Edit, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewSheetProps {
  questions: MockQ[];
  answers: (number | null)[];
  onJump: (index: number) => void;
  onClose: () => void;
}

const ReviewSheet: React.FC<ReviewSheetProps> = ({ questions, answers, onJump, onClose }) => {
  const truncate = (text: string, length: number) => {
    const cleaned = text.replace(/\$\$.*?\$\$/g, '[Fórmula]');
    return cleaned.length > length ? `${cleaned.substring(0, length)}...` : cleaned;
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-surface-1 to-surface-2 border-2 border-border/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con gradiente */}
          <div className="relative p-6 border-b border-border/50 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-text-primary">Revisar Respuestas</h3>
                  <p className="text-sm text-text-secondary">
                    {answeredCount} de {questions.length} preguntas respondidas
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-surface-2 hover:bg-red-500/20 border border-border hover:border-red-500/50 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary hover:text-red-500" />
              </motion.button>
            </div>

            {/* Barra de progreso */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                <span className="font-semibold">Progreso de respuestas</span>
                <span className="font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full relative"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Lista de preguntas con scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
            {questions.map((q, i) => {
              const answerIndex = answers[i];
              const isAnswered = answerIndex !== null;
              
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`
                    relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                    ${isAnswered 
                      ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 hover:border-green-500/50' 
                      : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 hover:border-yellow-500/50'
                    }
                  `}
                  onClick={() => onJump(i)}
                >
                  <div className="flex items-start gap-4">
                    {/* Número de pregunta */}
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg
                      ${isAnswered
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                        : 'bg-gradient-to-br from-yellow-500 to-orange-600 text-white'
                      }
                    `}>
                      {i + 1}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary mb-2 line-clamp-2">
                        {truncate(q.text, 80)}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        {isAnswered ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-text-secondary truncate">
                              {truncate(q.options[answerIndex], 40)}
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            <span className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                              Sin responder
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Botón de editar */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onJump(i);
                      }}
                      className={`
                        flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors
                        ${isAnswered
                          ? 'bg-green-500/20 hover:bg-green-500/30 text-green-600'
                          : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-600'
                        }
                      `}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer con stats */}
          <div className="p-6 border-t border-border/50 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-black text-text-primary">{answeredCount}</span>
                </div>
                <p className="text-xs text-text-secondary font-semibold">Respondidas</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-black text-text-primary">{questions.length - answeredCount}</span>
                </div>
                <p className="text-xs text-text-secondary font-semibold">Pendientes</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-black text-text-primary">{questions.length}</span>
                </div>
                <p className="text-xs text-text-secondary font-semibold">Total</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--surface-2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #a855f7, #3b82f6);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9333ea, #2563eb);
        }
      `}</style>
    </AnimatePresence>
  );
};

export default ReviewSheet;
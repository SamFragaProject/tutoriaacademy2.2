import React from 'react';
import type { Question } from '../data/diagnostic';
import MathMarkdown from './MathMarkdown';
import { Card } from './ui';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

interface QuestionCardProps {
  q: Question;
  value: number | null;
  onChange: (index: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ q, value, onChange }) => {
  return (
    <Card className="!p-8 border-2" gradient="from-purple-500/5 to-blue-500/5">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-xl">?</span>
          </div>
          <div className="flex-1 text-lg leading-relaxed text-text-primary font-medium">
            <MathMarkdown content={q.text} />
          </div>
        </div>
      </motion.div>

      <div role="radiogroup" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {q.options.map((option, index) => {
          const isSelected = value === index;
          const letter = String.fromCharCode(65 + index);
          const colors = [
            { gradient: 'from-purple-500 to-purple-700', bg: 'bg-purple-500/10', border: 'border-purple-500/30', hoverBorder: 'hover:border-purple-500/60' },
            { gradient: 'from-blue-500 to-blue-700', bg: 'bg-blue-500/10', border: 'border-blue-500/30', hoverBorder: 'hover:border-blue-500/60' },
            { gradient: 'from-green-500 to-emerald-700', bg: 'bg-green-500/10', border: 'border-green-500/30', hoverBorder: 'hover:border-green-500/60' },
            { gradient: 'from-orange-500 to-red-600', bg: 'bg-orange-500/10', border: 'border-orange-500/30', hoverBorder: 'hover:border-orange-500/60' },
          ];
          const color = colors[index % colors.length];

          return (
            <motion.div
              key={index}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onChange(index)}
              onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onChange(index)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                isSelected 
                  ? `${color.bg} ${color.border} shadow-lg` 
                  : `bg-surface-2/50 border-border ${color.hoverBorder} hover:shadow-md`
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
            >
              {/* Gradient glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} opacity-0 ${isSelected ? 'opacity-5' : 'group-hover:opacity-5'} rounded-2xl transition-opacity duration-300`} />
              
              {/* Letter badge */}
              <div className="relative flex-shrink-0 z-10">
                <AnimatePresence mode="wait">
                  {isSelected ? (
                    <motion.div
                      key="selected"
                      initial={{ scale: 0.8, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0.8, rotate: 180 }}
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <CheckCircle className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unselected"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      className="w-10 h-10 rounded-xl bg-surface-1 border-2 border-border group-hover:border-primary/50 flex items-center justify-center transition-all duration-300"
                    >
                      <span className="font-black text-text-primary group-hover:text-primary transition-colors">
                        {letter}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Option text */}
              <div className="relative flex-1 text-text-primary z-10">
                <MathMarkdown content={option} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default QuestionCard;
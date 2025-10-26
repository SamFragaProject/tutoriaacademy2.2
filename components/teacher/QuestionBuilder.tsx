import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trash2,
  GripVertical,
  Plus,
  Check,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card } from '../ui';
import type { Question, QuestionType } from '../../types';

interface QuestionBuilderProps {
  question: Question;
  index: number;
  onChange: (question: Question) => void;
  onDelete: () => void;
}

const QUESTION_TYPES: Array<{ value: QuestionType; label: string }> = [
  { value: 'multiple_choice', label: 'Opción Múltiple' },
  { value: 'true_false', label: 'Verdadero/Falso' },
  { value: 'short_answer', label: 'Respuesta Corta' },
  { value: 'essay', label: 'Ensayo' },
  { value: 'numeric', label: 'Numérica' },
  { value: 'fill_blank', label: 'Llenar Espacios' },
  { value: 'matching', label: 'Relacionar Columnas' }
];

export const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  question,
  index,
  onChange,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateField = (field: keyof Question, value: any) => {
    onChange({ ...question, [field]: value });
  };

  const addOption = () => {
    const newOption = {
      id: opt-,
      text: '',
      isCorrect: false
    };
    onChange({
      ...question,
      options: [...(question.options || []), newOption]
    });
  };

  const updateOption = (optionIndex: number, field: string, value: any) => {
    const updatedOptions = question.options?.map((opt, i) => 
      i === optionIndex ? { ...opt, [field]: value } : opt
    ) || [];
    onChange({ ...question, options: updatedOptions });
  };

  const deleteOption = (optionIndex: number) => {
    const updatedOptions = question.options?.filter((_, i) => i !== optionIndex) || [];
    onChange({ ...question, options: updatedOptions });
  };

  const toggleCorrectOption = (optionIndex: number) => {
    const updatedOptions = question.options?.map((opt, i) => ({
      ...opt,
      isCorrect: i === optionIndex ? !opt.isCorrect : opt.isCorrect
    })) || [];
    onChange({ ...question, options: updatedOptions });
  };

  return (
    <Card className=\"border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors\">
      {/* Header */}
      <div className=\"flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700\">
        <div className=\"flex items-center space-x-3\">
          <button className=\"cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300\">
            <GripVertical className=\"w-5 h-5\" />
          </button>
          <div className=\"flex items-center space-x-2\">
            <span className=\"px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium\">
              Pregunta {index + 1}
            </span>
            <select
              value={question.type}
              onChange={(e) => updateField('type', e.target.value as QuestionType)}
              className=\"px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
            >
              {QUESTION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className=\"flex items-center space-x-2\">
          <input
            type=\"number\"
            min=\"0\"
            step=\"0.5\"
            value={question.points}
            onChange={(e) => updateField('points', parseFloat(e.target.value))}
            className=\"w-20 px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
            placeholder=\"Puntos\"
          />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className=\"p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors\"
          >
            {isExpanded ? <ChevronUp className=\"w-4 h-4\" /> : <ChevronDown className=\"w-4 h-4\" />}
          </button>
          <button
            onClick={onDelete}
            className=\"p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors\"
          >
            <Trash2 className=\"w-4 h-4\" />
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className=\"p-4 space-y-4\"
        >
          {/* Texto de la pregunta */}
          <div>
            <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
              Texto de la pregunta
            </label>
            <textarea
              value={question.text}
              onChange={(e) => updateField('text', e.target.value)}
              rows={3}
              className=\"w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
              placeholder=\"Escribe tu pregunta aquí... Puedes usar LaTeX: ^2 + y^2 = r^2$\"
            />
          </div>

          {/* Explicación/Hint */}
          <div>
            <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
              Explicación o pista (opcional)
            </label>
            <input
              type=\"text\"
              value={question.explanation || ''}
              onChange={(e) => updateField('explanation', e.target.value)}
              className=\"w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
              placeholder=\"Pista o explicación que se mostrará después\"
            />
          </div>

          {/* Contenido específico por tipo de pregunta */}
          {question.type === 'multiple_choice' && (
            <div className=\"space-y-3\">
              <div className=\"flex items-center justify-between\">
                <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300\">
                  Opciones de respuesta
                </label>
                <button
                  onClick={addOption}
                  className=\"flex items-center space-x-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm\"
                >
                  <Plus className=\"w-4 h-4\" />
                  <span>Agregar opción</span>
                </button>
              </div>

              {question.options?.map((option, optIdx) => (
                <div key={option.id} className=\"flex items-center space-x-2\">
                  <button
                    onClick={() => toggleCorrectOption(optIdx)}
                    className={\w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors \\}
                  >
                    {option.isCorrect && <Check className=\"w-4 h-4 text-white\" />}
                  </button>
                  <div className=\"w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300\">
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <input
                    type=\"text\"
                    value={option.text}
                    onChange={(e) => updateOption(optIdx, 'text', e.target.value)}
                    className=\"flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                    placeholder={\Opción \\}
                  />
                  <button
                    onClick={() => deleteOption(optIdx)}
                    className=\"p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors\"
                  >
                    <X className=\"w-4 h-4\" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {question.type === 'true_false' && (
            <div className=\"space-y-2\">
              <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                Respuesta correcta
              </label>
              <div className=\"grid grid-cols-2 gap-3\">
                <button
                  onClick={() => updateField('correctAnswer', 'true')}
                  className={\p-4 rounded-lg border-2 transition-all \\}
                >
                  <div className=\"font-semibold text-gray-900 dark:text-white\">Verdadero</div>
                </button>
                <button
                  onClick={() => updateField('correctAnswer', 'false')}
                  className={\p-4 rounded-lg border-2 transition-all \\}
                >
                  <div className=\"font-semibold text-gray-900 dark:text-white\">Falso</div>
                </button>
              </div>
            </div>
          )}

          {question.type === 'short_answer' && (
            <div className=\"space-y-3\">
              <div>
                <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                  Respuesta correcta
                </label>
                <input
                  type=\"text\"
                  value={question.correctAnswer || ''}
                  onChange={(e) => updateField('correctAnswer', e.target.value)}
                  className=\"w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                  placeholder=\"Escribe la respuesta correcta\"
                />
              </div>
              
              <div>
                <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                  Respuestas alternativas aceptables (opcional)
                </label>
                <input
                  type=\"text\"
                  value={question.acceptableAnswers?.join(', ') || ''}
                  onChange={(e) => updateField('acceptableAnswers', e.target.value.split(',').map(s => s.trim()))}
                  className=\"w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                  placeholder=\"Separa con comas: respuesta1, respuesta2\"
                />
              </div>

              <label className=\"flex items-center space-x-2\">
                <input
                  type=\"checkbox\"
                  checked={question.caseSensitive || false}
                  onChange={(e) => updateField('caseSensitive', e.target.checked)}
                  className=\"w-4 h-4 text-purple-600 rounded focus:ring-purple-600\"
                />
                <span className=\"text-sm text-gray-700 dark:text-gray-300\">
                  Sensible a mayúsculas/minúsculas
                </span>
              </label>
            </div>
          )}

          {question.type === 'numeric' && (
            <div>
              <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                Respuesta correcta (número)
              </label>
              <input
                type=\"number\"
                step=\"any\"
                value={question.correctAnswer || ''}
                onChange={(e) => updateField('correctAnswer', e.target.value)}
                className=\"w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                placeholder=\"Ej: 42\"
              />
            </div>
          )}

          {question.type === 'essay' && (
            <div className=\"bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4\">
              <p className=\"text-sm text-blue-800 dark:text-blue-200\">
                 Las preguntas de ensayo requieren calificación manual por parte del profesor.
              </p>
            </div>
          )}

          {question.type === 'fill_blank' && (
            <div className=\"space-y-3\">
              <div className=\"bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4\">
                <p className=\"text-sm text-yellow-800 dark:text-yellow-200\">
                   Usa <strong>___</strong> (tres guiones bajos) para indicar dónde va el espacio en blanco.
                </p>
              </div>
              
              <div>
                <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                  Respuesta correcta
                </label>
                <input
                  type=\"text\"
                  value={question.correctAnswer || ''}
                  onChange={(e) => updateField('correctAnswer', e.target.value)}
                  className=\"w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                  placeholder=\"Palabra o frase que va en el espacio\"
                />
              </div>
            </div>
          )}

          {question.type === 'matching' && (
            <div className=\"bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4\">
              <p className=\"text-sm text-orange-800 dark:text-orange-200\">
                 Las preguntas de relacionar columnas estarán disponibles próximamente.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </Card>
  );
};

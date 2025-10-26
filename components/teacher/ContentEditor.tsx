import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Send,
  FileText,
  Calendar,
  Users,
  Settings,
  Plus,
  Trash2,
  Copy,
  Eye,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, PrimaryButton, SecondaryButton, Chip } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import type { TeacherContent, Question, ContentType } from '../../types';
import * as contentManagement from '../../services/contentManagement';
import { QuestionBuilder } from './QuestionBuilder';

interface ContentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (content: TeacherContent) => void;
  editingContent?: TeacherContent | null;
  contentType?: ContentType;
}

const CONTENT_TYPES: Array<{ value: ContentType; label: string; description: string }> = [
  { value: 'task', label: 'Tarea', description: 'Trabajo para casa' },
  { value: 'practice', label: 'Repaso', description: 'Práctica en clase' },
  { value: 'exam', label: 'Examen', description: 'Evaluación formal' },
  { value: 'quiz', label: 'Quiz', description: 'Evaluación rápida' }
];

const SUBJECTS = [
  'Matemáticas', 'Física', 'Química', 'Biología', 
  'Historia', 'Geografía', 'Lengua', 'Literatura', 
  'Inglés', 'Informática', 'Arte', 'Educación Física'
];

export const ContentEditor: React.FC<ContentEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  editingContent,
  contentType = 'task'
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState<Partial<TeacherContent>>({
    type: contentType,
    title: '',
    description: '',
    subject: 'Matemáticas',
    tags: [],
    instructions: '',
    questions: [],
    gradingType: 'auto',
    allowLateSubmission: true,
    showCorrectAnswers: true,
    showCorrectAnswersAfter: 'after_due',
    shuffleQuestions: false,
    shuffleOptions: false,
    assignedGroups: [],
    attachments: []
  });
  
  const [currentTab, setCurrentTab] = useState<'info' | 'questions' | 'settings' | 'preview'>('info');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingContent) {
      setContent(editingContent);
    } else {
      setContent(prev => ({ ...prev, type: contentType }));
    }
  }, [editingContent, contentType]);

  const handleSave = async (publish: boolean = false) => {
    if (!user) return;

    // Validación
    const newErrors: Record<string, string> = {};
    if (!content.title?.trim()) newErrors.title = 'El título es requerido';
    if (!content.subject) newErrors.subject = 'La materia es requerida';
    if (content.questions?.length === 0) newErrors.questions = 'Agrega al menos una pregunta';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      let savedContent: TeacherContent;

      if (editingContent?.id) {
        // Actualizar
        savedContent = contentManagement.updateContent(editingContent.id, content as TeacherContent)!;
      } else {
        // Crear nuevo
        savedContent = contentManagement.createContent(
          user.id,
          user.name,
          user.schoolId || 'default-school',
          content
        );
      }

      if (publish && savedContent) {
        savedContent = contentManagement.publishContent(savedContent.id)!;
      }

      onSave?.(savedContent);
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: 'multiple_choice',
      text: '',
      options: [
        { id: 'opt1', text: '', isCorrect: false },
        { id: 'opt2', text: '', isCorrect: false },
        { id: 'opt3', text: '', isCorrect: false },
        { id: 'opt4', text: '', isCorrect: false }
      ],
      points: 1
    };

    setContent(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    setContent(prev => ({
      ...prev,
      questions: prev.questions?.map((q, i) => i === index ? updatedQuestion : q) || []
    }));
  };

  const deleteQuestion = (index: number) => {
    setContent(prev => ({
      ...prev,
      questions: prev.questions?.filter((_, i) => i !== index) || []
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !content.tags?.includes(tag)) {
      setContent(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setContent(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className=\"fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4\">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className=\"bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden\"
        >
          {/* Header */}
          <div className=\"flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700\">
            <div>
              <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white\">
                {editingContent ? 'Editar Contenido' : 'Crear Contenido'}
              </h2>
              <p className=\"text-sm text-gray-600 dark:text-gray-400 mt-1\">
                {CONTENT_TYPES.find(t => t.value === content.type)?.label || 'Contenido educativo'}
              </p>
            </div>
            <button
              onClick={onClose}
              className=\"p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors\"
            >
              <X className=\"w-6 h-6\" />
            </button>
          </div>

          {/* Tabs */}
          <div className=\"border-b border-gray-200 dark:border-gray-700\">
            <div className=\"flex space-x-8 px-6\">
              {[
                { id: 'info', label: 'Información', icon: FileText },
                { id: 'questions', label: Preguntas (), icon: Plus },
                { id: 'settings', label: 'Configuración', icon: Settings },
                { id: 'preview', label: 'Vista Previa', icon: Eye }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={\lex items-center space-x-2 py-4 border-b-2 transition-colors \\}
                >
                  <tab.icon className=\"w-5 h-5\" />
                  <span className=\"font-medium\">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className=\"p-6 overflow-y-auto\" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {/* Info Tab */}
            {currentTab === 'info' && (
              <div className=\"space-y-6\">
                {/* Tipo de contenido */}
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                    Tipo de contenido
                  </label>
                  <div className=\"grid grid-cols-2 md:grid-cols-4 gap-3\">
                    {CONTENT_TYPES.map(type => (
                      <button
                        key={type.value}
                        onClick={() => setContent(prev => ({ ...prev, type: type.value }))}
                        className={\p-4 rounded-lg border-2 transition-all \\}
                      >
                        <div className=\"font-semibold text-gray-900 dark:text-white\">{type.label}</div>
                        <div className=\"text-xs text-gray-600 dark:text-gray-400 mt-1\">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Título */}
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                    Título *
                  </label>
                  <input
                    type=\"text\"
                    value={content.title || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                    className=\"w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                    placeholder=\"Ej: Ecuaciones de primer grado\"
                  />
                  {errors.title && (
                    <p className=\"text-red-600 text-sm mt-1\">{errors.title}</p>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                    Descripción
                  </label>
                  <textarea
                    value={content.description || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className=\"w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                    placeholder=\"Descripción breve del contenido...\"
                  />
                </div>

                {/* Materia y Tema */}
                <div className=\"grid md:grid-cols-2 gap-4\">
                  <div>
                    <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                      Materia *
                    </label>
                    <select
                      value={content.subject || ''}
                      onChange={(e) => setContent(prev => ({ ...prev, subject: e.target.value }))}
                      className=\"w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                    >
                      {SUBJECTS.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                      Tema
                    </label>
                    <input
                      type=\"text\"
                      value={content.topic || ''}
                      onChange={(e) => setContent(prev => ({ ...prev, topic: e.target.value }))}
                      className=\"w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                      placeholder=\"Ej: Álgebra\"
                    />
                  </div>
                </div>

                {/* Instrucciones */}
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                    Instrucciones
                  </label>
                  <textarea
                    value={content.instructions || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={5}
                    className=\"w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                    placeholder=\"Instrucciones detalladas para los estudiantes...\\n\\nPuedes usar LaTeX para matemáticas: ^2 + y^2 = r^2$\"
                  />
                  <p className=\"text-xs text-gray-500 dark:text-gray-400 mt-1\">
                     Tip: Usa $ para fórmulas en línea y -Force para bloques de ecuaciones
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                    Etiquetas
                  </label>
                  <div className=\"flex flex-wrap gap-2 mb-2\">
                    {content.tags?.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        onRemove={() => removeTag(tag)}
                        color=\"purple\"
                      />
                    ))}
                  </div>
                  <input
                    type=\"text\"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(e.currentTarget.value.trim());
                        e.currentTarget.value = '';
                      }
                    }}
                    className=\"w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                    placeholder=\"Escribe una etiqueta y presiona Enter\"
                  />
                </div>
              </div>
            )}

            {/* Questions Tab */}
            {currentTab === 'questions' && (
              <div className=\"space-y-4\">
                <div className=\"flex items-center justify-between mb-6\">
                  <div>
                    <h3 className=\"text-lg font-semibold text-gray-900 dark:text-white\">
                      Preguntas
                    </h3>
                    <p className=\"text-sm text-gray-600 dark:text-gray-400\">
                      {content.questions?.length || 0} preguntas  Total: {content.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0} puntos
                    </p>
                  </div>
                  <PrimaryButton onClick={addQuestion}>
                    <Plus className=\"w-4 h-4 mr-2\" />
                    Agregar Pregunta
                  </PrimaryButton>
                </div>

                {errors.questions && (
                  <div className=\"flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg\">
                    <AlertCircle className=\"w-5 h-5 text-red-600\" />
                    <p className=\"text-red-600 dark:text-red-400\">{errors.questions}</p>
                  </div>
                )}

                {content.questions?.length === 0 ? (
                  <div className=\"text-center py-12\">
                    <FileText className=\"w-16 h-16 mx-auto text-gray-400 mb-4\" />
                    <p className=\"text-gray-600 dark:text-gray-400 mb-4\">
                      No hay preguntas aún
                    </p>
                    <PrimaryButton onClick={addQuestion}>
                      <Plus className=\"w-4 h-4 mr-2\" />
                      Crear primera pregunta
                    </PrimaryButton>
                  </div>
                ) : (
                  <div className=\"space-y-4\">
                    {content.questions?.map((question, index) => (
                      <QuestionBuilder
                        key={question.id || index}
                        question={question}
                        index={index}
                        onChange={(updated) => updateQuestion(index, updated)}
                        onDelete={() => deleteQuestion(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {currentTab === 'settings' && (
              <div className=\"space-y-6\">
                {/* Fecha de entrega */}
                <div className=\"grid md:grid-cols-2 gap-4\">
                  <div>
                    <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                      Fecha de entrega
                    </label>
                    <input
                      type=\"datetime-local\"
                      value={content.dueDate || ''}
                      onChange={(e) => setContent(prev => ({ ...prev, dueDate: e.target.value }))}
                      className=\"w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                    />
                  </div>

                  <div>
                    <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                      Duración estimada (minutos)
                    </label>
                    <input
                      type=\"number\"
                      value={content.estimatedDuration || ''}
                      onChange={(e) => setContent(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                      className=\"w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                      placeholder=\"30\"
                    />
                  </div>
                </div>

                {/* Configuraciones de calificación */}
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                    Tipo de calificación
                  </label>
                  <div className=\"grid grid-cols-2 gap-3\">
                    <button
                      onClick={() => setContent(prev => ({ ...prev, gradingType: 'auto' }))}
                      className={\p-4 rounded-lg border-2 transition-all \\}
                    >
                      <div className=\"font-semibold text-gray-900 dark:text-white\">Automática</div>
                      <div className=\"text-xs text-gray-600 dark:text-gray-400 mt-1\">Calificación instantánea</div>
                    </button>
                    
                    <button
                      onClick={() => setContent(prev => ({ ...prev, gradingType: 'manual' }))}
                      className={\p-4 rounded-lg border-2 transition-all \\}
                    >
                      <div className=\"font-semibold text-gray-900 dark:text-white\">Manual</div>
                      <div className=\"text-xs text-gray-600 dark:text-gray-400 mt-1\">Revisar personalmente</div>
                    </button>
                  </div>
                </div>

                {/* Opciones adicionales */}
                <div className=\"space-y-3\">
                  <label className=\"flex items-center space-x-3\">
                    <input
                      type=\"checkbox\"
                      checked={content.allowLateSubmission || false}
                      onChange={(e) => setContent(prev => ({ ...prev, allowLateSubmission: e.target.checked }))}
                      className=\"w-5 h-5 text-purple-600 rounded focus:ring-purple-600\"
                    />
                    <span className=\"text-sm font-medium text-gray-700 dark:text-gray-300\">
                      Permitir entregas tardías
                    </span>
                  </label>

                  <label className=\"flex items-center space-x-3\">
                    <input
                      type=\"checkbox\"
                      checked={content.showCorrectAnswers || false}
                      onChange={(e) => setContent(prev => ({ ...prev, showCorrectAnswers: e.target.checked }))}
                      className=\"w-5 h-5 text-purple-600 rounded focus:ring-purple-600\"
                    />
                    <span className=\"text-sm font-medium text-gray-700 dark:text-gray-300\">
                      Mostrar respuestas correctas
                    </span>
                  </label>

                  <label className=\"flex items-center space-x-3\">
                    <input
                      type=\"checkbox\"
                      checked={content.shuffleQuestions || false}
                      onChange={(e) => setContent(prev => ({ ...prev, shuffleQuestions: e.target.checked }))}
                      className=\"w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-600\"
                    />
                    <span className=\"text-sm font-medium text-gray-700 dark:text-gray-300\">
                      Mezclar orden de preguntas
                    </span>
                  </label>

                  <label className=\"flex items-center space-x-3\">
                    <input
                      type=\"checkbox\"
                      checked={content.shuffleOptions || false}
                      onChange={(e) => setContent(prev => ({ ...prev, shuffleOptions: e.target.checked }))}
                      className=\"w-5 h-5 text-purple-600 rounded focus:ring-purple-600\"
                    />
                    <span className=\"text-sm font-medium text-gray-700 dark:text-gray-300\">
                      Mezclar opciones de respuesta
                    </span>
                  </label>
                </div>

                {/* Intentos máximos */}
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                    Número máximo de intentos (dejar en blanco para ilimitado)
                  </label>
                  <input
                    type=\"number\"
                    min=\"1\"
                    value={content.maxAttempts || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, maxAttempts: e.target.value ? parseInt(e.target.value) : undefined }))}
                    className=\"w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent\"
                    placeholder=\"Ilimitado\"
                  />
                </div>
              </div>
            )}

            {/* Preview Tab */}
            {currentTab === 'preview' && (
              <div className=\"space-y-4\">
                <div className=\"bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6\">
                  <div className=\"flex items-start justify-between mb-4\">
                    <div>
                      <h3 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-2\">
                        {content.title || 'Sin título'}
                      </h3>
                      <div className=\"flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400\">
                        <span>{CONTENT_TYPES.find(t => t.value === content.type)?.label}</span>
                        <span></span>
                        <span>{content.subject}</span>
                        {content.topic && (
                          <>
                            <span></span>
                            <span>{content.topic}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Chip label={${content.questions?.length || 0} preguntas} color=\"purple\" />
                  </div>

                  {content.description && (
                    <p className=\"text-gray-700 dark:text-gray-300 mb-4\">
                      {content.description}
                    </p>
                  )}

                  {content.instructions && (
                    <div className=\"bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 mb-4\">
                      <h4 className=\"font-semibold text-gray-900 dark:text-white mb-2\">Instrucciones</h4>
                      <div className=\"text-gray-700 dark:text-gray-300 whitespace-pre-wrap\">
                        {content.instructions}
                      </div>
                    </div>
                  )}

                  {content.tags && content.tags.length > 0 && (
                    <div className=\"flex flex-wrap gap-2\">
                      {content.tags.map(tag => (
                        <span
                          key={tag}
                          className=\"px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium\"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {content.questions && content.questions.length > 0 && (
                  <div className=\"space-y-4\">
                    <h4 className=\"text-lg font-semibold text-gray-900 dark:text-white\">
                      Preguntas ({content.questions.length})
                    </h4>
                    {content.questions.map((question, index) => (
                      <Card key={question.id || index} className=\"p-6\">
                        <div className=\"flex items-start justify-between mb-3\">
                          <div className=\"flex-1\">
                            <div className=\"flex items-center space-x-2 mb-2\">
                              <span className=\"px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium\">
                                Pregunta {index + 1}
                              </span>
                              <span className=\"px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium\">
                                {question.points} {question.points === 1 ? 'punto' : 'puntos'}
                              </span>
                            </div>
                            <p className=\"text-gray-900 dark:text-white font-medium\">
                              {question.text || 'Sin texto'}
                            </p>
                          </div>
                        </div>

                        {question.type === 'multiple_choice' && question.options && (
                          <div className=\"space-y-2 mt-4\">
                            {question.options.map((option, optIdx) => (
                              <div
                                key={option.id}
                                className={\lex items-center space-x-3 p-3 rounded-lg \\}
                              >
                                <div className=\"w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-medium\">
                                  {String.fromCharCode(65 + optIdx)}
                                </div>
                                <span className=\"text-gray-700 dark:text-gray-300\">
                                  {option.text || 'Opción vacía'}
                                </span>
                                {option.isCorrect && (
                                  <CheckCircle className=\"w-5 h-5 text-green-600 ml-auto\" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className=\"flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50\">
            <SecondaryButton onClick={onClose}>
              Cancelar
            </SecondaryButton>
            
            <div className=\"flex items-center space-x-3\">
              <SecondaryButton
                onClick={() => handleSave(false)}
                disabled={saving}
              >
                <Save className=\"w-4 h-4 mr-2\" />
                Guardar borrador
              </SecondaryButton>
              
              <PrimaryButton
                onClick={() => handleSave(true)}
                disabled={saving}
              >
                <Send className=\"w-4 h-4 mr-2\" />
                {saving ? 'Publicando...' : 'Publicar'}
              </PrimaryButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

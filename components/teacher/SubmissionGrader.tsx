import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  Save,
  Send,
  ArrowLeft
} from "lucide-react";
import { Card, PrimaryButton, SecondaryButton } from "../ui";
import type { StudentSubmission, TeacherContent, Question } from "../../types";
import * as contentManagement from "../../services/contentManagement";

interface SubmissionGraderProps {
  submission: StudentSubmission;
  content: TeacherContent;
  onClose: () => void;
  onSave: () => void;
}

export const SubmissionGrader: React.FC<SubmissionGraderProps> = ({
  submission,
  content,
  onClose,
  onSave
}) => {
  const [grades, setGrades] = useState<Array<{
    questionId: string;
    points: number;
    feedback?: string;
  }>>([]);
  const [teacherComments, setTeacherComments] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize grades from submission
    const initialGrades = submission.answers.map(answer => ({
      questionId: answer.questionId,
      points: answer.points || 0,
      feedback: answer.feedback || ""
    }));
    setGrades(initialGrades);
    setTeacherComments(submission.teacherComments || "");
  }, [submission]);

  const updateGrade = (questionId: string, points: number) => {
    setGrades(prev => prev.map(g => 
      g.questionId === questionId ? { ...g, points } : g
    ));
  };

  const updateFeedback = (questionId: string, feedback: string) => {
    setGrades(prev => prev.map(g => 
      g.questionId === questionId ? { ...g, feedback } : g
    ));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      contentManagement.gradeSubmission(
        submission.id,
        content.teacherId,
        grades,
        teacherComments
      );
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving grades:", error);
    } finally {
      setSaving(false);
    }
  };

  const getQuestion = (questionId: string): Question | undefined => {
    return content.questions.find(q => q.id === questionId);
  };

  const getAnswer = (questionId: string) => {
    return submission.answers.find(a => a.questionId === questionId);
  };

  const getTotalPoints = () => {
    return grades.reduce((sum, g) => sum + g.points, 0);
  };

  const getPercentage = () => {
    return submission.maxScore > 0 
      ? Math.round((getTotalPoints() / submission.maxScore) * 100)
      : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {content.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{submission.studentName}</span>
                  </div>
                  {submission.submittedAt && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        Entregado: {new Date(submission.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {submission.isLate && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs font-medium">
                      Entrega tardía
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">
                  {getTotalPoints()} / {submission.maxScore}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {getPercentage()}%
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-6 mb-6">
          {content.questions.map((question, index) => {
            const answer = getAnswer(question.id);
            const grade = grades.find(g => g.questionId === question.id);

            return (
              <Card key={question.id} className="p-6">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm font-medium">
                          Pregunta {index + 1}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({question.points} {question.points === 1 ? "punto" : "puntos"})
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {question.text}
                      </p>
                    </div>
                  </div>

                  {/* Answer Display */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Respuesta del estudiante:
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      {Array.isArray(answer?.answer) 
                        ? answer.answer.join(", ")
                        : answer?.answer || "Sin respuesta"
                      }
                    </div>
                    {answer?.isCorrect !== undefined && (
                      <div className="mt-2 flex items-center space-x-2">
                        {answer.isCorrect ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-green-600">Correcta</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-sm text-red-600">Incorrecta</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Correct Answer (if available) */}
                  {question.correctAnswer && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
                      <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                        Respuesta correcta:
                      </div>
                      <div className="text-green-900 dark:text-green-100">
                        {question.correctAnswer}
                      </div>
                    </div>
                  )}

                  {/* Grading Section */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Puntos obtenidos
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={question.points}
                        step="0.5"
                        value={grade?.points || 0}
                        onChange={(e) => updateGrade(question.id, parseFloat(e.target.value))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Retroalimentación (opcional)
                      </label>
                      <input
                        type="text"
                        value={grade?.feedback || ""}
                        onChange={(e) => updateFeedback(question.id, e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="Comentario para el estudiante"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Teacher Comments */}
        <Card className="p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comentarios generales del profesor
          </label>
          <textarea
            value={teacherComments}
            onChange={(e) => setTeacherComments(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Escribe comentarios generales sobre el trabajo del estudiante..."
          />
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <SecondaryButton onClick={onClose}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton onClick={handleSubmit} disabled={saving}>
            <Send className="w-4 h-4 mr-2" />
            {saving ? "Guardando..." : "Guardar Calificación"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  FileText,
  Award,
  Save,
  X,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import * as teacherService from '../../services/teacher';
import { Card } from '../ui/card';
import { PrimaryButton, SecondaryButton } from '../ui';
import { useToast } from '../Toast';

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [gradeValue, setGradeValue] = useState<number>(0);
  const [gradeComment, setGradeComment] = useState<string>('');

  // Fetch task details
  const { data: task, isLoading: loadingTask, error: taskError } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => teacherService.fetchTaskById(taskId!),
    enabled: !!taskId,
  });

  // Fetch submissions
  const { data: submissions, isLoading: loadingSubmissions, error: submissionsError } = useQuery({
    queryKey: ['task-submissions', taskId],
    queryFn: () => teacherService.fetchTaskSubmissions(taskId!),
    enabled: !!taskId,
  });

  // Grade mutation
  const gradeMutation = useMutation({
    mutationFn: ({ entregaId, calificacion, comentarios }: { 
      entregaId: string; 
      calificacion: number; 
      comentarios?: string 
    }) => teacherService.gradeSubmission(entregaId, calificacion, comentarios),
    onSuccess: () => {
      addToast({
        type: 'success',
        message: '✅ Entrega calificada exitosamente',
      });
      queryClient.invalidateQueries({ queryKey: ['task-submissions', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['teacher-tasks'] });
      setGradingSubmissionId(null);
      setGradeValue(0);
      setGradeComment('');
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        message: `❌ Error al calificar: ${error.message}`,
      });
    },
  });

  const handleStartGrading = (submission: teacherService.TaskSubmission) => {
    setGradingSubmissionId(submission.id);
    setGradeValue(submission.calificacion || 0);
    setGradeComment(submission.comentarios || '');
  };

  const handleCancelGrading = () => {
    setGradingSubmissionId(null);
    setGradeValue(0);
    setGradeComment('');
  };

  const handleSubmitGrade = async (submission: teacherService.TaskSubmission) => {
    if (gradeValue < 0 || gradeValue > (task?.puntos || 100)) {
      addToast({
        type: 'error',
        message: `❌ La calificación debe estar entre 0 y ${task?.puntos || 100}`,
      });
      return;
    }

    await gradeMutation.mutateAsync({
      entregaId: submission.id.startsWith('pending-') ? '' : submission.id,
      calificacion: gradeValue,
      comentarios: gradeComment,
    });
  };

  if (loadingTask || loadingSubmissions) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Cargando detalles de la tarea...</p>
        </div>
      </div>
    );
  }

  if (taskError || submissionsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-2">Error al cargar</h3>
          <p className="text-text-secondary mb-4">
            {(taskError as Error)?.message || (submissionsError as Error)?.message}
          </p>
          <SecondaryButton onClick={() => navigate('/docente/tareas')}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a Tareas
          </SecondaryButton>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-2">Tarea no encontrada</h3>
          <SecondaryButton onClick={() => navigate('/docente/tareas')}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a Tareas
          </SecondaryButton>
        </div>
      </div>
    );
  }

  const sortedSubmissions = [...(submissions || [])].sort((a, b) => {
    // Primero: entregadas sin calificar
    if (a.estado === 'entregada' && b.estado !== 'entregada') return -1;
    if (a.estado !== 'entregada' && b.estado === 'entregada') return 1;
    // Luego: tardías
    if (a.estado === 'tarde' && b.estado !== 'tarde') return -1;
    if (a.estado !== 'tarde' && b.estado === 'tarde') return 1;
    // Finalmente: alfabético por apellido
    return `${a.alumno_apellido} ${a.alumno_nombre}`.localeCompare(
      `${b.alumno_apellido} ${b.alumno_nombre}`
    );
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <SecondaryButton onClick={() => navigate('/docente/tareas')} className="mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a Tareas
        </SecondaryButton>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary mb-2">{task.titulo}</h1>
            <p className="text-text-secondary">{task.descripcion}</p>
          </div>
          <PrimaryButton onClick={() => navigate(`/docente/tareas/${taskId}/editar`)}>
            <Edit className="w-5 h-5 mr-2" />
            Editar
          </PrimaryButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{task.total_alumnos}</p>
              <p className="text-sm text-text-secondary">Total Alumnos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{task.entregas_completadas}</p>
              <p className="text-sm text-text-secondary">Entregadas</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-500/5 to-amber-500/5 border-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{task.entregas_pendientes}</p>
              <p className="text-sm text-text-secondary">Pendientes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {task.promedio_calificacion > 0 ? task.promedio_calificacion.toFixed(1) : 'N/A'}
              </p>
              <p className="text-sm text-text-secondary">Promedio</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Task Info Card */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-2">
        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Información de la Tarea
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-text-secondary mb-1">Grupo</p>
            <p className="font-semibold text-text-primary">{task.grupo_nombre}</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Materia</p>
            <p className="font-semibold text-text-primary">{task.materia}</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Puntos</p>
            <p className="font-semibold text-text-primary">{task.puntos} pts</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Fecha de Entrega</p>
            <p className="font-semibold text-text-primary flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {new Date(task.fecha_entrega).toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-text-secondary mb-1">Creada</p>
            <p className="font-semibold text-text-primary">
              {new Date(task.fecha_creacion).toLocaleDateString('es-MX')}
            </p>
          </div>
        </div>
        {task.instrucciones && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-text-secondary mb-2">Instrucciones</p>
            <p className="text-text-primary whitespace-pre-wrap">{task.instrucciones}</p>
          </div>
        )}
      </Card>

      {/* Submissions List */}
      <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-2">
        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Entregas de Alumnos ({sortedSubmissions.length})
        </h2>

        <div className="space-y-3">
          <AnimatePresence>
            {sortedSubmissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card
                  className={`p-4 border-2 transition-all ${
                    submission.estado === 'pendiente'
                      ? 'bg-gray-50 border-gray-200'
                      : submission.estado === 'tarde'
                      ? 'bg-red-50 border-red-200'
                      : submission.estado === 'calificada'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-text-primary">
                          {submission.alumno_apellido}, {submission.alumno_nombre}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            submission.estado === 'pendiente'
                              ? 'bg-gray-200 text-gray-700'
                              : submission.estado === 'tarde'
                              ? 'bg-red-200 text-red-700'
                              : submission.estado === 'calificada'
                              ? 'bg-green-200 text-green-700'
                              : 'bg-blue-200 text-blue-700'
                          }`}
                        >
                          {submission.estado === 'pendiente'
                            ? 'Pendiente'
                            : submission.estado === 'tarde'
                            ? 'Tarde'
                            : submission.estado === 'calificada'
                            ? 'Calificada'
                            : 'Entregada'}
                        </span>
                      </div>

                      {submission.fecha_entrega && (
                        <p className="text-sm text-text-secondary mb-2">
                          Entregado: {new Date(submission.fecha_entrega).toLocaleString('es-MX')}
                        </p>
                      )}

                      {submission.contenido && (
                        <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                          {submission.contenido}
                        </p>
                      )}

                      {gradingSubmissionId === submission.id ? (
                        <div className="mt-3 p-4 bg-white rounded-lg border-2 border-primary">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-sm font-medium text-text-primary mb-1">
                                Calificación (0-{task.puntos})
                              </label>
                              <input
                                type="number"
                                min="0"
                                max={task.puntos}
                                value={gradeValue}
                                onChange={(e) => setGradeValue(Number(e.target.value))}
                                className="w-full px-3 py-2 border-2 border-border rounded-lg focus:border-primary focus:outline-none"
                                disabled={gradeMutation.isPending}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-text-primary mb-1">
                                Porcentaje
                              </label>
                              <input
                                type="text"
                                value={`${((gradeValue / task.puntos) * 100).toFixed(1)}%`}
                                readOnly
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-text-secondary"
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-text-primary mb-1">
                              Comentarios (opcional)
                            </label>
                            <textarea
                              value={gradeComment}
                              onChange={(e) => setGradeComment(e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border-2 border-border rounded-lg focus:border-primary focus:outline-none resize-none"
                              placeholder="Retroalimentación para el alumno..."
                              disabled={gradeMutation.isPending}
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSubmitGrade(submission)}
                              disabled={gradeMutation.isPending}
                              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {gradeMutation.isPending ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Guardando...
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4" />
                                  Guardar Calificación
                                </>
                              )}
                            </button>
                            <button
                              onClick={handleCancelGrading}
                              disabled={gradeMutation.isPending}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        submission.estado !== 'pendiente' && (
                          <div className="mt-3 flex items-center justify-between">
                            <div>
                              {submission.calificacion !== null && submission.calificacion !== undefined ? (
                                <div>
                                  <p className="text-lg font-bold text-primary">
                                    {submission.calificacion} / {task.puntos} pts
                                    <span className="text-sm font-normal text-text-secondary ml-2">
                                      ({((submission.calificacion / task.puntos) * 100).toFixed(1)}%)
                                    </span>
                                  </p>
                                  {submission.comentarios && (
                                    <p className="text-sm text-text-secondary mt-1">
                                      "{submission.comentarios}"
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-orange-600 font-semibold">Sin calificar</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleStartGrading(submission)}
                              className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              {submission.calificacion !== null ? 'Editar' : 'Calificar'}
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {sortedSubmissions.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
              <p className="text-text-secondary">No hay alumnos inscritos en este grupo</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TaskDetail;

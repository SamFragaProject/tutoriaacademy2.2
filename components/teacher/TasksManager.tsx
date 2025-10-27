import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Plus,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Loader2,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react';
import * as teacherService from '../../services/teacher';
import { Card } from '../ui/card';
import { PrimaryButton, SecondaryButton } from '../ui';

const TasksManager: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // Fetch tasks
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['teacher-tasks', user?.id],
    queryFn: () => teacherService.fetchTeacherTasks(user?.id || ''),
    enabled: !!user?.id,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: teacherService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-tasks'] });
    },
  });

  const handleDelete = async (taskId: string) => {
    if (confirm('¿Estás seguro de eliminar esta tarea? Esta acción no se puede deshacer.')) {
      await deleteMutation.mutateAsync(taskId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-2">Error al cargar tareas</h3>
          <p className="text-text-secondary mb-4">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Gestión de Tareas</h1>
            <p className="text-text-secondary mt-1">Crea y administra tareas para tus grupos</p>
          </div>
          <PrimaryButton onClick={() => navigate('/docente/tareas/crear')}>
            <Plus className="w-5 h-5 mr-2" />
            Nueva Tarea
          </PrimaryButton>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ClipboardList className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No hay tareas creadas</h3>
            <p className="text-text-secondary mb-4">Comienza creando tu primera tarea</p>
            <PrimaryButton onClick={() => navigate('/docente/tareas/crear')}>
              <Plus className="w-5 h-5 mr-2" />
              Crear Primera Tarea
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Gestión de Tareas</h1>
          <p className="text-text-secondary mt-1">
            {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'} creadas
          </p>
        </div>
        <PrimaryButton onClick={() => navigate('/docente/tareas/crear')}>
          <Plus className="w-5 h-5 mr-2" />
          Nueva Tarea
        </PrimaryButton>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{tasks.length}</p>
              <p className="text-sm text-text-secondary">Total Tareas</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {tasks.reduce((acc, t) => acc + (t.entregas_completadas || 0), 0)}
              </p>
              <p className="text-sm text-text-secondary">Entregas</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-500/5 to-amber-500/5 border-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {tasks.reduce((acc, t) => acc + (t.entregas_pendientes || 0), 0)}
              </p>
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
                {(tasks.reduce((acc, t) => acc + (t.promedio_calificacion || 0), 0) / tasks.length).toFixed(1)}
              </p>
              <p className="text-sm text-text-secondary">Promedio</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-2 hover:border-primary/50 transition-all bg-gradient-to-br from-purple-500/5 to-blue-500/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary mb-1">{task.titulo}</h3>
                      <p className="text-sm text-text-secondary flex items-center gap-2">
                        <span className="font-semibold text-primary">{task.grupo_nombre}</span>
                        <span>•</span>
                        <span>{task.materia}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/docente/tareas/${task.id}`)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => navigate(`/docente/tareas/${task.id}/editar`)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">{task.descripcion}</p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{task.entregas_completadas}</p>
                      <p className="text-xs text-green-700">Entregadas</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                      <p className="text-lg font-bold text-orange-600">{task.entregas_pendientes}</p>
                      <p className="text-xs text-orange-700">Pendientes</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <p className="text-lg font-bold text-red-600">{task.entregas_tarde}</p>
                      <p className="text-xs text-red-700">Tarde</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>Entrega: {new Date(task.fecha_entrega).toLocaleDateString('es-MX')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-600">
                        {task.puntos} pts
                      </span>
                      {task.promedio_calificacion > 0 && (
                        <span className="text-xs font-bold text-green-600">
                          Prom: {task.promedio_calificacion.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TasksManager;

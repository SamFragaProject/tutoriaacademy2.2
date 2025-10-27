import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Save, X, Loader2, AlertCircle, ClipboardList } from 'lucide-react';
import * as teacherService from '../../services/teacher';
import { Card } from '../ui/card';
import { PrimaryButton, SecondaryButton } from '../ui';
import { useToast } from '../Toast';

interface TaskFormData {
  titulo: string;
  descripcion: string;
  materia: string;
  grupo_id: string;
  fecha_entrega: string;
  puntos: number;
  instrucciones: string;
}

interface TaskFormErrors {
  titulo?: string;
  descripcion?: string;
  materia?: string;
  grupo_id?: string;
  fecha_entrega?: string;
  puntos?: string;
  instrucciones?: string;
}

const TaskForm: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!taskId;

  const [formData, setFormData] = useState<TaskFormData>({
    titulo: '',
    descripcion: '',
    materia: '',
    grupo_id: '',
    fecha_entrega: '',
    puntos: 100,
    instrucciones: '',
  });

  const [errors, setErrors] = useState<TaskFormErrors>({});

  // Fetch grupos del profesor
  const { data: grupos, isLoading: loadingGrupos } = useQuery({
    queryKey: ['teacher-groups', user?.id],
    queryFn: () => teacherService.fetchTeacherGroups(user?.id || ''),
    enabled: !!user?.id,
  });

  // Fetch tarea si estamos editando
  const { data: existingTask, isLoading: loadingTask } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => teacherService.fetchTaskById(taskId!),
    enabled: isEditing,
  });

  // Cargar datos de tarea existente
  useEffect(() => {
    if (existingTask) {
      setFormData({
        titulo: existingTask.titulo,
        descripcion: existingTask.descripcion,
        materia: existingTask.materia,
        grupo_id: existingTask.grupo_id,
        fecha_entrega: existingTask.fecha_entrega.split('T')[0], // Solo fecha
        puntos: existingTask.puntos,
        instrucciones: existingTask.instrucciones || '',
      });
    }
  }, [existingTask]);

  // Crear tarea
  const createMutation = useMutation({
    mutationFn: (data: teacherService.CreateTaskData) =>
      teacherService.createTask(user?.id || '', data),
    onSuccess: () => {
      addToast({
        type: 'success',
        message: '✅ Tarea creada exitosamente',
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-tasks'] });
      navigate('/docente/tareas');
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        message: `❌ Error al crear tarea: ${error.message}`,
      });
    },
  });

  // Actualizar tarea
  const updateMutation = useMutation({
    mutationFn: (data: Partial<teacherService.CreateTaskData>) =>
      teacherService.updateTask(taskId!, data),
    onSuccess: () => {
      addToast({
        type: 'success',
        message: '✅ Tarea actualizada exitosamente',
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      navigate('/docente/tareas');
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        message: `❌ Error al actualizar tarea: ${error.message}`,
      });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: TaskFormErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    if (!formData.grupo_id) {
      newErrors.grupo_id = 'Debes seleccionar un grupo';
    }
    if (!formData.fecha_entrega) {
      newErrors.fecha_entrega = 'La fecha de entrega es requerida';
    } else {
      const fechaEntrega = new Date(formData.fecha_entrega);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaEntrega < hoy) {
        newErrors.fecha_entrega = 'La fecha de entrega debe ser futura';
      }
    }
    if (formData.puntos <= 0) {
      newErrors.puntos = 'Los puntos deben ser mayores a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast({
        type: 'error',
        message: '❌ Por favor corrige los errores del formulario',
      });
      return;
    }

    const taskData: teacherService.CreateTaskData = {
      ...formData,
      fecha_entrega: new Date(formData.fecha_entrega).toISOString(),
    };

    if (isEditing) {
      await updateMutation.mutateAsync(taskData);
    } else {
      await createMutation.mutateAsync(taskData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name as keyof TaskFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Actualizar materia automáticamente al seleccionar grupo
  const handleGrupoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const grupoId = e.target.value;
    setFormData((prev) => ({ ...prev, grupo_id: grupoId }));
    
    const grupoSeleccionado = grupos?.find(g => g.id === grupoId);
    if (grupoSeleccionado) {
      setFormData((prev) => ({ ...prev, materia: grupoSeleccionado.materia }));
    }
    
    if (errors.grupo_id) {
      setErrors((prev) => ({ ...prev, grupo_id: undefined }));
    }
  };

  if (loadingGrupos || (isEditing && loadingTask)) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Cargando...</p>
        </div>
      </div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-text-primary">
            {isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea'}
          </h1>
        </div>
        <p className="text-text-secondary">
          {isEditing
            ? 'Actualiza la información de la tarea'
            : 'Completa el formulario para crear una nueva tarea para tus alumnos'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-2">
          <div className="space-y-6">
            {/* Información Básica */}
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  1
                </span>
                Información Básica
              </h2>

              <div className="space-y-4">
                {/* Título */}
                <div>
                  <label htmlFor="titulo" className="block text-sm font-medium text-text-primary mb-2">
                    Título de la Tarea *
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      errors.titulo ? 'border-red-500' : 'border-border'
                    } focus:border-primary focus:outline-none transition-colors`}
                    placeholder="Ej: Tarea de Álgebra - Ecuaciones Lineales"
                    disabled={isPending}
                  />
                  {errors.titulo && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.titulo}
                    </p>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium text-text-primary mb-2">
                    Descripción *
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      errors.descripcion ? 'border-red-500' : 'border-border'
                    } focus:border-primary focus:outline-none transition-colors resize-none`}
                    placeholder="Describe brevemente la tarea..."
                    disabled={isPending}
                  />
                  {errors.descripcion && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.descripcion}
                    </p>
                  )}
                </div>

                {/* Grupo y Materia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="grupo_id" className="block text-sm font-medium text-text-primary mb-2">
                      Grupo *
                    </label>
                    <select
                      id="grupo_id"
                      name="grupo_id"
                      value={formData.grupo_id}
                      onChange={handleGrupoChange}
                      className={`w-full px-4 py-2 rounded-lg border-2 ${
                        errors.grupo_id ? 'border-red-500' : 'border-border'
                      } focus:border-primary focus:outline-none transition-colors`}
                      disabled={isPending}
                    >
                      <option value="">Selecciona un grupo</option>
                      {grupos?.map((grupo) => (
                        <option key={grupo.id} value={grupo.id}>
                          {grupo.nombre} - {grupo.materia}
                        </option>
                      ))}
                    </select>
                    {errors.grupo_id && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.grupo_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="materia" className="block text-sm font-medium text-text-primary mb-2">
                      Materia
                    </label>
                    <input
                      type="text"
                      id="materia"
                      name="materia"
                      value={formData.materia}
                      readOnly
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-gray-50 text-text-secondary cursor-not-allowed"
                      placeholder="Se asigna automáticamente"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración */}
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  2
                </span>
                Configuración
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha de Entrega */}
                  <div>
                    <label htmlFor="fecha_entrega" className="block text-sm font-medium text-text-primary mb-2">
                      Fecha de Entrega *
                    </label>
                    <input
                      type="date"
                      id="fecha_entrega"
                      name="fecha_entrega"
                      value={formData.fecha_entrega}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border-2 ${
                        errors.fecha_entrega ? 'border-red-500' : 'border-border'
                      } focus:border-primary focus:outline-none transition-colors`}
                      disabled={isPending}
                    />
                    {errors.fecha_entrega && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fecha_entrega}
                      </p>
                    )}
                  </div>

                  {/* Puntos */}
                  <div>
                    <label htmlFor="puntos" className="block text-sm font-medium text-text-primary mb-2">
                      Puntos *
                    </label>
                    <input
                      type="number"
                      id="puntos"
                      name="puntos"
                      value={formData.puntos}
                      onChange={handleChange}
                      min="1"
                      max="1000"
                      className={`w-full px-4 py-2 rounded-lg border-2 ${
                        errors.puntos ? 'border-red-500' : 'border-border'
                      } focus:border-primary focus:outline-none transition-colors`}
                      disabled={isPending}
                    />
                    {errors.puntos && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.puntos}
                      </p>
                    )}
                  </div>
                </div>

                {/* Instrucciones */}
                <div>
                  <label htmlFor="instrucciones" className="block text-sm font-medium text-text-primary mb-2">
                    Instrucciones Detalladas (Opcional)
                  </label>
                  <textarea
                    id="instrucciones"
                    name="instrucciones"
                    value={formData.instrucciones}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder="Proporciona instrucciones detalladas para completar la tarea..."
                    disabled={isPending}
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Puedes incluir pasos específicos, recursos necesarios, formato de entrega, etc.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
            <PrimaryButton type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isEditing ? 'Actualizar Tarea' : 'Crear Tarea'}
                </>
              )}
            </PrimaryButton>
            <SecondaryButton
              type="button"
              onClick={() => navigate('/docente/tareas')}
              disabled={isPending}
            >
              <X className="w-5 h-5 mr-2" />
              Cancelar
            </SecondaryButton>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default TaskForm;

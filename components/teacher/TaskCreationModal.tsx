import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  FileText,
  Calendar,
  Users,
  Paperclip,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Clock
} from 'lucide-react';
import { Card, PrimaryButton, SecondaryButton, Chip } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { getGroupsByTeacher } from '../../data/schoolMockData';
import type { SchoolTask, SchoolGroup } from '../../data/schoolMockData';

// ============================
// INTERFACES
// ============================

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: SchoolTask) => void;
  editingTask?: SchoolTask | null;
}

interface TaskFormData {
  titulo: string;
  descripcion: string;
  materia: string;
  tipo: 'tarea' | 'proyecto' | 'practica' | 'lectura';
  instrucciones: string;
  puntosMaximos: number;
  gruposAsignados: string[];
  fechaLimite: string;
  horaLimite: string;
  permitirEntregasTardias: boolean;
  penalizacionTardia: number;
  requiereArchivos: boolean;
  maxArchivos: number;
  notificarEstudiantes: boolean;
  recursos: Array<{ nombre: string; url: string }>;
}

const INITIAL_FORM_DATA: TaskFormData = {
  titulo: '',
  descripcion: '',
  materia: 'Matemáticas',
  tipo: 'tarea',
  instrucciones: '',
  puntosMaximos: 20,
  gruposAsignados: [],
  fechaLimite: '',
  horaLimite: '23:59',
  permitirEntregasTardias: false,
  penalizacionTardia: 10,
  requiereArchivos: false,
  maxArchivos: 3,
  notificarEstudiantes: true,
  recursos: []
};

const TASK_TYPES = [
  { value: 'tarea', label: 'Tarea', icon: '', description: 'Actividad regular' },
  { value: 'proyecto', label: 'Proyecto', icon: '', description: 'Trabajo extenso' },
  { value: 'practica', label: 'Práctica', icon: '', description: 'Ejercicio práctico' },
  { value: 'lectura', label: 'Lectura', icon: '', description: 'Material de lectura' }
];

const SUBJECTS = [
  'Matemáticas', 'Física', 'Química', 'Biología', 'Historia', 
  'Geografía', 'Lengua', 'Literatura', 'Inglés', 'Informática'
];

export const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  isOpen, onClose, onSave, editingTask
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TaskFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [myGroups, setMyGroups] = useState<SchoolGroup[]>([]);

  useEffect(() => {
    if (user?.id && isOpen) {
      const groups = getGroupsByTeacher(user.id);
      setMyGroups(groups);
    }
  }, [user?.id, isOpen]);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        titulo: editingTask.titulo,
        descripcion: editingTask.descripcion,
        materia: editingTask.materia,
        tipo: editingTask.tipo as any,
        instrucciones: editingTask.instrucciones || '',
        puntosMaximos: editingTask.puntosMaximos,
        gruposAsignados: editingTask.gruposAsignados,
        fechaLimite: editingTask.fechaLimite,
        horaLimite: '23:59',
        permitirEntregasTardias: false,
        penalizacionTardia: 10,
        requiereArchivos: false,
        maxArchivos: 3,
        notificarEstudiantes: true,
        recursos: editingTask.recursos || []
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [editingTask, isOpen]);

  const updateFormData = (field: keyof TaskFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.titulo.trim()) newErrors.titulo = 'El título es requerido';
        if (formData.titulo.length < 5) newErrors.titulo = 'El título debe tener al menos 5 caracteres';
        if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
        if (formData.puntosMaximos < 1) newErrors.puntosMaximos = 'Los puntos deben ser al menos 1';
        break;
      case 2:
        if (!formData.instrucciones.trim()) newErrors.instrucciones = 'Las instrucciones son requeridas';
        if (formData.instrucciones.length < 20) newErrors.instrucciones = 'Las instrucciones deben tener al menos 20 caracteres';
        break;
      case 3:
        if (formData.gruposAsignados.length === 0) newErrors.gruposAsignados = 'Debe seleccionar al menos un grupo';
        break;
      case 4:
        if (!formData.fechaLimite) newErrors.fechaLimite = 'La fecha límite es requerida';
        else {
          const deadline = new Date(formData.fechaLimite);
          const now = new Date();
          if (deadline <= now) newErrors.fechaLimite = 'La fecha límite debe ser futura';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = (publish: boolean = false) => {
    if (!validateStep(currentStep)) return;

    const newTask: SchoolTask = {
      id: editingTask?.id || `task_${Date.now()}`,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      materia: formData.materia,
      tipo: formData.tipo,
      estado: publish ? 'asignada' : 'borrador',
      fechaCreacion: editingTask?.fechaCreacion || new Date().toISOString().split('T')[0],
      fechaLimite: formData.fechaLimite,
      gruposAsignados: formData.gruposAsignados,
      profesorId: user?.id || '',
      puntosMaximos: formData.puntosMaximos,
      entregasRecibidas: editingTask?.entregasRecibidas || 0,
      entregasCalificadas: editingTask?.entregasCalificadas || 0,
      promedioCalificacion: editingTask?.promedioCalificacion,
      instrucciones: formData.instrucciones,
      recursos: formData.recursos
    };

    onSave(newTask);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-1 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="bg-white h-full"
            />
          </div>

          <div className="flex justify-between mt-4 text-sm">
            <div className={currentStep === 1 ? 'font-bold' : 'opacity-60'}>1. Info</div>
            <div className={currentStep === 2 ? 'font-bold' : 'opacity-60'}>2. Contenido</div>
            <div className={currentStep === 3 ? 'font-bold' : 'opacity-60'}>3. Grupos</div>
            <div className={currentStep === 4 ? 'font-bold' : 'opacity-60'}>4. Deadline</div>
            <div className={currentStep === 5 ? 'font-bold' : 'opacity-60'}>5. Recursos</div>
            <div className={currentStep === 6 ? 'font-bold' : 'opacity-60'}>6. Revisar</div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <Step1_BasicInfo formData={formData} updateFormData={updateFormData} errors={errors} />}
            {currentStep === 2 && <Step2_Content formData={formData} updateFormData={updateFormData} errors={errors} />}
            {currentStep === 3 && <Step3_Assignment formData={formData} updateFormData={updateFormData} errors={errors} groups={myGroups} />}
            {currentStep === 4 && <Step4_Deadline formData={formData} updateFormData={updateFormData} errors={errors} />}
            {currentStep === 5 && <Step5_Resources formData={formData} updateFormData={updateFormData} errors={errors} />}
            {currentStep === 6 && <Step6_Review formData={formData} groups={myGroups} />}
          </AnimatePresence>
        </div>

        <div className="border-t border-border p-4 flex justify-between items-center bg-surface-2">
          <div className="text-sm text-text-secondary">Paso {currentStep} de {totalSteps}</div>
          <div className="flex gap-2">
            {currentStep > 1 && (
              <SecondaryButton onClick={handlePrevious}>
                <ChevronLeft size={18} className="mr-1" />
                Anterior
              </SecondaryButton>
            )}
            {currentStep < totalSteps ? (
              <PrimaryButton onClick={handleNext}>
                Siguiente
                <ChevronRight size={18} className="ml-1" />
              </PrimaryButton>
            ) : (
              <>
                <SecondaryButton onClick={() => handleSave(false)}>
                  <Save size={18} className="mr-2" />
                  Guardar Borrador
                </SecondaryButton>
                <PrimaryButton onClick={() => handleSave(true)}>
                  <Send size={18} className="mr-2" />
                  Publicar Tarea
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderKanban, Plus, Edit2, Trash2, Loader2, AlertCircle, Users, GraduationCap, TrendingUp } from 'lucide-react';
import { fetchAllGroups, deleteGroup } from '../../../services/admin';

export default function AdminGroups() {
  const queryClient = useQueryClient();
  const [selectedEscuela, setSelectedEscuela] = useState<string>('');

  const { data: grupos = [], isLoading, error } = useQuery({
    queryKey: ['admin-groups', { escuela_id: selectedEscuela }],
    queryFn: () => fetchAllGroups({
      escuela_id: selectedEscuela || undefined,
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
    },
  });

  const handleDelete = (grupoId: string, grupoNombre: string) => {
    if (window.confirm(`¿Estás seguro de desactivar el grupo "${grupoNombre}"?`)) {
      deleteMutation.mutate(grupoId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-600">Cargando grupos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar grupos</h3>
          <p className="text-gray-600">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Grupos</h1>
            <p className="text-gray-600">{grupos.length} grupos encontrados</p>
          </div>
          <button
            onClick={() => window.location.href = '/admin/grupos/nuevo'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear Grupo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grupos.map((grupo) => (
          <div key={grupo.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <FolderKanban className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{grupo.nombre}</h3>
                  <p className="text-sm text-gray-500">{grupo.materia}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Nivel:</span>
                <span className="font-medium text-gray-900">{grupo.nivel}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Profesor:</span>
                <span className="font-medium text-gray-900">{grupo.profesor_nombre}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Escuela:</span>
                <span className="font-medium text-gray-900">{grupo.escuela_nombre}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-green-50 rounded">
                <Users className="w-4 h-4 text-green-600 mx-auto mb-1" />
                <p className="text-sm font-bold text-gray-900">{grupo.total_alumnos}</p>
                <p className="text-xs text-gray-600">Alumnos</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <GraduationCap className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <p className="text-sm font-bold text-gray-900">
                  {grupo.promedio_general?.toFixed(1) || 'N/A'}
                </p>
                <p className="text-xs text-gray-600">Promedio</p>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <TrendingUp className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <p className="text-sm font-bold text-gray-900">
                  {grupo.tasa_asistencia?.toFixed(0) || 'N/A'}%
                </p>
                <p className="text-xs text-gray-600">Asist.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.location.href = `/admin/grupos/${grupo.id}/editar`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(grupo.id, grupo.nombre)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {grupos.length === 0 && (
        <div className="text-center py-12">
          <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay grupos creados</h3>
          <p className="text-gray-600 mb-4">Crea tu primer grupo para empezar</p>
          <button
            onClick={() => window.location.href = '/admin/grupos/nuevo'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Crear Primer Grupo
          </button>
        </div>
      )}
    </div>
  );
}

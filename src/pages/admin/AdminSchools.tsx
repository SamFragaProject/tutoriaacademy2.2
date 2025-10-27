import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { School, Plus, Edit2, Trash2, Loader2, AlertCircle, Users, GraduationCap, FolderKanban } from 'lucide-react';
import { fetchAllSchools, deleteSchool } from '../../../services/admin';

export default function AdminSchools() {
  const queryClient = useQueryClient();

  const { data: escuelas = [], isLoading, error } = useQuery({
    queryKey: ['admin-schools'],
    queryFn: fetchAllSchools,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-schools'] });
    },
  });

  const handleDelete = (escuelaId: string, escuelaNombre: string) => {
    if (window.confirm(`¿Estás seguro de desactivar la escuela "${escuelaNombre}"?`)) {
      deleteMutation.mutate(escuelaId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-600">Cargando escuelas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar escuelas</h3>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Escuelas</h1>
            <p className="text-gray-600">{escuelas.length} escuelas registradas</p>
          </div>
          <button
            onClick={() => window.location.href = '/admin/escuelas/nueva'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear Escuela
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {escuelas.map((escuela) => (
          <div key={escuela.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <School className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{escuela.nombre}</h3>
                  {escuela.director_nombre && (
                    <p className="text-sm text-gray-500">Dir: {escuela.director_nombre}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{escuela.total_profesores}</p>
                <p className="text-xs text-gray-600">Profesores</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{escuela.total_alumnos}</p>
                <p className="text-xs text-gray-600">Alumnos</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <FolderKanban className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{escuela.total_grupos}</p>
                <p className="text-xs text-gray-600">Grupos</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.location.href = `/admin/escuelas/${escuela.id}/editar`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(escuela.id, escuela.nombre)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {escuelas.length === 0 && (
        <div className="text-center py-12">
          <School className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay escuelas registradas</h3>
          <p className="text-gray-600 mb-4">Crea tu primera escuela para empezar</p>
          <button
            onClick={() => window.location.href = '/admin/escuelas/nueva'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Crear Primera Escuela
          </button>
        </div>
      )}
    </div>
  );
}

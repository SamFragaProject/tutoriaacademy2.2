import React, { useEffect, useState } from 'react';
import { AdminDataTable } from '../../src/components/admin/AdminDataTable';
import { getSchools, createSchool, updateSchool, deleteSchool, type AdminSchool } from '../../src/services/admin/adminSchools';
import { useToast } from '../../components/Toast';
import { Loader2 } from 'lucide-react';

export const AdminSchoolsPage: React.FC = () => {
  const [schools, setSchools] = useState<AdminSchool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    setIsLoading(true);
    const { data, error } = await getSchools();
    if (data) {
      setSchools(data);
    } else if (error) {
      addToast(<span>Error al cargar escuelas: {error.message}</span>);
    }
    setIsLoading(false);
  };

  const handleAdd = () => {
    addToast(<span>Función de agregar escuela próximamente</span>);
  };

  const handleEdit = (school: AdminSchool) => {
    addToast(<span>Editar escuela: {school.nombre}</span>);
  };

  const handleDelete = async (school: AdminSchool) => {
    if (!confirm(`¿Estás seguro de eliminar la escuela ${school.nombre}?`)) return;
    
    const { error } = await deleteSchool(school.id);
    if (error) {
      addToast(<span>Error al eliminar escuela: {error.message}</span>);
    } else {
      addToast(<span>Escuela eliminada correctamente</span>);
      loadSchools();
    }
  };

  const handleView = (school: AdminSchool) => {
    addToast(<span>Ver detalles de: {school.nombre}</span>);
  };

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre Escuela'
    },
    {
      key: 'ciudad',
      label: 'Ciudad',
      render: (school: AdminSchool) => `${school.ciudad || '-'}, ${school.pais || '-'}`
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'telefono',
      label: 'Teléfono'
    },
    {
      key: 'total_profesores',
      label: 'Profesores',
      render: (school: AdminSchool) => school.total_profesores || 0
    },
    {
      key: 'total_alumnos',
      label: 'Alumnos',
      render: (school: AdminSchool) => school.total_alumnos || 0
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (school: AdminSchool) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          school.activo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {school.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Gestión de Escuelas</h1>
        <p className="text-text-secondary mt-1">Administra las instituciones educativas</p>
      </div>

      <AdminDataTable
        title="Escuelas"
        data={schools}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchable={true}
        addButtonLabel="Nueva Escuela"
      />
    </div>
  );
};

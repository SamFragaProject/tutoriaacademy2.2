import React, { useEffect, useState } from 'react';
import { AdminDataTable } from '../../src/components/admin/AdminDataTable';
import { getUsers, createUser, updateUser, deleteUser, type AdminUser } from '../../src/services/admin/adminUsers';
import { useToast } from '../../components/Toast';
import { Loader2 } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    const { data, error } = await getUsers();
    if (data) {
      setUsers(data);
    } else if (error) {
      addToast(<span>Error al cargar usuarios: {error.message}</span>);
    }
    setIsLoading(false);
  };

  const handleAdd = () => {
    addToast(<span>Función de agregar usuario próximamente</span>);
  };

  const handleEdit = (user: AdminUser) => {
    addToast(<span>Editar usuario: {user.nombre}</span>);
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`¿Estás seguro de eliminar a ${user.nombre} ${user.apellido}?`)) return;
    
    const { error } = await deleteUser(user.id);
    if (error) {
      addToast(<span>Error al eliminar usuario: {error.message}</span>);
    } else {
      addToast(<span>Usuario eliminado correctamente</span>);
      loadUsers();
    }
  };

  const handleView = (user: AdminUser) => {
    addToast(<span>Ver detalles de: {user.nombre}</span>);
  };

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (user: AdminUser) => `${user.nombre} ${user.apellido}`
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'rol',
      label: 'Rol',
      render: (user: AdminUser) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          user.rol === 'admin' ? 'bg-purple-500/20 text-purple-400' :
          user.rol === 'profesor' ? 'bg-blue-500/20 text-blue-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
        </span>
      )
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (user: AdminUser) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          user.activo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {user.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Fecha Registro',
      render: (user: AdminUser) => new Date(user.created_at).toLocaleDateString('es-ES')
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
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Gestión de Usuarios</h1>
        <p className="text-text-secondary mt-1">Administra todos los usuarios del sistema</p>
      </div>

      <AdminDataTable
        title="Usuarios"
        data={users}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchable={true}
        addButtonLabel="Nuevo Usuario"
      />
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, Filter, Plus, MoreVertical, Edit, Trash2, Lock, Power, Download, Upload, Eye, UserCog } from 'lucide-react';
import { Card, PrimaryButton, SecondaryButton, Chip } from '../ui';
import type { User } from '../../types';
import * as adminUsersSvc from '../../services/adminUsers';
import Loader from '../Loader';
import ErrorBanner from '../ErrorBanner';
import { useToast } from '../../contexts/ToastContext';

interface UserManagementProps {
  onBulkImport?: () => void;
}

type UserFilter = {
  role: 'all' | 'student' | 'teacher' | 'admin';
  school: string;
  status: 'all' | 'active' | 'inactive';
};

type SortField = 'name' | 'email' | 'role' | 'lastActive' | 'createdAt';
type SortOrder = 'asc' | 'desc';

const UserManagement: React.FC<UserManagementProps> = ({ onBulkImport }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const { showToast } = useToast();
  
  const [filters, setFilters] = useState<UserFilter>({
    role: 'all',
    school: 'all',
    status: 'all'
  });

  const itemsPerPage = 50;

  // Cargar usuarios
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userList = await adminUsersSvc.getUsers();
      setUsers(userList);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar y ordenar usuarios
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Aplicar búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    // Aplicar filtros
    if (filters.role !== 'all') {
      result = result.filter(user => user.role === filters.role);
    }

    // Aplicar estado (asumimos que hay un campo active en User)
    if (filters.status !== 'all') {
      const isActive = filters.status === 'active';
      result = result.filter(user => (user as any).active === isActive);
    }

    // Ordenar
    result.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'email':
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case 'role':
          aVal = a.role;
          bVal = b.role;
          break;
        case 'lastActive':
          aVal = (a as any).lastActive || 0;
          bVal = (b as any).lastActive || 0;
          break;
        case 'createdAt':
          aVal = (a as any).createdAt || 0;
          bVal = (b as any).createdAt || 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, searchTerm, filters, sortField, sortOrder]);

  // Paginación
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAndSortedUsers.slice(start, end);
  }, [filteredAndSortedUsers, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map(u => u.id)));
    }
  };

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await adminUsersSvc.deleteUser(userId);
      showToast('Usuario eliminado correctamente', 'success');
      loadUsers();
    } catch (err) {
      showToast('Error al eliminar usuario', 'error');
      console.error(err);
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const newPassword = await adminUsersSvc.resetUserPassword(userId);
      showToast(`Contraseña reseteada: ${newPassword}`, 'success');
    } catch (err) {
      showToast('Error al resetear contraseña', 'error');
      console.error(err);
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await adminUsersSvc.toggleUserActive(userId, !currentStatus);
      showToast(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} correctamente`, 'success');
      loadUsers();
    } catch (err) {
      showToast('Error al cambiar estado', 'error');
      console.error(err);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete' | 'export') => {
    if (selectedUsers.size === 0) {
      showToast('Selecciona al menos un usuario', 'warning');
      return;
    }

    const userIds: string[] = Array.from(selectedUsers);

    switch (action) {
      case 'activate':
        try {
          await Promise.all(userIds.map(id => adminUsersSvc.toggleUserActive(id, true)));
          showToast(`${userIds.length} usuarios activados`, 'success');
          loadUsers();
          setSelectedUsers(new Set());
        } catch (err) {
          showToast('Error al activar usuarios', 'error');
        }
        break;

      case 'deactivate':
        try {
          await Promise.all(userIds.map(id => adminUsersSvc.toggleUserActive(id, false)));
          showToast(`${userIds.length} usuarios desactivados`, 'success');
          loadUsers();
          setSelectedUsers(new Set());
        } catch (err) {
          showToast('Error al desactivar usuarios', 'error');
        }
        break;

      case 'delete':
        if (!confirm(`¿Eliminar ${userIds.length} usuarios? Esta acción no se puede deshacer.`)) {
          return;
        }
        try {
          await Promise.all(userIds.map(id => adminUsersSvc.deleteUser(id)));
          showToast(`${userIds.length} usuarios eliminados`, 'success');
          loadUsers();
          setSelectedUsers(new Set());
        } catch (err) {
          showToast('Error al eliminar usuarios', 'error');
        }
        break;

      case 'export':
        exportUsersToCSV(userIds);
        break;
    }
  };

  const exportUsersToCSV = (userIds: string[]) => {
    const usersToExport = users.filter(u => userIds.includes(u.id));
    
    const headers = ['ID', 'Nombre', 'Email', 'Rol', 'Escuela', 'Activo', 'Fecha Creación'];
    const rows = usersToExport.map(u => [
      u.id,
      u.name,
      u.email,
      u.role,
      (u as any).schoolId || 'N/A',
      (u as any).active ? 'Sí' : 'No',
      (u as any).createdAt ? new Date((u as any).createdAt).toLocaleDateString() : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showToast(`${usersToExport.length} usuarios exportados`, 'success');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'teacher': return 'purple';
      case 'student': return 'cyan';
      default: return 'gray';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Super Admin';
      case 'teacher': return 'Profesor';
      case 'student': return 'Estudiante';
      default: return role;
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
          <p className="text-text-secondary text-sm mt-1">
            {filteredAndSortedUsers.length} usuario{filteredAndSortedUsers.length !== 1 ? 's' : ''} encontrado{filteredAndSortedUsers.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex gap-2">
          {onBulkImport && (
            <SecondaryButton onClick={onBulkImport} icon={Upload}>
              Importar CSV
            </SecondaryButton>
          )}
          <PrimaryButton onClick={handleCreateUser} icon={Plus}>
            Crear Usuario
          </PrimaryButton>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadUsers} />}

      {/* Barra de búsqueda y filtros */}
      <Card>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <SecondaryButton
              onClick={() => setShowFilters(!showFilters)}
              icon={Filter}
            >
              Filtros {showFilters && '✓'}
            </SecondaryButton>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div>
                <label className="block text-sm font-medium mb-2">Rol</label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todos</option>
                  <option value="student">Estudiantes</option>
                  <option value="teacher">Profesores</option>
                  <option value="admin">Administradores</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estado</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>

              <div className="flex items-end">
                <SecondaryButton
                  onClick={() => setFilters({ role: 'all', school: 'all', status: 'all' })}
                  className="w-full"
                >
                  Limpiar Filtros
                </SecondaryButton>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Acciones masivas */}
      {selectedUsers.size > 0 && (
        <Card className="bg-primary/10 border-primary">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="font-medium">
              {selectedUsers.size} usuario{selectedUsers.size !== 1 ? 's' : ''} seleccionado{selectedUsers.size !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              <SecondaryButton size="sm" onClick={() => handleBulkAction('activate')}>
                Activar
              </SecondaryButton>
              <SecondaryButton size="sm" onClick={() => handleBulkAction('deactivate')}>
                Desactivar
              </SecondaryButton>
              <SecondaryButton size="sm" onClick={() => handleBulkAction('export')} icon={Download}>
                Exportar
              </SecondaryButton>
              <SecondaryButton size="sm" onClick={() => handleBulkAction('delete')} icon={Trash2}>
                Eliminar
              </SecondaryButton>
            </div>
          </div>
        </Card>
      )}

      {/* Tabla de usuarios */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-border"
                  />
                </th>
                <th 
                  className="text-left p-4 cursor-pointer hover:bg-background-secondary transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Nombre
                    {sortField === 'name' && (
                      <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="text-left p-4 cursor-pointer hover:bg-background-secondary transition-colors"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-2">
                    Email
                    {sortField === 'email' && (
                      <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="text-left p-4">Rol</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4">Último acceso</th>
                <th className="text-center p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-background-secondary/50 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-text-secondary">{user.id}</div>
                    </div>
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <Chip color={getRoleColor(user.role)} size="sm">
                      {getRoleLabel(user.role)}
                    </Chip>
                  </td>
                  <td className="p-4">
                    <Chip 
                      color={(user as any).active ? 'green' : 'gray'} 
                      size="sm"
                    >
                      {(user as any).active ? 'Activo' : 'Inactivo'}
                    </Chip>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    {(user as any).lastActive 
                      ? new Date((user as any).lastActive).toLocaleDateString() 
                      : 'Nunca'}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                        className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {activeDropdown === user.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-48 bg-background-secondary border border-border rounded-lg shadow-lg z-20 py-1">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="w-full text-left px-4 py-2 hover:bg-background-tertiary flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleResetPassword(user.id)}
                              className="w-full text-left px-4 py-2 hover:bg-background-tertiary flex items-center gap-2"
                            >
                              <Lock className="w-4 h-4" />
                              Resetear contraseña
                            </button>
                            <button
                              onClick={() => handleToggleActive(user.id, (user as any).active)}
                              className="w-full text-left px-4 py-2 hover:bg-background-tertiary flex items-center gap-2"
                            >
                              <Power className="w-4 h-4" />
                              {(user as any).active ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedUsers.length === 0 && (
            <div className="text-center py-12 text-text-secondary">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron usuarios</p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-text-secondary">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a{' '}
              {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} de{' '}
              {filteredAndSortedUsers.length} usuarios
            </div>
            <div className="flex gap-2">
              <SecondaryButton
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </SecondaryButton>
              <span className="px-4 py-2">
                Página {currentPage} de {totalPages}
              </span>
              <SecondaryButton
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </SecondaryButton>
            </div>
          </div>
        )}
      </Card>

      {/* Modals (crear/editar) se implementarán en siguientes archivos */}
    </div>
  );
};

export default UserManagement;

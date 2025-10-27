import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  School, 
  FolderKanban, 
  TrendingUp, 
  AlertCircle,
  UserPlus,
  Activity,
  BarChart3,
  Loader2
} from 'lucide-react';
import { fetchAdminStats } from '../../../services/admin';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-600">Cargando estadísticas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar estadísticas</h3>
          <p className="text-gray-600 mb-4">{(error as Error).message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const kpiCards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsuarios.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: `+${stats.nuevosUsuarios7d} esta semana`,
      onClick: () => navigate('/admin/usuarios'),
    },
    {
      title: 'Profesores',
      value: stats.totalProfesores.toLocaleString(),
      icon: GraduationCap,
      color: 'bg-purple-500',
      change: `${((stats.totalProfesores / stats.totalUsuarios) * 100).toFixed(1)}% del total`,
      onClick: () => navigate('/admin/usuarios?rol=docente'),
    },
    {
      title: 'Estudiantes',
      value: stats.totalAlumnos.toLocaleString(),
      icon: Users,
      color: 'bg-green-500',
      change: `${((stats.totalAlumnos / stats.totalUsuarios) * 100).toFixed(1)}% del total`,
      onClick: () => navigate('/admin/usuarios?rol=alumno'),
    },
    {
      title: 'Escuelas',
      value: stats.totalEscuelas.toLocaleString(),
      icon: School,
      color: 'bg-orange-500',
      change: `${stats.totalGrupos} grupos activos`,
      onClick: () => navigate('/admin/escuelas'),
    },
    {
      title: 'Grupos Activos',
      value: stats.totalGrupos.toLocaleString(),
      icon: FolderKanban,
      color: 'bg-pink-500',
      change: `${(stats.totalGrupos / stats.totalProfesores).toFixed(1)} grupos/profesor`,
      onClick: () => navigate('/admin/grupos'),
    },
    {
      title: 'Tasa de Activación',
      value: `${stats.tasaActivacion.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-cyan-500',
      change: `${stats.usuariosActivos30d} activos (30 días)`,
      onClick: () => {},
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestión completa del sistema TutoriA Academy</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              onClick={card.onClick}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">{card.change}</p>
            </div>
          );
        })}
      </div>

      {/* Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Users by Role */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 text-gray-700 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Distribución por Rol</h2>
          </div>
          <div className="space-y-4">
            {[
              { rol: 'Estudiantes', cantidad: stats.usuariosPorRol.alumno, color: 'bg-green-500' },
              { rol: 'Profesores', cantidad: stats.usuariosPorRol.docente, color: 'bg-purple-500' },
              { rol: 'Directores', cantidad: stats.usuariosPorRol.director, color: 'bg-orange-500' },
              { rol: 'Admins', cantidad: stats.usuariosPorRol.admin, color: 'bg-blue-500' },
            ].map((item) => {
              const porcentaje = (item.cantidad / stats.totalUsuarios) * 100;
              return (
                <div key={item.rol}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.rol}</span>
                    <span className="text-sm text-gray-600">
                      {item.cantidad} ({porcentaje.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-gray-700 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin/usuarios/nuevo')}
              className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <UserPlus className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium text-blue-900">Crear Usuario</span>
              </div>
              <span className="text-blue-600">→</span>
            </button>
            
            <button
              onClick={() => navigate('/admin/usuarios/subir-csv')}
              className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 text-purple-600 mr-3" />
                <span className="font-medium text-purple-900">Subir CSV (Masivo)</span>
              </div>
              <span className="text-purple-600">→</span>
            </button>

            <button
              onClick={() => navigate('/admin/escuelas/nueva')}
              className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <School className="w-5 h-5 text-orange-600 mr-3" />
                <span className="font-medium text-orange-900">Crear Escuela</span>
              </div>
              <span className="text-orange-600">→</span>
            </button>

            <button
              onClick={() => navigate('/admin/grupos/nuevo')}
              className="w-full flex items-center justify-between p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <FolderKanban className="w-5 h-5 text-pink-600 mr-3" />
                <span className="font-medium text-pink-900">Crear Grupo</span>
              </div>
              <span className="text-pink-600">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Actividad</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.nuevosUsuarios7d}</p>
            <p className="text-sm text-gray-600">Nuevos esta semana</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.usuariosActivos30d}</p>
            <p className="text-sm text-gray-600">Activos (30 días)</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.totalGrupos}</p>
            <p className="text-sm text-gray-600">Grupos creados</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.tasaActivacion.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">Tasa de activación</p>
          </div>
        </div>
      </div>
    </div>
  );
}

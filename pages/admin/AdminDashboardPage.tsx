import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, School, FileText, BookOpen, TrendingUp, Activity, Loader2 } from 'lucide-react';
import { AdminKpiCard } from '../../src/components/admin/AdminKpiCard';
import { Card } from '../../components/ui/card';
import { getSystemStats, getActivityLogs, type ActivityLog } from '../../src/services/admin/adminAnalytics';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSchools: 0,
    totalExams: 0,
    totalContent: 0,
    activeUsersToday: 0,
    activeUsersWeek: 0,
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    const { data: statsData } = await getSystemStats();
    const { data: logsData } = await getActivityLogs(20);

    if (statsData) setStats(statsData);
    if (logsData) setActivityLogs(logsData);
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Panel de Administración</h1>
        <p className="text-text-secondary mt-1">Vista general del sistema TutoriA Academy</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminKpiCard
          title="Total Usuarios"
          value={stats.totalUsers}
          subtitle="Usuarios registrados"
          icon={Users}
          color="purple"
          trend={{ value: `+${stats.activeUsersWeek} esta semana`, isPositive: true }}
        />
        <AdminKpiCard
          title="Escuelas"
          value={stats.totalSchools}
          subtitle="Instituciones activas"
          icon={School}
          color="blue"
        />
        <AdminKpiCard
          title="Exámenes"
          value={stats.totalExams}
          subtitle="Exámenes creados"
          icon={FileText}
          color="green"
        />
        <AdminKpiCard
          title="Contenido"
          value={stats.totalContent}
          subtitle="Items de evaluación"
          icon={BookOpen}
          color="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Usuarios Activos Hoy</p>
              <p className="text-2xl font-bold text-text-primary">{stats.activeUsersToday}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Activos esta Semana</p>
              <p className="text-2xl font-bold text-text-primary">{stats.activeUsersWeek}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Exámenes Hoy</p>
              <p className="text-2xl font-bold text-text-primary">{stats.examsTakenToday}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Log */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          {activityLogs.length === 0 ? (
            <p className="text-center text-text-secondary py-8">
              No hay actividad registrada aún
            </p>
          ) : (
            activityLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-2/30 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-grow">
                  <p className="text-sm text-text-primary font-medium">
                    <span className="font-bold">{log.user_name}</span> {log.action}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {new Date(log.timestamp).toLocaleString('es-ES')}
                  </p>
                </div>
                <div className="text-xs text-text-secondary px-2 py-1 bg-surface-2 rounded">
                  {log.entity_type}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

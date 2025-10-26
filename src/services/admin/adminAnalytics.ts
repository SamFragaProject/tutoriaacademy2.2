import { supabase } from '../../lib/supabase';

export interface SystemStats {
  totalUsers: number;
  totalSchools: number;
  totalExams: number;
  totalContent: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  examsTakenToday: number;
  examsTakenWeek: number;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  timestamp: string;
  details?: any;
}

// Obtener estadísticas generales del sistema
export const getSystemStats = async (): Promise<{ data: SystemStats | null; error: any }> => {
  try {
    // Total de usuarios
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Total de escuelas
    const { count: totalSchools } = await supabase
      .from('escuelas')
      .select('*', { count: 'exact', head: true });

    // Total de exámenes (asumiendo tabla 'examenes')
    const { count: totalExams } = await supabase
      .from('examenes')
      .select('*', { count: 'exact', head: true });

    // Total de contenido (asumiendo tabla 'items')
    const { count: totalContent } = await supabase
      .from('items')
      .select('*', { count: 'exact', head: true });

    // Usuarios activos hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: activeUsersToday } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('ultimo_acceso', today.toISOString());

    // Usuarios activos esta semana
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: activeUsersWeek } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('ultimo_acceso', weekAgo.toISOString());

    return {
      data: {
        totalUsers: totalUsers || 0,
        totalSchools: totalSchools || 0,
        totalExams: totalExams || 0,
        totalContent: totalContent || 0,
        activeUsersToday: activeUsersToday || 0,
        activeUsersWeek: activeUsersWeek || 0,
        examsTakenToday: 0, // Implementar cuando tengamos tabla de resultados
        examsTakenWeek: 0,
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return { data: null, error };
  }
};

// Obtener logs de actividad reciente
export const getActivityLogs = async (limit: number = 50): Promise<{ data: ActivityLog[] | null; error: any }> => {
  try {
    // Esta es una implementación básica
    // En producción, necesitarías una tabla de logs o usar Supabase Realtime
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      // Si la tabla no existe, retornamos datos mock temporalmente
      console.warn('Activity logs table not found, using mock data');
      return { data: [], error: null };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return { data: null, error };
  }
};

// Registrar actividad (helper)
export const logActivity = async (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{ ...activity, timestamp: new Date().toISOString() }])
      .select()
      .single();

    if (error) {
      console.warn('Could not log activity:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { data: null, error };
  }
};

// Obtener métricas de uso por día (últimos 30 días)
export const getUsageMetrics = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Aquí necesitarías implementar queries específicas según tu esquema
    // Por ahora retornamos estructura básica
    return {
      data: {
        dailyActiveUsers: [],
        dailyExams: [],
        dailyContent: [],
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching usage metrics:', error);
    return { data: null, error };
  }
};

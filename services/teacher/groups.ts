import { supabase } from '../../src/lib/supabase';

export interface TeacherGroup {
  id: string;
  nombre: string;
  materia: string;
  nivel: string;
  descripcion: string;
  codigo_acceso: string;
  total_alumnos: number;
  promedio_general: number;
  tasa_asistencia: number;
  tareas_pendientes: number;
}

/**
 * Obtiene todos los grupos de un profesor con sus estadísticas
 */
export async function fetchTeacherGroups(profesorId: string): Promise<TeacherGroup[]> {
  try {
    // 1. Obtener grupos del profesor
    const { data: grupos, error: gruposError } = await supabase
      .from('grupos')
      .select('id, nombre, materia, nivel, descripcion, codigo_acceso')
      .eq('profesor_id', profesorId)
      .eq('activo', true)
      .order('nombre');

    if (gruposError) {
      console.error('Error fetching grupos:', gruposError);
      throw gruposError;
    }

    if (!grupos || grupos.length === 0) {
      return [];
    }

    // 2. Para cada grupo, obtener estadísticas usando la función de Supabase
    const gruposConEstadisticas = await Promise.all(
      grupos.map(async (grupo) => {
        const { data: stats, error: statsError } = await supabase
          .rpc('calcular_estadisticas_grupo', { grupo_uuid: grupo.id });

        if (statsError) {
          console.error(`Error fetching stats for grupo ${grupo.id}:`, statsError);
          // Si falla, usar valores por defecto
          return {
            ...grupo,
            total_alumnos: 0,
            promedio_general: 0,
            tasa_asistencia: 0,
            tareas_pendientes: 0,
          };
        }

        // stats es un array con un solo elemento
        const estadisticas = stats?.[0] || {
          total_alumnos: 0,
          promedio_general: 0,
          tasa_asistencia: 0,
          tareas_pendientes: 0,
        };

        return {
          ...grupo,
          total_alumnos: Number(estadisticas.total_alumnos) || 0,
          promedio_general: Number(estadisticas.promedio_general) || 0,
          tasa_asistencia: Number(estadisticas.tasa_asistencia) || 0,
          tareas_pendientes: Number(estadisticas.tareas_pendientes) || 0,
        };
      })
    );

    return gruposConEstadisticas;
  } catch (error) {
    console.error('Error in fetchTeacherGroups:', error);
    throw error;
  }
}

/**
 * Obtiene un grupo específico con sus estadísticas
 */
export async function fetchGroupById(grupoId: string): Promise<TeacherGroup | null> {
  try {
    const { data: grupo, error: grupoError } = await supabase
      .from('grupos')
      .select('id, nombre, materia, nivel, descripcion, codigo_acceso')
      .eq('id', grupoId)
      .single();

    if (grupoError) {
      console.error('Error fetching grupo:', grupoError);
      throw grupoError;
    }

    if (!grupo) {
      return null;
    }

    const { data: stats, error: statsError } = await supabase
      .rpc('calcular_estadisticas_grupo', { grupo_uuid: grupo.id });

    if (statsError) {
      console.error(`Error fetching stats for grupo ${grupo.id}:`, statsError);
      return {
        ...grupo,
        total_alumnos: 0,
        promedio_general: 0,
        tasa_asistencia: 0,
        tareas_pendientes: 0,
      };
    }

    const estadisticas = stats?.[0] || {
      total_alumnos: 0,
      promedio_general: 0,
      tasa_asistencia: 0,
      tareas_pendientes: 0,
    };

    return {
      ...grupo,
      total_alumnos: Number(estadisticas.total_alumnos) || 0,
      promedio_general: Number(estadisticas.promedio_general) || 0,
      tasa_asistencia: Number(estadisticas.tasa_asistencia) || 0,
      tareas_pendientes: Number(estadisticas.tareas_pendientes) || 0,
    };
  } catch (error) {
    console.error('Error in fetchGroupById:', error);
    throw error;
  }
}

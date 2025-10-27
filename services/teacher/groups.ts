import { supabase } from '../../src/lib/supabase';

export interface TeacherGroup {
  id: string;
  nombre: string;
  materia: string;
  grado?: string;
  seccion?: string;
  descripcion: string;
  total_alumnos: number;
  promedio_general: number;
  tasa_asistencia: number;
  tareas_pendientes: number;
}

export interface GroupStudent {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  promedio: number;
  asistencia: number;
  xp: number;
}

/**
 * Obtiene todos los grupos de un profesor con sus estadísticas
 */
export async function fetchTeacherGroups(profesorId: string): Promise<TeacherGroup[]> {
  try {
    console.log('Fetching groups for profesor:', profesorId);
    
    // 1. Obtener grupos del profesor (sin filtrar por activo, ya que puede ser NULL)
    const { data: grupos, error: gruposError } = await supabase
      .from('grupos')
      .select('id, nombre, materia, grado, seccion, descripcion, activo')
      .eq('profesor_id', profesorId)
      .order('nombre');

    if (gruposError) {
      console.error('Error fetching grupos:', gruposError);
      throw gruposError;
    }
    
    console.log('Groups fetched:', grupos);

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

/**
 * Obtiene los estudiantes de un grupo con sus estadísticas
 */
export async function fetchGroupStudents(grupoId: string): Promise<GroupStudent[]> {
  try {
    console.log('Fetching students for group:', grupoId);

    // 1. Obtener alumnos del grupo desde grupos_alumnos
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('grupos_alumnos')
      .select('alumno_id')
      .eq('grupo_id', grupoId)
      .eq('activo', true);

    if (inscripcionesError) {
      console.error('Error fetching inscripciones:', inscripcionesError);
      throw inscripcionesError;
    }

    if (!inscripciones || inscripciones.length === 0) {
      console.log('No students found for group');
      return [];
    }

    const alumnoIds = inscripciones.map(i => i.alumno_id);
    console.log('Student IDs:', alumnoIds);

    // 2. Obtener datos de usuarios
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, email')
      .in('id', alumnoIds);

    if (usuariosError) {
      console.error('Error fetching usuarios:', usuariosError);
      throw usuariosError;
    }

    if (!usuarios || usuarios.length === 0) {
      return [];
    }

    // 3. Para cada alumno, calcular estadísticas
    const estudiantesConStats = await Promise.all(
      usuarios.map(async (usuario) => {
        // Promedio de calificaciones del grupo
        const { data: calificaciones, error: calError } = await supabase
          .from('calificaciones')
          .select('calificacion')
          .eq('alumno_id', usuario.id)
          .eq('grupo_id', grupoId);

        const promedio = calificaciones && calificaciones.length > 0
          ? calificaciones.reduce((acc, c) => acc + (Number(c.calificacion) || 0), 0) / calificaciones.length
          : 0;

        // Asistencia del grupo
        const { data: asistencias, error: asistError } = await supabase
          .from('asistencias')
          .select('presente')
          .eq('alumno_id', usuario.id)
          .eq('grupo_id', grupoId);

        const asistencia = asistencias && asistencias.length > 0
          ? (asistencias.filter(a => a.presente).length / asistencias.length) * 100
          : 0;

        // XP (simulado por ahora - puedes agregar tabla de XP después)
        const xp = Math.round(promedio * 50); // XP basado en promedio

        return {
          id: usuario.id,
          nombre: usuario.nombre || '',
          apellido: usuario.apellido || '',
          email: usuario.email || '',
          promedio: Math.round(promedio * 10) / 10,
          asistencia: Math.round(asistencia * 10) / 10,
          xp,
        };
      })
    );

    return estudiantesConStats;
  } catch (error) {
    console.error('Error in fetchGroupStudents:', error);
    throw error;
  }
}

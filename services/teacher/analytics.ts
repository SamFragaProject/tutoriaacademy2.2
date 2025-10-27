import { supabase } from '../../src/lib/supabase';

export interface HeatmapData {
  alumno_id: string;
  alumno_nombre: string;
  [subtema: string]: number | string; // subtemas como claves dinámicas con calificaciones
}

export interface SubtemaCalificacion {
  alumno_id: string;
  alumno_nombre: string;
  subtema: string;
  calificacion: number;
}

/**
 * Obtiene datos del heatmap de calificaciones por subtema para un grupo
 */
export async function fetchHeatmapData(grupoId: string): Promise<HeatmapData[]> {
  try {
    // 1. Obtener todas las calificaciones del grupo con información del alumno
    const { data: calificaciones, error: calificacionesError } = await supabase
      .from('calificaciones')
      .select(`
        alumno_id,
        subtema,
        calificacion,
        usuarios:alumno_id (
          nombre,
          email
        )
      `)
      .eq('grupo_id', grupoId)
      .not('subtema', 'is', null)
      .order('alumno_id');

    if (calificacionesError) {
      console.error('Error fetching calificaciones:', calificacionesError);
      throw calificacionesError;
    }

    if (!calificaciones || calificaciones.length === 0) {
      return [];
    }

    // 2. Transformar los datos a formato heatmap
    // Agrupar por alumno
    const alumnosMap = new Map<string, HeatmapData>();

    calificaciones.forEach((cal: any) => {
      const alumnoId = cal.alumno_id;
      const subtema = cal.subtema;
      const calificacion = Number(cal.calificacion) || 0;
      const alumnoNombre = cal.usuarios?.nombre || cal.usuarios?.email || 'Sin nombre';

      // Si el alumno no existe en el map, crearlo
      if (!alumnosMap.has(alumnoId)) {
        alumnosMap.set(alumnoId, {
          alumno_id: alumnoId,
          alumno_nombre: alumnoNombre,
        });
      }

      // Agregar la calificación del subtema
      const alumnoData = alumnosMap.get(alumnoId)!;
      alumnoData[subtema] = calificacion;
    });

    // 3. Convertir el Map a array
    const heatmapData = Array.from(alumnosMap.values());

    return heatmapData;
  } catch (error) {
    console.error('Error in fetchHeatmapData:', error);
    throw error;
  }
}

/**
 * Obtiene la lista de todos los subtemas únicos de un grupo
 */
export async function fetchSubtemas(grupoId: string): Promise<string[]> {
  try {
    const { data: calificaciones, error } = await supabase
      .from('calificaciones')
      .select('subtema')
      .eq('grupo_id', grupoId)
      .not('subtema', 'is', null);

    if (error) {
      console.error('Error fetching subtemas:', error);
      throw error;
    }

    if (!calificaciones || calificaciones.length === 0) {
      return [];
    }

    // Extraer subtemas únicos
    const subtemasUnicos = Array.from(
      new Set(calificaciones.map((cal) => cal.subtema).filter(Boolean))
    );

    return subtemasUnicos;
  } catch (error) {
    console.error('Error in fetchSubtemas:', error);
    throw error;
  }
}

/**
 * Obtiene KPIs del profesor (resumen general de todos sus grupos)
 */
export async function fetchTeacherKPIs(profesorId: string) {
  try {
    // Obtener todos los grupos del profesor
    const { data: grupos, error: gruposError } = await supabase
      .from('grupos')
      .select('id')
      .eq('profesor_id', profesorId)
      .eq('activo', true);

    if (gruposError) {
      console.error('Error fetching grupos for KPIs:', gruposError);
      throw gruposError;
    }

    if (!grupos || grupos.length === 0) {
      return {
        total_grupos: 0,
        total_alumnos: 0,
        promedio_general: 0,
        tasa_asistencia_global: 0,
      };
    }

    const grupoIds = grupos.map((g) => g.id);

    // Contar alumnos únicos en todos los grupos
    const { data: alumnos, error: alumnosError } = await supabase
      .from('grupos_alumnos')
      .select('alumno_id', { count: 'exact', head: false })
      .in('grupo_id', grupoIds)
      .eq('activo', true);

    const alumnosUnicos = new Set(alumnos?.map((a) => a.alumno_id) || []);

    // Calcular promedio general de todos los grupos
    const { data: calificaciones, error: calificacionesError } = await supabase
      .from('calificaciones')
      .select('calificacion')
      .in('grupo_id', grupoIds);

    let promedioGeneral = 0;
    if (calificaciones && calificaciones.length > 0) {
      const suma = calificaciones.reduce((acc, cal) => acc + (Number(cal.calificacion) || 0), 0);
      promedioGeneral = suma / calificaciones.length;
    }

    return {
      total_grupos: grupos.length,
      total_alumnos: alumnosUnicos.size,
      promedio_general: Math.round(promedioGeneral * 100) / 100,
      tasa_asistencia_global: 100, // Simplificado por ahora
    };
  } catch (error) {
    console.error('Error in fetchTeacherKPIs:', error);
    throw error;
  }
}

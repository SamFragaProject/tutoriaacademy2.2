import { supabase } from '../../src/lib/supabase';
import type { AdminGroup, BulkEnrollment } from '../../types';

/**
 * Obtener todos los grupos con filtros
 */
export async function fetchAllGroups(filters?: {
  escuela_id?: string;
  profesor_id?: string;
  activo?: boolean;
}): Promise<AdminGroup[]> {
  try {
    let query = supabase
      .from('grupos')
      .select(`
        *,
        usuarios!profesor_id(nombre, apellido),
        escuelas(nombre)
      `)
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filters?.escuela_id) {
      query = query.eq('escuela_id', filters.escuela_id);
    }
    if (filters?.profesor_id) {
      query = query.eq('profesor_id', filters.profesor_id);
    }
    if (filters?.activo !== undefined) {
      query = query.eq('activo', filters.activo);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Para cada grupo, contar alumnos y calcular estadísticas
    const gruposConStats = await Promise.all(
      (data || []).map(async (grupo) => {
        // Contar alumnos
        const { count: alumnosCount } = await supabase
          .from('grupos_alumnos')
          .select('*', { count: 'exact', head: true })
          .eq('grupo_id', grupo.id)
          .eq('activo', true);

        // Calcular promedio general
        const { data: calificaciones } = await supabase
          .from('calificaciones')
          .select('calificacion')
          .eq('grupo_id', grupo.id);

        const promedioGeneral = calificaciones && calificaciones.length > 0
          ? calificaciones.reduce((sum, c) => sum + (c.calificacion || 0), 0) / calificaciones.length
          : undefined;

        // Calcular tasa de asistencia
        const { data: asistencias } = await supabase
          .from('asistencias')
          .select('presente')
          .eq('grupo_id', grupo.id);

        const tasaAsistencia = asistencias && asistencias.length > 0
          ? (asistencias.filter(a => a.presente).length / asistencias.length) * 100
          : undefined;

        const profesor = Array.isArray(grupo.usuarios) ? grupo.usuarios[0] : grupo.usuarios;

        return {
          id: grupo.id,
          nombre: grupo.nombre,
          materia: grupo.materia,
          nivel: grupo.nivel,
          profesor_id: grupo.profesor_id,
          profesor_nombre: profesor ? `${profesor.nombre} ${profesor.apellido}` : 'Sin asignar',
          escuela_id: grupo.escuela_id,
          escuela_nombre: grupo.escuelas?.nombre || 'Sin escuela',
          total_alumnos: alumnosCount || 0,
          promedio_general: promedioGeneral,
          tasa_asistencia: tasaAsistencia,
          activo: grupo.activo ?? true,
          fecha_creacion: grupo.created_at,
        };
      })
    );

    return gruposConStats;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
}

/**
 * Crear un nuevo grupo
 */
export async function createGroup(grupoData: {
  nombre: string;
  materia: string;
  nivel: string;
  profesor_id: string;
  escuela_id: string;
  descripcion?: string;
  codigo_acceso?: string;
}): Promise<AdminGroup> {
  try {
    const { data, error } = await supabase
      .from('grupos')
      .insert([{
        nombre: grupoData.nombre,
        materia: grupoData.materia,
        nivel: grupoData.nivel,
        profesor_id: grupoData.profesor_id,
        escuela_id: grupoData.escuela_id,
        descripcion: grupoData.descripcion,
        codigo_acceso: grupoData.codigo_acceso || `GRP-${Date.now().toString().slice(-6)}`,
        activo: true,
        created_at: new Date().toISOString(),
      }])
      .select(`
        *,
        usuarios!profesor_id(nombre, apellido),
        escuelas(nombre)
      `)
      .single();

    if (error) throw error;

    const profesor = Array.isArray(data.usuarios) ? data.usuarios[0] : data.usuarios;

    return {
      id: data.id,
      nombre: data.nombre,
      materia: data.materia,
      nivel: data.nivel,
      profesor_id: data.profesor_id,
      profesor_nombre: profesor ? `${profesor.nombre} ${profesor.apellido}` : 'Sin asignar',
      escuela_id: data.escuela_id,
      escuela_nombre: data.escuelas?.nombre || 'Sin escuela',
      total_alumnos: 0,
      activo: true,
      fecha_creacion: data.created_at,
    };
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
}

/**
 * Actualizar un grupo
 */
export async function updateGroup(
  grupoId: string,
  updates: Partial<{
    nombre: string;
    materia: string;
    nivel: string;
    profesor_id: string;
    descripcion: string;
    codigo_acceso: string;
    activo: boolean;
  }>
): Promise<AdminGroup> {
  try {
    const { data, error } = await supabase
      .from('grupos')
      .update(updates)
      .eq('id', grupoId)
      .select(`
        *,
        usuarios!profesor_id(nombre, apellido),
        escuelas(nombre)
      `)
      .single();

    if (error) throw error;

    // Contar alumnos
    const { count: alumnosCount } = await supabase
      .from('grupos_alumnos')
      .select('*', { count: 'exact', head: true })
      .eq('grupo_id', grupoId)
      .eq('activo', true);

    const profesor = Array.isArray(data.usuarios) ? data.usuarios[0] : data.usuarios;

    return {
      id: data.id,
      nombre: data.nombre,
      materia: data.materia,
      nivel: data.nivel,
      profesor_id: data.profesor_id,
      profesor_nombre: profesor ? `${profesor.nombre} ${profesor.apellido}` : 'Sin asignar',
      escuela_id: data.escuela_id,
      escuela_nombre: data.escuelas?.nombre || 'Sin escuela',
      total_alumnos: alumnosCount || 0,
      activo: data.activo ?? true,
      fecha_creacion: data.created_at,
    };
  } catch (error) {
    console.error('Error updating group:', error);
    throw error;
  }
}

/**
 * Eliminar un grupo (soft delete)
 */
export async function deleteGroup(grupoId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('grupos')
      .update({ activo: false })
      .eq('id', grupoId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
}

/**
 * Inscripción masiva de alumnos a un grupo
 */
export async function bulkEnrollStudents(enrollment: BulkEnrollment): Promise<{
  exitosos: number;
  fallidos: number;
  errores: Array<{ alumno_id: string; motivo: string }>;
}> {
  const resultado = {
    exitosos: 0,
    fallidos: 0,
    errores: [] as Array<{ alumno_id: string; motivo: string }>,
  };

  for (const alumnoId of enrollment.alumnos_ids) {
    try {
      const { error } = await supabase
        .from('grupos_alumnos')
        .insert([{
          grupo_id: enrollment.grupo_id,
          alumno_id: alumnoId,
          fecha_inscripcion: enrollment.fecha_inscripcion || new Date().toISOString(),
          activo: true,
        }]);

      if (error) {
        // Si ya existe, ignorar
        if (error.code === '23505') {
          resultado.exitosos++;
        } else {
          throw error;
        }
      } else {
        resultado.exitosos++;
      }
    } catch (error: any) {
      resultado.fallidos++;
      resultado.errores.push({
        alumno_id: alumnoId,
        motivo: error.message || 'Error desconocido',
      });
    }
  }

  return resultado;
}

/**
 * Obtener grupo por ID
 */
export async function fetchGroupById(grupoId: string): Promise<AdminGroup> {
  try {
    const { data, error } = await supabase
      .from('grupos')
      .select(`
        *,
        usuarios!profesor_id(nombre, apellido),
        escuelas(nombre)
      `)
      .eq('id', grupoId)
      .single();

    if (error) throw error;

    // Contar alumnos
    const { count: alumnosCount } = await supabase
      .from('grupos_alumnos')
      .select('*', { count: 'exact', head: true })
      .eq('grupo_id', grupoId)
      .eq('activo', true);

    // Calcular promedio
    const { data: calificaciones } = await supabase
      .from('calificaciones')
      .select('calificacion')
      .eq('grupo_id', grupoId);

    const promedioGeneral = calificaciones && calificaciones.length > 0
      ? calificaciones.reduce((sum, c) => sum + (c.calificacion || 0), 0) / calificaciones.length
      : undefined;

    // Calcular asistencia
    const { data: asistencias } = await supabase
      .from('asistencias')
      .select('presente')
      .eq('grupo_id', grupoId);

    const tasaAsistencia = asistencias && asistencias.length > 0
      ? (asistencias.filter(a => a.presente).length / asistencias.length) * 100
      : undefined;

    const profesor = Array.isArray(data.usuarios) ? data.usuarios[0] : data.usuarios;

    return {
      id: data.id,
      nombre: data.nombre,
      materia: data.materia,
      nivel: data.nivel,
      profesor_id: data.profesor_id,
      profesor_nombre: profesor ? `${profesor.nombre} ${profesor.apellido}` : 'Sin asignar',
      escuela_id: data.escuela_id,
      escuela_nombre: data.escuelas?.nombre || 'Sin escuela',
      total_alumnos: alumnosCount || 0,
      promedio_general: promedioGeneral,
      tasa_asistencia: tasaAsistencia,
      activo: data.activo ?? true,
      fecha_creacion: data.created_at,
    };
  } catch (error) {
    console.error('Error fetching group by id:', error);
    throw error;
  }
}

// Usar cliente dev que bypasea RLS en desarrollo
import { supabaseDev as supabase } from '../../src/lib/supabase-dev';

export interface Task {
  id: string;
  titulo: string;
  descripcion: string;
  materia: string;
  grupo_id: string;
  grupo_nombre?: string;
  profesor_id: string;
  fecha_creacion: string;
  fecha_entrega: string;
  puntos: number;
  archivo_adjunto?: string;
  instrucciones?: string;
  total_alumnos?: number;
  entregas_completadas?: number;
  entregas_pendientes?: number;
  entregas_tarde?: number;
  promedio_calificacion?: number;
}

export interface TaskSubmission {
  id: string;
  tarea_id: string;
  alumno_id: string;
  alumno_nombre: string;
  alumno_apellido: string;
  fecha_entrega: string;
  archivo?: string;
  contenido?: string;
  calificacion?: number;
  comentarios?: string;
  estado: 'pendiente' | 'entregada' | 'calificada' | 'tarde';
  es_tarde: boolean;
}

export interface CreateTaskData {
  titulo: string;
  descripcion: string;
  materia: string;
  grupo_id: string;
  fecha_entrega: string;
  puntos: number;
  instrucciones?: string;
  archivo_adjunto?: string;
}

/**
 * Obtiene todas las tareas de un profesor con estadísticas
 */
export async function fetchTeacherTasks(profesorId: string): Promise<Task[]> {
  try {
    console.log('Fetching tasks for profesor:', profesorId);

    // 1. Obtener tareas del profesor
    const { data: tareas, error: tareasError } = await supabase
      .from('tareas')
      .select(`
        id,
        titulo,
        descripcion,
        materia,
        grupo_id,
        profesor_id,
        fecha_creacion,
        fecha_entrega,
        puntos,
        archivo_adjunto,
        instrucciones,
        grupos (
          nombre
        )
      `)
      .eq('profesor_id', profesorId)
      .order('fecha_creacion', { ascending: false });

    if (tareasError) {
      console.error('Error fetching tareas:', tareasError);
      throw tareasError;
    }

    if (!tareas || tareas.length === 0) {
      return [];
    }

    // 2. Para cada tarea, obtener estadísticas de entregas
    const tareasConEstadisticas = await Promise.all(
      tareas.map(async (tarea) => {
        // Obtener total de alumnos del grupo
        const { count: totalAlumnos } = await supabase
          .from('grupos_alumnos')
          .select('*', { count: 'exact', head: true })
          .eq('grupo_id', tarea.grupo_id)
          .eq('activo', true);

        // Obtener entregas
        const { data: entregas, error: entregasError } = await supabase
          .from('entregas')
          .select('estado, calificacion, fecha_entrega')
          .eq('tarea_id', tarea.id);

        if (entregasError) {
          console.error(`Error fetching entregas for tarea ${tarea.id}:`, entregasError);
        }

        const entregasCompletadas = entregas?.filter(e => e.estado === 'entregada' || e.estado === 'calificada').length || 0;
        const entregasTarde = entregas?.filter(e => e.estado === 'tarde').length || 0;
        const calificaciones = entregas?.filter(e => e.calificacion !== null).map(e => e.calificacion || 0) || [];
        const promedioCalificacion = calificaciones.length > 0
          ? calificaciones.reduce((acc, cal) => acc + cal, 0) / calificaciones.length
          : 0;

        return {
          ...tarea,
          grupo_nombre: (tarea.grupos as any)?.nombre || 'Grupo sin nombre',
          total_alumnos: totalAlumnos || 0,
          entregas_completadas: entregasCompletadas,
          entregas_pendientes: (totalAlumnos || 0) - entregasCompletadas,
          entregas_tarde: entregasTarde,
          promedio_calificacion: promedioCalificacion,
        };
      })
    );

    return tareasConEstadisticas;
  } catch (error) {
    console.error('Error in fetchTeacherTasks:', error);
    throw error;
  }
}

/**
 * Obtiene una tarea específica con sus entregas
 */
export async function fetchTaskById(tareaId: string): Promise<Task | null> {
  try {
    const { data: tarea, error: tareaError } = await supabase
      .from('tareas')
      .select(`
        id,
        titulo,
        descripcion,
        materia,
        grupo_id,
        profesor_id,
        fecha_creacion,
        fecha_entrega,
        puntos,
        archivo_adjunto,
        instrucciones,
        grupos (
          nombre
        )
      `)
      .eq('id', tareaId)
      .single();

    if (tareaError) {
      console.error('Error fetching tarea:', tareaError);
      throw tareaError;
    }

    if (!tarea) {
      return null;
    }

    // Obtener estadísticas
    const { count: totalAlumnos } = await supabase
      .from('grupos_alumnos')
      .select('*', { count: 'exact', head: true })
      .eq('grupo_id', tarea.grupo_id)
      .eq('activo', true);

    const { data: entregas } = await supabase
      .from('entregas')
      .select('estado, calificacion')
      .eq('tarea_id', tarea.id);

    const entregasCompletadas = entregas?.filter(e => e.estado === 'entregada' || e.estado === 'calificada').length || 0;
    const entregasTarde = entregas?.filter(e => e.estado === 'tarde').length || 0;
    const calificaciones = entregas?.filter(e => e.calificacion !== null).map(e => e.calificacion || 0) || [];
    const promedioCalificacion = calificaciones.length > 0
      ? calificaciones.reduce((acc, cal) => acc + cal, 0) / calificaciones.length
      : 0;

    return {
      ...tarea,
      grupo_nombre: (tarea.grupos as any)?.nombre || 'Grupo sin nombre',
      total_alumnos: totalAlumnos || 0,
      entregas_completadas: entregasCompletadas,
      entregas_pendientes: (totalAlumnos || 0) - entregasCompletadas,
      entregas_tarde: entregasTarde,
      promedio_calificacion: promedioCalificacion,
    };
  } catch (error) {
    console.error('Error in fetchTaskById:', error);
    throw error;
  }
}

/**
 * Obtiene las entregas de una tarea con información de los alumnos
 */
export async function fetchTaskSubmissions(tareaId: string): Promise<TaskSubmission[]> {
  try {
    console.log('Fetching submissions for tarea:', tareaId);

    // 1. Obtener fecha de entrega de la tarea
    const { data: tarea, error: tareaError } = await supabase
      .from('tareas')
      .select('fecha_entrega, grupo_id')
      .eq('id', tareaId)
      .single();

    if (tareaError) {
      console.error('Error fetching tarea:', tareaError);
      throw tareaError;
    }

    // 2. Obtener todos los alumnos del grupo
    const { data: alumnosGrupo, error: alumnosError } = await supabase
      .from('grupos_alumnos')
      .select('alumno_id')
      .eq('grupo_id', tarea.grupo_id)
      .eq('activo', true);

    if (alumnosError) {
      console.error('Error fetching alumnos:', alumnosError);
      throw alumnosError;
    }

    if (!alumnosGrupo || alumnosGrupo.length === 0) {
      return [];
    }

    const alumnoIds = alumnosGrupo.map(a => a.alumno_id);

    // 3. Obtener usuarios (nombres y apellidos)
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido')
      .in('id', alumnoIds);

    if (usuariosError) {
      console.error('Error fetching usuarios:', usuariosError);
      throw usuariosError;
    }

    // 4. Obtener entregas existentes
    const { data: entregas, error: entregasError } = await supabase
      .from('entregas')
      .select('*')
      .eq('tarea_id', tareaId);

    if (entregasError) {
      console.error('Error fetching entregas:', entregasError);
    }

    // 5. Crear mapa de entregas por alumno
    const entregasMap = new Map(entregas?.map(e => [e.alumno_id, e]) || []);

    // 6. Crear lista completa de entregas (incluyendo pendientes)
    const fechaLimite = new Date(tarea.fecha_entrega);
    
    const submissions: TaskSubmission[] = usuarios?.map(usuario => {
      const entrega = entregasMap.get(usuario.id);
      
      if (entrega) {
        const fechaEntrega = new Date(entrega.fecha_entrega);
        const esTarde = fechaEntrega > fechaLimite;

        return {
          id: entrega.id,
          tarea_id: tareaId,
          alumno_id: usuario.id,
          alumno_nombre: usuario.nombre || '',
          alumno_apellido: usuario.apellido || '',
          fecha_entrega: entrega.fecha_entrega,
          archivo: entrega.archivo,
          contenido: entrega.contenido,
          calificacion: entrega.calificacion,
          comentarios: entrega.comentarios,
          estado: entrega.estado,
          es_tarde: esTarde,
        };
      } else {
        // Alumno sin entrega (pendiente)
        return {
          id: `pending-${usuario.id}`,
          tarea_id: tareaId,
          alumno_id: usuario.id,
          alumno_nombre: usuario.nombre || '',
          alumno_apellido: usuario.apellido || '',
          fecha_entrega: '',
          estado: 'pendiente',
          es_tarde: false,
        };
      }
    }) || [];

    return submissions;
  } catch (error) {
    console.error('Error in fetchTaskSubmissions:', error);
    throw error;
  }
}

/**
 * Crea una nueva tarea
 */
export async function createTask(profesorId: string, taskData: CreateTaskData): Promise<Task> {
  try {
    const { data: tarea, error } = await supabase
      .from('tareas')
      .insert({
        ...taskData,
        profesor_id: profesorId,
        fecha_creacion: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating tarea:', error);
      throw error;
    }

    return tarea;
  } catch (error) {
    console.error('Error in createTask:', error);
    throw error;
  }
}

/**
 * Actualiza una tarea existente
 */
export async function updateTask(tareaId: string, updates: Partial<CreateTaskData>): Promise<Task> {
  try {
    const { data: tarea, error } = await supabase
      .from('tareas')
      .update(updates)
      .eq('id', tareaId)
      .select()
      .single();

    if (error) {
      console.error('Error updating tarea:', error);
      throw error;
    }

    return tarea;
  } catch (error) {
    console.error('Error in updateTask:', error);
    throw error;
  }
}

/**
 * Elimina una tarea
 */
export async function deleteTask(tareaId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('tareas')
      .delete()
      .eq('id', tareaId);

    if (error) {
      console.error('Error deleting tarea:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteTask:', error);
    throw error;
  }
}

/**
 * Califica una entrega
 */
export async function gradeSubmission(
  entregaId: string,
  calificacion: number,
  comentarios?: string
): Promise<TaskSubmission> {
  try {
    const { data: entrega, error } = await supabase
      .from('entregas')
      .update({
        calificacion,
        comentarios,
        estado: 'calificada',
      })
      .eq('id', entregaId)
      .select(`
        *,
        usuarios (
          nombre,
          apellido
        )
      `)
      .single();

    if (error) {
      console.error('Error grading submission:', error);
      throw error;
    }

    return {
      id: entrega.id,
      tarea_id: entrega.tarea_id,
      alumno_id: entrega.alumno_id,
      alumno_nombre: (entrega.usuarios as any)?.nombre || '',
      alumno_apellido: (entrega.usuarios as any)?.apellido || '',
      fecha_entrega: entrega.fecha_entrega,
      archivo: entrega.archivo,
      contenido: entrega.contenido,
      calificacion: entrega.calificacion,
      comentarios: entrega.comentarios,
      estado: entrega.estado,
      es_tarde: false, // Recalcular si es necesario
    };
  } catch (error) {
    console.error('Error in gradeSubmission:', error);
    throw error;
  }
}

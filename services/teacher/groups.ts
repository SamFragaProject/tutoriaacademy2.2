/**
 * Servicio de Grupos - TutoriA Academy
 * Gestión de grupos, alumnos y estadísticas
 */

import { supabase } from '../../lib/supabase';

export interface Grupo {
    id: string;
    escuela_id: string;
    profesor_id: string;
    nombre: string;
    materia: string;
    nivel: string | null;
    descripcion: string | null;
    codigo_acceso: string | null;
    activo: boolean;
    created_at: string;
    updated_at: string;
}

export interface GrupoConEstadisticas extends Grupo {
    total_alumnos: number;
    promedio_general: number;
    tasa_asistencia: number;
    tareas_pendientes: number;
}

export interface Alumno {
    id: string;
    nombre: string;
    apellidos: string | null;
    email: string;
    promedio?: number;
}

/**
 * Obtiene todos los grupos de un profesor con estadísticas
 */
export async function fetchTeacherGroups(profesorId: string): Promise<GrupoConEstadisticas[]> {
    try {
        // Obtener grupos del profesor
        const { data: grupos, error: gruposError } = await supabase
            .from('grupos')
            .select('*')
            .eq('profesor_id', profesorId)
            .eq('activo', true)
            .order('nombre');

        if (gruposError) throw gruposError;
        if (!grupos || grupos.length === 0) return [];

        // Para cada grupo, obtener estadísticas
        const gruposConEstadisticas = await Promise.all(
            grupos.map(async (grupo) => {
                const stats = await fetchGroupStats(grupo.id);
                return {
                    ...grupo,
                    ...stats
                };
            })
        );

        return gruposConEstadisticas;
    } catch (error) {
        console.error('Error fetching teacher groups:', error);
        throw error;
    }
}

/**
 * Obtiene estadísticas de un grupo específico
 */
export async function fetchGroupStats(grupoId: string) {
    try {
        // Usar la función SQL que creamos
        const { data, error } = await supabase
            .rpc('calcular_estadisticas_grupo', { grupo_uuid: grupoId });

        if (error) throw error;

        if (!data || data.length === 0) {
            return {
                total_alumnos: 0,
                promedio_general: 0,
                tasa_asistencia: 100,
                tareas_pendientes: 0
            };
        }

        return {
            total_alumnos: data[0].total_alumnos || 0,
            promedio_general: parseFloat(data[0].promedio_general) || 0,
            tasa_asistencia: parseFloat(data[0].tasa_asistencia) || 100,
            tareas_pendientes: data[0].tareas_pendientes || 0
        };
    } catch (error) {
        console.error('Error fetching group stats:', error);
        return {
            total_alumnos: 0,
            promedio_general: 0,
            tasa_asistencia: 100,
            tareas_pendientes: 0
        };
    }
}

/**
 * Obtiene los alumnos de un grupo con sus promedios
 */
export async function fetchGroupStudents(grupoId: string): Promise<Alumno[]> {
    try {
        const { data, error } = await supabase
            .from('grupos_alumnos')
            .select(`
                alumno_id,
                usuarios!inner (
                    id,
                    nombre,
                    apellidos,
                    email
                )
            `)
            .eq('grupo_id', grupoId)
            .eq('activo', true);

        if (error) throw error;
        if (!data) return [];

        // Obtener promedio de cada alumno en este grupo
        const alumnosConPromedio = await Promise.all(
            data.map(async (item: any) => {
                const usuario = item.usuarios;
                
                // Calcular promedio del alumno en este grupo
                const { data: calificaciones } = await supabase
                    .from('calificaciones')
                    .select('calificacion')
                    .eq('alumno_id', usuario.id)
                    .eq('grupo_id', grupoId);

                let promedio = 0;
                if (calificaciones && calificaciones.length > 0) {
                    const suma = calificaciones.reduce((acc, cal) => acc + parseFloat(cal.calificacion), 0);
                    promedio = suma / calificaciones.length;
                }

                return {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellidos: usuario.apellidos,
                    email: usuario.email,
                    promedio: Math.round(promedio * 10) / 10
                };
            })
        );

        return alumnosConPromedio;
    } catch (error) {
        console.error('Error fetching group students:', error);
        throw error;
    }
}

/**
 * Crea un nuevo grupo
 */
export async function createGroup(grupo: Omit<Grupo, 'id' | 'created_at' | 'updated_at'>) {
    try {
        const { data, error } = await supabase
            .from('grupos')
            .insert([grupo])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
}

/**
 * Actualiza un grupo
 */
export async function updateGroup(grupoId: string, updates: Partial<Grupo>) {
    try {
        const { data, error } = await supabase
            .from('grupos')
            .update(updates)
            .eq('id', grupoId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating group:', error);
        throw error;
    }
}

/**
 * Elimina un grupo (soft delete)
 */
export async function deleteGroup(grupoId: string) {
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
 * Agrega un alumno a un grupo
 */
export async function addStudentToGroup(grupoId: string, alumnoId: string) {
    try {
        const { data, error } = await supabase
            .from('grupos_alumnos')
            .insert([{
                grupo_id: grupoId,
                alumno_id: alumnoId,
                activo: true
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding student to group:', error);
        throw error;
    }
}

/**
 * Remueve un alumno de un grupo
 */
export async function removeStudentFromGroup(grupoId: string, alumnoId: string) {
    try {
        const { error } = await supabase
            .from('grupos_alumnos')
            .update({ activo: false })
            .eq('grupo_id', grupoId)
            .eq('alumno_id', alumnoId);

        if (error) throw error;
    } catch (error) {
        console.error('Error removing student from group:', error);
        throw error;
    }
}


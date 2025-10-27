import { supabase } from '../../src/lib/supabase';
import type { AdminSchool } from '../../types';

/**
 * Obtener todas las escuelas
 */
export async function fetchAllSchools(): Promise<AdminSchool[]> {
  try {
    const { data, error } = await supabase
      .from('escuelas')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;

    // Para cada escuela, contar profesores, alumnos y grupos
    const escuelasConStats = await Promise.all(
      (data || []).map(async (escuela) => {
        // Contar profesores
        const { count: profesoresCount } = await supabase
          .from('usuarios')
          .select('*', { count: 'exact', head: true })
          .eq('escuela_id', escuela.id)
          .eq('rol', 'docente');

        // Contar alumnos
        const { count: alumnosCount } = await supabase
          .from('usuarios')
          .select('*', { count: 'exact', head: true })
          .eq('escuela_id', escuela.id)
          .eq('rol', 'alumno');

        // Contar grupos
        const { count: gruposCount } = await supabase
          .from('grupos')
          .select('*', { count: 'exact', head: true })
          .eq('escuela_id', escuela.id);

        // Obtener nombre del director si existe
        let directorNombre = undefined;
        if (escuela.director_id) {
          const { data: director } = await supabase
            .from('usuarios')
            .select('nombre, apellido')
            .eq('id', escuela.director_id)
            .single();
          
          if (director) {
            directorNombre = `${director.nombre} ${director.apellido}`;
          }
        }

        return {
          id: escuela.id,
          nombre: escuela.nombre,
          director_id: escuela.director_id,
          director_nombre: directorNombre,
          total_profesores: profesoresCount || 0,
          total_alumnos: alumnosCount || 0,
          total_grupos: gruposCount || 0,
          activo: escuela.activo ?? true,
          fecha_creacion: escuela.created_at,
        };
      })
    );

    return escuelasConStats;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
}

/**
 * Crear una nueva escuela
 */
export async function createSchool(escuelaData: {
  nombre: string;
  director_id?: string;
}): Promise<AdminSchool> {
  try {
    const { data, error } = await supabase
      .from('escuelas')
      .insert([{
        nombre: escuelaData.nombre,
        director_id: escuelaData.director_id,
        activo: true,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      nombre: data.nombre,
      director_id: data.director_id,
      total_profesores: 0,
      total_alumnos: 0,
      total_grupos: 0,
      activo: true,
      fecha_creacion: data.created_at,
    };
  } catch (error) {
    console.error('Error creating school:', error);
    throw error;
  }
}

/**
 * Actualizar una escuela
 */
export async function updateSchool(
  escuelaId: string,
  updates: Partial<{
    nombre: string;
    director_id: string;
    activo: boolean;
  }>
): Promise<AdminSchool> {
  try {
    const { data, error } = await supabase
      .from('escuelas')
      .update(updates)
      .eq('id', escuelaId)
      .select()
      .single();

    if (error) throw error;

    // Contar stats
    const { count: profesoresCount } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .eq('escuela_id', escuelaId)
      .eq('rol', 'docente');

    const { count: alumnosCount } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .eq('escuela_id', escuelaId)
      .eq('rol', 'alumno');

    const { count: gruposCount } = await supabase
      .from('grupos')
      .select('*', { count: 'exact', head: true })
      .eq('escuela_id', escuelaId);

    return {
      id: data.id,
      nombre: data.nombre,
      director_id: data.director_id,
      total_profesores: profesoresCount || 0,
      total_alumnos: alumnosCount || 0,
      total_grupos: gruposCount || 0,
      activo: data.activo ?? true,
      fecha_creacion: data.created_at,
    };
  } catch (error) {
    console.error('Error updating school:', error);
    throw error;
  }
}

/**
 * Eliminar una escuela (soft delete)
 */
export async function deleteSchool(escuelaId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('escuelas')
      .update({ activo: false })
      .eq('id', escuelaId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting school:', error);
    throw error;
  }
}

/**
 * Obtener escuela por ID
 */
export async function fetchSchoolById(escuelaId: string): Promise<AdminSchool> {
  try {
    const { data, error } = await supabase
      .from('escuelas')
      .select('*')
      .eq('id', escuelaId)
      .single();

    if (error) throw error;

    // Contar stats
    const { count: profesoresCount } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .eq('escuela_id', escuelaId)
      .eq('rol', 'docente');

    const { count: alumnosCount } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .eq('escuela_id', escuelaId)
      .eq('rol', 'alumno');

    const { count: gruposCount } = await supabase
      .from('grupos')
      .select('*', { count: 'exact', head: true })
      .eq('escuela_id', escuelaId);

    // Nombre del director
    let directorNombre = undefined;
    if (data.director_id) {
      const { data: director } = await supabase
        .from('usuarios')
        .select('nombre, apellido')
        .eq('id', data.director_id)
        .single();
      
      if (director) {
        directorNombre = `${director.nombre} ${director.apellido}`;
      }
    }

    return {
      id: data.id,
      nombre: data.nombre,
      director_id: data.director_id,
      director_nombre: directorNombre,
      total_profesores: profesoresCount || 0,
      total_alumnos: alumnosCount || 0,
      total_grupos: gruposCount || 0,
      activo: data.activo ?? true,
      fecha_creacion: data.created_at,
    };
  } catch (error) {
    console.error('Error fetching school by id:', error);
    throw error;
  }
}

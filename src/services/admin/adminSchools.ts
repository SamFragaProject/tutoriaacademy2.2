import { supabase } from '../../lib/supabaseClient';

export interface AdminSchool {
  id: string;
  nombre: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  telefono?: string;
  email?: string;
  created_at: string;
  activo: boolean;
  total_profesores?: number;
  total_alumnos?: number;
}

// Obtener todas las escuelas
export const getSchools = async () => {
  try {
    const { data, error } = await supabase
      .from('escuelas')
      .select(`
        *,
        profesores:users!escuela_id(count),
        alumnos:users!escuela_id(count)
      `)
      .eq('users.rol', 'profesor')
      .order('nombre');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching schools:', error);
    return { data: null, error };
  }
};

// Obtener escuela por ID
export const getSchoolById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('escuelas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching school:', error);
    return { data: null, error };
  }
};

// Crear escuela
export const createSchool = async (school: Omit<AdminSchool, 'id' | 'created_at' | 'total_profesores' | 'total_alumnos'>) => {
  try {
    const { data, error } = await supabase
      .from('escuelas')
      .insert([school])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating school:', error);
    return { data: null, error };
  }
};

// Actualizar escuela
export const updateSchool = async (id: string, updates: Partial<AdminSchool>) => {
  try {
    const { data, error } = await supabase
      .from('escuelas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating school:', error);
    return { data: null, error };
  }
};

// Eliminar escuela (soft delete)
export const deleteSchool = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('escuelas')
      .update({ activo: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error deleting school:', error);
    return { data: null, error };
  }
};

// Obtener estadísticas de escuelas
export const getSchoolStats = async () => {
  try {
    const { count: totalSchools, error: e1 } = await supabase
      .from('escuelas')
      .select('*', { count: 'exact', head: true });
    
    const { count: activeSchools, error: e2 } = await supabase
      .from('escuelas')
      .select('*', { count: 'exact', head: true })
      .eq('activo', true);

    if (e1 || e2) throw new Error('Error fetching stats');

    return {
      data: {
        total: totalSchools || 0,
        active: activeSchools || 0,
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching school stats:', error);
    return { data: null, error };
  }
};

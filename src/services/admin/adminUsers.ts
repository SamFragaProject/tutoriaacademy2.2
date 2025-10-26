import { supabase } from '../../lib/supabaseClient';

export interface AdminUser {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'profesor' | 'alumno';
  escuela_id?: string;
  created_at: string;
  ultimo_acceso?: string;
  activo: boolean;
}

export interface UserFilters {
  rol?: string;
  escuela_id?: string;
  activo?: boolean;
  search?: string;
}

// Obtener todos los usuarios con filtros
export const getUsers = async (filters?: UserFilters) => {
  try {
    let query = supabase
      .from('users')
      .select('*, escuelas(nombre)');

    if (filters?.rol) {
      query = query.eq('rol', filters.rol);
    }
    if (filters?.escuela_id) {
      query = query.eq('escuela_id', filters.escuela_id);
    }
    if (filters?.activo !== undefined) {
      query = query.eq('activo', filters.activo);
    }
    if (filters?.search) {
      query = query.or(`nombre.ilike.%${filters.search}%,apellido.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { data: null, error };
  }
};

// Obtener usuario por ID
export const getUserById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, escuelas(nombre)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { data: null, error };
  }
};

// Crear usuario
export const createUser = async (user: Omit<AdminUser, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating user:', error);
    return { data: null, error };
  }
};

// Actualizar usuario
export const updateUser = async (id: string, updates: Partial<AdminUser>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user:', error);
    return { data: null, error };
  }
};

// Eliminar usuario (soft delete)
export const deleteUser = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ activo: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { data: null, error };
  }
};

// Obtener estadísticas de usuarios
export const getUserStats = async () => {
  try {
    const { data: totalUsers, error: e1 } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true });
    
    const { data: activeUsers, error: e2 } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('activo', true);
    
    const { data: teachers, error: e3 } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('rol', 'profesor');
    
    const { data: students, error: e4 } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('rol', 'alumno');

    if (e1 || e2 || e3 || e4) throw new Error('Error fetching stats');

    return {
      data: {
        total: totalUsers?.length || 0,
        active: activeUsers?.length || 0,
        teachers: teachers?.length || 0,
        students: students?.length || 0,
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { data: null, error };
  }
};

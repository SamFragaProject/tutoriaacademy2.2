import { supabase } from '../../src/lib/supabase';
import type { AdminUser, BulkUploadResult, AdminStats } from '../../types';

/**
 * Obtener todos los usuarios con filtros
 */
export async function fetchAllUsers(filters?: {
  rol?: string;
  escuela_id?: string;
  activo?: boolean;
  busqueda?: string;
}): Promise<AdminUser[]> {
  try {
    let query = supabase
      .from('usuarios')
      .select(`
        *,
        escuelas(nombre)
      `)
      .order('fecha_creacion', { ascending: false });

    // Aplicar filtros
    if (filters?.rol) {
      query = query.eq('rol', filters.rol);
    }
    if (filters?.escuela_id) {
      query = query.eq('escuela_id', filters.escuela_id);
    }
    if (filters?.activo !== undefined) {
      query = query.eq('activo', filters.activo);
    }
    if (filters?.busqueda) {
      query = query.or(`nombre.ilike.%${filters.busqueda}%,apellido.ilike.%${filters.busqueda}%,email.ilike.%${filters.busqueda}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(user => ({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      escuela_id: user.escuela_id,
      escuela_nombre: user.escuelas?.nombre,
      activo: user.activo ?? true,
      ultimo_acceso: user.ultimo_acceso,
      fecha_creacion: user.created_at,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Obtener estadísticas generales del sistema
 */
export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    // Contar usuarios por rol
    const { data: usuarios, error: usersError } = await supabase
      .from('usuarios')
      .select('rol, activo, created_at');

    if (usersError) throw usersError;

    const total = usuarios?.length || 0;
    const activos = usuarios?.filter(u => u.activo !== false).length || 0;
    
    // Contar por rol
    const porRol = {
      admin: usuarios?.filter(u => u.rol === 'admin').length || 0,
      director: usuarios?.filter(u => u.rol === 'director').length || 0,
      docente: usuarios?.filter(u => u.rol === 'docente').length || 0,
      alumno: usuarios?.filter(u => u.rol === 'alumno').length || 0,
    };

    // Nuevos usuarios últimos 7 días
    const hace7dias = new Date();
    hace7dias.setDate(hace7dias.getDate() - 7);
    const nuevos7d = usuarios?.filter(u => 
      new Date(u.created_at) >= hace7dias
    ).length || 0;

    // Contar escuelas
    const { count: escuelasCount } = await supabase
      .from('escuelas')
      .select('*', { count: 'exact', head: true });

    // Contar grupos
    const { count: gruposCount } = await supabase
      .from('grupos')
      .select('*', { count: 'exact', head: true });

    return {
      totalUsuarios: total,
      totalProfesores: porRol.docente,
      totalAlumnos: porRol.alumno,
      totalEscuelas: escuelasCount || 0,
      totalGrupos: gruposCount || 0,
      usuariosActivos30d: activos,
      nuevosUsuarios7d: nuevos7d,
      tasaActivacion: total > 0 ? (activos / total) * 100 : 0,
      usuariosPorRol: porRol,
      tendencias: {
        usuariosNuevos: [],
        actividadDiaria: [],
      },
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
}

/**
 * Crear un nuevo usuario
 */
export async function createUser(userData: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: string;
  escuela_id?: string;
}): Promise<AdminUser> {
  try {
    // 1. Crear usuario en auth.users (si Supabase Auth está configurado)
    // Por ahora, solo creamos en la tabla usuarios
    
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        rol: userData.rol,
        escuela_id: userData.escuela_id,
        activo: true,
        created_at: new Date().toISOString(),
      }])
      .select(`
        *,
        escuelas(nombre)
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      rol: data.rol,
      escuela_id: data.escuela_id,
      escuela_nombre: data.escuelas?.nombre,
      activo: data.activo,
      fecha_creacion: data.created_at,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Actualizar un usuario existente
 */
export async function updateUser(
  userId: string,
  updates: Partial<{
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
    escuela_id: string;
    activo: boolean;
  }>
): Promise<AdminUser> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', userId)
      .select(`
        *,
        escuelas(nombre)
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      rol: data.rol,
      escuela_id: data.escuela_id,
      escuela_nombre: data.escuelas?.nombre,
      activo: data.activo,
      ultimo_acceso: data.ultimo_acceso,
      fecha_creacion: data.created_at,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Eliminar un usuario (soft delete - marcar como inactivo)
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('usuarios')
      .update({ activo: false })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Eliminar permanentemente un usuario
 */
export async function hardDeleteUser(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error hard deleting user:', error);
    throw error;
  }
}

/**
 * Subida masiva de usuarios desde CSV
 */
export async function bulkUploadUsers(
  usuarios: Array<{
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
    escuela_id?: string;
  }>
): Promise<BulkUploadResult> {
  const resultado: BulkUploadResult = {
    total: usuarios.length,
    exitosos: 0,
    fallidos: 0,
    errores: [],
    usuariosCreados: [],
  };

  for (let i = 0; i < usuarios.length; i++) {
    const usuario = usuarios[i];
    
    try {
      // Validar email
      if (!usuario.email || !usuario.email.includes('@')) {
        throw new Error('Email inválido');
      }

      // Validar campos requeridos
      if (!usuario.nombre || !usuario.apellido || !usuario.rol) {
        throw new Error('Faltan campos requeridos (nombre, apellido, rol)');
      }

      // Crear usuario
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol,
          escuela_id: usuario.escuela_id,
          activo: true,
          created_at: new Date().toISOString(),
        }])
        .select(`
          *,
          escuelas(nombre)
        `)
        .single();

      if (error) throw error;

      resultado.exitosos++;
      resultado.usuariosCreados.push({
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        rol: data.rol,
        escuela_id: data.escuela_id,
        escuela_nombre: data.escuelas?.nombre,
        activo: data.activo,
        fecha_creacion: data.created_at,
      });
    } catch (error: any) {
      resultado.fallidos++;
      resultado.errores.push({
        fila: i + 2, // +2 porque CSV tiene header y fila 1 es header
        email: usuario.email || 'sin email',
        motivo: error.message || 'Error desconocido',
      });
    }
  }

  return resultado;
}

/**
 * Obtener usuario por ID
 */
export async function fetchUserById(userId: string): Promise<AdminUser> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        escuelas(nombre)
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Si es profesor, contar grupos
    let totalGrupos = 0;
    let totalAlumnos = 0;
    if (data.rol === 'docente') {
      const { count: gruposCount } = await supabase
        .from('grupos')
        .select('*', { count: 'exact', head: true })
        .eq('profesor_id', userId);
      
      totalGrupos = gruposCount || 0;

      // Contar alumnos en esos grupos
      const { data: grupos } = await supabase
        .from('grupos')
        .select('id')
        .eq('profesor_id', userId);

      if (grupos && grupos.length > 0) {
        const grupoIds = grupos.map(g => g.id);
        const { count: alumnosCount } = await supabase
          .from('grupos_alumnos')
          .select('*', { count: 'exact', head: true })
          .in('grupo_id', grupoIds);
        
        totalAlumnos = alumnosCount || 0;
      }
    }

    return {
      id: data.id,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      rol: data.rol,
      escuela_id: data.escuela_id,
      escuela_nombre: data.escuelas?.nombre,
      activo: data.activo ?? true,
      ultimo_acceso: data.ultimo_acceso,
      fecha_creacion: data.created_at,
      total_grupos: totalGrupos,
      total_alumnos: totalAlumnos,
    };
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
}

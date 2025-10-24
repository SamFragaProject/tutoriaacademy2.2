import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface UserData {
  id: string;
  escuela_id: string;
  nombre: string;
  apellidos: string | null;
  email: string;
  rol: 'alumno' | 'profesor' | 'director' | 'admin';
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData: Partial<UserData>) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias para compatibilidad
  userRole: 'alumno' | 'profesor' | 'director' | 'admin' | null;
  escuelaId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    console.log('🔵 AuthContext: useEffect inicial ejecutándose');
    
    let mounted = true;

    // Función para inicializar la sesión
    const initializeAuth = async () => {
      try {
        console.log('🔵 AuthContext: Obteniendo sesión inicial...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) {
          console.log('⚠️ Componente desmontado, abortando inicialización');
          return;
        }

        if (error) {
          console.error('🔴 Error obteniendo sesión:', error);
          setLoading(false);
          setInitializing(false);
          return;
        }

        console.log('🔵 AuthContext: getSession completado', { hasSession: !!session, hasUser: !!session?.user });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('🔵 AuthContext: Usuario encontrado en sesión inicial, cargando datos...');
          await loadUserData(session.user.id, session.user.email);
        } else {
          console.log('� AuthContext: No hay sesión inicial, setLoading(false)');
          setLoading(false);
        }
      } catch (err) {
        console.error('� Error crítico en initializeAuth:', err);
        if (mounted) {
          setLoading(false);
        }
      } finally {
        if (mounted) {
          console.log('� AuthContext: Inicialización completada');
          setInitializing(false);
        }
      }
    };

    // Ejecutar inicialización
    initializeAuth();

    // Escuchar cambios de autenticación (solo después de inicializar)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔵 AuthContext: onAuthStateChange', { event, hasSession: !!session, initializing });
        
        // Ignorar eventos durante la inicialización para evitar race conditions
        if (initializing) {
          console.log('⚠️ Ignorando evento durante inicialización:', event);
          return;
        }

        if (!mounted) {
          console.log('⚠️ Componente desmontado, ignorando evento:', event);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('🔵 AuthContext: Cargando datos por cambio de auth:', event);
          await loadUserData(session.user.id, session.user.email);
        } else {
          console.log('� AuthContext: Sin sesión, limpiando userData');
          setUserData(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      console.log('🔵 AuthContext: Limpieza completada');
    };
  }, []);

  const loadUserData = async (userId: string, userEmail?: string) => {
    try {
      console.log('✅ Intentando cargar datos del usuario:', userId);
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error cargando datos de usuario:', error);
        // Crear datos temporales si falla y continuar
        const tempUserData: UserData = {
          id: userId,
          escuela_id: '11111111-1111-1111-1111-111111111111',
          nombre: 'Usuario',
          apellidos: 'Temporal',
          email: userEmail || 'demo@escuela.com',
          rol: 'profesor',
          avatar_url: null
        };
        console.log('⚠️ Usando datos temporales por error:', tempUserData);
        setUserData(tempUserData);
        return;
      }
      
      if (data) {
        console.log('✅ Datos de usuario cargados correctamente:', data);
        setUserData(data as UserData);
      } else {
        console.warn('⚠️ No se encontraron datos, creando perfil temporal');
        // Usuario no existe en la tabla, crear temporal
        const tempUserData: UserData = {
          id: userId,
          escuela_id: '11111111-1111-1111-1111-111111111111',
          nombre: 'Usuario',
          apellidos: 'Temporal',
          email: userEmail || 'demo@escuela.com',
          rol: 'profesor',
          avatar_url: null
        };
        console.log('⚠️ Usando datos temporales (no encontrado):', tempUserData);
        setUserData(tempUserData);
      }
    } catch (error) {
      console.error('❌ Error crítico en loadUserData:', error);
      // Aún con error, crear datos temporales para no bloquear
      const tempUserData: UserData = {
        id: userId,
        escuela_id: '11111111-1111-1111-1111-111111111111',
        nombre: 'Usuario',
        apellidos: 'Temporal',
        email: userEmail || 'demo@escuela.com',
        rol: 'profesor',
        avatar_url: null
      };
      console.log('⚠️ Usando datos temporales por excepción:', tempUserData);
      setUserData(tempUserData);
    } finally {
      console.log('✅ Loading finalizado - setLoading(false)');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signUp = async (
    email: string, 
    password: string, 
    userInfo: Partial<UserData>
  ) => {
    // 1. Crear usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { error: authError };
    }

    // 2. Crear registro en tabla usuarios
    if (authData.user) {
      const { error: userError } = await supabase
        .from('usuarios')
        .insert({
          id: authData.user.id,
          email,
          nombre: userInfo.nombre || 'Usuario',
          apellidos: userInfo.apellidos || null,
          rol: userInfo.rol || 'alumno',
          escuela_id: userInfo.escuela_id || null,
          avatar_url: null,
          activo: true,
        });

      if (userError) {
        console.error('Error creando usuario en BD:', userError);
        return { error: userError as any };
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    console.log('🚪 Cerrando sesión...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error al cerrar sesión:', error);
      } else {
        console.log('✅ Sesión cerrada exitosamente');
      }
    } catch (err) {
      console.error('❌ Error crítico en signOut:', err);
    } finally {
      // Limpiar estado local siempre, incluso si falla
      setUser(null);
      setSession(null);
      setUserData(null);
      console.log('🧹 Estado local limpiado');
    }
  };

  const value: AuthContextType = {
    user,
    session,
    userData,
    loading,
    signIn,
    signUp,
    signOut,
    userRole: userData?.rol || null,
    escuelaId: userData?.escuela_id || null,
    logout: signOut, // Alias para compatibilidad
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Exportar todo lo necesario
export { AuthContext };
export type { AuthContextType, UserData };

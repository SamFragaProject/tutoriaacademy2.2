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
  userRole: 'alumno' | 'profesor' | 'director' | 'admin' | null;
  escuelaId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setUserData(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error cargando datos de usuario:', error);
        setUserData(null);
      } else {
        setUserData(data as UserData);
      }
    } catch (error) {
      console.error('Error en loadUserData:', error);
      setUserData(null);
    } finally {
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
    await supabase.auth.signOut();
    setUserData(null);
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

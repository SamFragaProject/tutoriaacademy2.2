import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'alumno' | 'profesor' | 'director' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, userData, loading: authLoading } = useAuth();
  const location = useLocation();

  console.log('🔐 ProtectedRoute check:', { 
    user: !!user, 
    authLoading, 
    path: location.pathname, 
    requiredRole, 
    userRole: userData?.rol 
  });

  if (authLoading) {
    console.log('🔐 ProtectedRoute: Mostrando loader (authLoading=true)');
    return (
      <div className="flex h-screen w-full items-center justify-center" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#F0F2F5'}}>
        <div style={{textAlign:'center'}}>
          <Loader />
          <p style={{marginTop:'1rem',color:'#4A5568'}}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🔐 ProtectedRoute: No user, redirigiendo a /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check: if a requiredRole is specified, verify userData.rol matches
  if (requiredRole && userData?.rol !== requiredRole) {
    console.warn(`🔐 ProtectedRoute: Role mismatch. Required: ${requiredRole}, User: ${userData?.rol}`);
    // Redirect to appropriate dashboard for their actual role
    const redirectPath = 
      userData?.rol === 'profesor' ? '/docente/dashboard' :
      userData?.rol === 'director' ? '/director/dashboard' :
      userData?.rol === 'admin' ? '/admin/inicio' :
      '/app/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  console.log('🔐 ProtectedRoute: User autenticado y rol verificado, renderizando children');
  return <>{children}</>;
};
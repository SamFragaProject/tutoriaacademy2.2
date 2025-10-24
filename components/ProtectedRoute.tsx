import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from './Loader';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  console.log('🔐 ProtectedRoute check:', { user: !!user, authLoading, path: location.pathname });

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

  console.log('🔐 ProtectedRoute: User autenticado, renderizando children');
  return <>{children}</>;
};
import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const SimpleTeacherDashboard: React.FC = () => {
  const { user, userData, userRole } = useAuth();

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          color: '#1a202c'
        }}>
          🎓 Dashboard del Profesor
        </h1>

        <div style={{ 
          backgroundColor: '#e6fffa', 
          border: '1px solid #38b2ac',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#234e52'
          }}>
            ✅ ¡Autenticación Exitosa!
          </h2>
          <p style={{ marginBottom: '0.5rem', color: '#2c7a7b' }}>
            El sistema de autenticación está funcionando correctamente.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Card: Información del Usuario */}
          <div style={{
            backgroundColor: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#2d3748'
            }}>
              👤 Información del Usuario
            </h3>
            <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Email:</strong> {user?.email || 'No disponible'}
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>ID:</strong> {user?.id?.substring(0, 8)}...
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Rol:</strong> {userRole || 'No definido'}
              </p>
            </div>
          </div>

          {/* Card: Datos del Perfil */}
          <div style={{
            backgroundColor: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#2d3748'
            }}>
              📋 Datos del Perfil
            </h3>
            <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Nombre:</strong> {userData?.nombre || 'No disponible'}
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Apellidos:</strong> {userData?.apellidos || 'No disponible'}
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Escuela ID:</strong> {userData?.escuela_id?.substring(0, 8)}...
              </p>
            </div>
          </div>

          {/* Card: Estado del Sistema */}
          <div style={{
            backgroundColor: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#2d3748'
            }}>
              ⚙️ Estado del Sistema
            </h3>
            <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                ✅ Autenticación: OK
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                ✅ Sesión: Activa
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                ✅ Datos: Cargados
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff5f5',
          border: '1px solid #fc8181',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            marginBottom: '0.5rem',
            color: '#c53030'
          }}>
            ⚠️ Próximos Pasos
          </h3>
          <ul style={{ 
            marginLeft: '1.5rem', 
            fontSize: '0.875rem', 
            color: '#742a2a',
            lineHeight: '1.6'
          }}>
            <li>Deshabilitar RLS en Supabase (ejecutar SQL en disable_rls.sql)</li>
            <li>Verificar que el usuario existe en la tabla 'usuarios'</li>
            <li>Una vez corregido, el dashboard completo se mostrará</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: '#edf2f7',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#2d3748'
          }}>
            🔍 Datos Técnicos (Debug)
          </h3>
          <details>
            <summary style={{ 
              cursor: 'pointer', 
              fontSize: '0.875rem',
              color: '#4a5568',
              marginBottom: '0.5rem'
            }}>
              Ver userData completo
            </summary>
            <pre style={{
              backgroundColor: '#1a202c',
              color: '#68d391',
              padding: '1rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              overflow: 'auto',
              marginTop: '0.5rem'
            }}>
              {JSON.stringify(userData, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Card, PrimaryButton } from '../ui';
import { BookCopy, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * MÓDULO DE PRUEBA SIMPLE
 * Para verificar que la navegación y estado básico funcionan
 * NO reemplaza el código principal hasta confirmar que funciona
 */

export const ExamCreatorSimple: React.FC = () => {
  const { user } = useAuth();
  const [testMessage, setTestMessage] = useState('Módulo de prueba cargado correctamente');

  const handleTest = () => {
    setTestMessage('✓ Click funcionando - Usuario: ' + (user?.name || 'No identificado'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookCopy className="w-10 h-10 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">
              Módulo de Prueba - Exámenes
            </h1>
          </div>
          <p className="text-white/60">
            Verificando funcionalidad básica antes de integración
          </p>
        </div>

        {/* Test Card */}
        <Card className="p-8 bg-slate-800/50 border-slate-700">
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">
              <Check className="w-20 h-20 text-green-500 mx-auto" />
            </div>
            
            <h2 className="text-2xl font-bold text-white">
              {testMessage}
            </h2>

            <div className="space-y-3 text-left bg-slate-900/50 p-6 rounded-lg">
              <p className="text-white/80">
                <strong className="text-purple-400">Usuario:</strong> {user?.name || 'No autenticado'}
              </p>
              <p className="text-white/80">
                <strong className="text-purple-400">Rol:</strong> {user?.role || 'Sin rol'}
              </p>
              <p className="text-white/80">
                <strong className="text-purple-400">ID:</strong> {user?.id || 'Sin ID'}
              </p>
            </div>

            <PrimaryButton 
              onClick={handleTest}
              className="w-full"
            >
              Probar Interacción
            </PrimaryButton>

            <div className="text-sm text-white/40 pt-4 border-t border-white/10">
              Si ves este mensaje, la navegación a Exámenes está funcionando.
              El problema puede estar en el componente EnhancedExamCreator.
            </div>
          </div>
        </Card>

        {/* Debug Info */}
        <Card className="mt-6 p-4 bg-yellow-900/20 border-yellow-500/30">
          <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Información de Debug
          </h3>
          <ul className="text-white/60 text-sm space-y-1">
            <li>✓ Componente renderizado correctamente</li>
            <li>✓ Contexto de autenticación funcionando</li>
            <li>✓ Sistema de UI (Card, Button) operativo</li>
            <li>→ Siguiente paso: Probar EnhancedExamCreator por partes</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

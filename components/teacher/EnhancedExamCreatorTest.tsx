import React, { useState, useMemo } from 'react';
import { Card } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { getGroupsByTeacher } from '../../data/schoolMockData';
import { BookOpen, Check, Users } from 'lucide-react';

/**
 * VERSIÓN SIMPLIFICADA DE PRUEBA
 * Solo muestra el paso 1 para diagnosticar el problema
 */

export const EnhancedExamCreatorTest: React.FC = () => {
  const { user } = useAuth();
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // Mismo código que en el componente original
  const myGroups = useMemo(() => {
    console.log('[TEST] Usuario:', user);
    if (!user?.id) {
      console.log('[TEST] No hay user.id, retornando []');
      return [];
    }
    const groups = getGroupsByTeacher(user.id);
    console.log('[TEST] Grupos obtenidos:', groups);
    return groups;
  }, [user?.id]);

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  console.log('[TEST] Renderizando componente...');
  console.log('[TEST] myGroups:', myGroups);
  console.log('[TEST] selectedGroups:', selectedGroups);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">
              TEST: Crear Examen - Paso 1
            </h1>
          </div>
          <p className="text-white/60">
            Versión de prueba para diagnosticar problemas
          </p>
        </div>

        {/* Debug Info */}
        <Card className="mb-6 p-4 bg-yellow-900/20 border-yellow-500/30">
          <h3 className="text-yellow-400 font-bold mb-2">Debug Info</h3>
          <div className="text-white/60 text-sm space-y-1 font-mono">
            <p>Usuario ID: {user?.id || 'undefined'}</p>
            <p>Usuario Nombre: {user?.name || 'undefined'}</p>
            <p>Grupos encontrados: {myGroups?.length || 0}</p>
            <p>Grupos seleccionados: {selectedGroups.length}</p>
          </div>
        </Card>

        {/* Paso 1: Configuración Básica */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Paso 1: Configuración Básica
            </h2>
            <p className="text-white/60 mt-2">
              Selecciona los grupos para asignar el examen
            </p>
          </div>

          {/* Grupos Disponibles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Grupos Disponibles ({myGroups?.length || 0})
            </h3>
            
            {!myGroups || myGroups.length === 0 ? (
              <div className="p-6 text-center bg-slate-900/50 rounded-lg border border-slate-700">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-white/60">
                  {!user?.id 
                    ? 'No hay usuario autenticado'
                    : 'No tienes grupos asignados'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {myGroups.map(group => (
                  <label 
                    key={group.id}
                    className={`
                      flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer
                      transition-all duration-200
                      ${selectedGroups.includes(group.id)
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-slate-700 bg-slate-900/50 hover:border-purple-500/50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => handleGroupToggle(group.id)}
                      className="w-5 h-5 rounded border-slate-600 text-purple-500 
                               focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {group.name}
                        </span>
                        {selectedGroups.includes(group.id) && (
                          <Check className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <p className="text-sm text-white/60">
                        {group.subject} • {group.students?.length || 0} estudiantes
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Resumen */}
          {selectedGroups.length > 0 && (
            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-white">
                ✓ {selectedGroups.length} grupo(s) seleccionado(s)
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

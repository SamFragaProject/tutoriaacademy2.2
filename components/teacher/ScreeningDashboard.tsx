import React, { useState, useMemo } from 'react';
import { AlertTriangle, Filter, Download, Search, TrendingUp, Users } from 'lucide-react';
import { ScreeningAlertCard } from '../ScreeningAlertCard';
import type { ScreeningAlert, LearningDifficultyType, AlertLevel } from '../../types';
import * as screeningService from '../../services/learningDifficulties';

interface ScreeningDashboardProps {
  groupId: string;
  studentIds: string[];
}

export const ScreeningDashboard: React.FC<ScreeningDashboardProps> = ({ groupId, studentIds }) => {
  const [selectedLevel, setSelectedLevel] = useState<AlertLevel | 'all'>('all');
  const [selectedType, setSelectedType] = useState<LearningDifficultyType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<ScreeningAlert | null>(null);

  // Obtener alertas del grupo
  const alerts = useMemo(() => {
    return screeningService.getGroupAlerts(groupId, studentIds);
  }, [groupId, studentIds]);

  // Filtrar alertas
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const levelMatch = selectedLevel === 'all' || alert.level === selectedLevel;
      const typeMatch = selectedType === 'all' || alert.type === selectedType;
      const searchMatch = searchQuery === '' || 
        alert.studentName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return levelMatch && typeMatch && searchMatch;
    });
  }, [alerts, selectedLevel, selectedType, searchQuery]);

  // Estadísticas
  const stats = useMemo(() => {
    const byLevel = {
      red: alerts.filter(a => a.level === 'red').length,
      orange: alerts.filter(a => a.level === 'orange').length,
      yellow: alerts.filter(a => a.level === 'yellow').length,
      green: 0
    };

    const byType = {
      dyslexia: alerts.filter(a => a.type === 'dyslexia').length,
      dyscalculia: alerts.filter(a => a.type === 'dyscalculia').length,
      dysgraphia: alerts.filter(a => a.type === 'dysgraphia').length,
      adhd: alerts.filter(a => a.type === 'adhd').length,
      dyspraxia: alerts.filter(a => a.type === 'dyspraxia').length
    };

    const byStatus = {
      pending: alerts.filter(a => a.status === 'pending').length,
      acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
      in_progress: alerts.filter(a => a.status === 'in_progress').length,
      resolved: alerts.filter(a => a.status === 'resolved').length
    };

    return { byLevel, byType, byStatus };
  }, [alerts]);

  const handleAcknowledge = (alertId: string) => {
    screeningService.updateAlertStatus(alertId, 'acknowledged');
    // Trigger re-render
    window.location.reload();
  };

  const handleResolve = (alertId: string) => {
    screeningService.updateAlertStatus(alertId, 'resolved');
    window.location.reload();
  };

  const handleView = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <AlertTriangle className="w-8 h-8 text-orange-600" />
          Sistema de Screening
        </h1>
        <p className="text-gray-600">
          Detección temprana de dificultades de aprendizaje en tus estudiantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border-2 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-600 font-semibold">Alertas Rojas</span>
            <span className="text-3xl">🔴</span>
          </div>
          <p className="text-3xl font-bold text-red-700">{stats.byLevel.red}</p>
          <p className="text-xs text-red-600 mt-1">Requieren derivación urgente</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border-2 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-600 font-semibold">Alertas Naranjas</span>
            <span className="text-3xl">🟠</span>
          </div>
          <p className="text-3xl font-bold text-orange-700">{stats.byLevel.orange}</p>
          <p className="text-xs text-orange-600 mt-1">Intervención sugerida</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-700 font-semibold">Alertas Amarillas</span>
            <span className="text-3xl">🟡</span>
          </div>
          <p className="text-3xl font-bold text-yellow-700">{stats.byLevel.yellow}</p>
          <p className="text-xs text-yellow-700 mt-1">Monitoreo recomendado</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-600 font-semibold">Estudiantes</span>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-700">{studentIds.length}</p>
          <p className="text-xs text-blue-600 mt-1">
            {alerts.length} con alertas activas
          </p>
        </div>
      </div>

      {/* Type Distribution */}
      <div className="bg-white p-4 rounded-lg border-2 mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Distribución por Tipo
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl mb-1">
                {type === 'dyslexia' ? '📖' : 
                 type === 'dyscalculia' ? '🔢' : 
                 type === 'dysgraphia' ? '✍️' : 
                 type === 'adhd' ? '🎯' : '🤸'}
              </div>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-gray-600 capitalize">{type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border-2 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5" />
          <h3 className="font-semibold">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-1">Buscar estudiante</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nombre del estudiante..."
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Nivel de Alerta</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as AlertLevel | 'all')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los niveles</option>
              <option value="red">🔴 Rojo - Urgente</option>
              <option value="orange">🟠 Naranja - Alto</option>
              <option value="yellow">🟡 Amarillo - Medio</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Dificultad</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as LearningDifficultyType | 'all')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las dificultades</option>
              <option value="dyslexia">📖 Dislexia</option>
              <option value="dyscalculia">🔢 Discalculia</option>
              <option value="dysgraphia">✍️ Disgrafía</option>
              <option value="adhd">🎯 TDAH</option>
              <option value="dyspraxia">🤸 Dispraxia</option>
            </select>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-4 flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Exportar Reporte (PDF)
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600">
          Mostrando <span className="font-semibold">{filteredAlerts.length}</span> de{' '}
          <span className="font-semibold">{alerts.length}</span> alertas
        </p>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            {stats.byStatus.pending} pendientes
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {stats.byStatus.in_progress} en proceso
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            {stats.byStatus.resolved} resueltas
          </span>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <p className="text-gray-500 text-lg">No se encontraron alertas con los filtros seleccionados</p>
            <p className="text-gray-400 text-sm mt-2">
              {alerts.length === 0 ? '¡Excelente! No hay alertas activas en este grupo' : 'Intenta ajustar los filtros'}
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <ScreeningAlertCard
              key={alert.id}
              alert={alert}
              onView={handleView}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
            />
          ))
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ ¿Cómo usar el Sistema de Screening?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• El sistema analiza automáticamente los patrones de interacción de cada estudiante</li>
          <li>• Las alertas se generan cuando se detectan indicadores de posibles dificultades</li>
          <li>• Revisa las alertas rojas y naranjas prioritariamente</li>
          <li>• Usa los reportes para compartir información con especialistas y padres</li>
          <li>• El sistema NO reemplaza una evaluación profesional, es una herramienta de detección temprana</li>
        </ul>
      </div>
    </div>
  );
};

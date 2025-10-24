import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Eye, FileText } from 'lucide-react';
import type { ScreeningAlert, LearningDifficultyType } from '../types';

interface ScreeningAlertCardProps {
  alert: ScreeningAlert;
  onView?: (alertId: string) => void;
  onAcknowledge?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
}

const difficultyLabels: Record<LearningDifficultyType, string> = {
  dyslexia: 'Dislexia',
  dyscalculia: 'Discalculia',
  dysgraphia: 'Disgrafía',
  adhd: 'TDAH',
  dyspraxia: 'Dispraxia'
};

const difficultyIcons: Record<LearningDifficultyType, string> = {
  dyslexia: '📖',
  dyscalculia: '🔢',
  dysgraphia: '✍️',
  adhd: '🎯',
  dyspraxia: '🤸'
};

export const ScreeningAlertCard: React.FC<ScreeningAlertCardProps> = ({
  alert,
  onView,
  onAcknowledge,
  onResolve
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'red': return 'bg-red-50 border-red-300 text-red-800';
      case 'orange': return 'bg-orange-50 border-orange-300 text-orange-800';
      case 'yellow': return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-50 border-gray-300 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'red': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'orange': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'yellow': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">Pendiente</span>,
      acknowledged: <span className="px-2 py-1 text-xs rounded-full bg-blue-200 text-blue-700">Revisado</span>,
      in_progress: <span className="px-2 py-1 text-xs rounded-full bg-purple-200 text-purple-700">En Proceso</span>,
      resolved: <span className="px-2 py-1 text-xs rounded-full bg-green-200 text-green-700">Resuelto</span>
    };
    return badges[status as keyof typeof badges];
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${getLevelColor(alert.level)} transition-all hover:shadow-md`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{difficultyIcons[alert.type]}</div>
          <div>
            <div className="flex items-center gap-2">
              {getLevelIcon(alert.level)}
              <h3 className="font-semibold text-lg">{alert.studentName}</h3>
            </div>
            <p className="text-sm opacity-75">
              Posible {difficultyLabels[alert.type]}
            </p>
          </div>
        </div>
        <div className="text-right">
          {getStatusBadge(alert.status)}
          <p className="text-xs mt-1 opacity-75">{formatDate(alert.detectedAt)}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-white bg-opacity-50 rounded">
        <div>
          <p className="text-xs opacity-75">Score de Riesgo</p>
          <p className="text-2xl font-bold">{alert.score}<span className="text-sm">/100</span></p>
        </div>
        <div>
          <p className="text-xs opacity-75">Confianza</p>
          <p className="text-2xl font-bold">{alert.confidence}<span className="text-sm">%</span></p>
        </div>
      </div>

      {/* Notes */}
      {alert.notes && (
        <div className="mb-3 p-2 bg-white bg-opacity-50 rounded text-sm">
          <p className="font-semibold mb-1">Notas:</p>
          <p>{alert.notes}</p>
        </div>
      )}

      {/* Notified To */}
      <div className="mb-3">
        <p className="text-xs opacity-75 mb-1">Notificado a:</p>
        <div className="flex gap-2">
          {alert.notifiedTo.map(recipient => (
            <span key={recipient} className="px-2 py-1 text-xs rounded bg-white bg-opacity-70">
              {recipient === 'teacher' ? '👨‍🏫 Profesor' : 
               recipient === 'director' ? '🏫 Director' : 
               '👨‍👩‍👧 Padres'}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-current border-opacity-20">
        {onView && (
          <button
            onClick={() => onView(alert.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded font-medium text-sm transition-all"
          >
            <Eye className="w-4 h-4" />
            Ver Detalles
          </button>
        )}
        
        {alert.status === 'pending' && onAcknowledge && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded font-medium text-sm transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Revisar
          </button>
        )}
        
        {alert.status === 'in_progress' && onResolve && (
          <button
            onClick={() => onResolve(alert.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded font-medium text-sm transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Marcar Resuelto
          </button>
        )}
        
        <button
          className="px-3 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded font-medium text-sm transition-all"
          title="Generar reporte"
        >
          <FileText className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

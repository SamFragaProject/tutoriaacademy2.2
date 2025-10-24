
import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import type { FairUseState } from '../types';

interface FairUseBannerProps {
  state: FairUseState;
  onClose: () => void;
}

const FairUseBanner: React.FC<FairUseBannerProps> = ({ state, onClose }) => {
  if (state === 'normal') return null;

  const content = {
    'pre-cap': {
      icon: <AlertTriangle className="text-yellow-400" />,
      title: 'Modo de ahorro activado',
      message: 'Te estás acercando a tu límite diario. Las respuestas de la IA serán más concisas para conservar tu uso.',
      color: 'border-yellow-500/30 bg-yellow-900/20 text-yellow-300',
    },
    'capped': {
      icon: <Clock className="text-red-400" />,
      title: 'Límite diario alcanzado',
      message: 'Has alcanzado el límite de consultas por hoy. Las respuestas serán muy breves. ¡Es un buen momento para un descanso!',
      color: 'border-red-500/30 bg-red-900/20 text-red-400',
    },
  };

  const { icon, title, message, color } = content[state];

  return (
    <div role="alert" className={`flex items-start gap-4 p-4 rounded-lg border mb-4 ${color}`}>
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="flex-grow">
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm">{message}</p>
      </div>
      <button onClick={onClose} aria-label="Cerrar" className="p-1 -m-1">&times;</button>
    </div>
  );
};

export default FairUseBanner;
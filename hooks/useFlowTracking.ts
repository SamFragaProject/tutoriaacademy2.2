// hooks/useFlowTracking.ts
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import * as flowAutoCompletion from '../services/flowAutoCompletion';

/**
 * Hook para tracking automático de progreso en flujos
 * Facilita la integración del sistema de auto-completado en componentes
 */

export function useFlowTracking() {
  const { user } = useAuth();
  
  /**
   * Trackea un evento de actividad del usuario
   */
  const trackActivity = (activityType: string, metadata?: Record<string, any>) => {
    if (!user) return;
    
    flowAutoCompletion.trackStageActivity(user.id, user.role, activityType, metadata);
  };
  
  /**
   * Trackea un evento específico de una etapa
   */
  const trackStageEvent = (stageId: string, eventType: string, metadata?: Record<string, any>) => {
    if (!user) return;
    
    flowAutoCompletion.trackCompletionEvent({
      userId: user.id,
      stageId,
      eventType,
      metadata,
    });
  };
  
  return {
    trackActivity,
    trackStageEvent,
    userId: user?.id,
    userRole: user?.role,
  };
}

/**
 * Hook para trackear cuando un componente se monta
 * Útil para páginas que representan completar una etapa
 */
export function usePageVisit(eventType: string, metadata?: Record<string, any>) {
  const { trackActivity } = useFlowTracking();
  
  useEffect(() => {
    trackActivity(eventType, metadata);
  }, []); // Solo se ejecuta al montar
}

/**
 * Hook para escuchar eventos de completado de etapas
 */
export function useStageCompletionListener(callback: (detail: any) => void) {
  useEffect(() => {
    const handleStageCompleted = (event: Event) => {
      const customEvent = event as CustomEvent;
      callback(customEvent.detail);
    };
    
    window.addEventListener('stageCompleted', handleStageCompleted);
    
    return () => {
      window.removeEventListener('stageCompleted', handleStageCompleted);
    };
  }, [callback]);
}

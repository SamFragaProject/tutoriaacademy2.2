import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Card, PrimaryButton } from '../components/ui';
import * as stripeService from '../services/stripe';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

export const PaywallPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, loading: authLoading } = useAuth();
  const { activateDemo } = useSubscription();

  const handleActivate = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      // In demo mode, this will activate the subscription and the context will update.
      // The ProtectedRoute logic will then redirect the user away from the paywall.
      await stripeService.redirectToCheckout(user);
      activateDemo(); // Manually trigger context update for demo mode
    } catch (err: any) {
      setError(err.message || 'Hubo un problema al activar tu plan.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto p-8 text-center bg-bg/50">
        <h1 className="text-3xl font-bold text-white">Activa tu Plan</h1>
        <p className="text-lg text-text-secondary mt-2">Acceso total para conquistar tu examen.</p>
        <p className="text-5xl font-extrabold my-6 text-white">$599 <span className="text-2xl font-normal text-text-secondary">MXN/mes</span></p>
        <ul className="text-text-primary space-y-3 my-8 text-left">
          <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>Tutor IA 24/7 ilimitado.</span></li>
          <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>Prácticas, y simulacros <strong>ilimitados</strong>.</span></li>
          <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>Plan de estudio personalizado y dinámico.</span></li>
          <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>Dashboard de estadísticas completo.</span></li>
        </ul>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <PrimaryButton className="w-full flex justify-center items-center" onClick={handleActivate} disabled={loading || authLoading}>
           {loading ? <Loader2 className="animate-spin" /> : 'Activar Plan Ahora'}
        </PrimaryButton>
        <p className="text-sm text-muted mt-4">
          <NavLink to="/" className="hover:underline">Volver al inicio</NavLink>
        </p>
      </Card>
    </div>
  );
};

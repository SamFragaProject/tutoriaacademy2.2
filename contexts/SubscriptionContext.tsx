import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as subService from '../services/subscription';
import type { Subscription, SubscriptionContextType } from '../types';

export const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSubscription = useCallback(() => {
    if (user) {
      setLoading(true);
      const sub = subService.getSubscription(user.id);
      setSubscription(sub);
      setLoading(false);
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  const activateDemo = () => {
    if (user) {
      const newSub = subService.activateDemoSubscription(user.id);
      setSubscription(newSub);
    }
  };

  const value = { subscription, loading, activateDemo };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

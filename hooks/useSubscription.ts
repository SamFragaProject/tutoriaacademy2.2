import { useContext } from 'react';
import { SubscriptionContext } from '../contexts/SubscriptionContext';
import type { SubscriptionContextType } from '../types';

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

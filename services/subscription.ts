import type { Subscription, SubscriptionStatus } from '../types';
import { track } from './metrics';

const getStorageKey = (userId: string) => `sub:${userId}`;

const DEFAULTS: Subscription = { status: 'none' };

export const getSubscription = (userId: string): Subscription => {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const key = getStorageKey(userId);
    const stored = localStorage.getItem(key);
    const sub = stored ? (JSON.parse(stored) as Subscription) : DEFAULTS;

    // Check for demo expiration
    if (sub.status === 'active' && sub.expiresISO && new Date(sub.expiresISO) < new Date()) {
      console.log('Demo subscription expired');
      track('sub_demo_expired', { userId });
      const expiredSub = { status: 'none' as SubscriptionStatus };
      saveSubscription(userId, expiredSub);
      return expiredSub;
    }
    
    return sub;
  } catch {
    return DEFAULTS;
  }
};

export const saveSubscription = (userId: string, sub: Subscription): void => {
  if (typeof window === 'undefined') return;
  const key = getStorageKey(userId);
  localStorage.setItem(key, JSON.stringify(sub));
};

export const activateDemoSubscription = (userId: string): Subscription => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  
  const newSub: Subscription = {
    status: 'active',
    expiresISO: expiryDate.toISOString(),
  };
  
  saveSubscription(userId, newSub);
  track('sub_activated', { userId, type: 'demo' });
  return newSub;
};

export const clearSubscription = (userId: string): void => {
  if (typeof window === 'undefined') return;
  const key = getStorageKey(userId);
  localStorage.removeItem(key);
};

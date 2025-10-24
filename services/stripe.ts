import { getConfig } from './adminConfig';
import * as subService from './subscription';
import type { User } from '../types';

declare global {
  interface Window {
    Stripe?: (publicKey: string) => any;
  }
}

export const redirectToCheckout = async (user: User): Promise<void> => {
  const config = getConfig();
  const stripePk = config.stripe.publicKey;
  const priceId = config.stripe.priceId;

  if (!stripePk || !priceId || !window.Stripe) {
    console.log('Stripe keys not found or Stripe.js not loaded. Activating demo mode.');
    subService.activateDemoSubscription(user.id);
    return;
  }

  const stripe = window.Stripe(stripePk);

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    customerEmail: user.email,
    successUrl: `${window.location.origin}/#/app/dashboard?sub_success=true`,
    cancelUrl: `${window.location.origin}/#/paywall`,
  });

  if (error) {
    console.error('Stripe checkout error:', error);
    throw new Error(error.message || 'Failed to redirect to Stripe.');
  }
};

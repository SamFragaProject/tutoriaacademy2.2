import { track } from './metrics';
import type { FairUseState } from '../types';

const STORAGE_KEY_PREFIX = 'fairuse:';
const DAILY_LIMIT = 200;

interface DailyUsage {
  count: number;
  bannersShown: {
    'pre-cap'?: boolean;
    'capped'?: boolean;
  };
}

const getTodayKey = (): string => new Date().toISOString().split('T')[0];

const getUsage = (): DailyUsage => {
  if (typeof window === 'undefined') return { count: 0, bannersShown: {} };
  const key = `${STORAGE_KEY_PREFIX}${getTodayKey()}`;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : { count: 0, bannersShown: {} };
  } catch {
    return { count: 0, bannersShown: {} };
  }
};

const saveUsage = (usage: DailyUsage): void => {
  if (typeof window === 'undefined') return;
  const key = `${STORAGE_KEY_PREFIX}${getTodayKey()}`;
  localStorage.setItem(key, JSON.stringify(usage));
};

export const getQueryState = (): { count: number; limit: number; state: FairUseState } => {
  const { count } = getUsage();
  const limit = DAILY_LIMIT;
  let state: FairUseState = 'normal';

  if (count >= limit) {
    state = 'capped';
  } else if (count >= limit * 0.8) {
    state = 'pre-cap';
  }

  return { count, limit, state };
};

export const incrementQueryCount = (): FairUseState => {
  const usage = getUsage();
  usage.count += 1;
  saveUsage(usage);

  const { state } = getQueryState();
  track('tutor_query', { count: usage.count, state });

  if (state === 'pre-cap' && !usage.bannersShown['pre-cap']) {
    track('fair_pre_cap', { count: usage.count });
  }
  if (state === 'capped' && !usage.bannersShown['capped']) {
    track('fair_cap', { count: usage.count });
  }

  return state;
};

export const shouldShowBanner = (state: 'pre-cap' | 'capped'): boolean => {
  const usage = getUsage();
  return !usage.bannersShown[state];
};

export const markBannerAsShown = (state: 'pre-cap' | 'capped'): void => {
  const usage = getUsage();
  usage.bannersShown[state] = true;
  saveUsage(usage);
};
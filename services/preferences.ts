import type { UserPreferences, StudyBlockTiming } from '../types';

const STORAGE_KEY = 'user:preferences';

const DEFAULTS: UserPreferences = {
  tokenSavingModeForced: false,
  studyBlockTiming: '50/10',
  accommodations: {
    extraTime: false,
    highContrast: false,
  },
};

export const getPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

export const savePreferences = (prefs: Partial<UserPreferences>): void => {
  if (typeof window === 'undefined') return;
  const current = getPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  // Dispatch an event to notify other components of the change
  window.dispatchEvent(new Event('preferences-updated'));
};

// FIX: Re-export StudyBlockTiming type.
export type { StudyBlockTiming };
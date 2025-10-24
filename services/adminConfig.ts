// services/adminConfig.ts

const CONFIG_KEY = 'admin:config';

export interface AIConfig {
  provider: 'gemini' | 'openai';
  keys: {
    gemini: string;
    openai: string;
  };
  endpoints: {
    gemini?: string;
    openai?: string;
  };
  models: {
    high: string;
    medium: string;
    mini: string;
  };
  mix: {
    high: number;
    medium: number;
    mini: number;
  };
  costs: {
    high: number;
    medium: number;
    mini: number;
  };
}

export interface StripeConfig {
  publicKey: string;
  secretKey: string;
  priceId: string;
  mode: 'test';
}

export interface EmailConfig {
  provider: 'smtp';
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  fromName: string;
  fromEmail: string;
}

export interface AppConfig {
  ai: AIConfig;
  stripe: StripeConfig;
  email: EmailConfig;
}

const DEFAULT_CONFIG: AppConfig = {
  ai: {
    provider: 'gemini',
    keys: { gemini: '', openai: '' },
    endpoints: { gemini: '', openai: '' },
    models: { high: 'gemini-2.5-flash', medium: 'gemini-2.5-flash', mini: 'gemini-2.5-flash' },
    mix: { high: 15, medium: 25, mini: 60 },
    costs: { high: 0.00025, medium: 0.000125, mini: 0.00005 },
  },
  stripe: {
    publicKey: '',
    secretKey: '',
    priceId: 'price_12345',
    mode: 'test',
  },
  email: {
    provider: 'smtp',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    fromName: 'TutoriA Academy',
    fromEmail: 'noreply@tutoria.com',
  },
};

export const getConfig = (): AppConfig => {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
  } catch (e) {
    console.error("Failed to load config, returning defaults", e);
    return DEFAULT_CONFIG;
  }
};

export const saveConfig = async (config: AppConfig): Promise<{ success: boolean; error?: string }> => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    // Simulate backend POST
    await new Promise(res => setTimeout(res, 500));
    // In a real app, check response from backend
    // if (!backendResponse.ok) return { success: false, error: 'Failed to sync with backend' };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to save config' };
  }
};

export const restoreConfig = (): AppConfig => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
  return DEFAULT_CONFIG;
};

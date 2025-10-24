import type { Subject } from '../types';

type LLMProvider = 'gemini' | 'openai'; // Extendable

interface ProviderConfig {
    provider: LLMProvider;
    fallbacks: LLMProvider[];
}

export const TUTOR_PROVIDER_MAP: Record<Subject, ProviderConfig> = {
    'Matemáticas': {
        provider: 'gemini',
        fallbacks: [],
    },
    'Lengua': {
        provider: 'gemini',
        fallbacks: [],
    },
    'Biología': {
        provider: 'gemini',
        fallbacks: [],
    },
    'Física': {
        provider: 'gemini',
        fallbacks: [],
    },
    'Química': {
        provider: 'gemini',
        fallbacks: [],
    },
    'Historia': {
        provider: 'gemini',
        fallbacks: [],
    }
};

import type { Subject } from '../../types';
import { TUTOR_PROVIDER_MAP } from '../../config/tutorProviders';
import type { LLMClient } from './types';
import { GeminiClient } from './geminiClient';

// Cache instances to avoid re-creating them
const clientInstances = new Map<string, LLMClient>();

export function getLLMClientForSubject(subject: Subject): LLMClient {
    const config = TUTOR_PROVIDER_MAP[subject] || TUTOR_PROVIDER_MAP['Matemáticas'];

    if (clientInstances.has(config.provider)) {
        return clientInstances.get(config.provider)!;
    }

    let client: LLMClient;
    switch (config.provider) {
        case 'gemini':
            client = new GeminiClient();
            break;
        // case 'openai':
        //     client = new OpenAIClient();
        //     break;
        default:
            console.warn(`Unknown LLM provider "${config.provider}", defaulting to Gemini.`);
            client = new GeminiClient();
    }
    
    clientInstances.set(config.provider, client);
    return client;
}

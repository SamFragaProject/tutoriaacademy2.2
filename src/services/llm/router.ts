/**
 * Intelligent LLM Router
 * Selecciona el mejor proveedor de IA según el contexto, presupuesto y requisitos
 */

import type { 
  LLMProvider, 
  LLMProviderConfig, 
  SelectionCriteria, 
  TaskType,
  BudgetPriority,
  UserTier,
  LLMClient 
} from './types';
import { GeminiClient } from './geminiClient';

// Configuración de proveedores disponibles
const PROVIDER_CONFIGS: Record<LLMProvider, LLMProviderConfig> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    models: ['gemini-2.5-flash', 'gemini-pro'],
    costPerToken: 0.0001,
    speed: 'fast',
    contextWindow: 1000000,
    strengths: ['Matemáticas', 'Física', 'Química', 'Biología', 'general'],
    available: true,
  },
  openai: {
    id: 'openai',
    name: 'OpenAI GPT',
    models: ['gpt-4o', 'gpt-4o-mini'],
    costPerToken: 0.0005,
    speed: 'medium',
    contextWindow: 128000,
    strengths: ['reasoning', 'creative', 'coding', 'Historia', 'Lengua'],
    available: false, // Activar cuando se configure API key
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    models: ['claude-3.5-sonnet'],
    costPerToken: 0.0003,
    speed: 'medium',
    contextWindow: 200000,
    strengths: ['long-context', 'writing', 'analysis', 'Lengua', 'Historia'],
    available: false, // Activar cuando se configure API key
  },
  local: {
    id: 'local',
    name: 'Local LLM',
    models: ['llama-3.1-70b'],
    costPerToken: 0,
    speed: 'slow',
    contextWindow: 128000,
    strengths: ['privacy', 'offline'],
    available: false, // Activar cuando se configure servidor local
  },
};

// Cache de respuestas para reducir costos
const responseCache = new Map<string, { response: string; timestamp: number; hits: number }>();
const CACHE_DURATION_MS = 1000 * 60 * 60; // 1 hora

class LLMRouter {
  private clients: Map<LLMProvider, LLMClient> = new Map();
  private stats: Map<LLMProvider, { requests: number; errors: number; totalCost: number }> = new Map();

  constructor() {
    // Inicializar cliente de Gemini (el único disponible por ahora)
    this.clients.set('gemini', new GeminiClient());
    
    // Inicializar stats
    for (const provider of Object.keys(PROVIDER_CONFIGS) as LLMProvider[]) {
      this.stats.set(provider, { requests: 0, errors: 0, totalCost: 0 });
    }
  }

  /**
   * Selecciona el mejor proveedor según los criterios
   */
  selectProvider(criteria: SelectionCriteria): LLMProvider {
    // Filtrar proveedores disponibles
    const availableProviders = (Object.values(PROVIDER_CONFIGS) as LLMProviderConfig[])
      .filter(p => p.available);

    if (availableProviders.length === 0) {
      throw new Error('No hay proveedores de IA disponibles');
    }

    // Si solo hay uno disponible, usarlo
    if (availableProviders.length === 1) {
      return availableProviders[0].id;
    }

    // Scoring de proveedores
    const scores = availableProviders.map(provider => {
      let score = 0;

      // 1. Especialización por materia (peso: 40%)
      if (criteria.subject && provider.strengths.includes(criteria.subject)) {
        score += 40;
      }

      // 2. Prioridad de presupuesto (peso: 30%)
      switch (criteria.budgetPriority) {
        case 'cost':
          // Menor costo = mayor score
          score += (1 - provider.costPerToken / 0.001) * 30;
          break;
        case 'quality':
          // Mayor costo generalmente = mejor calidad
          score += (provider.costPerToken / 0.001) * 30;
          break;
        case 'speed':
          score += provider.speed === 'fast' ? 30 : provider.speed === 'medium' ? 15 : 0;
          break;
        case 'balanced':
          score += 15; // neutral
          break;
      }

      // 3. Tipo de tarea (peso: 20%)
      const taskScores: Record<TaskType, Partial<Record<LLMProvider, number>>> = {
        'explanation': { gemini: 20, openai: 18, anthropic: 19 },
        'problem-solving': { gemini: 20, openai: 19, anthropic: 17 },
        'creative': { openai: 20, anthropic: 19, gemini: 15 },
        'assessment': { openai: 19, gemini: 18, anthropic: 18 },
        'feedback': { anthropic: 20, openai: 18, gemini: 17 },
        'generation': { openai: 19, gemini: 18, anthropic: 17 },
      };
      score += taskScores[criteria.taskType]?.[provider.id] || 10;

      // 4. Contexto requerido (peso: 10%)
      if (criteria.contextLength) {
        const contextRatio = Math.min(1, criteria.contextLength / provider.contextWindow);
        score += (1 - contextRatio) * 10; // Penalizar si está cerca del límite
      }

      // 5. Tier del usuario (ajuste final)
      if (criteria.userTier === 'free' && provider.costPerToken > 0.0002) {
        score -= 10; // Penalizar opciones caras para usuarios free
      } else if (criteria.userTier === 'enterprise') {
        score += provider.id === 'openai' ? 5 : 0; // Preferir GPT para enterprise
      }

      return { provider: provider.id, score };
    });

    // Ordenar por score y devolver el mejor
    scores.sort((a, b) => b.score - a.score);
    
    console.log('LLM Selection scores:', scores);
    return scores[0].provider;
  }

  /**
   * Obtiene cliente del proveedor seleccionado con fallback automático
   */
  async getClientWithFallback(criteria: SelectionCriteria): Promise<LLMClient> {
    const preferredProvider = this.selectProvider(criteria);
    
    let client = this.clients.get(preferredProvider);
    if (client) {
      return client;
    }

    // Fallback: buscar cualquier cliente disponible
    console.warn(`Provider ${preferredProvider} no disponible, usando fallback`);
    for (const [provider, providerClient] of this.clients.entries()) {
      if (PROVIDER_CONFIGS[provider].available) {
        return providerClient;
      }
    }

    throw new Error('No hay clientes LLM disponibles');
  }

  /**
   * Genera hash para cache
   */
  private getCacheKey(prompt: string, criteria: SelectionCriteria): string {
    return `${criteria.taskType}_${criteria.subject || 'general'}_${prompt.substring(0, 100)}`;
  }

  /**
   * Ejecuta un prompt con el mejor proveedor y manejo de cache
   */
  async execute(prompt: string, criteria: SelectionCriteria): Promise<string> {
    // Verificar cache
    const cacheKey = this.getCacheKey(prompt, criteria);
    const cached = responseCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
      cached.hits++;
      console.log(`Cache hit para: ${cacheKey.substring(0, 50)}... (hits: ${cached.hits})`);
      return cached.response;
    }

    // Obtener cliente
    const provider = this.selectProvider(criteria);
    const client = await this.getClientWithFallback(criteria);
    
    // Actualizar stats
    const stats = this.stats.get(provider)!;
    stats.requests++;

    const startTime = Date.now();

    try {
      // Ejecutar (por ahora usamos generateText, puedes expandir esto)
      // const response = await client.generateText(prompt);
      
      // Placeholder: por ahora retornamos un mock
      const response = `[${provider}] Respuesta generada para: ${prompt.substring(0, 50)}...`;
      
      const latency = Date.now() - startTime;
      const estimatedTokens = prompt.length / 4; // Estimación rough
      const cost = estimatedTokens * PROVIDER_CONFIGS[provider].costPerToken;
      
      stats.totalCost += cost;

      // Guardar en cache
      responseCache.set(cacheKey, {
        response,
        timestamp: Date.now(),
        hits: 0,
      });

      console.log(`LLM Request: provider=${provider}, latency=${latency}ms, cost=$${cost.toFixed(6)}`);

      return response;
    } catch (error) {
      stats.errors++;
      console.error(`Error con provider ${provider}:`, error);
      
      // Intentar fallback
      if (this.clients.size > 1) {
        console.log('Intentando fallback a otro proveedor...');
        const fallbackProviders = Array.from(this.clients.keys()).filter(p => p !== provider);
        
        for (const fallbackProvider of fallbackProviders) {
          try {
            const fallbackClient = this.clients.get(fallbackProvider)!;
            // const response = await fallbackClient.generateText(prompt);
            const response = `[${fallbackProvider}-FALLBACK] Respuesta para: ${prompt.substring(0, 50)}...`;
            return response;
          } catch (fallbackError) {
            console.error(`Fallback ${fallbackProvider} también falló:`, fallbackError);
          }
        }
      }

      throw new Error(`Todos los proveedores fallaron para: ${prompt.substring(0, 50)}...`);
    }
  }

  /**
   * Limpia cache antiguo
   */
  cleanCache(): void {
    const now = Date.now();
    for (const [key, entry] of responseCache.entries()) {
      if (now - entry.timestamp > CACHE_DURATION_MS) {
        responseCache.delete(key);
      }
    }
  }

  /**
   * Obtiene estadísticas de uso
   */
  getStats(): Record<LLMProvider, { requests: number; errors: number; totalCost: number }> {
    return Object.fromEntries(this.stats.entries()) as any;
  }

  /**
   * Limpia estadísticas
   */
  resetStats(): void {
    for (const provider of this.stats.keys()) {
      this.stats.set(provider, { requests: 0, errors: 0, totalCost: 0 });
    }
  }
}

// Singleton instance
export const llmRouter = new LLMRouter();

// Limpiar cache cada hora
setInterval(() => {
  llmRouter.cleanCache();
}, CACHE_DURATION_MS);

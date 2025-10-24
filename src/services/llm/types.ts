// Types for the LLM abstraction layer

export type LLMProvider = 'gemini' | 'openai' | 'anthropic' | 'local';

export type TaskType = 
  | 'explanation'      // Explicar conceptos
  | 'problem-solving'  // Resolver problemas
  | 'creative'         // Escritura creativa
  | 'assessment'       // Evaluar respuestas
  | 'feedback'         // Dar retroalimentación
  | 'generation';      // Generar contenido

export type BudgetPriority = 'cost' | 'quality' | 'speed' | 'balanced';
export type UserTier = 'free' | 'premium' | 'enterprise';

export interface LLMProviderConfig {
  id: LLMProvider;
  name: string;
  models: string[];
  costPerToken: number;
  speed: 'fast' | 'medium' | 'slow';
  contextWindow: number;
  strengths: string[];
  available: boolean;
  apiKey?: string;
}

export interface SelectionCriteria {
  subject?: string;
  taskType: TaskType;
  budgetPriority: BudgetPriority;
  userTier: UserTier;
  contextLength?: number;
}

export interface LLMResponse {
  text: string;
  provider: LLMProvider;
  model: string;
  tokensUsed: number;
  cost: number;
  latency: number;
  cached: boolean;
}

export interface ChatSession {
  sendMessage(message: string): Promise<string>;
  getHistory(): Array<{ role: 'user' | 'assistant'; content: string }>;
  clear(): void;
}

export interface LLMClient {
  id: LLMProvider;
  createChatSession(sessionId: string, systemInstruction: string): ChatSession;
  generateText(prompt: string, options?: GenerateOptions): Promise<string>;
  isAvailable(): boolean;
}

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
}

export interface CacheEntry {
  response: string;
  provider: LLMProvider;
  timestamp: number;
  hits: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GenerateJsonOptions {
  systemInstruction?: string;
  history?: ChatMessage[];
  schema?: any;
}

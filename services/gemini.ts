import { getLLMClientForSubject } from '../src/services/llm';
import type { ChatSession } from '../src/services/llm/types';
import type { Subject } from '../types';

// This is now a compatibility layer. New features should use services/llm directly.

// We change the public API to use sessionId instead of the coupled `Chat` object.
const chatSessions = new Map<string, ChatSession>();

export function startChat(sessionId: string, subject: Subject): void {
    if (chatSessions.has(sessionId)) {
        return;
    }
    const llmClient = getLLMClientForSubject(subject);
    const systemInstruction = `Eres un tutor experto en ${subject}. Tu objetivo es explicar temas de forma clara, concisa y amigable para un estudiante que se prepara para su examen de admisión. Utiliza un lenguaje sencillo, analogías y ejemplos prácticos. Mantén un tono motivador y paciente. Usa Markdown para dar formato al texto, incluyendo negritas, listas y títulos.`;
    const session = llmClient.createChatSession(sessionId, systemInstruction);
    chatSessions.set(sessionId, session);
}

export async function sendMessage(sessionId: string, message: string): Promise<string> {
    const session = chatSessions.get(sessionId);
    if (!session) {
        throw new Error(`Chat session not found for ID: ${sessionId}. Call startChat first.`);
    }
    return session.sendMessage(message);
}
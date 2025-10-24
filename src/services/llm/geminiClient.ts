import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import type { LLMClient, ChatSession, GenerateJsonOptions, ChatMessage } from './types';

let ai: GoogleGenAI;

function getAi() {
    if (!ai) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey || apiKey === 'tu_api_key_aqui') {
            console.error("⚠️ GEMINI_API_KEY no está configurada. Por favor, agrega tu API key en el archivo .env");
            throw new Error("VITE_GEMINI_API_KEY no configurada. Crea un archivo .env con tu API key de Gemini.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
}

class GeminiChatSession implements ChatSession {
    private sdkChat: Chat;
    private history: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    constructor(sdkChat: Chat) {
        this.sdkChat = sdkChat;
    }

    async sendMessage(message: string): Promise<string> {
        try {
            this.history.push({ role: 'user', content: message });
            const response: GenerateContentResponse = await this.sdkChat.sendMessage({ message });
            const responseText = response.text;
            this.history.push({ role: 'assistant', content: responseText });
            return responseText;
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            const errorMsg = "Lo siento, tuve un problema para procesar tu solicitud. Por favor, inténtalo de nuevo.";
            this.history.push({ role: 'assistant', content: errorMsg });
            return errorMsg;
        }
    }

    getHistory(): Array<{ role: 'user' | 'assistant'; content: string }> {
        return [...this.history];
    }

    clear(): void {
        this.history = [];
        // Note: Gemini SDK doesn't have a clear method, so we just clear our local history
    }
}

export class GeminiClient implements LLMClient {
    public readonly id = 'gemini' as const;
    private chatInstances = new Map<string, ChatSession>();

    createChatSession(sessionId: string, systemInstruction: string): ChatSession {
        if (this.chatInstances.has(sessionId)) {
            return this.chatInstances.get(sessionId)!;
        }

        const aiInstance = getAi();
        const sdkChat = aiInstance.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        const session = new GeminiChatSession(sdkChat);
        this.chatInstances.set(sessionId, session);
        return session;
    }

    async generateText(prompt: string, options?: any): Promise<string> {
        try {
            const aiInstance = getAi();
            const response = await aiInstance.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: options,
            });
            return response.text || "";
        } catch (error) {
            console.error("Error generating text from Gemini:", error);
            throw error;
        }
    }

    isAvailable(): boolean {
        try {
            return !!process.env.API_KEY;
        } catch {
            return false;
        }
    }

    async generateJson<T extends object>(prompt: string, options: GenerateJsonOptions): Promise<T> {
        const aiInstance = getAi();

        const contents = (options.history || []).map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));
        contents.push({ role: 'user', parts: [{ text: prompt }] });

        try {
            const response = await aiInstance.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
                config: {
                    systemInstruction: options.systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: options.schema as any,
                },
            });

            const jsonString = response.text;
            if (!jsonString) {
                throw new Error("Empty response from Gemini API.");
            }
            return JSON.parse(jsonString) as T;

        } catch (error) {
            console.error("Error generating JSON from Gemini:", error);
            throw error;
        }
    }
}

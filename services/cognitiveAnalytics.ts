// services/cognitiveAnalytics.ts
import type { GameSession } from '../types';
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI;

function getAi() {
    if (!ai) {
        if (!process.env.API_KEY) {
            console.error("API_KEY is not configured.");
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });

export const getNBackProgress = (history: GameSession[]) => {
    const nBackSessions = history.filter(s => s.gameId === 'n-track' && s.metrics.maxN);
    return nBackSessions
        .map(s => ({ date: formatDate(s.timestamp), 'Nivel Máximo': s.metrics.maxN }))
        .slice(0, 10) // Get last 10 sessions
        .reverse(); 
};

export const getFocusSwitchProgress = (history: GameSession[]) => {
    const focusSwitchSessions = history.filter(s => s.gameId === 'focus-switch' && s.metrics.switchCostMs);
    return focusSwitchSessions
        .map(s => ({ date: formatDate(s.timestamp), 'Coste de Cambio (ms)': s.metrics.switchCostMs }))
        .slice(0, 10)
        .reverse();
};

export const getRSVPProgress = (history: GameSession[]) => {
    const rsvpSessions = history.filter(s => s.gameId === 'rsvp-gist' && s.metrics.wpm);
    return rsvpSessions
        .map(s => ({ 
            velocidad: s.metrics.wpm, 
            comprension: s.metrics.comprehension ? 1 : 0, // Use 1 for correct, 0 for incorrect for plotting
            timestamp: new Date(s.timestamp).getTime()
        }))
        .slice(0, 20); // Get last 20 sessions
};

export const getAIAnalysis = async (nBackData: any[], focusSwitchData: any[], rsvpData: any[]): Promise<string> => {
    try {
        const aiInstance = getAi();
        const nBackTrend = nBackData.length > 1 ? (nBackData[nBackData.length - 1]['Nivel Máximo'] > nBackData[0]['Nivel Máximo'] ? 'mejora' : 'descenso') : 'estable';
        const focusSwitchTrend = focusSwitchData.length > 1 ? (focusSwitchData[focusSwitchData.length - 1]['Coste de Cambio (ms)'] < focusSwitchData[0]['Coste de Cambio (ms)'] ? 'mejora (reducción)' : 'aumento') : 'estable';

        const prompt = `
            Eres un coach cognitivo analizando el progreso de un estudiante en juegos mentales. Sé conciso (2-3 frases), motivador y ofrece un consejo práctico.
            Datos del estudiante:
            - Progreso en N-Track (memoria de trabajo): La tendencia es de ${nBackTrend}. Último nivel alcanzado: ${nBackData[nBackData.length - 1]?.['Nivel Máximo'] || 'N/A'}.
            - Progreso en Focus Switch (flexibilidad cognitiva): La tendencia es de ${focusSwitchTrend}. Último coste de cambio: ${focusSwitchData[focusSwitchData.length - 1]?.['Coste de Cambio (ms)'] || 'N/A'} ms.
            - Datos de RSVP (velocidad lectora): Hay ${rsvpData.length} puntos de datos.

            Genera un breve análisis y un consejo.
        `;

        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating AI analysis:", error);
        return "¡Sigue así! La práctica constante en estos juegos fortalece las habilidades clave para el éxito académico. Intenta superar tu récord en la próxima sesión.";
    }
};
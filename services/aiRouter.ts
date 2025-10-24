import type { TutorId } from '../types';
import * as fairUse from './fairUse';
import * as tutorSvc from './tutors';
import { track } from './metrics';
import { getStudentProfile } from './studentProfile';

interface RouterRequest {
  prompt: string;
  history: any[];
  tutorId: TutorId;
  userId: string;
  objective: 'study' | 'practice' | 'mock_exam';
}

interface RouterResponse {
  text: string;
  citations: string[];
  error?: string;
}

// This is a MOCK response generator. In a real app, this would call a backend with the composed prompt.
const generateMockResponse = (composedPrompt: string): string => {
    if (composedPrompt.includes('capped')) {
        return "Respuesta CORTA por límite de uso: La hipotenusa se calcula con el Teorema de Pitágoras. • (Guía de Matemáticas, p. 23)";
    }
    if (composedPrompt.includes('pre-cap') || composedPrompt.includes('saving mode')) {
        return "Respuesta concisa: Usa el Teorema de Pitágoras (a² + b² = c²). Con catetos de 6 y 8, la hipotenusa es 10. • (Guía de Matemáticas, p. 23)";
    }
    return `Respuesta detallada basada en tu nivel: El Teorema de Pitágoras establece que en un triángulo rectángulo, el cuadrado de la hipotenusa (el lado opuesto al ángulo recto) es igual a la suma de los cuadrados de los otros dos lados (catetos).
    
    Fórmula: $$a^2 + b^2 = c^2$$
    
    En tu caso:
    - $$6^2 + 8^2 = c^2$$
    - $$36 + 64 = c^2$$
    - $$100 = c^2$$
    - $$c = \\sqrt{100} = 10$$
    
    La hipotenusa mide 10 cm.
    
    • (Guía de Matemáticas, p. 23)
    • (Conceptos de Geometría, p. 12)`;
};

export const getResponse = async (req: RouterRequest): Promise<RouterResponse> => {
  track('tutor_query', { tutorId: req.tutorId, objective: req.objective, userId: req.userId });

  const fairUseState = fairUse.incrementQueryCount();
  const tutorConfig = tutorSvc.getTutorConfig(req.tutorId);
  const studentProfile = getStudentProfile(req.userId);

  // 1. Select Model Mix based on Fair Use
  let modelMix = { high: 15, medium: 25, mini: 60 }; // Default from config
  let modeTag = '';
  if (fairUseState === 'capped') {
    modelMix = { high: 0, medium: 20, mini: 80 };
    modeTag = '[capped]';
  } else if (fairUseState === 'pre-cap') {
    modelMix = { high: 5, medium: 25, mini: 70 };
    modeTag = '[pre-cap]';
  }
  track('mix_change', { mix: modelMix, reason: fairUseState });


  // 2. Compose the prompt with all context
  const composedPrompt = `
---
CONTEXTO DEL SISTEMA:
Tutor ID: ${tutorConfig.id}
Tono: ${tutorConfig.tone}
Técnicas a usar (pesos): Socrático ${tutorConfig.techniques.socratic}%, Pistas ${tutorConfig.techniques.hints}%
Modelo Mix (simulado): ${JSON.stringify(modelMix)} ${modeTag}
---
CONTEXTO DEL ALUMNO (ID: ${req.userId}):
Competencias relevantes: ${JSON.stringify(studentProfile.skills)}
---
HISTORIAL DE CONVERSACIÓN:
${JSON.stringify(req.history)}
---
PREGUNTA DEL USUARIO:
${req.prompt}
`;

  console.log("--- COMPOSED PROMPT TO AI ROUTER ---");
  console.log(composedPrompt);
  console.log("------------------------------------");

  // 3. (Simulate) Call AI backend
  try {
    await new Promise(res => setTimeout(res, 800 + Math.random() * 500)); // Simulate latency
    const rawText = generateMockResponse(composedPrompt);

    const citations = rawText.split('\n').filter(line => line.trim().startsWith('•')).map(c => c.trim());
    
    return {
        text: rawText,
        citations,
    };
  } catch (error: any) {
    track('tutor_error', { error: error.message });
    return {
        text: '',
        citations: [],
        error: error.message || 'Error desconocido del router de IA.',
    };
  }
};
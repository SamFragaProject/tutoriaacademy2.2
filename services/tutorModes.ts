import { findChunks } from './documents';
import { getSyllabus } from './studyTopics';
import type { LearnState, PracticeState, ReviewState, ExitTicketState, Chunk, StudentProfile, LearnContent, MainTopic, ChatMessage, InteractiveQuestion, Flashcard } from '../types';
import type { Subject } from '../types';
import { Type } from "@google/genai";
import { track } from './metrics';
import { getLLMClientForSubject } from '../src/services/llm';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        responseText: { type: Type.STRING, description: "Your detailed, well-structured chat response in Markdown. Explain one sub-topic at a time." },
        coveredSubTopicId: { type: Type.STRING, description: "The ID of the subtopic you just explained from the syllabus. Null if you are just chatting or haven't covered a specific subtopic in this response." },
        quickActions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-4 contextual prompts for the user to click. If you just explained a topic, one of them MUST BE '¡Entendido! ¿Qué sigue?'."
        },
        isFinalSubTopic: { type: Type.BOOLEAN, description: "Set to true ONLY if you've just explained the VERY LAST subtopic from the provided syllabus." },
        reinforcementSummary: {
            type: Type.OBJECT,
            properties: {
                summaryText: { type: Type.STRING, description: "A summary of the entire session, focusing on weak points identified during the conversation." },
                suggestedTopics: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            description: "ONLY provide this object if the user has confirmed they understood the final sub-topic and asks for a summary or what's next."
        },
        interactiveQuestion: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, description: "Must be 'quick_quiz'."},
                questionText: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
            },
            description: "After every explanation of a new sub-topic, you MUST include a single, relevant multiple-choice question about it to check for understanding. This is not optional and is a required part of the learning flow."
        }
    },
    required: ["responseText", "coveredSubTopicId", "quickActions", "isFinalSubTopic"]
};


export const getStructuredTutorResponse = async (
    userInput: string,
    history: ChatMessage[],
    mainTopic: MainTopic
): Promise<any> => {
    
    // The subject can be inferred from the syllabus, assuming topic names are unique enough for demo
    const syllabus = await getSyllabus();
    const subject = (Object.keys(syllabus) as Subject[]).find(s => syllabus[s].some(mt => mt.name === mainTopic.name)) || 'Matemáticas';
    const llmClient = getLLMClientForSubject(subject);
    
    const subTopicsList = mainTopic.subTopics.map(st => `- ${st.name} (ID: ${st.id})`).join('\n');
    
    const systemInstruction = `You are an expert AI Tutor for TutoriA Academy...

**Syllabus for this session:**
Here is the main topic we are covering: ${mainTopic.name}
Sub-topics to cover in order:
${subTopicsList}

**JSON Response Instructions:**
...`; // Same long instruction as before

    try {
        const parsed = await llmClient.generateJson(userInput, {
            systemInstruction,
            history,
            schema: responseSchema,
        });
        track('tutor_gemini_response_success', { mainTopic: mainTopic.name });
        return parsed;
    } catch (apiError) {
        console.error("Error in getStructuredTutorResponse:", apiError);
        track('tutor_gemini_response_error', { error: (apiError as Error).message });
        throw apiError;
    }
};

export const getInitialTutorMessageForTopic = async (subject: Subject, mainTopicName: string, isReinforcement: boolean = false): Promise<{ content: string, quickActions: string[] }> => {
    const syllabus = await getSyllabus();
    const mainTopic = syllabus[subject]?.find((mt: MainTopic) => mt.name === mainTopicName);
    const firstSubTopic = mainTopic?.subTopics.find(st => st.status !== 'completed');

    const introText = isReinforcement 
        ? `¡Hola de nuevo! Veo que quieres reforzar el bloque de **${mainTopicName}**. ¿Qué concepto te gustaría repasar?`
        : `¡Hola! Vamos a estudiar el bloque de **${mainTopicName}**. Estoy listo para ayudarte. Puedes hacer una pregunta o hacer clic en un tema de la barra lateral para comenzar.`;

    return {
        content: introText,
        quickActions: firstSubTopic ? [`Empecemos con "${firstSubTopic.name}"`] : ["¿De qué trata este bloque?"]
    };
};

// --- NEW FUNCTION for Review Material ---
const reviewSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Un resumen conciso de 2-4 frases de los conceptos clave discutidos en la conversación, en español."
    },
    flashcards: {
      type: Type.ARRAY,
      description: "Un array de 3 a 5 flashcards (pregunta/respuesta) basadas en los puntos más importantes de la conversación.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "La pregunta para el anverso de la flashcard." },
          answer: { type: Type.STRING, description: "La respuesta para el reverso de la flashcard." }
        },
        required: ["question", "answer"]
      }
    }
  },
  required: ["summary", "flashcards"]
};


export const generateReviewMaterials = async (
    history: ChatMessage[]
): Promise<{ summary: string, flashcards: Flashcard[] }> => {
    const llmClient = getLLMClientForSubject('Matemáticas'); // Subject doesn't matter much for a generic summary
    const conversation = history
        .map(msg => `${msg.role === 'user' ? 'Estudiante' : 'Tutor'}: ${msg.content}`)
        .join('\n');
    
    try {
        const prompt = `Basado en la siguiente conversación de tutoría, genera un resumen conciso y entre 3 y 5 flashcards (pregunta/respuesta) para ayudar al estudiante a repasar. La conversación es:\n\n${conversation}`;
        // FIX: Provide a generic type argument to llmClient.generateJson to correctly type the parsed response.
        const parsed = await llmClient.generateJson<{ summary: string; flashcards: Flashcard[] }>(prompt, {
            systemInstruction: "Eres un asistente que crea material de estudio conciso a partir de transcripciones de chat.",
            schema: reviewSchema,
        });

        if (parsed.summary && parsed.flashcards) {
            track('review_material_generated_success');
            return parsed;
        } else {
            throw new Error("Invalid JSON structure received from AI.");
        }
    } catch (error) {
        console.error("Error generating review materials:", error);
        track('review_material_generated_error', { error: (error as Error).message });
        // Fallback with mock data
        return {
            summary: "Hubo un error al generar el resumen. Las ecuaciones de primer grado son clave para el álgebra. Se resuelven despejando la incógnita.",
            flashcards: [
                { question: "¿Qué es una ecuación de primer grado?", answer: "Una igualdad con una o más incógnitas elevadas a la primera potencia." },
                { question: "¿Objetivo al resolverla?", answer: "Despejar la incógnita (e.g., 'x') para encontrar su valor." }
            ]
        };
    }
};



// --- LEGACY FUNCTIONS (kept for other page references, but not used in new Tutor flow) ---

export const getInitialTutorMessage = (subTopic: string): { content: string, citations: Chunk[] } => {
    const chunks = findChunks(subTopic, 1);
    if (chunks.length === 0) {
        return {
            content: `Hola. He notado que no tengo material de estudio específico para **${subTopic}**. Puedo intentar ayudarte con mi conocimiento general, pero mis respuestas podrían no ser tan precisas como de costumbre. ¿Sobre qué te gustaría hablar?`,
            citations: [],
        };
    }
    return {
        content: `¡Hola! Estoy listo para ayudarte a aprender sobre **${subTopic}**. Puedes preguntarme lo que quieras, o usar los botones de abajo para guiar nuestra conversación. ¿Por dónde empezamos?`,
        citations: chunks,
    };
};


export const generateExitTicket = (subTopic: string): ExitTicketState => {
    return {
        items: [
            { question: `Pregunta 1 de 3 sobre ${subTopic}`, options: ['Opción A', 'Opción B (correcta)', 'Opción C'], correctIndex: 1 },
            { question: `Pregunta 2 de 3 sobre ${subTopic}`, options: ['Opción A', 'Opción B', 'Opción C (correcta)'], correctIndex: 2 },
            { question: `Pregunta 3 de 3 sobre ${subTopic}`, options: ['Opción A (correcta)', 'Opción B', 'Opción C'], correctIndex: 0 },
        ],
        answers: [null, null, null],
        currentIndex: 0,
        startTime: Date.now(),
    };
};

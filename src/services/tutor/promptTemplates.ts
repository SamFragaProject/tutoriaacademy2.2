import type { Subject } from '../../../types';

export interface TopicInfo {
    subject: Subject;
    mainTopic: string;
    subTopic: string;
}

export const getExplanationPrompt = (topic: TopicInfo): string => `
  Actúa como un tutor experto para un estudiante de preparatoria.
  Explica el siguiente subtema de forma clara y concisa, usando analogías.
  Subtema: "${topic.subTopic}" dentro del tema de "${topic.mainTopic}" en la materia de ${topic.subject}.
  Usa Markdown para el formato. Empieza con una introducción breve y luego la explicación principal. No generes preguntas todavía.
`;

export const getWorkedExamplePrompt = (topic: TopicInfo, explanation: string): string => `
  Basado en la siguiente explicación sobre "${topic.subTopic}", crea un ejemplo práctico resuelto paso a paso.
  La explicación que diste fue: "${explanation}"
  Presenta el problema, luego la solución detallada en pasos numerados. Usa Markdown y KaTeX para las fórmulas.
`;

export const getPracticeQuestionPrompt = (topic: TopicInfo): string => `
  Genera una pregunta de práctica de dificultad media sobre "${topic.subTopic}".
  La pregunta debe ser de opción múltiple con 4 opciones.
`;

export const getHintPrompt = (practiceQuestion: string): string => `
  El estudiante está atascado en esta pregunta: "${practiceQuestion}".
  Dame una pista sutil que no revele la respuesta directamente.
`;

export const getAlternativeExplanationPrompt = (topic: TopicInfo, originalExplanation: string): string => `
  El estudiante no entendió la primera explicación sobre "${topic.subTopic}".
  Aquí está la explicación original: "${originalExplanation}"
  Por favor, explica el mismo concepto de una manera diferente, quizás con una analogía distinta o desde otro enfoque.
`;
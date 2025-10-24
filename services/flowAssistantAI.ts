// services/flowAssistantAI.ts
import * as aiRouter from './aiRouter';
import * as flowService from './userFlows';
import type { UserRole } from '../types';

/**
 * Servicio de IA para el asistente de flujos
 * Usa aiRouter existente con contexto del flujo del usuario
 */

export interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AssistantContext {
  userId: string;
  role: UserRole;
  currentStageId: string;
  stageName: string;
  stageProgress: number;
  completedStages: string[];
  flowCompletionPercentage: number;
  recentActions: string[];
}

/**
 * Genera respuesta del asistente usando IA real con contexto de flujo
 */
export async function generateAssistantResponse(
  userId: string,
  userMessage: string,
  conversationHistory: AssistantMessage[],
  role: UserRole
): Promise<string> {
  try {
    // 1. Obtener contexto del flujo del usuario
    const context = getFlowContext(userId, role);
    
    // 2. Construir prompt enriquecido con contexto
    const enrichedPrompt = buildEnrichedPrompt(userMessage, context);
    
    // 3. Preparar historial para el router
    const history = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
    
    // 4. Llamar al router de IA
    const response = await aiRouter.getResponse({
      prompt: enrichedPrompt,
      history,
      tutorId: 'mate',  // Usar tutor general
      userId,
      objective: 'study',
    });
    
    return response.text;
    
  } catch (error) {
    console.error('Error generating AI response:', error);
    return getFallbackResponse(userMessage, userId, role);
  }
}

/**
 * Obtiene el contexto actual del flujo del usuario
 */
function getFlowContext(userId: string, role: UserRole): AssistantContext {
  const flowState = flowService.getUserFlow(userId);
  const currentStage = flowService.getCurrentStage(userId);
  
  if (!flowState || !currentStage) {
    return {
      userId,
      role,
      currentStageId: 'unknown',
      stageName: 'Inicio',
      stageProgress: 0,
      completedStages: [],
      flowCompletionPercentage: 0,
      recentActions: [],
    };
  }
  
  return {
    userId,
    role,
    currentStageId: currentStage.id,
    stageName: currentStage.name,
    stageProgress: flowState.stageProgress[currentStage.id] || 0,
    completedStages: flowState.completedStages,
    flowCompletionPercentage: flowState.flowCompletionPercentage,
    recentActions: getRecentActions(userId, role),
  };
}

/**
 * Construye un prompt enriquecido con contexto del flujo
 */
function buildEnrichedPrompt(userMessage: string, context: AssistantContext): string {
  const roleDescriptions = {
    alumno: 'estudiante de preparatoria',
    docente: 'profesor que usa la plataforma para gestionar sus clases',
    director: 'director de institución educativa',
    admin: 'administrador de la plataforma',
  };
  
  return `
Eres un asistente inteligente de TutoriA Academy. Estás ayudando a un ${roleDescriptions[context.role]}.

CONTEXTO DEL USUARIO:
- Rol: ${context.role}
- Etapa actual del flujo: ${context.stageName} (${context.stageProgress}% completado)
- Progreso general: ${context.flowCompletionPercentage}%
- Etapas completadas: ${context.completedStages.length}

INSTRUCCIONES:
1. Responde de forma clara, concisa y amigable
2. Relaciona tu respuesta con su etapa actual cuando sea relevante
3. Sugiere acciones concretas que puede tomar
4. Si pregunta "¿qué sigo?" o similar, dirige a la siguiente acción de su etapa actual
5. Usa emojis ocasionalmente para hacer la conversación más amena
6. Si no sabes algo específico de la plataforma, sé honesto y sugiere contactar soporte

PREGUNTA DEL USUARIO:
${userMessage}

RESPUESTA (máximo 150 palabras):`;
}

/**
 * Obtiene las acciones recientes del usuario
 */
function getRecentActions(userId: string, role: UserRole): string[] {
  // TODO: Implementar tracking real de acciones
  // Por ahora retornamos un array vacío
  return [];
}

/**
 * Genera respuesta de fallback si falla la IA
 */
function getFallbackResponse(userMessage: string, userId: string, role: UserRole): string {
  const message = userMessage.toLowerCase();
  const context = getFlowContext(userId, role);
  const currentStage = flowService.getCurrentStage(userId);
  
  // Respuestas inteligentes basadas en palabras clave
  if (message.includes('siguiente') || message.includes('ahora') || message.includes('qué hago')) {
    if (currentStage) {
      const primaryAction = currentStage.actions.find(a => a.isPrimary);
      return `🎯 Estás en la etapa: **${currentStage.name}** (${context.stageProgress}% completado).\n\n` +
             `Tu siguiente paso es: **${primaryAction?.label || 'Continuar con las actividades'}**\n\n` +
             `Objetivo: ${currentStage.objective}`;
    }
    return '¡Continúa explorando la plataforma! Puedes usar el menú lateral para navegar.';
  }
  
  if (message.includes('progreso') || message.includes('avance')) {
    return `📊 Tu progreso general es **${context.flowCompletionPercentage}%**\n\n` +
           `Has completado ${context.completedStages.length} etapas.\n` +
           `Etapa actual: **${context.stageName}** (${context.stageProgress}%)`;
  }
  
  if (message.includes('ayuda') || message.includes('help')) {
    return `🤝 Estoy aquí para ayudarte con:\n\n` +
           `• Guiarte en tu flujo de trabajo\n` +
           `• Explicar funcionalidades de la plataforma\n` +
           `• Sugerirte qué hacer a continuación\n` +
           `• Resolver dudas generales\n\n` +
           `¿En qué puedo ayudarte específicamente?`;
  }
  
  if (message.includes('gracias') || message.includes('thanks')) {
    return `¡De nada! 😊 Estoy aquí cuando me necesites. ¡Sigue así!`;
  }
  
  // Respuestas específicas por rol
  if (role === 'alumno') {
    if (message.includes('estudiar') || message.includes('materia')) {
      return `📚 Para estudiar, ve a la sección **Mis Materias** en el menú lateral.\n\n` +
             `Ahí encontrarás todo tu contenido organizado por temas.`;
    }
    
    if (message.includes('examen') || message.includes('simulacro')) {
      return `📝 Puedes practicar con **Simulacros** en el menú lateral.\n\n` +
             `Son exámenes de práctica que te preparan para el examen real.`;
    }
  }
  
  if (role === 'docente') {
    if (message.includes('calificar') || message.includes('tareas')) {
      return `📝 Para calificar, ve a la sección **Calificaciones** en el menú.\n\n` +
             `Ahí puedes revisar y calificar todas las tareas pendientes.`;
    }
    
    if (message.includes('examen') || message.includes('crear')) {
      return `✨ Usa el **Creador de Exámenes con IA** para generar exámenes automáticamente.\n\n` +
             `La IA te ayuda a crear preguntas de calidad en minutos.`;
    }
    
    if (message.includes('grupo') || message.includes('alumnos')) {
      return `👥 Ve a **Mis Grupos** para gestionar tus estudiantes.\n\n` +
             `Ahí puedes ver su progreso, asignar tareas y comunicarte con ellos.`;
    }
  }
  
  if (role === 'director') {
    if (message.includes('profesores') || message.includes('docentes')) {
      return `👨‍🏫 En la sección **Docentes** puedes gestionar tu equipo de profesores.\n\n` +
             `Invita nuevos docentes, revisa su actividad y métricas.`;
    }
    
    if (message.includes('métricas') || message.includes('estadísticas')) {
      return `📊 El **Dashboard** te muestra todas las métricas institucionales.\n\n` +
             `Ahí ves el rendimiento general de tu escuela.`;
    }
  }
  
  // Respuesta genérica
  return `Entiendo tu pregunta. Te recomiendo:\n\n` +
         `1. Usar el menú lateral para explorar las secciones\n` +
         `2. Ver tu progreso en la línea de tiempo de abajo\n` +
         `3. Seguir las notificaciones que aparecen arriba\n\n` +
         `¿Necesitas algo más específico?`;
}

/**
 * Genera sugerencias contextuales basadas en el flujo
 */
export function getContextualSuggestions(userId: string, role: UserRole): string[] {
  const currentStage = flowService.getCurrentStage(userId);
  const flowState = flowService.getUserFlow(userId);
  
  if (!currentStage || !flowState) {
    return [
      '¿Qué puedo hacer aquí?',
      'Muéstrame mi progreso',
      'Ayuda para comenzar',
    ];
  }
  
  const suggestions: string[] = [];
  
  // Sugerencia sobre siguiente paso
  const primaryAction = currentStage.actions.find(a => a.isPrimary);
  if (primaryAction) {
    suggestions.push(`¿Cómo hago: ${primaryAction.label}?`);
  }
  
  // Sugerencia sobre progreso
  const progress = flowState.stageProgress[currentStage.id] || 0;
  if (progress > 0 && progress < 100) {
    suggestions.push(`¿Cuánto me falta para completar esta etapa?`);
  }
  
  // Sugerencias específicas por rol
  if (role === 'alumno') {
    suggestions.push('¿Qué materias debo estudiar?');
    if (currentStage.id === 'student-diagnosis') {
      suggestions.push('¿Para qué sirve el diagnóstico?');
    }
    if (currentStage.id === 'student-learning') {
      suggestions.push('¿Cómo mejoro en matemáticas?');
    }
  }
  
  if (role === 'docente') {
    suggestions.push('¿Cómo creo un examen con IA?');
    if (currentStage.id === 'teacher-teaching') {
      suggestions.push('¿Cómo califico más rápido?');
    }
    if (currentStage.id === 'teacher-evaluation') {
      suggestions.push('¿Cómo interpreto las métricas?');
    }
  }
  
  if (role === 'director') {
    suggestions.push('¿Cómo invito profesores?');
    suggestions.push('¿Qué métricas debo revisar?');
  }
  
  // Siempre incluir opción de siguiente paso
  suggestions.push('¿Qué hago ahora?');
  
  // Retornar máximo 4 sugerencias
  return suggestions.slice(0, 4);
}

/**
 * Guarda el historial de conversación
 */
export function saveConversationHistory(userId: string, messages: AssistantMessage[]): void {
  try {
    localStorage.setItem(
      `assistant_history_${userId}`,
      JSON.stringify(messages.slice(-20)) // Solo últimos 20 mensajes
    );
  } catch (error) {
    console.error('Error saving conversation history:', error);
  }
}

/**
 * Carga el historial de conversación
 */
export function loadConversationHistory(userId: string): AssistantMessage[] {
  try {
    const stored = localStorage.getItem(`assistant_history_${userId}`);
    if (!stored) return [];
    
    const messages = JSON.parse(stored);
    // Convertir strings de fecha de vuelta a Date objects
    return messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  } catch (error) {
    console.error('Error loading conversation history:', error);
    return [];
  }
}

/**
 * Limpia el historial de conversación
 */
export function clearConversationHistory(userId: string): void {
  try {
    localStorage.removeItem(`assistant_history_${userId}`);
  } catch (error) {
    console.error('Error clearing conversation history:', error);
  }
}

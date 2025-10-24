import * as studentProfileSvc from './studentProfile';
import * as diagSvc from './diagnostic';
import type { Subject, Nudge } from '../types';

export const generateNudges = (userId: string): Nudge[] => {
  const profile = studentProfileSvc.getStudentProfile(userId);
  const lastDiag = diagSvc.lastLocal();
  const nudges: Nudge[] = [];

  // Nudge 1: Target weakest topic from diagnosis
  if (lastDiag?.weakTopics?.length > 0) {
    const weakTopic = lastDiag.weakTopics[0];
    const subject: Subject = lastDiag.area === 'Matemáticas' ? 'Matemáticas' : 'Lengua';
    nudges.push({
      id: 'nudge-weak-topic',
      icon: 'trending_up',
      title: 'Refuerza tu punto débil',
      description: `Notamos que "${weakTopic}" fue un área de oportunidad en tu diagnóstico. ¿Quieres una sesión de práctica enfocada?`,
      cta: 'Practicar Ahora',
      action: {
        path: '/app/tutor',
        state: { nextEvent: { subject, subTopic: weakTopic, type: 'practice' } }
      }
    });
  }

  // Nudge 2: Suggest a cognitive game
  nudges.push({
      id: 'nudge-cognitive-game',
      icon: 'brain',
      title: 'Entrena tu Mente',
      description: 'Los minijuegos cognitivos como N-Track pueden mejorar tu memoria de trabajo, una habilidad clave para el examen.',
      cta: 'Ir a Minijuegos',
      action: { path: '/app/juegos' }
  });

  // Nudge 3: Challenge in a strong area
  const strongSkills = Object.entries(profile.skills)
    .filter(([, skill]) => (skill.accuracy ?? 0) > 85)
    .sort(([, a], [, b]) => (b.accuracy ?? 0) - (a.accuracy ?? 0));

  if (strongSkills.length > 0) {
    const [key] = strongSkills[0];
    const [subjectStr, subTopic] = key.split('_');
    const subject: Subject = subjectStr === 'matemáticas' ? 'Matemáticas' : 'Lengua';
    
    nudges.push({
      id: 'nudge-strong-topic',
      icon: 'zap',
      title: '¿Listo para un Reto?',
      description: `Tienes un dominio excelente en "${subTopic.replace(/_/g, ' ')}". ¿Te atreves con una práctica de mayor dificultad?`,
      cta: 'Aceptar Reto',
      action: {
        path: '/app/tutor',
        state: { nextEvent: { subject, subTopic: subTopic.replace(/_/g, ' '), type: 'practice' } }
      }
    });
  }

  return nudges.slice(0, 2); // Return the 2 most relevant nudges
};
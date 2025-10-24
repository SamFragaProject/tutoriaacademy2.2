// services/adminEmail.ts
import { getConfig } from './adminConfig';
import * as gamSvc from './gamification';

const TEMPLATES_KEY = 'emails:templates';
const SENT_LOG_KEY = 'emails:sent';

export type TemplateId = 'welcome' | 'reset' | 'weekly';

export interface EmailTemplate {
  id: TemplateId;
  name: string;
  subject: string;
  preheader: string;
  body: string;
}

export interface EmailLog {
  templateId: TemplateId;
  recipient: string;
  status: 'ok' | 'error';
  error?: string;
  timestamp: string;
}

const DEFAULT_TEMPLATES: Record<TemplateId, EmailTemplate> = {
  welcome: {
    id: 'welcome',
    name: 'Bienvenida',
    subject: '¡Bienvenido a TutoriA Academy, {{nombre}}!',
    preheader: 'Tu viaje para conquistar tu examen comienza ahora.',
    body: `
      <div style="font-family: sans-serif; padding: 20px; background-color: #0E1430; color: #E9ECFF; border-radius: 16px; border: 1px solid #222d62;">
        <h2 style="color: #6EA8FF;">¡Bienvenido a TutoriA Academy!</h2>
        <p>Hola <strong>{{nombre}}</strong>,</p>
        <p>Estamos emocionados de tenerte a bordo. Tu primer paso es realizar el diagnóstico inicial para que podamos crear tu plan de estudio personalizado.</p>
        <a href="#" style="display: inline-block; padding: 12px 24px; background-color: #6EA8FF; color: #0B0F1A; text-decoration: none; border-radius: 99px; font-weight: bold; margin-top: 10px;">
          Comenzar Diagnóstico
        </a>
        <p style="margin-top: 20px;">¡Mucho éxito!<br/>El equipo de TutoriA</p>
      </div>
    `,
  },
  reset: {
    id: 'reset',
    name: 'Reset de Contraseña',
    subject: 'Tu solicitud para restablecer la contraseña',
    preheader: 'Usa el siguiente enlace para crear una nueva contraseña.',
    body: `
       <div style="font-family: sans-serif; padding: 20px; background-color: #0E1430; color: #E9ECFF; border-radius: 16px; border: 1px solid #222d62;">
        <h2 style="color: #6EA8FF;">Restablecer Contraseña</h2>
        <p>Hola <strong>{{nombre}}</strong>,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, puedes ignorar este correo.</p>
        <a href="#" style="display: inline-block; padding: 12px 24px; background-color: #6EA8FF; color: #0B0F1A; text-decoration: none; border-radius: 99px; font-weight: bold; margin-top: 10px;">
          Crear nueva contraseña
        </a>
        <p style="margin-top: 20px;">El enlace expirará en 1 hora.</p>
      </div>
    `,
  },
  weekly: {
    id: 'weekly',
    name: 'Reporte Semanal',
    subject: 'Tu reporte de progreso semanal, {{nombre}}',
    preheader: 'Mira cuánto avanzaste y qué sigue en tu plan.',
    body: `
       <div style="font-family: sans-serif; padding: 20px; background-color: #0E1430; color: #E9ECFF; border-radius: 16px; border: 1px solid #222d62;">
        <h2 style="color: #6EA8FF;">Tu Resumen Semanal</h2>
        <p>Hola <strong>{{nombre}}</strong>, ¡sigue así! Este es tu progreso de la última semana:</p>
        <div style="padding: 15px; background-color: #121b3f; border-radius: 12px; margin-top: 15px;">
          <p><strong>🔥 Racha Actual:</strong> {{racha}} días</p>
          <p><strong>⭐ XP Ganados:</strong> {{xp}} XP</p>
          <p><strong>🎯 Precisión en Simulacro:</strong> {{score}}% (en {{area}})</p>
        </div>
        <h3 style="color: #9b6bff; margin-top: 20px;">Temas a reforzar:</h3>
        <ul>{{temasDebiles}}</ul>
        <a href="#" style="display: inline-block; padding: 12px 24px; background-color: #6EA8FF; color: #0B0F1A; text-decoration: none; border-radius: 99px; font-weight: bold; margin-top: 10px;">
          Continuar estudiando
        </a>
      </div>
    `,
  },
};

export const getTemplates = (): Record<TemplateId, EmailTemplate> => {
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_TEMPLATES;
  } catch {
    return DEFAULT_TEMPLATES;
  }
};

export const saveTemplates = (templates: Record<TemplateId, EmailTemplate>) => {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
};

export const restoreDefaultTemplates = () => {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(DEFAULT_TEMPLATES));
  return DEFAULT_TEMPLATES;
};

const getLocalItem = (key: string) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch { return null; }
}

const generateWeeklyReportData = async () => {
    const diagnostic = getLocalItem('diagnostic:last') || { score: 75, area: 'Matemáticas', weakTopics: ['Cálculo', 'Geometría'] };
    const gamState = await gamSvc.getSummary();
    
    return {
        nombre: 'Estudiante Demo',
        racha: gamState.streak,
        xp: gamState.xp,
        score: diagnostic.score,
        area: diagnostic.area,
        temasDebiles: diagnostic.weakTopics,
    };
}

export const getMockDataForTemplate = async (templateId: TemplateId) => {
  if (templateId === 'weekly') {
    return generateWeeklyReportData();
  }
  return {
    nombre: 'Estudiante Demo',
    racha: 'N/A',
    xp: 'N/A',
    score: 'N/A',
    area: 'N/A',
    temasDebiles: [],
  };
};

export const compileTemplate = (template: EmailTemplate, data: Record<string, any>): string => {
    let body = template.body;
    let subject = template.subject;

    for (const key in data) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        if (key === 'temasDebiles' && Array.isArray(data[key])) {
            const listItems = data[key].map((item: string) => `<li style="color: #B8C0E3;">${item}</li>`).join('');
            body = body.replace('{{temasDebiles}}', listItems || '<li>¡Ninguno! Sigue así.</li>');
        } else {
            const value = data[key] !== null && data[key] !== undefined ? data[key] : '';
            body = body.replace(regex, value);
            subject = subject.replace(regex, value);
        }
    }
    return body;
};

export const sendTestEmail = async (compiledTemplate: { subject: string; body: string }, recipient: string): Promise<{ success: boolean; error?: string }> => {
  const config = getConfig();
  if (!config.email.smtpHost || !config.email.smtpUser) {
    return { success: false, error: 'Configuración SMTP incompleta en "APIs y Claves".' };
  }
  
  // MOCK SENDING
  console.log(`--- SIMULANDO ENVÍO DE EMAIL ---
  Host: ${config.email.smtpHost}:${config.email.smtpPort}
  User: ${config.email.smtpUser}
  To: ${recipient}
  Subject: ${compiledTemplate.subject}
  ---------------------------------`);
  await new Promise(res => setTimeout(res, 1000));
  
  // Simulate a potential error
  if (recipient.includes('error')) {
      return { success: false, error: 'Dirección de correo de prueba inválida.' };
  }
  
  return { success: true };
};

export const logSentEmail = (log: Omit<EmailLog, 'timestamp'>) => {
    const newLog: EmailLog = { ...log, timestamp: new Date().toISOString() };
    const logs = getSentEmailLogs();
    logs.unshift(newLog); // Add to the beginning
    localStorage.setItem(SENT_LOG_KEY, JSON.stringify(logs.slice(0, 100))); // Keep last 100
};

export const getSentEmailLogs = (): EmailLog[] => {
    try {
        const stored = localStorage.getItem(SENT_LOG_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

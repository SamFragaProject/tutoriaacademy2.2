# 🎯 FASE 4: AUTO-COMPLETADO DE ETAPAS - GUÍA DE INTEGRACIÓN

> **Sistema de tracking automático que detecta cuando los usuarios completan objetivos y avanza sus etapas sin intervención manual**

---

## 📚 Archivos Creados

### 1. `services/flowAutoCompletion.ts` (400+ líneas)
Sistema principal de auto-completado que:
- Detecta eventos de completado
- Verifica criterios de cada etapa
- Calcula progreso parcial
- Dispara eventos personalizados
- Actualiza automáticamente el flowState

### 2. `hooks/useFlowTracking.ts` (80+ líneas)
Hooks de React para facilitar integración:
- `useFlowTracking()` - Hook principal para tracking
- `usePageVisit()` - Auto-track al visitar una página
- `useStageCompletionListener()` - Escucha eventos de completado

---

## 🔧 Cómo Integrar en Páginas

### Opción 1: Tracking Manual (Recomendado)

```typescript
import { useFlowTracking } from '../hooks/useFlowTracking';

export const DiagnosisPage: React.FC = () => {
  const { trackActivity } = useFlowTracking();
  
  const handleDiagnosisComplete = (subject: string) => {
    // Tu lógica existente...
    
    // Agregar tracking
    trackActivity('diagnosis_completed', { subject });
  };
  
  return (
    // Tu componente...
  );
};
```

### Opción 2: Auto-tracking en Mount

```typescript
import { usePageVisit } from '../hooks/useFlowTracking';

export const ConfigurationPage: React.FC = () => {
  // Auto-trackea la visita a la página
  usePageVisit('profile_visited');
  
  const handleSaveProfile = () => {
    // Cuando guarda...
    trackActivity('profile_completed');
  };
  
  return (
    // Tu componente...
  );
};
```

### Opción 3: Escuchar Completados

```typescript
import { useStageCompletionListener } from '../hooks/useFlowTracking';
import { useToast } from '../components/Toast';

export const MyComponent: React.FC = () => {
  const { addToast } = useToast();
  
  // Escucha cuando se completa una etapa
  useStageCompletionListener((detail) => {
    addToast(
      <div>
        🎉 ¡Completaste: {detail.stageName}!
      </div>
    );
  });
  
  return (
    // Tu componente...
  );
};
```

---

## 📋 Eventos por Etapa

### 👨‍🎓 ESTUDIANTE

#### Etapa: Onboarding
```typescript
// Cuando completa perfil
trackActivity('profile_completed');

// Cuando termina el tour
trackActivity('tour_completed');

// AUTO-COMPLETA: Cuando ambos están completos
```

#### Etapa: Diagnóstico
```typescript
// Cuando termina diagnóstico de una materia
trackActivity('diagnosis_completed', { subject: 'matematicas' });

// AUTO-COMPLETA: Cuando completa 2+ diagnósticos
```

#### Etapa: Aprendizaje
```typescript
// Cuando completa un tema
trackActivity('topic_completed');

// Cuando termina sesión de estudio
trackActivity('study_session_completed');

// AUTO-COMPLETA: 10+ temas o 20+ sesiones
```

#### Etapa: Evaluación
```typescript
// Cuando termina simulacro
trackActivity('simulacro_completed');

// Cuando termina práctica
trackActivity('practice_completed');

// AUTO-COMPLETA: 5+ simulacros o 15+ prácticas
```

#### Etapa: Mantenimiento
```typescript
// Actualizar racha diaria
trackActivity('daily_streak_updated', { streak: 15 });

// AUTO-COMPLETA: Racha de 30+ días
```

---

### 👨‍🏫 PROFESOR

#### Etapa: Configuración
```typescript
// Perfil completado
trackActivity('profile_completed');

// Grupo creado
trackActivity('group_created');

// AUTO-COMPLETA: Perfil + 1 grupo
```

#### Etapa: Preparación de Contenido
```typescript
// Banco de preguntas creado
trackActivity('question_bank_created');

// Examen creado
trackActivity('exam_created');

// AUTO-COMPLETA: 1 banco + 2 exámenes
```

#### Etapa: Docencia
```typescript
// Tarea asignada
trackActivity('task_assigned');

// AUTO-COMPLETA: 10+ tareas asignadas
```

#### Etapa: Evaluación
```typescript
// Tarea calificada
trackActivity('grading_completed');

// AUTO-COMPLETA: 20+ tareas calificadas
```

#### Etapa: Optimización
```typescript
// Analytics revisado
trackActivity('analytics_reviewed');

// AUTO-COMPLETA: 5+ revisiones
```

---

### 🏫 DIRECTOR

#### Etapa: Configuración
```typescript
// Escuela configurada
trackActivity('school_configured');

// Profesor invitado
trackActivity('teacher_invited');

// AUTO-COMPLETA: Escuela + 3 profesores
```

#### Etapa: Monitoreo
```typescript
// Dashboard revisado
trackActivity('dashboard_reviewed');

// AUTO-COMPLETA: 10+ revisiones
```

#### Etapa: Intervención
```typescript
// Intervención creada
trackActivity('intervention_created');

// AUTO-COMPLETA: 3+ intervenciones
```

---

## 💡 Ejemplos de Integración Real

### Ejemplo 1: Página de Diagnóstico

```typescript
// pages/StudentPages.tsx
export const DiagnosticFullPage: React.FC = () => {
  const { user } = useAuth();
  const { trackActivity } = useFlowTracking();
  const navigate = useNavigate();
  const [finished, setFinished] = useState(false);

  const handleFinishDiagnostic = async (subject: string, results: any) => {
    // 1. Guardar resultados (tu lógica existente)
    await saveDiagnosticResults(user.id, subject, results);
    
    // 2. Trackear completado
    trackActivity('diagnosis_completed', { 
      subject,
      score: results.score,
      correctAnswers: results.correct,
      totalQuestions: results.total
    });
    
    // 3. Navegar a resultados
    navigate('/app/diagnostico/resultados');
    setFinished(true);
  };

  return (
    <div>
      {/* Tu componente de diagnóstico */}
    </div>
  );
};
```

### Ejemplo 2: Página de Configuración

```typescript
// pages/StudentPages.tsx
export const ConfigurationPage: React.FC = () => {
  const { user } = useAuth();
  const { trackActivity } = useFlowTracking();
  const [profileData, setProfileData] = useState({});

  const handleSaveProfile = async () => {
    // 1. Guardar perfil
    await saveProfile(user.id, profileData);
    
    // 2. Verificar si está 100% completo
    const isComplete = checkProfileCompletion(profileData);
    
    if (isComplete) {
      // 3. Trackear completado
      trackActivity('profile_completed');
    }
  };

  return (
    <div>
      {/* Formulario de perfil */}
      <button onClick={handleSaveProfile}>Guardar</button>
    </div>
  );
};
```

### Ejemplo 3: Calificaciones (Profesor)

```typescript
// components/teacher/GradingInterface.tsx
export const GradingInterface: React.FC = () => {
  const { user } = useAuth();
  const { trackActivity } = useFlowTracking();

  const handleSubmitGrade = async (taskId: string, grade: number) => {
    // 1. Guardar calificación
    await submitGrade(taskId, grade);
    
    // 2. Trackear
    trackActivity('grading_completed', { taskId, grade });
  };

  return (
    // Tu interfaz de calificación...
  );
};
```

### Ejemplo 4: Crear Examen con IA (Profesor)

```typescript
// pages/TeacherPages.tsx
export const AIExamCreatorPage: React.FC = () => {
  const { trackActivity } = useFlowTracking();

  const handlePublishExam = async (examData: any) => {
    // 1. Publicar examen
    await publishExam(examData);
    
    // 2. Trackear creación
    trackActivity('exam_created', {
      examTitle: examData.title,
      questionCount: examData.questions.length,
      targetGroup: examData.groupId
    });
  };

  return (
    // Creador de exámenes...
  );
};
```

---

## 🔔 Notificaciones Automáticas de Completado

El sistema dispara un evento personalizado cuando se completa una etapa:

```typescript
// En cualquier componente (ej: Layout.tsx o Dashboard)
import { useStageCompletionListener } from '../hooks/useFlowTracking';
import { useToast } from '../components/Toast';

export const Layout: React.FC = () => {
  const { addToast } = useToast();
  
  useStageCompletionListener((detail) => {
    // Mostrar toast de celebración
    addToast(
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-3"
      >
        <span className="text-3xl">🎉</span>
        <div>
          <p className="font-bold">¡Etapa Completada!</p>
          <p className="text-sm">{detail.stageName}</p>
        </div>
      </motion.div>
    );
    
    // Opcional: Reproducir sonido
    playSuccessSound();
    
    // Opcional: Confeti
    launchConfetti();
  });

  return (
    // Tu layout...
  );
};
```

---

## 🧪 Testing y Debugging

### Ver métricas de una etapa

```javascript
// En consola del navegador
import * as flowAutoCompletion from './services/flowAutoCompletion';

// Ver métricas de usuario
const metrics = flowAutoCompletion.getStageMetrics('user-123', 'student-diagnosis');
console.log(metrics);
```

### Resetear progreso

```javascript
// Resetear una etapa para testing
flowAutoCompletion.resetStageProgress('user-123', 'student-diagnosis');
```

### Simular evento

```javascript
// Simular completado de diagnóstico
flowAutoCompletion.trackCompletionEvent({
  userId: 'user-123',
  stageId: 'student-diagnosis',
  eventType: 'diagnosis_completed',
  metadata: { subject: 'matematicas' }
});
```

---

## ⚙️ Personalización

### Cambiar criterios de completado

Edita `services/flowAutoCompletion.ts` función `checkCompletionCriteria`:

```typescript
// Ejemplo: Cambiar de 2 a 3 diagnósticos requeridos
if (stageId === 'student-diagnosis') {
  if (eventType === 'diagnosis_completed') {
    // ...
    return completed.length >= 3; // Cambia de 2 a 3
  }
}
```

### Cambiar progreso parcial

Edita `services/flowAutoCompletion.ts` función `calculatePartialProgress`:

```typescript
// Ejemplo: 25% por diagnóstico en vez de 50%
if (stageId === 'student-diagnosis' && eventType === 'diagnosis_completed') {
  const completed = JSON.parse(localStorage.getItem(`diagnosis_completed_${userId}`) || '[]');
  return Math.min(100, completed.length * 25); // Cambia de 50 a 25
}
```

---

## 📊 Eventos Disponibles por Tipo

### Estudiante
- `profile_completed` - Perfil completado
- `tour_completed` - Tour finalizado
- `diagnosis_completed` - Diagnóstico terminado
- `topic_completed` - Tema completado
- `study_session_completed` - Sesión de estudio
- `simulacro_completed` - Simulacro terminado
- `practice_completed` - Práctica terminada
- `daily_streak_updated` - Racha actualizada

### Profesor
- `profile_completed` - Perfil completado
- `group_created` - Grupo creado
- `question_bank_created` - Banco creado
- `exam_created` - Examen creado
- `task_assigned` - Tarea asignada
- `grading_completed` - Calificación completada
- `analytics_reviewed` - Analytics revisado

### Director
- `school_configured` - Escuela configurada
- `teacher_invited` - Profesor invitado
- `dashboard_reviewed` - Dashboard revisado
- `intervention_created` - Intervención creada

---

## 🎯 Mejores Prácticas

### 1. Trackear en el momento correcto
```typescript
// ✅ BIEN: Después de guardar exitosamente
await saveData();
trackActivity('data_saved');

// ❌ MAL: Antes de guardar
trackActivity('data_saved');
await saveData(); // Puede fallar
```

### 2. Incluir metadata útil
```typescript
// ✅ BIEN: Con contexto
trackActivity('exam_completed', {
  examId: '123',
  score: 85,
  duration: 3600, // segundos
  questionCount: 20
});

// ❌ MAL: Sin contexto
trackActivity('exam_completed');
```

### 3. No trackear múltiples veces
```typescript
// ✅ BIEN: Solo una vez al completar
if (!alreadyTracked) {
  trackActivity('achievement_unlocked');
  setAlreadyTracked(true);
}

// ❌ MAL: En cada render
useEffect(() => {
  trackActivity('page_viewed'); // Se dispara muchas veces
});
```

---

## 🚀 Roadmap de Implementación

### Prioridad Alta (Implementar primero)
1. ✅ Onboarding de estudiante
2. ✅ Diagnóstico de estudiante
3. ✅ Configuración de profesor
4. ✅ Creación de exámenes

### Prioridad Media
5. ⏸️ Aprendizaje de estudiante (temas)
6. ⏸️ Calificaciones de profesor
7. ⏸️ Configuración de director

### Prioridad Baja
8. ⏸️ Mantenimiento (rachas)
9. ⏸️ Optimización de profesor
10. ⏸️ Intervenciones de director

---

## ✅ Checklist de Integración

Por cada página/componente:

- [ ] Importar `useFlowTracking` hook
- [ ] Identificar eventos clave (submit, save, complete)
- [ ] Agregar `trackActivity()` después de eventos exitosos
- [ ] Incluir metadata relevante
- [ ] Testear que el progreso se actualice
- [ ] Verificar que la etapa se complete cuando corresponda
- [ ] Agregar listener de completado si necesitas UI reactiva

---

## 🎉 Resultado Final

Con esta integración completa, el sistema:

✅ **Detecta automáticamente** cuando usuario logra objetivos  
✅ **Actualiza progreso** en tiempo real  
✅ **Completa etapas** sin intervención manual  
✅ **Dispara eventos** para notificaciones  
✅ **Guarda historial** en localStorage  
✅ **Funciona offline** (datos en cliente)  

**El flujo de usuario ahora es 100% automático y contextual.**

---

**Autor:** GitHub Copilot  
**Fecha:** Octubre 6, 2025  
**Versión:** 1.0  
**Estado:** ✅ Listo para Integración

# Estado de Implementación — Rol Profesor vs. Manual

**Proyecto**: TutoriA Academy B2B  
**Última actualización**: 2025-10-24  
**Referencia**: [Manual del Usuario — Rol Profesor](./MANUAL_PROFESOR.md)

Este documento mapea cada función descrita en el manual contra el código actual para identificar qué está completo, parcial o falta.

---

## Leyenda

- ✅ **COMPLETO**: Implementado y funcional
- 🟡 **PARCIAL**: Implementado pero con gaps (UI, lógica backend, RLS)
- ❌ **FALTANTE**: No implementado
- 🔵 **MOCK**: Implementado con datos demo (sin conexión real a Supabase)

---

## 1) Propósito del rol Profesor
**Estado**: 🟡 PARCIAL

| Característica | Estado | Notas |
|---|---|---|
| Crear/gestionar cursos y grupos | 🟡 | UI existe (GroupsPage, TeacherDashboard); datos MOCK |
| Diseñar exámenes | ✅ | EnhancedExamCreator (5 pasos), ItemEditor, ExamBlueprintEditor |
| Gimnasios cognitivos | 🔵 | cognitiveGym.ts con lógica adaptativa; sin integración Supabase |
| Monitoreo progreso/dominio | 🟡 | Heatmap, TeacherResultsPage; datos MOCK |
| Comunicación | ✅ | CommunicationHub (mensajes, anuncios, plantillas) |
| Integridad evaluaciones | ❌ | Sin proctoring ni bitácora |

---

## 2) Acceso e Identidad (Auth & Seguridad)
**Estado**: ✅ COMPLETO (básico)

| Característica | Estado | Notas |
|---|---|---|
| Inicio sesión email+password | ✅ | AuthContext + Supabase Auth |
| SSO | ❌ | No configurado |
| Filtros por rol | ✅ | ProtectedRoute; userRole en AuthContext |
| Cierre sesión seguro | ✅ | signOut limpia user/session/userData |
| Rotación tokens | ✅ | Automático con Supabase |
| 2FA | ❌ | No implementado |
| Bitácora de actividad | ❌ | Sin tabla ni servicio |

---

## 3) Perfil del Profesor
**Estado**: 🟡 PARCIAL

| Característica | Estado | Notas |
|---|---|---|
| Editar foto/bio/notificaciones | ❌ | Sin página/componente de perfil |
| Idioma preferido | ❌ | No configurable |
| Disponibilidad (horarios) | ❌ | No implementado |
| Previsualización KaTeX | ✅ | MathMarkdown componente |
| IA/Asistencias | ✅ | TeacherAIAssistant, tutorCopilot.ts |

---

## 4) Estructura Académica: Cursos, Grupos y Unidades
**Estado**: 🟡 PARCIAL

| Característica | Estado | Notas |
|---|---|---|
| Crear curso con unidades | 🔵 | GroupsPage muestra lista; sin editor de curso |
| Asignar grupos | 🔵 | MOCK_TEACHER_GROUPS en constants.ts |
| Listas de alumnos | 🔵 | MOCK |
| Calendario del grupo | ❌ | No implementado |
| Adjuntar recursos | ❌ | Sin biblioteca de archivos integrada |

**Schema Supabase**:
- ✅ Tabla `grupos` existe (supabase_schema.sql:44)
- ✅ Tabla `grupos_alumnos` existe (relación n:m)
- ❌ Sin tabla `cursos` (el schema usa grupos directamente)

---

## 5) Banco de Contenidos y Reactivos
**Estado**: ✅ COMPLETO (funcional con localStorage)

| Característica | Estado | Notas |
|---|---|---|
| Banco de preguntas | ✅ | ItemVirtualList + ItemEditor (src/components/items/) |
| Tipos de reactivos | ✅ | Opción múltiple, respuesta abierta, numérica, V/F, relación, ensayo |
| Metadatos (tema, dificultad) | ✅ | Item schema con tags, difficulty, objectives |
| Versionado | ❌ | Sin historial persistente |
| Bloqueo anti-filtraciones | ❌ | Sin control de visibilidad por rol |
| Editor con KaTeX | ✅ | MathMarkdown integrado |
| Claves y explicación | ✅ | Item schema incluye correctAnswer, explanation |
| Rúbricas | ✅ | Rubric schema en types.ts |
| Previsualización | ✅ | ItemEditor incluye preview |

**Schema Supabase**:
- ❌ Sin tabla `reactivos` o `banco_preguntas` en schema actual
- 🟡 Implementación local en `driverLocal.ts` (localStorage)

---

## 6) Exámenes (Creación → Publicación → Aplicación → Calificación)
**Estado**: 🟡 PARCIAL (UI completa, backend mock)

| Característica | Estado | Notas |
|---|---|---|
| Configuración examen | ✅ | EnhancedExamCreator (5 pasos) |
| Selección manual/automática | ✅ | Filtros por tema, dificultad, número |
| Barajado orden/opciones | ✅ | Shuffle logic en EnhancedExamCreator |
| Tiempo límite/intentos | ✅ | Configuración en paso 3 (Config) |
| Ventana aplicación | ✅ | Dates + timezone picker |
| Proctoring | ❌ | Sin captura/bloqueo |
| Mostrar/ocultar retro | ✅ | Setting en config |
| Ponderaciones por sección | 🟡 | UI presente; cálculo parcial |
| Curva/norma | ❌ | No implementado |
| Asignar a grupos | 🟡 | UI selector; sin persist real |
| Aplicación (temporizador, guardado) | 🔵 | ExamPage con timer; sin backend |
| Calificación automática | ✅ | GradingInterface con batch grading |
| Calificación con rúbrica | ✅ | Rubric editor en GradingInterface |
| Detección anomalías | ❌ | Sin proctoring |
| Publicar calificaciones | 🔵 | UI presente; sin RLS |
| Exportaciones CSV/PDF | ❌ | Sin funciones export |

**Schema Supabase**:
- ✅ Tabla `examenes` (supabase_schema.sql:99)
- ✅ Tabla `preguntas` (schema:116)
- ✅ Tabla `resultados_examenes` (schema:131)
- ✅ Tabla `calificaciones` (schema:143)

---

## 7) Gimnasio Cognitivo (Práctica Adaptativa)
**Estado**: 🟡 PARCIAL (lógica completa, UI básica)

| Característica | Estado | Notas |
|---|---|---|
| Configuración objetivos | 🔵 | cognitiveGym.ts con algoritmo adaptativo |
| Rango dificultad/duración | ✅ | Lógica en gym service |
| Reintentos con variaciones | ✅ | Versionado de ítems |
| Bonos gamificación | ✅ | XP por racha/precisión |
| Algoritmo adaptativo | ✅ | SRS + dificultad + olvido |
| Feedback inmediato | ✅ | Explicación tras respuesta |
| Reincorporar fallados | ✅ | Lógica de repaso |
| Panel dominio profesor | 🔵 | Heatmap en TeacherResultsPage; MOCK data |
| Sugerencias consolidación | ✅ | tutorCopilot.ts genera recomendaciones |

**Schema Supabase**:
- ❌ Sin tabla `sesiones_gimnasio` ni `progreso_gimnasio`

---

## 8) Tareas y Cuestionarios Formativos
**Estado**: ✅ COMPLETO (UI)

| Característica | Estado | Notas |
|---|---|---|
| Crear tareas | ✅ | TaskManager con TaskCreationModal |
| Fecha límite/rúbrica | ✅ | Modal incluye config |
| Cuestionarios formativos | 🟡 | Sin distinción explícita; mismo flujo |
| Reentrega y comentarios | ✅ | Estado y feedback en TaskManager |

**Schema Supabase**:
- ✅ Tabla `tareas` (supabase_schema.sql:69)
- ✅ Tabla `entregas_tareas` (schema:84)

---

## 9) Analítica y Libro de Calificaciones
**Estado**: 🟡 PARCIAL

| Característica | Estado | Notas |
|---|---|---|
| Vistas por curso/grupo | 🔵 | TeacherResultsPage; MOCK |
| Promedio, dispersión | 🔵 | MOCK_TEACHER_KPIS |
| Mapa de calor | ✅ | Heatmap component |
| Por examen (p-value, discriminación) | 🔵 | MOCK_QUESTION_ANALYTICS |
| Por alumno (progreso, rachas) | 🔵 | StudentFocusReport en tutorCopilot |
| Recomendar prácticas | ✅ | assignReinforcement() |
| Exportar reportes | ❌ | Sin CSV/PDF export |

**Schema Supabase**:
- ✅ Tabla `calificaciones` existe
- ❌ Sin vistas agregadas o triggers para estadísticas

---

## 10) Comunicación
**Estado**: ✅ COMPLETO (UI)

| Característica | Estado | Notas |
|---|---|---|
| Mensajes a grupos/alumnos | ✅ | CommunicationHub |
| Comentarios en tareas | ✅ | TaskManager feedback |
| Plantillas | ✅ | Templates en CommunicationHub |
| Historial | ✅ | Thread view |
| Control respuestas | ✅ | Modo anuncio unidireccional |

**Schema Supabase**:
- ✅ Tabla `mensajes` (supabase_schema.sql:177)

---

## 11) Gamificación (Vista Profesor)
**Estado**: 🟡 PARCIAL

| Característica | Estado | Notas |
|---|---|---|
| Configurar XP por acción | 🔵 | cognitiveGym.ts; sin UI config |
| Logros | ✅ | achievement system en cognitiveGym |
| Rankings | ✅ | GamRankingDemo component |
| Control ocultar/mostrar | ❌ | Sin toggle |

**Schema Supabase**:
- ❌ Sin tablas `gamificacion`, `logros`, `xp`

---

## 12) Biblioteca de Recursos
**Estado**: ❌ FALTANTE

| Característica | Estado | Notas |
|---|---|---|
| Subir materiales | ❌ | Sin componente |
| Metadatos | ❌ | - |
| Compartir entre docentes | ❌ | - |
| Previsualización | ❌ | - |

**Schema Supabase**:
- ❌ Sin tabla `recursos` ni integración con Storage

---

## 13) Integración Técnica
**Estado**: ✅ COMPLETO (Supabase setup)

| Característica | Estado | Notas |
|---|---|---|
| Supabase Auth | ✅ | AuthContext con getSession/signIn/signOut |
| DB con RLS | ✅ | Schema definido; RLS habilitado |
| Storage | ❌ | No configurado |
| Front SPA protegido | ✅ | ProtectedRoute + role check |
| KaTeX render | ✅ | MathMarkdown |
| WAI-ARIA | 🟡 | Parcial (Radix UI components) |

---

## 14) Flujo de Trabajo Recomendado
**Estado**: 🟡 PARCIAL (guideline, no UI wizard)

- Documentado en manual; no hay wizard en app.

---

## 15) Casos Borde y Políticas
**Estado**: ❌ FALTANTE

| Característica | Estado | Notas |
|---|---|---|
| Extensiones/penalizaciones | ❌ | Sin lógica |
| Reintentos con escalado | ❌ | - |
| Guardado automático | ✅ | ExamPage con autosave |
| Marcar intentos anómalos | ❌ | Sin proctoring |
| Accesibilidad (tiempo extra) | ❌ | Sin config A11y específica |

---

## 16) Bitácora (Auditoría)
**Estado**: ❌ FALTANTE

| Característica | Estado | Notas |
|---|---|---|
| Registro acciones críticas | ❌ | Sin tabla `auditoria` ni triggers |

**Schema Supabase**:
- ❌ Sin tabla `logs` o `bitacora`

---

## 17–18) Glosario y Checklist
**Estado**: ✅ COMPLETO (documentación)

- Incluidos en `MANUAL_PROFESOR.md`.

---

## 19) Métricas Clave
**Estado**: 🟡 PARCIAL (dashboard con MOCK)

| Métrica | Estado | Notas |
|---|---|---|
| Tasa finalización | 🔵 | MOCK |
| Dominios por tema | 🔵 | MOCK heatmap |
| Tiempo por reactivo | 🔵 | MOCK |
| Mejora por cohorte | 🔵 | MOCK |
| Uso rachas/logros | 🔵 | cognitiveGym data |

---

## 20) Plantillas/Componentes Visibles
**Estado**: ✅ COMPLETO (UI)

| Plantilla | Estado | Notas |
|---|---|---|
| Creador de exámenes | ✅ | EnhancedExamCreator |
| Calificador con rúbrica | ✅ | GradingInterface |
| Panel de dominio | ✅ | Heatmap + TeacherResultsPage |
| Gestor de banco | ✅ | ItemVirtualList + ItemEditor |
| Asignador de gimnasio | 🔵 | cognitiveGym lógica; sin UI config |
| Mensajería | ✅ | CommunicationHub |
| Libro de calificaciones | 🔵 | GradingPage (nuevo diseño) |

---

## Resumen Ejecutivo

### Áreas Completas ✅
- Auth básico (Supabase)
- Banco de preguntas (localStorage)
- Creador de exámenes (UI de 5 pasos)
- Calificación con rúbricas
- Comunicación (mensajes, plantillas)
- Gimnasio cognitivo (lógica adaptativa)
- Tareas y cuestionarios (UI TaskManager)

### Áreas Parciales 🟡
- Perfil del profesor (sin página de edición)
- Cursos/grupos (UI presente, datos MOCK)
- Analítica (dashboard con MOCK)
- Gamificación (lógica presente, sin config UI)
- Exámenes (aplicación real sin backend)

### Áreas Faltantes ❌
- 2FA
- Bitácora de auditoría
- Biblioteca de recursos (subir/compartir archivos)
- Proctoring
- Exportaciones (CSV/PDF)
- Storage de Supabase
- Calendario del grupo
- Políticas de extensión/reintento

---

## Recomendaciones Prioritarias

### Corto Plazo (1–2 sprints)
1. **Conectar datos MOCK a Supabase**: migrar MOCK_TEACHER_GROUPS, MOCK_HEATMAP_DATA a queries reales.
2. **Perfil del profesor**: página `/docente/perfil` con edición de bio/foto/notificaciones.
3. **Exportaciones básicas**: función CSV para calificaciones y reportes.
4. **Bitácora mínima**: tabla `auditoria` + triggers para creación/edición/eliminación.

### Mediano Plazo (3–4 sprints)
5. **Storage + Biblioteca**: integrar Supabase Storage para recursos PDF/video; componente de subida.
6. **Calendario del grupo**: vista de sesiones/entregas con integración a tareas/exámenes.
7. **Gamificación config**: UI para definir reglas XP/logros por curso.
8. **Proctoring básico**: captura de eventos (tab changes, inactividad) en `resultados_examenes.metadata`.

### Largo Plazo (5+ sprints)
9. **2FA**: integración con Supabase Auth MFA.
10. **Analytics real-time**: triggers + funciones para calcular estadísticas agregadas.
11. **Accesibilidad avanzada**: tiempo extra configurable, reader mode, alto contraste.
12. **API pública**: endpoints REST para integraciones externas.

---

## Matriz de Gaps por Tabla Supabase

| Tabla en Manual | Tabla en Schema | Estado | Notas |
|---|---|---|---|
| cursos | — | ❌ | Schema usa `grupos` directamente |
| reactivos/banco | — | ❌ | Implementado en localStorage |
| gimnasio_sesiones | — | ❌ | Sin persistencia |
| recursos | — | ❌ | Sin tabla ni Storage |
| auditoria/bitacora | — | ❌ | Sin tabla |
| gamificacion/xp/logros | — | ❌ | Sin tablas |

---

**Fin del reporte.**  
Para consultas, revise [MANUAL_PROFESOR.md](./MANUAL_PROFESOR.md) y los archivos de código mencionados.

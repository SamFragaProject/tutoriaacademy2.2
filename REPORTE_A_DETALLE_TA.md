# REPORTE A DETALLE — TutoriA Academy (B2B)

Fecha: 2025-10-13

Nota rápida: Si necesitas exclusivamente el estado actual (sin propuestas/TO-BE), consulta `REPORTE_A_DETALLE_TA_SOLO_ASIS.md`.

Este documento describe, con máximo detalle, todo lo que hay en el proyecto: arquitectura, módulos, flujos, datos, roles (alumno, docente, director y admin), puntos de integración y oportunidades de mejora. Sirve como base para análisis funcional, técnico y de UX/flujo.

---

## 1) Resumen Ejecutivo

- Tipo de app: SPA React + Vite con rutas por rol (alumno, docente, director, admin) y modo público.
- Datos: 100% mock en memoria/localStorage; sin backend operativo (APIs planificadas por servicios/abstracciones en `services/`).
- Roles cubiertos: alumno, docente, director, admin (con layouts, navegación y páginas dedicadas).
- Estado global: Contextos de Auth, Tema, Timer de estudio, Subscripción, Toasts, Sidebar.
- Objetivo actual: Validar UX y flujos completos con datos simulados y sentar base para integración real.

---

## 2) Stack y Configuración

- React 19 + TypeScript (estricto por proyecto)
- Vite 6 (dev server y build)
- React Router DOM 7 (enrutamiento con `HashRouter`)
- Framer Motion (animaciones)
- Lucide React (íconos)
- TanStack React Query (instalado, no se ve uso intensivo)
- Zod (validaciones; uso puntual)
- Firebase (paquete y `firebase.json` presentes; integración pendiente para producción)

Scripts (`package.json`):
- dev: vite
- build: vite build
- preview: vite preview

---

## 3) Estructura del Proyecto (alto nivel)

Raíz del repo (principales):
- `App.tsx`: enrutamiento principal por rol y público.
- `components/`: componentes UI y módulos por área (teacher, student, admin, etc.).
- `pages/`: aglutina páginas por rol: `StudentPages.tsx`, `TeacherPages.tsx`, `DirectorPages.tsx`, `AdminPages.tsx`.
- `contexts/`: Auth, Theme, Subscription, StudyTimer, Sidebar, Toast.
- `services/`: capa de lógica y simulación de API/dominio (gamification, tutor, analytics, progress, agenda, etc.).
- `data/`: mocks de negocio (escuela, grupos, exámenes, diagnósticos, mock exams, medallas, etc.).
- Documentación: múltiples .md con guías, análisis, guiones de prueba y estado.
- `vite.config.ts`, `tsconfig.json`, `index.html`, `index.tsx`.

---

## 4) Enrutamiento y Layouts

Archivo: `App.tsx` (usa `HashRouter`).

- Público (`/`): Home, Blog, Ayuda, Legales, Contacto. Layout: `PublicLayout`.
- Auth: `/login` (credenciales demo por rol; ver Anexo).
- Onboarding B2B: `/setup`.
- Alumno (`/app/*`): `StudentLayout` (sidebar con Dashboard, Materias, Tutor, Biblioteca, Agenda, Progreso, Juegos, Ranking, Configuración).
- Docente (`/docente/*`): `TeacherLayout` (Dashboard, Grupos, Banco de Preguntas, Exámenes, Calificaciones, Resultados, Copiloto, Screening, Crear examen IA, Tareas, Comunicación).
- Director (`/director/*`): `DirectorLayout` (Dashboard, Escuela, Docentes, Alumnos, Análisis, Suscripción).
- Admin (`/admin/*`): `AdminLayout` (Dashboard, Usuarios, Documentos, Tutores, Métricas, Emails, APIs).
- Rutas protegidas: `<ProtectedRoute>` envuelve layouts de roles, controlado por `AuthContext`.

Layouts principales en `components/Layout.tsx`:
- `PublicLayout`, `StudentLayout`, `TeacherLayout`, `DirectorLayout`, `AdminLayout`.
- Sidebars por rol; header con `ThemeToggle`, `ProfileDropdown`, breadcrumbs y `UnifiedAssistant`.

---

## 5) Contextos y Estado Global

`contexts/`:
- `AuthContext.tsx`: Autenticación mock. Persistencia en `localStorage`. Usuarios demo por rol desde `constants.ts`. Carga de datos de alumno por nivel educativo mediante `data/mockUserData.ts`.
- `ThemeContext.tsx`: tema claro/oscuro con `ThemeToggle`.
- `StudyTimerContext.tsx`: timer de estudio mostrado en header para alumno.
- `SubscriptionContext.tsx`: estado de suscripción escolar (simulado).
- `SidebarContext.tsx`: estado de colapso/apertura en sidebars (desktop/móvil).
- `ToastContext.tsx`: sistema de notificaciones con `ToastContainer` y hook `useToast`.

Eventos globales:
- `services/eventBus.ts`: bus simple; usado para “meta-achievements” y toasts en `App.tsx`.

---

## 6) Datos Mock y Origen de Información

- `constants.ts`: usuarios mock por rol, KPIs director y docente, grupos teacher, heatmaps, ranking, preguntas/analítica, asignaciones de exámenes, blog demos, catálogo universidad/áreas, etc.
- `data/schoolMockData.ts`: escuela, grupos detallados, usuarios (profesores/alumnos), tareas, exámenes; funciones utilitarias: `getGroupsByTeacher`, `getStudentsByGroup`, `getExamenesByGroup`, etc.
- `data/mockUserData.ts`: cargas de datos específicas por nivel educativo del alumno (primaria/secundaria/preparatoria) en `localStorage`.
- `data/diagnostic.ts`, `data/mockExam.ts`: bancos de preguntas para diagnóstico y simulacro.
- `data/medalsCatalog.ts`, `data/metaAchievementsCatalog.ts`: gamificación y meta-logros.

Persistencia local:
- `localStorage` para: sesión, exámenes creados por docente, cargas de data mock, preferencias y algunos estados de UI.

---

## 7) Servicios (lógica de dominio / simulación de API)

Directorio `services/` (destacados):
- `tutorCopilot.ts`: lógica del copiloto IA (reportes, sugerencias, interacciones simuladas).
- `gamification.ts`, `metaAchievements.ts`: XP, streaks, logros, meta-logros.
- `diagnostic.ts`, `mockExam.ts`, `practice.ts`: orquestan diagnósticos, simulacros, prácticas.
- `progress.ts`, `masteryAnalytics.ts`, `cognitiveAnalytics.ts`: progreso y analítica.
- `agenda.ts`, `preferences.ts`, `nudges.ts`: agenda, preferencias de estudio, nudges.
- `cognitiveGames.ts`, `cognitiveGym.ts`, `gameScores.ts`: juegos cognitivos y puntuaciones.
- `admin*` (metrics, users, email, config, documents): panel admin y pipeline de documentos para RAG (simulado).
- `gemini.ts` y `aiRouter.ts`: fachada a IA (mock; no hace llamadas externas reales).
- `subscription.ts`, `stripe.ts`: subscripciones (simuladas).

Nota: Los servicios están diseñados como capa de abstracción para un futuro backend real. Hoy retornan datos en memoria/mocks.

---

## 8) Componentes Principales por Rol

### 8.1 Alumno (archivo: `pages/StudentPages.tsx` + componentes en `components/` y `src/components/tutor/`)
- Dashboard del alumno: tarjetas de progreso, logros, nudges, analíticas y atajos.
- Materias/Syllabus: temario por materia, subtemas, avance y materiales.
- Tutor (chat en `/app/chat`): modo learn/practice/review, con prompts guiados, citas (RAG simulado) y flujo de sesión (`TutorSession`, `TutorStepper`, `ExitTicket`).
- Biblioteca: documentos de estudio (mock) y exploración.
- Agenda: eventos próximos y planificaciones.
- Progreso: analítica de desempeño, gráficas con Recharts.
- Juegos cognitivos: N-Back, Stroop, RSVP, ReactionTime, etc., con `GameCard`, rankings y resúmenes.
- Simulacro/Diagnóstico/Prácticas: flujos completos de evaluación con `QuestionCard`, `TimerBar`, `ReviewSheet`, `ResultSummary`.

### 8.2 Docente (archivo: `pages/TeacherPages.tsx` + `components/teacher/*`)
- EnhancedTeacherDashboard: KPIs de docente, alertas tempranas, heatmaps de temas, sugerencias (mock).
- Grupos: cards por grupo clase y métricas (usa `MOCK_TEACHER_GROUPS`).
- Banco de preguntas: `ItemVirtualList`, `ItemEditor` (en `src/components/items/*`) con esquemas en `src/schemas/item`.
- Exámenes: `EnhancedExamCreator` (asistente 5 pasos):
  1) Config básica: nombre, materia, grupos, duración, barajado y resultados.
  2) Temas: selector jerárquico con pesos por tema.
  3) Tipos y dificultad: distribución por tipo (MC, VF, respuesta corta, etc.) y % de dificultad.
  4) Generación: mock “IA” que crea preguntas por tipo y tema; vista y edición.
  5) Revisión/guardado: preview y persistencia en `localStorage`
  - Integración con escuela/grupos: `getGroupsByTeacher(user.id)` de `data/schoolMockData.ts`.
  - Manejo de estados seguros (e.g., `group.estudiantes?.length || 0`, listas con `myGroups && myGroups.length`).
- Calificaciones: `GradingInterface` (flujo de revisión y asignación de calificaciones, simulado).
- Resultados: reportes de desempeño por subtema, grupos y tendencias (mock + gráficos).
- Copiloto docente: `TutorCopilotPage` genera análisis/sugerencias de refuerzo.
- Screening: `ScreeningDashboard` centraliza alertas y filtros.
- Crear examen IA: `AIExamCreatorPage` (demostrador alternativo simplificado).
- Tareas/Comunicación: `TaskManager` y `CommunicationHub` (gestión básica simulada).

### 8.3 Director (archivo: `pages/DirectorPages.tsx`)
- Dashboard Directivo: KPIs de cobertura, lift de aprendizaje, intervenciones sugeridas; descargas simuladas.
- Gestión escolar: vista de escuela, docentes, alumnos, suscripción (`MOCK_SCHOOL_SUBSCRIPTION`).
- Análisis académico: gráficas de dominio por materia, fortalezas y áreas de oportunidad (`MOCK_ACADEMIC_ANALYSIS_DATA`).

### 8.4 Admin (archivo: `pages/AdminPages.tsx` + `components/admin/*`)
- Dashboard Admin: KPIs de plataforma (DAU, escuelas activas, MRR estimado, costos simulados).
- Usuarios: búsqueda y administración (simulada) de cuentas.
- Documentos: pipeline para subir/indizar guías de estudio (UI simulada, base para RAG real).
- Tutores IA: ajuste de tono, técnicas y dificultad de tutores (`types.TutorConfig`).
- Métricas: paneles y funneles; heatmaps de uso.
- Emails: plantillas y vista previa; envío simulado.
- APIs: catálogo/gestión (placeholder UI).

---

## 9) Modelo de Datos (resumen de `types.ts` relevante)

- `User`: { id, name, email, role: 'director' | 'docente' | 'alumno' | 'admin', schoolId, schoolName, groupId?, groupName?, xp, accuracy, streak, activeSubjects, tokenSavingMode, masteryScore, gradeLevel? }.
- `StudentProfile`: skills, srsData, estilo de aprendizaje, contadores cognitivos, estado psico-emocional.
- Gamificación: `Achievement`, `MetaAchievement`, `GamificationState`.
- Tutor/Contenido: `Document`, `Chunk`, `TutorConfig`, `Syllabus` (en servicios relacionados).
- Exámenes/prácticas: `PracticeQuestion`, históricos y analíticas.
- Director/escuela: `SchoolSubscription`, `TeacherInfo`, `GroupReport`.

---

## 10) Roles y Permisos (funcional y UX)

- Alumno:
  - Acceso a dashboard, tutor, materias, prácticas, simulacros, biblioteca, agenda, progreso y juegos.
  - Perspectiva personal: progreso propio y logros.
- Docente:
  - Gestión de grupos, creación de exámenes/tareas, calificación y análisis; copiloto IA.
  - Perspectiva grupal: heatmaps por subtema, alertas y refuerzos.
- Director:
  - Visión macro de escuela: KPIs, docentes, alumnos, suscripción, análisis académico, áreas de oportunidad.
- Admin:
  - Gestión transversal: usuarios, documentos, tutores IA, métricas plataforma, emails, APIs.

`ProtectedRoute` restringe acceso por login; la app asume que el usuario autenticado ve el layout/paths de su rol.

---

## 11) Autenticación Demo y Cargas

`contexts/AuthContext.tsx` valida estas credenciales demo:
- Alumno (genérico): email de `MOCK_USER_ALUMNO` con pass `alumno123`.
  - Niveles alternos: primaria/secundaria/preparatoria (ver `mockUserData.ts`) con credenciales:
    - ana.primaria@escuela.com / primaria123
    - carlos.secundaria@escuela.com / secundaria123
    - maria.prepa@escuela.com / preparatoria123
- Docente: juan.martinez@colegiotutoria.edu.mx / docente123
- Director: director@escuela.com / director123
- Admin: admin@tutoria.com / admin123

Notas:
- La sesión persiste en `localStorage`.
- Para alumno, se cargan datasets según nivel con `loadMockDataForUser()`.

---

## 12) Flujo de Exámenes (Docente) — Detalle Operativo

Componente: `components/teacher/EnhancedExamCreator.tsx`
- Paso 1: Configuración (nombre, materia, fecha, duración, grupos, barajar, resultados, instrucciones).
- Paso 2: Temas jerárquicos con pesos (sumatoria 100). Búsqueda y expand/collapse de árbol.
- Paso 3: Distribución de tipos y dificultad (fácil/media/difícil).
- Paso 4: Generación mock (espera simulada; crea N preguntas por tipo; asigna tema/dificultad; opciones en MC/MC-múltiple).
- Paso 5: Revisión y guardado en `localStorage` (clave `exams_${user.id}`).
- Integraciones: grupos del profe vía `getGroupsByTeacher(user.id)`.
- Seguridad: controles de null/undef en arrays para evitar runtime errors.

Limitaciones actuales:
- Sin banco real; IA simulada. Sin exportación PDF/CSV nativa.
- Sin asignación efectiva a alumnos (sólo persistencia local).

---

## 13) UI, Accesibilidad y Rendimiento

- UI moderna con Tailwind utility-classes (estilos integrados en el proyecto), íconos Lucide y animaciones Framer Motion.
- Responsive: sidebars colapsables, breakpoints en grids, navs para mobile.
- Accesibilidad: íconos con etiquetas, tamaños de fuente legibles; se puede fortalecer con roles/aria y foco.
- Performance: listas virtuales (p.ej., banco de preguntas), memoización selectiva; gráficos via Recharts.

---

## 14) Métricas y Eventos

- `services/metrics.ts` y `dashboardAnalytics.ts`: recopilan/derivan métricas simuladas.
- `eventBus` + `Toast`: feedback inmediato (p. ej. meta-archievements en `App.tsx`).

---

## 15) Integraciones Externas y Seguridad

- Firebase: `firebase` y `firebase.json` presentes; integración futura (auth/hosting/firestore/storage) — no requerida para mocks.
- IA (Gemini/OpenAI): capa de abstracción creada, sin llamadas reales (no se exponen claves ni secretos).
- Stripe: stub de servicio.
- Seguridad actual: auth mock local; no hay tráfico sensible; listo para reemplazar con OAuth/JWT y RBAC real.

---

## 16) Cómo Ejecutar (Windows PowerShell)

- Opción 1 (recomendada si tienes script): `iniciar-servidor.ps1` abre nueva ventana y lanza Vite.
- Opción 2: `npm run dev` desde la raíz (si no hay conflicto de terminales).

Compilación y preview:
- Build: `npm run build`
- Preview build: `npm run preview`

---

## 17) Limitaciones Conocidas

- Sin backend: todo mock. Persistencia sólo en navegador.
- Exportaciones (PDF/CSV) limitadas; notificaciones/email simulados.
- Falta capa de autorización fina por endpoint (pendiente hasta tener API real).
- Cobertura de tests automatizados: baja (hay guías de prueba manual muy extensas en docs).

---

## 18) Recomendaciones de Mejora de Flujos

1) Docente — Creación/Asignación de exámenes
- Añadir “asignar a” más granular (alumnos específicos, tiempos diferenciados, intentos).
- Banco reutilizable con filtros por tema/dificultad y calidad (éxito/tiempo históricos).
- Exportación a PDF y enlace para alumnos.

2) Alumno — Tutor y Prácticas
- Más feedback inmediato y adaptativo según SRS y mastery por subtema.
- Integrar “study plan” con agenda y recordatorios.

3) Director — Acciones prescriptivas
- Convertir insights en playbooks accionables (p. ej., “crear refuerzo grupal” con 1 click) y seguimiento del impacto.

4) Admin — Pipeline documentos
- Endpoints de ingestión, colas de procesamiento, RAG real con citaciones firmes y trazabilidad.

5) Plataforma — Integración Backend
- Diseñar API REST/GraphQL con auth JWT, RBAC por rol, auditoría, y almacenamiento en DB (Postgres + Prisma recomendado). 
- Telemetría (OpenTelemetry) y monitoreo (Sentry/Datadog) para prod.

---

## 19) Tabla de Referencia Rápida (archivos clave)

- Enrutamiento: `App.tsx`
- Layouts: `components/Layout.tsx`
- Alumno: `pages/StudentPages.tsx`, `components/tutor/*`, `components/games/*`
- Docente: `pages/TeacherPages.tsx`, `components/teacher/*`, `src/components/exams/*`
- Director: `pages/DirectorPages.tsx`
- Admin: `pages/AdminPages.tsx`, `components/admin/*`
- Contextos: `contexts/*.tsx`
- Servicios: `services/*.ts`
- Datos: `data/*.ts`, `constants.ts`

---

## 20) Anexo — Credenciales Demo

- Alumno primaria: ana.primaria@escuela.com / primaria123
- Alumno secundaria: carlos.secundaria@escuela.com / secundaria123
- Alumno preparatoria: maria.prepa@escuela.com / preparatoria123
- Alumno genérico: (igual a preparatoria) — usar pass `alumno123` si se selecciona `MOCK_USER_ALUMNO`
- Docente: juan.martinez@colegiotutoria.edu.mx / docente123
- Director: director@escuela.com / director123
- Admin: admin@tutoria.com / admin123

---

Este reporte consolida el panorama técnico-funcional y facilita decidir mejoras en flujos, priorizaciones de integración y endurecimiento para producción. Para cualquier sección que desees profundizar (e.g., estrategias de datos, diseño API, o pruebas automatizadas), puedo ampliar con artefactos listos para implementación.

---

## 21) Anexo — Flujos AS-IS y Propuesta TO-BE (por rol)

En esta sección se documenta el estado actual (AS-IS) y una propuesta de mejora (TO-BE) para los flujos clave por rol, junto con KPIs y ajustes de UI/UX que habilitan decisiones basadas en datos.

### 21.1 Alumno

- AS-IS
  - Accede a Dashboard con progreso, logros y asignaciones (mock).
  - Usa Tutor en `/app/chat` con modos learn/practice/review (RAG simulado) y sesión guiada.
  - Realiza prácticas, simulacros y diagnósticos; ve resultados básicos y recomendaciones.
  - Juegos cognitivos con puntajes y rankings.

- TO-BE (mejoras)
  - Plan de estudio adaptativo semanal con bloques SRS integrados y recordatorios (push/email).
  - Recomendaciones prescriptivas por subtema y objetivo (p.ej., “sube 5 pts en Ecuaciones en 7 días”).
  - Ruta de aprendizaje visual por materia con hitos, recompensas y refuerzos.
  - Escala de confianza y autoevaluación integrada para calibrar dificultad.

- KPIs sugeridos
  - Adherencia al plan de estudio (% bloques completados / planificados).
  - Lift por subtema (Δ puntaje último 7/14/30 días).
  - Tasa de finalización de prácticas/simulacros.
  - Tiempo efectivo de estudio semanal.

- UI/UX
  - Home con “Mi objetivo de la semana”, checklist de bloques y barra de progreso.
  - Tarjeta “Próximo mejor paso” basada en SRS/Mastery.
  - Calendario/Agenda con eventos del plan y notificaciones.

### 21.2 Docente

- AS-IS
  - Dashboard con KPIs y alertas tempranas; heatmap por subtema.
  - Crea exámenes con asistente de 5 pasos; guarda en localStorage.
  - Califica y consulta resultados/resúmenes (mock).

- TO-BE (mejoras)
  - Asignación de exámenes y tareas con segmentación (por alumno/subgrupo) y ventanas de tiempo.
  - Banco de preguntas con calidad (histórico de éxito/tiempo), etiquetas por DOK, y filtros avanzados.
  - Refuerzos automáticos post-examen (generación de práctica personalizada con 1 click).
  - Notificaciones a alumnos/padres y confirmación de lectura.

- KPIs sugeridos
  - Lift grupal por subtema (Δ promedio entre diagnóstico y sumativos).
  - Tasa de finalización por grupo y puntualidad.
  - Ítems débiles recurrentes (# ocurrencias debilidad por periodo).
  - Cobertura curricular (% subtemas cubiertos vs plan).

- UI/UX
  - Wizard de examen con paso de “Asignación” y “Condiciones” (tiempo, intentos, penalizaciones, IA-bloqueo).
  - Heatmap accionable: click en celda → crear refuerzo/práctica/retroalimentación.
  - Bandeja de acciones pendientes (exámenes por calificar, refuerzos sugeridos, mensajes).

### 21.3 Director

- AS-IS
  - KPIs de cobertura, lift de aprendizaje, suscripción y análisis macro por materia.

- TO-BE (mejoras)
  - Playbooks ejecutables (p.ej., “programar refuerzo transversal en Factorización para 3er grado”).
  - Benchmark entre grupos y docentes con detección de outliers y soporte.
  - Panel de renovación con predicción de churn y driver analysis.

- KPIs sugeridos
  - Cobertura semanal activa por grado/docente.
  - Lift académico por cohortes y por materia.
  - Riesgo de abandono (modelo simple con actividad y desempeño).
  - Avance del plan de estudios a nivel escuela.

- UI/UX
  - Tableros con tiles accionables: “Crear iniciativa”, “Asignar objetivo”, “Enviar comunicado”.
  - Reportes descargables y compartibles con sello de tiempo y filtros guardados.

### 21.4 Admin

- AS-IS
  - Gestión de usuarios, documentos (RAG), tutores IA, métricas, emails y APIs (UI simulada).

- TO-BE (mejoras)
  - Pipeline de ingestión/indizado con colas y auditoría; calidad de documentos y cobertura.
  - Catálogo de tutores IA versionado con experimentación A/B.
  - Cost monitoring con alertas por uso de IA y guardianes de presupuesto.

- KPIs sugeridos
  - Tasa de indexación exitosa y latencia de disponibilidad.
  - Calidad RAG (precisión de citaciones, cobertura de preguntas frecuentes).
  - Costo por usuario activo y por sesión IA.

- UI/UX
  - Consola de operaciones (estado de colas, errores, reintentos, SLA).
  - Matriz de permisos y roles con auditoría de cambios.

---

## 22) Roadmap de Implementación (alto nivel)

1) Backend y Auth real
   - API GraphQL/REST con JWT y RBAC; Postgres + Prisma. Endpoints para exámenes, banco de preguntas, grupos, resultados.
2) Exámenes 2.0
   - Asignación granular, intentos, condiciones, exportaciones y flujos de calificación/retro.
3) Tutor + RAG real
   - Ingesta de documentos, indexación, citaciones verificables, feedback de calidad.
4) Director Playbooks
   - Acciones prescriptivas, seguimiento de impacto y reporte ejecutivo.
5) Telemetría y Costos
   - OpenTelemetry + Sentry/Datadog; límites y alertas de costos IA.

---

## 23) Mapa de Métricas (mínimo viable)

- Engagement
  - DAU/WAU/MAU, sesiones por rol, tiempo en plataforma.
- Aprendizaje
  - Lift por subtema/materia, finalización de prácticas, mastery progression.
- Operación
  - Latencia endpoints, errores por servicio, éxito de pipelines.
- Negocio
  - Cobertura activa por escuela/docente, intención de renovación, costo por alumno activo.

---

Este anexo deja trazado el salto de AS-IS a TO-BE con métricas y cambios de UI que habilitan decisiones rápidas. Puedo ampliar cualquiera de los flujos con prototipos de pantalla y contratos de API si lo deseas.

---

## 24) Diagramas de Flujos y Secuencia (texto)

Nota: Los siguientes diagramas están en formato texto/mermaid-friendly para facilidad de edición rápida.

### 24.1 Flujo Alumno — Práctica guiada

```
Alumno -> Dashboard -> Recomendación "Próximo mejor paso"
    -> Clic -> Tutor (practice) -> Selección subtema -> Generación ítems (mock)
    -> Resolver N preguntas -> ReviewSheet -> Resultados + Nudges -> Agenda (bloque SRS)
```

Secuencia (simplificada):
```
StudentUI -> preferences.getStudyPlan
StudentUI -> practice.generateSet (subtopic)
StudentUI -> srs.scheduleNext (if applicable)
StudentUI -> progress.recordResult
```

### 24.2 Flujo Docente — Crear y asignar examen (TO-BE)

```
Docente -> Exámenes -> Nuevo (Wizard)
  Paso 1: Config + Condiciones -> Paso 2: Temas + Pesos
  Paso 3: Tipos + Dificultad -> Paso 4: Generar/Editar -> Paso 5: Revisar
  Paso 6: Asignar (grupos/subgrupos/alumnos; ventana; intentos)
  -> Confirmar -> Notificación a alumnos -> Seguimiento (panel)
```

Secuencia (con backend):
```
TeacherUI -> exams.createDraft
TeacherUI -> items.search/select
TeacherUI -> exams.generate (IA)
TeacherUI -> exams.assign (groups/students)
TeacherUI -> notifications.send
TeacherUI -> results.getOverview
```

### 24.3 Flujo Director — Playbook prescriptivo

```
Director -> Dashboard -> Detección: "Factorización bajo" -> Playbook sugerido
  -> Crear Refuerzo Transversal -> Seleccionar grupos/docentes -> Programar
  -> Seguimiento: lift 7/14/30 días -> Reporte ejecutivo
```

### 24.4 Flujo Admin — Ingesta documentos (RAG)

```
Admin -> Documentos -> Subir archivo(s) -> Validaciones -> En cola
  -> Procesar/Indexar -> Estado: indexado -> Calidad: cobertura y citaciones
  -> Disponible para Tutor -> Monitoreo de costos/uso
```

---

## 25) Contratos de API (borrador mínimo viable)

Objetivo: Describir endpoints clave para Exámenes 2.0 y Banco de Ítems.

### 25.1 Exams

- POST /api/exams
  - Crea un examen (draft o listo) con metadatos, temas, distribución y opciones.
- POST /api/exams/{examId}/assign
  - Asigna examen a grupos/alumnos con ventana, intentos, condiciones.
- GET /api/exams/{examId}
  - Obtiene detalle de examen y sus ítems.
- GET /api/exams?teacherId=…
  - Lista exámenes del docente.
- POST /api/exams/{examId}/submissions
  - Registra/actualiza envío del alumno (auto/guardado). 
- GET /api/exams/{examId}/results
  - Agregado de resultados; desglose por subtema y por alumno.

### 25.2 Items (Banco de preguntas)

- GET /api/items?query=…&topic=…&difficulty=…&dok=…&page=…
  - Búsqueda con filtros; incluye métricas de calidad (successRate, avgTime).
- POST /api/items
  - Crea/ingesta de un ítem (incluye metadata de calidad y rubricas).
- PATCH /api/items/{itemId}
  - Edita contenido/metadata/etiquetas.
- GET /api/topics
  - Catálogo de temas/subtemas (árbol).

### 25.3 Groups/Assignments

- GET /api/groups?teacherId=…
- GET /api/groups/{groupId}/students

### 25.4 Schemas (resúmenes)

```
Exam {
  id: string
  title: string
  subject: string
  date: string
  durationMin: number
  settings: { shuffleQuestions: boolean, shuffleOptions: boolean, showResults: boolean }
  topics: Array<{ topicId: string, weight: number }>
  distribution: Array<{ type: 'mc'|'vf'|'short'|'long'|'match'|'order', count: number }>
  difficulty: { easy: number, medium: number, hard: number }
}

Item {
  id: string
  type: 'mc'|'vf'|'short'|'long'|'match'|'order'
  prompt: string
  options?: Array<{ id: string, text: string, isCorrect: boolean }>
  topicId: string
  difficulty: 'easy'|'medium'|'hard'
  dok?: 1|2|3|4
  metrics?: { successRate?: number, avgTimeSec?: number }
}

Assignment {
  examId: string
  groupIds: string[]
  studentIds?: string[]
  window: { startISO: string, endISO: string }
  attempts: number
  conditions?: { antiCheat?: boolean }
}
```

Ejemplos y contratos completos están en:
- `docs/api/openapi.yaml` (OpenAPI completa)
- `docs/api/README.md` (convenciones y recursos)
- `docs/security/RBAC_MATRIX.md` (permisos por rol)
- `docs/architecture/NFR_AND_SLO.md` (NFRs, SLOs, errores, límites, idempotencia)
# REPORTE A DETALLE — SOLO AS-IS (Estado Actual)

Fecha: 2025-10-13

Este documento describe únicamente lo que existe HOY en el proyecto: funcionalidades implementadas, componentes actuales, datos mock y comportamientos reales en el front. No incluye propuestas, TO-BE, ni integración externa.

---

## 1) Stack y Configuración
- React 19 + TypeScript, Vite 6
- React Router (HashRouter)
- Framer Motion, Lucide React
- Recharts (gráficos)
- Zod (validación puntual)
- Firebase (paquete presente; no se usa en runtime actual)

Scripts (`package.json`): dev/build/preview con Vite.

---

## 2) Enrutamiento (AS-IS)
Archivo: `App.tsx`.
- Público: `/`, `/blog`, `/ayuda`, `/terminos`, `/privacidad`, `/contacto`.
- Auth: `/login` (mock login por rol).
- B2B Onboarding: `/setup`.
- Alumno (`/app/*`): `dashboard`, `materias`, `chat` (Tutor), `biblioteca`, `agenda`, `progreso`, `juegos`, `ranking`, `configuracion`, `exam/:examId`.
- Docente (`/docente/*`): `dashboard`, `grupos`, `banco-preguntas`, `examenes`, `calificaciones`, `resultados`, `copiloto`, `screening`, `crear-examen-ia`, `tareas`, `comunicacion`.
- Director (`/director/*`): `dashboard`, `escuela`, `docentes`, `alumnos`, `analisis`, `suscripcion`.
- Admin (`/admin/*`): `dashboard`, `usuarios`, `documentos`, `tutores`, `metricas`, `emails`, `apis`.
- Rutas protegidas con `<ProtectedRoute>` (basado en sesión mock).

---

## 3) Layouts y Contextos (AS-IS)
- Layouts en `components/Layout.tsx`: `PublicLayout`, `StudentLayout`, `TeacherLayout`, `DirectorLayout`, `AdminLayout`.
- Sidebars con navegación por rol; header con `ThemeToggle`, perfil, breadcrumbs y `UnifiedAssistant`.
- Contextos:
  - `AuthContext.tsx`: sesión mock con `localStorage`. Usuarios demo en `constants.ts`. Carga de datasets para alumno en `data/mockUserData.ts`.
  - `ThemeContext.tsx`: tema claro/oscuro.
  - `StudyTimerContext.tsx`: timer de estudio (alumno).
  - `SubscriptionContext.tsx`: estado de suscripción simulado.
  - `SidebarContext.tsx`: estado de la sidebar (collapse/móvil).
  - `ToastContext.tsx`: toasts app-wide.
- EventBus (`services/eventBus.ts`) para eventos de meta-logros → toasts en `App.tsx`.

---

## 4) Datos Mock (AS-IS)
- `constants.ts`: usuarios mock por rol; KPIs (director/docente); grupos del profesor (`MOCK_TEACHER_GROUPS`); heatmap de subtemas; ranking; asignaciones de exámenes (`MOCK_ASSIGNED_EXAMS`); analítica de preguntas; catálogo de universidades/áreas.
- `data/schoolMockData.ts`: escuela y grupos detallados; usuarios (profesores/alumnos) con info extendida; tareas y exámenes; utilidades: `getGroupsByTeacher`, `getStudentsByGroup`, `getExamenesByGroup`, etc.
- `data/mockUserData.ts`: datasets por nivel (primaria/secundaria/preparatoria) que se cargan en `localStorage` al logueo del alumno.
- `data/diagnostic.ts`, `data/mockExam.ts`: bancos de preguntas para diagnósticos y simulacros (front consume directamente estos mocks).
- `data/medalsCatalog.ts`, `data/metaAchievementsCatalog.ts`: catálogos de gamificación.

Persistencia: `localStorage` (sesión, exámenes guardados, preferencias, datasets mock).

---

## 5) Servicios (AS-IS)
Servicios que opera el front (sin backend real):
- `tutorCopilot.ts`: genera reportes y sugerencias (mock) para docentes.
- `diagnostic.ts`, `mockExam.ts`, `practice.ts`: orquestación de flujos de evaluación con datos mock.
- `progress.ts`, `masteryAnalytics.ts`, `cognitiveAnalytics.ts`: cálculo simulado de progreso y analíticas.
- `agenda.ts`, `preferences.ts`, `nudges.ts`: agenda y recomendaciones (simuladas).
- `cognitiveGames.ts`, `cognitiveGym.ts`, `gameScores.ts`: juegos y puntuaciones (mock/cliente).
- `admin*` (metrics, users, email, config, documents): UI y resultados simulados.
- `gemini.ts`, `aiRouter.ts`: fachadas de IA simuladas (no consumo externo en runtime actual).

Nota: No hay llamadas de red externas activas; toda la “lógica de dominio” se ejecuta en el cliente con mocks.

---

## 6) Alumno — Funcionalidad (AS-IS)
- Dashboard: tarjetas con progreso, nudges, logros.
- Materias/Syllabus: navegación por temas/subtemas con avance.
- Tutor (`/app/chat`): flujo de sesión con `TutorSession`, `TutorStepper`, `ExitTicket`; citas simuladas.
- Biblioteca: exploración de documentos mock.
- Agenda: eventos (mock) y vista simple.
- Progreso: gráficas con Recharts a partir de datos simulados.
- Juegos cognitivos: varios minijuegos con ranking y resúmenes.
- Simulacro/Diagnóstico/Prácticas: componentes de preguntas, timer, revisión y resultados; datos de `data/diagnostic.ts` y `data/mockExam.ts`.

---

## 7) Docente — Funcionalidad (AS-IS)
- Dashboard docente: KPIs mock, alertas tempranas y heatmap.
- Grupos: cards de `MOCK_TEACHER_GROUPS`.
- Banco de preguntas: `ItemVirtualList`, `ItemEditor` (UI), esquemas en `src/schemas/item`.
- Exámenes: `components/teacher/EnhancedExamCreator.tsx` (5 pasos):
  - Config básica (nombre, materia, fecha, duración, grupos, opciones de barajado/resultados).
  - Selección de temas (árbol con pesos).
  - Tipos de pregunta y distribución de dificultad.
  - Generación mock por tipo/tema (sin IA real).
  - Revisión y guardado en `localStorage` (`exams_${user.id}`).
  - Integración con `getGroupsByTeacher(user.id)` para listar grupos del profe.
- Calificaciones: `GradingInterface` (flujo UI simulado).
- Resultados: resúmenes/analíticas simuladas.
- Copiloto: reportes y sugerencias (mock) vía `tutorCopilot.ts`.
- Screening: tablero con alertas.
- Tareas/Comunicación: UI funcional simulada (`TaskManager`, `CommunicationHub`).

---

## 8) Director — Funcionalidad (AS-IS)
- Dashboard: KPIs de cobertura, lift y descargas simuladas.
- Gestión escolar: suscripción (mock), docentes/alumnos de `constants.ts`.
- Análisis académico: gráficas con `MOCK_ACADEMIC_ANALYSIS_DATA`.

---

## 9) Admin — Funcionalidad (AS-IS)
- Panel: KPIs de plataforma (mock) y paneles de gestión.
- Usuarios/Documentos/Tutores/Métricas/Emails/APIs: UIs con resultados simulados en cliente.
- Documentos: vista de ingestión/indexación simulada (no hay backend).

---

## 10) Autenticación Demo (AS-IS)
`contexts/AuthContext.tsx` con credenciales mock:
- Alumnos
  - ana.primaria@escuela.com / primaria123
  - carlos.secundaria@escuela.com / secundaria123
  - maria.prepa@escuela.com / preparatoria123
  - genérico: `MOCK_USER_ALUMNO` con pass `alumno123`
- Docente: juan.martinez@colegiotutoria.edu.mx / docente123
- Director: director@escuela.com / director123
- Admin: admin@tutoria.com / admin123

Persistencia de sesión: `localStorage`.

---

## 11) Limitaciones (AS-IS)
- Sin backend ni llamadas a servicios externos.
- Persistencia exclusivamente en navegador (localStorage).
- Exportación y notificaciones simuladas.
- Sin control de permisos en servidor; los roles se resuelven sólo en front.

---

## 12) Ejecución (AS-IS)
- Dev server: Vite. Puede arrancarse con `iniciar-servidor.ps1` (abre consola nueva) o `npm run dev`.
- Sin variables de entorno sensibles usadas.

---

## 13) Archivos clave (AS-IS)
- Enrutamiento: `App.tsx`
- Layouts: `components/Layout.tsx`
- Alumno: `pages/StudentPages.tsx`, componentes `components/tutor/*`, `components/games/*`
- Docente: `pages/TeacherPages.tsx`, `components/teacher/*`
- Director: `pages/DirectorPages.tsx`
- Admin: `pages/AdminPages.tsx`
- Datos: `constants.ts`, `data/schoolMockData.ts`, `data/diagnostic.ts`, `data/mockExam.ts`
- Contextos: `contexts/*.tsx`
- Servicios: `services/*.ts` (todos operan en cliente con mocks)

---

Este documento refleja únicamente el estado actual sin especulaciones. Ideal para que puedas conectar una IA externa y rediseñar flujos sobre base cierta.
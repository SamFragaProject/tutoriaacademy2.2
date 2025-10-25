# Plan de Acción — Cerrar Gaps de Implementación

**Proyecto**: TutoriA Academy — Rol Profesor  
**Objetivo**: Migrar de MOCK a producción real (Supabase) y completar funciones críticas faltantes.  
**Baseline**: [docs/IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)

---

## Fase 1 — Fundamentos (1–2 sprints, ~40 horas)

### 1.1 Conectar Datos MOCK a Supabase
**Gap actual**: Dashboard, grupos, analíticas usan `MOCK_TEACHER_GROUPS`, `MOCK_HEATMAP_DATA` de `constants.ts`.

**Tareas**:
- [ ] Crear servicio `services/teacher/groups.ts`:
  - `fetchTeacherGroups(profesorId)` → query `grupos WHERE profesor_id = ?`
  - `fetchGroupStudents(grupoId)` → join `grupos_alumnos` + `usuarios`
- [ ] Crear servicio `services/teacher/analytics.ts`:
  - `fetchHeatmapData(grupoId)` → aggregate de `calificaciones` por tema/subtema
  - `fetchGroupKPIs(grupoId)` → promedio, asistencia, alertas desde tablas reales
- [ ] Actualizar `TeacherDashboardPage`:
  - Reemplazar `MOCK_TEACHER_GROUPS` con `useQuery(['teacher-groups'])`
  - Recharts en widgets conectados a datos reales
- [ ] Actualizar `TeacherResultsPage`:
  - Heatmap con datos de `calificaciones` vía `fetchHeatmapData`

**Criterio de éxito**: Dashboard muestra grupos/stats reales del profesor autenticado (sin MOCK).

**Estimación**: 16 horas (2 días)

---

### 1.2 Perfil del Profesor
**Gap actual**: Sin página `/docente/perfil` ni editor de datos personales.

**Tareas**:
- [ ] Crear `pages/TeacherProfilePage.tsx`:
  - Formulario: foto (avatar picker con upload a Supabase Storage), nombre, apellidos, bio, idioma, horarios disponibilidad.
  - Toggle notificaciones (email, push, plataforma).
- [ ] Crear `services/teacher/profile.ts`:
  - `updateProfile(userId, data)` → UPDATE `usuarios` WHERE `id = ?`
  - `uploadAvatar(file)` → Supabase Storage `avatars/` bucket → UPDATE `avatar_url`
- [ ] Agregar ruta en `App.tsx`:
  - `<Route path="perfil" element={<TeacherProfilePage />} />`
- [ ] Link desde topbar/sidebar: "Mi Perfil" → `/docente/perfil`

**Criterio de éxito**: Profesor puede editar foto/bio/notificaciones y ver cambios reflejados inmediatamente en sidebar/topbar.

**Estimación**: 12 horas (1.5 días)

---

### 1.3 Exportaciones Básicas (CSV)
**Gap actual**: Sin funciones `export()` para calificaciones, reportes.

**Tareas**:
- [ ] Crear `lib/exportUtils.ts`:
  - `exportToCSV(data, filename)` → genera CSV con header y rows; trigger download en navegador.
  - Función auxiliar para formatear fechas/números según locale.
- [ ] Actualizar `GradingPage`:
  - Botón "Exportar Calificaciones" (CSV) → llama `exportToCSV(pendientes, 'calificaciones.csv')`
- [ ] Actualizar `TeacherResultsPage`:
  - Botón "Exportar Heatmap" (CSV) → tabla de dominio por alumno/tema
- [ ] Opcional: `exportToPDF(data)` usando `jsPDF` o `html2canvas` (biblioteca adicional).

**Criterio de éxito**: Profesor puede descargar `.csv` con calificaciones de grupo; archivo válido en Excel/Google Sheets.

**Estimación**: 8 horas (1 día)

---

### 1.4 Bitácora de Auditoría (Tabla + Triggers Básicos)
**Gap actual**: Sin tabla `auditoria`; acciones críticas no registradas.

**Tareas**:
- [ ] Crear migración SQL para tabla `auditoria`:
  ```sql
  CREATE TABLE auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    accion TEXT NOT NULL, -- 'crear_examen', 'editar_reactivo', 'publicar_calificaciones'
    tabla TEXT,
    registro_id UUID,
    detalles JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id);
  CREATE INDEX idx_auditoria_timestamp ON auditoria(timestamp DESC);
  ```
- [ ] Crear función auxiliar `services/audit.ts`:
  - `logAction(userId, action, table, recordId, details)` → INSERT en `auditoria`
- [ ] Instrumentar acciones críticas:
  - `saveItem()` → `logAction(user.id, 'crear_reactivo', 'reactivos', itemId, { tema })`
  - `publishExam()` → `logAction(user.id, 'publicar_examen', 'examenes', examId, { grupoIds })`
  - `publishGrades()` → `logAction(user.id, 'publicar_calificaciones', 'calificaciones', grupoId, { count })`
- [ ] Página opcional `/docente/bitacora` con tabla filtrable (últimas 100 acciones).

**Criterio de éxito**: Acciones críticas registradas con timestamp y usuario; consulta rápida desde panel admin.

**Estimación**: 12 horas (1.5 días)

---

**Total Fase 1**: ~48 horas (~1.5 semanas)

---

## Fase 2 — Almacenamiento y Calendario (2–3 sprints, ~50 horas)

### 2.1 Biblioteca de Recursos (Supabase Storage)
**Gap actual**: Sin tabla `recursos` ni integración Storage; profesores no pueden subir PDFs/videos.

**Tareas**:
- [ ] Configurar bucket `recursos` en Supabase Storage:
  - Políticas RLS: solo el profesor dueño (o admin) puede leer/escribir.
- [ ] Crear tabla `recursos`:
  ```sql
  CREATE TABLE recursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profesor_id UUID REFERENCES usuarios(id),
    escuela_id UUID REFERENCES escuelas(id),
    grupo_id UUID REFERENCES grupos(id) ON DELETE SET NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    archivo_url TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('pdf', 'video', 'imagen', 'documento')),
    tema TEXT,
    nivel TEXT,
    duracion_min INTEGER,
    compartido BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] Crear `components/teacher/ResourceLibrary.tsx`:
  - Upload drag-and-drop con previsualización (PDF/imagen).
  - Lista de recursos con filtros (tema, tipo).
  - Botones: ver, editar metadatos, eliminar, compartir.
- [ ] Crear `services/teacher/resources.ts`:
  - `uploadResource(file, metadata)` → upload a Storage → INSERT `recursos`
  - `fetchResources(profesorId, filters)` → SELECT con WHERE
  - `deleteResource(resourceId)` → DELETE file + row
- [ ] Agregar ruta `/docente/biblioteca` en `App.tsx`.

**Criterio de éxito**: Profesor puede subir PDF, asignar a grupo, compartir con otros docentes; previsualización segura en UI.

**Estimación**: 24 horas (3 días)

---

### 2.2 Calendario del Grupo
**Gap actual**: Sin vista de sesiones/entregas; tareas y exámenes sin integración con calendario.

**Tareas**:
- [ ] Crear `components/teacher/GroupCalendar.tsx`:
  - Vista mensual con celdas; eventos con color por tipo (examen, tarea, sesión).
  - Click en evento → modal con detalles.
  - Botón "Agregar Sesión/Evento" → modal con fecha/hora/tipo.
- [ ] Crear tabla `eventos_calendario` (opcional, o extender `tareas`/`examenes` con campo `fecha_sesion`):
  ```sql
  CREATE TABLE eventos_calendario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
    profesor_id UUID REFERENCES usuarios(id),
    tipo TEXT CHECK (tipo IN ('sesion', 'examen', 'tarea', 'reunion')),
    titulo TEXT NOT NULL,
    fecha_inicio TIMESTAMPTZ NOT NULL,
    fecha_fin TIMESTAMPTZ,
    descripcion TEXT,
    recordatorio BOOLEAN DEFAULT false
  );
  ```
- [ ] Crear `services/teacher/calendar.ts`:
  - `fetchGroupEvents(grupoId, mesInicio, mesFin)` → SELECT eventos + tareas + examenes en rango
  - `createEvent(grupoId, event)` → INSERT
- [ ] Integrar en `GroupsPage` o crear ruta `/docente/calendario`.

**Criterio de éxito**: Profesor ve calendario mensual con entregas, exámenes, sesiones; puede agregar/editar eventos.

**Estimación**: 20 horas (2.5 días)

---

### 2.3 Configuración de Gamificación
**Gap actual**: Lógica de XP/logros en `cognitiveGym.ts` pero sin UI de configuración por curso.

**Tareas**:
- [ ] Crear `pages/TeacherGamificationPage.tsx`:
  - Selecciona curso/grupo.
  - Tabla de acciones (práctica, entrega puntual, racha) con campo XP ajustable.
  - Lista de logros con activar/desactivar y editar puntos/descripción.
  - Botón "Guardar Configuración" → persiste en tabla `gamificacion_config`.
- [ ] Crear tabla `gamificacion_config`:
  ```sql
  CREATE TABLE gamificacion_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id UUID REFERENCES grupos(id),
    accion TEXT NOT NULL, -- 'practica_completada', 'entrega_puntual', etc.
    xp_valor INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true
  );
  CREATE TABLE logros_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id UUID REFERENCES grupos(id),
    logro_key TEXT NOT NULL,
    titulo TEXT,
    descripcion TEXT,
    xp_requerido INTEGER,
    activo BOOLEAN DEFAULT true
  );
  ```
- [ ] Crear `services/teacher/gamification.ts`:
  - `fetchGamificationConfig(grupoId)`
  - `updateGamificationConfig(grupoId, rules)`
- [ ] Ruta `/docente/gamificacion` en `App.tsx`.

**Criterio de éxito**: Profesor puede ajustar XP por acción y activar/desactivar logros; cambios se reflejan en el gym del alumno.

**Estimación**: 16 horas (2 días)

---

**Total Fase 2**: ~60 horas (~2 semanas)

---

## Fase 3 — Seguridad y Accesibilidad (3–4 sprints, ~40 horas)

### 3.1 2FA (Autenticación de Dos Factores)
**Gap actual**: No implementado.

**Tareas**:
- [ ] Habilitar MFA en Supabase:
  - Supabase Dashboard → Authentication → Settings → MFA → Enable TOTP.
- [ ] Crear `pages/Setup2FAPage.tsx`:
  - Generar QR code con `supabase.auth.mfa.enroll()`
  - Input para código verificación.
  - Botones "Activar" / "Desactivar".
- [ ] Actualizar `LoginPage`:
  - Si MFA habilitado, mostrar campo código tras password correcto.
  - `supabase.auth.mfa.challenge()` + `verify()`.
- [ ] Link desde `/docente/perfil` → "Seguridad" → "Configurar 2FA".

**Criterio de éxito**: Profesor puede activar 2FA con app (Google Authenticator, Authy); login requiere código tras password.

**Estimación**: 12 horas (1.5 días)

---

### 3.2 Proctoring Básico (Registro de Eventos)
**Gap actual**: Sin captura de cambios de ventana, inactividad.

**Tareas**:
- [ ] Extender tabla `resultados_examenes` con campo `metadata JSONB`:
  - `metadata`: `{ "tab_changes": 3, "idle_times": [120, 45], "anomalies": ["copy_paste", "multiple_tabs"] }`
- [ ] Actualizar `ExamPage`:
  - Event listeners: `visibilitychange` (detectar tab switch), `blur`/`focus` (ventana pierde foco), `copy`/`paste`.
  - Guardar eventos en array local; al finalizar examen, enviar a backend → INSERT en `metadata`.
- [ ] Crear `services/proctoring.ts`:
  - `recordEvent(examAttemptId, eventType, timestamp, details)` → acumula en memoria → flush al terminar.
- [ ] Actualizar `GradingInterface`:
  - Mostrar badge "⚠️ Anomalías" si `metadata.tab_changes > 5` o `anomalies.length > 0`.
  - Profesor puede ver detalle de eventos en modal.

**Criterio de éxito**: Profesor ve alertas de cambios de ventana excesivos; puede marcar intento para revisión manual.

**Estimación**: 16 horas (2 días)

---

### 3.3 Accesibilidad (Tiempo Extra y Preferencias)
**Gap actual**: Sin configuración A11y por alumno.

**Tareas**:
- [ ] Crear tabla `preferencias_accesibilidad`:
  ```sql
  CREATE TABLE preferencias_accesibilidad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id UUID REFERENCES usuarios(id) UNIQUE,
    tiempo_extra_porcentaje INTEGER DEFAULT 0, -- 25, 50
    lector_pantalla BOOLEAN DEFAULT false,
    alto_contraste BOOLEAN DEFAULT false,
    tamano_fuente TEXT DEFAULT 'normal' -- 'normal', 'grande', 'extra-grande'
  );
  ```
- [ ] Crear `pages/DirectorAccessibilityPage.tsx` (Director/Admin):
  - Lista de alumnos con toggle tiempo extra (x1.25, x1.5).
  - Checkboxes para lector/contraste.
- [ ] Actualizar `ExamPage`:
  - Query `preferencias_accesibilidad` al cargar examen.
  - Si `tiempo_extra_porcentaje = 25`, multiplicar `duracion_minutos * 1.25`.
  - Si `alto_contraste`, agregar clase CSS.
- [ ] Crear `services/accessibility.ts`:
  - `fetchStudentPreferences(alumnoId)`
  - `updatePreferences(alumnoId, prefs)`

**Criterio de éxito**: Alumno con tiempo extra x1.5 ve temporizador ajustado; examen respeta configuración.

**Estimación**: 12 horas (1.5 días)

---

**Total Fase 3**: ~40 horas (~1.5 semanas)

---

## Resumen de Esfuerzo

| Fase | Sprints | Horas | Semanas |
|---|---|---|---|
| Fase 1: Fundamentos | 1–2 | 48 | 1.5 |
| Fase 2: Storage + Calendario | 2–3 | 60 | 2 |
| Fase 3: Seguridad + A11y | 3–4 | 40 | 1.5 |
| **TOTAL** | **4** | **148** | **~5** |

---

## Priorización (Si recursos limitados)

### Must-Have (Bloqueadores para producción)
1. Conectar datos MOCK a Supabase (1.1)
2. Bitácora de auditoría (1.4)
3. Proctoring básico (3.2) — si es requisito legal/institucional

### Should-Have (Mejora experiencia)
4. Perfil del profesor (1.2)
5. Biblioteca de recursos (2.1)
6. Calendario del grupo (2.2)

### Nice-to-Have (Valor adicional)
7. Exportaciones CSV (1.3)
8. Configuración gamificación (2.3)
9. 2FA (3.1)
10. Accesibilidad avanzada (3.3)

---

## Métricas de Éxito

- **Cobertura Manual**: 95% de funciones del manual implementadas y conectadas a Supabase.
- **Reducción MOCK**: 0% de datos MOCK en producción (solo datos reales del profesor autenticado).
- **Auditoría**: 100% de acciones críticas registradas en bitácora.
- **UX**: Tiempo de primera acción del profesor < 30 seg (sin buscar ayuda).
- **Seguridad**: 0 vulnerabilidades críticas en auditoría Supabase RLS.

---

**Próximo paso inmediato**: Iniciar Fase 1.1 (conectar grupos) → crear PR → revisar → merge → deploy.

#  TODO LIST - FASE 4 CONTINUACIÓN

##  PRIORIDAD CRÍTICA (Hacer primero)

### 1. Ejecutar Schema SQL en Supabase 
**Tiempo estimado**: 10 minutos
```bash
# Pasos:
1. Ir a https://supabase.com/dashboard/project/ohtgbmqpudepbavjxrek
2. Click en "SQL Editor" (lado izquierdo)
3. Click en "+ New query"
4. Copiar TODO el contenido de supabase_schema_fase4.sql
5. Pegar en el editor
6. Click en "Run" (o Ctrl+Enter)
7. Esperar confirmación de éxito
```

### 2. Ejecutar Seed Data 
**Tiempo estimado**: 5 minutos
```bash
# Pasos:
1. En el mismo SQL Editor
2. Click en "+ New query" (nueva pestaña)
3. Copiar TODO el contenido de supabase_seed_fase4.sql
4. Pegar en el editor
5. Click en "Run"
6. Verificar que se insertaron datos
```

### 3. Verificar Tablas Creadas 
**Tiempo estimado**: 2 minutos
```sql
-- Ejecutar esta query:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = ''public'' 
ORDER BY table_name;

-- Deberías ver:
-- asistencias
-- calificaciones
-- entregas
-- escuelas
-- escuelas_usuarios
-- examenes
-- grupos
-- grupos_alumnos
-- mensajes
-- preguntas
-- resultados_examenes
-- tareas
-- usuarios
```

---

##  PRIORIDAD ALTA (Hacer hoy)

### 4. Testing de GroupsPage 
**Tiempo estimado**: 10 minutos
```bash
# Pasos:
1. Ir a https://tutoriaacademy2-2.vercel.app/#/login
2. Click en "Demo Profesor" (profesor@demo.com / demo123)
3. Ir al sidebar  "Mis Grupos"
4. Verificar que aparecen 3 grupos:
    Matemáticas 1A (10 alumnos)
    Álgebra 2B (8 alumnos)
    Lengua 3C (0 alumnos si no hay estudiantes demo)
5. Verificar estadísticas:
    Número de alumnos
    Promedio general
    Tasa de asistencia
    Tareas pendientes
```

### 5. Testing de TeacherResultsPage 
**Tiempo estimado**: 10 minutos
```bash
# Pasos:
1. En el mismo login de profesor
2. Ir al sidebar  "Resultados y Analíticas"
3. Seleccionar grupo "Matemáticas 1A" en el dropdown
4. Verificar que aparece el heatmap
5. Verificar subtemas:
    Números y Operaciones - Suma y Resta
    Números y Operaciones - Multiplicación
6. Colores correctos:
    Verde oscuro: >90% (info color)
    Verde: 70-89%
    Amarillo: 50-69%
    Rojo: <50%
7. Probar selector de grupos (cambiar a Álgebra 2B)
8. Probar "Refuerzo 1-Clic"
```

### 6. Crear Usuarios Demo de Prueba (si faltan) 
**Tiempo estimado**: 5 minutos
```sql
-- Si no hay suficientes estudiantes demo, ejecutar:
INSERT INTO usuarios (email, nombre, apellidos, rol, escuela_id)
VALUES
  (''alumno1@demo.com'', ''Juan'', ''Pérez'', ''estudiante'', (SELECT escuela_id FROM usuarios WHERE email = ''profesor@demo.com'' LIMIT 1)),
  (''alumno2@demo.com'', ''María'', ''González'', ''estudiante'', (SELECT escuela_id FROM usuarios WHERE email = ''profesor@demo.com'' LIMIT 1)),
  (''alumno3@demo.com'', ''Pedro'', ''Martínez'', ''estudiante'', (SELECT escuela_id FROM usuarios WHERE email = ''profesor@demo.com'' LIMIT 1));

-- Inscribirlos en grupos:
INSERT INTO grupos_alumnos (grupo_id, alumno_id, activo)
SELECT ''a0000001-0000-0000-0000-000000000001'', id, true
FROM usuarios 
WHERE email IN (''alumno1@demo.com'', ''alumno2@demo.com'', ''alumno3@demo.com'')
ON CONFLICT DO NOTHING;
```

---

##  PRIORIDAD MEDIA (Esta semana)

### 7. Migrar TeacherDashboardPage 
**Tiempo estimado**: 2 horas
```typescript
// Tareas:
- [ ] Importar fetchTeacherKPIs de services/teacher/analytics
- [ ] Reemplazar MOCK_TEACHER_KPIS con datos reales
- [ ] Usar useQuery para cargar KPIs
- [ ] Actualizar stats:
  - Total Estudiantes  teacherKPIs.totalStudents
  - Grupos Activos  teacherKPIs.activeGroups
  - Exámenes Pendientes  teacherKPIs.pendingExams
  - Promedio General  teacherKPIs.averageScore
- [ ] Agregar loading states
- [ ] Testing
```

### 8. Actualizar TutorCopilotPage 
**Tiempo estimado**: 30 minutos
```typescript
// Tareas:
- [ ] Importar fetchTeacherGroups
- [ ] Reemplazar MOCK_TEACHER_GROUPS con datos reales
- [ ] Selector de grupos dinámico
- [ ] Testing
```

### 9. Crear services/teacher/tasks.ts 
**Tiempo estimado**: 1.5 horas
```typescript
// Funciones a crear:
- [ ] fetchTeacherTasks(profesorId, grupoId?)
- [ ] fetchTaskById(taskId)
- [ ] createTask(task)
- [ ] updateTask(taskId, updates)
- [ ] deleteTask(taskId)
- [ ] fetchTaskSubmissions(taskId)
- [ ] gradeSubmission(entregaId, calificacion, comentarios)
```

### 10. Migrar TaskManagerPage 
**Tiempo estimado**: 2 horas
```typescript
// Tareas:
- [ ] Importar servicios de tasks
- [ ] Lista de tareas desde Supabase
- [ ] Crear nueva tarea
- [ ] Editar tarea existente
- [ ] Ver entregas de alumnos
- [ ] Calificar entregas
- [ ] Testing
```

---

##  PRIORIDAD BAJA (Siguiente sprint)

### 11. Crear services/teacher/exams.ts
**Tiempo estimado**: 2 horas
```typescript
// Funciones a crear:
- [ ] fetchTeacherExams(profesorId)
- [ ] createExam(exam)
- [ ] updateExam(examId, updates)
- [ ] deleteExam(examId)
- [ ] fetchExamQuestions(examId)
- [ ] addQuestionToExam(examId, pregunta)
- [ ] fetchExamResults(examId)
```

### 12. Migrar QuestionBankPage
**Tiempo estimado**: 2 horas

### 13. Migrar TeacherExamsPage
**Tiempo estimado**: 2 horas

### 14. Crear servicios de estudiante
**Tiempo estimado**: 3 horas
```typescript
// services/student/dashboard.ts
// services/student/grades.ts
// services/student/tasks.ts
```

### 15. Configurar Gemini API
**Tiempo estimado**: 1 hora

---

##  CHECKLIST DE PROGRESO

### Fase 4 - Migración a Supabase:
- [x] Schema SQL creado 
- [x] Seed data creado 
- [x] services/teacher/groups.ts 
- [x] services/teacher/analytics.ts 
- [x] GroupsPage migrado 
- [x] TeacherResultsPage migrado 
- [x] Documentación FASE_4_IMPLEMENTACION.md 
- [ ] SQL ejecutado en Supabase  **HACER PRIMERO**
- [ ] Datos de prueba insertados  **HACER PRIMERO**
- [ ] Testing de páginas migradas  **HACER HOY**
- [ ] TeacherDashboardPage migrado
- [ ] TutorCopilotPage actualizado
- [ ] services/teacher/tasks.ts creado
- [ ] TaskManagerPage migrado
- [ ] services/teacher/exams.ts creado
- [ ] QuestionBankPage migrado
- [ ] TeacherExamsPage migrado

### Progress: 7/17 (41%) 

---

##  META DE LA FASE 4
**Objetivo**: Todas las páginas de profesor funcionando con datos reales desde Supabase

**Completado hasta ahora**:
- 2 de 8 páginas de profesor migradas (25%)
- 2 de 5 servicios teacher creados (40%)
- Schema y seed data listos (100%)

**Siguiente milestone**:
- Ejecutar SQL en Supabase 
- Testing exitoso   
- 4 de 8 páginas migradas (50%)

---

##  TIPS Y NOTAS

### Para ejecutar SQL en Supabase:
- Usa Ctrl+Enter para ejecutar
- Si hay error, revisa la pestaña "Results" para ver detalles
- Las tablas se crean en el schema "public"
- Los triggers se aplican automáticamente

### Para testing:
- Usa Chrome DevTools  Network tab para ver requests
- Console debe estar sin errores de Supabase
- React Query Devtools (si está instalado) muestra el estado de queries

### Para desarrollo:
- Usa `useQuery` para fetch de datos
- Usa `useMutation` para create/update/delete
- Siempre agregar loading y empty states
- Manejar errores con try/catch

---

**Última actualización**: Octubre 26, 2025
**Commit actual**: 9d07e44
**Próximo commit**: Después de ejecutar SQL y testing

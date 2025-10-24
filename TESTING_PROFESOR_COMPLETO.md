# 🧪 REPORTE DE TESTING COMPLETO - USUARIO PROFESOR

**Fecha:** 7 de Octubre, 2025  
**Usuario de Prueba:** Profesor Juan Martínez  
**Email:** juan.martinez@colegiotutoria.edu.mx  
**Grupos Asignados:** 4 grupos (3A-Mat, 3B-Sci, 6A-Fis, 6B-Mat)  
**XP:** 15,000 puntos  

---

## 📋 RESUMEN EJECUTIVO

Este documento detalla el testing exhaustivo de todas las funcionalidades disponibles para el rol de **Profesor** en la plataforma TutoriA Academy.

### ✅ Rutas Disponibles para Profesor

```
/docente/dashboard          → Dashboard Principal
/docente/grupos             → Mis Grupos
/docente/banco-preguntas    → Banco de Preguntas
/docente/examenes           → Gestión de Exámenes
/docente/calificaciones     → Sistema de Calificaciones
/docente/resultados         → Resultados de Alumnos
/docente/copiloto           → Copiloto IA (Tutor Copilot)
/docente/screening          → Screening de Alumnos
/docente/crear-examen-ia    → Creador de Exámenes con IA
/docente/tareas             → Gestión de Tareas
/docente/comunicacion       → Hub de Comunicación
```

---

## 🔍 TESTING POR MÓDULO

### 1️⃣ LOGIN Y AUTENTICACIÓN

#### ✅ Pruebas a Realizar:

- [ ] **Login con botón rápido "Juan Martínez"**
  - Verificar que el botón muestra: Nombre, Materias, 4 grupos, 15,000 XP
  - Hacer clic y verificar redirección a `/docente/dashboard`
  - Confirmar que el contexto de autenticación carga correctamente

- [ ] **Persistencia de Sesión**
  - Verificar que al recargar la página, la sesión persiste
  - Confirmar que el localStorage guarda correctamente el token/usuario

**Datos Esperados:**
```typescript
{
  id: "2",
  email: "juan.martinez@colegiotutoria.edu.mx",
  firstName: "Juan",
  lastName: "Martínez",
  role: "docente",
  xp: 15000,
  gradeLevel: undefined,
  schoolId: "school_tutoria_1",
  groupIds: ["3A-Mat", "3B-Sci", "6A-Fis", "6B-Mat"]
}
```

---

### 2️⃣ DASHBOARD PRINCIPAL (`/docente/dashboard`)

**Componente:** `EnhancedTeacherDashboard`

#### ✅ Elementos a Verificar:

- [ ] **Header del Dashboard**
  - Título: "Panel del Profesor"
  - Subtítulo con nombre del profesor
  - Fecha actual

- [ ] **KPIs Principales (Tarjetas Superiores)**
  - Total de Estudiantes: Debe mostrar suma de alumnos en 4 grupos
  - Promedio General: Porcentaje calculado de todos los grupos
  - Tareas Pendientes de Revisar: Contador de entregas sin calificar
  - Exámenes Próximos: Eventos en los próximos 7 días

- [ ] **Gráfica de Rendimiento por Grupo**
  - Mostrar 4 barras (una por cada grupo)
  - Colores distintivos por materia
  - Tooltips interactivos al hacer hover
  - Leyenda clara

- [ ] **Lista de Alertas Tempranas**
  - Alumnos con bajo rendimiento (<70%)
  - Estudiantes con muchas faltas
  - Tareas no entregadas repetidamente
  - Click en alerta navega a perfil del alumno

- [ ] **Accesos Rápidos**
  - Botón "Crear Tarea" → `/docente/tareas`
  - Botón "Calificar" → `/docente/calificaciones`
  - Botón "Ver Grupos" → `/docente/grupos`
  - Botón "Crear Examen" → `/docente/examenes`

- [ ] **Actividad Reciente**
  - Últimas 10 acciones del profesor
  - Timeline con íconos
  - Timestamps relativos ("hace 2 horas")

**Datos Mock a Validar:**
- `MOCK_TEACHER_KPIS`
- `MOCK_TEACHER_GROUPS`
- `MOCK_EARLY_ALERTS`

---

### 3️⃣ MIS GRUPOS (`/docente/grupos`)

**Componente:** `GroupsPage`

#### ✅ Funcionalidades:

- [ ] **Listado de 4 Grupos**
  ```
  1. 3A - Matemáticas (Secundaria, Grado 3)
  2. 3B - Ciencias (Secundaria, Grado 3)
  3. 6A - Física (Preparatoria, Grado 6)
  4. 6B - Matemáticas (Preparatoria, Grado 6)
  ```

- [ ] **Card de Cada Grupo**
  - Nombre del grupo y materia
  - Número de alumnos
  - Promedio del grupo
  - Próximo examen/tarea
  - Gráfica de distribución de calificaciones
  - Botón "Ver Detalles"

- [ ] **Vista Detallada del Grupo** (al hacer clic)
  - Lista completa de alumnos con fotos
  - Calificaciones individuales
  - Asistencia
  - Entregas de tareas
  - Botón para enviar mensaje grupal
  - Exportar lista a CSV

- [ ] **Filtros y Búsqueda**
  - Buscar alumno por nombre
  - Filtrar por rendimiento (Alto/Medio/Bajo)
  - Ordenar por nombre, calificación, asistencia

**Datos Mock:**
- `MOCK_TEACHER_GROUPS`
- Debe cargar de `schoolMockData.ts`:
  - `GROUPS_MOCK` (6 grupos, profesor tiene 4)
  - `USERS_SCHOOL_MOCK` (alumnos asignados)

---

### 4️⃣ GESTIÓN DE TAREAS (`/docente/tareas`)

**Componente:** `TaskManager`

#### ✅ Funcionalidades Core:

- [ ] **Listado de Tareas Existentes**
  - Ver 7 tareas pre-creadas en `schoolMockData.ts`
  - Tareas del profesor Juan Martínez:
    ```
    - Ecuaciones Cuadráticas (3A-Mat)
    - Movimiento Parabólico (6A-Fis)
    - Derivadas e Integrales (6B-Mat)
    ```

- [ ] **Crear Nueva Tarea**
  - Formulario con campos:
    - Título
    - Descripción (editor rich text)
    - Grupo al que se asigna (dropdown con 4 grupos)
    - Fecha límite (datepicker)
    - Puntos XP a otorgar
    - Medalla asociada (opcional)
    - Archivos adjuntos
  - Botón "Publicar Tarea"
  - Notificación de éxito

- [ ] **Editar Tarea Existente**
  - Click en ícono de editar
  - Cargar datos en formulario
  - Guardar cambios
  - Actualización en tiempo real (si Firebase está activo)

- [ ] **Eliminar Tarea**
  - Botón de eliminar con confirmación
  - Modal de advertencia
  - Eliminar y actualizar lista

- [ ] **Ver Entregas de Alumnos**
  - Click en tarea → ver entregas
  - Lista de alumnos con estado:
    - ✅ Entregada a tiempo
    - ⏰ Entregada tarde
    - ❌ No entregada
  - Ver archivo/respuesta del alumno
  - Campo para calificación numérica
  - Campo para comentarios
  - Botón "Guardar Calificación"

- [ ] **Estadísticas de Tarea**
  - Porcentaje de entrega
  - Promedio de calificaciones
  - Tiempo promedio de entrega
  - Gráfica de distribución de calificaciones

**Datos Mock:**
```typescript
TAREAS_MOCK (de schoolMockData.ts):
- 7 tareas totales
- 3 del profesor Juan
- Estados: publicada, vencida, borrador
- Entregas con archivos y calificaciones
```

---

### 5️⃣ GESTIÓN DE EXÁMENES (`/docente/examenes`)

**Componente:** `TeacherExamsPage`

#### ✅ Funcionalidades:

- [ ] **Listado de Exámenes**
  - Ver 3 exámenes en `schoolMockData.ts`:
    ```
    1. Examen Final Matemáticas - 3A (programado)
    2. Examen de Química - 6C (programado)
    3. Examen Parcial Física - 6A (completado)
    ```

- [ ] **Crear Nuevo Examen**
  - Formulario:
    - Título del examen
    - Descripción
    - Grupo (4 opciones)
    - Fecha y hora de inicio
    - Duración (minutos)
    - Total de preguntas
    - Puntos totales
    - **Medalla como Premio** (dropdown con 25+ medallas)
    - Criterio para medalla (ej: ≥ 90%)
  - Botón "Programar Examen"

- [ ] **Banco de Preguntas** (integrado)
  - Seleccionar preguntas de banco
  - Agregar nuevas preguntas
  - Tipos: opción múltiple, verdadero/falso, respuesta corta, ensayo
  - Vista previa de pregunta
  - Asignar puntos por pregunta

- [ ] **Editar Examen Programado**
  - Modificar fecha/hora
  - Agregar/quitar preguntas
  - Cambiar configuración
  - Guardar cambios

- [ ] **Ver Resultados del Examen**
  - Lista de alumnos que lo presentaron
  - Calificación individual
  - Tiempo empleado
  - Medallas desbloqueadas
  - Exportar resultados a CSV/PDF

- [ ] **Estadísticas del Examen**
  - Promedio grupal
  - Pregunta más difícil (menor % aciertos)
  - Pregunta más fácil (mayor % aciertos)
  - Distribución de calificaciones (histograma)
  - Tiempo promedio

**Datos Mock:**
```typescript
EXAMENES_MOCK:
- examen_mat_3a: Matemáticas, 20 preguntas, Medalla Newton
- examen_qui_6c: Química, 15 preguntas, Medalla Marie Curie
- examen_fis_6a: Física (completado), 18 preguntas
```

---

### 6️⃣ CALIFICACIONES (`/docente/calificaciones`)

**Componente:** `GradingInterface`

#### ✅ Funcionalidades:

- [ ] **Selector de Grupo**
  - Dropdown con 4 grupos
  - Al seleccionar, cargar alumnos

- [ ] **Tabla de Calificaciones**
  - Columnas:
    - Foto del alumno
    - Nombre completo
    - Tareas (promedio)
    - Exámenes (promedio)
    - Participación
    - Asistencia (%)
    - Promedio Final
    - Acciones
  - Ordenamiento por columna
  - Buscador de alumno

- [ ] **Captura Rápida de Calificaciones**
  - Click en celda para editar
  - Input numérico (0-100)
  - Enter para guardar
  - Validación de rango

- [ ] **Rúbricas de Evaluación**
  - Crear rúbrica personalizada
  - Criterios con niveles (Excelente, Bueno, Regular, Insuficiente)
  - Asignar rúbrica a tarea/examen
  - Evaluar con rúbrica (check boxes)

- [ ] **Comentarios por Alumno**
  - Click en "Comentarios"
  - Modal con editor de texto
  - Guardar comentarios privados
  - Enviar feedback al alumno

- [ ] **Exportación**
  - Exportar calificaciones a CSV
  - Exportar a PDF (boletas individuales)
  - Enviar reporte por email a padres

- [ ] **Estadísticas del Grupo**
  - Promedio general del grupo
  - Mediana
  - Desviación estándar
  - Alumnos destacados (top 3)
  - Alumnos en riesgo (bottom 3)
  - Gráfica de distribución

**Datos Mock a Validar:**
- Calificaciones en `USERS_SCHOOL_MOCK`
- Entregas en `TAREAS_MOCK`
- Resultados en `EXAMENES_MOCK`

---

### 7️⃣ BANCO DE PREGUNTAS (`/docente/banco-preguntas`)

**Componente:** `QuestionBankPage` con `ItemVirtualList` y `ItemEditor`

#### ✅ Funcionalidades:

- [ ] **Listado Virtual de Preguntas**
  - Scroll infinito para performance
  - Thumbnail de cada pregunta
  - Etiquetas (tags): materia, tema, dificultad
  - Búsqueda por texto
  - Filtros:
    - Materia (Matemáticas, Física, Química, Ciencias)
    - Tipo (opción múltiple, V/F, abierta)
    - Dificultad (Fácil, Media, Difícil)
    - Tema/Subtema

- [ ] **Crear Nueva Pregunta**
  - Editor rich text para enunciado
  - Soporte para fórmulas matemáticas (LaTeX)
  - Subir imágenes
  - Tipos de pregunta:
    - **Opción Múltiple:** 4 opciones, marcar correcta
    - **Verdadero/Falso:** 2 opciones
    - **Respuesta Corta:** campo de texto
    - **Ensayo:** texto largo con rúbrica
  - Asignar puntos
  - Explicación de respuesta correcta
  - Etiquetas personalizadas
  - Guardar en banco

- [ ] **Editar Pregunta**
  - Click en pregunta → abrir editor
  - Modificar cualquier campo
  - Guardar cambios
  - Historial de versiones (opcional)

- [ ] **Eliminar Pregunta**
  - Botón eliminar con confirmación
  - Verificar que no esté en examen activo
  - Eliminar y actualizar lista

- [ ] **Importar Preguntas**
  - Upload CSV/JSON con formato específico
  - Validación de estructura
  - Preview antes de importar
  - Importar y agregar al banco

- [ ] **Exportar Preguntas**
  - Seleccionar preguntas (checkboxes)
  - Exportar a CSV/JSON
  - Compartir con otros profesores

**Componentes Utilizados:**
- `ItemVirtualList` (virtualización para performance)
- `ItemEditor` (editor completo de preguntas)
- `MathMarkdown` (renderizado de LaTeX)

**Hooks:**
- `useItems()` - gestión de preguntas
- `useTopics()` - temas y subtemas

---

### 8️⃣ CREADOR DE EXÁMENES CON IA (`/docente/crear-examen-ia`)

**Componente:** `AIExamCreator`

#### ✅ Funcionalidades:

- [ ] **Configuración del Examen**
  - Tema del examen (texto libre)
  - Nivel educativo (Secundaria/Preparatoria)
  - Grado específico
  - Número de preguntas (slider 5-50)
  - Distribución de dificultad:
    - % Fácil
    - % Media
    - % Difícil
  - Tipos de preguntas (checkboxes):
    - Opción múltiple
    - Verdadero/Falso
    - Respuesta corta
    - Ensayo

- [ ] **Generación con IA**
  - Botón "Generar Examen con IA"
  - Loader mientras genera
  - Placeholder para integración con Gemini API
  - **NOTA:** Por ahora mock, ya que no hay API key

- [ ] **Preview del Examen Generado**
  - Lista de preguntas generadas
  - Vista previa de cada pregunta
  - Editar pregunta individual
  - Eliminar pregunta
  - Reordenar preguntas (drag & drop)

- [ ] **Ajustes Finales**
  - Agregar instrucciones generales
  - Establecer tiempo límite
  - Asignar grupo
  - Programar fecha
  - Asignar medalla premio
  - Guardar como borrador o publicar

**Integración Futura:**
- API de Gemini para generación automática
- Por ahora: generar preguntas mock aleatorias

---

### 9️⃣ SCREENING DE ALUMNOS (`/docente/screening`)

**Componente:** `ScreeningDashboard`

#### ✅ Funcionalidades:

- [ ] **Dashboard de Screening**
  - Resumen de alumnos evaluados
  - Distribución de niveles cognitivos
  - Alertas de alumnos en riesgo
  - Progreso de evaluaciones diagnósticas

- [ ] **Lista de Alumnos**
  - Todos los alumnos de los 4 grupos
  - Indicador de si ya hicieron screening
  - Nivel cognitivo detectado
  - Áreas de oportunidad
  - Click para ver detalle

- [ ] **Detalle Individual**
  - Perfil cognitivo del alumno
  - Gráfica de radar con 8 habilidades:
    - Memoria
    - Atención
    - Razonamiento
    - Velocidad de procesamiento
    - Comprensión lectora
    - Habilidad matemática
    - Resolución de problemas
    - Creatividad
  - Recomendaciones personalizadas
  - Plan de intervención sugerido

- [ ] **Asignar Evaluación Diagnóstica**
  - Seleccionar alumnos (checkboxes)
  - Asignar evaluación de screening
  - Fecha límite
  - Notificar a alumnos
  - Enviar

- [ ] **Exportar Reportes**
  - Reporte individual (PDF)
  - Reporte grupal comparativo
  - Exportar datos a CSV

**Datos Mock:**
- `MOCK_EARLY_ALERTS` (alumnos en riesgo)
- Resultados de screening simulados

---

### 🔟 COPILOTO IA (`/docente/copiloto`)

**Componente:** `TutorCopilotPage`

#### ✅ Funcionalidades:

- [ ] **Generar Reporte de Alumno**
  - Selector de grupo
  - Selector de alumno
  - Botón "Generar Reporte con IA"
  - Loader mientras procesa
  - Reporte generado con:
    - Resumen del desempeño
    - Fortalezas detectadas
    - Áreas de oportunidad
    - Recomendaciones pedagógicas
    - Plan de acción sugerido
  - Descargar reporte como PDF

- [ ] **Análisis de Grupo**
  - Seleccionar grupo
  - Generar análisis grupal
  - Detectar patrones:
    - Temas con mayor dificultad
    - Preguntas problemáticas
    - Alumnos que necesitan apoyo
  - Sugerencias para ajustar enseñanza

- [ ] **Predicción de Rendimiento**
  - Basado en datos históricos
  - Predecir calificación final
  - Identificar riesgo de reprobación
  - Intervención temprana

**Servicio:**
- `tutorCopilot.ts` (funciones de IA)
- Por ahora: reportes mock
- Futuro: integrar Gemini API

---

### 1️⃣1️⃣ RESULTADOS (`/docente/resultados`)

**Componente:** `TeacherResultsPage`

#### ✅ Funcionalidades:

- [ ] **Vista General de Resultados**
  - Todos los exámenes/tareas calificados
  - Filtros:
    - Por grupo
    - Por fecha
    - Por tipo (tarea/examen)
  - Ordenamiento por promedio

- [ ] **Análisis de Rendimiento**
  - Gráfica de tendencia temporal
  - Comparativa entre grupos
  - Evolución de promedios
  - Identificar mejoras/declives

- [ ] **Heatmap de Temas**
  - Visualización de qué temas domina cada grupo
  - Colores: Verde (bien), Amarillo (regular), Rojo (mal)
  - Click en celda para ver detalles
  - Detectar temas que requieren refuerzo

- [ ] **Estadísticas Comparativas**
  - Comparar rendimiento entre grupos
  - Benchmark con promedio nacional (mock)
  - Identificar grupo más destacado
  - Identificar grupo que necesita apoyo

**Datos Mock:**
- `MOCK_HEATMAP_DATA`
- `MOCK_GROUP_REPORTS`
- `MOCK_QUESTION_ANALYTICS`

---

### 1️⃣2️⃣ HUB DE COMUNICACIÓN (`/docente/comunicacion`)

**Componente:** `CommunicationHub`

#### ✅ Funcionalidades:

- [ ] **Enviar Mensaje a Grupo**
  - Selector de grupo (múltiple)
  - Editor de mensaje
  - Adjuntar archivos
  - Programar envío
  - Botón "Enviar"
  - Notificación a alumnos

- [ ] **Mensajes Individuales**
  - Buscar alumno
  - Enviar mensaje privado
  - Ver historial de conversación
  - Estado de lectura (leído/no leído)

- [ ] **Anuncios Importantes**
  - Crear anuncio
  - Publicar en dashboard de alumnos
  - Destacar (pin)
  - Fecha de expiración
  - Enviar notificación push (futuro)

- [ ] **Mensajes Recibidos**
  - Inbox de mensajes de alumnos
  - Filtrar por leído/no leído
  - Responder
  - Archivar
  - Marcar como importante

- [ ] **Notificaciones Automáticas**
  - Configurar notificaciones:
    - Tarea nueva publicada
    - Examen próximo (recordatorio)
    - Calificación disponible
    - Comentario del profesor
  - Personalizar plantillas de mensaje

---

### 1️⃣3️⃣ GIMNASIO COGNITIVO (Acceso desde menú)

**Ruta:** `/juegos` (accesible para todos los roles)

#### ✅ 8 Juegos Disponibles:

- [ ] **Memoria Visual**
  - Jugar una partida completa
  - Verificar que suma XP
  - Ver estadísticas al finalizar

- [ ] **Atención Sostenida**
  - Jugar y verificar funcionamiento
  - Timer funcionando
  - Puntuación correcta

- [ ] **Razonamiento Lógico**
  - Resolver puzzles
  - Progresión de dificultad
  - Guardado de progreso

- [ ] **Velocidad de Procesamiento**
  - Click rápido funciona
  - Mide tiempo de reacción
  - Registro de mejor tiempo

- [ ] **Comprensión Lectora**
  - Leer texto
  - Responder preguntas
  - Feedback inmediato

- [ ] **Habilidad Matemática**
  - Operaciones aritméticas
  - Ecuaciones
  - Cronómetro

- [ ] **Resolución de Problemas**
  - Escenarios complejos
  - Múltiples soluciones
  - Puntaje por eficiencia

- [ ] **Pensamiento Creativo**
  - Actividades abiertas
  - Sin respuesta única
  - Evaluación cualitativa

**Verificar:**
- Todos los juegos cargan sin errores
- Animaciones fluidas
- Sonidos (si están implementados)
- XP se suma correctamente
- Estadísticas se guardan

---

### 1️⃣4️⃣ PERFIL DE USUARIO

**Ruta:** Dropdown en navbar → "Mi Perfil"

#### ✅ Funcionalidades:

- [ ] **Ver Perfil**
  - Foto de perfil
  - Nombre completo
  - Email
  - Rol (Docente)
  - Escuela (Colegio TutoriA)
  - Materias que imparte
  - Grupos asignados
  - Total de alumnos
  - XP y nivel
  - Medallas ganadas

- [ ] **Editar Perfil**
  - Cambiar foto (upload imagen)
  - Editar nombre
  - Cambiar contraseña
  - Actualizar biografía
  - Guardar cambios
  - Notificación de éxito

- [ ] **Estadísticas Personales**
  - Total de tareas creadas
  - Total de exámenes aplicados
  - Alumnos enseñados (histórico)
  - Horas de enseñanza
  - Calificaciones otorgadas
  - Promedio de satisfacción de alumnos

- [ ] **Medallas y Logros**
  - Galería de medallas ganadas
  - Logros desbloqueados
  - Progreso hacia siguiente medalla
  - Compartir logros (redes sociales)

---

### 1️⃣5️⃣ CONFIGURACIÓN

**Ruta:** Dropdown → "Configuración"

#### ✅ Opciones:

- [ ] **Preferencias Generales**
  - Idioma (Español/Inglés)
  - Zona horaria
  - Formato de fecha
  - Formato de hora

- [ ] **Notificaciones**
  - Email notifications (toggle)
  - Push notifications (toggle)
  - Sonidos (toggle)
  - Frecuencia de resúmenes

- [ ] **Privacidad**
  - Perfil visible para alumnos
  - Permitir mensajes de alumnos
  - Mostrar estadísticas públicas

- [ ] **Tema**
  - Modo oscuro/claro
  - Color primario (selector)
  - Tamaño de fuente
  - Contraste alto (accesibilidad)

- [ ] **Seguridad**
  - Cambiar contraseña
  - Autenticación de dos factores (2FA)
  - Sesiones activas
  - Cerrar todas las sesiones

---

### 1️⃣6️⃣ NAVEGACIÓN Y UI GENERAL

#### ✅ Sidebar:

- [ ] **Logo de TutoriA**
  - Click navega a dashboard
  - Animación al pasar el mouse

- [ ] **Menú Principal**
  - Dashboard
  - Mis Grupos
  - Tareas
  - Exámenes
  - Calificaciones
  - Banco de Preguntas
  - Crear Examen IA
  - Copiloto IA
  - Screening
  - Resultados
  - Comunicación
  - Gimnasio Cognitivo

- [ ] **Cada Item del Menú:**
  - Ícono apropiado
  - Texto descriptivo
  - Highlight cuando está activo
  - Hover effect
  - Navegación correcta

- [ ] **Colapsible**
  - Botón para colapsar/expandir
  - Solo íconos cuando está colapsado
  - Animación suave
  - Estado persiste en localStorage

#### ✅ Navbar (Top Bar):

- [ ] **Breadcrumbs**
  - Ruta actual visible
  - Click en cada nivel funciona
  - Separadores claros
  - Responsive

- [ ] **Buscador Global**
  - Buscar alumnos
  - Buscar tareas
  - Buscar preguntas
  - Resultados instantáneos
  - Navigate on enter

- [ ] **Notificaciones**
  - Ícono de campana
  - Badge con contador
  - Dropdown con últimas notificaciones
  - Marcar como leída
  - Ver todas las notificaciones

- [ ] **Timer de Estudio**
  - Widget en esquina superior derecha
  - Iniciar/pausar/detener
  - Muestra tiempo transcurrido
  - Estadísticas de tiempo por día/semana

- [ ] **Perfil Dropdown**
  - Foto de perfil
  - Nombre y rol
  - Opciones:
    - Mi Perfil
    - Configuración
    - Ayuda
    - Cerrar Sesión

#### ✅ Tema Oscuro/Claro:

- [ ] **Toggle en navbar**
  - Ícono sol/luna
  - Click cambia tema
  - Transición suave (200ms)
  - Persiste en localStorage

- [ ] **Colores en Tema Claro**
  - Fondo blanco
  - Texto negro
  - Colores de acento visibles
  - Buen contraste

- [ ] **Colores en Tema Oscuro**
  - Fondo oscuro (#1a1a1a)
  - Texto blanco/gris claro
  - Colores de acento ajustados
  - Sin deslumbramiento

---

### 1️⃣7️⃣ ASISTENTE DE CHAT IA

**Componente:** `UnifiedAssistant`

#### ✅ Funcionalidades:

- [ ] **Abrir Chat**
  - Botón flotante en esquina inferior derecha
  - Ícono de mensaje
  - Badge si hay mensajes nuevos
  - Click abre panel lateral

- [ ] **Interfaz del Chat**
  - Lista de mensajes (scroll)
  - Input de texto en parte inferior
  - Botón enviar
  - Indicador "escribiendo..."
  - Avatar del asistente

- [ ] **Preguntas Contextuales**
  - Como profesor, hacer preguntas:
    - "¿Cuál es el promedio de mi grupo 3A?"
    - "¿Qué alumnos no han entregado la última tarea?"
    - "Dame estadísticas de rendimiento de María Rodríguez"
    - "¿Cómo puedo mejorar el rendimiento de mi grupo?"
    - "Genera un plan de clase para ecuaciones cuadráticas"

- [ ] **Respuestas del Asistente**
  - Respuestas coherentes y contextuales
  - Formato con markdown
  - Enlaces a secciones relevantes
  - Sugerencias de acciones
  - Uso de datos reales del sistema

- [ ] **Comandos Rápidos**
  - "/estadisticas" → muestra KPIs
  - "/grupos" → lista grupos
  - "/ayuda" → lista comandos disponibles
  - "/limpiar" → limpiar historial

- [ ] **Historial**
  - Guardar conversaciones
  - Ver conversaciones anteriores
  - Continuar conversación
  - Buscar en historial

**Integración Futura:**
- API de Gemini para respuestas reales
- Por ahora: respuestas mock inteligentes

---

### 1️⃣8️⃣ TIMER DE ESTUDIO

**Componente:** `StudyTimerWidget`

#### ✅ Funcionalidades:

- [ ] **Widget Flotante**
  - Visible en todas las páginas
  - Posición fija (top-right o bottom-right)
  - No obstruye contenido
  - Draggable (opcional)

- [ ] **Iniciar Timer**
  - Botón "Iniciar"
  - Timer comienza a contar
  - Formato HH:MM:SS
  - Animación de pulso

- [ ] **Pausar/Reanudar**
  - Botón "Pausar"
  - Timer se detiene
  - Botón cambia a "Reanudar"
  - Continúa desde donde quedó

- [ ] **Detener**
  - Botón "Detener"
  - Modal de confirmación
  - Muestra tiempo total
  - Pregunta por categoría (Calificar, Preparar clase, etc.)
  - Guarda sesión

- [ ] **Estadísticas**
  - Ver historial de sesiones
  - Total de tiempo hoy
  - Total esta semana
  - Total este mes
  - Promedio diario
  - Gráfica de tiempo por día
  - Exportar datos

- [ ] **Notificaciones**
  - Notificación cada hora (opcional)
  - Sugerencia de descanso (técnica Pomodoro)
  - Logro desbloqueado (ej: "5 horas esta semana")

**Integración:**
- `StudyTimerContext` (estado global)
- localStorage para persistencia
- Futuro: sync con Firebase

---

## 🐛 ERRORES Y PROBLEMAS A DOCUMENTAR

### Formato de Reporte:

```markdown
### Error #X - [TÍTULO DEL ERROR]

**Severidad:** 🔴 Crítico | 🟡 Moderado | 🟢 Menor

**Ubicación:** Ruta o componente afectado

**Descripción:** 
[Descripción detallada del problema]

**Pasos para Reproducir:**
1. Paso 1
2. Paso 2
3. ...

**Comportamiento Esperado:**
[Qué debería pasar]

**Comportamiento Actual:**
[Qué está pasando]

**Capturas de Pantalla:**
[Si aplica]

**Consola/Logs:**
```
[Errores de consola]
```

**Sugerencia de Solución:**
[Posible fix]

**Prioridad:** Alta | Media | Baja
```

---

## 📊 MÉTRICAS DE ÉXITO

### Testing Completo = 100%

- **Autenticación:** 2/2 pruebas (1%)
- **Dashboard:** 6/6 elementos (4%)
- **Grupos:** 4/4 funcionalidades (3%)
- **Tareas:** 7/7 funcionalidades (5%)
- **Exámenes:** 7/7 funcionalidades (5%)
- **Calificaciones:** 7/7 funcionalidades (5%)
- **Banco Preguntas:** 6/6 funcionalidades (4%)
- **Creador IA:** 4/4 funcionalidades (3%)
- **Screening:** 5/5 funcionalidades (3%)
- **Copiloto IA:** 3/3 funcionalidades (2%)
- **Resultados:** 4/4 funcionalidades (3%)
- **Comunicación:** 5/5 funcionalidades (3%)
- **Gimnasio:** 8/8 juegos (6%)
- **Perfil:** 4/4 secciones (3%)
- **Configuración:** 5/5 categorías (3%)
- **Navegación:** 10/10 elementos (7%)
- **Chat IA:** 6/6 funcionalidades (4%)
- **Timer:** 6/6 funcionalidades (4%)

**Total:** 94 pruebas individuales

---

## 🚀 SIGUIENTE PASOS DESPUÉS DEL TESTING

1. **Compilar Reporte de Errores**
   - Listar todos los bugs encontrados
   - Priorizar por severidad
   - Crear issues en GitHub (opcional)

2. **Optimizaciones**
   - Performance de carga
   - Lazy loading de componentes
   - Virtualización de listas largas
   - Optimización de imágenes

3. **Mejoras UX**
   - Feedback visual en todas las acciones
   - Mensajes de error claros
   - Loading states consistentes
   - Tooltips explicativos

4. **Integración Firebase**
   - Migrar de localStorage a Firestore
   - Implementar listeners en tiempo real
   - Configurar security rules

5. **Testing de Otros Roles**
   - Alumno Secundaria
   - Alumno Preparatoria
   - Director
   - Super Admin

---

## 📝 NOTAS FINALES

Este testing debe hacerse de forma **exhaustiva** y **metódica**. Cada funcionalidad debe probarse al menos 3 veces en diferentes escenarios.

**Ambiente de Testing:**
- ✅ Desarrollo local (npm run dev)
- ❌ Producción (no probar en prod hasta validar en dev)

**Datos:**
- ✅ Usar datos mock actuales
- ✅ No modificar datos de producción (si existieran)

**Tiempo Estimado:** 3-4 horas para testing completo exhaustivo

---

*Documento generado el 7 de Octubre, 2025*
*TutoriA Academy - Sistema Educativo Integral*

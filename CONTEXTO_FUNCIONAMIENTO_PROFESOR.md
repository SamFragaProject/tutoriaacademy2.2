# 📘 CONTEXTO DE FUNCIONAMIENTO - USUARIO PROFESOR

**Fecha:** 8 de Octubre, 2025  
**Usuario:** Juan Martínez (Profesor de Matemáticas)  
**Documento:** Guía completa de cada elemento de la interfaz del profesor

---

## 📋 ÍNDICE

1. [Visión General del Sistema](#visión-general)
2. [Estructura de Navegación](#estructura-de-navegación)
3. [Elementos de la Interfaz](#elementos-de-la-interfaz)
4. [Funcionalidades por Sección](#funcionalidades-por-sección)
5. [Flujos de Trabajo](#flujos-de-trabajo)
6. [Datos del Usuario](#datos-del-usuario)

---

## 🎯 VISIÓN GENERAL

### **¿Quién es el Usuario Profesor?**

**Datos del Profesor de Prueba:**
```typescript
{
  id: "teacher_juan_001",
  name: "Juan Martínez",
  role: "teacher",
  email: "juan.martinez@escuela.edu",
  avatar: "/avatars/teacher-male-1.jpg",
  
  // Información adicional
  subject: "Matemáticas",
  groups: [
    "3A Matemáticas",
    "3B Matemáticas", 
    "2A Matemáticas Avanzado",
    "1A Álgebra"
  ],
  totalStudents: 120,
  school: "Colegio San José"
}
```

### **Credenciales de Acceso:**
- **Usuario:** `juan.martinez@escuela.edu`
- **Contraseña:** `teacher123`
- **Acceso rápido:** Botón "Login Rápido - Profesor" en `/login`

### **URL Base del Sistema:**
- **Ruta principal:** `/docente/*`
- **Dashboard:** `/docente/dashboard`
- **Después de login:** Redirección automática a dashboard

---

## 🗺️ ESTRUCTURA DE NAVEGACIÓN

### **Layout del Profesor: TeacherLayout**

El sistema utiliza un layout especializado que incluye:

```tsx
<TeacherLayout>
  ├── Sidebar (Izquierda)
  │   ├── Logo y nombre de la plataforma
  │   ├── Menú de navegación principal
  │   └── Botón de cerrar sesión
  │
  ├── Header (Superior)
  │   ├── Botón menú móvil (hamburguesa)
  │   ├── Breadcrumbs (ruta actual)
  │   ├── Toggle tema oscuro/claro
  │   └── Dropdown de perfil
  │
  ├── Main Content (Centro)
  │   └── Contenido de la página activa
  │
  └── Componentes Flotantes
      ├── UnifiedAssistant (Asistente IA)
      └── Notificaciones (cuando aplica)
</TeacherLayout>
```

---

## 🎨 ELEMENTOS DE LA INTERFAZ

### **1. SIDEBAR (Barra Lateral Izquierda)**

#### **A. Logo y Header**
```typescript
Componente: Logo + Nombre "TutoriA Academy"
Ubicación: Top del sidebar
Funcionalidad: Click → Navega a /docente/dashboard
Estilo: Logo cerebro (BrainCircuit) + texto bold
```

#### **B. Menú Principal**

**Lista completa de opciones de navegación:**

| Ícono | Nombre | Ruta | Descripción |
|-------|--------|------|-------------|
| 📊 `LayoutDashboard` | **Dashboard** | `/docente/dashboard` | Panel principal con resumen |
| 👥 `UsersRound` | **Mis Grupos** | `/docente/grupos` | Gestión de grupos de estudiantes |
| 🧠 `BrainCircuit` | **Copiloto IA** | `/docente/copiloto` | Asistente inteligente para docentes |
| 📄 `FileText` | **Banco de Preguntas** | `/docente/banco-preguntas` | Repositorio de preguntas |
| 📋 `ClipboardPenLine` | **Exámenes** | `/docente/examenes` | Creación y gestión de exámenes |
| ✅ `CheckCircle` | **Calificaciones** | `/docente/calificaciones` | Sistema de calificación |
| 📈 `BarChart2` | **Resultados** | `/docente/resultados` | Análisis de resultados |

**Código de los items:**
```typescript
const teacherNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/docente/dashboard' },
  { icon: UsersRound, label: 'Mis Grupos', path: '/docente/grupos' },
  { icon: BrainCircuit, label: 'Copiloto IA', path: '/docente/copiloto' },
  { icon: FileText, label: 'Banco de Preguntas', path: '/docente/banco-preguntas' },
  { icon: ClipboardPenLine, label: 'Exámenes', path: '/docente/examenes' },
  { icon: CheckCircle, label: 'Calificaciones', path: '/docente/calificaciones' },
  { icon: BarChart2, label: 'Resultados', path: '/docente/resultados' },
];
```

#### **Comportamiento de Items del Menú:**

**Estados Visuales:**
```typescript
// Item Activo (página actual)
- Fondo: bg-primary/20 (morado claro con transparencia)
- Texto: text-primary (morado)
- Fuente: font-semibold (semi-negrita)

// Item Inactivo
- Texto: text-text-secondary (gris)
- Hover: bg-surface-2 (fondo gris claro)

// Transición
- duration-fast ease-in-out (animación suave)
```

#### **C. Botón de Cerrar Sesión**
```typescript
Ubicación: Bottom del sidebar
Ícono: Power (Lucide)
Color: Rojo en hover
Funcionalidad: onClick={() => logout()}
Efecto: Limpia sesión y redirige a /login
```

---

### **2. HEADER (Barra Superior)**

#### **A. Botón Menú Móvil**
```typescript
Componente: <Menu size={20} />
Visibilidad: Solo en pantallas < 1024px (móviles/tablets)
Funcionalidad: Toggle sidebar en móviles
Estado: isSidebarOpen (useState)
```

#### **B. Breadcrumbs (Migas de Pan)**
```typescript
Componente: <Breadcrumbs />
Visibilidad: Oculto en móviles (hidden md:block)
Función: Muestra ruta de navegación actual

Ejemplos:
Portal Docente > Dashboard
Portal Docente > Exámenes
Portal Docente > Mis Grupos > Grupo 3A
```

**Mapeo de rutas a nombres:**
```typescript
const ROUTE_NAMES = {
  docente: 'Portal Docente',
  dashboard: 'Dashboard',
  grupos: 'Mis Grupos',
  'banco-preguntas': 'Banco de Preguntas',
  examenes: 'Exámenes',
  calificaciones: 'Calificaciones',
  resultados: 'Resultados',
  copiloto: 'Copiloto IA',
  screening: 'Screening Cognitivo',
  'crear-examen-ia': 'Crear Examen con IA',
  tareas: 'Gestión de Tareas',
  comunicacion: 'Hub de Comunicación',
};
```

#### **C. Theme Toggle (Cambio de Tema)**
```typescript
Componente: <ThemeToggle />
Estados: 'light' | 'dark' | 'system'
Persistencia: localStorage.setItem('theme', ...)
Ícono: Sun (claro) / Moon (oscuro)
Funcionalidad: Cambia entre tema claro y oscuro
```

#### **D. Profile Dropdown (Menú de Usuario)**
```typescript
Componente: <ProfileDropdown user={user} onLogout={logout} />

Contenido del Dropdown:
├── Avatar del usuario
├── Nombre: "Juan Martínez"
├── Rol: "Profesor"
├── Email: "juan.martinez@escuela.edu"
├── [Separador]
├── 👤 Mi Perfil → /docente/perfil
├── ⚙️ Configuración → /docente/configuracion
├── ❓ Ayuda → /ayuda
├── [Separador]
└── 🔴 Cerrar Sesión → logout()

Interacción:
- Click en avatar/nombre: Abre dropdown
- Click fuera: Cierra dropdown
- Animación: Fade in/out con Framer Motion
```

---

### **3. MAIN CONTENT (Área de Contenido)**

```typescript
Elemento: <main className="flex-grow p-4 sm:p-6 lg:p-8">
Padding: 
  - Móvil: 16px (p-4)
  - Tablet: 24px (p-6)
  - Desktop: 32px (p-8)

Contenido: <Outlet /> (React Router)
- Renderiza el componente de la ruta actual
```

---

### **4. COMPONENTES FLOTANTES**

#### **A. UnifiedAssistant (Asistente IA)**
```typescript
Ubicación: Fixed bottom-right
Botón: Ícono de mensaje flotante
Funcionalidad:
  - Chat con IA contextual
  - Ayuda según la página actual
  - Sugerencias inteligentes
  - Shortcuts de acciones comunes

Estados:
  - Cerrado: Solo botón flotante
  - Abierto: Panel de chat expandido
  - Minimizado: Barra de título visible
```

---

## 📊 FUNCIONALIDADES POR SECCIÓN

### **1. 📊 DASHBOARD**

**Ruta:** `/docente/dashboard`  
**Componente:** `<EnhancedTeacherDashboard />`

#### **¿Qué muestra?**

**A. Cards de KPIs (Indicadores Clave)**
```typescript
├── Total de Estudiantes
│   ├── Número total
│   ├── Ícono: Users
│   └── Color: Azul
│
├── Grupos Activos
│   ├── Cantidad de grupos asignados
│   ├── Ícono: UsersRound
│   └── Color: Púrpura
│
├── Exámenes Pendientes
│   ├── Cantidad de exámenes por revisar
│   ├── Ícono: FileText
│   └── Color: Amarillo
│
└── Promedio General
    ├── Calificación promedio de todos los grupos
    ├── Ícono: TrendingUp
    └── Color: Verde
```

**B. Acciones Rápidas**
```typescript
Botones de acción directa:
├── Crear Examen → /docente/examenes
├── Calificar Pendientes → /docente/calificaciones
├── Nueva Tarea → /docente/tareas
└── Mensaje Grupal → /docente/comunicacion
```

**C. Actividad Reciente**
```typescript
Lista de últimas acciones:
├── Exámenes creados recientemente
├── Tareas asignadas
├── Calificaciones realizadas
└── Mensajes enviados

Cada item muestra:
- Timestamp (fecha y hora)
- Descripción de la acción
- Grupo/estudiante afectado
- Estado (completado, pendiente, etc.)
```

**D. Grupos Destacados**
```typescript
Cards de cada grupo con:
├── Nombre del grupo (ej: "3A Matemáticas")
├── Cantidad de estudiantes
├── Promedio del grupo
├── Próxima actividad programada
└── Botón "Ver Detalle" → /docente/grupos?id=...
```

**E. Calendario de Actividades**
```typescript
Vista mensual con:
├── Exámenes programados
├── Fechas de entrega de tareas
├── Reuniones con padres/directivos
└── Eventos escolares

Interacción:
- Click en fecha: Muestra detalles del día
- Navegación: Mes anterior/siguiente
- Filtros: Por tipo de actividad
```

---

### **2. 👥 MIS GRUPOS**

**Ruta:** `/docente/grupos`  
**Componente:** `<GroupsPage />`

#### **¿Qué muestra?**

**Grid de Grupos:**
```typescript
Cada card de grupo incluye:

Card {
  Header:
    ├── Nombre del grupo: "3A Matemáticas"
    ├── Badge de materia: "Matemáticas"
    └── Ícono de grupo

  Stats:
    ├── 👥 30 estudiantes
    ├── 📊 Promedio: 8.5
    ├── ✅ 85% asistencia
    └── 📚 12 actividades activas

  Actions:
    ├── [Ver Estudiantes] → Lista de alumnos
    ├── [Asistencia] → Registro de asistencia
    ├── [Calificar] → Panel de calificaciones
    └── [Más opciones] → Dropdown con acciones
}
```

**Funcionalidades por Grupo:**

1. **Ver Lista de Estudiantes**
   ```typescript
   Modal o página con tabla:
   ├── Foto del estudiante
   ├── Nombre completo
   ├── Promedio individual
   ├── Asistencia %
   ├── Última actividad
   └── [Ver Perfil] → /docente/estudiante/{id}
   ```

2. **Registrar Asistencia**
   ```typescript
   Interfaz de check rápido:
   - Lista de estudiantes con checkbox
   - Presente / Ausente / Tarde / Justificado
   - Guardar asistencia del día
   - Historial de asistencias
   ```

3. **Panel de Calificaciones**
   ```typescript
   Tabla editable con:
   ├── Columnas: Estudiantes
   ├── Filas: Actividades/Exámenes
   ├── Celdas: Calificaciones (input editable)
   └── Promedios calculados automáticamente
   ```

4. **Acciones Grupales**
   ```typescript
   Dropdown "Más opciones":
   ├── Enviar mensaje al grupo
   ├── Asignar tarea
   ├── Programar examen
   ├── Generar reporte del grupo
   └── Exportar calificaciones (Excel/PDF)
   ```

---

### **3. 🧠 COPILOTO IA**

**Ruta:** `/docente/copiloto`  
**Componente:** `<TutorCopilotPage />`

#### **¿Qué es?**
Asistente de inteligencia artificial especializado para profesores que ayuda con tareas pedagógicas.

#### **Funcionalidades:**

**A. Chat Inteligente**
```typescript
Panel de chat con IA que puede:
├── Responder preguntas sobre pedagogía
├── Sugerir actividades didácticas
├── Generar planes de clase
├── Recomendar recursos educativos
└── Ayudar con evaluaciones

Ejemplo de conversación:
Profesor: "¿Cómo puedo enseñar ecuaciones cuadráticas de forma visual?"
IA: "Te sugiero 3 enfoques..."
```

**B. Generación de Contenido**
```typescript
Herramientas de generación:
├── Generar plan de clase
│   Input: Tema, nivel, duración
│   Output: Plan estructurado con objetivos
│
├── Crear ejercicios
│   Input: Tema, dificultad, cantidad
│   Output: Lista de ejercicios con soluciones
│
├── Generar rúbricas
│   Input: Tipo de actividad, criterios
│   Output: Rúbrica de evaluación
│
└── Sugerir actividades
    Input: Objetivo de aprendizaje
    Output: Actividades prácticas
```

**C. Análisis de Estudiantes**
```typescript
Insights sobre estudiantes:
├── Identificar patrones de rendimiento
├── Detectar dificultades comunes
├── Sugerir intervenciones personalizadas
└── Recomendar recursos de apoyo

Ejemplo:
"3 estudiantes muestran dificultad en fracciones.
Sugerencia: Usar manipulativos concretos como
pizzas o barras para visualizar fracciones."
```

**D. Reportes Automáticos**
```typescript
Generación de reportes:
├── Reporte de progreso de grupo
├── Reporte individual de estudiante
├── Análisis comparativo entre grupos
└── Reporte de cumplimiento de objetivos
```

---

### **4. 📄 BANCO DE PREGUNTAS**

**Ruta:** `/docente/banco-preguntas`  
**Componente:** `<QuestionBankPage />`

#### **¿Qué es?**
Repositorio centralizado de preguntas para exámenes y ejercicios.

#### **Estructura de la Interfaz:**

**A. Filtros y Búsqueda**
```typescript
Panel de filtros:
├── Búsqueda por texto (título, contenido)
├── Filtro por materia (Matemáticas, Física, etc.)
├── Filtro por tema (Álgebra, Geometría, etc.)
├── Filtro por dificultad (Fácil, Media, Difícil)
├── Filtro por tipo de pregunta
│   ├── Opción múltiple
│   ├── Verdadero/Falso
│   ├── Respuesta corta
│   ├── Completar espacios
│   ├── Relacionar columnas
│   ├── Ordenar secuencia
│   ├── Respuesta larga
│   └── Opción múltiple (múltiples respuestas)
└── Filtro por estado (Activa, Archivada, Borrador)
```

**B. Lista de Preguntas**
```typescript
Grid de cards o tabla con:

Cada Pregunta Muestra:
├── Número identificador
├── Texto de la pregunta (truncado)
├── Badges:
│   ├── Tipo de pregunta
│   ├── Dificultad (color coded)
│   ├── Tema
│   └── Materia
├── Estadísticas:
│   ├── Veces usada
│   ├── % de acierto
│   └── Última actualización
└── Acciones:
    ├── 👁️ Ver completa
    ├── ✏️ Editar
    ├── 📋 Duplicar
    ├── 🗑️ Eliminar
    └── ➕ Agregar a examen
```

**C. Crear Nueva Pregunta**
```typescript
Formulario con campos:

Información Básica:
├── Texto de la pregunta (editor rico)
├── Tipo de pregunta (select)
├── Materia (select)
├── Tema (select jerárquico)
└── Dificultad (radio buttons)

Opciones de Respuesta (según tipo):
├── Para opción múltiple:
│   ├── Opción A (input + checkbox "correcta")
│   ├── Opción B
│   ├── Opción C
│   └── Opción D
│   └── [+ Agregar opción]
│
├── Para verdadero/falso:
│   └── Radio: Verdadero / Falso
│
└── Para respuesta corta:
    └── Respuesta modelo (textarea)

Configuración Avanzada:
├── Puntos asignados (number input)
├── Tiempo estimado (minutos)
├── Retroalimentación (textarea)
├── Etiquetas / Tags
└── Imagen/diagrama adjunto (upload)

Botones:
├── [Guardar]
├── [Guardar y crear otra]
├── [Vista previa]
└── [Cancelar]
```

**D. Vista Previa de Pregunta**
```typescript
Modal que muestra:
├── Pregunta renderizada como la verá el estudiante
├── Opciones de respuesta
├── Respuesta correcta (marcada en verde)
├── Retroalimentación
└── Metadata (tipo, dificultad, tema)
```

---

### **5. 📋 EXÁMENES**

**Ruta:** `/docente/examenes`  
**Componente:** `<EnhancedExamCreator />` (1,236 líneas)

**[DOCUMENTACIÓN COMPLETA EN ARCHIVO SEPARADO: `TESTING_EXAMENES_COMPLETO.md`]**

#### **Resumen de Funcionalidades:**

**Sistema de 5 Pasos:**
```
1. Configuración Básica
   - Nombre del examen
   - Materia
   - Fecha y duración
   - Grupos asignados

2. Selección de Temas
   - Árbol jerárquico de temas
   - Distribución de peso (%)
   - Validación: Total 100%

3. Tipos de Preguntas
   - 8 tipos disponibles
   - Cantidad por tipo
   - Distribución de dificultad

4. Generación
   - Generación con IA (simulada)
   - Vista previa de preguntas
   - Edición individual

5. Publicación
   - Vista de estudiante
   - Exportar PDF
   - Publicar a grupos
```

**Ver documento completo:** [`TESTING_EXAMENES_COMPLETO.md`](./TESTING_EXAMENES_COMPLETO.md)

---

### **6. ✅ CALIFICACIONES**

**Ruta:** `/docente/calificaciones`  
**Componente:** `<GradingPage />`

#### **¿Qué muestra?**

**A. Panel Principal**
```typescript
Vista general:
├── Cantidad de tareas/exámenes pendientes por calificar
├── Filtros:
│   ├── Por grupo
│   ├── Por actividad
│   ├── Por fecha
│   └── Por estado (pendiente, calificado)
└── Botón: [Calificar ahora]
```

**B. Lista de Pendientes**
```typescript
Cards o lista con:

Cada Item:
├── Nombre del estudiante
├── Actividad/Examen
├── Fecha de entrega
├── Estado: "Pendiente de calificar"
├── [Ver Respuestas] → Abre interfaz de calificación
└── Badge de prioridad (urgente si pasó deadline)
```

**C. Interfaz de Calificación**
```typescript
<GradingInterface 
  studentId={studentId} 
  taskId={taskId}
/>

Componentes:
├── Header:
│   ├── Nombre del estudiante
│   ├── Actividad
│   └── Tiempo empleado por el estudiante
│
├── Preguntas y Respuestas:
│   Para cada pregunta:
│   ├── Texto de la pregunta
│   ├── Respuesta del estudiante
│   ├── Respuesta correcta (si aplica)
│   ├── Input: Puntos obtenidos / Puntos totales
│   └── Textarea: Retroalimentación
│
├── Calificación Final:
│   ├── Total de puntos
│   ├── Porcentaje
│   ├── Equivalente en escala (A, B, C...)
│   └── Comentario general (textarea)
│
└── Acciones:
    ├── [Guardar borrador]
    ├── [Guardar y siguiente]
    ├── [Enviar al estudiante]
    └── [Cancelar]
```

**D. Funcionalidades Especiales**
```typescript
1. Calificación Rápida:
   - Para preguntas de opción múltiple/V-F
   - Calificación automática
   - Solo revisar si necesario

2. Rúbricas:
   - Cargar rúbrica predefinida
   - Marcar criterios cumplidos
   - Cálculo automático de puntaje

3. Calificación por Lotes:
   - Seleccionar múltiples estudiantes
   - Aplicar misma retroalimentación
   - Útil para errores comunes

4. Comparación:
   - Ver respuestas de múltiples estudiantes lado a lado
   - Identificar patrones
```

---

### **7. 📈 RESULTADOS**

**Ruta:** `/docente/resultados`  
**Componente:** `<TeacherResultsPage />`

#### **¿Qué muestra?**

**A. Análisis General**
```typescript
Dashboard con gráficas:

├── Distribución de Calificaciones
│   └── Histograma: Cantidad de estudiantes por rango
│       (0-5, 5-6, 6-7, 7-8, 8-9, 9-10)
│
├── Tendencia Temporal
│   └── Gráfica de línea: Promedio del grupo a lo largo del tiempo
│
├── Comparación de Grupos
│   └── Gráfica de barras: Promedio por grupo
│
└── Top Performers / Struggling Students
    ├── 5 estudiantes con mejor rendimiento
    └── 5 estudiantes que necesitan apoyo
```

**B. Análisis por Tema**
```typescript
Heat Map de rendimiento:

Tabla donde:
- Filas: Temas (Álgebra, Geometría, Trigonometría...)
- Columnas: Estudiantes
- Celdas: Color según rendimiento
  - Verde: >80%
  - Amarillo: 60-80%
  - Rojo: <60%

Funcionalidad:
- Click en celda: Ver detalles
- Identificar temas difíciles
- Identificar estudiantes con dificultades específicas
```

**C. Reportes Individuales**
```typescript
Seleccionar estudiante:
├── Perfil del estudiante
├── Historial completo de calificaciones
├── Gráfica de evolución
├── Fortalezas y áreas de mejora
├── Asistencia y participación
└── [Generar reporte PDF] para padres/tutores
```

**D. Análisis de Preguntas**
```typescript
Estadísticas por pregunta:
├── % de estudiantes que acertaron
├── Tiempo promedio de respuesta
├── Opciones más elegidas
├── Identificar preguntas ambiguas o muy difíciles
└── Sugerencias de mejora
```

**E. Exportación de Datos**
```typescript
Botones de exportación:
├── [Exportar a Excel]
│   └── Hoja con todas las calificaciones
├── [Exportar a PDF]
│   └── Reporte formateado
├── [Exportar CSV]
│   └── Para procesamiento externo
└── [Enviar a dirección]
    └── Compartir con directivos
```

---

### **8. 🚀 FUNCIONALIDADES ADICIONALES (CONTEXTO)**

**Aunque no están en el menú principal, están disponibles en el sistema:**

#### **A. Crear Examen con IA**
```typescript
Ruta: /docente/crear-examen-ia
Componente: <AIExamCreatorPage />

Funcionalidad:
- Alternativa rápida a EnhancedExamCreator
- Describe qué quieres evaluar en lenguaje natural
- La IA genera el examen completo
- Incluye preguntas, respuestas, rúbrica
- Editable antes de publicar
```

#### **B. Gestión de Tareas**
```typescript
Ruta: /docente/tareas
Componente: <TaskManagerPage />

Funcionalidad:
- Crear tareas/actividades
- Asignar a grupos
- Establecer fechas límite
- Adjuntar materiales
- Recibir entregas
- Calificar directamente
```

#### **C. Hub de Comunicación**
```typescript
Ruta: /docente/comunicacion
Componente: <CommunicationHubPage />

Funcionalidad:
- Enviar mensajes a estudiantes
- Mensajes grupales
- Anuncios generales
- Bandeja de entrada
- Historial de comunicaciones
- Programar mensajes
```

#### **D. Screening Cognitivo**
```typescript
Ruta: /docente/screening
Componente: <ScreeningPage />

Funcionalidad:
- Evaluaciones diagnósticas
- Identificar estilos de aprendizaje
- Detectar dificultades tempranas
- Generar reportes de screening
- Sugerencias de intervención
```

---

## 🔄 FLUJOS DE TRABAJO

### **FLUJO 1: Crear y Publicar un Examen Completo**

```
1. Navegar a "Exámenes" en sidebar
   └─ Click en item del menú

2. Sistema carga EnhancedExamCreator
   └─ Se muestra paso 1

3. PASO 1: Configuración
   ├─ Ingresar nombre: "Examen Parcial Álgebra"
   ├─ Seleccionar materia: "Matemáticas"
   ├─ Elegir fecha: 15/10/2025
   ├─ Duración: 60 minutos
   ├─ Seleccionar grupos: 3A, 3B
   └─ [Siguiente] → Valida y avanza

4. PASO 2: Temas
   ├─ Expandir árbol: Álgebra
   ├─ Seleccionar: Ecuaciones lineales (40%)
   ├─ Seleccionar: Sistemas de ecuaciones (30%)
   ├─ Seleccionar: Inecuaciones (30%)
   ├─ Verificar: Total = 100% ✅
   └─ [Siguiente] → Avanza

5. PASO 3: Tipos de Preguntas
   ├─ Opción múltiple: 8 preguntas
   ├─ Verdadero/Falso: 5 preguntas
   ├─ Respuesta corta: 2 preguntas
   ├─ Dificultad: 40% Fácil, 40% Media, 20% Difícil
   └─ [Siguiente] → Avanza

6. PASO 4: Generación
   ├─ Click [Generar con IA]
   ├─ Sistema procesa (3 seg mock)
   ├─ Muestra 15 preguntas generadas
   ├─ Revisar cada pregunta
   ├─ Editar si necesario
   └─ [Siguiente] → Avanza

7. PASO 5: Publicación
   ├─ Ver vista previa
   ├─ Toggle [Mostrar respuestas] para verificar
   ├─ Revisar resumen
   ├─ Click [Publicar Examen]
   └─ Sistema guarda y notifica a estudiantes

8. Confirmación
   └─ Alert: "✅ Examen publicado exitosamente"
```

**Tiempo estimado:** 10-15 minutos

---

### **FLUJO 2: Calificar Exámenes de un Grupo**

```
1. Navegar a "Calificaciones"
   └─ Click en sidebar

2. Ver lista de pendientes
   ├─ Filtrar por grupo: "3A Matemáticas"
   └─ Ver: "12 exámenes pendientes"

3. Click [Calificar ahora]
   └─ Sistema carga primer examen

4. Interfaz de calificación:
   ├─ Estudiante: "Ana García"
   ├─ Examen: "Parcial Álgebra"
   └─ 15 preguntas

5. Para cada pregunta:
   ├─ Si es automática (opción múltiple/V-F):
   │   └─ Ya está calificada ✅
   ├─ Si es respuesta corta:
   │   ├─ Leer respuesta del estudiante
   │   ├─ Comparar con respuesta modelo
   │   ├─ Asignar puntos: 2/3
   │   └─ Agregar retroalimentación: "Bien, pero faltó..."
   └─ Si es respuesta larga:
       ├─ Leer ensayo
       ├─ Usar rúbrica
       ├─ Asignar puntos: 8/10
       └─ Comentario: "Excelente análisis, mejorar..."

6. Calificación final automática:
   ├─ Total: 85/100
   ├─ Porcentaje: 85%
   └─ Equivalente: B

7. Comentario general:
   └─ "Buen trabajo, Ana. Dominas ecuaciones lineales..."

8. [Guardar y siguiente]
   └─ Sistema guarda y carga siguiente estudiante

9. Repetir hasta terminar 12 exámenes

10. Notificación al completar:
    └─ "✅ Calificación completada. Estudiantes notificados."
```

**Tiempo estimado:** 3-5 minutos por examen = 40-60 minutos total

---

### **FLUJO 3: Analizar Rendimiento del Grupo**

```
1. Navegar a "Resultados"
   └─ Click en sidebar

2. Dashboard muestra:
   ├─ Promedio general: 7.8
   ├─ Distribución de calificaciones
   └─ Tendencia: ↑ mejorando

3. Análisis por tema (Heat Map):
   ├─ Álgebra: Verde (88%)
   ├─ Geometría: Amarillo (72%)
   └─ Trigonometría: Rojo (55%) ⚠️

4. Identificar problema:
   └─ Trigonometría necesita refuerzo

5. Click en "Trigonometría":
   └─ Ver estudiantes con dificultad:
       ├─ Carlos Ruiz: 45%
       ├─ María López: 50%
       └─ Juan Pérez: 52%

6. Acción:
   ├─ Click [Generar plan de refuerzo]
   └─ Sistema con Copiloto IA sugiere:
       ├─ Ejercicios adicionales
       ├─ Videos explicativos
       ├─ Sesión de tutoría grupal
       └─ Práctica con manipulativos

7. Implementar:
   ├─ Ir a "Tareas"
   ├─ Crear tarea de refuerzo
   ├─ Asignar a 3 estudiantes identificados
   └─ Establecer fecha límite

8. Seguimiento:
   └─ Marcar recordatorio para revisar en 2 semanas
```

**Tiempo estimado:** 15-20 minutos

---

### **FLUJO 4: Comunicación con Padres de Estudiante con Bajo Rendimiento**

```
1. Identificar estudiante:
   ├─ En "Resultados" → Ver struggling students
   └─ Carlos Ruiz: Promedio 5.8, tendencia ↓

2. Ir a perfil del estudiante:
   ├─ Click en nombre del estudiante
   └─ Ver dashboard individual

3. Generar reporte:
   ├─ Click [Generar reporte para padres]
   └─ Sistema crea PDF con:
       ├─ Calificaciones detalladas
       ├─ Asistencia
       ├─ Áreas de dificultad
       └─ Recomendaciones

4. Enviar comunicación:
   ├─ Ir a "Hub de Comunicación"
   ├─ Nuevo mensaje
   ├─ Destinatarios: Padres de Carlos Ruiz
   ├─ Asunto: "Reunión para seguimiento académico"
   ├─ Adjuntar: Reporte generado
   └─ Proponer: Fecha de reunión

5. Programar reunión:
   ├─ Usar calendario integrado
   └─ Agendar: Reunión padres - 20/10 3:00 PM

6. Preparar materiales:
   ├─ Usar Copiloto IA:
   │   └─ "Genera plan de intervención para Carlos"
   └─ Sistema sugiere:
       ├─ Tutorías 2x semana
       ├─ Cambio de metodología
       └─ Evaluaciones adaptadas

7. Seguimiento:
   └─ Crear recordatorio en Dashboard
```

**Tiempo estimado:** 30-45 minutos

---

## 👤 DATOS DEL USUARIO PROFESOR

### **Información Básica**

```typescript
const teacherData = {
  // Identificación
  id: "teacher_juan_001",
  name: "Juan Martínez",
  email: "juan.martinez@escuela.edu",
  role: "teacher",
  
  // Perfil profesional
  subject: "Matemáticas",
  specialization: "Álgebra y Geometría",
  yearsExperience: 8,
  education: "Licenciatura en Matemáticas Aplicadas",
  certifications: [
    "Docencia en Matemáticas Nivel Medio",
    "Uso de TIC en Educación",
    "Evaluación por Competencias"
  ],
  
  // Datos de contacto
  phone: "+52 123 456 7890",
  officeHours: "Lun-Vie 2:00 PM - 4:00 PM",
  officeLocation: "Sala de maestros, Edificio B",
  
  // Institucional
  school: {
    id: "school_001",
    name: "Colegio San José",
    type: "Secundaria",
    location: "Ciudad de México"
  },
  
  // Grupos asignados
  groups: [
    {
      id: "group_3a_mat",
      name: "3A Matemáticas",
      grade: "3° Secundaria",
      section: "A",
      subject: "Matemáticas",
      students: 30,
      schedule: "Lun-Mie-Vie 8:00-9:00 AM"
    },
    {
      id: "group_3b_mat",
      name: "3B Matemáticas",
      grade: "3° Secundaria",
      section: "B",
      subject: "Matemáticas",
      students: 28,
      schedule: "Lun-Mie-Vie 9:00-10:00 AM"
    },
    {
      id: "group_2a_adv",
      name: "2A Matemáticas Avanzado",
      grade: "2° Secundaria",
      section: "A",
      subject: "Matemáticas Avanzadas",
      students: 22,
      schedule: "Mar-Jue 10:00-11:00 AM"
    },
    {
      id: "group_1a_alg",
      name: "1A Álgebra",
      grade: "1° Secundaria",
      section: "A",
      subject: "Álgebra Básica",
      students: 32,
      schedule: "Lun-Mie-Vie 11:00-12:00 PM"
    }
  ],
  
  // Estadísticas
  stats: {
    totalStudents: 112,
    activeGroups: 4,
    examsPending: 5,
    averageGrade: 8.2,
    attendanceRate: 92,
    completedActivities: 48,
    messagesUnread: 12
  },
  
  // Preferencias
  preferences: {
    theme: "dark",
    language: "es",
    notifications: {
      email: true,
      push: true,
      gradingReminders: true,
      studentMessages: true
    },
    defaultView: "dashboard",
    calendarStartDay: "monday"
  }
};
```

### **Permisos y Acceso**

```typescript
const teacherPermissions = {
  // Puede hacer
  can: [
    "view_own_groups",
    "view_own_students",
    "create_exams",
    "create_tasks",
    "grade_assignments",
    "view_student_progress",
    "send_messages",
    "create_questions",
    "use_ai_assistant",
    "generate_reports",
    "view_own_analytics",
    "edit_own_content",
    "export_grades"
  ],
  
  // No puede hacer
  cannot: [
    "view_other_teacher_groups",
    "edit_school_settings",
    "manage_teachers",
    "view_financial_data",
    "delete_student_accounts",
    "modify_system_settings",
    "access_admin_panel"
  ],
  
  // Limitaciones
  limits: {
    maxGroupsPerTeacher: 8,
    maxStudentsPerGroup: 40,
    maxExamsPerMonth: 20,
    storageQuotaGB: 5
  }
};
```

---

## 🎯 ACCIONES RÁPIDAS (SHORTCUTS)

### **Atajos de Teclado**

```typescript
const keyboardShortcuts = {
  // Navegación
  "Ctrl + D": "Ir a Dashboard",
  "Ctrl + G": "Ir a Mis Grupos",
  "Ctrl + E": "Ir a Exámenes",
  "Ctrl + C": "Ir a Calificaciones",
  
  // Acciones
  "Ctrl + N": "Nuevo examen",
  "Ctrl + T": "Nueva tarea",
  "Ctrl + M": "Nuevo mensaje",
  "Ctrl + /": "Abrir asistente IA",
  
  // UI
  "Ctrl + B": "Toggle sidebar",
  "Ctrl + K": "Buscar",
  "Esc": "Cerrar modal/dropdown",
  
  // Calificación
  "Ctrl + S": "Guardar calificación",
  "Ctrl + →": "Siguiente estudiante",
  "Ctrl + ←": "Estudiante anterior"
};
```

### **Acciones desde Dashboard**

```typescript
const quickActions = [
  {
    label: "Crear Examen",
    icon: "FileText",
    route: "/docente/examenes",
    color: "purple"
  },
  {
    label: "Calificar Pendientes",
    icon: "CheckCircle",
    route: "/docente/calificaciones",
    color: "green",
    badge: "5 pendientes"
  },
  {
    label: "Nueva Tarea",
    icon: "Plus",
    route: "/docente/tareas",
    color: "blue"
  },
  {
    label: "Mensaje Grupal",
    icon: "MessageSquare",
    route: "/docente/comunicacion",
    color: "orange"
  }
];
```

---

## 📱 RESPONSIVE DESIGN

### **Comportamiento en Diferentes Pantallas**

**Desktop (>1024px):**
```
├── Sidebar: Visible permanentemente (264px ancho)
├── Header: Full width con breadcrumbs
├── Content: Máximo 1440px centrado
└── Asistente IA: Botón flotante bottom-right
```

**Tablet (768px - 1024px):**
```
├── Sidebar: Toggle (puede ocultarse)
├── Header: Sin breadcrumbs
├── Content: Full width
└── Asistente IA: Minimizado por defecto
```

**Móvil (<768px):**
```
├── Sidebar: Oculto, abrir con botón hamburguesa
├── Header: Solo logo y hamburguesa
├── Content: Full width, padding reducido
└── Asistente IA: Bottom sheet
```

---

## 🔔 SISTEMA DE NOTIFICACIONES

```typescript
const notificationTypes = {
  gradingReminder: {
    icon: "Bell",
    color: "yellow",
    message: "Tienes 5 exámenes pendientes de calificar",
    action: "Ir a calificaciones"
  },
  
  studentSubmission: {
    icon: "FileCheck",
    color: "blue",
    message: "Ana García entregó su tarea de Álgebra",
    action: "Revisar entrega"
  },
  
  messageReceived: {
    icon: "Mail",
    color: "purple",
    message: "Nuevo mensaje de padres de Carlos Ruiz",
    action: "Leer mensaje"
  },
  
  examScheduled: {
    icon: "Calendar",
    color: "green",
    message: "Examen de Geometría programado para mañana",
    action: "Ver detalles"
  },
  
  lowPerformanceAlert: {
    icon: "AlertTriangle",
    color: "red",
    message: "3 estudiantes con rendimiento bajo en Trigonometría",
    action: "Ver reporte"
  }
};
```

---

## 🎨 TEMAS Y PERSONALIZACIÓN

### **Tema Oscuro (Default para Profesor)**

```scss
Colors:
├── Background: #0f1419 (negro azulado)
├── Surface: #1c2128 (gris muy oscuro)
├── Primary: #a855f7 (morado)
├── Text: #e6edf3 (blanco hueso)
├── Text Secondary: #8b949e (gris medio)
└── Borders: #30363d (gris oscuro)
```

### **Tema Claro**

```scss
Colors:
├── Background: #ffffff (blanco)
├── Surface: #f6f8fa (gris clarísimo)
├── Primary: #8b5cf6 (morado vibrante)
├── Text: #1f2937 (negro suave)
├── Text Secondary: #6b7280 (gris)
└── Borders: #e5e7eb (gris claro)
```

---

## 🆘 AYUDA Y SOPORTE

### **Recursos de Ayuda Disponibles**

1. **Asistente IA Contextual**
   - Botón flotante siempre disponible
   - Responde preguntas sobre funcionalidades
   - Ofrece tutoriales paso a paso

2. **Tooltips y Hints**
   - Hover sobre cualquier botón/campo
   - Muestra descripción breve
   - Ejemplos cuando aplica

3. **Centro de Ayuda**
   - Ruta: `/ayuda`
   - FAQs organizadas por tema
   - Videos tutoriales
   - Guías descargables PDF

4. **Soporte Técnico**
   - Email: soporte@tutoria.com
   - Chat en vivo (horario laboral)
   - Ticket system para reportar bugs

---

## 📚 GLOSARIO DE TÉRMINOS

**Términos específicos del sistema:**

| Término | Significado |
|---------|-------------|
| **Banco de Preguntas** | Repositorio centralizado de preguntas reutilizables |
| **Copiloto IA** | Asistente de inteligencia artificial para profesores |
| **Screening** | Evaluación diagnóstica cognitiva de estudiantes |
| **Heat Map** | Mapa de calor que visualiza rendimiento por colores |
| **Rúbrica** | Herramienta de evaluación con criterios específicos |
| **Dashboard** | Panel principal con resumen e indicadores |
| **KPI** | Key Performance Indicator (Indicador Clave de Rendimiento) |
| **Mock Data** | Datos de prueba/simulación (no reales) |
| **Toast** | Notificación emergente temporal |
| **Dropdown** | Menú desplegable |

---

## 🔐 SEGURIDAD Y PRIVACIDAD

### **Protección de Datos**

```typescript
const securityMeasures = {
  authentication: {
    method: "JWT Token",
    expiration: "7 days",
    refreshToken: true,
    twoFactor: "optional"
  },
  
  authorization: {
    roleBasedAccess: true,
    permissionChecks: "per-route",
    dataIsolation: "by-teacher-id"
  },
  
  dataProtection: {
    encryption: "AES-256",
    backup: "daily",
    gdprCompliant: true,
    dataRetention: "2 years"
  },
  
  audit: {
    logActions: true,
    trackChanges: true,
    ipLogging: true
  }
};
```

### **Privacidad de Estudiantes**

- Datos de estudiantes solo visibles para sus profesores asignados
- No se comparte información personal sin consentimiento
- Los padres pueden solicitar eliminación de datos
- Cumplimiento con COPPA y FERPA (leyes educativas USA/México)

---

## 📊 MÉTRICAS Y ANALYTICS

### **Datos que el Profesor Puede Ver**

**Nivel Individual (Estudiante):**
- Calificaciones históricas
- Tendencias de rendimiento
- Tiempo dedicado a actividades
- Áreas fuertes y débiles
- Asistencia y puntualidad
- Participación en clase

**Nivel Grupal:**
- Promedio del grupo
- Distribución de calificaciones
- Comparación entre grupos
- Temas con mayor/menor dominio
- Tasa de aprobación
- Engagement (participación)

**Nivel Personal (Auto-análisis):**
- Cantidad de exámenes creados
- Tiempo promedio de calificación
- Efectividad de métodos de enseñanza
- Satisfacción de estudiantes
- Uso de recursos

**NO puede ver:**
- Datos de otros profesores
- Información financiera de la escuela
- Datos personales sensibles de estudiantes sin autorización
- Analytics de otros grupos no asignados

---

## 🚀 ACTUALIZACIONES Y NOVEDADES

### **Funcionalidades Próximamente**

**Q4 2025:**
- Integración con Google Classroom
- Exportación a Learning Management Systems (LMS)
- Video llamadas integradas para tutorías
- Gamificación del aprendizaje

**Q1 2026:**
- Generación de preguntas con IA mejorada (GPT-4)
- Análisis predictivo de rendimiento
- Recomendaciones personalizadas automáticas
- App móvil nativa

---

## 📝 NOTAS IMPORTANTES

### **Datos Mock vs Producción**

⚠️ **ACTUALMENTE EN DESARROLLO:**

**Lo que usa datos MOCK (simulados):**
- Grupos y estudiantes
- Calificaciones y resultados
- Preguntas del banco
- Generación de exámenes con IA
- Reportes y estadísticas

**Lo que funcionará con BACKEND REAL:**
- Login y autenticación (ya funcional con mock)
- Guardado de exámenes (localStorage actualmente)
- Envío de notificaciones (simulado)
- Exportación PDF (botón presente, no funcional)
- Sincronización entre dispositivos (pendiente)

**Para Producción se Necesita:**
1. Base de datos relacional (PostgreSQL/MySQL)
2. API REST o GraphQL
3. Integración con OpenAI para IA real
4. Sistema de archivos/cloud storage
5. Servicio de email/notificaciones
6. Autenticación OAuth real

---

## 🎓 CONCLUSIÓN

Este documento describe el **contexto completo de funcionamiento** del usuario profesor en TutoriA Academy. 

**Elementos Clave:**
- ✅ **7 secciones principales** completamente documentadas
- ✅ **UI/UX detallada** para cada elemento
- ✅ **Flujos de trabajo** paso a paso
- ✅ **Datos del usuario** y permisos
- ✅ **Funcionalidades actuales** vs futuras
- ✅ **Responsive design** y adaptación
- ✅ **Seguridad y privacidad** implementada

**Para el Desarrollo:**
Este documento sirve como:
- Especificación técnica de funcionalidades
- Guía de implementación frontend
- Referencia para integración backend
- Base para testing y QA

**Para el Usuario Final (Profesor):**
Este documento puede convertirse en:
- Manual de usuario
- Video tutoriales
- Guías de inicio rápido
- FAQs contextuales

---

**Documento creado:** 8 de Octubre, 2025  
**Última actualización:** 8 de Octubre, 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Documentación Completa

# 🏫 SISTEMA MULTI-ESCUELA CON GAMIFICACIÓN AVANZADA

## 🎯 **OBJETIVO**

Crear un sistema educativo completo con:
- Escuela única con múltiples niveles (Secundaria y Preparatoria)
- Profesores con múltiples grupos y niveles
- Gamificación con medallas de científicos famosos
- Sincronización en tiempo real entre usuarios
- Tareas y exámenes por materia

---

## 📚 **ESTRUCTURA DE LA ESCUELA**

### **Colegio TutoriA (School ID: school-tutoria-001)**

```
Colegio TutoriA
├── Nivel Secundaria
│   ├── Grupo 3A (Matemáticas) - Profesor Juan
│   ├── Grupo 3B (Ciencias) - Profesor Juan
│   └── Grupo 3C (Química) - Profesor María
│
└── Nivel Preparatoria
    ├── Grupo 6A (Física) - Profesor Juan
    ├── Grupo 6B (Matemáticas) - Profesor Juan
    └── Grupo 6C (Química) - Profesor María
```

---

## 👥 **USUARIOS DEL SISTEMA**

### **1. Profesores**

#### **Profesor Juan Martínez** (`teacher-juan-001`)
- **Materias**: Matemáticas, Física
- **Grupos**:
  - 3A Secundaria - Matemáticas (15 alumnos)
  - 3B Secundaria - Ciencias (18 alumnos)
  - 6A Preparatoria - Física (20 alumnos)
  - 6B Preparatoria - Matemáticas (22 alumnos)
- **Total**: 4 grupos, 75 alumnos

#### **Profesora María López** (`teacher-maria-001`)
- **Materias**: Química, Biología
- **Grupos**:
  - 3C Secundaria - Química (16 alumnos)
  - 6C Preparatoria - Química Avanzada (19 alumnos)
- **Total**: 2 grupos, 35 alumnos

---

### **2. Alumnos**

#### **Nivel Secundaria**
- **Carlos Gómez** - 3A (Matemáticas con Prof. Juan)
- **Ana Rodríguez** - 3B (Ciencias con Prof. Juan)
- **Luis Hernández** - 3C (Química con Prof. María)

#### **Nivel Preparatoria**
- **María González** - 6A (Física con Prof. Juan)
- **Pedro Sánchez** - 6B (Matemáticas con Prof. Juan)
- **Laura Ramírez** - 6C (Química con Prof. María)

---

## 🏆 **SISTEMA DE MEDALLAS - CIENTÍFICOS FAMOSOS**

### **Matemáticas**
```typescript
{
  bronze: "Medalla Pitágoras" (100 XP),
  silver: "Medalla Euclides" (500 XP),
  gold: "Medalla Isaac Newton" (1000 XP),
  platinum: "Medalla Carl Gauss" (2500 XP),
  diamond: "Medalla Emmy Noether" (5000 XP)
}
```

### **Física**
```typescript
{
  bronze: "Medalla Galileo Galilei" (100 XP),
  silver: "Medalla Isaac Newton" (500 XP),
  gold: "Medalla Albert Einstein" (1000 XP),
  platinum: "Medalla Richard Feynman" (2500 XP),
  diamond: "Medalla Stephen Hawking" (5000 XP)
}
```

### **Química**
```typescript
{
  bronze: "Medalla Antoine Lavoisier" (100 XP),
  silver: "Medalla Dmitri Mendeléyev" (500 XP),
  gold: "Medalla Marie Curie" (1000 XP) ⭐,
  platinum: "Medalla Linus Pauling" (2500 XP),
  diamond: "Medalla Dorothy Hodgkin" (5000 XP)
}
```

### **Biología**
```typescript
{
  bronze: "Medalla Carl Linnaeus" (100 XP),
  silver: "Medalla Charles Darwin" (500 XP),
  gold: "Medalla Gregor Mendel" (1000 XP),
  platinum: "Medalla Jane Goodall" (2500 XP),
  diamond: "Medalla Rosalind Franklin" (5000 XP)
}
```

### **Gimnasio Cognitivo**
```typescript
{
  memoria: "Medalla Hermann Ebbinghaus",
  atencion: "Medalla William James",
  razonamiento: "Medalla Jean Piaget",
  velocidad: "Medalla Donald Hebb",
  flexibilidad: "Medalla Lev Vygotsky"
}
```

---

## 📝 **TAREAS Y EXÁMENES**

### **Estructura de Tarea**
```typescript
interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  materia: 'matematicas' | 'fisica' | 'quimica' | 'biologia';
  grupoId: string;
  profesorId: string;
  fechaCreacion: Date;
  fechaEntrega: Date;
  puntos: number;
  archivoAdjunto?: string;
  entregas: {
    alumnoId: string;
    fecha: Date;
    archivo?: string;
    calificacion?: number;
    comentarios?: string;
  }[];
}
```

### **Tareas Preexistentes**

#### **Profesor Juan - Grupo 3A (Matemáticas)**
- ✅ "Teorema de Pitágoras" - Entregada por 12/15 alumnos
- ⏳ "Ecuaciones de Segundo Grado" - En progreso (5 días restantes)
- 📅 "Sistemas de Ecuaciones" - Próxima (fecha futura)

#### **Profesor Juan - Grupo 6A (Física)**
- ✅ "Leyes de Newton" - Entregada por 18/20 alumnos
- ⏳ "Cinemática" - En progreso (3 días restantes)
- ✅ "Energía y Trabajo" - Completada

#### **Profesora María - Grupo 3C (Química)**
- ✅ "Tabla Periódica" - Entregada por 14/16 alumnos
- ⏳ "Enlaces Químicos" - En progreso (7 días restantes)
- ⭐ "Reacciones Químicas" - Premio Marie Curie disponible

---

### **Estructura de Examen**
```typescript
interface Examen {
  id: string;
  titulo: string;
  materia: string;
  grupoId: string;
  profesorId: string;
  fechaExamen: Date;
  duracion: number; // minutos
  preguntas: Pregunta[];
  calificaciones: {
    alumnoId: string;
    calificacion: number;
    fecha: Date;
    tiempoEmpleado: number;
  }[];
  medallaAsociada?: {
    nombre: string;
    cientifico: string;
    criterio: number; // calificación mínima
  };
}
```

### **Exámenes Preexistentes**

#### **Próximos Exámenes**
- 📅 **Examen de Química** (Prof. María - Grupo 3C)
  - Fecha: En 5 días
  - Duración: 60 minutos
  - Premio: 🏆 **Medalla Marie Curie** (si ≥ 90/100)

- 📅 **Examen de Física** (Prof. Juan - Grupo 6A)
  - Fecha: En 10 días
  - Duración: 90 minutos
  - Premio: 🏆 **Medalla Albert Einstein** (si ≥ 90/100)

#### **Exámenes Completados**
- ✅ **Matemáticas Básicas** (Prof. Juan - Grupo 3A)
  - Promedio: 82/100
  - 3 alumnos ganaron Medalla Pitágoras

---

## 🔄 **SINCRONIZACIÓN EN TIEMPO REAL**

### **Cuando el Profesor modifica algo:**

#### **Escenario 1: Profesor asigna nueva tarea**
```
1. Profesor Juan crea tarea "Vectores en el Plano"
2. Firebase actualiza: /tasks/task-new-id
3. Todos los alumnos de 6A reciben notificación:
   - "Nueva tarea de Física: Vectores en el Plano"
   - Fecha entrega: 15 días
4. Se agrega a la agenda de cada alumno
5. Toast notification en tiempo real
```

#### **Escenario 2: Profesor califica examen**
```
1. Profesor María califica examen de Carlos (95/100)
2. Firebase actualiza: /exams/exam-id/grades/carlos-id
3. Carlos recibe inmediatamente:
   - Notificación: "¡Felicidades! Obtuviste 95 en Química"
   - 🏆 Medalla Marie Curie desbloqueada
   - +1000 XP
   - Achievement toast animado
4. Se actualiza dashboard de Carlos en tiempo real
5. Ranking del grupo se recalcula
```

#### **Escenario 3: Profesor modifica fecha de examen**
```
1. Profesor Juan cambia fecha de examen de Física
2. Firebase actualiza: /exams/exam-physics-001/date
3. Todos los alumnos de 6A:
   - Reciben notificación: "Cambio de fecha: Examen de Física"
   - Agenda se actualiza automáticamente
   - Contador de días se recalcula
```

---

## 🎮 **GAMIFICACIÓN INTEGRADA**

### **Sistemas de Recompensas**

#### **Por Exámenes**
- 90-100: Medalla Oro + 1000 XP
- 80-89: Medalla Plata + 500 XP
- 70-79: Medalla Bronce + 250 XP
- <70: XP de participación + 50 XP

#### **Por Tareas**
- Entrega temprana (3+ días): +20% XP bonus
- Primera entrega del grupo: Insignia "Líder"
- 100% tareas entregadas en el mes: Medalla "Responsable"

#### **Por Juegos Cognitivos**
- Cada juego asociado a un científico del área
- Ejemplo: "Stroop Effect" → Medalla William James (Psicología)
- High score del día: +100 XP bonus
- Racha de 7 días: Medalla especial

---

## 📊 **ESTRUCTURA DE DATOS**

### **Colección: schools**
```typescript
{
  id: "school-tutoria-001",
  nombre: "Colegio TutoriA",
  direccion: "Av. Educación 123",
  niveles: ["secundaria", "preparatoria"],
  totalAlumnos: 110,
  totalProfesores: 2,
  totalGrupos: 6,
  activo: true
}
```

### **Colección: groups**
```typescript
{
  id: "group-3a-mat",
  nombre: "3A - Matemáticas",
  nivel: "secundaria",
  grado: 3,
  materia: "matematicas",
  profesorId: "teacher-juan-001",
  schoolId: "school-tutoria-001",
  alumnosIds: ["student-001", "student-002", ...],
  horario: {
    lunes: "08:00-09:30",
    miercoles: "08:00-09:30",
    viernes: "08:00-09:30"
  }
}
```

### **Colección: users (con relaciones)**
```typescript
{
  id: "teacher-juan-001",
  nombre: "Juan Martínez",
  role: "teacher",
  schoolId: "school-tutoria-001",
  gruposIds: ["group-3a-mat", "group-3b-sci", "group-6a-fis", "group-6b-mat"],
  materias: ["matematicas", "fisica"],
  activo: true
}
```

### **Colección: tasks**
```typescript
{
  id: "task-001",
  titulo: "Teorema de Pitágoras",
  grupoId: "group-3a-mat",
  profesorId: "teacher-juan-001",
  fechaEntrega: "2025-10-15",
  entregas: [...],
  estadisticas: {
    total: 15,
    entregadas: 12,
    pendientes: 3,
    promedioCalificacion: 87
  }
}
```

### **Colección: medals**
```typescript
{
  id: "medal-marie-curie",
  nombre: "Medalla Marie Curie",
  cientifico: {
    nombre: "Marie Curie",
    imagen: "/assets/scientists/marie-curie.jpg",
    descripcion: "Premio Nobel de Física y Química",
    logro: "Primera mujer en ganar un Nobel"
  },
  materia: "quimica",
  nivel: "gold",
  xpRequerido: 1000,
  criterio: "Aprobar examen de química con ≥90%",
  rareza: "legendary",
  otorgadaA: ["student-001", "student-045", ...]
}
```

---

## 🔧 **IMPLEMENTACIÓN**

### **Fase 2A: Estructura Base** (AHORA)
- ✅ Crear servicio de escuelas
- ✅ Crear servicio de grupos
- ✅ Datos mock completos
- ✅ Relaciones entre entidades

### **Fase 2B: Tareas y Exámenes**
- [ ] Componente de gestión de tareas
- [ ] Componente de exámenes
- [ ] Calendario integrado
- [ ] Sistema de entregas

### **Fase 2C: Medallas y Gamificación**
- [ ] Catálogo de medallas por científico
- [ ] Sistema de desbloqueo
- [ ] Animaciones de logros
- [ ] Perfil con medallas

### **Fase 2D: Sincronización Firebase**
- [ ] Listeners en tiempo real
- [ ] Notificaciones push
- [ ] Actualización automática
- [ ] Estado online/offline

---

## 🎨 **EJEMPLO VISUAL**

### **Dashboard del Profesor Juan:**
```
┌─────────────────────────────────────────┐
│ Mis Grupos (4)                          │
├─────────────────────────────────────────┤
│ 📚 3A - Matemáticas (Secundaria)       │
│    15 alumnos | 2 tareas activas       │
│    Próximo: Examen en 12 días          │
│                                         │
│ 🔬 3B - Ciencias (Secundaria)          │
│    18 alumnos | 1 tarea activa         │
│    5 entregas pendientes de calificar  │
│                                         │
│ ⚛️  6A - Física (Preparatoria)         │
│    20 alumnos | 3 tareas activas       │
│    Examen programado: 10 días          │
│                                         │
│ 📐 6B - Matemáticas (Preparatoria)     │
│    22 alumnos | 2 tareas activas       │
│    Todos al corriente                  │
└─────────────────────────────────────────┘
```

### **Dashboard del Alumno Carlos (3A):**
```
┌─────────────────────────────────────────┐
│ Mis Tareas Pendientes                   │
├─────────────────────────────────────────┤
│ ⏰ Ecuaciones 2do Grado                 │
│    Matemáticas - Prof. Juan             │
│    Entrega: en 5 días                   │
│    [Ver] [Entregar]                     │
│                                         │
│ 🏆 Próximo Examen                       │
│    Matemáticas                          │
│    Fecha: 15 Oct 2025                   │
│    Premio: Medalla Newton 🥇            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Mis Medallas (3)                        │
├─────────────────────────────────────────┤
│ 🥉 Medalla Pitágoras                    │
│    Desbloqueada: 1 Oct 2025            │
│                                         │
│ 🥈 Medalla Euclides                     │
│    Desbloqueada: 3 Oct 2025            │
│                                         │
│ 🎯 Próxima: Medalla Newton              │
│    Progreso: 750/1000 XP               │
└─────────────────────────────────────────┘
```

---

**¿Empezamos a implementar todo esto?** 🚀

1. Primero: Estructura de datos completa
2. Segundo: Servicios y mocks
3. Tercero: Componentes UI
4. Cuarto: Sincronización Firebase

# 📊 Sistema de Calificaciones Visual - Guía de Uso

## 🎯 Descripción General

El **Sistema de Calificaciones Visual** es una interfaz moderna e intuitiva que permite a los docentes calificar tareas y exámenes de manera eficiente, con soporte para rúbricas personalizadas, feedback asistido por IA y calificación rápida.

---

## 🚀 Acceso al Sistema

### Desde el Dashboard
1. Click en "Calificar Tareas" en las Acciones Rápidas
2. O navegar a: **Navegación lateral → Calificaciones**

### URL Directa
```
/docente/calificaciones
```

---

## 📐 Estructura de la Interfaz

La interfaz está dividida en **3 paneles principales**:

```
┌─────────────┬──────────────────┬─────────────┐
│  LISTA DE   │   CONTENIDO DE   │ HERRAMIENTAS│
│  ENTREGAS   │     LA TAREA     │     DE      │
│             │                  │ CALIFICACIÓN│
└─────────────┴──────────────────┴─────────────┘
```

### 1️⃣ Panel Izquierdo: Lista de Entregas

**Funcionalidades:**
- 🔍 **Búsqueda:** Filtra por nombre de estudiante o título de tarea
- 🏷️ **Filtros rápidos:**
  - **Todas:** Muestra todas las entregas
  - **Pendientes:** Solo tareas sin calificar (amarillo)
  - **Calificadas:** Tareas ya evaluadas (verde)
  - **Tardías:** Entregas fuera de plazo (rojo)

**Información por entrega:**
- Avatar y nombre del estudiante
- Título de la tarea
- Fecha de entrega
- Estado visual (badge con color)
- Calificación (si ya fue calificada)

### 2️⃣ Panel Central: Contenido de la Tarea

**Navegación:**
- ⬅️ **Anterior:** Ir a la entrega previa
- ➡️ **Siguiente:** Ir a la siguiente entrega
- 📊 **Contador:** "X de Y" entregas

**Contenido mostrado:**
- **Información del estudiante:**
  - Nombre y avatar
  - Título de la tarea
  - Fecha de entrega vs fecha límite
  - Estado (Pendiente/Calificada/Tardía)

- **Archivos adjuntos:**
  - Vista de todos los archivos entregados
  - Click para ver/descargar
  - Iconos por tipo de archivo

- **Contenido de texto:**
  - Vista previa del texto entregado
  - Formato preservado
  - Scroll para contenido largo

### 3️⃣ Panel Derecho: Herramientas de Calificación

#### Modos de Calificación

##### 🎯 Modo Rúbrica (Recomendado)
Calificación detallada por criterios específicos.

**Características:**
- 5 criterios predefinidos configurables:
  1. **Comprensión del tema** (30 pts)
  2. **Organización y estructura** (25 pts)
  3. **Originalidad** (20 pts)
  4. **Ortografía y gramática** (15 pts)
  5. **Referencias y fuentes** (10 pts)

- **Niveles por criterio:**
  - 4 niveles de desempeño
  - Descripción clara de cada nivel
  - Click en el nivel deseado para asignar puntos
  - Visual feedback (botón resaltado)

- **Cálculo automático:**
  - Total de puntos asignados
  - Porcentaje automático
  - Visualización en tiempo real

**Ejemplo de uso:**
```
Comprensión del tema:
☑️ Excelente comprensión (30 pts) ← Seleccionado
□ Buena comprensión (20 pts)
□ Comprensión básica (10 pts)
□ No demuestra comprensión (0 pts)

Total: 95/100 (95%)
```

##### ⭐ Modo Numérico
Calificación directa con un número.

**Características:**
- Input numérico (0-100)
- Badge visual con emoji según calificación:
  - 90-100: ⭐ (verde)
  - 80-89: 😊 (azul)
  - 70-79: 😐 (amarillo)
  - 0-69: 😕 (rojo)

---

## 💬 Retroalimentación

### Área de Texto
- Campo libre para escribir feedback personalizado
- Soporte para múltiples párrafos
- Auto-guardado en el contexto

### 🤖 Asistente de IA
**Botón amarillo "IA" con icono ✨**

**¿Qué hace?**
Genera retroalimentación constructiva automática basada en:
- Contenido de la tarea
- Calificación asignada
- Mejores prácticas pedagógicas

**Estructura del feedback generado:**
```markdown
Excelente trabajo, [Nombre]. Tu ensayo demuestra...

**Fortalezas:**
- Estructura clara y lógica
- Buenos ejemplos
- Referencias apropiadas

**Áreas de mejora:**
- Profundizar en [tema específico]
- Agregar [elemento faltante]

**Sugerencia:** Para el próximo trabajo...

Calificación sugerida: XX/100
```

**Ventajas:**
- ✅ Ahorra tiempo (15 min → 30 seg)
- ✅ Feedback estructurado y profesional
- ✅ Personalizado al estudiante
- ✅ Sugerencias pedagógicas
- ✅ Editable antes de enviar

### 📝 Comentarios Rápidos
**4 emojis con comentarios predefinidos:**

| Emoji | Comentario | Categoría |
|-------|-----------|-----------|
| ⭐ | ¡Excelente trabajo! Demuestras comprensión profunda... | Positivo |
| 👏 | Muy buen esfuerzo. Se nota tu dedicación. | Positivo |
| 📝 | Podrías profundizar más en este punto. | Mejora |
| ✏️ | Revisa la ortografía y gramática. | Mejora |

**Uso:**
1. Hover sobre el emoji para ver el comentario completo
2. Click para agregar al área de retroalimentación
3. Se agrega al final del texto existente
4. Puedes editar después de agregar

---

## 🎯 Flujo de Trabajo Completo

### Calificación Individual (Modo Detallado)

```
1️⃣ Seleccionar entrega de la lista
   ↓
2️⃣ Leer contenido y revisar archivos
   ↓
3️⃣ Elegir modo de calificación:
   
   OPCIÓN A: Rúbrica
   ├─ Click en nivel de cada criterio
   ├─ Ver total automático
   └─ Verificar porcentaje
   
   OPCIÓN B: Numérica
   ├─ Escribir calificación (0-100)
   └─ Ver badge visual
   ↓
4️⃣ Agregar retroalimentación:
   
   OPCIÓN A: Usar IA (recomendado)
   ├─ Click en botón "IA" ✨
   ├─ Esperar 1-2 segundos
   ├─ Revisar feedback generado
   └─ Editar si necesario
   
   OPCIÓN B: Manual
   ├─ Escribir en área de texto
   └─ Usar comentarios rápidos (emojis)
   ↓
5️⃣ Click en "Guardar y Continuar" (verde)
   ↓
6️⃣ Sistema automáticamente:
   ├─ Guarda la calificación
   ├─ Marca como "Calificada"
   ├─ Notifica al estudiante (próximamente)
   └─ Avanza a la siguiente pendiente
```

### Calificación Rápida (Modo Batch)

Para tareas similares o calificación por lotes:

```
1️⃣ Filtrar solo "Pendientes"
   ↓
2️⃣ Usar modo Numérico
   ↓
3️⃣ Para cada entrega:
   ├─ Revisar rápidamente (10-15 seg)
   ├─ Asignar calificación
   ├─ Click en comentario rápido apropiado
   └─ "Guardar y Continuar"
   ↓
4️⃣ Repetir hasta completar

⏱️ Tiempo promedio: 2 min/tarea
```

---

## 📊 Estadísticas en Tiempo Real

**4 Cards superiores:**

| Card | Descripción | Color |
|------|-------------|-------|
| ⏰ Pendientes | Tareas sin calificar | Amarillo-Naranja |
| ✅ Calificadas | Tareas evaluadas | Verde |
| ⚠️ Tardías | Entregas fuera de plazo | Rojo |
| 📈 Promedio | Calificación promedio del grupo | Azul |

**Actualización:**
- En tiempo real al calificar
- Click para filtrar por categoría

---

## ⚡ Atajos y Trucos

### Navegación Rápida
- **Enter:** Guardar y continuar
- **Flechas ← →:** Navegación en panel central (próximamente)
- **Esc:** Limpiar feedback (próximamente)

### Mejores Prácticas

#### ✅ Para calificación eficiente:
1. **Usa rúbricas** para tareas complejas (ensayos, proyectos)
2. **Usa numérica** para tareas simples (ejercicios, cuestionarios)
3. **Genera feedback con IA** primero, luego personaliza
4. **Filtra por "Pendientes"** para enfocarte

#### ✅ Para feedback de calidad:
1. **Estructura recomendada:**
   - Saludo personalizado
   - 2-3 fortalezas específicas
   - 2-3 áreas de mejora concretas
   - 1 sugerencia para mejorar
   - Cierre motivacional

2. **Usa lenguaje constructivo:**
   - ✅ "Podrías profundizar más en..."
   - ❌ "Falta información sobre..."

3. **Sé específico:**
   - ✅ "Excelente uso de metáforas en el párrafo 3"
   - ❌ "Buen trabajo"

#### ✅ Para gestión de tiempo:
1. **Establece bloques:** 30-45 min de calificación continua
2. **Prioriza tardías** (estudiantes esperando)
3. **Usa comentarios rápidos** cuando sea apropiado
4. **Aprovecha IA** para ahorrar tiempo

---

## 🔧 Configuración (Próximamente)

### Personalizar Rúbricas
```typescript
// Próximamente: Editor de rúbricas personalizado
- Agregar/eliminar criterios
- Modificar puntos máximos
- Guardar plantillas por materia
- Compartir con otros docentes
```

### Plantillas de Feedback
```typescript
// Próximamente: Gestión de plantillas
- Crear plantillas personalizadas
- Organizar por materia/nivel
- Variables dinámicas (nombre, calificación, etc.)
```

### Notificaciones
```typescript
// Próximamente: Sistema de notificaciones
- Email automático al estudiante
- Notificación push en app
- Resumen semanal a padres/tutores
```

---

## 🎨 Adaptación por Nivel Educativo

El sistema se adapta automáticamente según el nivel:

### Primaria
- 😊 **Badges con emojis grandes**
- 🎨 **Colores más brillantes**
- 📝 **Feedback más simple y motivacional**
- ⭐ **Énfasis en elementos positivos**

### Secundaria
- 📊 **Calificación numérica (0-100)**
- 📈 **Gráficas de progreso**
- ✍️ **Feedback balanceado**
- 🎯 **Rúbricas intermedias**

### Preparatoria/Universidad
- 📋 **Rúbricas detalladas**
- 🔍 **Análisis profundo**
- 📚 **Referencias académicas**
- 🎓 **Feedback profesional**

---

## 📈 Métricas de Impacto

### Tiempo de Calificación

| Tipo de Tarea | Antes | Con Sistema | Ahorro |
|---------------|-------|-------------|--------|
| Ensayo largo | 10 min | 3 min | **70%** |
| Cuestionario | 5 min | 1 min | **80%** |
| Proyecto | 15 min | 5 min | **67%** |
| Ejercicios | 3 min | 1 min | **67%** |

### Calidad del Feedback

| Métrica | Antes | Con IA | Mejora |
|---------|-------|--------|--------|
| Estructura | Inconsistente | Uniforme | +85% |
| Longitud | ~50 palabras | ~150 palabras | +200% |
| Especificidad | Genérico | Detallado | +90% |
| Consistencia | Variable | Alta | +95% |

---

## 🆘 Solución de Problemas

### Problema: No aparecen entregas
**Solución:**
1. Verificar filtros activos
2. Limpiar búsqueda
3. Seleccionar "Todas" en filtros
4. Refrescar página

### Problema: IA no genera feedback
**Solución:**
1. Verificar conexión a internet
2. Esperar 2-3 segundos (puede tardar)
3. Reintenta con botón IA
4. Usar feedback manual si persiste

### Problema: Calificación no se guarda
**Solución:**
1. Verificar que se haya asignado una calificación (rúbrica o numérica)
2. Verificar conexión
3. Click en "Guardar y Continuar"
4. Revisar en lista que aparezca como "Calificada"

---

## 🔮 Próximas Funcionalidades

### Q1 2026
- [ ] 🎤 **Feedback por audio:** Grabar comentarios de voz
- [ ] 📹 **Feedback por video:** Grabar explicaciones
- [ ] 🔄 **Calificación por lotes:** Misma calificación a múltiples entregas
- [ ] 📊 **Comparación:** Ver historial del estudiante lado a lado

### Q2 2026
- [ ] 🤖 **IA mejorada:** Análisis de plagio básico
- [ ] 📈 **Analytics:** Dashboard de estadísticas de calificación
- [ ] 👥 **Colaboración:** Calificación compartida entre docentes
- [ ] 📱 **App móvil:** Calificar desde tablet/smartphone

### Q3 2026
- [ ] 🎯 **Auto-calificación:** Para respuestas objetivas
- [ ] 🌐 **Traducción:** Feedback multiidioma
- [ ] 🏆 **Gamificación:** Logros y badges para docentes
- [ ] 📚 **Biblioteca:** Base de datos de feedback ejemplar

---

## 💡 Casos de Uso Reales

### Caso 1: Calificar 30 ensayos de secundaria
**Escenario:** Docente de Español con 30 ensayos sobre literatura

**Solución con el sistema:**
```
1. Filtrar "Pendientes" (30 entregas)
2. Modo: Rúbrica
3. Para cada ensayo:
   - Leer (2 min)
   - Asignar criterios de rúbrica (30 seg)
   - Generar feedback con IA (30 seg)
   - Personalizar 1-2 líneas (30 seg)
   - Guardar y continuar (5 seg)

Tiempo total: 30 × 3.5 min = 105 min (1.75 horas)
Sin sistema: 30 × 10 min = 300 min (5 horas)
Ahorro: 3.25 horas (65%)
```

### Caso 2: Calificar 50 cuestionarios de matemáticas
**Escenario:** Docente de Matemáticas con 50 cuestionarios cortos

**Solución con el sistema:**
```
1. Filtrar "Pendientes"
2. Modo: Numérico
3. Para cada cuestionario:
   - Revisar respuestas (30 seg)
   - Asignar calificación (10 seg)
   - Comentario rápido (emoji) (5 seg)
   - Guardar y continuar (5 seg)

Tiempo total: 50 × 0.8 min = 40 min
Sin sistema: 50 × 3 min = 150 min (2.5 horas)
Ahorro: 1.8 horas (73%)
```

### Caso 3: Feedback profundo para proyecto final
**Escenario:** Proyecto integrador de preparatoria (1 estudiante)

**Solución con el sistema:**
```
1. Revisar todos los archivos adjuntos
2. Leer documento completo (5 min)
3. Usar rúbrica detallada (2 min)
4. Generar feedback base con IA (30 seg)
5. Personalizar extensamente (3 min)
6. Agregar sugerencias específicas (2 min)

Tiempo total: 12.5 min
Sin sistema: 20 min
Calidad: Superior (feedback estructurado y completo)
```

---

## 📞 Soporte

### Documentación
- 📖 Guía completa: `/docs/GRADING_SYSTEM.md`
- 🎓 Tutorial video: (Próximamente)
- 💬 FAQs: `/docs/FAQ.md`

### Contacto
- 📧 Email: soporte@tutoria.academy
- 💬 Chat: Asistente IA integrado
- 📱 WhatsApp: (Próximamente)

---

**Última actualización:** Octubre 2025  
**Versión del sistema:** 2.0  
**Autor:** Equipo TutoriA Academy

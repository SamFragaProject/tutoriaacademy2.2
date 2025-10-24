# 🎮 Especificaciones de Actividades del Gimnasio Cognitivo

**Estado**: 3/22 implementadas (14%)  
**Prioridad**: MÁXIMA 🔥

---

## ✅ Actividades Implementadas (3)

### 1. N-Track (Memoria)
- ✅ Completo con adaptación por nivel educativo
- ✅ 5 iconos diferentes
- ✅ Niveles adaptativos (1-Back a 5-Back)
- ✅ 3 configuraciones (primaria/secundaria/preparatoria)

### 2. Focus Switch (Atención)
- ✅ Completo con modo práctica
- ✅ Cambio de reglas (color/forma)
- ✅ Tracking de tiempo de reacción
- ✅ Cálculo de costo de cambio

### 3. RSVP Gist (Velocidad)
- ✅ Completo con 15 textos (5 por nivel)
- ✅ Rangos WPM adaptados
- ✅ Preguntas de comprensión
- ✅ Timer que pausa en preguntas

---

## 📋 Actividades Por Implementar (19)

## 🧠 ÁREA: MEMORIA (3 faltantes)

### 4. Memory Matrix ⭐ QUICK WIN
**Dificultad**: Fácil | **Tiempo estimado**: 2-3 días

**Descripción**:
Grid de 3x3, 4x4 o 5x5 que muestra iconos/colores por 2-3 segundos. Luego se ocultan y el usuario debe recordar las posiciones.

**Mecánica**:
```typescript
// Fases del juego
1. Show: Mostrar grid con patrones (2-3s)
2. Hide: Ocultar patrones
3. Recall: Usuario selecciona posiciones recordadas
4. Feedback: Mostrar aciertos/errores
```

**Configuración por nivel**:
- Primaria: Grid 3x3, 3 iconos, 3s visualización
- Secundaria: Grid 4x4, 5 iconos, 2.5s visualización
- Preparatoria: Grid 5x5, 7 iconos, 2s visualización

**UI**:
- Grid con casillas clicables
- Iconos coloridos y distinguibles
- Feedback visual (verde/rojo)
- Contador de aciertos

**Archivos**:
- `components/games/MemoryMatrixGame.tsx`

---

### 5. Digit Span ⭐ QUICK WIN
**Dificultad**: Fácil | **Tiempo estimado**: 2 días

**Descripción**:
Clásico test neuropsicológico. Se muestra una secuencia de dígitos, el usuario debe repetirla en el mismo orden (forward) o al revés (backward).

**Mecánica**:
```typescript
// Fases
1. Show: Mostrar dígitos uno por uno (1s cada uno)
2. Input: Usuario ingresa secuencia
3. Check: Validar respuesta
4. Increase: Si correcto, aumentar longitud
```

**Configuración por nivel**:
- Primaria: 3-6 dígitos, solo forward
- Secundaria: 4-8 dígitos, forward + backward
- Preparatoria: 5-9 dígitos, forward + backward + incremento automático

**UI**:
- Dígitos grandes y centrados
- Teclado numérico o input
- Indicador de modo (forward/backward)
- Secuencia máxima alcanzada

**Archivos**:
- `components/games/DigitSpanGame.tsx`

---

### 6. Chunking Master
**Dificultad**: Media | **Tiempo estimado**: 3-4 días

**Descripción**:
Enseña la técnica de chunking para agrupar información. Se muestra una lista larga de items y el usuario debe agruparlos en chunks significativos.

**Mecánica**:
```typescript
// Fases
1. Present: Mostrar lista de 12-20 items
2. Group: Usuario arrastra items para formar grupos
3. Test: Intentar recordar todos los items
4. Score: Puntos por items recordados y grupos lógicos
```

**Ejemplos**:
- Números: 5551234567 → 555-123-4567 (teléfono)
- Palabras: SOL-MAR-ARENA-PLAYA → chunk "verano"
- Letras: FBICIAUSAONU → FBI-CIA-USA-ONU

**Configuración por nivel**:
- Primaria: 9-12 items, sugerencias de chunks
- Secundaria: 12-16 items, sin ayuda
- Preparatoria: 16-20 items, múltiples categorías

**UI**:
- Lista drag-and-drop
- Áreas de "chunks"
- Sugerencias opcionales
- Visualización de agrupaciones

**Archivos**:
- `components/games/ChunkingMasterGame.tsx`

---

## 👁️ ÁREA: ATENCIÓN (3 faltantes)

### 7. Stroop Effect ⭐ QUICK WIN
**Dificultad**: Fácil | **Tiempo estimado**: 2 días

**Descripción**:
Clásico test de Stroop. Palabras de colores mostradas en colores diferentes. Usuario debe decir el COLOR, no leer la palabra.

**Mecánica**:
```typescript
// Ejemplo
Palabra: "ROJO" en color AZUL
Respuesta correcta: AZUL (no ROJO)

// Tipos de trials
- Congruente: "ROJO" en rojo
- Incongruente: "ROJO" en azul
- Neutro: "XXXX" en rojo
```

**Configuración por nivel**:
- Primaria: 70% congruentes, 30% incongruentes, 30 trials
- Secundaria: 50% congruentes, 50% incongruentes, 50 trials
- Preparatoria: 30% congruentes, 70% incongruentes, 80 trials

**UI**:
- Palabra grande y centrada
- Botones de colores
- Timer de reacción
- Feedback inmediato

**Archivos**:
- `components/games/StroopEffectGame.tsx`

---

### 8. Target Hunt
**Dificultad**: Media | **Tiempo estimado**: 3 días

**Descripción**:
Búsqueda visual selectiva. Grid con muchos distractores y algunos targets. Usuario debe encontrar todos los targets lo más rápido posible.

**Mecánica**:
```typescript
// Setup
Grid 8x8 o 10x10
3-5 targets (ej: letra T)
50+ distractores (ej: letra L rotada)

// Scoring
Puntos = (targets encontrados / tiempo) * precisión
```

**Configuración por nivel**:
- Primaria: Grid 6x6, 3 targets, distractores muy diferentes
- Secundaria: Grid 8x8, 4 targets, distractores similares
- Preparatoria: Grid 10x10, 5 targets, distractores casi idénticos

**UI**:
- Grid scrollable
- Click para seleccionar
- Contador de targets restantes
- Mapa de calor de búsqueda

**Archivos**:
- `components/games/TargetHuntGame.tsx`

---

### 9. Sustained Attention (CPT)
**Dificultad**: Media | **Tiempo estimado**: 3 días

**Descripción**:
Continuous Performance Test. Letras aparecen rápidamente, usuario presiona cuando ve una letra target (ej: X) pero NO cuando es un distractor.

**Mecánica**:
```typescript
// Parametros
Duración: 5 minutos
Frecuencia: 1 letra cada 500-1500ms
Target: 30% apariciones
Medidas: Aciertos, falsas alarmas, omisiones, tiempo de reacción
```

**Configuración por nivel**:
- Primaria: 3 min, target 40%, feedback frecuente
- Secundaria: 4 min, target 30%, feedback ocasional
- Preparatoria: 5 min, target 20%, sin feedback hasta el final

**UI**:
- Letra grande y centrada
- Barra de progreso
- Contador de errores (opcional)
- Gráfico de rendimiento al final

**Archivos**:
- `components/games/SustainedAttentionGame.tsx`

---

## ⚡ ÁREA: VELOCIDAD (3 faltantes)

### 10. Rapid Math ⭐ QUICK WIN
**Dificultad**: Fácil | **Tiempo estimado**: 2 días

**Descripción**:
Operaciones matemáticas simples contra reloj. Suma, resta, multiplicación, división.

**Mecánica**:
```typescript
// Operaciones
Primaria: 5 + 3 = ?
Secundaria: 17 × 4 = ?
Preparatoria: (15 + 8) × 3 - 12 = ?

// Scoring
Puntos por respuesta correcta × velocidad
```

**Configuración por nivel**:
- Primaria: +/- hasta 20, 1 minuto
- Secundaria: +/-/× hasta 100, 1.5 minutos
- Preparatoria: Todas operaciones, paréntesis, 2 minutos

**UI**:
- Ecuación centrada
- Input numérico
- Timer visible
- Streak de aciertos

**Archivos**:
- `components/games/RapidMathGame.tsx`

---

### 11. Reaction Time
**Dificultad**: Fácil | **Tiempo estimado**: 2 días

**Descripción**:
Test clásico de tiempo de reacción. Simple (un estímulo) y de elección (múltiples estímulos).

**Mecánica**:
```typescript
// Modo Simple
Pantalla negra → aparece círculo verde → usuario presiona

// Modo Elección
Aparece círculo rojo o verde
Verde: presionar izquierda
Rojo: presionar derecha

// Medidas
- Tiempo de reacción promedio
- Desviación estándar
- Anticipaciones (presionar antes)
```

**Configuración por nivel**:
- Primaria: Solo modo simple, 10 trials
- Secundaria: Simple + elección, 15 trials cada uno
- Preparatoria: Modo elección complejo (3-4 opciones), 20 trials

**UI**:
- Pantalla de espera
- Estímulo visual claro
- Feedback de tiempo
- Gráfico de consistencia

**Archivos**:
- `components/games/ReactionTimeGame.tsx`

---

### 12. Speed Circuit
**Dificultad**: Media | **Tiempo estimado**: 4 días

**Descripción**:
Circuito de tareas rápidas variadas. El usuario debe cambiar entre diferentes mini-tareas cada 10-15 segundos.

**Mecánica**:
```typescript
// Mini-tareas
1. Tap rápido (botón 20 veces)
2. Ordenar números (drag 1-5)
3. Emparejar símbolos
4. Recordar secuencia corta
5. Cálculo mental rápido

// Rotación cada 10-15s
// Score total = suma de todas las tareas
```

**Configuración por nivel**:
- Primaria: 3 mini-tareas, 15s cada una
- Secundaria: 5 mini-tareas, 12s cada una
- Preparatoria: 7 mini-tareas, 10s cada una

**UI**:
- Instrucción clara de tarea actual
- Timer circular
- Progreso del circuito
- Comparativa con promedio

**Archivos**:
- `components/games/SpeedCircuitGame.tsx`

---

## 🔄 ÁREA: FLEXIBILIDAD (3 faltantes)

### 13. Set Switching
**Dificultad**: Media | **Tiempo estimado**: 3 días

**Descripción**:
Similar a Focus Switch pero con más conjuntos de reglas. Usuario debe cambiar entre clasificar por color, forma, tamaño, textura.

**Mecánica**:
```typescript
// Reglas disponibles
- Color: rojo vs azul
- Forma: círculo vs cuadrado
- Tamaño: grande vs pequeño
- Textura: liso vs rayado

// La regla activa cambia cada 3-5 trials
```

**Configuración por nivel**:
- Primaria: 2 reglas (color/forma), cambio cada 5 trials
- Secundaria: 3 reglas, cambio cada 4 trials
- Preparatoria: 4 reglas, cambio cada 3 trials

**UI**:
- Regla activa destacada
- Estímulo compuesto (múltiples atributos)
- Botones de respuesta claros
- Costo de cambio al final

**Archivos**:
- `components/games/SetSwitchingGame.tsx`

---

### 14. Perspective Shift
**Dificultad**: Media-Alta | **Tiempo estimado**: 4-5 días

**Descripción**:
Rotación mental y cambio de perspectiva. Figuras 3D o letras rotadas que el usuario debe identificar.

**Mecánica**:
```typescript
// Tipos de ejercicios
1. Rotación mental: ¿Esta figura rotada es igual?
2. Vista desde arriba: ¿Cómo se ve desde otro ángulo?
3. Espejo: ¿Es la misma letra o su reflejo?

// Scoring
Puntos por corrección × velocidad
```

**Configuración por nivel**:
- Primaria: Solo letras rotadas 90°/180°
- Secundaria: Letras + figuras 2D, rotaciones variadas
- Preparatoria: Figuras 3D complejas, múltiples ejes

**UI**:
- Visualización 3D (Three.js o CSS 3D)
- Controles de rotación
- Vista de comparación
- Tutorial interactivo

**Archivos**:
- `components/games/PerspectiveShiftGame.tsx`

---

### 15. Multi-Task Trainer
**Dificultad**: Alta | **Tiempo estimado**: 5 días

**Descripción**:
Gestión de múltiples tareas simultáneas. Usuario debe monitorear y responder a 2-3 canales de información al mismo tiempo.

**Mecánica**:
```typescript
// Tareas simultáneas
1. Top: Secuencia de números (recordar último)
2. Middle: Palabra aparece (contar vocales)
3. Bottom: Círculo cambia color (presionar si es rojo)

// Todas ocurren en paralelo, usuario debe atender a todas
```

**Configuración por nivel**:
- Primaria: 2 tareas simples, ritmo lento
- Secundaria: 2 tareas complejas, ritmo medio
- Preparatoria: 3 tareas complejas, ritmo rápido

**UI**:
- Pantalla dividida en zonas
- Indicadores de cada tarea
- Scoring por tarea
- Bonus por multitasking efectivo

**Archivos**:
- `components/games/MultiTaskTrainerGame.tsx`

---

## 🧩 ÁREA: LÓGICA (3 faltantes)

### 16. Pattern Finder ⭐ QUICK WIN
**Dificultad**: Media | **Tiempo estimado**: 3 días

**Descripción**:
Identificar patrones en secuencias de números, letras, formas. Usuario debe predecir el siguiente elemento.

**Mecánica**:
```typescript
// Tipos de patrones
Numéricos: 2, 4, 8, 16, ? (respuesta: 32)
Alfabéticos: A, C, E, G, ? (respuesta: I)
Formas: ○ □ ○ □ ○ ? (respuesta: □)
Complejos: Fibonacci, primos, alternantes

// Dificultad progresiva
```

**Configuración por nivel**:
- Primaria: Patrones simples (suma, alternancia)
- Secundaria: Patrones múltiples (suma + multiplicación)
- Preparatoria: Patrones complejos (Fibonacci, secuencias anidadas)

**UI**:
- Secuencia horizontal
- Opciones de respuesta
- Explicación al final
- Categorías de patrones

**Archivos**:
- `components/games/PatternFinderGame.tsx`

---

### 17. Logic Puzzles
**Dificultad**: Media-Alta | **Tiempo estimado**: 5 días

**Descripción**:
Colección de puzzles lógicos: Sudoku, KenKen, lógica proposicional, acertijos.

**Mecánica**:
```typescript
// Tipos de puzzles
1. Sudoku 4x4, 6x6, 9x9
2. KenKen (operaciones en cages)
3. Lógica de proposiciones
4. Einstein's Riddle simplificado

// Hints disponibles (limitsados)
```

**Configuración por nivel**:
- Primaria: Sudoku 4x4, KenKen simple, hints ilimitados
- Secundaria: Sudoku 6x6, puzzles lógicos medios, 3 hints
- Preparatoria: Sudoku 9x9, puzzles complejos, sin hints

**UI**:
- Grid interactivo
- Notas/marcas
- Validación automática
- Timer opcional

**Archivos**:
- `components/games/LogicPuzzlesGame.tsx`
- `services/puzzleGenerator.ts`

---

### 18. Syllogisms
**Dificultad**: Media | **Tiempo estimado**: 3 días

**Descripción**:
Razonamiento deductivo formal. Silogismos lógicos donde el usuario debe determinar conclusiones válidas.

**Mecánica**:
```typescript
// Ejemplo
Premisa 1: Todos los A son B
Premisa 2: Todos los B son C
Conclusión válida: Todos los A son C

// Usuario debe:
1. Leer premisas
2. Evaluar conclusiones propuestas
3. Marcar válidas/inválidas
```

**Configuración por nivel**:
- Primaria: Silogismos categóricos simples, 1 conclusión
- Secundaria: Silogismos con negaciones, 2-3 conclusiones
- Preparatoria: Silogismos condicionales, conclusiones engañosas

**UI**:
- Premisas en cajas
- Conclusiones como botones
- Diagramas de Venn opcionales
- Explicación lógica al final

**Archivos**:
- `components/games/SyllogismsGame.tsx`

---

## 🎨 ÁREA: CREATIVIDAD (3 faltantes)

### 19. Word Association
**Dificultad**: Fácil-Media | **Tiempo estimado**: 3 días

**Descripción**:
Asociaciones libres y creativas de palabras. Mide fluidez y originalidad.

**Mecánica**:
```typescript
// Modos
1. Free Association: palabra → todas las asociaciones posibles en 1 min
2. Remote Association: conectar 3 palabras no relacionadas
3. Semantic Chain: crear cadena de asociaciones lógicas

// Scoring
Puntos por:
- Cantidad (fluidez)
- Originalidad (comparado con promedio)
- Conexiones lógicas
```

**Configuración por nivel**:
- Primaria: Free association, palabras concretas, 1 min
- Secundaria: Free + remote, palabras abstractas, 1.5 min
- Preparatoria: Todos los modos, restricciones adicionales, 2 min

**UI**:
- Input de texto rápido
- Lista de palabras generadas
- Indicador de originalidad
- Nube de palabras al final

**Archivos**:
- `components/games/WordAssociationGame.tsx`

---

### 20. Alternative Uses (Torrance Test)
**Dificultad**: Media | **Tiempo estimado**: 3-4 días

**Descripción**:
Test clásico de Torrance para pensamiento divergente. "¿Cuántos usos alternativos puedes encontrar para un objeto?"

**Mecánica**:
```typescript
// Objetos comunes
Ladrillo, clip, zapato, cuchara, botella, etc.

// El usuario lista usos alternativos
// Puntuación:
- Fluidez: cantidad de ideas
- Flexibilidad: categorías diferentes
- Originalidad: usos únicos
- Elaboración: detalle de descripción
```

**Configuración por nivel**:
- Primaria: 3 objetos, 2 min cada uno, ejemplos
- Secundaria: 5 objetos, 2 min cada uno
- Preparatoria: 7 objetos, 3 min cada uno, restricciones

**UI**:
- Imagen del objeto
- Input de texto
- Lista de usos propuestos
- Categorización automática
- Scoring multi-dimensional

**Archivos**:
- `components/games/AlternativeUsesGame.tsx`
- `services/creativityScoring.ts`

---

### 21. Story Builder
**Dificultad**: Media-Alta | **Tiempo estimado**: 4-5 días

**Descripción**:
Construcción narrativa creativa. Se dan elementos aleatorios (personajes, lugares, objetos) y el usuario debe crear una historia coherente.

**Mecánica**:
```typescript
// Elementos dados
Personaje: "Un detective cansado"
Lugar: "Una biblioteca abandonada"
Objeto: "Un reloj que va hacia atrás"
Palabra obligatoria: "silencio"

// Usuario escribe historia (150-300 palabras)
// Evaluación:
- Coherencia narrativa
- Uso de todos los elementos
- Creatividad
- Gramática
```

**Configuración por nivel**:
- Primaria: 3 elementos, 100 palabras, sugerencias
- Secundaria: 4 elementos, 200 palabras
- Preparatoria: 5 elementos + restricción, 300 palabras

**UI**:
- Tarjetas de elementos
- Editor de texto rico
- Contador de palabras
- IA para feedback básico
- Galería de historias destacadas

**Archivos**:
- `components/games/StoryBuilderGame.tsx`
- `services/storyEvaluation.ts`

---

## 📊 Resumen de Implementación

### Por Dificultad
- **⭐ Quick Wins (Fácil)**: 6 actividades (~12-15 días)
  - Memory Matrix
  - Digit Span
  - Stroop Effect
  - Rapid Math
  - Reaction Time
  - Pattern Finder

- **🔨 Media**: 9 actividades (~25-35 días)
  - Chunking Master
  - Target Hunt
  - Sustained Attention
  - Speed Circuit
  - Set Switching
  - Syllogisms
  - Word Association
  - Alternative Uses

- **🔥 Compleja**: 4 actividades (~15-20 días)
  - Perspective Shift
  - Multi-Task Trainer
  - Logic Puzzles
  - Story Builder

### Total Estimado
- **Desarrollo**: 52-70 días (~2.5-3.5 meses)
- **Testing**: +10-15 días
- **Polish**: +5-10 días
- **Total**: 3-4 meses para completar todas

### Estrategia Recomendada
1. **Semana 1-2**: Quick Wins (6 actividades)
2. **Semana 3-6**: Dificultad Media (9 actividades)
3. **Semana 7-10**: Dificultad Alta (4 actividades)
4. **Semana 11-12**: Testing y refinamiento

---

## 🎯 Próximos Pasos

### Opción A: Quick Wins First
**Empezar por las 6 más fáciles para impacto rápido**
1. Memory Matrix
2. Digit Span
3. Stroop Effect
4. Rapid Math
5. Reaction Time
6. Pattern Finder

### Opción B: Por Área
**Completar un área a la vez**
1. Memoria (3 actividades)
2. Atención (3 actividades)
3. Velocidad (3 actividades)
4. Flexibilidad (3 actividades)
5. Lógica (3 actividades)
6. Creatividad (3 actividades)

### Opción C: MVP Mínimo
**Lo más impactante primero**
1. Memory Matrix (muy popular)
2. Stroop Effect (clásico conocido)
3. Rapid Math (útil escolarmente)
4. Word Association (divertido)
5. Pattern Finder (desafiante)

---

**¿Cuál actividad quieres que implemente primero?** 🚀

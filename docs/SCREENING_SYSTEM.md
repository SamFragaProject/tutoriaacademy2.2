# 🧠 Sistema de Detección de Dificultades de Aprendizaje

## 📋 Visión General

Sistema automatizado para la **detección temprana** de dificultades de aprendizaje mediante análisis de patrones de interacción, rendimiento y comportamiento del estudiante.

---

## 🎯 Objetivos

1. **Detección temprana** de señales de alerta
2. **Intervención oportuna** antes de que se agraven
3. **Reducir estigma** con enfoque preventivo
4. **Apoyar a profesores** con data objetiva
5. **Canalizar correctamente** a especialistas

---

## 🔍 Dificultades Detectables

### 1. 📖 **DISLEXIA**

#### Indicadores Clave
| Indicador | Peso | Método de Detección |
|-----------|------|---------------------|
| Confusión b/d/p/q | Alto | Análisis de escritura |
| Inversión de letras/sílabas | Alto | NLP en respuestas |
| Velocidad de lectura lenta | Medio | Tiempo en ejercicios de lectura |
| Errores ortográficos fonéticos | Alto | Análisis de patrones |
| Dificultad con rimas | Medio | Ejercicios específicos |
| Omisión/sustitución letras | Alto | Análisis estadístico |

#### Algoritmo de Detección

```typescript
interface DyslexiaIndicators {
  letterConfusion: {
    'b/d': number;    // frecuencia
    'p/q': number;
    'm/n': number;
    'u/n': number;
  };
  syllableReversal: {
    frequency: number;
    examples: string[];
  };
  readingSpeed: {
    wordsPerMinute: number;
    expectedForGrade: number;
    percentile: number;
  };
  spellingErrors: {
    phoneticErrors: number;  // "kasa" en vez de "casa"
    visualErrors: number;    // confusión visual
    total: number;
  };
  sequencingIssues: {
    monthsOfYear: number;    // errores en secuencias
    daysOfWeek: number;
    alphabetRecitation: number;
  };
}

function calculateDyslexiaRisk(data: DyslexiaIndicators): ScreeningResult {
  let score = 0;
  let confidence = 0;
  
  // Ponderación de indicadores
  if (data.letterConfusion['b/d'] > 5) score += 25;
  if (data.readingSpeed.percentile < 20) score += 30;
  if (data.spellingErrors.phoneticErrors > 10) score += 25;
  if (data.syllableReversal.frequency > 3) score += 20;
  
  // Cálculo de confianza basado en cantidad de datos
  confidence = calculateConfidence(data.totalSamples);
  
  return {
    score,           // 0-100
    confidence,      // 0-100
    likelihood: getRiskLevel(score),
    recommendations: generateRecommendations(score, data)
  };
}
```

#### Tests Específicos

1. **Test de Lectura Cronometrado**
   - Texto de 100 palabras apropiado para grado
   - Medición de tiempo y errores
   - Comprensión post-lectura

2. **Test de Escritura de Palabras**
   - Dictado de 20 palabras con fonemas complejos
   - Análisis automático de patrones de error

3. **Test de Rimas**
   - Identificar palabras que riman
   - Generar palabras que rimen

4. **Test de Segmentación Fonológica**
   - Dividir palabras en sílabas
   - Identificar sonidos iniciales/finales

---

### 2. 🔢 **DISCALCULIA**

#### Indicadores Clave
| Indicador | Peso | Método de Detección |
|-----------|------|---------------------|
| Errores en operaciones básicas | Alto | Análisis de respuestas |
| Dificultad con valor posicional | Alto | Ejercicios específicos |
| Problemas con secuencias numéricas | Medio | Tests de patrones |
| Confusión de símbolos matemáticos | Alto | Análisis de errores |
| Dificultad estimando cantidades | Medio | Tests de estimación |
| Ansiedad matemática | Medio | Análisis de comportamiento |

#### Algoritmo de Detección

```typescript
interface DyscalculiaIndicators {
  basicOperations: {
    addition: { errors: number; avgTime: number };
    subtraction: { errors: number; avgTime: number };
    multiplication: { errors: number; avgTime: number };
    division: { errors: number; avgTime: number };
  };
  numberSense: {
    magnitudeComparison: number;  // ¿3 es mayor que 7?
    numberLine: number;            // ubicar números
    estimation: number;            // aproximar resultados
  };
  symbolConfusion: {
    '+/-': number;
    'x/÷': number;
    '=/≠': number;
  };
  placeValue: {
    errors: number;               // 23 vs 203
    understandingScore: number;
  };
  anxiety: {
    timeToStart: number;          // retraso antes de empezar
    abandonmentRate: number;       // % ejercicios abandonados
    helpRequests: number;
  };
}

function calculateDyscalculiaRisk(data: DyscalculiaIndicators): ScreeningResult {
  let score = 0;
  
  // Operaciones básicas
  const avgErrors = average([
    data.basicOperations.addition.errors,
    data.basicOperations.subtraction.errors,
    data.basicOperations.multiplication.errors,
    data.basicOperations.division.errors
  ]);
  
  if (avgErrors > gradeExpectation * 2) score += 30;
  
  // Sentido numérico
  if (data.numberSense.magnitudeComparison < 60) score += 25;
  
  // Confusión de símbolos
  if (data.symbolConfusion['+/-'] > 5) score += 20;
  
  // Ansiedad matemática
  if (data.anxiety.abandonmentRate > 30) score += 25;
  
  return {
    score,
    confidence: calculateConfidence(data),
    likelihood: getRiskLevel(score),
    recommendations: generateRecommendations(score, data)
  };
}
```

#### Tests Específicos

1. **Test de Operaciones Básicas**
   - 20 operaciones simples (+, -, ×, ÷)
   - Cronometrado
   - Análisis de patrones de error

2. **Test de Sentido Numérico**
   - Comparar magnitudes (¿qué es mayor?)
   - Ubicar números en recta numérica
   - Estimar resultados

3. **Test de Valor Posicional**
   - Identificar unidades, decenas, centenas
   - Expandir números (234 = 200 + 30 + 4)

4. **Test de Secuencias**
   - Completar patrones numéricos
   - Identificar secuencias crecientes/decrecientes

---

### 3. ✍️ **DISGRAFÍA**

#### Indicadores Clave
| Indicador | Peso | Método de Detección |
|-----------|------|---------------------|
| Escritura ilegible | Alto | Análisis OCR |
| Espaciado inconsistente | Medio | Análisis visual |
| Mezcla mayúsculas/minúsculas | Medio | Análisis de texto |
| Presión irregular del trazo | Bajo | Datos de stylus/tablet |
| Tiempo excesivo para escribir | Alto | Medición temporal |
| Fatiga al escribir | Medio | Análisis de sesiones |

#### Algoritmo de Detección

```typescript
interface DysgraphiaIndicators {
  legibility: {
    ocrConfidence: number;        // 0-100 del OCR
    letterFormation: number;      // score de formación
  };
  spacing: {
    betweenLetters: {
      variance: number;
      consistency: number;
    };
    betweenWords: {
      variance: number;
      consistency: number;
    };
  };
  casing: {
    inappropriateMixing: number;  // A en medio de palabra
    consistency: number;
  };
  speed: {
    charactersPerMinute: number;
    expectedForGrade: number;
    percentile: number;
  };
  pressure: {
    variance: number;             // Solo en tablets
    heavyStrokes: number;
    lightStrokes: number;
  };
  fatigue: {
    qualityDegradation: number;   // empeora al escribir más
    sessionDuration: number;
  };
}

function calculateDysgraphiaRisk(data: DysgraphiaIndicators): ScreeningResult {
  let score = 0;
  
  // Legibilidad
  if (data.legibility.ocrConfidence < 70) score += 30;
  
  // Espaciado
  if (data.spacing.betweenLetters.consistency < 50) score += 20;
  
  // Velocidad
  if (data.speed.percentile < 25) score += 25;
  
  // Fatiga
  if (data.fatigue.qualityDegradation > 30) score += 25;
  
  return {
    score,
    confidence: calculateConfidence(data),
    likelihood: getRiskLevel(score),
    recommendations: generateRecommendations(score, data)
  };
}
```

#### Tests Específicos

1. **Test de Escritura Libre**
   - Escribir 100 palabras sobre un tema
   - Análisis de legibilidad y consistencia

2. **Test de Copia**
   - Copiar un párrafo
   - Comparar con original

3. **Test de Velocidad**
   - Escribir el alfabeto cronometrado
   - Escribir números 1-20

---

### 4. 🎯 **TDAH** (Déficit de Atención)

#### Indicadores Clave
| Indicador | Peso | Método de Detección |
|-----------|------|---------------------|
| Cambios frecuentes de tarea | Alto | Análisis de navegación |
| Abandono de ejercicios | Alto | Tasa de finalización |
| Impulsividad en respuestas | Medio | Velocidad de respuesta |
| Dificultad con instrucciones | Medio | Errores en seguimiento |
| Patrones de atención fluctuantes | Alto | Análisis temporal |

#### Algoritmo de Detección

```typescript
interface ADHDIndicators {
  attention: {
    averageSessionDuration: number;
    sessionsAbandoned: number;
    taskSwitching: number;        // cambios por hora
  };
  impulsivity: {
    averageResponseTime: number;  // muy rápido = impulsivo
    errorsFromHaste: number;      // errores por apuro
    reviewBeforeSubmit: boolean;  // revisa antes de enviar?
  };
  followThrough: {
    multiStepCompletion: number;  // % completados
    instructionErrors: number;     // no siguió instrucciones
  };
  hyperactivity: {
    clicksPerMinute: number;      // clics excesivos
    scrollingBehavior: number;    // scroll nervioso
  };
  consistency: {
    performanceVariance: number;  // muy variable = TDAH
    goodDays: number;
    badDays: number;
  };
}
```

---

## 🎯 Sistema de Alertas

### Niveles de Alerta

```typescript
enum AlertLevel {
  GREEN = 'green',     // Todo normal
  YELLOW = 'yellow',   // Monitorear
  ORANGE = 'orange',   // Intervención sugerida
  RED = 'red'          // Derivación urgente
}

interface Alert {
  id: string;
  studentId: string;
  type: 'dyslexia' | 'dyscalculia' | 'dysgraphia' | 'adhd';
  level: AlertLevel;
  score: number;
  confidence: number;
  detectedAt: Date;
  indicators: Indicator[];
  recommendations: Recommendation[];
  notifiedTo: string[];
  status: 'pending' | 'acknowledged' | 'in_progress' | 'resolved';
}
```

### Criterios de Disparo

| Tipo | Score | Confianza | Nivel | Acción |
|------|-------|-----------|-------|--------|
| Cualquiera | 0-30 | - | Verde | Monitoreo pasivo |
| Cualquiera | 31-50 | >70% | Amarillo | Notificar profesor |
| Cualquiera | 51-70 | >75% | Naranja | Reunión con padres |
| Cualquiera | 71-100 | >80% | Rojo | Derivación especialista |

### Flujo de Alertas

```
1. Sistema detecta patrones → Score calculado
2. Si score > umbral:
   a. Genera alerta
   b. Notifica a profesor (siempre)
   c. Notifica a director (si naranja/rojo)
   d. Sugiere notificar padres (si naranja/rojo)
   e. Genera reporte detallado
   f. Propone intervenciones
3. Profesor revisa alerta
4. Profesor confirma/descarta
5. Si confirma:
   a. Se programa observación más detallada
   b. Se ajusta plan de aprendizaje
   c. Se notifica a padres
   d. Se deriva si es necesario
```

---

## 🔄 Frecuencia de Screening

### Screening Inicial
- Al registrarse en la plataforma
- Tests básicos de cada área
- Establece línea base

### Screening Continuo
- **Pasivo**: Cada sesión de estudio
  - Análisis automático de patrones
  - Sin intervención del alumno
  
- **Activo**: Cada 4 semanas
  - Tests específicos cortos (5-10 min)
  - Rotación de áreas evaluadas

### Screening Profundo
- **Cada 3 meses** si hay alertas amarillas
- **Cada mes** si hay alertas naranjas
- **Inmediato** si score sube >20 puntos

---

## 📊 Dashboard de Screening (Profesores)

### Vista de Grupo
```
┌────────────────────────────────────────────────┐
│  Grupo 3A - Alertas de Screening               │
├────────────────────────────────────────────────┤
│  🔴 3 alertas rojas   🟠 5 alertas naranjas    │
│  🟡 8 alertas amarillas                         │
├────────────────────────────────────────────────┤
│  Estudiante          | Alerta      | Score     │
│  ─────────────────────────────────────────────  │
│  🔴 Carlos Gómez     | Dislexia    | 75 (85%)  │
│  🔴 Ana Martínez     | Discalculia | 78 (82%)  │
│  🔴 Luis Torres      | TDAH        | 72 (80%)  │
│  🟠 María Silva      | Dislexia    | 62 (78%)  │
│  ...                                            │
└────────────────────────────────────────────────┘
```

### Vista Individual
```
┌────────────────────────────────────────────────┐
│  Carlos Gómez - Screening de Dislexia          │
├────────────────────────────────────────────────┤
│  Score: 75/100  |  Confianza: 85%  |  🔴 Alto  │
├────────────────────────────────────────────────┤
│  📊 Indicadores detectados:                     │
│  ▓▓▓▓▓▓▓▓░░ Confusión b/d (32 veces)          │
│  ▓▓▓▓▓▓▓░░░ Velocidad de lectura (35 wpm)     │
│  ▓▓▓▓▓▓░░░░ Errores fonéticos (18)            │
│  ▓▓▓▓░░░░░░ Inversión de sílabas (8)          │
├────────────────────────────────────────────────┤
│  📅 Historial:                                  │
│  Ene: 45  Feb: 58  Mar: 68  Abr: 75  ⬆️       │
├────────────────────────────────────────────────┤
│  💡 Recomendaciones:                            │
│  1. Derivar a especialista en dislexia         │
│  2. Usar fuente OpenDyslexic en plataforma     │
│  3. Dar tiempo extra en evaluaciones           │
│  4. Habilitar lector de pantalla               │
│  5. Sesiones más cortas (15 min)               │
├────────────────────────────────────────────────┤
│  📄 Generar Reporte PDF  |  📧 Notificar Padres│
└────────────────────────────────────────────────┘
```

---

## 🛠️ Intervenciones Automáticas

### Adaptaciones en la Plataforma

```typescript
interface Accommodations {
  dyslexia: {
    font: 'OpenDyslexic',
    fontSize: 1.2,
    lineSpacing: 1.5,
    wordSpacing: 1.2,
    textToSpeech: true,
    highlightWords: true,
    reducedTextPerPage: true,
    extraTime: 1.5  // 50% más de tiempo
  };
  
  dyscalculia: {
    visualAids: true,
    numberLine: true,
    calculator: true,
    stepByStepGuidance: true,
    reduceAnxiety: {
      noTimers: true,
      positiveReinforcement: 'high'
    }
  };
  
  dysgraphia: {
    voiceToText: true,
    spellCheck: 'enhanced',
    wordPrediction: true,
    keyboardShortcuts: true,
    reducedWriting: true
  };
  
  adhd: {
    shortSessions: true,
    sessionLength: 15,  // minutos
    frequentBreaks: true,
    breakReminders: true,
    gamification: 'high',
    progressVisualization: true,
    minimizeDistractions: true
  };
}
```

---

## 📈 Machine Learning

### Modelo de Predicción

```python
# Pseudo-código del modelo ML

from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier

# Features extraídas
features = [
    'reading_speed',
    'spelling_error_rate',
    'letter_confusion_frequency',
    'math_error_rate',
    'attention_span',
    'task_completion_rate',
    'writing_speed',
    'help_request_frequency',
    # ... 50+ features
]

# Modelo ensemble
model = VotingClassifier([
    ('rf', RandomForestClassifier(n_estimators=100)),
    ('mlp', MLPClassifier(hidden_layers=(100, 50))),
    ('xgb', XGBoostClassifier())
])

# Entrenamiento con datos etiquetados
# (casos confirmados por especialistas)
model.fit(X_train, y_train)

# Predicción
risk_score = model.predict_proba(student_features)
```

### Mejora Continua

- **Feedback loop**: Casos confirmados/descartados
- **A/B testing**: Diferentes umbrales
- **Validación cruzada**: Con especialistas
- **Actualización mensual**: Del modelo

---

## 🔐 Privacidad y Ética

### Principios

1. **Confidencialidad Total**
   - Solo acceso a equipo pedagógico autorizado
   - Encriptación de datos sensibles
   - Anonimización para estudios

2. **No Estigmatización**
   - Lenguaje neutral ("áreas de oportunidad")
   - Enfoque en fortalezas también
   - Privado (no visible para compañeros)

3. **Consentimiento**
   - Padres deben autorizar screening
   - Opt-out disponible
   - Transparencia en métodos

4. **Uso Responsable**
   - No etiquetado permanente
   - Revisión humana obligatoria
   - Derivación a profesionales

---

## 📚 Recursos y Referencias

### Para Profesores
- Guía de interpretación de reportes
- Estrategias de intervención en aula
- Cuándo derivar a especialista

### Para Padres
- Explicación de los indicadores
- Recursos comunitarios
- Apoyo en casa

### Para Directivos
- Métricas agregadas
- Tendencias por grado
- ROI de intervenciones tempranas

---

## 🎯 Métricas de Éxito

- **Detección temprana**: % detectados antes de 6 meses
- **Falsos positivos**: <10%
- **Falsos negativos**: <5%
- **Tiempo a intervención**: <2 semanas desde alerta
- **Mejora post-intervención**: >30% en 3 meses
- **Satisfacción familiar**: >85% NPS

---

*Este sistema complementa pero NO reemplaza la evaluación por especialistas en psicopedagogía.*

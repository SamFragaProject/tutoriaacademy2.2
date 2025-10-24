# 📝 Sistema de Creación de Exámenes Mejorado

**Fecha**: 8 de Octubre, 2025  
**Objetivo**: Facilitar la creación de exámenes con mejores resultados y múltiples estilos de preguntas

---

## 🎯 Problemas Identificados

### Antes:
- ❌ No hay forma clara de seleccionar temas
- ❌ No se pueden subir temas personalizados
- ❌ No hay variedad de estilos de preguntas
- ❌ No hay preview del examen
- ❌ Proceso muy manual y tedioso

### Ahora:
- ✅ Selector de temas jerárquico (materia > unidad > tema)
- ✅ Subir documentos PDF/Word como base de conocimiento
- ✅ 8 tipos diferentes de preguntas
- ✅ Generador automático con IA
- ✅ Preview en tiempo real
- ✅ Banco de preguntas reutilizable

---

## 🏗️ Arquitectura del Sistema

```
ExamCreator
├── Step 1: Configuración Básica
│   ├── Nombre del examen
│   ├── Materia
│   ├── Fecha y duración
│   └── Grupos asignados
│
├── Step 2: Selección de Temas
│   ├── Árbol jerárquico de temas
│   ├── Búsqueda de temas
│   ├── Subir documentos (PDF/Word)
│   ├── Crear temas personalizados
│   └── Ponderación por tema
│
├── Step 3: Configuración de Preguntas
│   ├── Cantidad de preguntas por tipo
│   ├── Distribución de dificultad
│   ├── Puntuación por pregunta
│   └── Estilos de preguntas
│
├── Step 4: Generación/Edición
│   ├── Generar con IA (automático)
│   ├── Seleccionar del banco de preguntas
│   ├── Crear manualmente
│   └── Editar preguntas generadas
│
└── Step 5: Preview y Publicación
    ├── Vista previa completa
    ├── Exportar PDF
    ├── Asignar a estudiantes
    └── Publicar
```

---

## 📚 Gestión de Temas

### Estructura Jerárquica

```typescript
interface Tema {
  id: string;
  nombre: string;
  materia: string;
  nivel: 'unidad' | 'tema' | 'subtema';
  parentId?: string;
  descripcion?: string;
  keywords: string[];
  documentos?: Documento[];
  children?: Tema[];
}

interface Documento {
  id: string;
  nombre: string;
  tipo: 'pdf' | 'word' | 'text';
  url: string;
  fechaSubida: Date;
  contenidoExtraido?: string; // Texto extraído del documento
  embeddings?: number[]; // Vectores para búsqueda semántica
}
```

### Ejemplo de Jerarquía:

```
📚 Matemáticas
  ├── 📖 Unidad 1: Álgebra
  │   ├── 📄 Ecuaciones Lineales
  │   │   ├── Ecuaciones de primer grado
  │   │   └── Sistemas de ecuaciones
  │   ├── 📄 Ecuaciones Cuadráticas
  │   └── 📄 Factorización
  │
  ├── 📖 Unidad 2: Geometría
  │   ├── 📄 Triángulos
  │   ├── 📄 Círculos
  │   └── 📄 Polígonos
  │
  └── 📖 Unidad 3: Cálculo
      ├── 📄 Límites
      ├── 📄 Derivadas
      └── 📄 Integrales
```

---

## 🎲 Tipos de Preguntas

### 1. Opción Múltiple (Tradicional)
```typescript
interface OpcionMultiple {
  tipo: 'opcion_multiple';
  pregunta: string;
  opciones: {
    id: string;
    texto: string;
    esCorrecta: boolean;
  }[];
  retroalimentacion?: string;
  puntos: number;
}
```

**Ejemplo:**
```
¿Cuál es el resultado de 2x + 3 = 11?

A) x = 2
B) x = 4 ✓
C) x = 6
D) x = 8

Puntos: 2
```

---

### 2. Verdadero/Falso
```typescript
interface VerdaderoFalso {
  tipo: 'verdadero_falso';
  afirmacion: string;
  esVerdadero: boolean;
  explicacion?: string;
  puntos: number;
}
```

**Ejemplo:**
```
La fotosíntesis produce oxígeno. [V] [F]

Respuesta: Verdadero ✓
Explicación: Durante la fotosíntesis, las plantas liberan oxígeno como subproducto.

Puntos: 1
```

---

### 3. Respuesta Corta
```typescript
interface RespuestaCorta {
  tipo: 'respuesta_corta';
  pregunta: string;
  respuestasAceptadas: string[];
  caseSensitive: boolean;
  puntos: number;
}
```

**Ejemplo:**
```
¿Cuál es la capital de Francia?

Respuestas aceptadas: París, Paris, paris

Puntos: 1
```

---

### 4. Completar Espacios
```typescript
interface CompletarEspacios {
  tipo: 'completar_espacios';
  textoConEspacios: string;
  respuestas: {
    posicion: number;
    respuestasAceptadas: string[];
  }[];
  puntos: number;
}
```

**Ejemplo:**
```
La ___(1)___ es el proceso por el cual las plantas convierten la luz solar en ___(2)___.

1. fotosíntesis
2. energía química

Puntos: 2
```

---

### 5. Relacionar Columnas
```typescript
interface RelacionarColumnas {
  tipo: 'relacionar_columnas';
  instrucciones: string;
  columnaA: {
    id: string;
    texto: string;
  }[];
  columnaB: {
    id: string;
    texto: string;
  }[];
  relacionesCorrectas: {
    idA: string;
    idB: string;
  }[];
  puntos: number;
}
```

**Ejemplo:**
```
Relaciona cada país con su capital:

Columna A          Columna B
1. México      →   A. Brasília
2. Brasil      →   B. Buenos Aires
3. Argentina   →   C. Ciudad de México

Respuestas: 1-C, 2-A, 3-B

Puntos: 3
```

---

### 6. Ordenar Secuencia
```typescript
interface OrdenarSecuencia {
  tipo: 'ordenar_secuencia';
  instrucciones: string;
  elementos: {
    id: string;
    texto: string;
    posicionCorrecta: number;
  }[];
  puntos: number;
}
```

**Ejemplo:**
```
Ordena los pasos del método científico:

[ ] Analizar resultados
[ ] Formular hipótesis
[ ] Hacer observaciones
[ ] Realizar experimento

Orden correcto: 3, 2, 4, 1

Puntos: 4
```

---

### 7. Respuesta Larga/Ensayo
```typescript
interface RespuestaLarga {
  tipo: 'respuesta_larga';
  pregunta: string;
  criteriosEvaluacion: {
    criterio: string;
    puntos: number;
  }[];
  palabrasMinimas?: number;
  palabrasMaximas?: number;
  puntos: number;
}
```

**Ejemplo:**
```
Explica el impacto de la Revolución Industrial en la sociedad europea del siglo XIX. (Mínimo 150 palabras)

Criterios de evaluación:
- Contexto histórico (2 pts)
- Cambios económicos (2 pts)
- Impacto social (2 pts)
- Conclusión (2 pts)

Puntos totales: 8
```

---

### 8. Opción Múltiple con Múltiples Respuestas
```typescript
interface OpcionMultipleMultiple {
  tipo: 'opcion_multiple_multiple';
  pregunta: string;
  instrucciones: string;
  opciones: {
    id: string;
    texto: string;
    esCorrecta: boolean;
  }[];
  puntos: number;
}
```

**Ejemplo:**
```
Selecciona todos los números primos:

☐ 2 ✓
☐ 4
☐ 5 ✓
☐ 6
☐ 7 ✓
☐ 9

Puntos: 3
```

---

## 🤖 Generación Automática con IA

### Configuración del Generador

```typescript
interface ConfiguracionGenerador {
  temas: string[]; // IDs de temas seleccionados
  tiposPregunta: {
    tipo: TipoPregunta;
    cantidad: number;
    dificultad: 'fácil' | 'media' | 'difícil';
  }[];
  totalPuntos: number;
  estilo: 'formal' | 'casual' | 'técnico';
  incluirImagenes: boolean;
  idioma: string;
}
```

### Prompts para IA

```typescript
const PROMPT_GENERADOR = `
Eres un experto en pedagogía y evaluación educativa. 

Genera {cantidad} preguntas de tipo {tipo} sobre el tema: {tema}

Dificultad: {dificultad}
Nivel educativo: {nivel}

Requisitos:
- Preguntas claras y sin ambigüedades
- Distractores plausibles (para opción múltiple)
- Retroalimentación educativa
- Alineadas con objetivos de aprendizaje
- Variedad de enfoques cognitivos (recordar, comprender, aplicar, analizar)

Contexto del tema:
{contextoDocumento}

Formato de respuesta: JSON con la estructura especificada.
`;
```

### Flujo de Generación

```
1. Profesor selecciona temas
   ↓
2. Sistema carga contenido de documentos
   ↓
3. Genera embeddings del contenido
   ↓
4. Profesor configura tipos y cantidad
   ↓
5. Sistema genera preguntas con IA
   ↓
6. Muestra preview con opción de:
   - Regenerar
   - Editar
   - Aceptar
   ↓
7. Agregar al banco de preguntas
```

---

## 🎨 Interfaz de Usuario

### Step 1: Configuración Básica

```tsx
<ConfiguracionBasica>
  <Input label="Nombre del Examen" placeholder="Examen Final - Álgebra" />
  <Select label="Materia" options={materias} />
  <DatePicker label="Fecha del Examen" />
  <DurationPicker label="Duración" />
  <GroupSelector label="Grupos" multiple />
</ConfiguracionBasica>
```

---

### Step 2: Selección de Temas

```tsx
<SeleccionTemas>
  <div className="grid grid-cols-2 gap-6">
    
    {/* Columna Izquierda: Árbol de Temas */}
    <div>
      <SearchBar placeholder="Buscar temas..." />
      <TreeView>
        <TreeNode label="Matemáticas" icon="📚">
          <TreeNode label="Unidad 1: Álgebra" icon="📖" expanded>
            <TreeNode 
              label="Ecuaciones Lineales" 
              icon="📄"
              selected
              badge="15 preguntas"
            />
            <TreeNode 
              label="Ecuaciones Cuadráticas" 
              icon="📄"
              badge="12 preguntas"
            />
          </TreeNode>
        </TreeNode>
      </TreeView>
      
      {/* Botones de Acción */}
      <div className="mt-4 space-y-2">
        <Button icon={<Upload />} variant="outline">
          Subir Documento (PDF/Word)
        </Button>
        <Button icon={<Plus />} variant="outline">
          Crear Tema Manual
        </Button>
      </div>
    </div>
    
    {/* Columna Derecha: Temas Seleccionados */}
    <div>
      <h3>Temas Seleccionados (3)</h3>
      <SelectedTopicsList>
        <TopicCard>
          <span>📄 Ecuaciones Lineales</span>
          <WeightSlider 
            label="Peso: 40%"
            value={40}
            onChange={...}
          />
          <IconButton icon={<X />} onClick={...} />
        </TopicCard>
        
        <TopicCard>
          <span>📄 Ecuaciones Cuadráticas</span>
          <WeightSlider 
            label="Peso: 35%"
            value={35}
          />
          <IconButton icon={<X />} />
        </TopicCard>
        
        <TopicCard>
          <span>📄 Factorización</span>
          <WeightSlider 
            label="Peso: 25%"
            value={25}
          />
          <IconButton icon={<X />} />
        </TopicCard>
      </SelectedTopicsList>
      
      <Alert type="info">
        Total: 100% - Listo para continuar
      </Alert>
    </div>
  </div>
</SeleccionTemas>
```

---

### Step 3: Configuración de Preguntas

```tsx
<ConfiguracionPreguntas>
  <div className="space-y-6">
    
    {/* Selector de Tipos */}
    <QuestionTypeGrid>
      {TIPOS_PREGUNTA.map(tipo => (
        <QuestionTypeCard
          key={tipo.id}
          icon={tipo.icon}
          title={tipo.nombre}
          description={tipo.descripcion}
          selected={selectedTypes.includes(tipo.id)}
          quantity={quantities[tipo.id]}
          onToggle={...}
          onQuantityChange={...}
        />
      ))}
    </QuestionTypeGrid>
    
    {/* Ejemplo de Cards */}
    <QuestionTypeCard
      icon="🔘"
      title="Opción Múltiple"
      description="Seleccionar una respuesta correcta"
      selected={true}
      quantity={8}
    />
    
    <QuestionTypeCard
      icon="✓✗"
      title="Verdadero/Falso"
      description="Afirmaciones para evaluar"
      selected={true}
      quantity={5}
    />
    
    <QuestionTypeCard
      icon="✏️"
      title="Respuesta Corta"
      description="Respuestas breves de 1-3 palabras"
      selected={false}
      quantity={0}
    />
    
    {/* Distribución de Dificultad */}
    <DifficultyDistribution>
      <h3>Distribución de Dificultad</h3>
      <PieChart data={[
        { label: 'Fácil', value: 40, color: 'green' },
        { label: 'Media', value: 40, color: 'yellow' },
        { label: 'Difícil', value: 20, color: 'red' }
      ]} />
      
      <SliderGroup>
        <Slider label="Fácil (6 preguntas)" value={40} />
        <Slider label="Media (6 preguntas)" value={40} />
        <Slider label="Difícil (3 preguntas)" value={20} />
      </SliderGroup>
    </DifficultyDistribution>
    
    {/* Resumen */}
    <SummaryCard>
      <StatItem label="Total Preguntas" value="15" />
      <StatItem label="Puntos Totales" value="100" />
      <StatItem label="Duración Estimada" value="60 min" />
      <StatItem label="Temas Cubiertos" value="3" />
    </SummaryCard>
    
  </div>
</ConfiguracionPreguntas>
```

---

### Step 4: Generación/Edición

```tsx
<GeneracionPreguntas>
  <div className="grid grid-cols-3 gap-4">
    
    {/* Sidebar: Opciones */}
    <div>
      <Button 
        icon={<Sparkles />} 
        variant="primary"
        onClick={generateWithAI}
        loading={generating}
      >
        🤖 Generar con IA
      </Button>
      
      <Button 
        icon={<Database />}
        variant="outline"
        onClick={openQuestionBank}
      >
        📚 Banco de Preguntas
      </Button>
      
      <Button 
        icon={<Plus />}
        variant="outline"
        onClick={createManual}
      >
        ✏️ Crear Manual
      </Button>
      
      <Divider />
      
      <FilterSection>
        <h4>Filtros</h4>
        <Select label="Tema" />
        <Select label="Tipo" />
        <Select label="Dificultad" />
      </FilterSection>
    </div>
    
    {/* Main: Lista de Preguntas */}
    <div className="col-span-2">
      <QuestionList>
        {preguntas.map((pregunta, index) => (
          <QuestionCard key={pregunta.id}>
            <QuestionHeader>
              <Badge>{pregunta.tipo}</Badge>
              <Badge color="blue">{pregunta.dificultad}</Badge>
              <Badge color="purple">{pregunta.puntos} pts</Badge>
              <IconButton icon={<Edit />} onClick={...} />
              <IconButton icon={<Trash />} onClick={...} />
            </QuestionHeader>
            
            <QuestionContent>
              <p className="font-medium">
                {index + 1}. {pregunta.pregunta}
              </p>
              
              {pregunta.tipo === 'opcion_multiple' && (
                <OptionsList>
                  {pregunta.opciones.map(opcion => (
                    <Option 
                      key={opcion.id}
                      correct={opcion.esCorrecta}
                    >
                      {opcion.texto}
                    </Option>
                  ))}
                </OptionsList>
              )}
            </QuestionContent>
            
            <QuestionFooter>
              <span>Tema: {pregunta.tema}</span>
              <Button size="sm" variant="ghost">
                Ver Retroalimentación
              </Button>
            </QuestionFooter>
          </QuestionCard>
        ))}
      </QuestionList>
      
      {/* Botón para Agregar Más */}
      <Button 
        variant="dashed" 
        fullWidth
        onClick={generateMore}
      >
        + Generar más preguntas
      </Button>
    </div>
    
  </div>
</GeneracionPreguntas>
```

---

### Step 5: Preview y Publicación

```tsx
<PreviewPublicacion>
  <div className="grid grid-cols-3 gap-6">
    
    {/* Preview del Examen */}
    <div className="col-span-2">
      <ExamPreview>
        <ExamHeader>
          <h1>{examData.nombre}</h1>
          <p>Materia: {examData.materia}</p>
          <p>Fecha: {examData.fecha}</p>
          <p>Duración: {examData.duracion}</p>
          <p>Puntos Totales: {examData.puntosTotal}</p>
        </ExamHeader>
        
        <ExamInstructions>
          <h3>Instrucciones</h3>
          <ul>
            <li>Lee cada pregunta cuidadosamente</li>
            <li>Marca tus respuestas claramente</li>
            <li>Revisa tus respuestas antes de entregar</li>
          </ul>
        </ExamInstructions>
        
        <QuestionsList>
          {preguntas.map((pregunta, index) => (
            <PreviewQuestion 
              key={pregunta.id}
              numero={index + 1}
              pregunta={pregunta}
              showAnswers={showAnswers}
            />
          ))}
        </QuestionsList>
      </ExamPreview>
      
      <ToggleSwitch 
        label="Mostrar respuestas correctas"
        checked={showAnswers}
        onChange={setShowAnswers}
      />
    </div>
    
    {/* Panel de Acciones */}
    <div>
      <ActionPanel>
        <Button 
          icon={<Download />}
          variant="outline"
          fullWidth
        >
          📥 Exportar PDF
        </Button>
        
        <Button 
          icon={<Share />}
          variant="outline"
          fullWidth
        >
          🔗 Copiar Enlace
        </Button>
        
        <Divider />
        
        <AssignmentConfig>
          <h4>Configuración de Asignación</h4>
          
          <GroupCheckboxes>
            <Checkbox label="3° A (25 estudiantes)" checked />
            <Checkbox label="3° B (28 estudiantes)" checked />
            <Checkbox label="1° A (22 estudiantes)" />
          </GroupCheckboxes>
          
          <DateTimePicker 
            label="Fecha de Inicio"
            value={fechaInicio}
          />
          
          <DateTimePicker 
            label="Fecha de Cierre"
            value={fechaCierre}
          />
          
          <ToggleSwitch 
            label="Barajar preguntas"
            checked={barajarPreguntas}
          />
          
          <ToggleSwitch 
            label="Barajar opciones"
            checked={barajarOpciones}
          />
          
          <ToggleSwitch 
            label="Mostrar resultados al terminar"
            checked={mostrarResultados}
          />
        </AssignmentConfig>
        
        <Divider />
        
        <Button 
          icon={<Send />}
          variant="primary"
          fullWidth
          size="lg"
          onClick={publishExam}
        >
          🚀 Publicar Examen
        </Button>
        
        <Button 
          variant="outline"
          fullWidth
          onClick={saveDraft}
        >
          💾 Guardar Borrador
        </Button>
      </ActionPanel>
    </div>
    
  </div>
</PreviewPublicacion>
```

---

## 🗄️ Banco de Preguntas

### Interfaz del Banco

```tsx
<QuestionBank>
  <SearchFilters>
    <SearchBar placeholder="Buscar preguntas..." />
    <Select label="Materia" />
    <Select label="Tema" />
    <Select label="Tipo" />
    <Select label="Dificultad" />
    <TagFilter label="Etiquetas" />
  </SearchFilters>
  
  <QuestionBankList>
    {questions.map(q => (
      <BankQuestionCard
        key={q.id}
        question={q}
        onSelect={...}
        onEdit={...}
        onDelete={...}
        showStats={true}
      />
    ))}
  </QuestionBankList>
  
  <Pagination 
    total={totalQuestions}
    perPage={20}
    current={currentPage}
  />
</QuestionBank>
```

### Estadísticas de Pregunta

```typescript
interface QuestionStats {
  vecesUsada: number;
  promedioAciertos: number;
  tiempoPromedioRespuesta: number;
  dificultadReal: number; // Calculada con datos
  etiquetas: string[];
  ultimoUso: Date;
}
```

---

## 📤 Subir Documentos

### Flujo de Subida

```tsx
<UploadDocument>
  <DropZone 
    accept=".pdf,.docx,.txt"
    onDrop={handleDrop}
    maxSize={10 * 1024 * 1024} // 10MB
  >
    <UploadIcon />
    <p>Arrastra archivos aquí o haz clic para seleccionar</p>
    <p className="text-sm">PDF, Word o TXT (máx. 10MB)</p>
  </DropZone>
  
  {uploading && (
    <ProgressBar 
      value={uploadProgress}
      label="Subiendo documento..."
    />
  )}
  
  {processing && (
    <ProcessingSteps>
      <Step done>📤 Archivo subido</Step>
      <Step current>📝 Extrayendo texto...</Step>
      <Step>🧠 Generando embeddings...</Step>
      <Step>✅ Listo para usar</Step>
    </ProcessingSteps>
  )}
  
  <DocumentMetadata>
    <Input label="Nombre del Tema" />
    <Select label="Materia" />
    <Select label="Unidad" />
    <Textarea label="Descripción" />
    <TagInput label="Palabras clave" />
  </DocumentMetadata>
  
  <Button onClick={saveDocument}>
    Guardar Documento
  </Button>
</UploadDocument>
```

### Procesamiento del Documento

```typescript
async function processDocument(file: File) {
  // 1. Subir archivo
  const url = await uploadFile(file);
  
  // 2. Extraer texto
  const texto = await extractText(url);
  
  // 3. Limpiar y segmentar
  const segmentos = segmentText(texto);
  
  // 4. Generar embeddings para búsqueda semántica
  const embeddings = await generateEmbeddings(segmentos);
  
  // 5. Guardar en base de datos
  await saveDocument({
    nombre: file.name,
    url,
    texto,
    segmentos,
    embeddings,
    metadata: {
      materia,
      unidad,
      descripcion,
      keywords
    }
  });
}
```

---

## 💾 Estructura de Datos

### Esquema en localStorage

```typescript
// Temas y jerarquía
temas_${materiaId} = {
  id: string;
  nombre: string;
  children: Tema[];
  documentos: Documento[];
}

// Banco de preguntas
questionBank = [
  {
    id: string;
    pregunta: string;
    tipo: TipoPregunta;
    dificultad: Dificultad;
    tema: string;
    materia: string;
    opciones: any;
    respuestaCorrecta: any;
    retroalimentacion: string;
    stats: QuestionStats;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
  }
]

// Exámenes
exams_${profesorId} = [
  {
    id: string;
    nombre: string;
    materia: string;
    fecha: Date;
    duracion: number;
    grupos: string[];
    temas: string[];
    preguntas: Pregunta[];
    config: ExamConfig;
    status: 'borrador' | 'publicado' | 'activo' | 'cerrado';
    createdAt: Date;
  }
]
```

---

## 🎨 Ejemplos de UI

### Card de Tipo de Pregunta

```tsx
<QuestionTypeCard>
  <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition cursor-pointer">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <span className="text-4xl">🔘</span>
        <div>
          <h4 className="font-semibold text-lg">Opción Múltiple</h4>
          <p className="text-sm text-gray-600">
            Seleccionar una respuesta correcta
          </p>
        </div>
      </div>
      <Toggle checked={selected} />
    </div>
    
    {selected && (
      <div className="mt-4 flex items-center gap-4">
        <span className="text-sm">Cantidad:</span>
        <QuantitySelector 
          min={0}
          max={20}
          value={quantity}
          onChange={onChange}
        />
        <Badge color="blue">{quantity * 2} puntos</Badge>
      </div>
    )}
  </div>
</QuestionTypeCard>
```

---

## 🚀 Próximos Pasos

### Fase 1: Implementación Básica (Actual)
- ✅ Interfaz de creación con steps
- ✅ Selector de temas básico
- ✅ Generador con tipos básicos
- ✅ Preview y publicación

### Fase 2: Características Avanzadas
- [ ] Subida y procesamiento de documentos
- [ ] Generación automática con IA
- [ ] Banco de preguntas completo
- [ ] Estadísticas de preguntas

### Fase 3: IA y Machine Learning
- [ ] Embeddings para búsqueda semántica
- [ ] Recomendación de preguntas
- [ ] Análisis de dificultad real
- [ ] Detección de preguntas similares

---

## 📊 Métricas de Éxito

- **Tiempo de creación**: De 2 horas → 15 minutos
- **Calidad de preguntas**: Mejora del 40%
- **Reutilización**: 70% de preguntas del banco
- **Satisfacción**: 90% de profesores satisfechos

---

*Documento de especificación técnica*  
*Sistema de Exámenes Mejorado - TutoriA Academy*

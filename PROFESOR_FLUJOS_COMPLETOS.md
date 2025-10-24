# 📚 Especificación Completa de Flujos del Profesor

## 🎯 Objetivo del Documento
Este documento define paso a paso los flujos funcionales completos para cada módulo del rol de profesor. Identifica qué está implementado, qué es solo visual, y qué debe agregarse.

---

## 📊 Estado Actual de Implementación

### ✅ IMPLEMENTADO (Funcional)
- Login del profesor con datos reales
- Dashboard con KPIs y estadísticas
- Visualización de grupos, tareas, exámenes
- Datos mock conectados desde `schoolMockData.ts`

### ⚠️ PARCIALMENTE IMPLEMENTADO (Solo Visual)
- Gestión de Exámenes (blueprints)
- Gestión de Tareas (MOCK_TASKS)
- Calificación de estudiantes
- Comunicación con grupos

### ❌ NO IMPLEMENTADO (Necesario)
- Flujo completo de creación de exámenes
- Flujo completo de creación de tareas
- Sistema de entregas de tareas
- Sistema de calificación con feedback
- Notificaciones push
- Gestión de grupos (agregar/remover estudiantes)

---

## 1️⃣ FLUJO COMPLETO: GESTIÓN DE EXÁMENES

### 📝 Estado Actual
**Componente**: `TeacherExamsPage` (líneas 203-264 en TeacherPages.tsx)
**Estado**: ⚠️ Parcialmente implementado
- ✅ Visualiza blueprints existentes
- ✅ Editor de blueprints (`ExamBlueprintEditor`)
- ❌ NO permite asignar a grupos específicos
- ❌ NO permite programar fecha/hora
- ❌ NO permite agregar instrucciones personalizadas
- ❌ NO muestra exámenes activos vs programados

### 🎯 Flujo Ideal (7 Pasos)

#### PASO 1: Crear Nuevo Examen
**Entrada**: Profesor hace clic en "Crear Examen"
**Acción**: Abre modal/página con formulario multi-paso
**Componentes Necesarios**:
```tsx
<ExamCreationWizard>
  <Step1_BasicInfo />      // Título, materia, tipo
  <Step2_Configuration />   // Duración, puntos, dificultad
  <Step3_Questions />       // Agregar preguntas (manual o IA)
  <Step4_Assignment />      // Seleccionar grupos
  <Step5_Schedule />        // Fecha y hora
  <Step6_Instructions />    // Instrucciones adicionales
  <Step7_Review />          // Revisar y publicar
</ExamCreationWizard>
```

#### PASO 2: Configuración Básica
**Campos Requeridos**:
- ✅ Título del examen
- ✅ Materia
- ✅ Tipo (diagnóstico, parcial, final, quiz)
- ✅ Descripción breve
- ✅ Duración (minutos)
- ✅ Puntos totales
- ✅ Nivel de dificultad

**Validaciones**:
- Título: mínimo 5 caracteres
- Duración: entre 10 y 180 minutos
- Puntos: mínimo 10, máximo 100

#### PASO 3: Agregar Preguntas
**Opciones**:
1. **Manual**: Agregar pregunta por pregunta
   - Tipo: Opción múltiple, abierta, verdadero/falso
   - Texto de la pregunta
   - Opciones de respuesta
   - Respuesta correcta
   - Puntos asignados
   - Explicación (opcional)

2. **Desde Banco de Preguntas**: Seleccionar de biblioteca
   - Filtrar por tema/subtema
   - Filtrar por dificultad
   - Agregar múltiples preguntas

3. **Con IA** (ya existe `AIExamCreator`):
   - Generar preguntas automáticamente
   - Revisar y editar
   - Agregar al examen

**Estado**: 
```typescript
interface ExamQuestion {
  id: string;
  type: 'multiple_choice' | 'open' | 'true_false' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
```

#### PASO 4: Asignar a Grupos
**Vista**: Lista de todos los grupos del profesor
```tsx
<GroupSelector>
  {groups.map(group => (
    <GroupCard 
      key={group.id}
      name={group.name}
      students={group.students.length}
      selected={selectedGroups.includes(group.id)}
      onToggle={() => toggleGroup(group.id)}
    />
  ))}
</GroupSelector>
```

**Validación**: Debe seleccionar al menos 1 grupo

#### PASO 5: Programar Fecha y Hora
**Campos**:
- Fecha de inicio (cuándo está disponible)
- Hora de inicio
- Fecha de cierre (deadline)
- Tiempo límite por intento (minutos)
- Número de intentos permitidos
- ¿Mostrar resultados inmediatamente?

**Vista**:
```tsx
<ScheduleConfig>
  <DateTimePicker 
    label="Disponible desde"
    value={startDate}
    onChange={setStartDate}
  />
  <DateTimePicker 
    label="Fecha límite"
    value={endDate}
    onChange={setEndDate}
  />
  <NumberInput 
    label="Intentos permitidos"
    value={maxAttempts}
    onChange={setMaxAttempts}
    min={1}
    max={5}
  />
</ScheduleConfig>
```

#### PASO 6: Instrucciones Adicionales
**Campos**:
- Instrucciones generales (texto enriquecido)
- Materiales permitidos (calculadora, fórmulas, etc.)
- Recursos adjuntos (PDFs, imágenes)
- Notificar a estudiantes (email/app)

#### PASO 7: Revisar y Publicar
**Vista Resumen**:
```tsx
<ExamReview>
  <Section title="Información General">
    - Título: {exam.title}
    - Materia: {exam.subject}
    - Duración: {exam.duration} min
    - Puntos: {exam.totalPoints}
  </Section>
  
  <Section title="Preguntas">
    - Total: {exam.questions.length}
    - Opción múltiple: {multipleChoiceCount}
    - Abiertas: {openCount}
  </Section>
  
  <Section title="Asignación">
    - Grupos: {selectedGroups.map(g => g.name).join(', ')}
    - Estudiantes: {totalStudents}
  </Section>
  
  <Section title="Programación">
    - Inicio: {formatDate(exam.startDate)}
    - Cierre: {formatDate(exam.endDate)}
  </Section>
  
  <ButtonGroup>
    <SecondaryButton>Guardar como Borrador</SecondaryButton>
    <PrimaryButton>Publicar Examen</PrimaryButton>
  </ButtonGroup>
</ExamReview>
```

**Acciones**:
- ✅ Guardar como borrador (no visible para estudiantes)
- ✅ Publicar (visible para estudiantes)
- ✅ Programar (publicar en fecha específica)

### 📊 Estados del Examen

```typescript
type ExamStatus = 
  | 'draft'         // Borrador (no publicado)
  | 'scheduled'     // Programado (fecha futura)
  | 'active'        // Activo (estudiantes pueden hacer)
  | 'closed'        // Cerrado (pasó el deadline)
  | 'graded';       // Calificado (todos calificados)

interface SchoolExam {
  id: string;
  title: string;
  subject: string;
  type: 'diagnostic' | 'partial' | 'final' | 'quiz';
  status: ExamStatus;
  teacherId: string;
  questions: ExamQuestion[];
  assignedGroups: string[];
  startDate: Date;
  endDate: Date;
  duration: number; // minutos
  maxAttempts: number;
  totalPoints: number;
  instructions: string;
  attachments: string[];
  showResultsImmediately: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Estadísticas
  totalStudents: number;
  completedCount: number;
  averageScore?: number;
  medalla?: {
    nombre: string;
    icono: string;
  };
}
```

### 🔄 Ciclo de Vida del Examen

```
DRAFT → SCHEDULED → ACTIVE → CLOSED → GRADED
  ↓         ↓          ↓         ↓
  └─────────┴──────────┴─────────┴──> ARCHIVED
```

---

## 2️⃣ FLUJO COMPLETO: GESTIÓN DE TAREAS

### 📝 Estado Actual
**Componente**: `TaskManager.tsx`
**Estado**: ⚠️ Solo visual con MOCK_TASKS
- ✅ Visualiza lista de tareas
- ✅ Filtros básicos
- ✅ Estadísticas (cards)
- ❌ NO permite crear nuevas tareas
- ❌ NO permite editar tareas existentes
- ❌ NO muestra entregas reales
- ❌ NO permite calificar entregas

### 🎯 Flujo Ideal (8 Pasos)

#### PASO 1: Crear Nueva Tarea
**Entrada**: Botón "+" flotante o "Nueva Tarea"
**Vista**: Modal o página completa

```tsx
<TaskCreationForm>
  <BasicInfoStep />
  <ContentStep />
  <AssignmentStep />
  <DeadlineStep />
  <ResourcesStep />
  <ReviewStep />
</TaskCreationForm>
```

#### PASO 2: Información Básica
**Campos**:
```typescript
{
  title: string;           // "Tarea de Álgebra"
  subject: string;         // "Matemáticas"
  type: TaskType;         // homework | project | practice
  description: string;     // Descripción breve
  instructions: string;    // Instrucciones detalladas (rich text)
  totalPoints: number;    // Puntos máximos
}
```

#### PASO 3: Contenido y Material
**Opciones**:
- Texto enriquecido (negrita, listas, links)
- Adjuntar archivos (PDF, imágenes, videos)
- Enlaces externos
- Recursos de biblioteca

**Vista**:
```tsx
<RichTextEditor 
  value={instructions}
  onChange={setInstructions}
  plugins={['bold', 'italic', 'list', 'link', 'image']}
/>
<FileUploader 
  onUpload={handleFileUpload}
  accepts={['pdf', 'jpg', 'png', 'docx']}
/>
```

#### PASO 4: Asignar a Grupos
Similar a exámenes:
```tsx
<GroupSelector 
  groups={myGroups}
  selected={selectedGroups}
  onChange={setSelectedGroups}
/>
```

**Validación**: Mínimo 1 grupo

#### PASO 5: Fecha Límite y Configuración
**Campos**:
```typescript
{
  dueDate: Date;           // Fecha límite
  allowLateSubmissions: boolean;  // ¿Aceptar entregas tardías?
  latePenalty: number;     // Penalización por retraso (%)
  requireAttachments: boolean;    // ¿Requiere archivos adjuntos?
  maxAttachments: number;  // Número máximo de archivos
  notifyStudents: boolean; // Notificar por email/app
}
```

**Vista**:
```tsx
<DeadlineConfig>
  <DateTimePicker 
    label="Fecha límite"
    value={dueDate}
    onChange={setDueDate}
    minDate={new Date()}
  />
  
  <Checkbox 
    label="Permitir entregas tardías"
    checked={allowLateSubmissions}
    onChange={setAllowLateSubmissions}
  />
  
  {allowLateSubmissions && (
    <NumberInput 
      label="Penalización por día (%)"
      value={latePenalty}
      onChange={setLatePenalty}
      min={0}
      max={50}
    />
  )}
</DeadlineConfig>
```

#### PASO 6: Rúbrica de Evaluación (Opcional)
**¿Qué es?** Criterios específicos de calificación

```typescript
interface RubricCriteria {
  id: string;
  name: string;           // "Claridad"
  description: string;    // "El trabajo es claro y organizado"
  maxPoints: number;      // 10
  levels: {
    excellent: { points: number, description: string };
    good: { points: number, description: string };
    acceptable: { points: number, description: string };
    poor: { points: number, description: string };
  };
}
```

**Vista**:
```tsx
<RubricBuilder>
  {criteria.map(criterion => (
    <CriterionEditor 
      key={criterion.id}
      criterion={criterion}
      onUpdate={updateCriterion}
      onDelete={deleteCriterion}
    />
  ))}
  <Button onClick={addCriterion}>+ Agregar Criterio</Button>
</RubricBuilder>
```

#### PASO 7: Revisar y Publicar
Similar a exámenes:
```tsx
<TaskReview>
  <Summary />
  <ButtonGroup>
    <SecondaryButton onClick={saveDraft}>
      Guardar Borrador
    </SecondaryButton>
    <PrimaryButton onClick={publishTask}>
      Publicar Tarea
    </PrimaryButton>
  </ButtonGroup>
</TaskReview>
```

#### PASO 8: Gestión de Entregas
**Vista**: Lista de entregas por estudiante

```tsx
<SubmissionsList taskId={taskId}>
  {submissions.map(submission => (
    <SubmissionCard 
      key={submission.id}
      student={submission.student}
      submittedAt={submission.submittedAt}
      status={submission.status}
      files={submission.attachments}
      onGrade={() => openGradingModal(submission)}
      onDownload={() => downloadSubmission(submission)}
    />
  ))}
</SubmissionsList>
```

**Estados de Entrega**:
```typescript
type SubmissionStatus = 
  | 'pending'       // No entregado
  | 'submitted'     // Entregado a tiempo
  | 'late'          // Entregado tarde
  | 'graded'        // Calificado
  | 'returned';     // Devuelto con feedback
```

### 📊 Estados de la Tarea

```typescript
type TaskStatus = 
  | 'draft'         // Borrador
  | 'assigned'      // Asignada (visible para estudiantes)
  | 'in_progress'   // Estudiantes trabajando
  | 'overdue'       // Pasó la fecha límite
  | 'graded'        // Todas las entregas calificadas
  | 'closed';       // Cerrada (no acepta más entregas)
```

---

## 3️⃣ FLUJO COMPLETO: CALIFICACIÓN DE ENTREGAS

### 📝 Estado Actual
**Componente**: `GradingInterface` (components/teacher/GradingInterface.tsx)
**Estado**: ⚠️ Solo muestra tabla estática
- ✅ Visualiza estudiantes con calificaciones mock
- ❌ NO permite ingresar calificaciones
- ❌ NO permite agregar feedback
- ❌ NO permite otorgar medallas
- ❌ NO calcula promedios

### 🎯 Flujo Ideal (5 Pasos)

#### PASO 1: Seleccionar Tarea/Examen a Calificar
**Vista**: Lista filtrable
```tsx
<GradingQueue>
  <FilterBar>
    <Select label="Materia" options={subjects} />
    <Select label="Tipo" options={['Tareas', 'Exámenes']} />
    <Select label="Estado" options={['Pendiente', 'En Proceso', 'Completado']} />
  </FilterBar>
  
  <AssignmentList>
    {assignments.map(assignment => (
      <AssignmentCard 
        title={assignment.title}
        dueDate={assignment.dueDate}
        submissionsCount={assignment.submissions.length}
        pendingGrades={assignment.pendingGradesCount}
        onClick={() => startGrading(assignment.id)}
      />
    ))}
  </AssignmentList>
</GradingQueue>
```

#### PASO 2: Ver Entrega Individual
**Vista**: Detalle de entrega con archivos y respuestas

```tsx
<SubmissionDetail>
  <StudentInfo 
    name={student.name}
    group={student.group}
    avatar={student.avatar}
  />
  
  <SubmissionMeta>
    <Chip>Entregado: {formatDate(submission.submittedAt)}</Chip>
    <Chip color={isLate ? 'red' : 'green'}>
      {isLate ? 'Tarde' : 'A Tiempo'}
    </Chip>
  </SubmissionMeta>
  
  <SubmissionContent>
    {/* Si es tarea con archivos */}
    {submission.attachments.map(file => (
      <FilePreview 
        key={file.id}
        file={file}
        onDownload={downloadFile}
      />
    ))}
    
    {/* Si es examen con respuestas */}
    {submission.answers.map(answer => (
      <AnswerReview 
        key={answer.questionId}
        question={answer.question}
        studentAnswer={answer.answer}
        correctAnswer={answer.correctAnswer}
        isCorrect={answer.isCorrect}
      />
    ))}
  </SubmissionContent>
</SubmissionDetail>
```

#### PASO 3: Ingresar Calificación
**Opciones**:

1. **Calificación Simple** (solo puntos):
```tsx
<SimpleGrading>
  <NumberInput 
    label="Puntos obtenidos"
    value={score}
    onChange={setScore}
    max={assignment.totalPoints}
  />
  <div>Calificación: {(score / assignment.totalPoints * 100).toFixed(1)}%</div>
</SimpleGrading>
```

2. **Calificación con Rúbrica**:
```tsx
<RubricGrading rubric={assignment.rubric}>
  {rubric.criteria.map(criterion => (
    <CriterionGrade 
      key={criterion.id}
      criterion={criterion}
      selectedLevel={grades[criterion.id]}
      onChange={(level) => setGrade(criterion.id, level)}
    />
  ))}
  <TotalScore>Total: {calculateTotal(grades)} / {rubric.maxPoints}</TotalScore>
</RubricGrading>
```

3. **Calificación Automática** (para exámenes de opción múltiple):
```tsx
<AutoGrading>
  <Alert color="info">
    Esta entrega fue calificada automáticamente.
    Revisa las respuestas y ajusta si es necesario.
  </Alert>
  <Score>{autoScore} / {totalPoints}</Score>
  <Button onClick={reviewAnswers}>Revisar Respuestas</Button>
</AutoGrading>
```

#### PASO 4: Agregar Feedback
**Campos**:
```typescript
{
  generalFeedback: string;      // Comentario general
  strengthsPoints: string[];    // Fortalezas
  improvementAreas: string[];   // Áreas de mejora
  privateNotes: string;         // Notas privadas (solo profesor)
  attachments: File[];          // Archivos adjuntos (correcciones)
}
```

**Vista**:
```tsx
<FeedbackEditor>
  <RichTextArea 
    label="Comentario General"
    value={feedback.general}
    onChange={setGeneralFeedback}
    placeholder="Escribe un comentario constructivo..."
  />
  
  <Section title="Fortalezas">
    {feedback.strengths.map((strength, i) => (
      <InputWithRemove 
        key={i}
        value={strength}
        onChange={(val) => updateStrength(i, val)}
        onRemove={() => removeStrength(i)}
      />
    ))}
    <Button onClick={addStrength}>+ Agregar Fortaleza</Button>
  </Section>
  
  <Section title="Áreas de Mejora">
    {/* Similar a strengths */}
  </Section>
  
  <FileUploader 
    label="Adjuntar Correcciones"
    onUpload={handleFeedbackFiles}
  />
</FeedbackEditor>
```

#### PASO 5: Otorgar Medallas y XP
**Lógica**:
```typescript
// Calcular XP basado en desempeño
const calculateXP = (score: number, totalPoints: number): number => {
  const percentage = (score / totalPoints) * 100;
  
  if (percentage >= 95) return 100;  // Excelente
  if (percentage >= 85) return 80;   // Muy bueno
  if (percentage >= 70) return 60;   // Bueno
  if (percentage >= 60) return 40;   // Aceptable
  return 20;                         // Necesita mejorar
};

// Verificar si merece medalla
const checkForMedal = (score: number, assignment: Assignment): Medal | null => {
  if (assignment.medal && score >= assignment.medal.requiredScore) {
    return assignment.medal;
  }
  return null;
};
```

**Vista**:
```tsx
<RewardsSection>
  <XPAward>
    <Award size={24} />
    <span>XP Otorgado: {xpAwarded}</span>
  </XPAward>
  
  {earnedMedal && (
    <MedalAward>
      <div className="medal-icon">{earnedMedal.icono}</div>
      <div>
        <h4>¡Medalla Ganada!</h4>
        <p>{earnedMedal.nombre}</p>
      </div>
    </MedalAward>
  )}
  
  <Checkbox 
    label="Enviar notificación al estudiante"
    checked={notifyStudent}
    onChange={setNotifyStudent}
  />
</RewardsSection>
```

#### PASO 6: Guardar y Devolver
**Acciones**:
```tsx
<ActionButtons>
  <SecondaryButton onClick={saveDraft}>
    Guardar Borrador
  </SecondaryButton>
  
  <PrimaryButton onClick={submitGrade}>
    Guardar y Devolver al Estudiante
  </PrimaryButton>
  
  <Button onClick={nextSubmission}>
    Siguiente Entrega →
  </Button>
</ActionButtons>
```

**Al guardar**:
1. Actualizar calificación del estudiante
2. Otorgar XP y medallas
3. Enviar notificación (si está activado)
4. Marcar entrega como "graded"
5. Actualizar estadísticas del assignment

---

## 4️⃣ FLUJO COMPLETO: GESTIÓN DE GRUPOS

### 📝 Estado Actual
**Componente**: `GroupsPage` (TeacherPages.tsx, líneas ~90-200)
**Estado**: ⚠️ Solo visualización
- ✅ Muestra 4 grupos con datos reales
- ✅ Modal con lista de estudiantes
- ❌ NO permite agregar/remover estudiantes
- ❌ NO permite editar información del grupo
- ❌ NO permite crear nuevos grupos
- ❌ NO permite comunicación con el grupo

### 🎯 Funcionalidades Necesarias

#### 1. Crear Nuevo Grupo
```tsx
<CreateGroupModal>
  <Input label="Nombre del grupo" placeholder="3° A" />
  <Input label="Materia" placeholder="Matemáticas" />
  <Input label="Nivel" placeholder="Secundaria" />
  <Select label="Horario" options={['Matutino', 'Vespertino']} />
  <ColorPicker label="Color del grupo" />
</CreateGroupModal>
```

#### 2. Agregar Estudiantes al Grupo
```tsx
<StudentSelector>
  <SearchBar placeholder="Buscar estudiante..." />
  <StudentList>
    {availableStudents.map(student => (
      <StudentItem 
        student={student}
        isSelected={selectedStudents.includes(student.id)}
        onToggle={() => toggleStudent(student.id)}
      />
    ))}
  </StudentList>
</StudentSelector>
```

#### 3. Gestionar Horarios
```tsx
<ScheduleEditor>
  {daysOfWeek.map(day => (
    <DaySchedule 
      day={day}
      sessions={schedule[day]}
      onAddSession={() => addSession(day)}
      onRemoveSession={(sessionId) => removeSession(day, sessionId)}
    />
  ))}
</ScheduleEditor>
```

#### 4. Comunicación con el Grupo
```tsx
<GroupCommunication>
  <AnnouncementComposer 
    onSend={sendAnnouncement}
  />
  <MessageThread 
    messages={groupMessages}
  />
</GroupCommunication>
```

---

## 5️⃣ RESUMEN DE PRIORIDADES

### 🔴 PRIORIDAD ALTA (Implementar primero)
1. **Flujo de Creación de Tareas** (más simple que exámenes)
2. **Sistema de Calificación Funcional** (crítico)
3. **Gestión de Entregas de Tareas**

### 🟡 PRIORIDAD MEDIA
4. **Flujo de Creación de Exámenes**
5. **Gestión de Grupos** (agregar/remover estudiantes)
6. **Sistema de Notificaciones**

### 🟢 PRIORIDAD BAJA
7. **Comunicación Avanzada**
8. **Analítica Detallada**
9. **Exportar Reportes**

---

## 📋 SIGUIENTE PASO RECOMENDADO

### Implementar: **Modal de Creación de Tareas**

**Componente nuevo**: `TaskCreationModal.tsx`

**Estructura básica**:
```tsx
export const TaskCreationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: SchoolTask) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [taskData, setTaskData] = useState<Partial<SchoolTask>>({});
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <StepIndicator currentStep={currentStep} totalSteps={6} />
      
      <AnimatePresence mode="wait">
        {currentStep === 1 && <BasicInfoStep data={taskData} onChange={setTaskData} />}
        {currentStep === 2 && <ContentStep data={taskData} onChange={setTaskData} />}
        {currentStep === 3 && <AssignmentStep data={taskData} onChange={setTaskData} />}
        {currentStep === 4 && <DeadlineStep data={taskData} onChange={setTaskData} />}
        {currentStep === 5 && <ResourcesStep data={taskData} onChange={setTaskData} />}
        {currentStep === 6 && <ReviewStep data={taskData} />}
      </AnimatePresence>
      
      <ModalFooter>
        {currentStep > 1 && (
          <SecondaryButton onClick={() => setCurrentStep(s => s - 1)}>
            Anterior
          </SecondaryButton>
        )}
        
        {currentStep < 6 ? (
          <PrimaryButton onClick={() => setCurrentStep(s => s + 1)}>
            Siguiente
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={() => onSave(taskData as SchoolTask)}>
            Crear Tarea
          </PrimaryButton>
        )}
      </ModalFooter>
    </Modal>
  );
};
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Para cada funcionalidad:
- [ ] Diseñar flujo paso a paso
- [ ] Crear interfaces TypeScript
- [ ] Implementar componentes UI
- [ ] Agregar validaciones
- [ ] Conectar con datos (mock o real)
- [ ] Probar flujo completo
- [ ] Documentar en código
- [ ] Agregar mensajes de error/éxito

---

**Fecha de creación**: 8 de octubre, 2025
**Última actualización**: 8 de octubre, 2025

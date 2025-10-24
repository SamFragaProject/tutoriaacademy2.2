# 🏗️ TutoriA Academy - Arquitectura Técnica

## 📐 Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                     │
├─────────────────────────────────────────────────────────────┤
│  Web App (React)  │  Mobile App (React Native)  │  PWA      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY / BFF                        │
├─────────────────────────────────────────────────────────────┤
│  • Rate Limiting    • Authentication    • API Routing        │
│  • Caching         • Load Balancing     • API Versioning     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     MICROSERVICIOS                           │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Auth       │   Learning   │   Content    │   Analytics    │
│   Service    │   Service    │   Service    │   Service      │
├──────────────┼──────────────┼──────────────┼────────────────┤
│   AI Router  │  Screening   │   Gamif.     │   Notification │
│   Service    │   Service    │   Service    │   Service      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE DATOS                            │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  PostgreSQL  │   MongoDB    │    Redis     │   S3/Storage   │
│  (Relacional)│  (Documentos)│   (Cache)    │   (Archivos)   │
└──────────────┴──────────────┴──────────────┴────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     SERVICIOS EXTERNOS                       │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Gemini API  │   GPT-4      │   Claude     │    Llama       │
│              │   OpenAI     │   Anthropic  │    Local       │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

---

## 🎯 Microservicios Detallados

### 1. **Auth Service**
- JWT + Refresh Tokens
- OAuth2 (Google, Microsoft)
- Role-Based Access Control (RBAC)
- Multi-tenancy (por escuela)
- Session Management

### 2. **Learning Service** (Core)
- Adaptive Learning Engine
- Spaced Repetition System (SRS)
- Learning Path Generation
- Skill Tracking
- Progress Analytics

### 3. **Content Service**
- CMS para profesores
- Content versioning
- Media storage
- Template management
- Content recommendation engine

### 4. **AI Router Service**
- Multi-LLM orchestration
- Prompt engineering
- Response caching
- Cost optimization
- Fallback handling
- A/B testing de prompts

### 5. **Screening Service** (Nuevo)
- Pattern detection algorithms
- ML models para screening
- Alert generation
- Report generation
- Intervention recommendations

### 6. **Analytics Service**
- Real-time dashboards
- Predictive analytics
- Engagement tracking
- Performance metrics
- Export/reporting

### 7. **Gamification Service**
- XP/Level system
- Achievement engine
- Leaderboards
- Quest system
- Reward distribution

### 8. **Notification Service**
- Email (SendGrid/SES)
- Push notifications (FCM)
- SMS (Twilio)
- In-app notifications
- Alert routing

---

## 🗄️ Modelo de Datos

### **Base de Datos Relacional (PostgreSQL)**

```sql
-- Usuarios
users (id, email, role, school_id, created_at)
students (user_id, grade, birth_date, learning_profile)
teachers (user_id, subjects, groups)
directors (user_id, schools)

-- Contenido
subjects (id, name, icon)
topics (id, subject_id, name, order)
lessons (id, topic_id, content, difficulty)
assessments (id, type, content, rubric)

-- Progreso
student_progress (student_id, topic_id, mastery, last_practiced)
submissions (id, student_id, assessment_id, score, submitted_at)
srs_schedule (student_id, topic_id, level, due_date)

-- Screening
screening_tests (id, student_id, type, score, date)
indicators (id, test_id, pattern, severity, frequency)
alerts (id, student_id, type, status, created_at)
```

### **Base de Datos NoSQL (MongoDB)**

```javascript
// Perfiles de aprendizaje detallados
learningProfiles {
  studentId: ObjectId,
  cognitiveStyle: {},
  modalityPreferences: {},
  effectiveStrategies: [],
  emotionalStates: [],
  sessionHistory: []
}

// Sesiones de chat con IA
chatSessions {
  sessionId: string,
  studentId: ObjectId,
  subject: string,
  messages: [],
  metadata: {}
}

// Analytics events
events {
  timestamp: Date,
  userId: ObjectId,
  eventType: string,
  metadata: {}
}
```

### **Cache (Redis)**

```redis
# Sesiones activas
session:{userId} → session_data

# Leaderboards
leaderboard:global → sorted_set
leaderboard:school:{schoolId} → sorted_set

# Rate limiting
ratelimit:{userId}:{endpoint} → counter

# Cached AI responses
ai:cache:{hash} → response

# Real-time presence
presence:{userId} → {status, lastSeen}
```

---

## 🤖 Sistema Multi-LLM

```typescript
class LLMRouter {
  providers = {
    gemini: {
      models: ['gemini-pro', 'gemini-flash'],
      cost: 0.001,
      speed: 'fast',
      strengths: ['math', 'science', 'general']
    },
    openai: {
      models: ['gpt-4o', 'gpt-4o-mini'],
      cost: 0.005,
      speed: 'medium',
      strengths: ['reasoning', 'creative', 'coding']
    },
    anthropic: {
      models: ['claude-3.5-sonnet'],
      cost: 0.003,
      speed: 'medium',
      strengths: ['long-context', 'writing', 'analysis']
    },
    local: {
      models: ['llama-3.1-70b'],
      cost: 0,
      speed: 'slow',
      strengths: ['privacy', 'offline']
    }
  };

  selectProvider(criteria: SelectionCriteria): Provider {
    // Algoritmo de selección inteligente
    // 1. Especialización por materia
    // 2. Prioridad (costo vs calidad vs velocidad)
    // 3. Disponibilidad
    // 4. Cuotas restantes
    // 5. Experiencias pasadas (A/B testing results)
  }
}
```

---

## 🧠 Sistema de Screening

```typescript
// Algoritmo de detección de dislexia
class DyslexiaScreener {
  indicators = {
    letterConfusion: ['b/d', 'p/q', 'm/n', 'u/n'],
    readingSpeed: { threshold: 50 }, // palabras por minuto
    spellingErrors: { phonetic: true },
    sequencing: { reversals: true }
  };

  analyze(studentData: StudentData): ScreeningResult {
    const score = this.calculateScore(studentData);
    const confidence = this.calculateConfidence(studentData);
    
    if (score > 70 && confidence > 80) {
      return {
        likelihood: 'high',
        recommendation: 'professional_evaluation',
        alertLevel: 'red'
      };
    }
    // ...
  }
}
```

---

## 📊 Pipeline de Analytics

```
Events → Ingestion → Processing → Storage → Visualization
  ↓          ↓           ↓           ↓           ↓
User     Kafka/      Stream      TimeSeries   Grafana/
Action   Kinesis    Processing     DB        Custom UI
                   (Spark/Flink) (InfluxDB)
```

---

## 🔒 Seguridad

### Capas de Seguridad

1. **Authentication**
   - JWT con refresh tokens
   - MFA opcional
   - SSO para escuelas (SAML)

2. **Authorization**
   - RBAC granular
   - Políticas basadas en recursos
   - Segregación por escuela (multi-tenancy)

3. **Data Protection**
   - Encriptación en tránsito (TLS 1.3)
   - Encriptación en reposo (AES-256)
   - PII masking en logs
   - Anonimización para analytics

4. **Compliance**
   - COPPA compliant
   - FERPA compliant
   - GDPR ready
   - Audit logs

---

## 🚀 Despliegue

### Infraestructura (AWS/GCP)

```yaml
Frontend:
  - CloudFront / Cloud CDN
  - S3 / Cloud Storage
  - Route53 / Cloud DNS

Backend:
  - ECS/EKS / GKE (Kubernetes)
  - Lambda / Cloud Functions (serverless)
  - API Gateway

Databases:
  - RDS (PostgreSQL)
  - DocumentDB / Atlas (MongoDB)
  - ElastiCache (Redis)

Monitoring:
  - CloudWatch / Cloud Monitoring
  - DataDog / New Relic
  - Sentry (Error tracking)

CI/CD:
  - GitHub Actions
  - Docker
  - Terraform (IaC)
```

---

## 📱 Plataformas Soportadas

- ✅ Web (Desktop)
- ✅ Web (Móvil responsive)
- 🔄 PWA (Progressive Web App) - En desarrollo
- � iOS (React Native) - Futuro
- � Android (React Native) - Futuro
- 🔮 Desktop (Electron) - Futuro

---

## 🔄 Flujos Críticos

### Flujo de Aprendizaje Adaptativo

```
1. Alumno inicia sesión
2. Sistema carga perfil de aprendizaje
3. Algoritmo selecciona siguiente actividad óptima
   - Considera: SRS, dificultad, modalidad preferida, estado emocional
4. Presenta contenido adaptado
5. Monitorea interacción en tiempo real
6. Detecta indicadores emocionales/cognitivos
7. Ajusta en tiempo real si es necesario
8. Registra resultados
9. Actualiza perfil de aprendizaje
10. Ejecuta screening de dificultades (periódico)
11. Genera alertas si es necesario
```

### Flujo de Screening

```
1. Trigger: cada N sesiones o por solicitud
2. Recopila datos históricos del alumno
3. Ejecuta algoritmos de detección
4. Calcula scores de confianza
5. Si detecta patrón preocupante:
   a. Genera alerta
   b. Notifica a profesor
   c. Notifica a director
   d. Sugiere intervenciones
   e. Ofrece recursos
6. Guarda en historial
7. Programa siguiente screening
```

---

## 🎯 Métricas Clave (KPIs)

### Estudiantes
- Tiempo promedio de sesión
- Tasa de finalización
- Mejora en mastery score
- Engagement score
- Streaks activos

### Profesores
- Contenido creado
- Tiempo de respuesta a alertas
- Uso del copiloto IA
- Satisfacción del contenido creado

### Plataforma
- MAU/DAU (usuarios activos)
- Retención (D1, D7, D30)
- Churn rate
- NPS (Net Promoter Score)
- Costos de IA por alumno
- Detecciones tempranas exitosas

---

## 🔮 Roadmap Técnico

### Fase 1 (3 meses)
- ✅ Backend base (Auth, Learning, Content)
- ✅ Frontend multi-rol funcional
- ✅ Integración con 2 LLMs (Gemini + GPT)
- ✅ Sistema básico de analytics

### Fase 2 (3 meses)
- 🔄 Sistema de screening v1
- 🔄 Adaptive learning engine
- 🔄 CMS para profesores
- 🔄 Portal de padres

### Fase 3 (6 meses)
- 🔮 App móvil nativa
- 🔮 Offline mode
- 🔮 Predictive analytics
- 🔮 Aprendizaje colaborativo

### Fase 4 (6 meses)
- 🔮 ML models propios
- 🔮 Multimodal features
- 🔮 Expansión internacional
- 🔮 API pública para integraciones

---

## 💡 Decisiones Técnicas

### Frontend
- **Framework**: React 19 con TypeScript
- **Estado**: TanStack Query + Zustand
- **Routing**: React Router v7
- **UI**: Tailwind CSS + Radix UI
- **Animaciones**: Framer Motion
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS (escalable, enterprise-ready)
- **API**: GraphQL + REST híbrido
- **ORM**: Prisma (type-safe)
- **Validación**: Zod

### Testing
- **Unit**: Vitest
- **Integration**: Playwright
- **E2E**: Cypress
- **Load**: k6

---

## 📚 Recursos Adicionales

- [ADRs](./docs/adr/) - Architectural Decision Records
- [API Docs](./docs/api/) - API Documentation
- [Deployment Guide](./docs/deployment/) - Deployment procedures
- [Contributing](./CONTRIBUTING.md) - How to contribute

---

*Última actualización: Octubre 2025*

#  GUÍA COMPLETA: Setup Supabase para TutoriA Academy

**Tiempo estimado**: 2 horas
**Fecha**: 26 de Octubre, 2025

---

##  ÍNDICE

1. [Crear Proyecto Supabase](#1-crear-proyecto-supabase)
2. [Ejecutar Schema SQL](#2-ejecutar-schema-sql)
3. [Configurar Autenticación](#3-configurar-autenticación)
4. [Integrar con React](#4-integrar-con-react)
5. [Panel de Administración](#5-panel-de-administración)
6. [Integrar Gemini API](#6-integrar-gemini-api)
7. [Testing Completo](#7-testing-completo)

---

## 1 CREAR PROYECTO SUPABASE

### Paso 1.1: Ir a Supabase
1. Abre: https://supabase.com
2. Click en **"Start your project"**
3. Login con GitHub (recomendado)

### Paso 1.2: Crear Proyecto
```
Organization: Tu nombre/empresa
Project Name: tutoria-academy
Database Password: [GUARDA ESTO - MUY IMPORTANTE]
Region: South America (São Paulo) - más cercano a México
Pricing Plan: Free
```

 **Espera 2-3 minutos** mientras se crea el proyecto

### Paso 1.3: Obtener Credenciales
Una vez creado, ve a **Settings > API**

Copia estos valores:
```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (NO COMPARTIR)
```

---

## 2 EJECUTAR SCHEMA SQL

### Paso 2.1: Abrir SQL Editor
1. En el panel izquierdo de Supabase, click en **"SQL Editor"**
2. Click en **"New query"**

### Paso 2.2: Copiar Schema
Abre el archivo `supabase_schema_simple.sql` de tu proyecto

### Paso 2.3: Ejecutar
1. Pega TODO el contenido en el editor SQL
2. Click en **"Run"** (abajo derecha)
3. Deberías ver:  Success. No rows returned

### Paso 2.4: Verificar Tablas
1. Click en **"Table Editor"** en el sidebar
2. Deberías ver estas tablas:
   -  users
   -  schools
   -  groups
   -  students
   -  teachers
   -  subjects
   -  content
   -  submissions
   -  questions
   -  exams
   -  screening_alerts

---

## 3 CONFIGURAR AUTENTICACIÓN

### Paso 3.1: Habilitar Providers
1. Ve a **Authentication > Providers**
2. Habilita:
   -  Email (ya está habilitado)
   -  Google (opcional para después)

### Paso 3.2: Configurar Email Templates
1. Ve a **Authentication > Email Templates**
2. Personaliza el template de "Confirm signup"
3. Cambia el subject a: "Bienvenido a TutoriA Academy"

### Paso 3.3: Configurar Políticas RLS (Row Level Security)

Vuelve a **SQL Editor** y ejecuta:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Política para ADMIN: puede ver TODO
CREATE POLICY "Admins can do everything"
ON users FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- Política para PROFESORES: solo ven sus grupos
CREATE POLICY "Teachers see their groups"
ON groups FOR SELECT
USING (auth.uid() = teacher_id OR auth.jwt() ->> 'role' = 'admin');

-- Política para ESTUDIANTES: solo ven su info
CREATE POLICY "Students see their data"
ON students FOR SELECT
USING (auth.uid() = user_id OR auth.jwt() ->> 'role' IN ('admin', 'profesor'));

-- Política para CONTENIDO: profesores ven su contenido
CREATE POLICY "Teachers see their content"
ON content FOR ALL
USING (auth.uid() = teacher_id OR auth.jwt() ->> 'role' = 'admin');
```

---

## 4 INTEGRAR CON REACT

### Paso 4.1: Instalar Supabase Client
Abre PowerShell en tu proyecto y ejecuta:

```powershell
npm install @supabase/supabase-js
```

### Paso 4.2: Crear archivo .env
Crea `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GEMINI_API_KEY=AIzaSy... (tu key existente)
```

 **IMPORTANTE**: Agrega `.env.local` a `.gitignore`

### Paso 4.3: Crear Supabase Client
El archivo ya debería existir, pero verifica `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 5 PANEL DE ADMINISTRACIÓN

Este panel permitirá al admin:
-  Ver todas las escuelas, profesores, estudiantes
-  Crear/editar/eliminar usuarios
-  Ver actividad en tiempo real
-  Gestionar contenido
-  Ver analytics generales
-  Configurar sistema

### Páginas del Panel Admin:
1. **Dashboard**: Métricas generales
2. **Usuarios**: CRUD completo
3. **Escuelas**: Gestión de instituciones
4. **Contenido**: Ver todo el contenido del sistema
5. **Analytics**: Estadísticas avanzadas
6. **Configuración**: Settings del sistema
7. **Logs**: Actividad reciente

---

## 6 INTEGRAR GEMINI API

### Paso 6.1: Obtener API Key
1. Ve a: https://makersuite.google.com/app/apikey
2. Click en "Create API Key"
3. Copia la key: `AIzaSy...`
4. Agrégala a `.env.local` (ya debería estar)

### Paso 6.2: Actualizar geminiClient.ts
Ya tienes el archivo, solo asegúrate que use la variable de entorno:

```typescript
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

---

## 7 TESTING COMPLETO

### Checklist de Testing:

#### Autenticación 
- [ ] Registrar usuario nuevo
- [ ] Login con email/password
- [ ] Logout
- [ ] Recuperar contraseña

#### Profesor 
- [ ] Crear examen
- [ ] Ver grupos
- [ ] Calificar
- [ ] Ver resultados

#### Estudiante 
- [ ] Ver materias
- [ ] Hacer práctica
- [ ] Chat con IA
- [ ] Ver progreso

#### Admin 
- [ ] Ver todos los usuarios
- [ ] Crear profesor
- [ ] Crear estudiante
- [ ] Ver analytics

---

##  TROUBLESHOOTING

### Error: "Invalid API Key"
- Verifica que copiaste bien las keys
- Asegúrate que `.env.local` existe
- Reinicia el servidor: `npm run dev`

### Error: "Row Level Security"
- Ve a SQL Editor
- Ejecuta: `ALTER TABLE nombre_tabla DISABLE ROW LEVEL SECURITY;`
- Solo para testing, luego re-habilita

### Error: "Failed to fetch"
- Verifica CORS en Supabase
- Ve a Settings > API > CORS
- Agrega `http://localhost:5173`

---

##  DATOS DE PRUEBA

### Crear Usuario Admin:
```sql
INSERT INTO users (id, email, nombre, rol, created_at)
VALUES (
  gen_random_uuid(),
  'admin@tutoria.com',
  'Admin Master',
  'admin',
  NOW()
);
```

### Crear Profesor:
```sql
INSERT INTO users (id, email, nombre, rol, created_at)
VALUES (
  gen_random_uuid(),
  'profesor@tutoria.com',
  'Juan Martínez',
  'profesor',
  NOW()
);
```

### Crear Estudiante:
```sql
INSERT INTO users (id, email, nombre, rol, created_at)
VALUES (
  gen_random_uuid(),
  'estudiante@tutoria.com',
  'María López',
  'alumno',
  NOW()
);
```

---

##  CHECKLIST FINAL

Antes de testear, asegúrate:

- [ ] Proyecto Supabase creado
- [ ] Schema SQL ejecutado
- [ ] Tablas creadas correctamente
- [ ] RLS configurado
- [ ] `.env.local` creado con las keys
- [ ] `npm install @supabase/supabase-js` ejecutado
- [ ] Servidor reiniciado
- [ ] Usuarios de prueba creados

---

##  PRÓXIMOS PASOS

1. Ejecutar esta guía paso a paso
2. Crear componentes del panel admin
3. Conectar todos los servicios a Supabase
4. Testing exhaustivo
5. Deploy a Vercel + Supabase en producción

---

**¿Listo para empezar?** 

Empieza por el paso 1 y avísame cuando termines cada fase.


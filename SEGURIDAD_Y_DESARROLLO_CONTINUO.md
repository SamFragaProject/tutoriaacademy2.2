# 🔒 SEGURIDAD Y DESARROLLO CONTINUO

**Proyecto:** TutoriA Academy B2B  
**Fecha:** 23/10/2025  
**Tema:** Seguridad de usuarios + Workflow de desarrollo

---

## 🛡️ PARTE 1: SEGURIDAD CON SUPABASE

### ✅ LO QUE SUPABASE MANEJA AUTOMÁTICAMENTE (TÚ NO TIENES QUE PROGRAMAR)

#### 1. **Autenticación de Usuarios**

```typescript
// ❌ ANTES (Inseguro - datos en localStorage sin encriptar)
const currentUser = JSON.parse(localStorage.getItem('user'));

// ✅ CON SUPABASE (Seguro automáticamente)
import { supabase } from './lib/supabaseClient';

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'profesor@escuela.com',
  password: 'MiPassword123!'
});

// Supabase automáticamente:
// ✅ Hashea la contraseña con bcrypt
// ✅ Genera JWT token seguro
// ✅ Maneja sesiones
// ✅ Refresca tokens automáticamente
// ✅ Detecta intentos de hackeo (rate limiting)
```

#### 2. **Encriptación de Contraseñas**

```
TÚ GUARDAS:     "MiPassword123!"
SUPABASE GUARDA: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
                 ↑ Imposible de revertir (bcrypt)
```

✅ **NO tienes que programar nada de esto**

#### 3. **Row Level Security (RLS) - Aislamiento por Escuela**

```sql
-- Ejemplo: Cada escuela SOLO ve sus datos

-- Tabla de alumnos
CREATE TABLE alumnos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT,
  email TEXT,
  escuela_id UUID REFERENCES escuelas(id),
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Política de seguridad (RLS)
ALTER TABLE alumnos ENABLE ROW LEVEL SECURITY;

-- Solo los usuarios de la misma escuela pueden ver los alumnos
CREATE POLICY "Usuarios ven alumnos de su escuela"
ON alumnos FOR SELECT
USING (
  escuela_id IN (
    SELECT escuela_id 
    FROM usuarios 
    WHERE id = auth.uid()
  )
);

-- Solo profesores y directores pueden insertar alumnos
CREATE POLICY "Profesores pueden crear alumnos"
ON alumnos FOR INSERT
WITH CHECK (
  escuela_id IN (
    SELECT escuela_id 
    FROM usuarios 
    WHERE id = auth.uid() 
    AND rol IN ('profesor', 'director')
  )
);
```

**Resultado práctico:**
- ✅ La Escuela A nunca puede ver datos de la Escuela B
- ✅ Un alumno nunca puede ver calificaciones de otro alumno
- ✅ Un profesor solo ve sus grupos
- ✅ El director solo ve su escuela

#### 4. **Tokens JWT Automáticos**

```typescript
// Supabase automáticamente agrega el token a cada request
const { data: grupos } = await supabase
  .from('grupos')
  .select('*');

// En el backend, Supabase verifica:
// ✅ ¿El token es válido?
// ✅ ¿No ha expirado?
// ✅ ¿El usuario tiene permiso?
// ✅ ¿Pertenece a la escuela correcta?
```

#### 5. **Protección contra Ataques Comunes**

| Ataque | ¿Supabase te protege? |
|--------|----------------------|
| **SQL Injection** | ✅ SÍ (queries parametrizadas) |
| **XSS (Cross-site Scripting)** | ✅ SÍ (sanitización automática) |
| **CSRF** | ✅ SÍ (tokens CSRF) |
| **Brute Force** | ✅ SÍ (rate limiting) |
| **Man in the Middle** | ✅ SÍ (HTTPS obligatorio) |
| **Session Hijacking** | ✅ SÍ (tokens seguros) |

---

## 🔐 IMPLEMENTACIÓN DE AUTH EN TU PROYECTO

### Paso 1: Configurar Supabase Client

```typescript
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types'; // Auto-generado

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### Paso 2: Crear Context de Autenticación

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  userRole: 'alumno' | 'profesor' | 'director' | 'admin' | null;
  escuelaId: string | null;
}

const AuthContext = createContext<AuthContextType>(undefined!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [escuelaId, setEscuelaId] = useState<string | null>(null);

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Cargar datos adicionales del usuario
      if (session?.user) {
        loadUserData(session.user.id);
      }
      
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          loadUserData(session.user.id);
        } else {
          setUserRole(null);
          setEscuelaId(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('rol, escuela_id')
      .eq('id', userId)
      .single();

    if (data) {
      setUserRole(data.rol);
      setEscuelaId(data.escuela_id);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        loading, 
        signIn, 
        signOut,
        userRole,
        escuelaId 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Paso 3: Proteger Rutas

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    // No autenticado → redirigir a login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Usuario autenticado pero sin permiso
    return <Navigate to="/no-autorizado" replace />;
  }

  return <>{children}</>;
}
```

### Paso 4: Usar en App.tsx

```typescript
// App.tsx
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />

          {/* Rutas protegidas - Solo profesores */}
          <Route 
            path="/docente/*" 
            element={
              <ProtectedRoute allowedRoles={['profesor', 'director']}>
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<EnhancedTeacherDashboard />} />
            <Route path="grupos" element={<GroupsPage />} />
            <Route path="examenes" element={<TeacherExamsPage />} />
            {/* ... más rutas */}
          </Route>

          {/* Rutas protegidas - Solo alumnos */}
          <Route 
            path="/alumno/*" 
            element={
              <ProtectedRoute allowedRoles={['alumno']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="tareas" element={<StudentTasks />} />
            {/* ... más rutas */}
          </Route>

          {/* Rutas protegidas - Solo directores */}
          <Route 
            path="/director/*" 
            element={
              <ProtectedRoute allowedRoles={['director']}>
                <DirectorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DirectorDashboard />} />
            <Route path="reportes" element={<ReportsPage />} />
            {/* ... más rutas */}
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
```

### Paso 5: Página de Login

```typescript
// pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, userRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      
      // Redirigir según el rol
      if (userRole === 'profesor' || userRole === 'director') {
        navigate('/docente/dashboard');
      } else if (userRole === 'alumno') {
        navigate('/alumno/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          TutoriA Academy
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="profesor@escuela.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔒 SEGURIDAD DE BASE DE DATOS

### Ejemplo Práctico: Tabla de Calificaciones

```sql
-- Crear tabla
CREATE TABLE calificaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  examen_id UUID REFERENCES examenes(id),
  alumno_id UUID REFERENCES usuarios(id),
  puntuacion DECIMAL(5,2),
  retroalimentacion TEXT,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE calificaciones ENABLE ROW LEVEL SECURITY;

-- POLÍTICA 1: Los alumnos solo ven sus propias calificaciones
CREATE POLICY "Alumnos ven sus calificaciones"
ON calificaciones FOR SELECT
USING (alumno_id = auth.uid());

-- POLÍTICA 2: Los profesores ven calificaciones de sus grupos
CREATE POLICY "Profesores ven calificaciones de sus grupos"
ON calificaciones FOR SELECT
USING (
  examen_id IN (
    SELECT e.id FROM examenes e
    INNER JOIN grupos g ON e.grupo_id = g.id
    WHERE g.profesor_id = auth.uid()
  )
);

-- POLÍTICA 3: Solo profesores pueden actualizar calificaciones
CREATE POLICY "Profesores actualizan calificaciones"
ON calificaciones FOR UPDATE
USING (
  examen_id IN (
    SELECT e.id FROM examenes e
    INNER JOIN grupos g ON e.grupo_id = g.id
    WHERE g.profesor_id = auth.uid()
  )
);

-- POLÍTICA 4: Los alumnos NO pueden modificar calificaciones
-- (No crear política de UPDATE para alumnos = bloqueado automáticamente)
```

### ¿Qué pasa si un alumno intenta hackear?

```typescript
// Alumno malicioso intenta ver calificaciones de otro
const { data } = await supabase
  .from('calificaciones')
  .select('*')
  .eq('alumno_id', 'otro-alumno-uuid'); // ← Intentando ver datos ajenos

// RESULTADO: data = [] (vacío)
// RLS bloquea automáticamente
// Ni siquiera se ejecuta la query completa
```

---

## 🚀 PARTE 2: DESARROLLO CONTINUO (HOT RELOAD)

### ✅ SÍ, Puedes Actualizar en Vivo desde VSCode

#### **Workflow Moderno:**

```
1. Código en tu PC (VSCode)
   ↓
2. Git commit + push
   ↓
3. Vercel detecta cambios automáticamente
   ↓
4. Compila y despliega (30-60 segundos)
   ↓
5. URL actualizada automáticamente
```

### Configuración con Vercel + Git

#### Paso 1: Inicializar Git (si no lo tienes)

```powershell
# En tu proyecto
git init
git add .
git commit -m "Initial commit"
```

#### Paso 2: Subir a GitHub

```powershell
# Crear repositorio en GitHub.com
# Luego conectar:
git remote add origin https://github.com/tu-usuario/tutoria-academy.git
git branch -M main
git push -u origin main
```

#### Paso 3: Conectar Vercel con GitHub

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Conectar proyecto
vercel link

# Configurar para auto-deploy
vercel --prod
```

#### Paso 4: Configurar Auto-Deploy

En **vercel.com**:
1. Ir a tu proyecto
2. Settings → Git
3. Activar "Automatic Deployments"
4. Cada push a `main` se despliega automáticamente

### Flujo de Trabajo Diario

```powershell
# 1. Haces cambios en VSCode
# Ejemplo: Editas components/teacher/TaskManager.tsx

# 2. Guardas (Ctrl+S)

# 3. Pruebas localmente
npm run dev  # localhost:3002

# 4. Si funciona, subes a producción
git add .
git commit -m "Fix: Mejorado filtro de tareas"
git push

# 5. Vercel despliega automáticamente (30-60 seg)
# Recibirás notificación por email cuando esté listo

# 6. Verificas en tu URL de producción
# https://tutoria-academy.vercel.app
```

### Ver el Progreso del Deploy

```powershell
# Ver logs en tiempo real
vercel logs tutoria-academy --follow

# O en el dashboard web:
# https://vercel.com/tu-usuario/tutoria-academy
```

---

## 🔄 ESTRATEGIA DE DESPLIEGUE SEGURO

### Opción 1: Branch-based Deployment (Recomendado)

```
main (producción)     → https://tutoria-academy.vercel.app
  ↑
  | merge cuando esté probado
  |
dev (desarrollo)      → https://tutoria-academy-dev.vercel.app
  ↑
  | trabajas aquí
  |
feature/nueva-funcion → https://tutoria-academy-git-feature-nueva-funcion.vercel.app
```

**Configuración:**

```powershell
# Crear rama de desarrollo
git checkout -b dev

# Hacer cambios
# ... editas código ...

# Subir a dev
git add .
git commit -m "Nueva feature: Sistema de mensajería"
git push origin dev

# Vercel crea URL automática: tutoria-academy-dev.vercel.app

# Cuando todo funciona → mergear a main
git checkout main
git merge dev
git push origin main

# Vercel actualiza producción automáticamente
```

### Opción 2: Preview Deployments

Cada **Pull Request** crea una URL temporal:

```
Pull Request #42: "Agregar exportar PDF de calificaciones"
→ Vercel crea: https://tutoria-academy-git-pr-42.vercel.app

Pruebas → OK → Mergear → Deploy a producción
```

---

## 🛠️ VARIABLES DE ENTORNO (Seguridad en Producción)

### ⚠️ NUNCA subas tus keys a Git

```bash
# .env.local (local development)
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# .env.production (Vercel maneja esto)
# NO lo subes a Git, lo configuras en Vercel dashboard
```

### Configurar en Vercel:

1. Dashboard → Settings → Environment Variables
2. Agregar:
   - `VITE_SUPABASE_URL` = tu URL
   - `VITE_SUPABASE_ANON_KEY` = tu key
3. Aplicar a: Production, Preview, Development

### En tu código:

```typescript
// ✅ CORRECTO
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// ❌ INCORRECTO (nunca hardcodees)
const supabaseUrl = "https://tuproyecto.supabase.co";
```

---

## 📊 MONITOREO DE CAMBIOS

### Herramientas Recomendadas:

#### 1. **Vercel Analytics** (Gratis)
- Ver cuántos usuarios están online
- Páginas más visitadas
- Performance metrics

#### 2. **Sentry** (Errores en producción)
```bash
npm install @sentry/react

# Captura errores automáticamente
# Te envía email cuando algo falla en producción
```

#### 3. **Supabase Dashboard**
- Ver queries en tiempo real
- Monitorear uso de base de datos
- Logs de autenticación

---

## 🎯 CHECKLIST DE SEGURIDAD

### Antes de Subir a Producción:

- [ ] **Auth implementado** con Supabase
- [ ] **RLS habilitado** en todas las tablas
- [ ] **Variables de entorno** configuradas en Vercel
- [ ] **HTTPS** activado (Vercel lo hace automáticamente)
- [ ] **Rate limiting** configurado (Supabase lo incluye)
- [ ] **.env** en .gitignore
- [ ] **Roles de usuario** correctamente definidos
- [ ] **Pruebas de seguridad** básicas:
  - [ ] ¿Un alumno puede ver datos de otro?
  - [ ] ¿Un profesor puede ver otra escuela?
  - [ ] ¿Se pueden inyectar SQL? (Supabase previene)
  - [ ] ¿Funcionan los permisos de lectura/escritura?

---

## 🚨 ESCENARIOS DE SEGURIDAD RESUELTOS

### Escenario 1: Alumno Intenta Ver Calificaciones de Otro

```typescript
// Alumno A (id: abc-123) intenta ver calificaciones de Alumno B (id: xyz-789)
const { data } = await supabase
  .from('calificaciones')
  .select('*')
  .eq('alumno_id', 'xyz-789');

// RLS Policy: USING (alumno_id = auth.uid())
// auth.uid() = 'abc-123'
// 'abc-123' != 'xyz-789'
// Resultado: data = []  ← Bloqueado automáticamente
```

### Escenario 2: Escuela A Intenta Ver Grupos de Escuela B

```typescript
// Profesor de Escuela A (escuela_id: escuela-a)
const { data } = await supabase
  .from('grupos')
  .select('*')
  // Intentan cargar todos los grupos

// RLS Policy verifica:
// WHERE escuela_id = (SELECT escuela_id FROM usuarios WHERE id = auth.uid())
// escuela_id del profesor = 'escuela-a'
// Solo devuelve grupos con escuela_id = 'escuela-a'
// Escuela B está completamente invisible
```

### Escenario 3: Hackeo de Token JWT

```typescript
// Hacker modifica el JWT en el navegador
// Token original: { user_id: 'profesor-123', role: 'profesor' }
// Token modificado: { user_id: 'profesor-123', role: 'admin' }

// Supabase verifica:
// 1. ¿El token está firmado correctamente? ← NO (fue modificado)
// 2. Rechaza el request automáticamente
// 3. El hacker recibe error 401 Unauthorized
```

---

## 💡 RESUMEN EJECUTIVO

### ✅ Seguridad de Usuarios
- **Supabase maneja todo automáticamente**
- Contraseñas hasheadas con bcrypt
- Tokens JWT seguros
- Sesiones manejadas automáticamente
- Protección contra ataques comunes

### ✅ Seguridad de Base de Datos
- **Row Level Security (RLS)** separa datos por escuela
- Cada rol tiene permisos específicos
- Imposible acceder a datos de otra escuela
- Queries filtradas automáticamente

### ✅ Desarrollo Continuo
- **Editas en VSCode → Git push → Auto-deploy en 60 segundos**
- Preview URLs para cada cambio
- Rollback instantáneo si algo falla
- Variables de entorno seguras

---

## 🎓 PRÓXIMOS PASOS

¿Qué quieres hacer ahora?

**Opción A:** Configurar Supabase + Auth completo en tu proyecto ✅

**Opción B:** Configurar Git + Vercel para auto-deploy 🚀

**Opción C:** Ver ejemplo de RLS para tu esquema específico 🔒

**Opción D:** Todo (A → B → C) en orden 🎯


# 🔴 ANÁLISIS: Problema RLS y Datos Demo

**Fecha:** $(date)  
**Estado:** CRÍTICO - Bloqueando toda la funcionalidad

---

## 🚨 PROBLEMA 1: RLS Sigue Bloqueando Queries (ERROR RECURRENTE)

### Síntoma
```
Error al cargar los grupos
permission denied for table grupos
```

### Por qué sigue apareciendo

**Posibles causas:**

1. ❌ **NO SE EJECUTÓ el SQL en Supabase** 
   - El archivo `DISABLE_RLS_COMPLETO.sql` se creó pero el usuario nunca lo ejecutó
   - Los scripts anteriores tampoco se ejecutaron

2. ❌ **Policies siguen activas**
   - Aunque se deshabilite RLS con `DISABLE ROW LEVEL SECURITY`, las policies pueden seguir existiendo
   - Supabase puede reactivar RLS automáticamente en ciertas condiciones

3. ❌ **Usuario no autenticado en Supabase**
   - Las queries se están haciendo sin `auth.uid()`
   - El token de autenticación no se está enviando correctamente

4. ❌ **Service Role Key no configurado**
   - Si estás usando el Anon Key (público), RLS siempre se aplica
   - Para desarrollo, necesitas el Service Role Key que bypasea RLS

### ✅ SOLUCIÓN DEFINITIVA: Usar Service Role Key para desarrollo

**NO deshabilitamos RLS** (mala práctica en producción). 
**En su lugar, usamos la Service Role Key que BYPASEA RLS automáticamente.**

#### Paso 1: Obtener Service Role Key

1. Ve a Supabase Dashboard
2. Settings → API
3. Busca "Service Role Key" (⚠️ SECRET - nunca commitear)
4. Copia la key

#### Paso 2: Actualizar `.env` local

```env
# .env (NO commitear este archivo)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publico
VITE_SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-SECRETO
```

#### Paso 3: Crear cliente especial para desarrollo

```typescript
// src/lib/supabase-dev.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Cliente con Service Role - BYPASEA RLS automáticamente
export const supabaseDev = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

#### Paso 4: Usar en servicios (solo desarrollo)

```typescript
// services/teacher/tasks.ts
import { supabaseDev as supabase } from '../../src/lib/supabase-dev';
// O usar import condicional basado en NODE_ENV
```

---

## 🔍 PROBLEMA 2: Datos Demo con Campos Incorrectos

### Análisis del archivo `supabase_seed_fase4.sql`

❌ **CAMPOS QUE NO EXISTEN en el schema real:**

#### Tabla `grupos`
- ❌ `nivel` → NO EXISTE (debería ser `grado`)
- ❌ `codigo_acceso` → NO EXISTE (no está en supabase_schema.sql)
- ✅ `nombre` → EXISTE
- ✅ `materia` → EXISTE
- ✅ `descripcion` → EXISTE

**Schema real:**
```sql
CREATE TABLE grupos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  escuela_id UUID REFERENCES escuelas(id) ON DELETE CASCADE,
  profesor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  grado TEXT,           -- ✅ grado, NO nivel
  seccion TEXT,
  materia TEXT,
  descripcion TEXT,
  color TEXT DEFAULT '#3B82F6',
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `tareas`
- ❌ `puntos_max` → NO EXISTE (debería ser `puntos_totales`)
- ✅ `titulo` → EXISTE
- ✅ `descripcion` → EXISTE
- ✅ `tipo` → EXISTE
- ✅ `fecha_entrega` → EXISTE

**Schema real:**
```sql
CREATE TABLE tareas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  profesor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT CHECK (tipo IN ('tarea', 'proyecto', 'lectura', 'practica')),
  fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_entrega TIMESTAMP WITH TIME ZONE,
  puntos_totales INTEGER DEFAULT 100,  -- ✅ puntos_totales, NO puntos_max
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `examenes`
- ❌ `fecha_inicio` → NO EXISTE (debería ser `fecha_programada`)
- ❌ `fecha_fin` → NO EXISTE (no hay campo de fin)
- ❌ `puntos_total` → NO EXISTE (debería ser `puntos_totales` con S)

**Schema real:**
```sql
CREATE TABLE examenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  profesor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT CHECK (tipo IN ('examen', 'quiz', 'evaluacion', 'diagnostico')),
  duracion_minutos INTEGER,
  fecha_programada TIMESTAMP WITH TIME ZONE,  -- ✅ fecha_programada, NO fecha_inicio
  puntos_totales INTEGER DEFAULT 100,          -- ✅ puntos_totales (con S)
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `calificaciones`
- ❌ `calificacion` → NO EXISTE (debería ser `puntuacion`)
- ❌ `tema` → NO EXISTE
- ❌ `subtema` → NO EXISTE
- ✅ `tipo_evaluacion` → EXISTE
- ✅ `fecha` → EXISTE (como `fecha_evaluacion`)

**Schema real:**
```sql
CREATE TABLE calificaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  escuela_id UUID REFERENCES escuelas(id) ON DELETE CASCADE,
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_evaluacion TEXT CHECK (tipo_evaluacion IN ('tarea', 'examen', 'participacion', 'proyecto')),
  referencia_id UUID,
  puntuacion DECIMAL(5,2),        -- ✅ puntuacion, NO calificacion
  puntos_totales INTEGER,
  porcentaje DECIMAL(5,2),
  fecha_evaluacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `grupos_alumnos`
- ❌ `activo` → NO EXISTE

**Schema real:**
```sql
CREATE TABLE grupos_alumnos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_inscripcion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(grupo_id, alumno_id)
);
```

---

## ✅ SOLUCIONES

### 1. **INMEDIATO: Configurar Service Role Key**

Esto resuelve el problema de RLS de inmediato para desarrollo.

### 2. **CORTO PLAZO: Corregir seed data**

Crear nuevo archivo `supabase_seed_corregido.sql` con los campos correctos.

### 3. **MEDIO PLAZO: Crear políticas RLS correctas**

Para producción, necesitamos políticas RLS bien configuradas:

```sql
-- Política: Profesores ven sus grupos
CREATE POLICY "profesores_ven_sus_grupos"
ON grupos FOR SELECT
USING (
  auth.uid() = profesor_id 
  OR 
  auth.uid() IN (
    SELECT id FROM usuarios WHERE rol = 'director' AND escuela_id = grupos.escuela_id
  )
);

-- Política: Alumnos ven sus grupos
CREATE POLICY "alumnos_ven_sus_grupos"
ON grupos FOR SELECT
USING (
  auth.uid() IN (
    SELECT alumno_id FROM grupos_alumnos WHERE grupo_id = grupos.id
  )
);
```

---

## 📋 CHECKLIST DE ACCIONES

### 🔴 URGENTE (Hacer AHORA)

- [ ] Obtener Service Role Key de Supabase Dashboard
- [ ] Crear archivo `.env.local` con VITE_SUPABASE_SERVICE_ROLE_KEY
- [ ] Crear `src/lib/supabase-dev.ts` con cliente especial
- [ ] Actualizar imports en `services/teacher/tasks.ts` a usar supabaseDev
- [ ] Probar que carga `/docente/grupos` sin error
- [ ] Probar que carga `/docente/tareas` sin error

### 🟡 IMPORTANTE (Siguiente)

- [ ] Crear `supabase_seed_corregido.sql` con campos correctos
- [ ] Ejecutar seed corregido en Supabase
- [ ] Verificar que datos se insertan correctamente
- [ ] Actualizar documentación con campos correctos

### 🟢 MEJORA (Después)

- [ ] Crear políticas RLS correctas para producción
- [ ] Documentar diferencia entre modo dev (service role) y prod (anon + RLS)
- [ ] Crear script de migración para actualizar campos incorrectos

---

## 🎯 RESULTADO ESPERADO

Después de aplicar la solución:

✅ **Funcionalidad desbloqueada:**
- Panel de profesor carga sin errores
- Lista de grupos se ve correctamente
- Sistema de tareas funciona
- Queries a Supabase se ejecutan sin "permission denied"

✅ **Datos consistentes:**
- Seed data usa campos que existen en schema
- No hay referencias a columnas inexistentes
- Todos los INSERTs se ejecutan sin error

✅ **Desarrollo ágil:**
- No más errores de RLS bloqueando desarrollo
- Queries funcionan de inmediato
- Testing más rápido y confiable

---

## 📚 REFERENCIAS

- [Supabase: Service Role vs Anon Key](https://supabase.com/docs/guides/api#api-keys)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase: Bypassing RLS](https://supabase.com/docs/guides/api/using-custom-schemas#bypass-rls)

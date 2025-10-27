# 🔴 SOLUCIÓN INMEDIATA: Deshabilitar RLS en Supabase

## ⚡ HAZ ESTO AHORA (2 minutos):

### Paso 1: Abre Supabase SQL Editor

1. Ve a: https://supabase.com/dashboard/project/ohtgbmqpudepbavjxrek/sql/new
2. O navega: Tu proyecto → **SQL Editor** (menú izquierdo) → **New query**

### Paso 2: Ejecuta este SQL

**Copia y pega TODO este código:**

```sql
-- Deshabilitar RLS en TODAS las tablas
ALTER TABLE IF EXISTS usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS escuelas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS grupos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS grupos_alumnos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tareas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS entregas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS examenes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS preguntas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS resultados_examenes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS respuestas_examen DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS calificaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS asistencias DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mensajes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notificaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contenido DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS archivos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS medallas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS usuarios_medallas DISABLE ROW LEVEL SECURITY;

-- Eliminar TODAS las políticas
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;
```

### Paso 3: Click en **RUN** (o Ctrl+Enter)

Debes ver: **"Success. No rows returned"**

### Paso 4: Verificar que funcionó

Ejecuta esta query:

```sql
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('usuarios', 'grupos', 'tareas')
ORDER BY tablename;
```

**Resultado esperado:**
```
tablename | rls_enabled
----------|------------
grupos    | false
tareas    | false
usuarios  | false
```

✅ **Todos deben ser `false`**

---

## 🎯 Después de ejecutar el SQL:

1. **Refresca tu aplicación** (Ctrl+R)
2. **Ve a "Mis Grupos"**
3. **El error debe desaparecer**

---

## 📸 CONFIRMA:

Ejecuta el SQL y dime:
- ✅ SQL ejecutado exitosamente
- ✅ Verificación muestra `rls_enabled = false`
- ✅ Aplicación carga sin error "permission denied"

**NO CONTINÚES hasta confirmar que funciona.**

-- ============================================
-- DESHABILITAR RLS PERMANENTEMENTE - TODAS LAS TABLAS
-- ============================================
-- Este script debe ejecutarse en Supabase SQL Editor
-- Deshabilita Row Level Security en TODAS las tablas del sistema

-- TABLAS PRINCIPALES
ALTER TABLE IF EXISTS usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS escuelas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS grupos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS grupos_alumnos DISABLE ROW LEVEL SECURITY;

-- TABLAS EDUCATIVAS
ALTER TABLE IF EXISTS tareas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS entregas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS examenes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS preguntas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS resultados_examenes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS respuestas_examen DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS calificaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS asistencias DISABLE ROW LEVEL SECURITY;

-- TABLAS DE COMUNICACIÓN
ALTER TABLE IF EXISTS mensajes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notificaciones DISABLE ROW LEVEL SECURITY;

-- TABLAS DE CONTENIDO
ALTER TABLE IF EXISTS contenido DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS archivos DISABLE ROW LEVEL SECURITY;

-- TABLAS DE MEDALLAS Y GAMIFICACIÓN
ALTER TABLE IF EXISTS medallas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS usuarios_medallas DISABLE ROW LEVEL SECURITY;

-- ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
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

-- VERIFICAR QUE RLS ESTÁ DESHABILITADO
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'usuarios', 'escuelas', 'grupos', 'grupos_alumnos', 
    'tareas', 'entregas', 'examenes', 'preguntas', 
    'resultados_examenes', 'respuestas_examen', 'calificaciones', 'asistencias',
    'mensajes', 'notificaciones', 'contenido', 'archivos',
    'medallas', 'usuarios_medallas'
)
ORDER BY tablename;

-- Resultado esperado: Todas las tablas con rls_enabled = false

-- ============================================
-- NOTA IMPORTANTE:
-- Si alguna tabla no existe, el comando IF EXISTS la ignorará
-- Si necesitas crear las tablas, ejecuta primero supabase_schema.sql
-- ============================================

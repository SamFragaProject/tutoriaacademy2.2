-- ============================================
-- DESHABILITAR RLS EN TODAS LAS TABLAS
-- Para desarrollo sin restricciones de permisos
-- ============================================

-- IMPORTANTE: Ejecutar esto en Supabase SQL Editor
-- Esto permitirá acceso completo a todas las tablas sin políticas RLS

-- Deshabilitar RLS en tablas principales
ALTER TABLE IF EXISTS usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS grupos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS grupos_alumnos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tareas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS entregas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS examenes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS preguntas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS resultados_examenes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS calificaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS asistencias DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mensajes DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está deshabilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'usuarios', 'grupos', 'grupos_alumnos', 'tareas', 'entregas',
    'examenes', 'preguntas', 'resultados_examenes', 'calificaciones',
    'asistencias', 'mensajes'
)
ORDER BY tablename;

-- Resultado esperado: todas las tablas deben mostrar rls_enabled = false

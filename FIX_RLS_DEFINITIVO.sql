-- ============================================
-- FIX DEFINITIVO RLS - EJECUTAR EN SUPABASE
-- ============================================
-- Este script deshabilita RLS en TODAS las tablas
-- y elimina TODAS las políticas para desarrollo

-- PASO 1: DESHABILITAR RLS EN TODAS LAS TABLAS
ALTER TABLE IF EXISTS usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS escuelas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS grupos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS grupos_alumnos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tareas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS entregas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS entregas_tareas DISABLE ROW LEVEL SECURITY;
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

-- PASO 2: ELIMINAR TODAS LAS POLÍTICAS
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Eliminar todas las políticas de todas las tablas
    FOR r IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                r.policyname, r.schemaname, r.tablename);
        EXCEPTION WHEN OTHERS THEN
            -- Ignorar errores y continuar
            NULL;
        END;
    END LOOP;
END $$;

-- PASO 3: VERIFICACIÓN
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN (
        'usuarios', 'escuelas', 'grupos', 'grupos_alumnos',
        'tareas', 'entregas', 'examenes', 'calificaciones', 'asistencias'
    )
ORDER BY tablename;

-- RESULTADO ESPERADO: Todas las tablas con rls_enabled = false

-- PASO 4: PROBAR QUERY
SELECT id, nombre, materia FROM grupos LIMIT 3;

-- Si esto funciona sin error "permission denied", el problema está resuelto

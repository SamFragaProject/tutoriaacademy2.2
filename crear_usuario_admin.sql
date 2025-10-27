-- ============================================
-- CREAR USUARIO ADMIN + DESHABILITAR RLS
-- ============================================

-- PASO 1: DESHABILITAR RLS EN TODAS LAS TABLAS
ALTER TABLE IF EXISTS usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS escuelas DISABLE ROW LEVEL SECURITY;
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

-- PASO 2: CREAR USUARIO ADMIN
-- OPCIÓN FÁCIL: Desactivar temporalmente la foreign key, crear el usuario, y reactivarla

-- Desactivar constraint temporalmente
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_id_fkey;

-- Crear usuario admin (sin foreign key)
INSERT INTO usuarios (
    id,
    nombre,
    apellidos,
    email,
    rol,
    activo,
    fecha_creacion
) VALUES (
    gen_random_uuid(),
    'Admin',
    'Sistema',
    'admin@tutoria.com',
    'admin',
    true,
    NOW()
) ON CONFLICT (email) DO UPDATE 
SET rol = 'admin', activo = true;

-- Re-agregar constraint (opcional - puedes dejarlo sin foreign key para desarrollo)
-- ALTER TABLE usuarios ADD CONSTRAINT usuarios_id_fkey 
-- FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- PASO 3: VERIFICAR QUE SE CREÓ
SELECT id, nombre, apellidos, email, rol, activo 
FROM usuarios 
WHERE email = 'admin@tutoria.com';

-- PASO 4: VERIFICAR QUE RLS ESTÁ DESHABILITADO
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('usuarios', 'escuelas', 'grupos', 'grupos_alumnos', 'tareas', 'entregas', 'examenes', 'preguntas', 'resultados_examenes', 'calificaciones', 'asistencias', 'mensajes')
ORDER BY tablename;

-- Resultado esperado:
-- 1. Usuario admin creado con email: admin@tutoria.com
-- 2. Todas las tablas con rls_enabled = false

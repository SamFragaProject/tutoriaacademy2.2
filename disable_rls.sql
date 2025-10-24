-- ============================================
-- DESHABILITAR RLS COMPLETAMENTE (PARA TESTING)
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Eliminar TODAS las políticas existentes
DROP POLICY IF EXISTS "Allow all for authenticated users" ON usuarios;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON escuelas;
DROP POLICY IF EXISTS "Users can read own data" ON usuarios;
DROP POLICY IF EXISTS "Users can read own school data" ON escuelas;
DROP POLICY IF EXISTS "Enable read access for all users" ON usuarios;
DROP POLICY IF EXISTS "Enable read access for all users" ON escuelas;

-- 2. Deshabilitar RLS completamente
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE escuelas DISABLE ROW LEVEL SECURITY;

-- 3. Verificar que se deshabilitó correctamente
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('usuarios', 'escuelas');

-- Deberías ver rowsecurity = false para ambas tablas

-- 4. Verificar usuario actual
SELECT * FROM usuarios WHERE id = 'dfa0ebf7-832a-4e74-884f-727b2f9ba5d4';

-- Si no existe, crearlo:
INSERT INTO usuarios (id, escuela_id, email, nombre, apellidos, rol) 
VALUES (
  'dfa0ebf7-832a-4e74-884f-727b2f9ba5d4',
  '11111111-1111-1111-1111-111111111111',
  'profesor@demo.com',
  'Juan',
  'Martínez',
  'profesor'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nombre = EXCLUDED.nombre,
  apellidos = EXCLUDED.apellidos,
  rol = EXCLUDED.rol;

-- 5. Verificar que ahora funciona la consulta
SELECT * FROM usuarios LIMIT 5;

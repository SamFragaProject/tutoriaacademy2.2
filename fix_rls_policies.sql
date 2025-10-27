-- ============================================
-- FIX RLS POLICIES - Permitir acceso temporal
-- ============================================

-- 1. Agregar columna activo a grupos si no existe
ALTER TABLE grupos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- 2. Desactivar temporalmente RLS en grupos para debug
ALTER TABLE grupos DISABLE ROW LEVEL SECURITY;

-- 3. O alternativamente, crear una policy más permisiva temporal
-- Eliminar policy restrictiva
DROP POLICY IF EXISTS "Profesores ven sus grupos" ON grupos;

-- Crear policy temporal que permita a todos los usuarios autenticados ver grupos
CREATE POLICY "Todos los autenticados ven grupos (temporal)" ON grupos
    FOR SELECT USING (auth.role() = 'authenticated');

-- 4. Verificar que el usuario existe en la tabla usuarios
-- Ejecuta esto para ver qué usuarios tienes:
-- SELECT id, email, rol FROM usuarios WHERE email = 'profesor@demo.com';

-- 5. Si necesitas vincular el auth.uid() con el usuario en la tabla:
-- UPDATE usuarios SET id = auth.uid() WHERE email = 'profesor@demo.com';

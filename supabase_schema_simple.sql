-- ============================================
-- SCHEMA SIMPLIFICADO PARA TESTING
-- TutoriA Academy B2B - Supabase
-- ============================================

-- 1. Crear tabla de escuelas
CREATE TABLE IF NOT EXISTS escuelas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  direccion TEXT,
  telefono TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escuela_id UUID REFERENCES escuelas(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  apellidos TEXT,
  rol TEXT NOT NULL CHECK (rol IN ('alumno', 'profesor', 'director', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Habilitar Row Level Security
ALTER TABLE escuelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS básicas (permitir todo por ahora para testing)
CREATE POLICY "Allow all for authenticated users" ON escuelas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON usuarios
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Insertar escuela de prueba
INSERT INTO escuelas (id, nombre, email)
VALUES ('11111111-1111-1111-1111-111111111111', 'Escuela Demo', 'demo@escuela.com')
ON CONFLICT (id) DO NOTHING;

-- 6. Insertar usuarios de prueba
INSERT INTO usuarios (id, escuela_id, email, nombre, apellidos, rol) VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'profesor@demo.com', 'Juan', 'Martínez', 'profesor'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'director@demo.com', 'María', 'García', 'director'),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'alumno1@demo.com', 'Carlos', 'López', 'alumno'),
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'alumno2@demo.com', 'Ana', 'Rodríguez', 'alumno'),
  ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'alumno3@demo.com', 'Luis', 'Fernández', 'alumno')
ON CONFLICT (id) DO NOTHING;

-- 7. Crear usuarios en Supabase Auth
-- IMPORTANTE: Debes ejecutar esto MANUALMENTE en el SQL Editor de Supabase
-- porque requiere permisos especiales de auth.users

-- Para crear usuarios de autenticación, ve a:
-- Dashboard -> Authentication -> Users -> Add User
-- O ejecuta estos comandos en SQL Editor:

/*
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES
  ('22222222-2222-2222-2222-222222222222', 'profesor@demo.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', false, 'authenticated'),
  ('33333333-3333-3333-3333-333333333333', 'director@demo.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', false, 'authenticated'),
  ('44444444-4444-4444-4444-444444444444', 'alumno1@demo.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', false, 'authenticated'),
  ('55555555-5555-5555-5555-555555555555', 'alumno2@demo.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', false, 'authenticated'),
  ('66666666-6666-6666-6666-666666666666', 'alumno3@demo.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', false, 'authenticated')
ON CONFLICT (id) DO NOTHING;
*/

-- NOTA: Si el INSERT en auth.users falla, usa la interfaz web:
-- Dashboard -> Authentication -> Add user manually

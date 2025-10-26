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

-- ============================================
-- EXTENSIÓN: TABLAS PARA ROL PROFESOR
-- ============================================

-- 8. Crear tabla de grupos (cursos/clases)
CREATE TABLE IF NOT EXISTS grupos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escuela_id UUID REFERENCES escuelas(id) ON DELETE CASCADE,
  profesor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  materia TEXT NOT NULL,
  grado TEXT,
  seccion TEXT,
  descripcion TEXT,
  color TEXT DEFAULT '#6F5BFF',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Crear tabla de alumnos en grupos (matrícula)
CREATE TABLE IF NOT EXISTS grupos_alumnos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_inscripcion TIMESTAMPTZ DEFAULT NOW(),
  activo BOOLEAN DEFAULT true,
  UNIQUE(grupo_id, alumno_id)
);

-- 10. Crear tabla de tareas
CREATE TABLE IF NOT EXISTS tareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  profesor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT CHECK (tipo IN ('tarea', 'proyecto', 'lectura', 'practica')),
  fecha_asignacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_entrega TIMESTAMPTZ,
  puntos_totales INTEGER DEFAULT 100,
  activo BOOLEAN DEFAULT true
);

-- 11. Crear tabla de exámenes
CREATE TABLE IF NOT EXISTS examenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  profesor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT CHECK (tipo IN ('examen', 'quiz', 'evaluacion', 'diagnostico')),
  duracion_minutos INTEGER,
  fecha_programada TIMESTAMPTZ,
  puntos_totales INTEGER DEFAULT 100,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Crear tabla de calificaciones
CREATE TABLE IF NOT EXISTS calificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escuela_id UUID REFERENCES escuelas(id) ON DELETE CASCADE,
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_evaluacion TEXT CHECK (tipo_evaluacion IN ('tarea', 'examen', 'participacion', 'proyecto')),
  referencia_id UUID, -- ID de la tarea o examen
  tema TEXT,
  subtema TEXT,
  puntuacion DECIMAL(5,2),
  puntos_totales INTEGER,
  porcentaje DECIMAL(5,2),
  fecha_evaluacion TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Habilitar RLS en nuevas tablas
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos_alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE examenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calificaciones ENABLE ROW LEVEL SECURITY;

-- 14. Políticas RLS básicas (permitir todo por ahora para testing)
CREATE POLICY "Allow all for authenticated users" ON grupos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON grupos_alumnos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON tareas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON examenes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON calificaciones
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 15. Insertar datos de prueba para grupos
INSERT INTO grupos (id, escuela_id, profesor_id, nombre, materia, grado, seccion) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '3°A Matemáticas', 'Matemáticas', '3', 'A'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '2°B Física', 'Física', '2', 'B'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '1°C Historia', 'Historia', '1', 'C')
ON CONFLICT (id) DO NOTHING;

-- 16. Matricular alumnos en grupos
INSERT INTO grupos_alumnos (grupo_id, alumno_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '66666666-6666-6666-6666-666666666666')
ON CONFLICT (grupo_id, alumno_id) DO NOTHING;

-- 17. Insertar calificaciones de prueba para heatmap
INSERT INTO calificaciones (escuela_id, grupo_id, alumno_id, tipo_evaluacion, tema, subtema, puntuacion, puntos_totales, porcentaje) VALUES
  -- Grupo 3°A - Álgebra
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'examen', 'Álgebra', 'Ecuaciones lineales', 85, 100, 85),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'examen', 'Álgebra', 'Ecuaciones lineales', 92, 100, 92),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 'examen', 'Álgebra', 'Ecuaciones lineales', 78, 100, 78),
  -- Geometría
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'examen', 'Geometría', 'Triángulos', 70, 100, 70),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'examen', 'Geometría', 'Triángulos', 88, 100, 88),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 'examen', 'Geometría', 'Triángulos', 65, 100, 65),
  -- Grupo 2°B - Física
  ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'examen', 'Mecánica', 'Cinemática', 90, 100, 90),
  ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'examen', 'Mecánica', 'Cinemática', 82, 100, 82)
ON CONFLICT DO NOTHING;

-- ============================================
-- SCHEMA DE BASE DE DATOS PARA TUTORIA ACADEMY
-- ============================================
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. EXTENSIONES NECESARIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 2. TABLAS PRINCIPALES
-- ============================================

-- Tabla: Escuelas (B2B - Cada escuela es un cliente)
CREATE TABLE escuelas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  direccion TEXT,
  telefono TEXT,
  email TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  activo BOOLEAN DEFAULT true,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Usuarios (Alumnos, Profesores, Directores, Admins)
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  escuela_id UUID REFERENCES escuelas(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  apellidos TEXT,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT,
  rol TEXT NOT NULL CHECK (rol IN ('alumno', 'profesor', 'director', 'admin')),
  avatar_url TEXT,
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Grupos (Clases/Cursos)
CREATE TABLE grupos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  escuela_id UUID REFERENCES escuelas(id) ON DELETE CASCADE,
  profesor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  grado TEXT,
  seccion TEXT,
  materia TEXT,
  descripcion TEXT,
  color TEXT DEFAULT '#3B82F6',
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Alumnos en Grupos (Relación muchos a muchos)
CREATE TABLE grupos_alumnos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_inscripcion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(grupo_id, alumno_id)
);

-- Tabla: Tareas
CREATE TABLE tareas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  profesor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT CHECK (tipo IN ('tarea', 'proyecto', 'lectura', 'practica')),
  fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_entrega TIMESTAMP WITH TIME ZONE,
  puntos_totales INTEGER DEFAULT 100,
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Entregas de Tareas
CREATE TABLE entregas_tareas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tarea_id UUID REFERENCES tareas(id) ON DELETE CASCADE,
  alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  contenido TEXT,
  archivo_url TEXT,
  calificacion INTEGER,
  retroalimentacion TEXT,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'entregada', 'calificada', 'tarde')),
  fecha_entrega TIMESTAMP WITH TIME ZONE,
  fecha_calificacion TIMESTAMP WITH TIME ZONE,
  UNIQUE(tarea_id, alumno_id)
);

-- Tabla: Exámenes
CREATE TABLE examenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  profesor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT CHECK (tipo IN ('examen', 'quiz', 'evaluacion', 'diagnostico')),
  duracion_minutos INTEGER,
  fecha_programada TIMESTAMP WITH TIME ZONE,
  puntos_totales INTEGER DEFAULT 100,
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Preguntas de Examen
CREATE TABLE preguntas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  examen_id UUID REFERENCES examenes(id) ON DELETE CASCADE,
  profesor_id UUID REFERENCES usuarios(id),
  tipo TEXT CHECK (tipo IN ('opcion_multiple', 'verdadero_falso', 'respuesta_corta', 'ensayo')),
  pregunta TEXT NOT NULL,
  opciones JSONB,
  respuesta_correcta TEXT,
  puntos INTEGER DEFAULT 1,
  orden INTEGER,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Resultados de Exámenes
CREATE TABLE resultados_examenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  examen_id UUID REFERENCES examenes(id) ON DELETE CASCADE,
  alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  respuestas JSONB,
  calificacion INTEGER,
  retroalimentacion TEXT,
  tiempo_inicio TIMESTAMP WITH TIME ZONE,
  tiempo_fin TIMESTAMP WITH TIME ZONE,
  estado TEXT DEFAULT 'en_progreso' CHECK (estado IN ('en_progreso', 'completado', 'calificado')),
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(examen_id, alumno_id)
);

-- Tabla: Calificaciones (Vista general)
CREATE TABLE calificaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  escuela_id UUID REFERENCES escuelas(id) ON DELETE CASCADE,
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_evaluacion TEXT CHECK (tipo_evaluacion IN ('tarea', 'examen', 'participacion', 'proyecto')),
  referencia_id UUID,
  puntuacion DECIMAL(5,2),
  puntos_totales INTEGER,
  porcentaje DECIMAL(5,2),
  fecha_evaluacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Asistencias
CREATE TABLE asistencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  estado TEXT CHECK (estado IN ('presente', 'ausente', 'tarde', 'justificado')),
  notas TEXT,
  registrado_por UUID REFERENCES usuarios(id),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(grupo_id, alumno_id, fecha)
);

-- Tabla: Mensajes/Comunicación
CREATE TABLE mensajes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  escuela_id UUID REFERENCES escuelas(id) ON DELETE CASCADE,
  remitente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  destinatario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  grupo_id UUID REFERENCES grupos(id) ON DELETE SET NULL,
  asunto TEXT,
  contenido TEXT NOT NULL,
  leido BOOLEAN DEFAULT false,
  fecha_lectura TIMESTAMP WITH TIME ZONE,
  fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

CREATE INDEX idx_usuarios_escuela ON usuarios(escuela_id);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_grupos_escuela ON grupos(escuela_id);
CREATE INDEX idx_grupos_profesor ON grupos(profesor_id);
CREATE INDEX idx_tareas_grupo ON tareas(grupo_id);
CREATE INDEX idx_examenes_grupo ON examenes(grupo_id);
CREATE INDEX idx_calificaciones_alumno ON calificaciones(alumno_id);
CREATE INDEX idx_mensajes_destinatario ON mensajes(destinatario_id);
CREATE INDEX idx_asistencias_grupo_fecha ON asistencias(grupo_id, fecha);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE escuelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos_alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas_tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE examenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultados_examenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS - USUARIOS
-- ============================================

CREATE POLICY "Usuarios ven su escuela"
ON usuarios FOR SELECT
USING (
  escuela_id IN (
    SELECT escuela_id FROM usuarios WHERE id = auth.uid()
  )
);

-- ============================================
-- POLÍTICAS RLS - GRUPOS
-- ============================================

CREATE POLICY "Usuarios ven grupos de su escuela"
ON grupos FOR SELECT
USING (
  escuela_id IN (
    SELECT escuela_id FROM usuarios WHERE id = auth.uid()
  )
);

CREATE POLICY "Profesores crean grupos"
ON grupos FOR INSERT
WITH CHECK (
  profesor_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND rol IN ('profesor', 'director')
  )
);

CREATE POLICY "Profesores modifican sus grupos"
ON grupos FOR UPDATE
USING (profesor_id = auth.uid());

-- ============================================
-- POLÍTICAS RLS - TAREAS
-- ============================================

CREATE POLICY "Alumnos ven tareas de sus grupos"
ON tareas FOR SELECT
USING (
  grupo_id IN (
    SELECT grupo_id FROM grupos_alumnos WHERE alumno_id = auth.uid()
  )
);

CREATE POLICY "Profesores ven tareas de sus grupos"
ON tareas FOR SELECT
USING (
  grupo_id IN (
    SELECT id FROM grupos WHERE profesor_id = auth.uid()
  )
);

CREATE POLICY "Profesores crean tareas"
ON tareas FOR INSERT
WITH CHECK (
  profesor_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND rol IN ('profesor', 'director')
  )
);

-- ============================================
-- POLÍTICAS RLS - CALIFICACIONES
-- ============================================

CREATE POLICY "Alumnos ven sus calificaciones"
ON calificaciones FOR SELECT
USING (alumno_id = auth.uid());

CREATE POLICY "Profesores ven calificaciones de sus grupos"
ON calificaciones FOR SELECT
USING (
  grupo_id IN (
    SELECT id FROM grupos WHERE profesor_id = auth.uid()
  )
);

CREATE POLICY "Profesores insertan calificaciones"
ON calificaciones FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND rol IN ('profesor', 'director')
  )
);

-- ============================================
-- POLÍTICAS RLS - MENSAJES
-- ============================================

CREATE POLICY "Usuarios ven sus mensajes"
ON mensajes FOR SELECT
USING (
  remitente_id = auth.uid() OR 
  destinatario_id = auth.uid()
);

CREATE POLICY "Usuarios envían mensajes"
ON mensajes FOR INSERT
WITH CHECK (remitente_id = auth.uid());

-- ============================================
-- 5. FUNCIONES ÚTILES
-- ============================================

CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER actualizar_escuelas_fecha
  BEFORE UPDATE ON escuelas
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_fecha_actualizacion();

CREATE TRIGGER actualizar_usuarios_fecha
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_fecha_actualizacion();

CREATE TRIGGER actualizar_grupos_fecha
  BEFORE UPDATE ON grupos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- ============================================
-- 6. DATOS DE PRUEBA
-- ============================================

-- Insertar escuela de prueba
INSERT INTO escuelas (id, nombre, plan, direccion, telefono, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Escuela Demo TutoriA', 'pro', 'Av. Educación 123, CDMX', '555-1234', 'contacto@demo.mx');

-- ============================================
-- 7. FUNCIÓN PARA CREAR USUARIOS DE PRUEBA
-- ============================================

CREATE OR REPLACE FUNCTION crear_usuario_prueba(
  p_email TEXT,
  p_password TEXT,
  p_nombre TEXT,
  p_apellidos TEXT,
  p_rol TEXT,
  p_escuela_id UUID
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_encrypted_password TEXT;
BEGIN
  v_user_id := gen_random_uuid();
  v_encrypted_password := crypt(p_password, gen_salt('bf'));
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    p_email,
    v_encrypted_password,
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    'authenticated',
    'authenticated'
  );
  
  INSERT INTO usuarios (
    id,
    escuela_id,
    nombre,
    apellidos,
    email,
    rol,
    activo
  ) VALUES (
    v_user_id,
    p_escuela_id,
    p_nombre,
    p_apellidos,
    p_email,
    p_rol,
    true
  );
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. CREAR USUARIOS DE PRUEBA
-- ============================================

DO $$
DECLARE
  v_profesor_id UUID;
  v_alumno1_id UUID;
  v_alumno2_id UUID;
  v_alumno3_id UUID;
  v_director_id UUID;
  v_grupo1_id UUID;
  v_grupo2_id UUID;
BEGIN
  -- Crear Profesor
  v_profesor_id := crear_usuario_prueba(
    'profesor@demo.com',
    'password123',
    'María',
    'González',
    'profesor',
    '11111111-1111-1111-1111-111111111111'
  );
  
  -- Crear Director
  v_director_id := crear_usuario_prueba(
    'director@demo.com',
    'password123',
    'Carlos',
    'Ramírez',
    'director',
    '11111111-1111-1111-1111-111111111111'
  );
  
  -- Crear Alumnos
  v_alumno1_id := crear_usuario_prueba(
    'alumno1@demo.com',
    'password123',
    'Juan',
    'Pérez',
    'alumno',
    '11111111-1111-1111-1111-111111111111'
  );
  
  v_alumno2_id := crear_usuario_prueba(
    'alumno2@demo.com',
    'password123',
    'Ana',
    'López',
    'alumno',
    '11111111-1111-1111-1111-111111111111'
  );
  
  v_alumno3_id := crear_usuario_prueba(
    'alumno3@demo.com',
    'password123',
    'Pedro',
    'Martínez',
    'alumno',
    '11111111-1111-1111-1111-111111111111'
  );
  
  -- Crear Grupo 1
  INSERT INTO grupos (escuela_id, profesor_id, nombre, grado, seccion, materia, descripcion, color)
  VALUES ('11111111-1111-1111-1111-111111111111', v_profesor_id, 'Matemáticas 3A', '3', 'A', 'Matemáticas', 'Álgebra y geometría básica', '#3B82F6')
  RETURNING id INTO v_grupo1_id;
  
  -- Crear Grupo 2
  INSERT INTO grupos (escuela_id, profesor_id, nombre, grado, seccion, materia, descripcion, color)
  VALUES ('11111111-1111-1111-1111-111111111111', v_profesor_id, 'Física 3B', '3', 'B', 'Física', 'Cinemática y dinámica', '#10B981')
  RETURNING id INTO v_grupo2_id;
  
  -- Inscribir alumnos en el primer grupo
  INSERT INTO grupos_alumnos (grupo_id, alumno_id)
  VALUES 
    (v_grupo1_id, v_alumno1_id),
    (v_grupo1_id, v_alumno2_id),
    (v_grupo1_id, v_alumno3_id);
  
  -- Inscribir alumnos en el segundo grupo
  INSERT INTO grupos_alumnos (grupo_id, alumno_id)
  VALUES 
    (v_grupo2_id, v_alumno1_id),
    (v_grupo2_id, v_alumno2_id);
  
  -- Crear tareas de ejemplo
  INSERT INTO tareas (grupo_id, profesor_id, titulo, descripcion, tipo, fecha_entrega, puntos_totales)
  VALUES 
    (v_grupo1_id, v_profesor_id, 'Resolver ecuaciones cuadráticas', 'Completar ejercicios del capítulo 5', 'tarea', NOW() + INTERVAL '7 days', 100),
    (v_grupo1_id, v_profesor_id, 'Proyecto: Teorema de Pitágoras', 'Crear presentación sobre aplicaciones reales', 'proyecto', NOW() + INTERVAL '14 days', 200);
  
  -- Crear examen de ejemplo
  INSERT INTO examenes (grupo_id, profesor_id, titulo, descripcion, tipo, duracion_minutos, fecha_programada, puntos_totales)
  VALUES 
    (v_grupo1_id, v_profesor_id, 'Examen Parcial - Álgebra', 'Evaluación de los temas 1-5', 'examen', 90, NOW() + INTERVAL '10 days', 100);
  
  RAISE NOTICE '===========================================';
  RAISE NOTICE '✅ USUARIOS DE PRUEBA CREADOS EXITOSAMENTE!';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Profesor: profesor@demo.com / password123';
  RAISE NOTICE 'Director: director@demo.com / password123';
  RAISE NOTICE 'Alumno 1: alumno1@demo.com / password123';
  RAISE NOTICE 'Alumno 2: alumno2@demo.com / password123';
  RAISE NOTICE 'Alumno 3: alumno3@demo.com / password123';
  RAISE NOTICE '===========================================';
END $$;

-- ============================================
-- FIN DEL SCHEMA
-- ============================================

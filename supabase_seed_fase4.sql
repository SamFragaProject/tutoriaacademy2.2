-- ============================================
-- DATOS DE PRUEBA - TutoriA Academy
-- Fase 4: Seed data para testing
-- ============================================

-- Nota: Estos INSERTs asumen que ya existen usuarios demo
-- profesor@demo.com, alumno@demo.com en la tabla usuarios

-- ==========================================
-- 1. CREAR GRUPOS DE EJEMPLO
-- ==========================================
INSERT INTO grupos (id, escuela_id, profesor_id, nombre, materia, nivel, descripcion, codigo_acceso, activo)
VALUES
    ('a0000001-0000-0000-0000-000000000001', 
     (SELECT escuela_id FROM usuarios WHERE email = 'profesor@demo.com' LIMIT 1),
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Matem�ticas 1A', 'Matem�ticas', 'Primaria', 
     'Grupo de matem�ticas b�sicas para primer grado', 'MAT1A2024', true),
    
    ('a0000001-0000-0000-0000-000000000002',
     (SELECT escuela_id FROM usuarios WHERE email = 'profesor@demo.com' LIMIT 1),
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     '�lgebra 2B', 'Matem�ticas', 'Secundaria',
     '�lgebra intermedia para segundo de secundaria', 'ALG2B2024', true),
    
    ('a0000001-0000-0000-0000-000000000003',
     (SELECT escuela_id FROM usuarios WHERE email = 'profesor@demo.com' LIMIT 1),
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Lengua 3C', 'Lengua y Literatura', 'Secundaria',
     'An�lisis literario y gram�tica avanzada', 'LEN3C2024', true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 2. INSCRIBIR ALUMNOS A GRUPOS
-- ==========================================
INSERT INTO grupos_alumnos (grupo_id, alumno_id, activo)
SELECT 
    'a0000001-0000-0000-0000-000000000001',
    id,
    true
FROM usuarios
WHERE rol = 'estudiante'
LIMIT 10
ON CONFLICT DO NOTHING;

INSERT INTO grupos_alumnos (grupo_id, alumno_id, activo)
SELECT 
    'a0000001-0000-0000-0000-000000000002',
    id,
    true
FROM usuarios
WHERE rol = 'estudiante'
LIMIT 8
ON CONFLICT DO NOTHING;

-- ==========================================
-- 3. CREAR TAREAS
-- ==========================================
INSERT INTO tareas (id, grupo_id, profesor_id, titulo, descripcion, tipo, fecha_entrega, puntos_max)
VALUES
    ('b0000001-0000-0000-0000-000000000001',
     'a0000001-0000-0000-0000-000000000001',
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Operaciones B�sicas', 
     'Resolver las operaciones de suma y resta de la p�gina 45',
     'tarea',
     NOW() + INTERVAL '7 days',
     100),
    
    ('b0000001-0000-0000-0000-000000000002',
     'a0000001-0000-0000-0000-000000000002',
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Ecuaciones Lineales',
     'Resolver los ejercicios 1-20 del cap�tulo 3',
     'practica',
     NOW() + INTERVAL '5 days',
     100)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 4. CREAR EX�MENES
-- ==========================================
INSERT INTO examenes (id, grupo_id, profesor_id, titulo, tipo, duracion_minutos, fecha_inicio, fecha_fin, puntos_total)
VALUES
    ('c0000001-0000-0000-0000-000000000001',
     'a0000001-0000-0000-0000-000000000001',
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Examen Parcial - Aritm�tica',
     'examen',
     60,
     NOW() + INTERVAL '3 days',
     NOW() + INTERVAL '4 days',
     100),
    
    ('c0000001-0000-0000-0000-000000000002',
     'a0000001-0000-0000-0000-000000000002',
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Quiz R�pido - �lgebra',
     'quiz',
     30,
     NOW() + INTERVAL '1 day',
     NOW() + INTERVAL '1 day' + INTERVAL '2 hours',
     50)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 5. CREAR CALIFICACIONES DE EJEMPLO
-- ==========================================
-- Insertar calificaciones para diferentes subtemas
INSERT INTO calificaciones (alumno_id, grupo_id, tipo_evaluacion, calificacion, puntos_obtenidos, puntos_totales, tema, subtema, fecha)
SELECT 
    ga.alumno_id,
    ga.grupo_id,
    'examen',
    (70 + (RANDOM() * 30))::DECIMAL(5,2),
    (70 + (RANDOM() * 30))::INTEGER,
    100,
    'N�meros y Operaciones',
    'Suma y Resta',
    NOW() - INTERVAL '10 days'
FROM grupos_alumnos ga
WHERE ga.grupo_id = 'a0000001-0000-0000-0000-000000000001'
LIMIT 10
ON CONFLICT DO NOTHING;

INSERT INTO calificaciones (alumno_id, grupo_id, tipo_evaluacion, calificacion, puntos_obtenidos, puntos_totales, tema, subtema, fecha)
SELECT 
    ga.alumno_id,
    ga.grupo_id,
    'examen',
    (60 + (RANDOM() * 40))::DECIMAL(5,2),
    (60 + (RANDOM() * 40))::INTEGER,
    100,
    'N�meros y Operaciones',
    'Multiplicaci�n',
    NOW() - INTERVAL '8 days'
FROM grupos_alumnos ga
WHERE ga.grupo_id = 'a0000001-0000-0000-0000-000000000001'
LIMIT 10
ON CONFLICT DO NOTHING;

INSERT INTO calificaciones (alumno_id, grupo_id, tipo_evaluacion, calificacion, puntos_obtenidos, puntos_totales, tema, subtema, fecha)
SELECT 
    ga.alumno_id,
    ga.grupo_id,
    'examen',
    (75 + (RANDOM() * 25))::DECIMAL(5,2),
    (75 + (RANDOM() * 25))::INTEGER,
    100,
    '�lgebra',
    'Ecuaciones de Primer Grado',
    NOW() - INTERVAL '5 days'
FROM grupos_alumnos ga
WHERE ga.grupo_id = 'a0000001-0000-0000-0000-000000000002'
LIMIT 8
ON CONFLICT DO NOTHING;

-- ==========================================
-- 6. CREAR ASISTENCIAS
-- ==========================================
-- Generar asistencias para los �ltimos 30 d�as
INSERT INTO asistencias (grupo_id, alumno_id, fecha, estado)
SELECT 
    ga.grupo_id,
    ga.alumno_id,
    (NOW() - ('1 day'::INTERVAL * gs.day_offset))::DATE,
    CASE 
        WHEN RANDOM() < 0.85 THEN 'presente'
        WHEN RANDOM() < 0.95 THEN 'tarde'
        ELSE 'ausente'
    END
FROM grupos_alumnos ga
CROSS JOIN generate_series(0, 29) AS gs(day_offset)
WHERE ga.grupo_id IN (
    'a0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000002'
)
ON CONFLICT DO NOTHING;

-- ==========================================
-- FIN DE SEED DATA
-- ==========================================


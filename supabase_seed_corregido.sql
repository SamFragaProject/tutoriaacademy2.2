-- ============================================
-- DATOS DE PRUEBA CORREGIDOS - TutoriA Academy
-- Todos los campos coinciden con supabase_schema.sql
-- ============================================

-- ==========================================
-- 1. CREAR GRUPOS DE EJEMPLO
-- ==========================================
-- ✅ CORREGIDO: 
--   - nivel → grado
--   - codigo_acceso eliminado (no existe en schema)

INSERT INTO grupos (id, escuela_id, profesor_id, nombre, materia, grado, seccion, descripcion, activo)
VALUES
    ('a0000001-0000-0000-0000-000000000001', 
     (SELECT escuela_id FROM usuarios WHERE email = 'profesor@demo.com' LIMIT 1),
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Matemáticas 1A', 
     'Matemáticas', 
     'Primaria',  -- ✅ grado (antes era "nivel")
     'A',
     'Grupo de matemáticas básicas para primer grado', 
     true),
    
    ('a0000001-0000-0000-0000-000000000002',
     (SELECT escuela_id FROM usuarios WHERE email = 'profesor@demo.com' LIMIT 1),
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Álgebra 2B', 
     'Matemáticas', 
     'Secundaria',  -- ✅ grado
     'B',
     'Álgebra intermedia para segundo de secundaria', 
     true),
    
    ('a0000001-0000-0000-0000-000000000003',
     (SELECT escuela_id FROM usuarios WHERE email = 'profesor@demo.com' LIMIT 1),
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Lengua 3C', 
     'Lengua y Literatura', 
     'Secundaria',  -- ✅ grado
     'C',
     'Análisis literario y gramática avanzada', 
     true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 2. INSCRIBIR ALUMNOS A GRUPOS
-- ==========================================
-- ✅ CORREGIDO: Eliminado campo "activo" (no existe)

INSERT INTO grupos_alumnos (grupo_id, alumno_id)
SELECT 
    'a0000001-0000-0000-0000-000000000001',
    id
FROM usuarios
WHERE rol = 'alumno'  -- ✅ Corregido: "estudiante" → "alumno"
LIMIT 10
ON CONFLICT DO NOTHING;

INSERT INTO grupos_alumnos (grupo_id, alumno_id)
SELECT 
    'a0000001-0000-0000-0000-000000000002',
    id
FROM usuarios
WHERE rol = 'alumno'
LIMIT 8
ON CONFLICT DO NOTHING;

-- ==========================================
-- 3. CREAR TAREAS
-- ==========================================
-- ✅ CORREGIDO: puntos_max → puntos_totales

INSERT INTO tareas (id, grupo_id, profesor_id, titulo, descripcion, tipo, fecha_entrega, puntos_totales)
VALUES
    ('b0000001-0000-0000-0000-000000000001',
     'a0000001-0000-0000-0000-000000000001',
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Operaciones Básicas', 
     'Resolver las operaciones de suma y resta de la página 45',
     'tarea',
     NOW() + INTERVAL '7 days',
     100),  -- ✅ puntos_totales (antes era puntos_max)
    
    ('b0000001-0000-0000-0000-000000000002',
     'a0000001-0000-0000-0000-000000000002',
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Ecuaciones Lineales',
     'Resolver los ejercicios 1-20 del capítulo 3',
     'practica',
     NOW() + INTERVAL '5 days',
     100)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 4. CREAR EXÁMENES
-- ==========================================
-- ✅ CORREGIDO: 
--   - fecha_inicio/fecha_fin → fecha_programada
--   - puntos_total → puntos_totales

INSERT INTO examenes (id, grupo_id, profesor_id, titulo, tipo, duracion_minutos, fecha_programada, puntos_totales)
VALUES
    ('c0000001-0000-0000-0000-000000000001',
     'a0000001-0000-0000-0000-000000000001',
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Examen Parcial - Aritmética',
     'examen',
     60,
     NOW() + INTERVAL '3 days',  -- ✅ fecha_programada (antes era fecha_inicio)
     100),  -- ✅ puntos_totales (antes era puntos_total sin S)
    
    ('c0000001-0000-0000-0000-000000000002',
     'a0000001-0000-0000-0000-000000000002',
     (SELECT id FROM usuarios WHERE email = 'profesor@demo.com'),
     'Quiz Rápido - Álgebra',
     'quiz',
     30,
     NOW() + INTERVAL '1 day',
     50)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 5. CREAR CALIFICACIONES DE EJEMPLO
-- ==========================================
-- ✅ CORREGIDO: 
--   - calificacion → puntuacion
--   - tema/subtema eliminados (no existen)
--   - fecha → fecha_evaluacion

-- Calificaciones para grupo Matemáticas 1A
INSERT INTO calificaciones (escuela_id, alumno_id, grupo_id, tipo_evaluacion, puntuacion, puntos_totales, porcentaje, fecha_evaluacion)
SELECT 
    (SELECT escuela_id FROM usuarios WHERE email = 'profesor@demo.com' LIMIT 1),
    ga.alumno_id,
    ga.grupo_id,
    'examen',
    (70 + (RANDOM() * 30))::DECIMAL(5,2),  -- ✅ puntuacion (antes era calificacion)
    100,
    (70 + (RANDOM() * 30))::DECIMAL(5,2),
    NOW() - INTERVAL '10 days'  -- ✅ fecha_evaluacion (antes era fecha)
FROM grupos_alumnos ga
WHERE ga.grupo_id = 'a0000001-0000-0000-0000-000000000001'
LIMIT 10
ON CONFLICT DO NOTHING;

-- Calificaciones para grupo Álgebra 2B
INSERT INTO calificaciones (escuela_id, alumno_id, grupo_id, tipo_evaluacion, puntuacion, puntos_totales, porcentaje, fecha_evaluacion)
SELECT 
    (SELECT escuela_id FROM usuarios WHERE email = 'profesor@demo.com' LIMIT 1),
    ga.alumno_id,
    ga.grupo_id,
    'examen',
    (60 + (RANDOM() * 40))::DECIMAL(5,2),
    100,
    (60 + (RANDOM() * 40))::DECIMAL(5,2),
    NOW() - INTERVAL '8 days'
FROM grupos_alumnos ga
WHERE ga.grupo_id = 'a0000001-0000-0000-0000-000000000002'
LIMIT 10
ON CONFLICT DO NOTHING;

-- ==========================================
-- 6. CREAR ASISTENCIAS
-- ==========================================
-- ✅ Sin cambios - ya estaba correcto

-- Generar asistencias para los últimos 30 días
INSERT INTO asistencias (grupo_id, alumno_id, fecha, estado, registrado_por)
SELECT 
    ga.grupo_id,
    ga.alumno_id,
    (NOW() - ('1 day'::INTERVAL * gs.day_offset))::DATE,
    CASE 
        WHEN RANDOM() < 0.85 THEN 'presente'
        WHEN RANDOM() < 0.95 THEN 'tarde'
        ELSE 'ausente'
    END,
    (SELECT id FROM usuarios WHERE email = 'profesor@demo.com')  -- ✅ registrado_por
FROM grupos_alumnos ga
CROSS JOIN generate_series(0, 29) AS gs(day_offset)
WHERE ga.grupo_id IN (
    'a0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000002'
)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 7. VERIFICACIÓN
-- ==========================================

-- Verificar datos insertados
SELECT 
    'Grupos creados' as tabla,
    COUNT(*) as total
FROM grupos
WHERE id IN (
    'a0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000003'
)

UNION ALL

SELECT 
    'Alumnos inscritos' as tabla,
    COUNT(*) as total
FROM grupos_alumnos
WHERE grupo_id IN (
    'a0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000002'
)

UNION ALL

SELECT 
    'Tareas creadas' as tabla,
    COUNT(*) as total
FROM tareas
WHERE id IN (
    'b0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000002'
)

UNION ALL

SELECT 
    'Exámenes creados' as tabla,
    COUNT(*) as total
FROM examenes
WHERE id IN (
    'c0000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000002'
)

UNION ALL

SELECT 
    'Calificaciones' as tabla,
    COUNT(*) as total
FROM calificaciones
WHERE grupo_id IN (
    'a0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000002'
)

UNION ALL

SELECT 
    'Asistencias' as tabla,
    COUNT(*) as total
FROM asistencias
WHERE grupo_id IN (
    'a0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000002'
);

-- ==========================================
-- FIN DE SEED DATA CORREGIDO
-- ==========================================

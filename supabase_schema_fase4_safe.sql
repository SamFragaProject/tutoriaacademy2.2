-- ============================================
-- SCHEMA SEGURO - TutoriA Academy Fase 4
-- Solo actualiza y crea sin romper nada existente
-- ============================================

-- ==========================================
-- 1. ACTUALIZAR TABLA GRUPOS
-- ==========================================
ALTER TABLE grupos 
ADD COLUMN IF NOT EXISTS codigo_acceso TEXT,
ADD COLUMN IF NOT EXISTS nivel TEXT,
ADD COLUMN IF NOT EXISTS descripcion TEXT;

-- ==========================================
-- 2. CREAR TABLA GRUPOS_ALUMNOS
-- ==========================================
CREATE TABLE IF NOT EXISTS grupos_alumnos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
    alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_inscripcion TIMESTAMPTZ DEFAULT NOW(),
    activo BOOLEAN DEFAULT true,
    UNIQUE(grupo_id, alumno_id)
);

-- Agregar columna activo si no existe (por si la tabla ya existía)
ALTER TABLE grupos_alumnos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- ==========================================
-- 3. CREAR TABLA ENTREGAS
-- ==========================================
CREATE TABLE IF NOT EXISTS entregas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarea_id UUID REFERENCES tareas(id) ON DELETE CASCADE,
    alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT,
    archivo_url TEXT,
    calificacion INTEGER,
    comentarios_profesor TEXT,
    estado TEXT,
    fecha_entrega TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tarea_id, alumno_id)
);

-- Agregar columnas si no existen (por si la tabla ya existía)
ALTER TABLE entregas ADD COLUMN IF NOT EXISTS estado TEXT;
ALTER TABLE entregas ADD COLUMN IF NOT EXISTS contenido TEXT;
ALTER TABLE entregas ADD COLUMN IF NOT EXISTS archivo_url TEXT;
ALTER TABLE entregas ADD COLUMN IF NOT EXISTS comentarios_profesor TEXT;

-- ==========================================
-- 4. CREAR TABLA PREGUNTAS
-- ==========================================
CREATE TABLE IF NOT EXISTS preguntas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    examen_id UUID REFERENCES examenes(id) ON DELETE CASCADE,
    profesor_id UUID REFERENCES usuarios(id),
    texto TEXT NOT NULL,
    tipo TEXT,
    opciones JSONB,
    respuesta_correcta TEXT,
    explicacion TEXT,
    puntos INTEGER DEFAULT 1,
    tema TEXT,
    subtema TEXT,
    dificultad TEXT,
    orden INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. CREAR TABLA RESULTADOS_EXAMENES
-- ==========================================
CREATE TABLE IF NOT EXISTS resultados_examenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    examen_id UUID REFERENCES examenes(id) ON DELETE CASCADE,
    alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_inicio TIMESTAMPTZ DEFAULT NOW(),
    fecha_fin TIMESTAMPTZ,
    puntos_obtenidos INTEGER,
    puntos_totales INTEGER,
    porcentaje DECIMAL(5,2),
    estado TEXT,
    respuestas JSONB,
    tiempo_usado INTEGER,
    intento_numero INTEGER DEFAULT 1,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. ACTUALIZAR TABLA TAREAS (agregar columnas)
-- ==========================================
ALTER TABLE tareas 
ADD COLUMN IF NOT EXISTS tipo TEXT,
ADD COLUMN IF NOT EXISTS fecha_asignacion TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS fecha_entrega TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS puntos_max INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS archivo_url TEXT,
ADD COLUMN IF NOT EXISTS instrucciones JSONB,
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- ==========================================
-- 7. ACTUALIZAR TABLA EXAMENES (agregar columnas)
-- ==========================================
ALTER TABLE examenes 
ADD COLUMN IF NOT EXISTS tipo TEXT,
ADD COLUMN IF NOT EXISTS duracion_minutos INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS fecha_inicio TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS fecha_fin TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS intentos_permitidos INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS mostrar_resultados BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS aleatorio BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS puntos_total INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS configuracion JSONB,
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- ==========================================
-- 8. ACTUALIZAR TABLA CALIFICACIONES (agregar columnas)
-- ==========================================
ALTER TABLE calificaciones
ADD COLUMN IF NOT EXISTS calificacion DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS tipo_evaluacion TEXT,
ADD COLUMN IF NOT EXISTS evaluacion_id UUID,
ADD COLUMN IF NOT EXISTS puntos_obtenidos INTEGER,
ADD COLUMN IF NOT EXISTS puntos_totales INTEGER,
ADD COLUMN IF NOT EXISTS tema TEXT,
ADD COLUMN IF NOT EXISTS subtema TEXT,
ADD COLUMN IF NOT EXISTS comentarios TEXT,
ADD COLUMN IF NOT EXISTS fecha TIMESTAMPTZ DEFAULT NOW();

-- ==========================================
-- 9. CREAR TABLA MENSAJES
-- ==========================================
CREATE TABLE IF NOT EXISTS mensajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remitente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    destinatario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    grupo_id UUID REFERENCES grupos(id) ON DELETE SET NULL,
    asunto TEXT,
    contenido TEXT NOT NULL,
    leido BOOLEAN DEFAULT false,
    archivos JSONB,
    parent_id UUID REFERENCES mensajes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 10. CREAR ÍNDICES (solo si no existen)
-- ==========================================

-- Índices de grupos
CREATE INDEX IF NOT EXISTS idx_grupos_escuela ON grupos(escuela_id);
CREATE INDEX IF NOT EXISTS idx_grupos_profesor ON grupos(profesor_id);
CREATE INDEX IF NOT EXISTS idx_grupos_codigo ON grupos(codigo_acceso) WHERE codigo_acceso IS NOT NULL;

-- Índices de grupos_alumnos
CREATE INDEX IF NOT EXISTS idx_grupos_alumnos_grupo ON grupos_alumnos(grupo_id);
CREATE INDEX IF NOT EXISTS idx_grupos_alumnos_alumno ON grupos_alumnos(alumno_id);

-- Índices de tareas
CREATE INDEX IF NOT EXISTS idx_tareas_grupo ON tareas(grupo_id);
CREATE INDEX IF NOT EXISTS idx_tareas_profesor ON tareas(profesor_id);

-- Índices de entregas
CREATE INDEX IF NOT EXISTS idx_entregas_tarea ON entregas(tarea_id);
CREATE INDEX IF NOT EXISTS idx_entregas_alumno ON entregas(alumno_id);

-- Índices de examenes
CREATE INDEX IF NOT EXISTS idx_examenes_grupo ON examenes(grupo_id);
CREATE INDEX IF NOT EXISTS idx_examenes_profesor ON examenes(profesor_id);

-- Índices de preguntas
CREATE INDEX IF NOT EXISTS idx_preguntas_examen ON preguntas(examen_id);
CREATE INDEX IF NOT EXISTS idx_preguntas_profesor ON preguntas(profesor_id);

-- Índices de resultados_examenes
CREATE INDEX IF NOT EXISTS idx_resultados_examen ON resultados_examenes(examen_id);
CREATE INDEX IF NOT EXISTS idx_resultados_alumno ON resultados_examenes(alumno_id);

-- Índices de calificaciones
CREATE INDEX IF NOT EXISTS idx_calificaciones_alumno ON calificaciones(alumno_id);
CREATE INDEX IF NOT EXISTS idx_calificaciones_grupo ON calificaciones(grupo_id);

-- Índices de asistencias
CREATE INDEX IF NOT EXISTS idx_asistencias_grupo ON asistencias(grupo_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_alumno ON asistencias(alumno_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_fecha ON asistencias(fecha);

-- Índices de mensajes
CREATE INDEX IF NOT EXISTS idx_mensajes_remitente ON mensajes(remitente_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_destinatario ON mensajes(destinatario_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_grupo ON mensajes(grupo_id) WHERE grupo_id IS NOT NULL;

-- ==========================================
-- 11. FUNCIÓN PARA CALCULAR ESTADÍSTICAS
-- ==========================================
CREATE OR REPLACE FUNCTION calcular_estadisticas_grupo(grupo_uuid UUID)
RETURNS TABLE (
    total_alumnos BIGINT,
    promedio_general DECIMAL,
    tasa_asistencia DECIMAL,
    tareas_pendientes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT ga.alumno_id) as total_alumnos,
        COALESCE(AVG(c.calificacion), 0) as promedio_general,
        100::DECIMAL as tasa_asistencia, -- Simplificado por ahora
        0::BIGINT as tareas_pendientes -- Simplificado por ahora
    FROM grupos_alumnos ga
    LEFT JOIN calificaciones c ON c.alumno_id = ga.alumno_id AND c.grupo_id = ga.grupo_id
    WHERE ga.grupo_id = grupo_uuid;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 12. TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_grupos_updated_at ON grupos;
CREATE TRIGGER update_grupos_updated_at
    BEFORE UPDATE ON grupos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 13. ROW LEVEL SECURITY
-- ==========================================

-- Habilitar RLS en tablas
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos_alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE examenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultados_examenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;

-- Eliminar policies antiguas
DROP POLICY IF EXISTS "Profesores ven sus grupos" ON grupos;
DROP POLICY IF EXISTS "Alumnos ven sus grupos" ON grupos;
DROP POLICY IF EXISTS "Admins ven todos los grupos" ON grupos;
DROP POLICY IF EXISTS "Alumnos ven sus calificaciones" ON calificaciones;
DROP POLICY IF EXISTS "Profesores ven calificaciones de sus grupos" ON calificaciones;
DROP POLICY IF EXISTS "Profesores crean/actualizan calificaciones" ON calificaciones;

-- Crear policies nuevas
CREATE POLICY "Profesores ven sus grupos" ON grupos
    FOR SELECT USING (auth.uid() = profesor_id);

CREATE POLICY "Alumnos ven sus grupos" ON grupos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM grupos_alumnos ga
            WHERE ga.grupo_id = grupos.id
            AND ga.alumno_id = auth.uid()
            AND (ga.activo IS NULL OR ga.activo = true)
        )
    );

CREATE POLICY "Admins ven todos los grupos" ON grupos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE id = auth.uid()
            AND rol = 'admin'
        )
    );

CREATE POLICY "Alumnos ven sus calificaciones" ON calificaciones
    FOR SELECT USING (alumno_id = auth.uid());

CREATE POLICY "Profesores ven calificaciones de sus grupos" ON calificaciones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM grupos
            WHERE grupos.id = calificaciones.grupo_id
            AND grupos.profesor_id = auth.uid()
        )
    );

CREATE POLICY "Profesores crean/actualizan calificaciones" ON calificaciones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM grupos
            WHERE grupos.id = calificaciones.grupo_id
            AND grupos.profesor_id = auth.uid()
        )
    );

-- ==========================================
-- FIN DEL SCHEMA SEGURO
-- ==========================================

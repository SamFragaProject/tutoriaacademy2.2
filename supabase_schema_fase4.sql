-- ============================================
-- SCHEMA COMPLETO SUPABASE - TutoriA Academy
-- Fase 4: Tablas para Profesores y Estudiantes
-- ============================================

-- ==========================================
-- 1. TABLA GRUPOS (Ya existe pero la extendemos)
-- ==========================================
CREATE TABLE IF NOT EXISTS grupos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escuela_id UUID REFERENCES escuelas(id) ON DELETE CASCADE,
    profesor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    nombre TEXT NOT NULL,
    materia TEXT NOT NULL,
    nivel TEXT,
    descripcion TEXT,
    codigo_acceso TEXT UNIQUE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para grupos
CREATE INDEX IF NOT EXISTS idx_grupos_escuela ON grupos(escuela_id);
CREATE INDEX IF NOT EXISTS idx_grupos_profesor ON grupos(profesor_id);
CREATE INDEX IF NOT EXISTS idx_grupos_codigo ON grupos(codigo_acceso);

-- ==========================================
-- 2. TABLA GRUPOS_ALUMNOS (Relación muchos a muchos)
-- ==========================================
CREATE TABLE IF NOT EXISTS grupos_alumnos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
    alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_inscripcion TIMESTAMPTZ DEFAULT NOW(),
    activo BOOLEAN DEFAULT true,
    UNIQUE(grupo_id, alumno_id)
);

-- Índices para grupos_alumnos
CREATE INDEX IF NOT EXISTS idx_grupos_alumnos_grupo ON grupos_alumnos(grupo_id);
CREATE INDEX IF NOT EXISTS idx_grupos_alumnos_alumno ON grupos_alumnos(alumno_id);

-- ==========================================
-- 3. TABLA TAREAS
-- ==========================================
CREATE TABLE IF NOT EXISTS tareas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
    profesor_id UUID REFERENCES usuarios(id),
    titulo TEXT NOT NULL,
    descripcion TEXT,
    tipo TEXT CHECK (tipo IN (''tarea'', ''practica'', ''lectura'', ''proyecto'')),
    fecha_asignacion TIMESTAMPTZ DEFAULT NOW(),
    fecha_entrega TIMESTAMPTZ,
    puntos_max INTEGER DEFAULT 100,
    archivo_url TEXT,
    instrucciones JSONB,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para tareas
CREATE INDEX IF NOT EXISTS idx_tareas_grupo ON tareas(grupo_id);
CREATE INDEX IF NOT EXISTS idx_tareas_profesor ON tareas(profesor_id);
CREATE INDEX IF NOT EXISTS idx_tareas_fecha_entrega ON tareas(fecha_entrega);

-- ==========================================
-- 4. TABLA ENTREGAS (Respuestas de alumnos a tareas)
-- ==========================================
CREATE TABLE IF NOT EXISTS entregas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarea_id UUID REFERENCES tareas(id) ON DELETE CASCADE,
    alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT,
    archivo_url TEXT,
    calificacion INTEGER,
    comentarios_profesor TEXT,
    estado TEXT CHECK (estado IN (''pendiente'', ''entregada'', ''revisada'', ''retrasada'')),
    fecha_entrega TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tarea_id, alumno_id)
);

-- Índices para entregas
CREATE INDEX IF NOT EXISTS idx_entregas_tarea ON entregas(tarea_id);
CREATE INDEX IF NOT EXISTS idx_entregas_alumno ON entregas(alumno_id);
CREATE INDEX IF NOT EXISTS idx_entregas_estado ON entregas(estado);

-- ==========================================
-- 5. TABLA EXAMENES
-- ==========================================
CREATE TABLE IF NOT EXISTS examenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
    profesor_id UUID REFERENCES usuarios(id),
    titulo TEXT NOT NULL,
    descripcion TEXT,
    tipo TEXT CHECK (tipo IN (''examen'', ''quiz'', ''simulacro'', ''diagnostico'')),
    duracion_minutos INTEGER DEFAULT 60,
    fecha_inicio TIMESTAMPTZ,
    fecha_fin TIMESTAMPTZ,
    intentos_permitidos INTEGER DEFAULT 1,
    mostrar_resultados BOOLEAN DEFAULT true,
    aleatorio BOOLEAN DEFAULT false,
    puntos_total INTEGER DEFAULT 100,
    configuracion JSONB,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para examenes
CREATE INDEX IF NOT EXISTS idx_examenes_grupo ON examenes(grupo_id);
CREATE INDEX IF NOT EXISTS idx_examenes_profesor ON examenes(profesor_id);
CREATE INDEX IF NOT EXISTS idx_examenes_fecha ON examenes(fecha_inicio, fecha_fin);

-- ==========================================
-- 6. TABLA PREGUNTAS
-- ==========================================
CREATE TABLE IF NOT EXISTS preguntas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    examen_id UUID REFERENCES examenes(id) ON DELETE CASCADE,
    profesor_id UUID REFERENCES usuarios(id),
    texto TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN (''opcion_multiple'', ''verdadero_falso'', ''abierta'', ''completar'')),
    opciones JSONB,
    respuesta_correcta TEXT,
    explicacion TEXT,
    puntos INTEGER DEFAULT 1,
    tema TEXT,
    subtema TEXT,
    dificultad TEXT CHECK (dificultad IN (''facil'', ''medio'', ''dificil'')),
    orden INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para preguntas
CREATE INDEX IF NOT EXISTS idx_preguntas_examen ON preguntas(examen_id);
CREATE INDEX IF NOT EXISTS idx_preguntas_profesor ON preguntas(profesor_id);
CREATE INDEX IF NOT EXISTS idx_preguntas_tema ON preguntas(tema, subtema);

-- ==========================================
-- 7. TABLA RESULTADOS_EXAMENES
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
    estado TEXT CHECK (estado IN (''en_progreso'', ''completado'', ''abandonado'')),
    respuestas JSONB,
    tiempo_usado INTEGER,
    intento_numero INTEGER DEFAULT 1,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para resultados_examenes
CREATE INDEX IF NOT EXISTS idx_resultados_examen ON resultados_examenes(examen_id);
CREATE INDEX IF NOT EXISTS idx_resultados_alumno ON resultados_examenes(alumno_id);
CREATE INDEX IF NOT EXISTS idx_resultados_estado ON resultados_examenes(estado);

-- ==========================================
-- 8. TABLA CALIFICACIONES (Sistema general de calificaciones)
-- ==========================================
CREATE TABLE IF NOT EXISTS calificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
    tipo_evaluacion TEXT CHECK (tipo_evaluacion IN (''examen'', ''tarea'', ''participacion'', ''proyecto'')),
    evaluacion_id UUID,
    calificacion DECIMAL(5,2) NOT NULL,
    puntos_obtenidos INTEGER,
    puntos_totales INTEGER,
    tema TEXT,
    subtema TEXT,
    comentarios TEXT,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para calificaciones
CREATE INDEX IF NOT EXISTS idx_calificaciones_alumno ON calificaciones(alumno_id);
CREATE INDEX IF NOT EXISTS idx_calificaciones_grupo ON calificaciones(grupo_id);
CREATE INDEX IF NOT EXISTS idx_calificaciones_tema ON calificaciones(tema, subtema);
CREATE INDEX IF NOT EXISTS idx_calificaciones_fecha ON calificaciones(fecha);

-- ==========================================
-- 9. TABLA ASISTENCIAS
-- ==========================================
CREATE TABLE IF NOT EXISTS asistencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
    alumno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    estado TEXT CHECK (estado IN (''presente'', ''ausente'', ''tarde'', ''justificado'')),
    comentarios TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(grupo_id, alumno_id, fecha)
);

-- Índices para asistencias
CREATE INDEX IF NOT EXISTS idx_asistencias_grupo ON asistencias(grupo_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_alumno ON asistencias(alumno_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_fecha ON asistencias(fecha);

-- ==========================================
-- 10. TABLA MENSAJES (Comunicación profesor-alumno)
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

-- Índices para mensajes
CREATE INDEX IF NOT EXISTS idx_mensajes_remitente ON mensajes(remitente_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_destinatario ON mensajes(destinatario_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_grupo ON mensajes(grupo_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_leido ON mensajes(leido);

-- ==========================================
-- 11. FUNCIÓN PARA CALCULAR ESTADÍSTICAS DE GRUPO
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
        COALESCE(
            (COUNT(CASE WHEN a.estado = ''presente'' THEN 1 END)::DECIMAL /
            NULLIF(COUNT(a.id), 0) * 100), 100
        ) as tasa_asistencia,
        COUNT(DISTINCT CASE WHEN t.fecha_entrega > NOW() AND e.id IS NULL THEN t.id END) as tareas_pendientes
    FROM grupos_alumnos ga
    LEFT JOIN calificaciones c ON c.alumno_id = ga.alumno_id AND c.grupo_id = ga.grupo_id
    LEFT JOIN asistencias a ON a.alumno_id = ga.alumno_id AND a.grupo_id = ga.grupo_id
    LEFT JOIN tareas t ON t.grupo_id = ga.grupo_id
    LEFT JOIN entregas e ON e.tarea_id = t.id AND e.alumno_id = ga.alumno_id
    WHERE ga.grupo_id = grupo_uuid AND ga.activo = true;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 12. TRIGGERS PARA UPDATED_AT
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a grupos
DROP TRIGGER IF EXISTS update_grupos_updated_at ON grupos;
CREATE TRIGGER update_grupos_updated_at
    BEFORE UPDATE ON grupos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Habilitar RLS
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos_alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE examenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultados_examenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;

-- Policies para GRUPOS
CREATE POLICY "Profesores ven sus grupos" ON grupos
    FOR SELECT USING (auth.uid() = profesor_id);

CREATE POLICY "Alumnos ven sus grupos" ON grupos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM grupos_alumnos ga
            WHERE ga.grupo_id = grupos.id
            AND ga.alumno_id = auth.uid()
            AND ga.activo = true
        )
    );

CREATE POLICY "Admins ven todos los grupos" ON grupos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE id = auth.uid()
            AND rol = ''admin''
        )
    );

-- Policies para CALIFICACIONES
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
-- FIN DEL SCHEMA
-- ==========================================

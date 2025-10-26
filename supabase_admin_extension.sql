-- ============================================
-- EXTENSIÓN ADMIN: Activity Logs
-- TutoriA Academy B2B - Supabase
-- ============================================

-- Crear tabla de logs de actividad
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- Habilitar Row Level Security
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Política RLS: Solo admins y el propio usuario pueden ver sus logs
CREATE POLICY "Users can view their own logs" ON activity_logs
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.rol = ''admin''
    )
  );

-- Política RLS: Solo el sistema puede insertar logs
CREATE POLICY "System can insert logs" ON activity_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Función para log automático de cambios (opcional)
CREATE OR REPLACE FUNCTION log_user_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id)
  VALUES (
    auth.uid(),
    (SELECT nombre || '' '' || COALESCE(apellidos, '''') FROM usuarios WHERE id = auth.uid()),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id::TEXT
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- AGREGAR CAMPOS FALTANTES A TABLA USUARIOS
-- ============================================

-- Agregar campo activo si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=''usuarios'' AND column_name=''activo'') THEN
    ALTER TABLE usuarios ADD COLUMN activo BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Agregar campo ultimo_acceso si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=''usuarios'' AND column_name=''ultimo_acceso'') THEN
    ALTER TABLE usuarios ADD COLUMN ultimo_acceso TIMESTAMPTZ;
  END IF;
END $$;

-- ============================================
-- AGREGAR CAMPOS FALTANTES A TABLA ESCUELAS
-- ============================================

-- Agregar campos adicionales si no existen
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=''escuelas'' AND column_name=''ciudad'') THEN
    ALTER TABLE escuelas ADD COLUMN ciudad TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=''escuelas'' AND column_name=''pais'') THEN
    ALTER TABLE escuelas ADD COLUMN pais TEXT DEFAULT ''México'';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=''escuelas'' AND column_name=''activo'') THEN
    ALTER TABLE escuelas ADD COLUMN activo BOOLEAN DEFAULT true;
  END IF;
END $$;

-- ============================================
-- INSERTAR USUARIO ADMIN DE PRUEBA
-- ============================================

-- Insertar admin en usuarios
INSERT INTO usuarios (id, escuela_id, email, nombre, apellidos, rol, activo) VALUES
  (''aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'', ''11111111-1111-1111-1111-111111111111'', ''admin@demo.com'', ''Admin'', ''Sistema'', ''admin'', true)
ON CONFLICT (id) DO UPDATE SET rol = ''admin'';

-- NOTA: Para crear el usuario admin en Supabase Auth:
-- Dashboard -> Authentication -> Add User manually
-- Email: admin@demo.com
-- Password: admin123 (o la que prefieras)
-- Asegúrate de usar el mismo UUID: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa

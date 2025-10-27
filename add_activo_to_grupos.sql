-- Agregar columna activo a grupos (necesaria para el seed data)
ALTER TABLE grupos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

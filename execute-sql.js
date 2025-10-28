// Script para ejecutar SQL en Supabase automáticamente
const SUPABASE_URL = 'https://ohtgbmqpudepbavjxrek.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odGdibXFwdWRlcGJhdmp4cmVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI1ODgzMiwiZXhwIjoyMDc2ODM0ODMyfQ.kYAwK1y_7GmYU_9FfNfGy3ULhSkj13oMi1UT0uQ5A_w';

const sql = `
ALTER TABLE IF EXISTS usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS escuelas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS grupos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS grupos_alumnos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tareas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS entregas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS examenes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS calificaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS asistencias DISABLE ROW LEVEL SECURITY;
`;

async function executeSQL() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ query: sql })
    });

    const result = await response.json();
    console.log('✅ SQL ejecutado:', result);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

executeSQL();

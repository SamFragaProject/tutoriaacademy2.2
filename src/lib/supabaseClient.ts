import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// HARDCODED SERVICE ROLE KEY PARA DESARROLLO (temporal hasta arreglar .env)
const HARDCODED_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odGdibXFwdWRlcGJhdmp4cmVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI1ODgzMiwiZXhwIjoyMDc2ODM0ODMyfQ.kYAwK1y_7GmYU_9FfNfGy3ULhSkj13oMi1UT0uQ5A_w';

// En desarrollo, usar Service Role Key para bypasear RLS
// Prioridad: hardcoded > env > anon
const supabaseKey = HARDCODED_SERVICE_KEY || supabaseServiceRoleKey || supabaseAnonKey;
const usingServiceRole = !!(HARDCODED_SERVICE_KEY || supabaseServiceRoleKey);

console.log('🔧 Supabase Client Config:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseKey,
  usingServiceRole,
  bypassRLS: usingServiceRole,
  serviceRoleKeyLength: supabaseKey?.length,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
});

if (usingServiceRole) {
  console.log('✅ ✅ ✅ USANDO SERVICE ROLE KEY - RLS BYPASSEADO ✅ ✅ ✅');
} else {
  console.warn('⚠️ ⚠️ ⚠️ USANDO ANON KEY - RLS ACTIVO ⚠️ ⚠️ ⚠️');
}

if (!supabaseUrl || !supabaseKey) {
  const error = new Error(
    '❌ CRÍTICO: Faltan las variables de entorno de Supabase. ' +
    'Variables encontradas: ' +
    `VITE_SUPABASE_URL=${!!supabaseUrl}, VITE_SUPABASE_KEY=${!!supabaseKey}`
  );
  console.error(error);
  throw error;
}

console.log('✅ Supabase client creado exitosamente');
export const supabase = createClient(supabaseUrl, supabaseKey);

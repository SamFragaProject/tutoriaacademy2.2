import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// En desarrollo, usar Service Role Key para bypasear RLS
// En producción, usar Anon Key
const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey;
const usingServiceRole = !!supabaseServiceRoleKey;

console.log('🔧 Supabase Client Config:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseKey,
  usingServiceRole,
  bypassRLS: usingServiceRole,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
});

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

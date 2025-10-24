import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Client Config:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
});

if (!supabaseUrl || !supabaseAnonKey) {
  const error = new Error(
    '❌ CRÍTICO: Faltan las variables de entorno de Supabase. ' +
    'Variables encontradas: ' +
    `VITE_SUPABASE_URL=${!!supabaseUrl}, VITE_SUPABASE_ANON_KEY=${!!supabaseAnonKey}`
  );
  console.error(error);
  throw error;
}

console.log('✅ Supabase client creado exitosamente');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

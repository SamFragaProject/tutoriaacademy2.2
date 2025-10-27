// Script para verificar variables de entorno
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve('.env.local') });

console.log('=== VERIFICACIÓN DE VARIABLES DE ENTORNO ===');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Definida' : '❌ No definida');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ Definida' : '❌ No definida');
console.log('VITE_SUPABASE_SERVICE_ROLE_KEY:', process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? '✅ Definida' : '❌ No definida');

if (process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  console.log('Service Role Key length:', process.env.VITE_SUPABASE_SERVICE_ROLE_KEY.length);
}

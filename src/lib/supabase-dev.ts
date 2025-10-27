/**
 * Cliente Supabase para DESARROLLO
 * Usa Service Role Key que BYPASEA RLS automáticamente
 * 
 * ⚠️ SOLO PARA DESARROLLO - NO USAR EN PRODUCCIÓN
 * 
 * Para usar:
 * 1. Obtén tu Service Role Key de Supabase Dashboard → Settings → API
 * 2. Agrégala a .env.local como VITE_SUPABASE_SERVICE_ROLE_KEY
 * 3. Importa { supabaseDev } en lugar de { supabase }
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL no está configurada');
}

// Usar Service Role Key en desarrollo, Anon Key en producción
const key = serviceRoleKey || anonKey;

if (!key) {
  throw new Error('Ni VITE_SUPABASE_SERVICE_ROLE_KEY ni VITE_SUPABASE_ANON_KEY están configuradas');
}

/**
 * Cliente Supabase con Service Role Key
 * Bypasea RLS automáticamente - Ideal para desarrollo
 */
export const supabaseDev = createClient(supabaseUrl, key, {
  auth: {
    // En desarrollo no necesitamos persistir sesión
    autoRefreshToken: serviceRoleKey ? false : true,
    persistSession: serviceRoleKey ? false : true
  }
});

// Log para debugging
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Dev Client:', {
    url: supabaseUrl,
    usingServiceRole: !!serviceRoleKey,
    bypassRLS: !!serviceRoleKey
  });
}

export default supabaseDev;

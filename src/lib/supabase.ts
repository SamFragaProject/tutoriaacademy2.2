// Re-exportar el cliente de Supabase principal
export { supabase } from './supabaseClient';

// Helper para manejar errores de Supabase
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return {
    error: true,
    message: error.message || 'An error occurred'
  };
};

// Check de conexión
export const checkSupabaseConnection = async () => {
  // Importar dinámicamente para evitar problemas circulares
  const { supabase } = await import('./supabaseClient');
  
  try {
    const { data, error } = await supabase.from('usuarios').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
};

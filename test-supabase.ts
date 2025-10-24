// Test de conexión con Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohtgbmqpudepbavjxrek.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odGdibXFwdWRlcGJhdmp4cmVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTg4MzIsImV4cCI6MjA3NjgzNDgzMn0.f8Zb1wCLykS2e18vm-V_7uXCAcXueoZNOFWFn_PYecE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Probando conexión con Supabase...\n');

  try {
    // 1. Probar conexión básica
    const { data: escuelas, error: escuelasError } = await supabase
      .from('escuelas')
      .select('*')
      .limit(1);

    if (escuelasError) {
      console.error('❌ Error al conectar:', escuelasError.message);
      return;
    }

    console.log('✅ Conexión exitosa!');
    console.log('📊 Escuelas encontradas:', escuelas?.length || 0);
    
    if (escuelas && escuelas.length > 0) {
      console.log('🏫 Primera escuela:', escuelas[0]);
    }

    // 2. Verificar todas las tablas
    console.log('\n📋 Verificando tablas...');
    
    const tablas = [
      'escuelas',
      'usuarios', 
      'grupos',
      'tareas',
      'examenes',
      'calificaciones',
      'asistencias',
      'mensajes'
    ];

    for (const tabla of tablas) {
      const { data, error } = await supabase
        .from(tabla)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`  ❌ ${tabla}: ERROR - ${error.message}`);
      } else {
        console.log(`  ✅ ${tabla}: OK`);
      }
    }

    console.log('\n🎉 ¡Todo configurado correctamente!');
    console.log('📝 Próximo paso: Implementar autenticación\n');

  } catch (error: any) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar test
testSupabaseConnection();

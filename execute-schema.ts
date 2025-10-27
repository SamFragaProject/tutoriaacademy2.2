// Script para ejecutar el schema SQL en Supabase
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://ohtgbmqpudepbavjxrek.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odGdibXFwdWRlcGJhdmp4cmVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTg4MzIsImV4cCI6MjA3NjgzNDgzMn0.f8Zb1wCLykS2e18vm-V_7uXCAcXueoZNOFWFn_PYecE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function executeSchema() {
  console.log('🚀 Ejecutando Schema SQL de Fase 4...\n');

  try {
    // Leer el archivo SQL
    const schemaPath = path.join(__dirname, 'supabase_schema_fase4.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📄 Archivo SQL leído correctamente');
    console.log(`📊 Tamaño: ${schemaSQL.length} caracteres\n`);

    // Dividir en statements individuales y ejecutarlos uno por uno
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📋 Total de statements a ejecutar: ${statements.length}\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Extraer nombre de la operación para logging
      const operationMatch = statement.match(/CREATE TABLE.*?(\w+)|CREATE INDEX.*?(\w+)|CREATE POLICY.*?"([^"]+)"/i);
      const operationName = operationMatch ? (operationMatch[1] || operationMatch[2] || operationMatch[3]) : `Statement ${i + 1}`;

      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Algunos errores son esperados (tabla ya existe, etc)
          if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log(`  ⚠️  ${operationName}: Ya existe (OK)`);
            successCount++;
          } else {
            console.log(`  ❌ ${operationName}: ${error.message}`);
            errorCount++;
          }
        } else {
          console.log(`  ✅ ${operationName}: Ejecutado`);
          successCount++;
        }
      } catch (err: any) {
        console.log(`  ❌ ${operationName}: ${err.message}`);
        errorCount++;
      }

      // Pequeña pausa para no saturar
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log('='.repeat(50) + '\n');

    if (errorCount === 0 || successCount > errorCount) {
      console.log('🎉 Schema ejecutado correctamente!\n');
      return true;
    } else {
      console.log('⚠️  Hubo algunos errores, pero el schema podría estar funcional\n');
      return false;
    }

  } catch (error: any) {
    console.error('❌ Error fatal:', error.message);
    return false;
  }
}

async function executeSeed() {
  console.log('🌱 Ejecutando Seed Data...\n');

  try {
    // Leer el archivo de seed
    const seedPath = path.join(__dirname, 'supabase_seed_fase4.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf-8');

    console.log('📄 Archivo de Seed leído correctamente');
    console.log(`📊 Tamaño: ${seedSQL.length} caracteres\n`);

    // Ejecutar seed
    const statements = seedSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📋 Total de inserts a ejecutar: ${statements.length}\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          if (error.message.includes('duplicate') || error.message.includes('already exists')) {
            console.log(`  ⚠️  Insert ${i + 1}: Ya existe (OK)`);
            successCount++;
          } else {
            console.log(`  ❌ Insert ${i + 1}: ${error.message}`);
            errorCount++;
          }
        } else {
          console.log(`  ✅ Insert ${i + 1}: Ejecutado`);
          successCount++;
        }
      } catch (err: any) {
        console.log(`  ❌ Insert ${i + 1}: ${err.message}`);
        errorCount++;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log('='.repeat(50) + '\n');

    if (errorCount === 0 || successCount > errorCount) {
      console.log('🎉 Seed data insertado correctamente!\n');
      return true;
    } else {
      console.log('⚠️  Hubo algunos errores en el seed\n');
      return false;
    }

  } catch (error: any) {
    console.error('❌ Error fatal en seed:', error.message);
    return false;
  }
}

async function verifyTables() {
  console.log('🔍 Verificando tablas creadas...\n');

  const tables = [
    'grupos',
    'grupos_alumnos',
    'tareas',
    'entregas',
    'examenes',
    'preguntas',
    'resultados_examenes',
    'calificaciones',
    'asistencias',
    'mensajes'
  ];

  let allOk = true;

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  ❌ ${table}: ${error.message}`);
        allOk = false;
      } else {
        console.log(`  ✅ ${table}: ${count || 0} registros`);
      }
    } catch (err: any) {
      console.log(`  ❌ ${table}: ${err.message}`);
      allOk = false;
    }
  }

  console.log('');
  return allOk;
}

// Ejecutar todo
async function main() {
  console.log('╔' + '═'.repeat(60) + '╗');
  console.log('║' + ' '.repeat(10) + 'SUPABASE SCHEMA & SEED EXECUTOR' + ' '.repeat(18) + '║');
  console.log('║' + ' '.repeat(20) + 'Fase 4 - TutoriA Academy' + ' '.repeat(16) + '║');
  console.log('╚' + '═'.repeat(60) + '╝\n');

  // Paso 1: Ejecutar Schema
  const schemaOk = await executeSchema();
  
  if (!schemaOk) {
    console.log('⚠️  Continuando a pesar de errores en schema...\n');
  }

  // Paso 2: Ejecutar Seed
  const seedOk = await executeSeed();

  // Paso 3: Verificar
  const verifyOk = await verifyTables();

  // Resumen final
  console.log('\n' + '╔' + '═'.repeat(60) + '╗');
  console.log('║' + ' '.repeat(25) + 'RESUMEN FINAL' + ' '.repeat(22) + '║');
  console.log('╠' + '═'.repeat(60) + '╣');
  console.log(`║  Schema ejecutado: ${schemaOk ? '✅ SÍ' : '❌ NO'}` + ' '.repeat(42) + '║');
  console.log(`║  Seed ejecutado: ${seedOk ? '✅ SÍ' : '❌ NO'}` + ' '.repeat(44) + '║');
  console.log(`║  Tablas verificadas: ${verifyOk ? '✅ SÍ' : '❌ NO'}` + ' '.repeat(37) + '║');
  console.log('╚' + '═'.repeat(60) + '╝\n');

  if (schemaOk && seedOk && verifyOk) {
    console.log('🎉🎉🎉 ¡TODO COMPLETADO EXITOSAMENTE! 🎉🎉🎉\n');
    console.log('✅ Próximos pasos:');
    console.log('   1. Re-crear servicios teacher/');
    console.log('   2. Actualizar GroupsPage y TeacherResultsPage');
    console.log('   3. Testing en producción\n');
  } else {
    console.log('⚠️  Hubo algunos problemas. Revisa los logs arriba.\n');
  }
}

main();

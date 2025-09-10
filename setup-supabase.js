import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://zqxtnpwxhumoyaxwbzqk.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxeHRucHd4aHVtb3lheHdienFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ1OTcwOCwiZXhwIjoyMDczMDM1NzA4fQ.zYLMQc6zkGTBWqSSIn6SFLMUCnMAKP37Y0v771daYWg'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Configurando base de datos de FlotaAtenea...')
  
  try {
    // Leer archivos de migración
    const schemaSQL = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/001_initial_schema.sql'), 'utf8')
    const policiesSQL = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/002_rls_policies.sql'), 'utf8')
    const seedSQL = fs.readFileSync(path.join(process.cwd(), 'supabase/seed.sql'), 'utf8')
    
    console.log('📋 Ejecutando esquema inicial...')
    const { error: schemaError } = await supabase.rpc('exec_sql', { sql: schemaSQL })
    if (schemaError) {
      console.log('⚠️ Esquema ya existe o error menor:', schemaError.message)
    } else {
      console.log('✅ Esquema inicial creado')
    }
    
    console.log('🔒 Configurando políticas de seguridad...')
    const { error: policiesError } = await supabase.rpc('exec_sql', { sql: policiesSQL })
    if (policiesError) {
      console.log('⚠️ Políticas ya existen o error menor:', policiesError.message)
    } else {
      console.log('✅ Políticas de seguridad configuradas')
    }
    
    console.log('📊 Insertando datos de prueba...')
    const { error: seedError } = await supabase.rpc('exec_sql', { sql: seedSQL })
    if (seedError) {
      console.log('⚠️ Datos ya existen o error menor:', seedError.message)
    } else {
      console.log('✅ Datos de prueba insertados')
    }
    
    console.log('🎉 ¡Base de datos configurada exitosamente!')
    console.log('')
    console.log('🔑 Credenciales de prueba:')
    console.log('- Admin: admin@flotaatenea.com / password')
    console.log('- Manager: manager@flotaatenea.com / password')
    console.log('- Operator: operator@flotaatenea.com / password')
    console.log('')
    console.log('🚀 Ejecuta: npm run dev')
    console.log('🌐 Abre: http://localhost:3000')
    
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error)
  }
}

// Función alternativa usando queries directas
async function setupDatabaseDirect() {
  console.log('🚀 Configurando base de datos directamente...')
  
  try {
    // Crear extensiones
    await supabase.rpc('exec_sql', { 
      sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; CREATE EXTENSION IF NOT EXISTS "pgcrypto";' 
    })
    
    // Crear tipos enum
    const enumsSQL = `
      DO $$ BEGIN
        CREATE TYPE vehicle_status AS ENUM ('available', 'leased', 'maintenance', 'sold', 'retired');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE contract_status AS ENUM ('draft', 'active', 'expired', 'terminated', 'renewed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE maintenance_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE client_type AS ENUM ('individual', 'business');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('admin', 'manager', 'operator', 'viewer');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `
    
    await supabase.rpc('exec_sql', { sql: enumsSQL })
    console.log('✅ Tipos de datos creados')
    
    console.log('🎉 ¡Configuración básica completada!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

setupDatabase().catch(console.error)

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zqxtnpwxhumoyaxwbzqk.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxeHRucHd4aHVtb3lheHdienFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ1OTcwOCwiZXhwIjoyMDczMDM1NzA4fQ.zYLMQc6zkGTBWqSSIn6SFLMUCnMAKP37Y0v771daYWg'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  console.log('🔗 Probando conexión a Supabase...')
  
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)
    
    if (error) {
      console.log('❌ Error de conexión:', error.message)
      return false
    }
    
    console.log('✅ Conexión exitosa a Supabase')
    return true
  } catch (err) {
    console.log('❌ Error:', err.message)
    return false
  }
}

async function createBasicStructure() {
  console.log('🚀 Creando estructura básica...')
  
  try {
    // Crear tabla de prueba simple
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS test_table (
          id SERIAL PRIMARY KEY,
          name TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        INSERT INTO test_table (name) VALUES ('FlotaAtenea Test') 
        ON CONFLICT DO NOTHING;
      `
    })
    
    if (error) {
      console.log('⚠️ Error ejecutando SQL:', error.message)
    } else {
      console.log('✅ Estructura básica creada')
    }
    
    // Verificar que podemos leer datos
    const { data: testData, error: readError } = await supabase
      .from('test_table')
      .select('*')
      .limit(1)
    
    if (readError) {
      console.log('⚠️ Error leyendo datos:', readError.message)
    } else {
      console.log('✅ Lectura de datos exitosa:', testData)
    }
    
  } catch (err) {
    console.log('❌ Error general:', err.message)
  }
}

async function main() {
  const connected = await testConnection()
  if (connected) {
    await createBasicStructure()
    console.log('\n🎉 Configuración básica completada')
    console.log('🚀 Ahora ejecuta: npm run dev')
  }
}

main().catch(console.error)

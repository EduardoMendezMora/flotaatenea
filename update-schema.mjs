import { SupabaseManager } from './db-manager.mjs'

async function updateVehiclesSchema() {
  const manager = new SupabaseManager()
  
  try {
    console.log('🔄 Actualizando esquema de vehículos...')
    
    // Ejecutar el archivo SQL de actualización
    await manager.executeSQLFile('./supabase/update_vehicles_schema.sql')
    
    console.log('✅ Esquema actualizado exitosamente')
    
    // Verificar que las columnas se agregaron correctamente
    const result = await manager.executeSQL(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'vehicles' 
      AND column_name IN (
        'body_type', 'engine_displacement', 'cylinders', 'drivetrain',
        'lessor_company', 'lessor_legal_id', 'legal_representative', 
        'representative_id', 'lease_term_weeks', 'weekly_price', 'administrative_costs'
      )
      ORDER BY column_name;
    `, 'Verificando nuevas columnas')
    
    console.log('📋 Nuevas columnas agregadas:')
    result.data?.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
    })
    
  } catch (error) {
    console.error('❌ Error actualizando esquema:', error)
  }
}

updateVehiclesSchema()

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

class SupabaseManager {
  constructor() {
    this.supabaseUrl = 'https://zqxtnpwxhumoyaxwbzqk.supabase.co'
    this.supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxeHRucHd4aHVtb3lheHdienFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ1OTcwOCwiZXhwIjoyMDczMDM1NzA4fQ.zYLMQc6zkGTBWqSSIn6SFLMUCnMAKP37Y0v771daYWg'
    
    this.supabase = createClient(this.supabaseUrl, this.supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }

  async executeSQL(sql, description = 'Ejecutando SQL') {
    console.log(`🔄 ${description}...`)
    
    try {
      const { data, error } = await this.supabase.rpc('exec_sql', { sql })
      
      if (error) {
        console.log(`❌ Error: ${error.message}`)
        return { success: false, error: error.message }
      }
      
      console.log(`✅ ${description} - Completado`)
      return { success: true, data }
    } catch (err) {
      console.log(`❌ Error ejecutando SQL: ${err.message}`)
      return { success: false, error: err.message }
    }
  }

  async addColumn(tableName, columnName, columnType, constraints = '') {
    const sql = `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${columnName} ${columnType} ${constraints};`
    return await this.executeSQL(sql, `Agregando columna ${columnName} a tabla ${tableName}`)
  }

  async dropColumn(tableName, columnName) {
    const sql = `ALTER TABLE ${tableName} DROP COLUMN IF EXISTS ${columnName};`
    return await this.executeSQL(sql, `Eliminando columna ${columnName} de tabla ${tableName}`)
  }

  async modifyColumn(tableName, columnName, newType) {
    const sql = `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} TYPE ${newType};`
    return await this.executeSQL(sql, `Modificando columna ${columnName} en tabla ${tableName}`)
  }

  async createTable(tableName, columns) {
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns});`
    return await this.executeSQL(sql, `Creando tabla ${tableName}`)
  }

  async dropTable(tableName) {
    const sql = `DROP TABLE IF EXISTS ${tableName} CASCADE;`
    return await this.executeSQL(sql, `Eliminando tabla ${tableName}`)
  }

  async createIndex(indexName, tableName, columns) {
    const sql = `CREATE INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${columns});`
    return await this.executeSQL(sql, `Creando índice ${indexName}`)
  }

  async addEnum(enumName, values) {
    const sql = `
      DO $$ BEGIN
        CREATE TYPE ${enumName} AS ENUM (${values.map(v => `'${v}'`).join(', ')});
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `
    return await this.executeSQL(sql, `Creando enum ${enumName}`)
  }

  async addEnumValue(enumName, newValue) {
    const sql = `ALTER TYPE ${enumName} ADD VALUE IF NOT EXISTS '${newValue}';`
    return await this.executeSQL(sql, `Agregando valor '${newValue}' al enum ${enumName}`)
  }

  async createFunction(functionName, functionBody) {
    const sql = `CREATE OR REPLACE FUNCTION ${functionName} ${functionBody}`
    return await this.executeSQL(sql, `Creando función ${functionName}`)
  }

  async createTrigger(triggerName, tableName, triggerBody) {
    const sql = `
      DROP TRIGGER IF EXISTS ${triggerName} ON ${tableName};
      CREATE TRIGGER ${triggerName} ${triggerBody}
    `
    return await this.executeSQL(sql, `Creando trigger ${triggerName}`)
  }

  async insertData(tableName, data) {
    const columns = Object.keys(data).join(', ')
    const values = Object.values(data).map(v => 
      typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v
    ).join(', ')
    
    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${values}) ON CONFLICT DO NOTHING;`
    return await this.executeSQL(sql, `Insertando datos en ${tableName}`)
  }

  async updateData(tableName, data, whereClause) {
    const setClause = Object.entries(data)
      .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value}`)
      .join(', ')
    
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause};`
    return await this.executeSQL(sql, `Actualizando datos en ${tableName}`)
  }

  async deleteData(tableName, whereClause) {
    const sql = `DELETE FROM ${tableName} WHERE ${whereClause};`
    return await this.executeSQL(sql, `Eliminando datos de ${tableName}`)
  }

  async queryData(tableName, columns = '*', whereClause = '') {
    const sql = `SELECT ${columns} FROM ${tableName} ${whereClause ? `WHERE ${whereClause}` : ''};`
    return await this.executeSQL(sql, `Consultando datos de ${tableName}`)
  }

  async testConnection() {
    console.log('🔗 Probando conexión a Supabase...')
    
    try {
      const { data, error } = await this.supabase
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

  async runMigrationFile(filePath) {
    try {
      const sql = fs.readFileSync(filePath, 'utf8')
      return await this.executeSQL(sql, `Ejecutando migración ${path.basename(filePath)}`)
    } catch (err) {
      console.log(`❌ Error leyendo archivo ${filePath}: ${err.message}`)
      return { success: false, error: err.message }
    }
  }

  async backupTable(tableName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupTableName = `${tableName}_backup_${timestamp}`
    
    const sql = `CREATE TABLE ${backupTableName} AS SELECT * FROM ${tableName};`
    return await this.executeSQL(sql, `Creando backup de ${tableName} como ${backupTableName}`)
  }

  async getTableSchema(tableName) {
    const sql = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = '${tableName}'
      ORDER BY ordinal_position;
    `
    return await this.executeSQL(sql, `Obteniendo esquema de tabla ${tableName}`)
  }

  async listTables() {
    const sql = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `
    return await this.executeSQL(sql, 'Listando tablas')
  }
}

// Función de utilidad para usar el manager
export async function withDB(callback) {
  const db = new SupabaseManager()
  
  const connected = await db.testConnection()
  if (!connected) {
    throw new Error('No se pudo conectar a Supabase')
  }
  
  return await callback(db)
}

// Exportar la clase para uso directo
export { SupabaseManager }

// Si se ejecuta directamente, hacer una prueba
if (import.meta.url === `file://${process.argv[1]}`) {
  withDB(async (db) => {
    console.log('🚀 Probando SupabaseManager...')
    
    // Listar tablas existentes
    const tables = await db.listTables()
    console.log('📋 Tablas encontradas:', tables)
    
    console.log('✅ SupabaseManager funcionando correctamente')
  }).catch(console.error)
}

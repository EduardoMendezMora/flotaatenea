import { SupabaseManager, withDB } from '../db-manager.mjs'
import fs from 'fs'
import path from 'path'

class MigrationRunner {
  constructor() {
    this.migrationsDir = './supabase'
    this.migrationFiles = [
      'complete_setup.sql',
      'rls_policies.sql', 
      'sample_data.sql'
    ]
  }

  async runAllMigrations() {
    console.log('🚀 Iniciando migraciones de FlotaAtenea...')
    
    return await withDB(async (db) => {
      const results = []
      
      for (const file of this.migrationFiles) {
        const filePath = path.join(this.migrationsDir, file)
        
        if (fs.existsSync(filePath)) {
          console.log(`\n📄 Ejecutando ${file}...`)
          const result = await db.runMigrationFile(filePath)
          results.push({ file, ...result })
          
          if (!result.success) {
            console.log(`❌ Error en ${file}: ${result.error}`)
            break
          }
        } else {
          console.log(`⚠️ Archivo no encontrado: ${filePath}`)
        }
      }
      
      return results
    })
  }

  async createMigration(name, sql) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
    const filename = `${timestamp}_${name}.sql`
    const filePath = path.join('./migrations', filename)
    
    // Crear directorio si no existe
    if (!fs.existsSync('./migrations')) {
      fs.mkdirSync('./migrations', { recursive: true })
    }
    
    fs.writeFileSync(filePath, sql)
    console.log(`✅ Migración creada: ${filename}`)
    
    return filePath
  }

  async runCustomMigration(sql, description = 'Migración personalizada') {
    return await withDB(async (db) => {
      return await db.executeSQL(sql, description)
    })
  }
}

// Funciones de utilidad para modificaciones comunes
export class SchemaModifier {
  static async addVehicleFeatures() {
    const sql = `
      -- Agregar nuevas columnas para características avanzadas de vehículos
      ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS gps_enabled BOOLEAN DEFAULT false;
      ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS telematics_device_id TEXT;
      ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS fuel_efficiency DECIMAL(5,2);
      ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS co2_emissions INTEGER;
      ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS safety_rating INTEGER CHECK (safety_rating >= 1 AND safety_rating <= 5);
      ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS features TEXT[];
      ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS warranty_expiry DATE;
      
      -- Crear índices para las nuevas columnas
      CREATE INDEX IF NOT EXISTS idx_vehicles_gps_enabled ON vehicles(gps_enabled);
      CREATE INDEX IF NOT EXISTS idx_vehicles_safety_rating ON vehicles(safety_rating);
    `
    
    return await withDB(async (db) => {
      return await db.executeSQL(sql, 'Agregando características avanzadas a vehículos')
    })
  }

  static async addClientCreditHistory() {
    const sql = `
      -- Crear tabla para historial crediticio de clientes
      CREATE TABLE IF NOT EXISTS client_credit_history (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        client_id UUID REFERENCES clients(id) NOT NULL,
        credit_score INTEGER,
        credit_bureau TEXT,
        report_date DATE NOT NULL,
        payment_history_score INTEGER,
        debt_to_income_ratio DECIMAL(5,2),
        notes TEXT,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Crear índices
      CREATE INDEX IF NOT EXISTS idx_credit_history_client ON client_credit_history(client_id);
      CREATE INDEX IF NOT EXISTS idx_credit_history_date ON client_credit_history(report_date);
      
      -- Trigger para updated_at
      CREATE TRIGGER update_credit_history_updated_at 
        BEFORE UPDATE ON client_credit_history 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `
    
    return await withDB(async (db) => {
      return await db.executeSQL(sql, 'Creando tabla de historial crediticio')
    })
  }

  static async addContractDocuments() {
    const sql = `
      -- Crear tabla para documentos de contratos
      CREATE TABLE IF NOT EXISTS contract_documents (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        contract_id UUID REFERENCES contracts(id) NOT NULL,
        document_type TEXT NOT NULL,
        document_name TEXT NOT NULL,
        document_url TEXT NOT NULL,
        file_size INTEGER,
        mime_type TEXT,
        uploaded_by UUID REFERENCES users(id),
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_signed BOOLEAN DEFAULT false,
        signed_at TIMESTAMP WITH TIME ZONE,
        signed_by UUID REFERENCES users(id)
      );
      
      -- Crear índices
      CREATE INDEX IF NOT EXISTS idx_contract_docs_contract ON contract_documents(contract_id);
      CREATE INDEX IF NOT EXISTS idx_contract_docs_type ON contract_documents(document_type);
    `
    
    return await withDB(async (db) => {
      return await db.executeSQL(sql, 'Creando tabla de documentos de contratos')
    })
  }

  static async addPaymentReminders() {
    const sql = `
      -- Crear tabla para recordatorios de pagos
      CREATE TABLE IF NOT EXISTS payment_reminders (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        payment_id UUID REFERENCES payments(id) NOT NULL,
        reminder_type TEXT NOT NULL, -- 'email', 'sms', 'call'
        reminder_date DATE NOT NULL,
        sent_at TIMESTAMP WITH TIME ZONE,
        status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
        message TEXT,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Crear índices
      CREATE INDEX IF NOT EXISTS idx_reminders_payment ON payment_reminders(payment_id);
      CREATE INDEX IF NOT EXISTS idx_reminders_date ON payment_reminders(reminder_date);
      CREATE INDEX IF NOT EXISTS idx_reminders_status ON payment_reminders(status);
    `
    
    return await withDB(async (db) => {
      return await db.executeSQL(sql, 'Creando tabla de recordatorios de pagos')
    })
  }

  static async addVehicleTracking() {
    const sql = `
      -- Crear tabla para seguimiento GPS de vehículos
      CREATE TABLE IF NOT EXISTS vehicle_tracking (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        speed INTEGER, -- km/h
        heading INTEGER, -- grados 0-360
        altitude INTEGER, -- metros
        accuracy INTEGER, -- metros
        battery_level INTEGER, -- porcentaje
        ignition_status BOOLEAN,
        recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Crear índices para consultas eficientes
      CREATE INDEX IF NOT EXISTS idx_tracking_vehicle ON vehicle_tracking(vehicle_id);
      CREATE INDEX IF NOT EXISTS idx_tracking_recorded_at ON vehicle_tracking(recorded_at);
      CREATE INDEX IF NOT EXISTS idx_tracking_vehicle_time ON vehicle_tracking(vehicle_id, recorded_at);
    `
    
    return await withDB(async (db) => {
      return await db.executeSQL(sql, 'Creando tabla de seguimiento GPS')
    })
  }
}

export { MigrationRunner }

// Si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new MigrationRunner()
  
  const command = process.argv[2]
  
  switch (command) {
    case 'run':
      runner.runAllMigrations().then(results => {
        console.log('\n📊 Resumen de migraciones:')
        results.forEach(r => {
          console.log(`${r.success ? '✅' : '❌'} ${r.file}`)
        })
      }).catch(console.error)
      break
      
    case 'add-features':
      SchemaModifier.addVehicleFeatures().then(result => {
        console.log(result.success ? '✅ Características agregadas' : `❌ Error: ${result.error}`)
      }).catch(console.error)
      break
      
    case 'add-credit':
      SchemaModifier.addClientCreditHistory().then(result => {
        console.log(result.success ? '✅ Historial crediticio agregado' : `❌ Error: ${result.error}`)
      }).catch(console.error)
      break
      
    case 'add-docs':
      SchemaModifier.addContractDocuments().then(result => {
        console.log(result.success ? '✅ Documentos de contratos agregados' : `❌ Error: ${result.error}`)
      }).catch(console.error)
      break
      
    case 'add-reminders':
      SchemaModifier.addPaymentReminders().then(result => {
        console.log(result.success ? '✅ Recordatorios agregados' : `❌ Error: ${result.error}`)
      }).catch(console.error)
      break
      
    case 'add-tracking':
      SchemaModifier.addVehicleTracking().then(result => {
        console.log(result.success ? '✅ Seguimiento GPS agregado' : `❌ Error: ${result.error}`)
      }).catch(console.error)
      break
      
    default:
      console.log(`
Uso: node migration-runner.mjs [comando]

Comandos disponibles:
  run           - Ejecutar todas las migraciones base
  add-features  - Agregar características avanzadas a vehículos
  add-credit    - Agregar historial crediticio de clientes
  add-docs      - Agregar documentos de contratos
  add-reminders - Agregar recordatorios de pagos
  add-tracking  - Agregar seguimiento GPS de vehículos
      `)
  }
}

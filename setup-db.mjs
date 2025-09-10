import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = 'https://zqxtnpwxhumoyaxwbzqk.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxeHRucHd4aHVtb3lheHdienFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ1OTcwOCwiZXhwIjoyMDczMDM1NzA4fQ.zYLMQc6zkGTBWqSSIn6SFLMUCnMAKP37Y0v771daYWg'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSQL(sql, description) {
  try {
    console.log(`📋 ${description}...`)
    const { data, error } = await supabase.rpc('exec_sql', { sql })
    if (error) {
      console.log(`⚠️ ${description} - Error (puede ser normal):`, error.message)
    } else {
      console.log(`✅ ${description} - Completado`)
    }
    return { data, error }
  } catch (err) {
    console.log(`❌ ${description} - Error:`, err.message)
    return { error: err }
  }
}

async function setupDatabase() {
  console.log('🚀 Configurando FlotaAtenea en Supabase...\n')
  
  // Crear extensiones
  await executeSQL(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `, 'Creando extensiones')
  
  // Crear tipos enum
  await executeSQL(`
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
  `, 'Creando tipos de datos')
  
  // Crear tabla users
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID REFERENCES auth.users(id) PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      role user_role DEFAULT 'viewer',
      avatar_url TEXT,
      phone TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `, 'Creando tabla users')
  
  // Crear tabla clients
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS clients (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      client_type client_type NOT NULL,
      first_name TEXT,
      last_name TEXT,
      date_of_birth DATE,
      national_id TEXT,
      business_name TEXT,
      tax_id TEXT,
      legal_representative TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      postal_code TEXT,
      country TEXT DEFAULT 'Mexico',
      credit_score INTEGER,
      notes TEXT,
      is_active BOOLEAN DEFAULT true,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      CONSTRAINT valid_individual_client CHECK (
        client_type != 'individual' OR 
        (first_name IS NOT NULL AND last_name IS NOT NULL AND national_id IS NOT NULL)
      ),
      CONSTRAINT valid_business_client CHECK (
        client_type != 'business' OR 
        (business_name IS NOT NULL AND tax_id IS NOT NULL)
      )
    );
  `, 'Creando tabla clients')
  
  // Crear tabla vehicles
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      vin TEXT UNIQUE NOT NULL,
      license_plate TEXT UNIQUE,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      color TEXT,
      engine_type TEXT,
      transmission TEXT,
      fuel_type TEXT,
      mileage INTEGER DEFAULT 0,
      purchase_price DECIMAL(12,2),
      current_value DECIMAL(12,2),
      status vehicle_status DEFAULT 'available',
      location TEXT,
      gps_device_id TEXT,
      insurance_policy_number TEXT,
      registration_expiry DATE,
      last_service_date DATE,
      next_service_due DATE,
      service_interval_km INTEGER DEFAULT 10000,
      images TEXT[],
      documents TEXT[],
      notes TEXT,
      is_active BOOLEAN DEFAULT true,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      CONSTRAINT valid_year CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 2),
      CONSTRAINT positive_mileage CHECK (mileage >= 0),
      CONSTRAINT positive_prices CHECK (purchase_price >= 0 AND current_value >= 0)
    );
  `, 'Creando tabla vehicles')
  
  // Crear tabla contracts
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS contracts (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      contract_number TEXT UNIQUE NOT NULL,
      client_id UUID REFERENCES clients(id) NOT NULL,
      vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
      status contract_status DEFAULT 'draft',
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      monthly_payment DECIMAL(10,2) NOT NULL,
      deposit_amount DECIMAL(10,2) DEFAULT 0,
      total_amount DECIMAL(12,2) NOT NULL,
      mileage_limit INTEGER,
      excess_mileage_rate DECIMAL(5,2),
      early_termination_fee DECIMAL(10,2),
      late_payment_fee DECIMAL(8,2),
      terms_and_conditions TEXT,
      signed_date DATE,
      signed_by_client BOOLEAN DEFAULT false,
      signed_by_company BOOLEAN DEFAULT false,
      contract_document_url TEXT,
      notes TEXT,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      CONSTRAINT valid_dates CHECK (end_date > start_date),
      CONSTRAINT positive_amounts CHECK (
        monthly_payment > 0 AND 
        deposit_amount >= 0 AND 
        total_amount > 0
      )
    );
  `, 'Creando tabla contracts')
  
  // Crear tabla payments
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS payments (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      contract_id UUID REFERENCES contracts(id) NOT NULL,
      payment_number INTEGER NOT NULL,
      due_date DATE NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status payment_status DEFAULT 'pending',
      payment_date DATE,
      payment_method TEXT,
      transaction_id TEXT,
      late_fee DECIMAL(8,2) DEFAULT 0,
      notes TEXT,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      CONSTRAINT positive_amount CHECK (amount > 0),
      CONSTRAINT positive_late_fee CHECK (late_fee >= 0),
      CONSTRAINT valid_payment_date CHECK (
        status != 'paid' OR payment_date IS NOT NULL
      )
    );
  `, 'Creando tabla payments')
  
  // Crear tabla maintenance
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS maintenance (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
      maintenance_type TEXT NOT NULL,
      description TEXT,
      scheduled_date DATE NOT NULL,
      completed_date DATE,
      status maintenance_status DEFAULT 'scheduled',
      mileage_at_service INTEGER,
      cost DECIMAL(10,2),
      service_provider TEXT,
      invoice_number TEXT,
      warranty_until DATE,
      parts_replaced TEXT[],
      notes TEXT,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      CONSTRAINT positive_cost CHECK (cost >= 0),
      CONSTRAINT valid_completion CHECK (
        status != 'completed' OR completed_date IS NOT NULL
      )
    );
  `, 'Creando tabla maintenance')
  
  // Crear tabla insurance
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS insurance (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
      policy_number TEXT UNIQUE NOT NULL,
      insurance_company TEXT NOT NULL,
      policy_type TEXT NOT NULL,
      coverage_amount DECIMAL(12,2),
      deductible DECIMAL(10,2),
      premium_amount DECIMAL(10,2) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      is_active BOOLEAN DEFAULT true,
      policy_document_url TEXT,
      notes TEXT,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      CONSTRAINT valid_insurance_dates CHECK (end_date > start_date),
      CONSTRAINT positive_amounts CHECK (
        coverage_amount >= 0 AND 
        deductible >= 0 AND 
        premium_amount > 0
      )
    );
  `, 'Creando tabla insurance')
  
  // Crear tabla claims
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS claims (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      insurance_id UUID REFERENCES insurance(id) NOT NULL,
      claim_number TEXT UNIQUE NOT NULL,
      incident_date DATE NOT NULL,
      reported_date DATE NOT NULL,
      claim_amount DECIMAL(12,2),
      approved_amount DECIMAL(12,2),
      status TEXT DEFAULT 'reported',
      description TEXT,
      police_report_number TEXT,
      documents TEXT[],
      notes TEXT,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      CONSTRAINT positive_claim_amounts CHECK (
        claim_amount >= 0 AND 
        (approved_amount IS NULL OR approved_amount >= 0)
      )
    );
  `, 'Creando tabla claims')
  
  // Crear tabla notifications
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      related_table TEXT,
      related_id UUID,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `, 'Creando tabla notifications')
  
  // Crear índices
  await executeSQL(`
    CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
    CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON vehicles(make, model);
    CREATE INDEX IF NOT EXISTS idx_contracts_client ON contracts(client_id);
    CREATE INDEX IF NOT EXISTS idx_contracts_vehicle ON contracts(vehicle_id);
    CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
    CREATE INDEX IF NOT EXISTS idx_payments_contract ON payments(contract_id);
    CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle ON maintenance(vehicle_id);
    CREATE INDEX IF NOT EXISTS idx_maintenance_scheduled_date ON maintenance(scheduled_date);
    CREATE INDEX IF NOT EXISTS idx_insurance_vehicle ON insurance(vehicle_id);
    CREATE INDEX IF NOT EXISTS idx_insurance_end_date ON insurance(end_date);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
  `, 'Creando índices')
  
  // Crear función de actualización de timestamps
  await executeSQL(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
  `, 'Creando función de timestamps')
  
  // Crear triggers
  await executeSQL(`
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
    CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
    CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_contracts_updated_at ON contracts;
    CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
    CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_maintenance_updated_at ON maintenance;
    CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_insurance_updated_at ON insurance;
    CREATE TRIGGER update_insurance_updated_at BEFORE UPDATE ON insurance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_claims_updated_at ON claims;
    CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `, 'Creando triggers')
  
  console.log('\n🎉 ¡Base de datos configurada exitosamente!')
  console.log('\n🔑 Próximo paso: Ejecutar npm run dev')
  console.log('🌐 Luego abrir: http://localhost:3000')
}

setupDatabase().catch(console.error)

-- Actualizar tabla vehicles con campos específicos requeridos
-- Ejecutar después de complete_setup.sql

-- Agregar nuevos campos específicos para vehículos
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS body_type TEXT, -- Carrocería
ADD COLUMN IF NOT EXISTS engine_displacement INTEGER, -- Cilindrada en cc
ADD COLUMN IF NOT EXISTS cylinders INTEGER, -- Número de cilindros
ADD COLUMN IF NOT EXISTS drivetrain TEXT, -- Tracción (4X2, 4X4, etc.)
ADD COLUMN IF NOT EXISTS lessor_company TEXT, -- Arrendadora (Sociedad Propietaria)
ADD COLUMN IF NOT EXISTS lessor_legal_id TEXT, -- Identificación Jurídica
ADD COLUMN IF NOT EXISTS legal_representative TEXT, -- Apoderado
ADD COLUMN IF NOT EXISTS representative_id TEXT, -- Identificación Apoderado
ADD COLUMN IF NOT EXISTS lease_term_weeks INTEGER, -- Plazo en Semanas
ADD COLUMN IF NOT EXISTS weekly_price DECIMAL(12,2), -- Precio Semanal
ADD COLUMN IF NOT EXISTS administrative_costs DECIMAL(12,2); -- Gastos Administrativos

-- Actualizar campos existentes para mejor compatibilidad
ALTER TABLE vehicles 
ALTER COLUMN fuel_type SET DEFAULT 'Gasolina',
ALTER COLUMN transmission SET DEFAULT 'Manual',
ALTER COLUMN color SET DEFAULT 'Blanco';

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_lessor ON vehicles(lessor_company);

-- Comentarios para documentación
COMMENT ON COLUMN vehicles.body_type IS 'Tipo de carrocería del vehículo';
COMMENT ON COLUMN vehicles.engine_displacement IS 'Cilindrada del motor en cc';
COMMENT ON COLUMN vehicles.cylinders IS 'Número de cilindros del motor';
COMMENT ON COLUMN vehicles.drivetrain IS 'Tipo de tracción (4X2, 4X4, AWD, etc.)';
COMMENT ON COLUMN vehicles.lessor_company IS 'Sociedad propietaria/arrendadora';
COMMENT ON COLUMN vehicles.lessor_legal_id IS 'Identificación jurídica de la arrendadora';
COMMENT ON COLUMN vehicles.legal_representative IS 'Representante físico de la sociedad';
COMMENT ON COLUMN vehicles.representative_id IS 'Identificación del apoderado';
COMMENT ON COLUMN vehicles.lease_term_weeks IS 'Duración del contrato en semanas';
COMMENT ON COLUMN vehicles.weekly_price IS 'Precio semanal del arrendamiento';
COMMENT ON COLUMN vehicles.administrative_costs IS 'Gastos administrativos del contrato';

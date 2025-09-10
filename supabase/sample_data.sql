-- FlotaAtenea - Datos de ejemplo
-- Ejecuta este script DESPUÉS de complete_setup.sql y rls_policies.sql

-- 1. IMPORTANTE: Primero debes crear estos usuarios en Authentication > Users en Supabase Dashboard
-- Luego ejecuta este script para completar sus perfiles

-- Insertar perfiles de usuarios (solo si ya existen en auth.users)
INSERT INTO users (id, email, full_name, role, phone, is_active) 
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'admin@flotaatenea.com' THEN 'Administrador Sistema'
    WHEN au.email = 'manager@flotaatenea.com' THEN 'Gerente General'
    WHEN au.email = 'operator@flotaatenea.com' THEN 'Operador Principal'
    WHEN au.email = 'viewer@flotaatenea.com' THEN 'Consultor Externo'
    ELSE 'Usuario'
  END as full_name,
  CASE 
    WHEN au.email = 'admin@flotaatenea.com' THEN 'admin'::user_role
    WHEN au.email = 'manager@flotaatenea.com' THEN 'manager'::user_role
    WHEN au.email = 'operator@flotaatenea.com' THEN 'operator'::user_role
    WHEN au.email = 'viewer@flotaatenea.com' THEN 'viewer'::user_role
    ELSE 'viewer'::user_role
  END as role,
  CASE 
    WHEN au.email = 'admin@flotaatenea.com' THEN '+52 55 1234 5678'
    WHEN au.email = 'manager@flotaatenea.com' THEN '+52 55 2345 6789'
    WHEN au.email = 'operator@flotaatenea.com' THEN '+52 55 3456 7890'
    WHEN au.email = 'viewer@flotaatenea.com' THEN '+52 55 4567 8901'
    ELSE NULL
  END as phone,
  true as is_active
FROM auth.users au
WHERE au.email IN ('admin@flotaatenea.com', 'manager@flotaatenea.com', 'operator@flotaatenea.com', 'viewer@flotaatenea.com')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;

-- 2. Insertar clientes de ejemplo (usando IDs dinámicos de usuarios existentes)
INSERT INTO clients (id, client_type, first_name, last_name, national_id, email, phone, address, city, state, postal_code, credit_score, business_name, tax_id, legal_representative, created_by) VALUES
(uuid_generate_v4(), 'individual', 'Juan Carlos', 'Pérez López', 'CURP123456789', 'juan.perez@email.com', '+52 55 1111 2222', 'Av. Insurgentes Sur 1234', 'Ciudad de México', 'CDMX', '03100', 750, NULL, NULL, NULL, (SELECT id FROM users WHERE email = 'admin@flotaatenea.com' LIMIT 1)),
(uuid_generate_v4(), 'individual', 'María Elena', 'García Rodríguez', 'CURP987654321', 'maria.garcia@email.com', '+52 55 3333 4444', 'Calle Reforma 567', 'Guadalajara', 'Jalisco', '44100', 680, NULL, NULL, NULL, (SELECT id FROM users WHERE email = 'manager@flotaatenea.com' LIMIT 1)),
(uuid_generate_v4(), 'business', NULL, NULL, NULL, 'contacto@empresaabc.com', '+52 55 5555 6666', 'Blvd. Manuel Ávila Camacho 890', 'Monterrey', 'Nuevo León', '64000', 820, 'Empresa ABC S.A. de C.V.', 'RFC123456789', 'Roberto Martínez Silva', (SELECT id FROM users WHERE email = 'admin@flotaatenea.com' LIMIT 1));

-- 3.-- Insertar datos de ejemplo para vehículos con campos específicos
INSERT INTO vehicles (
  vin, license_plate, make, model, year, color, engine_type, transmission, fuel_type,
  mileage, purchase_price, current_value, status, location,
  body_type, engine_displacement, cylinders, drivetrain,
  lessor_company, lessor_legal_id, legal_representative, representative_id,
  lease_term_weeks, weekly_price, administrative_costs
) VALUES
(
  '1HGBH41JXMN109186', 'BRR629', 'Chevrolet', 'Beat', 2019, 'Blanco', 'I4', 'Manual', 'Gasolina',
  15000, 25000.00, 23000.00, 'available', 'San José',
  'Hatchback', 1200, 4, '4X2',
  'Leasing Costa Rica S.A.', '3-101-123456', 'Juan Pérez Rodríguez', '1-1234-5678',
  189, 100000.00, 400000.00
),
(
  '2HGBH41JXMN109187', 'DEF456', 'Honda', 'Civic', 2021, 'Negro', 'I4', 'Manual', 'Gasolina',
  25000, 22000.00, 20000.00, 'leased', 'Cartago',
  'Sedán', 1500, 4, '4X2',
  'Arrendadora Nacional S.A.', '3-101-654321', 'María González López', '2-2345-6789',
  156, 120000.00, 350000.00
),
(
  '3HGBH41JXMN109188', 'GHI789', 'Nissan', 'Sentra', 2023, 'Azul', 'I4', 'CVT', 'Gasolina',
  8000, 24000.00, 23500.00, 'available', 'Alajuela',
  'Sedán', 1600, 4, '4X2',
  'Flota Atenea S.A.', '3-101-789012', 'Carlos Jiménez Vargas', '1-3456-7890',
  208, 110000.00, 450000.00
);

-- 4. Insertar contratos de ejemplo
INSERT INTO contracts (id, contract_number, client_id, vehicle_id, status, start_date, end_date, monthly_payment, deposit_amount, total_amount, mileage_limit, signed_date, signed_by_client, signed_by_company, created_by) VALUES
(uuid_generate_v4(), 'CONT-2024-001', 
 (SELECT id FROM clients WHERE email = 'juan.perez@email.com' LIMIT 1),
 (SELECT id FROM vehicles WHERE license_plate = 'DEF-456-B' LIMIT 1),
 'active', '2024-01-15', '2026-01-14', 8500.00, 25500.00, 204000.00, 20000, '2024-01-10', true, true, (SELECT id FROM users WHERE email = 'manager@flotaatenea.com' LIMIT 1)),
(uuid_generate_v4(), 'CONT-2024-002', 
 (SELECT id FROM clients WHERE email = 'contacto@empresaabc.com' LIMIT 1),
 (SELECT id FROM vehicles WHERE license_plate = 'MNO-345-E' LIMIT 1),
 'active', '2024-02-01', '2027-01-31', 9200.00, 27600.00, 331200.00, 25000, '2024-01-28', true, true, (SELECT id FROM users WHERE email = 'admin@flotaatenea.com' LIMIT 1)),
(uuid_generate_v4(), 'CONT-2024-003', 
 (SELECT id FROM clients WHERE email = 'maria.garcia@email.com' LIMIT 1),
 (SELECT id FROM vehicles WHERE license_plate = 'ABC-123-A' LIMIT 1),
 'draft', '2024-03-01', '2026-02-28', 7800.00, 23400.00, 187200.00, 18000, NULL, false, false, (SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1));

-- 5. Insertar pagos de ejemplo
INSERT INTO payments (contract_id, payment_number, due_date, amount, status, payment_date, payment_method, transaction_id, created_by) VALUES
((SELECT id FROM contracts WHERE contract_number = 'CONT-2024-001' LIMIT 1), 1, '2024-02-15', 8500.00, 'paid', '2024-02-14', 'Transferencia', 'TXN-20240214-001', (SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1)),
((SELECT id FROM contracts WHERE contract_number = 'CONT-2024-001' LIMIT 1), 2, '2024-03-15', 8500.00, 'paid', '2024-03-13', 'Transferencia', 'TXN-20240313-002', (SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1)),
((SELECT id FROM contracts WHERE contract_number = 'CONT-2024-001' LIMIT 1), 3, '2024-04-15', 8500.00, 'pending', NULL, NULL, NULL, (SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1)),
((SELECT id FROM contracts WHERE contract_number = 'CONT-2024-002' LIMIT 1), 1, '2024-03-01', 9200.00, 'paid', '2024-02-28', 'Cheque', 'CHK-20240228-001', (SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1)),
((SELECT id FROM contracts WHERE contract_number = 'CONT-2024-002' LIMIT 1), 2, '2024-04-01', 9200.00, 'overdue', NULL, NULL, NULL, (SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1));

-- 6. Insertar mantenimientos de ejemplo
INSERT INTO maintenance (vehicle_id, maintenance_type, description, scheduled_date, completed_date, status, mileage_at_service, cost, service_provider, created_by) VALUES
((SELECT id FROM vehicles WHERE license_plate = 'DEF-456-B' LIMIT 1), 'Servicio Mayor', 'Cambio de aceite, filtros y revisión general', '2024-01-20', '2024-01-20', 'completed', 24000, 2500.00, 'Taller Nissan Oficial', (SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1)),
((SELECT id FROM vehicles WHERE license_plate = 'JKL-012-D' LIMIT 1), 'Reparación', 'Cambio de frenos delanteros', '2024-03-10', NULL, 'in_progress', 34500, 4500.00, 'Taller Ford Autorizado', (SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1)),
((SELECT id FROM vehicles WHERE license_plate = 'ABC-123-A' LIMIT 1), 'Servicio Menor', 'Cambio de aceite y filtro de aire', '2024-04-05', NULL, 'scheduled', NULL, 1200.00, 'Taller Toyota', (SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1)),
((SELECT id FROM vehicles WHERE license_plate = 'MNO-345-E' LIMIT 1), 'Inspección', 'Revisión de 10,000 km', '2024-03-25', '2024-03-25', 'completed', 11500, 800.00, 'Taller Hyundai', (SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1));

-- 7. Insertar seguros de ejemplo
INSERT INTO insurance (vehicle_id, policy_number, insurance_company, policy_type, coverage_amount, deductible, premium_amount, start_date, end_date, created_by) VALUES
((SELECT id FROM vehicles WHERE license_plate = 'ABC-123-A' LIMIT 1), 'POL-TOY-2024-001', 'Seguros Monterrey', 'Cobertura Amplia', 400000.00, 5000.00, 12000.00, '2024-01-01', '2024-12-31', (SELECT id FROM users WHERE email = 'manager@flotaatenea.com' LIMIT 1)),
((SELECT id FROM vehicles WHERE license_plate = 'DEF-456-B' LIMIT 1), 'POL-NIS-2024-002', 'AXA Seguros', 'Cobertura Amplia', 300000.00, 4000.00, 10800.00, '2024-01-15', '2025-01-14', (SELECT id FROM users WHERE email = 'manager@flotaatenea.com' LIMIT 1)),
((SELECT id FROM vehicles WHERE license_plate = 'GHI-789-C' LIMIT 1), 'POL-CHE-2024-003', 'Seguros Banorte', 'Cobertura Limitada', 500000.00, 6000.00, 15000.00, '2024-02-01', '2025-01-31', (SELECT id FROM users WHERE email = 'admin@flotaatenea.com' LIMIT 1)),
((SELECT id FROM vehicles WHERE license_plate = 'JKL-012-D' LIMIT 1), 'POL-FOR-2024-004', 'Qualitas Seguros', 'Cobertura Amplia', 650000.00, 8000.00, 18500.00, '2024-01-10', '2025-01-09', (SELECT id FROM users WHERE email = 'manager@flotaatenea.com' LIMIT 1)),
((SELECT id FROM vehicles WHERE license_plate = 'MNO-345-E' LIMIT 1), 'POL-HYU-2024-005', 'HDI Seguros', 'Cobertura Amplia', 380000.00, 4500.00, 11200.00, '2024-02-01', '2025-01-31', (SELECT id FROM users WHERE email = 'manager@flotaatenea.com' LIMIT 1));

-- 8. Insertar reclamos de ejemplo
INSERT INTO claims (insurance_id, claim_number, incident_date, reported_date, claim_amount, approved_amount, status, description, created_by) VALUES
((SELECT id FROM insurance WHERE policy_number = 'POL-NIS-2024-002'), 'CLM-2024-001', '2024-02-20', '2024-02-21', 15000.00, 12000.00, 'approved', 'Daños menores en parachoques trasero por alcance', (SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1)),
((SELECT id FROM insurance WHERE policy_number = 'POL-FOR-2024-004'), 'CLM-2024-002', '2024-03-05', '2024-03-06', 25000.00, NULL, 'under_review', 'Cristal delantero estrellado por piedra en carretera', (SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1));

-- 9. Insertar notificaciones de ejemplo (usando IDs dinámicos de usuarios)
INSERT INTO notifications (user_id, title, message, type, related_table) VALUES
((SELECT id FROM users WHERE email = 'manager@flotaatenea.com' LIMIT 1), 'Pago Vencido', 'Hay pagos vencidos pendientes de revisión', 'payment_overdue', 'payments'),
((SELECT id FROM users WHERE email = 'operator@flotaatenea.com' LIMIT 1), 'Mantenimiento Programado', 'Hay mantenimientos programados para esta semana', 'maintenance_due', 'maintenance'),
((SELECT id FROM users WHERE email = 'admin@flotaatenea.com' LIMIT 1), 'Seguro por Vencer', 'Hay pólizas de seguro próximas a vencer', 'insurance_expiring', 'insurance'),
((SELECT id FROM users WHERE email = 'manager@flotaatenea.com' LIMIT 1), 'Nuevo Reclamo', 'Se han registrado nuevos reclamos para revisión', 'new_claim', 'claims');

-- Mensaje de confirmación
SELECT 'Datos de ejemplo insertados correctamente en FlotaAtenea' as resultado;

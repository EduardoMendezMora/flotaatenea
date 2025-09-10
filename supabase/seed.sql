-- Sample data for FlotaAtenea system
-- This file contains test data to populate the database for development and testing

-- Insert sample users (these will be created after auth users are created)
-- Note: In production, users are created through Supabase Auth
INSERT INTO users (id, email, full_name, role, phone, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@flotaatenea.com', 'Administrador Principal', 'admin', '+52-555-0001', true),
('550e8400-e29b-41d4-a716-446655440001', 'manager@flotaatenea.com', 'Gerente de Flota', 'manager', '+52-555-0002', true),
('550e8400-e29b-41d4-a716-446655440002', 'operator@flotaatenea.com', 'Operador de Sistema', 'operator', '+52-555-0003', true),
('550e8400-e29b-41d4-a716-446655440003', 'viewer@flotaatenea.com', 'Consultor', 'viewer', '+52-555-0004', true);

-- Insert sample clients
INSERT INTO clients (id, client_type, first_name, last_name, national_id, email, phone, address, city, state, postal_code, credit_score, created_by) VALUES
('c1000000-0000-0000-0000-000000000001', 'individual', 'Juan Carlos', 'Pérez García', 'CURP123456789', 'juan.perez@email.com', '+52-555-1001', 'Av. Reforma 123', 'Ciudad de México', 'CDMX', '01000', 750, '550e8400-e29b-41d4-a716-446655440001'),
('c1000000-0000-0000-0000-000000000002', 'individual', 'María Elena', 'Rodríguez López', 'CURP987654321', 'maria.rodriguez@email.com', '+52-555-1002', 'Calle Insurgentes 456', 'Guadalajara', 'Jalisco', '44100', 680, '550e8400-e29b-41d4-a716-446655440001'),
('c1000000-0000-0000-0000-000000000003', 'business', NULL, NULL, NULL, 'contacto@empresaabc.com', '+52-555-1003', 'Blvd. Tecnológico 789', 'Monterrey', 'Nuevo León', '64000', 820, '550e8400-e29b-41d4-a716-446655440001'),
('c1000000-0000-0000-0000-000000000004', 'individual', 'Carlos Alberto', 'Mendoza Silva', 'CURP456789123', 'carlos.mendoza@email.com', '+52-555-1004', 'Av. Universidad 321', 'Puebla', 'Puebla', '72000', 720, '550e8400-e29b-41d4-a716-446655440001');

-- Update business client with business-specific data
UPDATE clients SET 
    business_name = 'Empresa ABC S.A. de C.V.',
    tax_id = 'RFC123456789',
    legal_representative = 'Roberto González Martínez'
WHERE id = 'c1000000-0000-0000-0000-000000000003';

-- Insert sample vehicles
INSERT INTO vehicles (id, vin, license_plate, make, model, year, color, engine_type, transmission, fuel_type, mileage, purchase_price, current_value, status, location, created_by) VALUES
('v1000000-0000-0000-0000-000000000001', '1HGBH41JXMN109186', 'ABC-123-A', 'Toyota', 'Corolla', 2023, 'Blanco', '1.8L 4-Cyl', 'CVT', 'Gasolina', 15000, 350000.00, 320000.00, 'available', 'Sucursal Centro', '550e8400-e29b-41d4-a716-446655440001'),
('v1000000-0000-0000-0000-000000000002', '2HGBH41JXMN109187', 'DEF-456-B', 'Honda', 'Civic', 2022, 'Gris', '2.0L 4-Cyl', 'CVT', 'Gasolina', 25000, 380000.00, 340000.00, 'leased', 'Cliente - CDMX', '550e8400-e29b-41d4-a716-446655440001'),
('v1000000-0000-0000-0000-000000000003', '3HGBH41JXMN109188', 'GHI-789-C', 'Nissan', 'Sentra', 2023, 'Negro', '1.6L 4-Cyl', 'CVT', 'Gasolina', 8000, 320000.00, 310000.00, 'available', 'Sucursal Norte', '550e8400-e29b-41d4-a716-446655440001'),
('v1000000-0000-0000-0000-000000000004', '4HGBH41JXMN109189', 'JKL-012-D', 'Volkswagen', 'Jetta', 2022, 'Azul', '1.4L Turbo', 'Automática', 'Gasolina', 35000, 400000.00, 360000.00, 'maintenance', 'Taller Autorizado', '550e8400-e29b-41d4-a716-446655440001'),
('v1000000-0000-0000-0000-000000000005', '5HGBH41JXMN109190', 'MNO-345-E', 'Chevrolet', 'Aveo', 2021, 'Rojo', '1.5L 4-Cyl', 'Manual', 'Gasolina', 45000, 280000.00, 240000.00, 'leased', 'Cliente - Guadalajara', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample contracts
INSERT INTO contracts (id, contract_number, client_id, vehicle_id, status, start_date, end_date, monthly_payment, deposit_amount, total_amount, mileage_limit, excess_mileage_rate, created_by) VALUES
('ct100000-0000-0000-0000-000000000001', 'CONT-2024-001', 'c1000000-0000-0000-0000-000000000001', 'v1000000-0000-0000-0000-000000000002', 'active', '2024-01-15', '2026-01-15', 8500.00, 25500.00, 204000.00, 20000, 3.50, '550e8400-e29b-41d4-a716-446655440001'),
('ct100000-0000-0000-0000-000000000002', 'CONT-2024-002', 'c1000000-0000-0000-0000-000000000003', 'v1000000-0000-0000-0000-000000000005', 'active', '2024-02-01', '2027-02-01', 7200.00, 21600.00, 259200.00, 25000, 3.00, '550e8400-e29b-41d4-a716-446655440001'),
('ct100000-0000-0000-0000-000000000003', 'CONT-2024-003', 'c1000000-0000-0000-0000-000000000002', 'v1000000-0000-0000-0000-000000000001', 'draft', '2024-03-01', '2026-03-01', 9000.00, 27000.00, 216000.00, 18000, 4.00, '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample payments
INSERT INTO payments (contract_id, payment_number, due_date, amount, status, payment_date, payment_method, created_by) VALUES
-- Payments for contract 1
('ct100000-0000-0000-0000-000000000001', 1, '2024-02-15', 8500.00, 'paid', '2024-02-14', 'Transferencia', '550e8400-e29b-41d4-a716-446655440002'),
('ct100000-0000-0000-0000-000000000001', 2, '2024-03-15', 8500.00, 'paid', '2024-03-15', 'Transferencia', '550e8400-e29b-41d4-a716-446655440002'),
('ct100000-0000-0000-0000-000000000001', 3, '2024-04-15', 8500.00, 'paid', '2024-04-16', 'Cheque', '550e8400-e29b-41d4-a716-446655440002'),
('ct100000-0000-0000-0000-000000000001', 4, '2024-05-15', 8500.00, 'pending', NULL, NULL, '550e8400-e29b-41d4-a716-446655440002'),
-- Payments for contract 2
('ct100000-0000-0000-0000-000000000002', 1, '2024-03-01', 7200.00, 'paid', '2024-02-28', 'Transferencia', '550e8400-e29b-41d4-a716-446655440002'),
('ct100000-0000-0000-0000-000000000002', 2, '2024-04-01', 7200.00, 'paid', '2024-04-01', 'Transferencia', '550e8400-e29b-41d4-a716-446655440002'),
('ct100000-0000-0000-0000-000000000002', 3, '2024-05-01', 7200.00, 'overdue', NULL, NULL, '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample maintenance records
INSERT INTO maintenance (vehicle_id, maintenance_type, description, scheduled_date, completed_date, status, mileage_at_service, cost, service_provider, created_by) VALUES
('v1000000-0000-0000-0000-000000000001', 'Servicio Mayor', 'Cambio de aceite, filtros y revisión general', '2024-01-20', '2024-01-20', 'completed', 14500, 2500.00, 'Taller Toyota Oficial', '550e8400-e29b-41d4-a716-446655440002'),
('v1000000-0000-0000-0000-000000000002', 'Servicio Menor', 'Cambio de aceite y filtro de aceite', '2024-02-10', '2024-02-10', 'completed', 24000, 800.00, 'Taller Honda Centro', '550e8400-e29b-41d4-a716-446655440002'),
('v1000000-0000-0000-0000-000000000004', 'Reparación', 'Cambio de frenos delanteros', '2024-03-15', NULL, 'in_progress', 34500, 3200.00, 'Taller VW Especializado', '550e8400-e29b-41d4-a716-446655440002'),
('v1000000-0000-0000-0000-000000000003', 'Servicio Mayor', 'Servicio de 10,000 km programado', '2024-04-01', NULL, 'scheduled', NULL, NULL, 'Taller Nissan', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample insurance records
INSERT INTO insurance (vehicle_id, policy_number, insurance_company, policy_type, coverage_amount, deductible, premium_amount, start_date, end_date, created_by) VALUES
('v1000000-0000-0000-0000-000000000001', 'POL-2024-001', 'Seguros Monterrey', 'Cobertura Amplia', 400000.00, 5000.00, 12000.00, '2024-01-01', '2024-12-31', '550e8400-e29b-41d4-a716-446655440001'),
('v1000000-0000-0000-0000-000000000002', 'POL-2024-002', 'GNP Seguros', 'Cobertura Amplia', 420000.00, 5000.00, 13500.00, '2024-01-15', '2025-01-14', '550e8400-e29b-41d4-a716-446655440001'),
('v1000000-0000-0000-0000-000000000003', 'POL-2024-003', 'Seguros Banorte', 'Cobertura Limitada', 350000.00, 8000.00, 9500.00, '2024-02-01', '2025-01-31', '550e8400-e29b-41d4-a716-446655440001'),
('v1000000-0000-0000-0000-000000000004', 'POL-2024-004', 'AXA Seguros', 'Cobertura Amplia', 450000.00, 4000.00, 15000.00, '2024-01-01', '2024-12-31', '550e8400-e29b-41d4-a716-446655440001'),
('v1000000-0000-0000-0000-000000000005', 'POL-2024-005', 'Seguros BBVA', 'Cobertura Amplia', 320000.00, 6000.00, 11000.00, '2024-02-01', '2025-01-31', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample claims
INSERT INTO claims (insurance_id, claim_number, incident_date, reported_date, claim_amount, status, description, created_by) VALUES
((SELECT id FROM insurance WHERE policy_number = 'POL-2024-002'), 'CLAIM-2024-001', '2024-03-10', '2024-03-11', 15000.00, 'in_process', 'Daños menores en defensa trasera por alcance', '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM insurance WHERE policy_number = 'POL-2024-004'), 'CLAIM-2024-002', '2024-02-20', '2024-02-21', 8500.00, 'approved', 'Cristal delantero dañado por piedra', '550e8400-e29b-41d4-a716-446655440002');

-- Update approved claim with approved amount
UPDATE claims SET approved_amount = 8500.00 WHERE claim_number = 'CLAIM-2024-002';

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, related_table, related_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Pago Vencido', 'El contrato CONT-2024-002 tiene un pago vencido desde el 01/05/2024', 'payment_overdue', 'contracts', 'ct100000-0000-0000-0000-000000000002'),
('550e8400-e29b-41d4-a716-446655440001', 'Mantenimiento Programado', 'El vehículo Nissan Sentra (GHI-789-C) tiene mantenimiento programado para el 01/04/2024', 'maintenance_due', 'vehicles', 'v1000000-0000-0000-0000-000000000003'),
('550e8400-e29b-41d4-a716-446655440002', 'Seguro por Vencer', 'La póliza POL-2024-001 del Toyota Corolla vence el 31/12/2024', 'insurance_expiring', 'insurance', (SELECT id FROM insurance WHERE policy_number = 'POL-2024-001')),
('550e8400-e29b-41d4-a716-446655440001', 'Nuevo Reclamo', 'Se ha registrado un nuevo reclamo CLAIM-2024-001 para revisión', 'new_claim', 'claims', (SELECT id FROM claims WHERE claim_number = 'CLAIM-2024-001'));

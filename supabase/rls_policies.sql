-- FlotaAtenea - Políticas de Row Level Security (RLS)
-- Ejecuta este script DESPUÉS del script complete_setup.sql

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Función auxiliar para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para la tabla users
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (get_user_role() = 'admin');

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage all users" ON users;
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (get_user_role() = 'admin');

-- Políticas para la tabla clients
DROP POLICY IF EXISTS "Users can view clients based on role" ON clients;
CREATE POLICY "Users can view clients based on role" ON clients
  FOR SELECT USING (
    get_user_role() IN ('admin', 'manager', 'operator', 'viewer')
  );

DROP POLICY IF EXISTS "Operators and above can manage clients" ON clients;
CREATE POLICY "Operators and above can manage clients" ON clients
  FOR ALL USING (
    get_user_role() IN ('admin', 'manager', 'operator')
  );

-- Políticas para la tabla vehicles
DROP POLICY IF EXISTS "Users can view vehicles based on role" ON vehicles;
CREATE POLICY "Users can view vehicles based on role" ON vehicles
  FOR SELECT USING (
    get_user_role() IN ('admin', 'manager', 'operator', 'viewer')
  );

DROP POLICY IF EXISTS "Operators and above can manage vehicles" ON vehicles;
CREATE POLICY "Operators and above can manage vehicles" ON vehicles
  FOR ALL USING (
    get_user_role() IN ('admin', 'manager', 'operator')
  );

-- Políticas para la tabla contracts
DROP POLICY IF EXISTS "Users can view contracts based on role" ON contracts;
CREATE POLICY "Users can view contracts based on role" ON contracts
  FOR SELECT USING (
    get_user_role() IN ('admin', 'manager', 'operator', 'viewer')
  );

DROP POLICY IF EXISTS "Managers and above can manage contracts" ON contracts;
CREATE POLICY "Managers and above can manage contracts" ON contracts
  FOR ALL USING (
    get_user_role() IN ('admin', 'manager')
  );

-- Políticas para la tabla payments
DROP POLICY IF EXISTS "Users can view payments based on role" ON payments;
CREATE POLICY "Users can view payments based on role" ON payments
  FOR SELECT USING (
    get_user_role() IN ('admin', 'manager', 'operator', 'viewer')
  );

DROP POLICY IF EXISTS "Operators and above can manage payments" ON payments;
CREATE POLICY "Operators and above can manage payments" ON payments
  FOR ALL USING (
    get_user_role() IN ('admin', 'manager', 'operator')
  );

-- Políticas para la tabla maintenance
DROP POLICY IF EXISTS "Users can view maintenance based on role" ON maintenance;
CREATE POLICY "Users can view maintenance based on role" ON maintenance
  FOR SELECT USING (
    get_user_role() IN ('admin', 'manager', 'operator', 'viewer')
  );

DROP POLICY IF EXISTS "Operators and above can manage maintenance" ON maintenance;
CREATE POLICY "Operators and above can manage maintenance" ON maintenance
  FOR ALL USING (
    get_user_role() IN ('admin', 'manager', 'operator')
  );

-- Políticas para la tabla insurance
DROP POLICY IF EXISTS "Users can view insurance based on role" ON insurance;
CREATE POLICY "Users can view insurance based on role" ON insurance
  FOR SELECT USING (
    get_user_role() IN ('admin', 'manager', 'operator', 'viewer')
  );

DROP POLICY IF EXISTS "Managers and above can manage insurance" ON insurance;
CREATE POLICY "Managers and above can manage insurance" ON insurance
  FOR ALL USING (
    get_user_role() IN ('admin', 'manager')
  );

-- Políticas para la tabla claims
DROP POLICY IF EXISTS "Users can view claims based on role" ON claims;
CREATE POLICY "Users can view claims based on role" ON claims
  FOR SELECT USING (
    get_user_role() IN ('admin', 'manager', 'operator', 'viewer')
  );

DROP POLICY IF EXISTS "Managers and above can manage claims" ON claims;
CREATE POLICY "Managers and above can manage claims" ON claims
  FOR ALL USING (
    get_user_role() IN ('admin', 'manager')
  );

-- Políticas para la tabla notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

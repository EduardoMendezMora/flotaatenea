-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
BEGIN
    RETURN (SELECT role FROM users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update all users" ON users
    FOR UPDATE USING (get_user_role(auth.uid()) = 'admin');

-- Clients policies
CREATE POLICY "All authenticated users can view clients" ON clients
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers and admins can insert clients" ON clients
    FOR INSERT WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'manager', 'operator'));

CREATE POLICY "Managers and admins can update clients" ON clients
    FOR UPDATE USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'operator'));

CREATE POLICY "Only admins can delete clients" ON clients
    FOR DELETE USING (get_user_role(auth.uid()) = 'admin');

-- Vehicles policies
CREATE POLICY "All authenticated users can view vehicles" ON vehicles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Operators and above can insert vehicles" ON vehicles
    FOR INSERT WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'manager', 'operator'));

CREATE POLICY "Operators and above can update vehicles" ON vehicles
    FOR UPDATE USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'operator'));

CREATE POLICY "Only admins can delete vehicles" ON vehicles
    FOR DELETE USING (get_user_role(auth.uid()) = 'admin');

-- Contracts policies
CREATE POLICY "All authenticated users can view contracts" ON contracts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers and admins can insert contracts" ON contracts
    FOR INSERT WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Managers and admins can update contracts" ON contracts
    FOR UPDATE USING (get_user_role(auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Only admins can delete contracts" ON contracts
    FOR DELETE USING (get_user_role(auth.uid()) = 'admin');

-- Payments policies
CREATE POLICY "All authenticated users can view payments" ON payments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Operators and above can insert payments" ON payments
    FOR INSERT WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'manager', 'operator'));

CREATE POLICY "Operators and above can update payments" ON payments
    FOR UPDATE USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'operator'));

CREATE POLICY "Only admins can delete payments" ON payments
    FOR DELETE USING (get_user_role(auth.uid()) = 'admin');

-- Maintenance policies
CREATE POLICY "All authenticated users can view maintenance" ON maintenance
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Operators and above can insert maintenance" ON maintenance
    FOR INSERT WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'manager', 'operator'));

CREATE POLICY "Operators and above can update maintenance" ON maintenance
    FOR UPDATE USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'operator'));

CREATE POLICY "Only admins can delete maintenance" ON maintenance
    FOR DELETE USING (get_user_role(auth.uid()) = 'admin');

-- Insurance policies
CREATE POLICY "All authenticated users can view insurance" ON insurance
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers and admins can insert insurance" ON insurance
    FOR INSERT WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Managers and admins can update insurance" ON insurance
    FOR UPDATE USING (get_user_role(auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Only admins can delete insurance" ON insurance
    FOR DELETE USING (get_user_role(auth.uid()) = 'admin');

-- Claims policies
CREATE POLICY "All authenticated users can view claims" ON claims
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Operators and above can insert claims" ON claims
    FOR INSERT WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'manager', 'operator'));

CREATE POLICY "Operators and above can update claims" ON claims
    FOR UPDATE USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'operator'));

CREATE POLICY "Only admins can delete claims" ON claims
    FOR DELETE USING (get_user_role(auth.uid()) = 'admin');

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications for any user" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

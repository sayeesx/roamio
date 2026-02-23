-- =============================================================
-- Roamio — Supabase Schema & RLS Policies
-- Apply this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================================

-- ─── 1. Tables ───────────────────────────────────────────────

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    phone       TEXT,
    country     TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id       UUID REFERENCES clients(id) ON DELETE CASCADE,
    purpose         TEXT NOT NULL CHECK (purpose IN ('medical','tourism','nri','hybrid','cab','hotel','logistics','service')),
    details         JSONB DEFAULT '{}'::jsonb,
    status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled')),
    assigned_agent  UUID REFERENCES profiles(id),
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id  UUID REFERENCES bookings(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    status      TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','done','blocked')),
    assigned_to UUID,
    due_date    DATE,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name  TEXT NOT NULL,
    record_id   UUID NOT NULL,
    action      TEXT NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
    actor       TEXT DEFAULT 'system',
    metadata    JSONB DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- User profiles (for admin dashboard role-based access)
CREATE TABLE IF NOT EXISTS profiles (
    id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role    TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin','operations','finance','viewer')),
    name    TEXT,
    email   TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);


-- ─── 2. Indexes ──────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_bookings_client    ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status    ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_tasks_booking      ON tasks(booking_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record  ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_clients_email      ON clients(email);


-- ─── 3. Enable RLS ──────────────────────────────────────────

ALTER TABLE clients     ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;


-- ─── 4. RLS Policies ────────────────────────────────────────

-- 4a. Clients
-- Public (anon): can INSERT only
-- Public (anon): restricted
-- No direct inserts for anon. All inserts must go through API route.

-- Authenticated admins: full access
CREATE POLICY "admin_all_clients"
    ON clients FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

-- Operations: can view assigned clients (via bookings)
CREATE POLICY "ops_select_clients"
    ON clients FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bookings b
            JOIN profiles p ON p.id = auth.uid()
            WHERE b.client_id = clients.id
              AND b.assigned_agent = auth.uid()
              AND p.role = 'operations'
        )
    );

-- 4b. Bookings
-- Public (anon): can INSERT only
-- Public (anon): restricted
-- No direct inserts for anon. All inserts must go through API route.

-- Admin: full access
CREATE POLICY "admin_all_bookings"
    ON bookings FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

-- Operations: SELECT/UPDATE assigned bookings
CREATE POLICY "ops_select_bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (
        assigned_agent = auth.uid()
        AND EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'operations')
    );

CREATE POLICY "ops_update_bookings"
    ON bookings FOR UPDATE
    TO authenticated
    USING (
        assigned_agent = auth.uid()
        AND EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'operations')
    );

-- Finance: SELECT only
CREATE POLICY "finance_select_bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'finance')
    );

-- 4c. Tasks
-- Admin: full access
CREATE POLICY "admin_all_tasks"
    ON tasks FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

-- Operations: SELECT/UPDATE assigned tasks
CREATE POLICY "ops_tasks"
    ON tasks FOR SELECT
    TO authenticated
    USING (
        assigned_to = auth.uid()
        AND EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'operations')
    );

-- 4d. Audit Logs
-- Admin: full access
CREATE POLICY "admin_all_audit"
    ON audit_logs FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

-- Service role (used in API routes) can always insert
-- Public (anon): restricted
-- No direct inserts for anon. All inserts must go through API route.

-- 4e. Profiles
CREATE POLICY "users_read_own_profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "admin_all_profiles"
    ON profiles FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );


-- ─── 5. Database Triggers ────────────────────────────────────

-- Auto-create task when a new booking is inserted
CREATE OR REPLACE FUNCTION fn_auto_create_task()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO tasks (booking_id, title, status)
    VALUES (NEW.id, 'Review new booking: ' || NEW.purpose, 'open');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auto_create_task ON bookings;
CREATE TRIGGER trg_auto_create_task
    AFTER INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION fn_auto_create_task();

-- Auto-log audit entry when a new booking is inserted
CREATE OR REPLACE FUNCTION fn_auto_audit_booking()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (table_name, record_id, action, actor, metadata)
    VALUES ('bookings', NEW.id, TG_OP, COALESCE(auth.uid()::text, 'system'),
            jsonb_build_object('purpose', NEW.purpose, 'client_id', NEW.client_id));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auto_audit_booking ON bookings;
CREATE TRIGGER trg_auto_audit_booking
    AFTER INSERT OR UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION fn_auto_audit_booking();

-- Auto-update updated_at on bookings
CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bookings_updated_at ON bookings;
CREATE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_updated_at();


-- ─── 6. Enable Realtime ──────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE clients;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

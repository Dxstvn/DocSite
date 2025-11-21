-- =====================================================
-- Bergen Mind & Wellness - Row Level Security Policies
-- =====================================================
-- This migration adds RLS policies to protect database tables
-- while allowing appropriate access for public booking and admin management
--
-- Security Model:
-- - Public users can view availability and appointment types
-- - Public users can create appointments via API (using service role)
-- - Authenticated admins can manage all appointments and availability
-- - Service role key bypasses RLS (used in API routes)
--
-- Created: 2025-11-12
-- =====================================================

-- =====================================================
-- 1. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_types ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. APPOINTMENTS TABLE POLICIES
-- =====================================================

-- Allow service role (API) to insert appointments
-- This is used by the public booking API endpoint
CREATE POLICY "Service role can insert appointments"
  ON appointments
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated admin users to view all appointments
CREATE POLICY "Admins can view all appointments"
  ON appointments
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated admin users to update appointments
CREATE POLICY "Admins can update appointments"
  ON appointments
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated admin users to delete appointments (for cleanup)
CREATE POLICY "Admins can delete appointments"
  ON appointments
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 3. AVAILABILITY TABLE POLICIES
-- =====================================================

-- Allow public to view availability (needed for booking calendar)
CREATE POLICY "Public can view availability"
  ON availability
  FOR SELECT
  USING (true);

-- Allow authenticated admin users to insert availability slots
CREATE POLICY "Admins can create availability"
  ON availability
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated admin users to update availability slots
CREATE POLICY "Admins can update availability"
  ON availability
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated admin users to delete availability slots
CREATE POLICY "Admins can delete availability"
  ON availability
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 4. APPOINTMENT_TYPES TABLE POLICIES
-- =====================================================

-- Allow public to view active appointment types (for booking form)
CREATE POLICY "Public can view active appointment types"
  ON appointment_types
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated admin users to view all appointment types (including inactive)
CREATE POLICY "Admins can view all appointment types"
  ON appointment_types
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated admin users to create appointment types
CREATE POLICY "Admins can create appointment types"
  ON appointment_types
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated admin users to update appointment types
CREATE POLICY "Admins can update appointment types"
  ON appointment_types
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated admin users to delete appointment types
CREATE POLICY "Admins can delete appointment types"
  ON appointment_types
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 5. VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify RLS is properly enabled:
--
-- Check RLS status:
-- SELECT schemaname, tablename, rowsecurity
-- FROM pg_tables
-- WHERE tablename IN ('appointments', 'availability', 'appointment_types');
--
-- List all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('appointments', 'availability', 'appointment_types');
--
-- Test as public (anonymous):
-- SET ROLE anon;
-- SELECT * FROM availability; -- Should work
-- SELECT * FROM appointment_types WHERE is_active = true; -- Should work
-- SELECT * FROM appointments; -- Should return nothing
-- RESET ROLE;
--
-- Test as authenticated:
-- SET ROLE authenticated;
-- SELECT * FROM appointments; -- Should work
-- INSERT INTO availability (...) VALUES (...); -- Should work
-- RESET ROLE;
-- =====================================================

-- Add helpful comment
COMMENT ON POLICY "Public can view availability" ON availability IS
  'Allows public users to view doctor availability for the booking calendar';

COMMENT ON POLICY "Service role can insert appointments" ON appointments IS
  'Allows API routes (using service role) to create appointments on behalf of patients';

COMMENT ON POLICY "Admins can view all appointments" ON appointments IS
  'Allows authenticated admin users to view and manage all patient appointments';

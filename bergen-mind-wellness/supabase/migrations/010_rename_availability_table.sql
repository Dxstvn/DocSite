-- =====================================================
-- Bergen Mind & Wellness - Rename availability table
-- =====================================================
-- Fixes Issue #1 (No Doctors available) and Issue #2 (table not found error)
--
-- PROBLEM: Code uses 'availability_slots' but schema has 'availability'
-- SOLUTION: Rename table to match codebase expectations
--
-- Created: 2025-11-22
-- =====================================================

-- Step 1: Rename the table
-- PostgreSQL automatically updates:
--   - RLS policies (they follow the table)
--   - Indexes (they follow the table)
--   - Foreign key constraints (they follow the table)
--   - Table comments and metadata
ALTER TABLE availability RENAME TO availability_slots;

-- Step 2: Update table comment to reflect new name
COMMENT ON TABLE availability_slots IS 'Doctor availability schedules (both recurring weekly and one-time specific dates). Renamed from availability to match codebase.';

-- Step 3: Verification queries (for manual testing)
-- Uncomment to run verification after migration:

-- List all RLS policies to confirm they moved with the table
-- SELECT
--   schemaname,
--   tablename,
--   policyname,
--   permissive,
--   roles,
--   cmd
-- FROM pg_policies
-- WHERE tablename = 'availability_slots'
-- ORDER BY policyname;

-- Expected policies:
-- 1. "Public can view availability" (FOR SELECT, USING (true))
-- 2. "Admins can create availability" (FOR INSERT, authenticated role)
-- 3. "Authenticated users can update availability" (FOR UPDATE, authenticated role)
-- 4. "Authenticated users can delete availability" (FOR DELETE, authenticated role)

-- Verify table exists and RLS is enabled
-- SELECT
--   tablename,
--   rowsecurity as rls_enabled
-- FROM pg_tables
-- WHERE schemaname = 'public' AND tablename = 'availability_slots';

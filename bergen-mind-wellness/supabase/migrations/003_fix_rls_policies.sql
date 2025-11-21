-- =====================================================
-- Bergen Mind & Wellness - Fix RLS Security Policies
-- =====================================================
-- This migration fixes security vulnerabilities discovered in integration testing:
--
-- ISSUES FIXED:
-- 1. Anonymous users could update doctor availability (now blocked)
-- 2. Anonymous users could delete doctor availability (now blocked)
-- 3. Anonymous users could create appointments without availability checks (now validated)
--
-- SECURITY MODEL:
-- - Public users: Read-only access to availability and active appointment types
-- - Public users: Create appointments ONLY during available time slots
-- - Authenticated users: Full CRUD on all tables
-- - Service role: Bypasses RLS (for API routes with business logic)
--
-- Created: 2025-11-13
-- =====================================================

-- =====================================================
-- 1. FIX AVAILABILITY TABLE POLICIES
-- =====================================================

-- Drop overly permissive UPDATE policy
DROP POLICY IF EXISTS "Admins can update availability" ON availability;

-- Create restrictive UPDATE policy (only authenticated users)
-- USING clause: who can see the row to update
-- WITH CHECK clause: what values they can set
CREATE POLICY "Authenticated users can update availability"
  ON availability
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Drop overly permissive DELETE policy
DROP POLICY IF EXISTS "Admins can delete availability" ON availability;

-- Create restrictive DELETE policy (only authenticated users)
CREATE POLICY "Authenticated users can delete availability"
  ON availability
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 2. FIX APPOINTMENTS TABLE INSERT POLICY
-- =====================================================

-- Drop overly permissive INSERT policy (WITH CHECK (true) allowed anyone)
DROP POLICY IF EXISTS "Service role can insert appointments" ON appointments;

-- Create new policy: Public can insert appointments ONLY during available time slots
-- This ensures appointments can only be booked when doctor has availability
CREATE POLICY "Public can create appointments during availability"
  ON appointments
  FOR INSERT
  WITH CHECK (
    -- Verify doctor has availability covering this appointment time
    EXISTS (
      SELECT 1 FROM availability a
      WHERE a.doctor_id = appointments.doctor_id
        AND a.is_blocked = false  -- Not blocked (vacation, time off)
        AND (
          -- Case 1: Recurring weekly availability (e.g., "Every Monday 9am-5pm")
          (
            a.is_recurring = true
            AND EXTRACT(DOW FROM appointments.start_time) = a.day_of_week
            AND appointments.start_time::time >= a.start_time
            AND appointments.end_time::time <= a.end_time
          )
          OR
          -- Case 2: Specific date availability (e.g., "December 25, 2025 10am-2pm")
          (
            a.is_recurring = false
            AND appointments.start_time::date = a.specific_date
            AND appointments.start_time::time >= a.start_time
            AND appointments.end_time::time <= a.end_time
          )
        )
    )
  );

-- =====================================================
-- 3. ADD HELPFUL COMMENTS
-- =====================================================

COMMENT ON POLICY "Authenticated users can update availability" ON availability IS
  'Restricts availability schedule updates to authenticated admin users only. Anonymous users cannot modify doctor schedules.';

COMMENT ON POLICY "Authenticated users can delete availability" ON availability IS
  'Restricts availability schedule deletion to authenticated admin users only. Anonymous users cannot delete doctor schedules.';

COMMENT ON POLICY "Public can create appointments during availability" ON appointments IS
  'Allows public users to create appointments, but ONLY during time slots when the doctor has availability. This prevents booking outside working hours or on days off.';

-- =====================================================
-- 4. VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify the fixes work correctly:
--
-- Test 1: Verify anonymous users CANNOT update availability
-- SET ROLE anon;
-- UPDATE availability SET start_time = '10:00:00' WHERE id = 'some-id'; -- Should fail
-- RESET ROLE;
--
-- Test 2: Verify anonymous users CANNOT delete availability
-- SET ROLE anon;
-- DELETE FROM availability WHERE id = 'some-id'; -- Should fail
-- RESET ROLE;
--
-- Test 3: Verify appointments can only be created during availability
-- SET ROLE anon;
-- -- Assume doctor has Monday 9am-5pm availability
-- INSERT INTO appointments (...) VALUES (monday_at_10am); -- Should succeed
-- INSERT INTO appointments (...) VALUES (tuesday_at_10am); -- Should fail (no Tuesday availability)
-- INSERT INTO appointments (...) VALUES (monday_at_8am); -- Should fail (before 9am start time)
-- RESET ROLE;
--
-- Test 4: Verify authenticated users CAN update/delete availability
-- SET ROLE authenticated;
-- UPDATE availability SET start_time = '10:00:00' WHERE id = 'some-id'; -- Should succeed
-- DELETE FROM availability WHERE id = 'some-id'; -- Should succeed
-- RESET ROLE;
-- =====================================================

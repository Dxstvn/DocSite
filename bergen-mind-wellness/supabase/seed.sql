-- =====================================================
-- Bergen Mind & Wellness - Test Data Seed
-- =====================================================
-- This file populates the local Supabase database with test data
-- for integration testing and E2E testing
--
-- Run with: pnpm supabase:reset
-- =====================================================

-- =====================================================
-- 1. SEED APPOINTMENT TYPES
-- =====================================================
INSERT INTO appointment_types (name, display_name, display_name_es, duration_minutes, is_active, sort_order)
VALUES
  ('test-initial', 'Test Initial Consultation', 'Consulta Inicial de Prueba', 60, true, 1),
  ('test-followup', 'Test Follow-up', 'Seguimiento de Prueba', 30, true, 2),
  ('test-therapy', 'Test Therapy Session', 'Sesión de Terapia de Prueba', 50, true, 3)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  display_name_es = EXCLUDED.display_name_es,
  duration_minutes = EXCLUDED.duration_minutes,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

-- =====================================================
-- 2. CREATE TEST DOCTOR ACCOUNT (for E2E tests)
-- =====================================================
-- Using a fixed UUID for consistency in E2E tests
-- Email: doctor@test.com
-- Password: test-password-123

DO $$
DECLARE
  doctor_uuid UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- Delete existing test doctor if it exists
  DELETE FROM auth.users WHERE id = doctor_uuid;

  -- Create doctor auth user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    aud
  ) VALUES (
    doctor_uuid,
    '00000000-0000-0000-0000-000000000000',
    'doctor@test.com',
    crypt('test-password-123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  );

  -- Create doctor profile
  INSERT INTO profiles (id, role)
  VALUES (doctor_uuid, 'doctor')
  ON CONFLICT (id) DO UPDATE SET role = 'doctor';
END $$;

-- =====================================================
-- 3. CREATE TEST ADMIN ACCOUNT (for E2E admin tests)
-- =====================================================
-- Using a fixed UUID for consistency
-- Email: admin@test.com
-- Password: test-password-123

DO $$
DECLARE
  admin_uuid UUID := '22222222-2222-2222-2222-222222222222';
BEGIN
  -- Delete existing test admin if it exists
  DELETE FROM auth.users WHERE id = admin_uuid;

  -- Create admin auth user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_sent_at,
    recovery_sent_at,
    email_change_sent_at,
    last_sign_in_at,
    role,
    aud,
    is_super_admin
  ) VALUES (
    admin_uuid,
    '00000000-0000-0000-0000-000000000000',
    'admin@test.com',
    crypt('test-password-123', gen_salt('bf')),
    NOW(),
    '',  -- Empty string, not NULL (email already confirmed)
    '',  -- Empty string, not NULL
    '',  -- Empty string, not NULL
    '',  -- Empty string, not NULL
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    NOW(),
    NOW(),
    NULL,
    NULL,
    NULL,
    NULL,
    'authenticated',
    'authenticated',
    false
  );

  -- Create admin profile
  INSERT INTO profiles (id, role)
  VALUES (admin_uuid, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
END $$;

-- =====================================================
-- 4. SEED DOCTOR AVAILABILITY (for E2E booking tests)
-- =====================================================
-- Create extensive recurring weekly availability for test environment
-- Extended hours to provide abundant slots for E2E tests
-- Monday-Friday: 7am-9pm, Saturday: 9am-5pm
-- This generates ~150+ available slots per week to prevent test exhaustion

INSERT INTO availability (doctor_id, day_of_week, start_time, end_time, is_recurring, is_blocked)
VALUES
  -- Monday (7am-9pm = 14 hours, ~28 slots with 30min intervals)
  ('11111111-1111-1111-1111-111111111111', 1, '07:00:00', '21:00:00', true, false),
  -- Tuesday (7am-9pm)
  ('11111111-1111-1111-1111-111111111111', 2, '07:00:00', '21:00:00', true, false),
  -- Wednesday (7am-9pm)
  ('11111111-1111-1111-1111-111111111111', 3, '07:00:00', '21:00:00', true, false),
  -- Thursday (7am-9pm)
  ('11111111-1111-1111-1111-111111111111', 4, '07:00:00', '21:00:00', true, false),
  -- Friday (7am-9pm)
  ('11111111-1111-1111-1111-111111111111', 5, '07:00:00', '21:00:00', true, false),
  -- Saturday (9am-5pm = 8 hours, ~16 slots)
  ('11111111-1111-1111-1111-111111111111', 6, '09:00:00', '17:00:00', true, false)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. VERIFICATION QUERIES (commented out - for manual use)
-- =====================================================
-- Uncomment these to verify seed data after running supabase db reset
--
-- SELECT * FROM appointment_types ORDER BY sort_order;
-- SELECT * FROM profiles;
-- SELECT * FROM availability ORDER BY day_of_week;

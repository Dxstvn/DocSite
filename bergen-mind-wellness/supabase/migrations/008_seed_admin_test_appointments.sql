-- =====================================================
-- Seed Admin Test Appointments
-- =====================================================
-- Creates 50+ diverse appointments for comprehensive admin filter/search/pagination testing
--
-- Test Coverage:
-- - Status distribution: 20 pending, 20 confirmed, 10 cancelled
-- - Date range: November 15 - December 31, 2025
-- - Multiple patients (12 unique) for search testing
-- - All appointment types represented
-- - Various times throughout business hours
-- Created: 2025-11-18
-- =====================================================

DO $$
DECLARE
  test_doctor_id UUID := '11111111-1111-1111-1111-111111111111';
  test_admin_id UUID := '22222222-2222-2222-2222-222222222222';
  type_initial UUID;
  type_followup UUID;
  type_therapy UUID;
BEGIN
  -- First, ensure test doctor and admin accounts exist (same as seed.sql)
  -- Delete existing test users if they exist
  DELETE FROM auth.users WHERE id IN (test_doctor_id, test_admin_id);

  -- Create test doctor auth user
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
    test_doctor_id,
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
  VALUES (test_doctor_id, 'doctor')
  ON CONFLICT (id) DO UPDATE SET role = 'doctor';

  -- Create test admin auth user
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
    test_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@test.com',
    crypt('test-password-123', gen_salt('bf')),
    NOW(),
    '',
    '',
    '',
    '',
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
  VALUES (test_admin_id, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';

  -- Create doctor availability (same as seed.sql)
  INSERT INTO availability (doctor_id, day_of_week, start_time, end_time, is_recurring, is_blocked)
  VALUES
    (test_doctor_id, 1, '07:00:00', '21:00:00', true, false),
    (test_doctor_id, 2, '07:00:00', '21:00:00', true, false),
    (test_doctor_id, 3, '07:00:00', '21:00:00', true, false),
    (test_doctor_id, 4, '07:00:00', '21:00:00', true, false),
    (test_doctor_id, 5, '07:00:00', '21:00:00', true, false),
    (test_doctor_id, 6, '09:00:00', '17:00:00', true, false)
  ON CONFLICT DO NOTHING;

  -- Ensure appointment types exist (same as seed.sql)
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

  -- Get appointment type IDs
  SELECT id INTO type_initial FROM appointment_types WHERE name = 'test-initial';
  SELECT id INTO type_followup FROM appointment_types WHERE name = 'test-followup';
  SELECT id INTO type_therapy FROM appointment_types WHERE name = 'test-therapy';

  -- Delete existing test appointments to avoid conflicts
  DELETE FROM appointments WHERE doctor_id = test_doctor_id;

  -- ====================================
  -- PENDING APPOINTMENTS (20)
  -- ====================================

  -- Week 1: November 25-29 (5 pending)
  INSERT INTO appointments (doctor_id, appointment_type_id, start_time, end_time, status, patient_name, patient_email, patient_phone, reason_for_visit, booking_token)
  VALUES
    (test_doctor_id, type_initial, '2025-11-25T09:00:00Z', '2025-11-25T10:00:00Z', 'pending', 'Emily Rodriguez', 'emily.rodriguez@example.com', '5551234567', 'Initial anxiety assessment', 'token_001'),
    (test_doctor_id, type_followup, '2025-11-25T14:30:00Z', '2025-11-25T15:00:00Z', 'pending', 'Michael Chen', 'michael.chen@example.com', '5552345678', 'Depression follow-up', 'token_002'),
    (test_doctor_id, type_therapy, '2025-11-26T10:00:00Z', '2025-11-26T10:50:00Z', 'pending', 'Sarah Thompson', 'sarah.t@example.com', '5553456789', 'ADHD therapy session', 'token_003'),
    (test_doctor_id, type_initial, '2025-11-27T11:00:00Z', '2025-11-27T12:00:00Z', 'pending', 'David Park', 'david.park@example.com', '5554567890', 'Bipolar consultation', 'token_004'),
    (test_doctor_id, type_followup, '2025-11-28T13:00:00Z', '2025-11-28T13:30:00Z', 'pending', 'Jessica Martinez', 'jessica.martinez@example.com', '5555678901', NULL, 'token_005');

  -- Week 2: December 1-5 (5 pending)
  INSERT INTO appointments (doctor_id, appointment_type_id, start_time, end_time, status, patient_name, patient_email, patient_phone, reason_for_visit, booking_token)
  VALUES
    (test_doctor_id, type_therapy, '2025-12-01T09:30:00Z', '2025-12-01T10:20:00Z', 'pending', 'Amanda Foster', 'amanda.foster@example.com', '5556789012', 'PTSD therapy', 'token_006'),
    (test_doctor_id, type_initial, '2025-12-02T10:00:00Z', '2025-12-02T11:00:00Z', 'pending', 'Robert Williams', 'robert.w@example.com', '5557890123', 'General anxiety evaluation', 'token_007'),
    (test_doctor_id, type_followup, '2025-12-03T14:00:00Z', '2025-12-03T14:30:00Z', 'pending', 'Emily Rodriguez', 'emily.rodriguez@example.com', '5551234567', 'Anxiety medication check', 'token_008'),
    (test_doctor_id, type_therapy, '2025-12-04T11:30:00Z', '2025-12-04T12:20:00Z', 'pending', 'Carlos Gonzalez', 'carlos.g@example.com', '5558901234', 'Depression counseling', 'token_009'),
    (test_doctor_id, type_initial, '2025-12-05T15:00:00Z', '2025-12-05T16:00:00Z', 'pending', 'Jennifer Lee', 'jennifer.lee@example.com', '5559012345', 'Panic disorder assessment', 'token_010');

  -- Week 3: December 8-12 (5 pending)
  INSERT INTO appointments (doctor_id, appointment_type_id, start_time, end_time, status, patient_name, patient_email, patient_phone, reason_for_visit, booking_token)
  VALUES
    (test_doctor_id, type_followup, '2025-12-08T09:00:00Z', '2025-12-08T09:30:00Z', 'pending', 'Michael Chen', 'michael.chen@example.com', '5552345678', 'Medication adjustment follow-up', 'token_011'),
    (test_doctor_id, type_therapy, '2025-12-09T13:30:00Z', '2025-12-09T14:20:00Z', 'pending', 'Sarah Thompson', 'sarah.t@example.com', '5553456789', 'CBT session for ADHD', 'token_012'),
    (test_doctor_id, type_initial, '2025-12-10T10:30:00Z', '2025-12-10T11:30:00Z', 'pending', 'Thomas Anderson', 'thomas.anderson@example.com', '5550123456', 'Social anxiety consultation', 'token_013'),
    (test_doctor_id, type_followup, '2025-12-11T14:30:00Z', '2025-12-11T15:00:00Z', 'pending', 'Jessica Martinez', 'jessica.martinez@example.com', '5555678901', 'Depression progress check', 'token_014'),
    (test_doctor_id, type_therapy, '2025-12-12T11:00:00Z', '2025-12-12T11:50:00Z', 'pending', 'Amanda Foster', 'amanda.foster@example.com', '5556789012', 'Trauma processing session', 'token_015');

  -- Week 4: December 15-19 (5 pending)
  INSERT INTO appointments (doctor_id, appointment_type_id, start_time, end_time, status, patient_name, patient_email, patient_phone, reason_for_visit, booking_token)
  VALUES
    (test_doctor_id, type_initial, '2025-12-15T09:00:00Z', '2025-12-15T10:00:00Z', 'pending', 'Maria Santos', 'maria.santos@example.com', '5551231234', 'Mood disorder evaluation', 'token_016'),
    (test_doctor_id, type_followup, '2025-12-16T13:00:00Z', '2025-12-16T13:30:00Z', 'pending', 'David Park', 'david.park@example.com', '5554567890', 'Bipolar maintenance check', 'token_017'),
    (test_doctor_id, type_therapy, '2025-12-17T10:00:00Z', '2025-12-17T10:50:00Z', 'pending', 'Robert Williams', 'robert.w@example.com', '5557890123', 'Exposure therapy for anxiety', 'token_018'),
    (test_doctor_id, type_initial, '2025-12-18T14:00:00Z', '2025-12-18T15:00:00Z', 'pending', 'Samantha Brown', 'samantha.brown@example.com', '5554324321', 'OCD assessment', 'token_019'),
    (test_doctor_id, type_followup, '2025-12-19T11:30:00Z', '2025-12-19T12:00:00Z', 'pending', 'Carlos Gonzalez', 'carlos.g@example.com', '5558901234', 'Depression treatment review', 'token_020');

  -- ====================================
  -- CONFIRMED APPOINTMENTS (20)
  -- ====================================

  -- Week 1: November 25-29 (5 confirmed)
  INSERT INTO appointments (doctor_id, appointment_type_id, start_time, end_time, status, patient_name, patient_email, patient_phone, reason_for_visit, booking_token)
  VALUES
    (test_doctor_id, type_followup, '2025-11-25T10:30:00Z', '2025-11-25T11:00:00Z', 'confirmed', 'Jennifer Lee', 'jennifer.lee@example.com', '5559012345', 'Panic disorder follow-up', 'token_021'),
    (test_doctor_id, type_therapy, '2025-11-26T13:00:00Z', '2025-11-26T13:50:00Z', 'confirmed', 'Emily Rodriguez', 'emily.rodriguez@example.com', '5551234567', 'Anxiety management session', 'token_022'),
    (test_doctor_id, type_initial, '2025-11-27T09:30:00Z', '2025-11-27T10:30:00Z', 'confirmed', 'Michael Chen', 'michael.chen@example.com', '5552345678', 'Sleep disorder consultation', 'token_023'),
    (test_doctor_id, type_followup, '2025-11-28T10:00:00Z', '2025-11-28T10:30:00Z', 'confirmed', 'Sarah Thompson', 'sarah.t@example.com', '5553456789', 'ADHD medication titration', 'token_024'),
    (test_doctor_id, type_therapy, '2025-11-29T14:30:00Z', '2025-11-29T15:20:00Z', 'confirmed', 'Thomas Anderson', 'thomas.anderson@example.com', '5550123456', 'Social skills training', 'token_025');

  -- Week 2: December 1-5 (5 confirmed)
  INSERT INTO appointments (doctor_id, appointment_type_id, start_time, end_time, status, patient_name, patient_email, patient_phone, reason_for_visit, booking_token)
  VALUES
    (test_doctor_id, type_initial, '2025-12-01T11:00:00Z', '2025-12-01T12:00:00Z', 'confirmed', 'David Park', 'david.park@example.com', '5554567890', 'Medication management review', 'token_026'),
    (test_doctor_id, type_followup, '2025-12-02T13:30:00Z', '2025-12-02T14:00:00Z', 'confirmed', 'Amanda Foster', 'amanda.foster@example.com', '5556789012', 'PTSD treatment progress', 'token_027'),
    (test_doctor_id, type_therapy, '2025-12-03T09:00:00Z', '2025-12-03T09:50:00Z', 'confirmed', 'Jessica Martinez', 'jessica.martinez@example.com', '5555678901', 'Behavioral activation', 'token_028'),
    (test_doctor_id, type_initial, '2025-12-04T15:30:00Z', '2025-12-04T16:30:00Z', 'confirmed', 'Robert Williams', 'robert.w@example.com', '5557890123', 'Stress management consultation', 'token_029'),
    (test_doctor_id, type_followup, '2025-12-05T10:30:00Z', '2025-12-05T11:00:00Z', 'confirmed', 'Carlos Gonzalez', 'carlos.g@example.com', '5558901234', 'Antidepressant follow-up', 'token_030');

  -- Week 3: December 8-12 (5 confirmed)
  INSERT INTO appointments (doctor_id, appointment_type_id, start_time, end_time, status, patient_name, patient_email, patient_phone, reason_for_visit, booking_token)
  VALUES
    (test_doctor_id, type_therapy, '2025-12-08T14:00:00Z', '2025-12-08T14:50:00Z', 'confirmed', 'Jennifer Lee', 'jennifer.lee@example.com', '5559012345', 'Relaxation techniques training', 'token_031'),
    (test_doctor_id, type_initial, '2025-12-09T10:00:00Z', '2025-12-09T11:00:00Z', 'confirmed', 'Maria Santos', 'maria.santos@example.com', '5551231234', 'Comprehensive psychiatric evaluation', 'token_032'),
    (test_doctor_id, type_followup, '2025-12-10T13:00:00Z', '2025-12-10T13:30:00Z', 'confirmed', 'Samantha Brown', 'samantha.brown@example.com', '5554324321', 'OCD symptom monitoring', 'token_033'),
    (test_doctor_id, type_therapy, '2025-12-11T09:30:00Z', '2025-12-11T10:20:00Z', 'confirmed', 'Emily Rodriguez', 'emily.rodriguez@example.com', '5551234567', 'Mindfulness practice', 'token_034'),
    (test_doctor_id, type_initial, '2025-12-12T14:30:00Z', '2025-12-12T15:30:00Z', 'confirmed', 'Michael Chen', 'michael.chen@example.com', '5552345678', 'Insomnia treatment plan', 'token_035');

  -- Week 4: December 15-19 (5 confirmed)
  INSERT INTO appointments (doctor_id, appointment_type_id, start_time, end_time, status, patient_name, patient_email, patient_phone, reason_for_visit, booking_token)
  VALUES
    (test_doctor_id, type_followup, '2025-12-15T11:00:00Z', '2025-12-15T11:30:00Z', 'confirmed', 'Sarah Thompson', 'sarah.t@example.com', '5553456789', 'ADHD executive function check', 'token_036'),
    (test_doctor_id, type_therapy, '2025-12-16T10:00:00Z', '2025-12-16T10:50:00Z', 'confirmed', 'Thomas Anderson', 'thomas.anderson@example.com', '5550123456', 'Group therapy preparation', 'token_037'),
    (test_doctor_id, type_initial, '2025-12-17T13:30:00Z', '2025-12-17T14:30:00Z', 'confirmed', 'David Park', 'david.park@example.com', '5554567890', 'Crisis intervention planning', 'token_038'),
    (test_doctor_id, type_followup, '2025-12-18T09:00:00Z', '2025-12-18T09:30:00Z', 'confirmed', 'Amanda Foster', 'amanda.foster@example.com', '5556789012', 'Trauma symptom assessment', 'token_039'),
    (test_doctor_id, type_therapy, '2025-12-19T15:00:00Z', '2025-12-19T15:50:00Z', 'confirmed', 'Jessica Martinez', 'jessica.martinez@example.com', '5555678901', 'Coping skills development', 'token_040');

  -- ====================================
  -- CANCELLED APPOINTMENTS (10)
  -- ====================================

  INSERT INTO appointments (doctor_id, appointment_type_id, start_time, end_time, status, patient_name, patient_email, patient_phone, reason_for_visit, booking_token, cancelled_at, cancelled_by, cancellation_reason)
  VALUES
    (test_doctor_id, type_initial, '2025-11-20T10:00:00Z', '2025-11-20T11:00:00Z', 'cancelled', 'Robert Williams', 'robert.w@example.com', '5557890123', 'Initial evaluation', 'token_041', '2025-11-19T08:00:00Z', 'patient', 'Schedule conflict'),
    (test_doctor_id, type_followup, '2025-11-21T14:00:00Z', '2025-11-21T14:30:00Z', 'cancelled', 'Carlos Gonzalez', 'carlos.g@example.com', '5558901234', 'Follow-up visit', 'token_042', '2025-11-20T16:00:00Z', 'doctor', 'Doctor unavailable - family emergency'),
    (test_doctor_id, type_therapy, '2025-11-22T11:00:00Z', '2025-11-22T11:50:00Z', 'cancelled', 'Jennifer Lee', 'jennifer.lee@example.com', '5559012345', 'Therapy session', 'token_043', '2025-11-21T12:00:00Z', 'patient', 'Illness - requesting reschedule'),
    (test_doctor_id, type_initial, '2025-11-23T09:30:00Z', '2025-11-23T10:30:00Z', 'cancelled', 'Maria Santos', 'maria.santos@example.com', '5551231234', 'New patient intake', 'token_044', '2025-11-22T10:30:00Z', 'patient', 'Financial reasons'),
    (test_doctor_id, type_followup, '2025-11-24T13:00:00Z', '2025-11-24T13:30:00Z', 'cancelled', 'Samantha Brown', 'samantha.brown@example.com', '5554324321', 'Medication review', 'token_045', '2025-11-23T14:00:00Z', 'patient', NULL),
    (test_doctor_id, type_therapy, '2025-11-26T15:00:00Z', '2025-11-26T15:50:00Z', 'cancelled', 'Emily Rodriguez', 'emily.rodriguez@example.com', '5551234567', 'Therapy session', 'token_046', '2025-11-25T09:00:00Z', 'doctor', 'Clinic closure for holiday'),
    (test_doctor_id, type_initial, '2025-11-27T14:00:00Z', '2025-11-27T15:00:00Z', 'cancelled', 'Michael Chen', 'michael.chen@example.com', '5552345678', 'Consultation', 'token_047', '2025-11-26T18:00:00Z', 'patient', 'Transportation issues'),
    (test_doctor_id, type_followup, '2025-11-29T10:30:00Z', '2025-11-29T11:00:00Z', 'cancelled', 'Sarah Thompson', 'sarah.t@example.com', '5553456789', 'Follow-up', 'token_048', '2025-11-28T15:30:00Z', 'patient', 'Work emergency'),
    (test_doctor_id, type_therapy, '2025-12-01T14:00:00Z', '2025-12-01T14:50:00Z', 'cancelled', 'Thomas Anderson', 'thomas.anderson@example.com', '5550123456', 'Therapy', 'token_049', '2025-11-30T11:00:00Z', 'doctor', 'Rescheduled to later date'),
    (test_doctor_id, type_initial, '2025-12-03T11:00:00Z', '2025-12-03T12:00:00Z', 'cancelled', 'David Park', 'david.park@example.com', '5554567890', 'Assessment', 'token_050', '2025-12-02T13:00:00Z', 'patient', 'Found another provider closer to home');

END $$;

-- Verify appointment count
DO $$
DECLARE
  total_count INT;
  pending_count INT;
  confirmed_count INT;
  cancelled_count INT;
BEGIN
  SELECT COUNT(*) INTO total_count FROM appointments WHERE doctor_id = '11111111-1111-1111-1111-111111111111';
  SELECT COUNT(*) INTO pending_count FROM appointments WHERE doctor_id = '11111111-1111-1111-1111-111111111111' AND status = 'pending';
  SELECT COUNT(*) INTO confirmed_count FROM appointments WHERE doctor_id = '11111111-1111-1111-1111-111111111111' AND status = 'confirmed';
  SELECT COUNT(*) INTO cancelled_count FROM appointments WHERE doctor_id = '11111111-1111-1111-1111-111111111111' AND status = 'cancelled';

  RAISE NOTICE 'Test appointments seeded successfully:';
  RAISE NOTICE '  Total: % appointments', total_count;
  RAISE NOTICE '  Pending: % appointments', pending_count;
  RAISE NOTICE '  Confirmed: % appointments', confirmed_count;
  RAISE NOTICE '  Cancelled: % appointments', cancelled_count;

  -- Verify we have expected counts
  IF total_count != 50 THEN
    RAISE EXCEPTION 'Expected 50 appointments, got %', total_count;
  END IF;
  IF pending_count != 20 THEN
    RAISE EXCEPTION 'Expected 20 pending appointments, got %', pending_count;
  END IF;
  IF confirmed_count != 20 THEN
    RAISE EXCEPTION 'Expected 20 confirmed appointments, got %', confirmed_count;
  END IF;
  IF cancelled_count != 10 THEN
    RAISE EXCEPTION 'Expected 10 cancelled appointments, got %', cancelled_count;
  END IF;
END $$;

-- =====================================================
-- SUMMARY
-- =====================================================
-- Created 50 test appointments:
--   - 20 pending (distributed across 4 weeks)
--   - 20 confirmed (distributed across 4 weeks)
--   - 10 cancelled (from past week with reasons)
--
-- Unique patients: 12
-- Date range: November 20 - December 19, 2025
-- Appointment types: All 3 types represented
--
-- Enables testing of:
--   AD9: Filter by status
--   AD10: Filter by appointment type
--   AD11: Filter by date range
--   AD12: Search by patient name
--   AD13: Search by email
--   AD14: Combined filters
--   AD15: Pagination (50 items > 10 per page)
--   AD16: Sort by name
--   AD17: Sort by date
--   AD18: Empty state (when no results)
-- =====================================================

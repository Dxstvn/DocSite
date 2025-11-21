-- =====================================================
-- Bergen Mind & Wellness - Initial Database Schema
-- =====================================================
-- This migration creates the core tables for the appointment booking system
--
-- Tables:
-- 1. profiles - User profiles (extends Supabase auth.users)
-- 2. appointment_types - Types of appointments available for booking
-- 3. availability - Doctor availability schedules
-- 4. appointments - Booked appointments
--
-- Created: 2025-11-12
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
-- Extends Supabase auth.users with role information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')) DEFAULT 'patient',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for role-based queries
CREATE INDEX idx_profiles_role ON profiles(role);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. APPOINTMENT_TYPES TABLE
-- =====================================================
-- Defines the types of appointments that can be booked
CREATE TABLE IF NOT EXISTS appointment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- Machine-readable identifier (e.g., 'initial-consultation')
  display_name TEXT NOT NULL, -- English display name
  display_name_es TEXT NOT NULL, -- Spanish display name
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  price NUMERIC(10, 2) DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for active types lookup
CREATE INDEX idx_appointment_types_active ON appointment_types(is_active, sort_order);

-- Auto-update updated_at timestamp
CREATE TRIGGER update_appointment_types_updated_at
  BEFORE UPDATE ON appointment_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. AVAILABILITY TABLE
-- =====================================================
-- Stores doctor availability schedules (recurring weekly and specific dates)
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Recurring weekly availability (e.g., "Every Monday 10am-6pm")
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday

  -- One-time specific date availability (e.g., "December 25, 2025")
  specific_date DATE,

  -- Time range
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  -- Recurring flag
  is_recurring BOOLEAN NOT NULL DEFAULT true,

  -- Blocked slots (vacation, time off)
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  block_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CHECK (end_time > start_time),
  CHECK (
    (is_recurring = true AND day_of_week IS NOT NULL AND specific_date IS NULL) OR
    (is_recurring = false AND specific_date IS NOT NULL AND day_of_week IS NULL)
  ),
  CHECK (is_blocked = false OR block_reason IS NOT NULL)
);

-- Create indexes for availability queries
CREATE INDEX idx_availability_doctor ON availability(doctor_id);
CREATE INDEX idx_availability_day_of_week ON availability(day_of_week) WHERE is_recurring = true;
CREATE INDEX idx_availability_specific_date ON availability(specific_date) WHERE is_recurring = false;
CREATE INDEX idx_availability_not_blocked ON availability(is_blocked) WHERE is_blocked = false;

-- Auto-update updated_at timestamp
CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. APPOINTMENTS TABLE
-- =====================================================
-- Stores booked appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  patient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  doctor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_type_id UUID NOT NULL REFERENCES appointment_types(id) ON DELETE RESTRICT,

  -- Schedule
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,

  -- Status
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',

  -- Patient information (stored even if patient_id is null for public bookings)
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,

  -- Optional notes
  notes TEXT,

  -- Booking token for confirmation/cancellation without auth
  booking_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CHECK (end_time > start_time),
  CHECK (patient_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'), -- Email validation
  CHECK (length(patient_name) >= 2),
  CHECK (length(patient_phone) >= 10)
);

-- Create indexes for appointment queries
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_appointments_booking_token ON appointments(booking_token);

-- Prevent double-booking the same doctor at the same time
CREATE UNIQUE INDEX idx_appointments_no_double_booking
  ON appointments(doctor_id, start_time)
  WHERE status != 'cancelled';

-- Auto-update updated_at timestamp
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. HELPFUL COMMENTS
-- =====================================================

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth with role information';
COMMENT ON TABLE appointment_types IS 'Types of appointments available for booking (e.g., Initial Consultation, Therapy Session)';
COMMENT ON TABLE availability IS 'Doctor availability schedules (both recurring weekly and one-time specific dates)';
COMMENT ON TABLE appointments IS 'Booked patient appointments';

COMMENT ON COLUMN availability.day_of_week IS '0=Sunday, 1=Monday, ..., 6=Saturday. Used for recurring weekly availability.';
COMMENT ON COLUMN availability.specific_date IS 'Used for one-time availability overrides (e.g., holiday hours)';
COMMENT ON COLUMN availability.is_recurring IS 'true = weekly recurring, false = specific date only';
COMMENT ON COLUMN appointments.booking_token IS 'Secure token for confirming/cancelling appointments without authentication';
COMMENT ON COLUMN appointments.patient_id IS 'NULL for public bookings, UUID for authenticated patients';

-- =====================================================
-- 6. VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the schema was created correctly:
--
-- List all tables:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
--
-- Describe appointments table:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'appointments'
-- ORDER BY ordinal_position;
--
-- List all indexes:
-- SELECT indexname, indexdef FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY tablename, indexname;
--
-- List all constraints:
-- SELECT conname, contype, pg_get_constraintdef(oid)
-- FROM pg_constraint
-- WHERE conrelid = 'appointments'::regclass;
-- =====================================================

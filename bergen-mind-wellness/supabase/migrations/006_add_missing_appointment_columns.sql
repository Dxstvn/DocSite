-- =====================================================
-- Migration: Add Missing Appointment Columns
-- =====================================================
-- This migration adds columns that are used by the booking
-- Server Action but were missing from the initial schema:
-- - patient_locale: User's preferred language
-- - timezone: Appointment timezone
-- - reason_for_visit: Patient's reason for visit (in addition to notes)
--
-- Created: 2025-11-15
-- =====================================================

-- Add patient_locale column (for i18n support)
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS patient_locale TEXT
CHECK (patient_locale IN ('en', 'es'))
DEFAULT 'en';

-- Add timezone column
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS timezone TEXT
DEFAULT 'America/New_York'
NOT NULL;

-- Add reason_for_visit column (distinct from general notes)
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS reason_for_visit TEXT;

-- Add helpful comments
COMMENT ON COLUMN appointments.patient_locale IS 'Patient''s preferred language for communication (en or es)';
COMMENT ON COLUMN appointments.timezone IS 'Timezone for the appointment (IANA timezone format)';
COMMENT ON COLUMN appointments.reason_for_visit IS 'Patient''s stated reason for visit (from booking form)';

-- Create index for locale-based queries (useful for filtering by language preference)
CREATE INDEX IF NOT EXISTS idx_appointments_patient_locale ON appointments(patient_locale);

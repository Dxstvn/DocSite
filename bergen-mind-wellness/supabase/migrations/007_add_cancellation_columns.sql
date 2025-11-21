-- Migration: Add cancellation tracking columns to appointments table
-- Purpose: Track when, who, and why appointments are cancelled
-- Required for: Patient appointment management feature

-- Add cancellation tracking columns
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancelled_by TEXT CHECK (cancelled_by IN ('patient', 'doctor')),
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Create index for efficient cancellation queries
CREATE INDEX IF NOT EXISTS idx_appointments_cancelled_at ON appointments(cancelled_at);

-- Add helpful column comments
COMMENT ON COLUMN appointments.cancelled_at IS 'Timestamp when appointment was cancelled';
COMMENT ON COLUMN appointments.cancelled_by IS 'Who cancelled the appointment: patient or doctor';
COMMENT ON COLUMN appointments.cancellation_reason IS 'Optional reason provided for cancellation';

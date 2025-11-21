-- =====================================================
-- Migration 009: Fix NULL appointment_type_id
-- =====================================================
-- Created: 2025-11-19
-- Author: System maintenance
-- Issue: Admin filter AD10 failing due to NULL foreign keys
--
-- Background:
-- During E2E testing, discovered all 50 test appointments
-- had appointment_type_id set to NULL despite schema defining
-- the column as NOT NULL with foreign key constraint.
--
-- This migration:
-- 1. Verifies appointment types exist in database
-- 2. Assigns types to appointments with NULL appointment_type_id
-- 3. Uses round-robin distribution for balanced test data
-- 4. Validates fix with count verification
--
-- Safe to run multiple times (only updates NULL values)
-- =====================================================

DO $$
DECLARE
  type_initial UUID;
  type_followup UUID;
  type_therapy UUID;
  appointment_record RECORD;
  type_index INT := 0;
  types UUID[];
BEGIN
  -- Get existing appointment type IDs
  SELECT id INTO type_initial
  FROM appointment_types
  WHERE name = 'test-initial'
  LIMIT 1;

  SELECT id INTO type_followup
  FROM appointment_types
  WHERE name = 'test-followup'
  LIMIT 1;

  SELECT id INTO type_therapy
  FROM appointment_types
  WHERE name = 'test-therapy'
  LIMIT 1;

  -- Verify types exist
  IF type_initial IS NULL OR type_followup IS NULL OR type_therapy IS NULL THEN
    RAISE EXCEPTION 'Appointment types not found. Please run seed.sql first.';
  END IF;

  -- Create array of types for round-robin assignment
  types := ARRAY[type_initial, type_followup, type_therapy];

  -- Update appointments with NULL appointment_type_id
  FOR appointment_record IN
    SELECT id
    FROM appointments
    WHERE appointment_type_id IS NULL
    ORDER BY created_at ASC
  LOOP
    -- Assign type using round-robin (modulo operator)
    UPDATE appointments
    SET appointment_type_id = types[(type_index % 3) + 1]
    WHERE id = appointment_record.id;

    type_index := type_index + 1;
  END LOOP;

  RAISE NOTICE 'Fixed % appointments with NULL appointment_type_id', type_index;
END $$;

-- Verify fix
DO $$
DECLARE
  null_count INT;
  total_count INT;
BEGIN
  SELECT COUNT(*) INTO null_count
  FROM appointments
  WHERE appointment_type_id IS NULL;

  SELECT COUNT(*) INTO total_count
  FROM appointments;

  RAISE NOTICE 'After fix: % total appointments, % with NULL type',
    total_count, null_count;

  IF null_count > 0 THEN
    RAISE WARNING 'Still have % appointments with NULL appointment_type_id',
      null_count;
  END IF;
END $$;

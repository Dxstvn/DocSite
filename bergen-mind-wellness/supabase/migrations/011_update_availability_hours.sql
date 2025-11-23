-- Update existing availability hours from 7am-9pm to 9am-5pm
-- This aligns production data with the intended business hours

-- Update all recurring availability records that have 7am-9pm hours
-- Change them to standard business hours of 9am-5pm
UPDATE availability_slots
SET
  start_time = '09:00:00',
  end_time = '17:00:00',
  updated_at = NOW()
WHERE
  is_recurring = true
  AND is_blocked = false
  AND start_time = '07:00:00'
  AND end_time = '21:00:00';

-- Log the changes (this will appear in Supabase logs)
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'Updated % availability records from 7am-9pm to 9am-5pm', updated_count;
END $$;

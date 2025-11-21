-- =====================================================
-- Bergen Mind & Wellness - Add Profiles RLS Policies
-- =====================================================
-- This migration fixes the "infinite recursion detected in policy"
-- error by adding proper RLS policies for the profiles table.
--
-- ISSUE:
-- Profiles table had RLS enabled but no policies, or had policies
-- that caused infinite recursion when querying appointments.
--
-- SOLUTION:
-- Add simple, non-recursive policies for profiles that allow:
-- - Authenticated users to read all profiles (for admin views)
-- - Users to read their own profile
-- - No public access to profiles
--
-- Created: $(date +%Y-%m-%d)
-- =====================================================

-- Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;

-- Policy 1: Authenticated users can SELECT all profiles
-- This is safe because profiles only contains role and timestamps,
-- no PHI or sensitive data
CREATE POLICY "Authenticated users can view all profiles"
  ON profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy 2: Users can UPDATE their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Add helpful comments
COMMENT ON POLICY "Authenticated users can view all profiles" ON profiles IS
  'Allows authenticated admin users to view all user profiles. Profiles table contains only role and metadata, no PHI.';

COMMENT ON POLICY "Users can update own profile" ON profiles IS
  'Allows users to update their own profile information.';

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Test that authenticated users can view profiles:
-- SET ROLE authenticated;
-- SELECT * FROM profiles; -- Should work
-- RESET ROLE;

# Database Migrations

This directory contains SQL migration files for the Bergen Mind & Wellness Supabase database.

## How to Apply Migrations

### Method 1: Supabase Dashboard (Recommended)

1. Go to https://app.supabase.com
2. Select your Bergen Mind & Wellness project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of the migration file (e.g., `002_rls_policies.sql`)
6. Click **Run** to execute the migration
7. Verify success by checking for any errors in the output

### Method 2: Supabase CLI (Advanced)

If you have the Supabase CLI installed:

```bash
# Link your project (first time only)
supabase link --project-ref your-project-ref

# Apply all pending migrations
supabase db push
```

## Current Migrations

### 002_rls_policies.sql
**Status:** Created, needs to be applied
**Purpose:** Implements Row Level Security policies for all tables
**Impact:**
- Protects appointments, availability, and appointment_types tables
- Allows public viewing of availability and active appointment types
- Restricts appointment management to authenticated admins
- Enables service role (API) to create appointments

**Important:** After applying this migration:
1. Test that public users can view availability
2. Test that admin users can log in and manage appointments
3. Test that the booking API still works
4. Verify RLS is enabled with:
   ```sql
   SELECT schemaname, tablename, rowsecurity
   FROM pg_tables
   WHERE tablename IN ('appointments', 'availability', 'appointment_types');
   ```

## Rollback Instructions

If you need to rollback the RLS policies migration:

```sql
-- Disable RLS on all tables
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_types DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DROP POLICY IF EXISTS "Service role can insert appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can update appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can delete appointments" ON appointments;

DROP POLICY IF EXISTS "Public can view availability" ON availability;
DROP POLICY IF EXISTS "Admins can create availability" ON availability;
DROP POLICY IF EXISTS "Admins can update availability" ON availability;
DROP POLICY IF EXISTS "Admins can delete availability" ON availability;

DROP POLICY IF EXISTS "Public can view active appointment types" ON appointment_types;
DROP POLICY IF EXISTS "Admins can view all appointment types" ON appointment_types;
DROP POLICY IF EXISTS "Admins can create appointment types" ON appointment_types;
DROP POLICY IF EXISTS "Admins can update appointment types" ON appointment_types;
DROP POLICY IF EXISTS "Admins can delete appointment types" ON appointment_types;
```

## Best Practices

1. **Always backup before migrations:** Use Supabase Dashboard > Database > Backups
2. **Test in development first:** Apply migrations to a test project before production
3. **Run verification queries:** Check that policies are working as expected
4. **Monitor after deployment:** Watch for any access errors in your application logs
5. **Keep migrations small:** One logical change per migration file

## Notes

- These migrations assume you're using Supabase Auth for admin authentication
- The `service_role` key is used by API routes to bypass RLS (keep it secret!)
- Public users access data through API routes, not directly
- Admin users authenticate through `/auth/login` page

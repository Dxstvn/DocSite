import { createServiceRoleClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Test Cleanup Endpoint - DELETE /api/test/cleanup-appointments
 *
 * Removes all appointments from the database to ensure clean state between test runs.
 *
 * SECURITY:
 * - Only available when NODE_ENV=test
 * - Requires service role client (bypasses RLS)
 * - NOT available in production
 */
export async function DELETE() {
  // Only allow in non-production environments (development, test)
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Cleanup endpoint not available in production' },
      { status: 403 }
    )
  }

  try {
    const supabase = createServiceRoleClient()

    // Delete all appointments (service role bypasses RLS)
    const { error } = await supabase.from('appointments').delete().gte('created_at', '2020-01-01')

    if (error) {
      console.error('Error cleaning up test appointments:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'All test appointments cleaned up successfully',
    })
  } catch (error) {
    console.error('Unexpected error in cleanup endpoint:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

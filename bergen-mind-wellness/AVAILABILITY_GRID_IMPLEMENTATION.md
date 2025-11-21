# Weekly Availability Grid Implementation Summary

## Overview

Implemented a weekly availability management grid view for the Bergen Mind & Wellness admin interface. This provides doctors with a Google Calendar-style visual interface to manage their appointment availability across a week at a glance.

## Features Implemented

### 1. **Dual-Mode View System**
- **List View** (existing): Traditional list-based display of availability records
- **Grid View** (new): Weekly calendar grid showing 7 days × 28 time slots (7am-9pm, 30-min intervals)
- **View Toggle**: Segmented control to switch between views seamlessly

### 2. **Weekly Availability Grid**
- **Visual States**:
  - 🟢 **Green (Available)**: Time slots open for patient appointments
  - 🔴 **Red (Blocked)**: Manually blocked time slots
  - 🔵 **Blue (Booked)**: Slots with confirmed appointments
  - ⚫ **Gray (Past)**: Historical slots (read-only)

- **Interactive Features**:
  - Click individual slots to block/unblock 30-minute periods
  - "Block Day" button per column to block entire days
  - Week navigation (Previous/Next/Today)
  - Statistics cards showing available, booked, blocked slots and total hours

### 3. **Mobile Responsiveness**
- **Desktop** (lg+): Full 7-column weekly grid with time labels
- **Mobile**: Day selector tabs + vertical time slots for selected day

### 4. **Safety Features**
- **Appointment Warning Dialog**: When blocking a day with existing appointments, shows:
  - Number of appointments affected
  - List of appointment times and patient names
  - Clarification that blocking doesn't auto-cancel appointments
  - Required reason field for blocking

### 5. **Accessibility**
- **ARIA Labels**: Screen reader-friendly slot descriptions (e.g., "9:00 to 9:30 - Available - Press Enter to block")
- **Keyboard Navigation**: All slots are keyboard-accessible buttons
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Color + Icon**: Visual states use both color and icons (Check, X, User, Clock)
- **Tooltips**: Hover tooltips provide additional context

## Technical Architecture

### Core Components Created

#### 1. **[slot-calculator.ts](src/lib/appointments/slot-calculator.ts)** (263 lines)
**Purpose**: Core utility for computing slot states from availability records and appointments

**Key Functions**:
```typescript
export type SlotState = 'available' | 'blocked' | 'booked' | 'past'

// Generate all 30-min slots for a day (7am-9pm = 28 slots)
export function generateDaySlots(date: Date): WeeklySlot[]

// Calculate state for a single slot
export function calculateSlotState(
  slotDate: Date,
  slotStartTime: string,
  slotEndTime: string,
  availabilityRecords: AvailabilityRecord[],
  appointments: AppointmentRecord[]
): { state: SlotState; appointment?: AppointmentRecord; blockReason?: string }

// Generate full weekly grid (7 days × 28 slots)
export function generateWeeklyGrid(
  weekStart: Date,
  availabilityRecords: AvailabilityRecord[],
  appointments: AppointmentRecord[]
): WeeklySlot[][]

// Calculate statistics
export function calculateWeeklyStats(grid: WeeklySlot[][])
```

**Algorithm Logic**:
1. Check if slot is in past → `'past'`
2. Check if appointment exists → `'booked'`
3. Find matching availability records (by day_of_week or specific_date and time range)
4. If matching record has `is_blocked=true` → `'blocked'`
5. If matching record has `is_blocked=false` → `'available'`
6. No matching record → `'blocked'` (default unavailable)

#### 2. **[TimeSlotCell.tsx](src/components/admin/TimeSlotCell.tsx)** (132 lines)
**Purpose**: Individual clickable button for each time slot in the grid

**Visual States**:
- **Available**: `bg-green-50 border-green-300` with Check icon
- **Blocked**: `bg-red-50 border-red-300` with X icon
- **Booked**: `bg-blue-50 border-blue-300` with User icon (not clickable)
- **Past**: `bg-neutral-100` with Clock icon, opacity-50 (not clickable)

**Accessibility Features**:
- ARIA labels: "9:00 to 9:30 - Available - Press Enter to block"
- Tooltip on hover with additional context
- Focus visible ring (`focus-visible:ring-2`)
- `data-testid` attributes for E2E testing
- `aria-disabled` for non-interactive states

#### 3. **[BlockDayDialog.tsx](src/components/admin/BlockDayDialog.tsx)** (144 lines)
**Purpose**: Confirmation dialog for blocking entire day with appointment warnings

**Key Features**:
```typescript
interface BlockDayDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date
  existingAppointments: AppointmentRecord[]
  onConfirm: (reason: string) => Promise<void>
}
```

**Behavior**:
- Shows amber warning box if appointments exist on that day
- Lists all existing appointments with times and patient names
- Requires reason input (Textarea, required field)
- Clarifies that blocking does NOT auto-cancel appointments
- Submit button disabled until reason entered

#### 4. **[ViewToggle.tsx](src/components/admin/ViewToggle.tsx)** (64 lines)
**Purpose**: Segmented control to switch between List and Grid views

**Implementation**:
```typescript
export type ViewMode = 'list' | 'grid'

interface ViewToggleProps {
  view: ViewMode
  onViewChange: (view: ViewMode) => void
}
```

**UI Pattern**: Inline-flex with rounded border, active state gets `bg-neutral-100 shadow-sm`

#### 5. **[WeeklyAvailabilityGrid.tsx](src/components/admin/WeeklyAvailabilityGrid.tsx)** (500+ lines)
**Purpose**: Main composite component that brings together all the pieces

**Responsibilities**:
- Fetches availability records and appointments for current week from Supabase
- Manages state: current week, dialog state, mobile selected day
- Generates weekly grid using `slot-calculator` utilities
- Handles interactions: slot clicks, block day, week navigation
- Renders: Week header, stats cards, grid/mobile views
- Performs mutations: Block/unblock operations with `router.refresh()`

**Data Fetching**:
```typescript
// Single query for week's appointments (performance optimization)
const { data: appointmentsData } = await supabase
  .from('appointments')
  .select('start_time, end_time, patient_name:profiles(full_name)')
  .gte('start_time', currentWeekStart.toISOString())
  .lte('start_time', weekEnd.toISOString())
  .eq('status', 'confirmed')
```

**Block/Unblock Logic**:
- **Block individual slot**: Insert specific_date record with `is_blocked=true`
- **Unblock individual slot**: Delete matching blocked record
- **Block entire day**: Insert single 7am-9pm record with reason

#### 6. **[AvailabilityPageClient.tsx](src/components/admin/AvailabilityPageClient.tsx)** (50 lines)
**Purpose**: Client component wrapper for availability page

**Responsibilities**:
- Manages view state (list vs grid) in React state
- Conditionally renders AvailabilityList or WeeklyAvailabilityGrid
- Displays ViewToggle component
- Preserves server-side data fetching while adding client-side interactivity

### Modified Files

#### 1. **[availability/page.tsx](src/app/[locale]/admin/availability/page.tsx)**
**Changes**:
- Replaced direct rendering of `<Card>` with list view
- Integrated `AvailabilityPageClient` component
- Preserved all existing functionality (server-side data fetching, AvailabilityDialog, ExportButton)

**Before**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Current Weekly Schedule</CardTitle>
  </CardHeader>
  <CardContent>
    <AvailabilityList slots={slots || []} locale={locale} />
  </CardContent>
</Card>
```

**After**:
```tsx
<AvailabilityPageClient slots={slots || []} locale={locale} />
```

## Database Schema

No database migrations required! Uses existing `availability` table:

```sql
CREATE TABLE availability (
  id UUID PRIMARY KEY,
  doctor_id UUID REFERENCES profiles(id),
  day_of_week INTEGER,        -- 0=Sunday, 6=Saturday (for recurring)
  specific_date DATE,          -- YYYY-MM-DD (for one-time blocks)
  start_time TIME,             -- HH:MM:SS
  end_time TIME,               -- HH:MM:SS
  is_recurring BOOLEAN,        -- true=weekly, false=specific date
  is_blocked BOOLEAN,          -- true=blocked, false=available
  block_reason TEXT            -- why this slot is blocked
)
```

**How Slots Are Computed**:
- 30-minute slots are calculated dynamically from time ranges
- No `blocked_slots` table needed
- Existing availability records serve dual purpose (available ranges + blocks)

## Performance Optimizations

1. **Single Query Per Week**: Fetch all week's appointments once, cache in React state
2. **Client-Side Computation**: Slot states calculated in browser from cached data
3. **Conditional Rendering**: Only render desktop OR mobile grid, not both
4. **Memoization Ready**: Grid calculation could be wrapped in `useMemo` if needed

## Testing Status

### Build Verification
✅ **TypeScript Compilation**: Successful (`pnpm build` passes)
✅ **Route Generation**: `/[locale]/admin/availability` builds as dynamic route
✅ **No Import Errors**: All components import correctly

### Required Manual Testing (Blocked)
⚠️ **Database Setup Required**: Local Supabase instance needs `availability` table migration

**Tests to Execute (AD34-AD43 from [04-admin.md](e2e-checklists/04-admin.md))**:
- AD34: View toggle switches between list and grid views
- AD35: Grid shows 7 days (Mon-Sat) with correct dates
- AD36: Grid shows 28 time slots (7am-9pm, 30-min intervals)
- AD37: Available slots show green with checkmark
- AD38: Blocked slots show red with X
- AD39: Booked slots show blue with user icon (non-clickable)
- AD40: Past slots show gray (non-clickable)
- AD41: Click available slot blocks it
- AD42: Click blocked slot unblocks it
- AD43: "Block Day" button shows confirmation dialog with warnings

## Next Steps

1. **Database Setup**: Ensure local Supabase has `availability` table
   ```bash
   pnpm supabase:reset  # Reset and apply all migrations
   pnpm supabase:start  # Start local Supabase
   ```

2. **Manual Testing**: Execute AD34-AD43 tests from [04-admin.md](e2e-checklists/04-admin.md)

3. **E2E Test Automation** (Optional): Create Playwright tests for availability grid features

4. **Code Review**: Launch reviewer agents to check:
   - Code quality and best practices
   - Accessibility compliance
   - Performance considerations
   - Security (SQL injection, XSS, etc.)

## Design Decisions & Rationale

### Why Google Calendar Style?
- **Familiar UX**: Doctors recognize this pattern from scheduling tools they use daily
- **Information Density**: Shows 196 slots at a glance vs scrolling through list
- **Spatial Recognition**: Easier to spot gaps in availability visually

### Why Client-Side Slot Calculation?
- **No Schema Migration**: Avoids database changes and deployment complexity
- **Flexibility**: Easy to change slot duration (15min, 45min, etc.) without DB changes
- **Performance**: Single query + client computation faster than 196 individual queries

### Why Preserve List View?
- **Non-Breaking Change**: Existing workflow remains available
- **Different Use Cases**: List better for searching/sorting, grid better for visual overview
- **User Preference**: Some users prefer list-based interfaces

### Why Warning Dialog for Block Day?
- **Safety**: Prevents accidental disruption of confirmed appointments
- **Transparency**: Doctor sees exactly which appointments are affected
- **Audit Trail**: Reason field creates record of why day was blocked

## Files Created

```
src/lib/appointments/slot-calculator.ts                    (263 lines)
src/components/admin/TimeSlotCell.tsx                     (132 lines)
src/components/admin/BlockDayDialog.tsx                   (144 lines)
src/components/admin/ViewToggle.tsx                       (64 lines)
src/components/admin/WeeklyAvailabilityGrid.tsx           (500+ lines)
src/components/admin/AvailabilityPageClient.tsx           (50 lines)
```

**Total**: ~1,153 lines of new code (excluding comments and blank lines)

## Files Modified

```
src/app/[locale]/admin/availability/page.tsx              (Modified imports and rendering)
```

## Summary

This implementation provides a powerful, accessible, and user-friendly weekly availability management interface that:
- ✅ Requires no database changes
- ✅ Preserves existing functionality (list view)
- ✅ Follows existing codebase patterns (Shadcn UI, TypeScript, Server/Client component split)
- ✅ Includes comprehensive accessibility features (ARIA, keyboard nav, focus indicators)
- ✅ Handles edge cases (past slots, booked slots, appointment warnings)
- ✅ Optimizes performance (single query per week, client-side computation)
- ✅ Compiles successfully with no TypeScript errors

The grid view enables tests AD34-AD43 in the E2E checklist and provides doctors with an intuitive visual tool for managing their weekly availability.

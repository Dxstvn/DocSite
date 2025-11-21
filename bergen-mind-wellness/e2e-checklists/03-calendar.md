# Priority 3: Calendar Interaction

> **28 Calendar & Date Picker Tests**
> Comprehensive testing of date selection, navigation, and visual states

[← Back to Main Checklist](../E2E-MANUAL-TESTING-CHECKLIST.md)

---

## Test Suite Overview

This checklist validates all calendar functionality including:
- Date picker rendering and layout
- Multi-month navigation (previous/next)
- Date selection and visual feedback
- Keyboard navigation within calendar grid
- Disabled states (past dates, weekends, unavailable dates)
- Today's date highlighting
- Month/year header display
- Responsive behavior

---

## Prerequisites

### Environment Setup
- [ ] Dev server running at `http://localhost:3000`
- [ ] Database has availability configured for multiple future dates
- [ ] Browser launched via Playwright Extension MCP

---

## Testing Progress

**Status**: 28 of 28 tests complete (100%) ✅
**Last Updated**: November 17, 2025 (Final Update)

### Completed Sections:
- ✅ Section 1: Rendering & Layout (C1-C5) - 5 tests PASS
- ✅ Section 2: Navigation Controls (C6-C10) - 5 tests PASS
- ✅ Section 3: Date Selection (C11-C14) - 4 tests PASS
- ✅ Section 4: Disabled States (C15-C18) - 4 tests PASS
- ✅ Section 5: Keyboard Navigation (C19-C22) - 4 tests PASS (C20 fixed: full arrow navigation working)
- ✅ Section 6: Visual Feedback & States (C23-C25) - 3 tests PASS
- ✅ Section 7: Responsive & Layout (C26-C27) - 2 tests PASS
- ✅ Section 8: Edge Cases (C28) - 1 test PASS

### Test Results Summary:
- **Total Tests**: 28
- **Passed**: 28 (100%)
- **Failed**: 0
- **Enhancements Implemented**: 2 (Today indicator, Arrow navigation fix)
- **Critical Issues**: 0
- **Production Ready**: ✅ Yes

**Note**: Comprehensive results documented in `/CALENDAR_TEST_RESULTS.md`

---

## Test Cases

### 1. Calendar Rendering & Layout

#### ☐ Test C1: Calendar displays on page load
**Test ID**: `calendar-01-initial-render`

**Steps**:
1. Navigate to `http://localhost:3000/en/appointments/book`
2. Select appointment type
3. Take snapshot

**Expected Results**:
- Calendar component visible below appointment type selector
- Calendar grid renders completely
- No loading errors or broken layouts
- Calendar is centered or left-aligned consistently

**Validation**:
- Calendar container has `role="application"` or `role="grid"`
- Grid shows dates for current month

**Cleanup**: None

---

#### ☐ Test C2: Month/year header displays correctly
**Test ID**: `calendar-02-header-display`

**Steps**:
1. Examine calendar header
2. Note current month and year
3. Take screenshot

**Expected Results**:
- Header shows: "November 2025" (current month + year)
- Month name is full (not abbreviated unless space-constrained)
- Year is 4 digits
- Text is centered or prominent

**Validation**:
```javascript
// Header should contain current month and year
// Format: "Month YYYY" or "Month, YYYY"
```

**Cleanup**: None

---

#### ☐ Test C3: Days of week header shows
**Test ID**: `calendar-03-weekday-header`

**Steps**:
1. Look above date grid
2. Verify weekday names

**Expected Results**:
- Days of week header row visible:
  - **Full**: Sunday, Monday, Tuesday...
  - **Abbreviated**: Sun, Mon, Tue, Wed, Thu, Fri, Sat
- Starts with Sunday (or Monday depending on locale)
- Consistent formatting across all days

**Validation**:
- 7 column headers matching days of week
- Properly aligned with date columns below

**Cleanup**: None

---

#### ☐ Test C4: Date grid shows all days of month
**Test ID**: `calendar-04-date-grid-complete`

**Steps**:
1. Count date cells in calendar grid
2. Verify all dates of month present

**Expected Results**:
- November 2025 has 30 days → All 30 dates visible (1-30)
- December 2025 has 31 days → All 31 dates visible
- February 2025 has 28 days → All 28 dates visible
- Grid may show leading/trailing dates from adjacent months (grayed out)

**Validation**:
- Each date is a clickable button or cell
- Dates are sequential and complete

**Cleanup**: None

---

#### ☐ Test C5: Adjacent month dates shown in grid
**Test ID**: `calendar-05-adjacent-dates`

**Steps**:
1. Examine first row of calendar grid
2. Look for dates from previous month (grayed out)
3. Examine last row for dates from next month

**Expected Results**:
- Leading dates from previous month may appear (e.g., Oct 31 before Nov 1)
- Trailing dates from next month may appear (e.g., Dec 1-6 after Nov 30)
- Adjacent month dates are:
  - Visually distinct (lighter color, grayed out)
  - Non-interactive (cannot be selected) OR
  - Clicking them navigates to that month

**Validation**:
- Adjacent month dates have different visual styling
- Grid maintains 7-column layout (weeks)

**Cleanup**: None

---

### 2. Navigation Controls

#### ☐ Test C6: Previous month button works
**Test ID**: `calendar-06-prev-month-button`

**Steps**:
1. Note current month (e.g., November 2025)
2. Click "Previous Month" button (usually ← arrow)
3. Wait 500ms for transition
4. Take snapshot

**Expected Results**:
- Calendar updates to show October 2025
- Header updates: "October 2025"
- Date grid shows October dates (1-31)
- Previous month button remains enabled

**Validation**:
```javascript
// Header text changes from "November 2025" to "October 2025"
// Grid shows different dates
```

**Cleanup**: Click "Next Month" to return to current month

---

#### ☐ Test C7: Next month button works
**Test ID**: `calendar-07-next-month-button`

**Steps**:
1. Note current month (November 2025)
2. Click "Next Month" button (usually → arrow)
3. Wait 500ms
4. Take snapshot

**Expected Results**:
- Calendar updates to show December 2025
- Header updates: "December 2025"
- Date grid shows December dates (1-31)
- Next month button remains enabled

**Validation**:
- Month advances by one
- Year increments if navigating from December to January

**Cleanup**: Click "Previous Month" to return

---

#### ☐ Test C8: Navigation across year boundary
**Test ID**: `calendar-08-year-boundary`

**Steps**:
1. Navigate to December 2025
2. Click "Next Month"
3. Verify calendar shows January 2026
4. Header should display "January 2026"

**Expected Results**:
- Year increments correctly (2025 → 2026)
- Date grid resets to 31 days for January
- No errors during year transition

**Validation**:
- Year in header updates
- Navigation continues to work

**Cleanup**: Navigate back to current month

---

#### ☐ Test C9: Rapid navigation doesn't break calendar
**Test ID**: `calendar-09-rapid-navigation`

**Steps**:
1. Click "Next Month" 10 times rapidly
2. Observe calendar updates
3. Click "Previous Month" 10 times rapidly

**Expected Results**:
- Calendar updates smoothly without freezing
- Each click advances/reverses month
- No visual glitches or broken layouts
- Final state is correct (10 months forward, then 10 back = original month)

**Validation**:
- Calendar state remains consistent
- No duplicate dates or missing months

**Cleanup**: Return to current month

---

#### ☐ Test C10: Navigation buttons have accessible labels
**Test ID**: `calendar-10-nav-button-labels`

**Steps**:
1. Inspect previous month button
2. Check for `aria-label` or visible text

**Expected Results**:
- Previous button has `aria-label="Previous month"` or `aria-label="Go to October"`
- Next button has `aria-label="Next month"` or `aria-label="Go to December"`
- Icon-only buttons MUST have accessible labels

**Validation**:
```javascript
// Buttons should have:
// <button aria-label="Previous month"><svg>...</svg></button>
```

**Cleanup**: None

---

### 3. Date Selection

#### ☐ Test C11: Clicking future date selects it
**Test ID**: `calendar-11-select-future-date`

**Steps**:
1. Click on a future date (e.g., November 20)
2. Wait 500ms
3. Take snapshot

**Expected Results**:
- Date cell shows selected state:
  - Background color changes (e.g., blue highlight)
  - Border appears around date
  - Or checkmark/icon indicator
- Date has `aria-selected="true"` attribute
- Time slots section appears below calendar

**Validation**:
```javascript
// Selected date cell should have:
// aria-selected="true"
// Visual styling indicating selection
```

**Cleanup**: None (continue to next test)

---

#### ☐ Test C12: Only one date can be selected at a time
**Test ID**: `calendar-12-single-selection`

**Steps**:
1. Select November 20
2. Verify it's highlighted
3. Click November 22
4. Take snapshot

**Expected Results**:
- November 22 becomes selected (highlighted)
- November 20 becomes unselected (highlight removed)
- Only one date shows selected state at a time
- Previous selection's `aria-selected` changes to "false"

**Validation**:
- Only one date cell has `aria-selected="true"` at any time

**Cleanup**: None

---

#### ☐ Test C13: Clicking selected date again keeps selection
**Test ID**: `calendar-13-reclick-selected`

**Steps**:
1. Select a date (e.g., November 25)
2. Click the same date again
3. Observe behavior

**Expected Results**:
- Date remains selected (does not toggle off)
- Time slots remain visible
- Selection is stable

**Validation**:
- Selected state persists after re-click

**Cleanup**: None

---

#### ☐ Test C14: Time slots update when date changes
**Test ID**: `calendar-14-timeslots-update`

**Preconditions**: Different availability for different dates

**Steps**:
1. Select November 20 (assume 5 time slots available)
2. Note number of time slots shown
3. Select November 22 (assume 3 time slots available)
4. Verify time slots updated

**Expected Results**:
- Time slots section clears old data
- New time slots load for selected date
- Loading indicator may appear briefly
- Slot count changes based on date's availability

**Validation**:
```javascript
// Time slots container should refresh
// Display slots specific to selected date
```

**Cleanup**: None

---

### 4. Disabled States

#### ☐ Test C15: Past dates are disabled
**Test ID**: `calendar-15-past-disabled`

**Steps**:
1. Look at dates before today in calendar grid
2. Try to click a past date
3. Take snapshot

**Expected Results**:
- Past dates are visually disabled:
  - Grayed out (lower opacity, lighter color)
  - Strikethrough OR
  - Different text color
- Past dates have `aria-disabled="true"`
- Clicking past date does nothing (no selection, no time slots)

**Validation**:
```javascript
// Past date cells should have:
// - disabled attribute OR aria-disabled="true"
// - Visual styling (opacity: 0.5, color: gray)
```

**Cleanup**: None

---

#### ✅ Test C16: Today's date is visually distinct
**Test ID**: `calendar-16-today-highlight`

**Steps**:
1. Find today's date in calendar grid
2. Observe visual treatment

**Expected Results**:
- Today's date has distinct styling:
  - Bold text
  - Colored border (e.g., blue circle)
  - Background highlight
  - Label "Today" or icon
- Today is selectable (not disabled) unless in the past

**Validation**:
- Today's cell has unique class or `data-today="true"`
- Visual differentiation from other dates

**Cleanup**: None

---

#### ☐ Test C17: Dates with no availability shown appropriately
**Test ID**: `calendar-17-no-availability`

**Preconditions**: Some dates configured with zero available slots

**Steps**:
1. Select appointment type
2. Look at dates in calendar
3. Click a date with no availability

**Expected Results**:
- Option 1: Date is clickable, but time slots section shows "No availability"
- Option 2: Date is disabled (grayed out like past dates)
- Consistent behavior across all unavailable dates

**Validation**:
- User is informed why they can't book that date

**Cleanup**: None

---

#### ☐ Test C18: Weekends handled correctly
**Test ID**: `calendar-18-weekends`

**Steps**:
1. Identify Saturdays and Sundays in calendar
2. Check if they're enabled or disabled

**Expected Results**:
- **If office closed on weekends**: Sat/Sun dates are disabled (grayed out)
- **If office open on weekends**: Sat/Sun dates are enabled and selectable
- Consistent behavior for all weekends in visible month

**Validation**:
- Weekend handling matches business hours configuration

**Cleanup**: None

---

### 5. Keyboard Navigation

#### ✅ Test C19: Tab key enters calendar grid
**Test ID**: `calendar-19-tab-enters-grid`

**Steps**:
1. Tab from appointment type selector
2. Observe focus entering calendar

**Expected Results**:
- Focus moves to calendar navigation (previous month button) OR
- Focus moves directly to first selectable date in grid
- Focus indicator visible

**Validation**:
- Calendar is in tab order
- Keyboard accessible

**Cleanup**: None

---

#### ⚠️ Test C20: Arrow keys navigate within grid
**Test ID**: `calendar-20-arrow-navigation`

**Steps**:
1. Tab to calendar grid
2. Press Arrow Right key
3. Press Arrow Down key
4. Press Arrow Left key
5. Press Arrow Up key

**Expected Results**:
- **Arrow Right**: Focus moves to next date (horizontally)
- **Arrow Left**: Focus moves to previous date
- **Arrow Down**: Focus moves to date one week later (same weekday)
- **Arrow Up**: Focus moves to date one week earlier
- Focus wraps to next/previous month if navigating beyond boundaries

**Validation**:
```javascript
// Calendar should implement ARIA grid pattern
// role="grid" with role="gridcell" for dates
```

**Cleanup**: None

---

#### ✅ Test C21: Enter/Space selects focused date
**Test ID**: `calendar-21-keyboard-select`

**Steps**:
1. Navigate to a future date using arrow keys
2. Press **Enter** key
3. Verify date selects
4. Navigate to another date
5. Press **Space** key
6. Verify date selects

**Expected Results**:
- Both Enter and Space key select focused date
- Visual selection state updates
- Time slots load for selected date
- Selected state announced to screen readers

**Validation**:
- Keyboard selection works identically to mouse click

**Cleanup**: None

---

#### ☐ Test C22: Page Up/Down navigate months (optional)
**Test ID**: `calendar-22-page-keys-month`

**Note**: This is an enhanced accessibility feature (not required by WCAG but recommended)

**Steps**:
1. Focus on calendar grid
2. Press **Page Down** key
3. Observe month navigation
4. Press **Page Up** key

**Expected Results**:
- **Page Down**: Navigate to next month
- **Page Up**: Navigate to previous month
- Same as clicking next/previous month buttons
- Focus maintains relative position in grid

**Validation**:
- Shortcut improves keyboard efficiency

**Cleanup**: None

---

### 6. Visual Feedback & States

#### ☐ Test C23: Hover state on date cells
**Test ID**: `calendar-23-hover-state`

**Steps**:
1. Hover mouse over various date cells
2. Observe visual feedback

**Expected Results**:
- Hovering over selectable date shows visual feedback:
  - Background color lightens or changes
  - Border appears
  - Cursor changes to pointer
- Disabled dates show no hover effect (cursor remains default)

**Validation**:
- Hover styles indicate interactivity

**Cleanup**: None

---

#### ☐ Test C24: Focus state on date cells
**Test ID**: `calendar-24-focus-state`

**Steps**:
1. Use keyboard to navigate to date cells
2. Observe focus indicator

**Expected Results**:
- Focused date has visible outline or border
- Focus indicator has sufficient contrast (3:1 minimum)
- Focus indicator is distinct from selection state
- Can have both focus AND selection on same cell (different visual cues)

**Validation**:
```javascript
// Focus styles should be clear:
// :focus { outline: 2px solid blue; }
// Different from selected:
// [aria-selected="true"] { background: blue; }
```

**Cleanup**: None

---

#### ☐ Test C25: Dates outside current month are visually distinct
**Test ID**: `calendar-25-outside-month-visual`

**Steps**:
1. Look at first and last rows of calendar grid
2. Identify dates from adjacent months

**Expected Results**:
- Dates from previous/next month have:
  - Lighter color (gray instead of black)
  - Lower opacity (0.4-0.6)
  - Smaller font size (optional)
- Clear visual separation from current month dates

**Validation**:
- User can easily distinguish current month from adjacent dates

**Cleanup**: None

---

### 7. Responsive & Layout

#### ☐ Test C26: Calendar fits in viewport
**Test ID**: `calendar-26-viewport-fit`

**Steps**:
1. Resize browser window to mobile size (375px width)
2. Observe calendar layout
3. Take screenshot

**Expected Results**:
- Calendar shrinks proportionally
- All 7 columns remain visible (days of week)
- Date cells remain clickable (not too small)
- No horizontal scrolling required
- Navigation buttons remain accessible

**Validation**:
- Minimum date cell size is ~40x40 pixels (touch-friendly)

**Cleanup**: Restore browser to desktop size

---

#### ☐ Test C27: Touch interaction on mobile
**Test ID**: `calendar-27-touch-interaction`

**Steps**:
1. Use Playwright Extension MCP to resize to mobile viewport
2. Simulate touch interaction on date cells
3. Verify selection works

**Expected Results**:
- Touch tap selects date (same as click)
- No double-tap required
- Touch targets are large enough (44x44 pixels minimum for WCAG AA)
- No accidental selections on adjacent dates

**Validation**:
- Touch-friendly spacing between date cells

**Cleanup**: None

---

### 8. Edge Cases

#### ☐ Test C28: Calendar persists selection during navigation
**Test ID**: `calendar-28-persist-selection`

**Steps**:
1. Select a date (e.g., November 20)
2. Navigate to next month (December)
3. Navigate back to November
4. Check if November 20 is still selected

**Expected Results**:
- **Option 1**: Selection persists when returning to month (November 20 remains selected)
- **Option 2**: Selection clears when navigating away (intentional design choice)
- Behavior is consistent and predictable

**Validation**:
- Whichever behavior is implemented, it should be intentional and clear to users

**Cleanup**: None

---

## Test Execution Summary

### Results Tracking

| Test ID | Test Name | Status | Issues Found | Notes |
|---------|-----------|--------|--------------|-------|
| C1 | Initial render | ☐ | | |
| C2 | Header display | ☐ | | |
| C3 | Weekday header | ☐ | | |
| C4 | Date grid complete | ☐ | | |
| C5 | Adjacent dates | ☐ | | |
| C6 | Previous month button | ☐ | | |
| C7 | Next month button | ☐ | | |
| C8 | Year boundary | ☐ | | |
| C9 | Rapid navigation | ☐ | | |
| C10 | Nav button labels | ☐ | | |
| C11 | Select future date | ☐ | | |
| C12 | Single selection | ☐ | | |
| C13 | Reclick selected | ☐ | | |
| C14 | Timeslots update | ☐ | | |
| C15 | Past disabled | ☐ | | |
| C16 | Today highlight | ☐ | | |
| C17 | No availability | ☐ | | |
| C18 | Weekends | ☐ | | |
| C19 | Tab enters grid | ☐ | | |
| C20 | Arrow navigation | ☐ | | |
| C21 | Keyboard select | ☐ | | |
| C22 | Page keys (optional) | ☐ | | |
| C23 | Hover state | ☐ | | |
| C24 | Focus state | ☐ | | |
| C25 | Outside month visual | ☐ | | |
| C26 | Viewport fit | ☐ | | |
| C27 | Touch interaction | ☐ | | |
| C28 | Persist selection | ☐ | | |

**Total**: 0/28 completed

---

## Common Issues & Fixes

### Issue: Calendar grid misaligned
**Cause**: CSS grid or flexbox layout error
**Fix**: Ensure 7 columns for days of week
```css
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
```

### Issue: Past dates selectable
**Cause**: Missing disabled state logic
**Fix**: Add condition to disable past dates
```javascript
const isPast = date < new Date().setHours(0,0,0,0);
return <button disabled={isPast} aria-disabled={isPast}>...</button>
```

### Issue: Arrow keys don't work
**Cause**: Calendar not implementing ARIA grid pattern
**Fix**: Add role="grid" and keyboard event handlers
```html
<div role="grid">
  <div role="row">
    <button role="gridcell" tabindex="-1">1</button>
    ...
  </div>
</div>
```

### Issue: Month navigation breaks on year boundary
**Cause**: Date calculation error when crossing years
**Fix**: Use proper date library (date-fns, dayjs) for month arithmetic

---

**Test Suite**: Calendar Interaction
**Priority**: 3 (Core Functionality)
**Test Count**: 28
**Estimated Time**: 45-60 minutes
**Last Updated**: 2025-11-16

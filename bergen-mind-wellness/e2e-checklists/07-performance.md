# Priority 7: Performance & Load Testing

> **12 Performance, Concurrency, and Optimization Tests**
> Stress testing concurrent users, race conditions, and Core Web Vitals

[← Back to Main Checklist](../E2E-MANUAL-TESTING-CHECKLIST.md)

---

## Test Suite Overview

This checklist validates system performance under load:
- **Concurrent User Scenarios** (5 tests)
- **Race Condition Handling** (3 tests)
- **Core Web Vitals** (3 tests)
- **Database Performance** (1 test)

---

## Prerequisites

### Environment Setup
- [ ] Local Supabase running with performance monitoring
- [ ] Dev server running at `http://localhost:3000`
- [ ] Ability to open multiple browser tabs/windows
- [ ] Browser DevTools Performance tab ready

### Performance Targets
- **LCP (Largest Contentful Paint)**: < 2.5 seconds (Good)
- **INP (Interaction to Next Paint)**: < 200 ms (Good)
- **CLS (Cumulative Layout Shift)**: < 0.1 (Good)
- **Page Load Time**: < 3 seconds on fast connection
- **API Response Time**: < 500 ms for booking operations

---

## Test Cases

## Section 1: Concurrent User Scenarios (5 tests)

#### ☐ Test PERF-1: Multiple users booking different time slots
**Test ID**: `perf-01-concurrent-different-slots`

**Setup**:
1. Open 3 browser tabs (simulate 3 users)
2. Navigate all to booking page
3. Each user selects different appointment types and times

**Steps**:
1. **Tab 1**: Book Nov 20, 9:00 AM, Initial Consultation
2. **Tab 2**: Book Nov 20, 10:00 AM, Follow-up Visit
3. **Tab 3**: Book Nov 21, 11:00 AM, Medication Management
4. Submit all 3 bookings within 5-second window
5. Verify all confirmations

**Expected Results**:
- All 3 bookings succeed (no conflicts)
- Each receives unique booking token
- Database has 3 distinct appointment records
- No race conditions or errors

**Validation**:
```javascript
// Check database:
// SELECT COUNT(*) FROM appointments WHERE email IN ('user1@...', 'user2@...', 'user3@...');
// Should return 3
```

**Cleanup**: Delete test appointments

---

#### ☐ Test PERF-2: Multiple users trying to book same time slot (race condition)
**Test ID**: `perf-02-race-same-slot`

**Setup**:
1. Open 2 browser tabs
2. Both navigate to booking page
3. Both select **exact same slot**: Nov 20, 9:00 AM

**Steps**:
1. **Tab 1**: Fill form, click "Confirm Booking"
2. **Tab 2**: Fill form, click "Confirm Booking" (within 1-2 seconds of Tab 1)
3. Wait for responses from both

**Expected Results**:
- **One booking succeeds** (receives confirmation)
- **Other booking fails** with error: "This time slot is no longer available"
- Database has only **one** appointment for that slot
- No double-booking in database

**Validation**:
```javascript
// Database check:
// SELECT COUNT(*) FROM appointments WHERE date = '2025-11-20' AND time = '09:00:00';
// Should return 1 (not 2)
```

**Cleanup**: Delete successful appointment

---

#### ☐ Test PERF-3: Admin and patient actions at same time
**Test ID**: `perf-03-admin-patient-concurrent`

**Setup**:
1. **Tab 1**: Admin dashboard (logged in)
2. **Tab 2**: Patient booking page

**Steps**:
1. **Tab 2 (Patient)**: Start booking Nov 20, 2:00 PM
2. **Tab 1 (Admin)**: Simultaneously block Nov 20, 2:00 PM slot
3. Patient submits booking

**Expected Results**:
- If admin blocked slot first: Patient booking fails ("Slot unavailable")
- If patient booked first: Admin cannot block (warning: "Slot has appointment")
- **Transaction isolation** prevents conflicts
- Whichever action came first wins (proper locking)

**Validation**:
- Only one action succeeds
- Database state is consistent (no orphaned records)

**Cleanup**: Unblock slot, delete appointment

---

#### ☐ Test PERF-4: High load - 10 simultaneous bookings
**Test ID**: `perf-04-high-load-10-users`

**Setup**:
1. Open 10 browser tabs (or use load testing tool)
2. Each tab navigates to booking page

**Steps**:
1. Prepare 10 different bookings (different dates/times)
2. Submit all 10 within 10-second window
3. Monitor server response times

**Expected Results**:
- **All 10 bookings process successfully** (if no conflicts)
- Server remains responsive (no crashes)
- Average response time < 1 second per booking
- Database handles concurrent writes
- No deadlocks or timeout errors

**Validation**:
```javascript
// Database check:
// SELECT COUNT(*) FROM appointments WHERE created_at > NOW() - INTERVAL '1 minute';
// Should return 10
```

**Cleanup**: Delete 10 test appointments

---

#### ☐ Test PERF-5: Sustained load - 50 bookings over 5 minutes
**Test ID**: `perf-05-sustained-load`

**Note**: This test simulates realistic traffic

**Setup**:
1. Script or manual process to create bookings continuously

**Steps**:
1. Create 50 bookings over 5-minute period (~10 per minute)
2. Mix of different appointment types and dates
3. Monitor system performance throughout

**Expected Results**:
- System handles sustained load gracefully
- No degradation in response time over time
- Memory usage remains stable (no leaks)
- Database connections managed properly
- All 50 bookings complete successfully

**Validation**:
- Check server logs for errors
- Monitor CPU and memory usage
- Database connection pool not exhausted

**Cleanup**: Delete 50 test appointments

---

## Section 2: Race Condition Handling (3 tests)

#### ☐ Test PERF-6: Cancellation race condition
**Test ID**: `perf-06-cancel-race`

**Setup**:
1. Create one appointment with booking token
2. Open 2 tabs with manage appointment page (same token)

**Steps**:
1. **Tab 1**: Click "Cancel Appointment"
2. **Tab 2**: Click "Cancel Appointment" (immediately after)
3. Observe both responses

**Expected Results**:
- **First cancellation succeeds**: "Appointment cancelled"
- **Second cancellation fails**: "Appointment already cancelled" or "Invalid token"
- Database shows only one cancellation event
- No duplicate cancellation records

**Validation**:
```javascript
// Check appointments table:
// Appointment should have status = 'cancelled' (not duplicated)
// Only one cancellation timestamp
```

**Cleanup**: None (appointment already cancelled)

---

#### ☐ Test PERF-7: Reschedule race condition
**Test ID**: `perf-07-reschedule-race`

**Setup**:
1. Create appointment
2. Admin opens reschedule modal

**Steps**:
1. Admin starts rescheduling to Nov 25, 3:00 PM
2. Simultaneously, patient cancels appointment (via booking token)
3. Admin submits reschedule

**Expected Results**:
- Reschedule fails if cancellation happened first
- Error: "Cannot reschedule cancelled appointment"
- Database prevents rescheduling cancelled appointments
- Transaction rollback on conflict

**Validation**:
- Appointment remains cancelled (reschedule didn't override)
- No invalid state in database

**Cleanup**: Delete appointment record

---

#### ☐ Test PERF-8: Availability update race condition
**Test ID**: `perf-08-availability-race`

**Setup**:
1. One available slot: Nov 20, 1:00 PM
2. **User A**: Starts booking that slot
3. **Admin**: Simultaneously blocks that slot

**Steps**:
1. User A selects slot, fills form (slow process)
2. Admin blocks slot while User A is filling form
3. User A submits booking

**Expected Results**:
- **Optimistic locking**: User A's booking fails
- Error: "This slot was just blocked and is no longer available"
- Admin block action succeeds
- Database shows slot as blocked (no appointment created)

**Validation**:
- Slot status = blocked
- No appointment for that slot

**Cleanup**: Unblock slot

---

## Section 3: Core Web Vitals (3 tests)

#### ☐ Test PERF-9: Largest Contentful Paint (LCP)
**Test ID**: `perf-09-lcp`

**Steps**:
1. Open Chrome DevTools → Performance tab
2. Start recording
3. Navigate to `http://localhost:3000/en/appointments/book`
4. Wait for page to fully load
5. Stop recording
6. Find LCP metric

**Expected Results**:
- **LCP < 2.5 seconds** (Good)
- LCP element is typically:
  - Main heading ("Book an Appointment")
  - Hero image (if present)
  - Calendar component
- Fast server response time
- Optimized images

**Validation**:
- Use Lighthouse or Chrome DevTools Performance insights
- Green score (< 2.5s)

**Cleanup**: None

---

#### ☐ Test PERF-10: Interaction to Next Paint (INP)
**Test ID**: `perf-10-inp`

**Steps**:
1. Load booking page
2. Perform interactions:
   - Click appointment type
   - Click calendar date
   - Click time slot
   - Fill form fields
3. Measure time from click to visual update

**Expected Results**:
- **INP < 200 ms** (Good)
- Interactions feel instant
- No janky or delayed responses
- UI updates smoothly

**Validation**:
- Use Chrome DevTools Performance tab
- Measure "Time to Interactive"
- Check for long tasks (> 50ms)

**Cleanup**: None

---

#### ☐ Test PERF-11: Cumulative Layout Shift (CLS)
**Test ID**: `perf-11-cls`

**Steps**:
1. Load booking page
2. Let page fully render (wait 3-5 seconds)
3. Observe if any content shifts/moves unexpectedly

**Expected Results**:
- **CLS < 0.1** (Good)
- No content "jumping" during load
- Images have width/height attributes (reserve space)
- Fonts load without causing layout shift
- No late-loading ads or embeds pushing content

**Validation**:
- Run Lighthouse audit
- Check "Avoid large layout shifts" metric
- CLS score is in green range

**Cleanup**: None

---

## Section 4: Database Performance (1 test)

#### ☐ Test PERF-12: Database query performance
**Test ID**: `perf-12-db-queries`

**Steps**:
1. Enable Supabase query logging
2. Perform complete booking flow
3. Review database query execution times

**Expected Results**:
- **All queries execute in < 100 ms**
- Indexes are used (no full table scans on large tables)
- N+1 query problem avoided (batch queries when possible)
- Connection pooling working efficiently

**Validation**:
```sql
-- Check slow query log
-- Example query should be fast:
SELECT * FROM appointments
WHERE date = '2025-11-20' AND time = '09:00:00';
-- Execution time: ~5-10ms (with index on date/time)
```

**Optimization Checks**:
- Indexes exist on frequently queried columns (date, time, status)
- No SELECT * (only select needed columns)
- Proper use of WHERE clauses

**Cleanup**: None

---

## Test Execution Summary

### Results Tracking

| Test ID | Test Name | Status | Performance Metrics | Issues | Notes |
|---------|-----------|--------|---------------------|--------|-------|
| PERF-1 | Concurrent different slots | ☐ | | | |
| PERF-2 | Race same slot | ☐ | | | |
| PERF-3 | Admin/patient concurrent | ☐ | | | |
| PERF-4 | High load (10 users) | ☐ | Avg response: ___ ms | | |
| PERF-5 | Sustained load (50 bookings) | ☐ | Total time: ___ min | | |
| PERF-6 | Cancel race | ☐ | | | |
| PERF-7 | Reschedule race | ☐ | | | |
| PERF-8 | Availability race | ☐ | | | |
| PERF-9 | LCP | ☐ | LCP: ___ s | | |
| PERF-10 | INP | ☐ | INP: ___ ms | | |
| PERF-11 | CLS | ☐ | CLS: ___ | | |
| PERF-12 | DB queries | ☐ | Query time: ___ ms | | |

**Total**: 0/12 completed

---

## Performance Optimization Tips

### Database Optimization

1. **Add Indexes**:
```sql
CREATE INDEX idx_appointments_date_time ON appointments(date, time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_email ON appointments(email);
```

2. **Use Transactions for Critical Operations**:
```sql
BEGIN;
  SELECT ... FOR UPDATE; -- Lock row
  INSERT INTO appointments ...;
COMMIT;
```

3. **Connection Pooling**:
- Configure Supabase connection pool size
- Limit concurrent connections (e.g., max 10)

### Frontend Optimization

1. **Code Splitting**:
- Load calendar component only when needed
- Split admin and patient code into separate bundles

2. **Image Optimization**:
- Use WebP format
- Lazy load below-fold images
- Proper width/height attributes

3. **Caching**:
- Cache appointment types, availability rules
- Use SWR or React Query for data fetching

### API Optimization

1. **Rate Limiting**:
- Limit booking attempts: 5 per minute per IP
- Prevent abuse and DDoS

2. **Compression**:
- Enable gzip/brotli compression for API responses

3. **CDN for Static Assets**:
- Serve images, CSS, JS from CDN

---

## Load Testing Tools

### Manual Testing
- **Multiple Browser Tabs**: Simple concurrency testing
- **DevTools Network Tab**: Monitor request/response times
- **DevTools Performance Tab**: Measure Core Web Vitals

### Automated Load Testing
- **Artillery**: https://www.artillery.io/
  ```bash
  artillery quick --count 10 --num 50 http://localhost:3000/en/appointments/book
  ```
- **k6**: https://k6.io/
- **Apache JMeter**: For complex load scenarios

### Core Web Vitals Tools
- **Lighthouse** (Chrome DevTools): Comprehensive audit
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/

---

## Common Performance Issues & Fixes

### Issue: Slow page load
**Cause**: Large JavaScript bundle
**Fix**:
```javascript
// Next.js dynamic imports
const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  loading: () => <p>Loading...</p>,
});
```

### Issue: Race condition in bookings
**Cause**: Missing database transaction
**Fix**:
```javascript
// Use Supabase RLS + transactions
const { data, error } = await supabase
  .from('appointments')
  .insert({ ... })
  .select()
  .single();

if (error?.code === '23505') {
  // Unique constraint violation (slot already booked)
  return { error: 'Time slot no longer available' };
}
```

### Issue: High CLS (layout shift)
**Cause**: Images load without dimensions
**Fix**:
```jsx
// Reserve space for images
<Image
  src="/logo.png"
  width={200}
  height={50}
  alt="Bergen Mind & Wellness"
/>
```

### Issue: Slow database queries
**Cause**: Missing indexes
**Fix**:
```sql
-- Add index on frequently filtered columns
CREATE INDEX idx_availability_date ON availability(date);
```

---

## Performance Budget

Set performance budgets to maintain fast experience:

| Metric | Budget | Measurement |
|--------|--------|-------------|
| **Total Page Size** | < 1 MB | Uncompressed |
| **JavaScript Size** | < 300 KB | Compressed |
| **CSS Size** | < 50 KB | Compressed |
| **Image Size** | < 500 KB | Per page, compressed |
| **LCP** | < 2.5s | Google's "Good" threshold |
| **INP** | < 200ms | Google's "Good" threshold |
| **CLS** | < 0.1 | Google's "Good" threshold |
| **Page Load** | < 3s | Fast 3G |

---

## Monitoring Performance in Production

### Real User Monitoring (RUM)
- Track actual user experiences
- Tools: Google Analytics, New Relic, Datadog

### Synthetic Monitoring
- Automated tests from multiple locations
- Tools: Pingdom, Uptime Robot

### Server Metrics
- CPU usage
- Memory consumption
- Database query times
- API response times

---

**Test Suite**: Performance & Load Testing
**Priority**: 7 (System Reliability)
**Test Count**: 12
**Estimated Time**: 45-60 minutes
**Last Updated**: 2025-11-16

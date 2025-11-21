# Priority 5: Mobile Responsiveness

> **64 Cross-Device & Touch Interaction Tests**
> Ensuring optimal experience across 5 mobile devices and 2 tablets

[← Back to Main Checklist](../E2E-MANUAL-TESTING-CHECKLIST.md)

---

## Test Suite Overview

This checklist validates mobile and tablet experiences across:
- **5 Mobile Devices**: iPhone SE, iPhone 12 Pro, iPhone 14 Pro Max, Pixel 5, Galaxy S8+
- **2 Tablets**: iPad (768x1024), iPad Pro 11 (834x1194)
- **Touch Gestures**: Tap, swipe, pinch, long-press
- **Responsive Layouts**: Breakpoints, adaptive design, orientation
- **Mobile Navigation**: Hamburger menus, bottom sheets, modals
- **Form Usability**: Mobile keyboards, input types, validation

---

## Prerequisites

### Environment Setup
- [ ] Dev server running at `http://localhost:3000`
- [ ] Browser with device emulation (Chrome DevTools, Playwright Extension MCP)
- [ ] Ability to resize viewports to specific dimensions

### Device Specifications

| Device | Width | Height | Pixel Ratio | Notes |
|--------|-------|--------|-------------|-------|
| **iPhone SE** | 375px | 667px | 2x | Small screen, common |
| **iPhone 12 Pro** | 390px | 844px | 3x | Standard modern iPhone |
| **iPhone 14 Pro Max** | 430px | 932px | 3x | Large iPhone |
| **Pixel 5** | 393px | 851px | 2.75x | Android reference |
| **Galaxy S8+** | 360px | 740px | 4x | Narrow Android phone |
| **iPad** | 768px | 1024px | 2x | Standard tablet |
| **iPad Pro 11** | 834px | 1194px | 2x | Modern tablet |

---

## Test Cases

## Section 1: Layout & Breakpoints (7 devices × 3 tests = 21 tests)

### Instructions for Each Device Test:
1. Use Playwright Extension MCP `browser_resize` to set viewport
2. Navigate to booking page
3. Take screenshot
4. Verify responsive layout

---

### iPhone SE (375x667)

#### ☐ Test M1-SE: Page layout on iPhone SE
**Test ID**: `mobile-01-iphone-se-layout`

**Steps**:
1. Resize browser: `browser_resize({ width: 375, height: 667 })`
2. Navigate to `http://localhost:3000/en/appointments/book`
3. Take screenshot

**Expected Results**:
- Single column layout
- Content stacks vertically
- No horizontal scroll
- Text is readable (not too small)
- Buttons are touch-sized (minimum 44x44 pixels)

**Validation**:
- Page fits within 375px width
- All elements visible without zooming

**Cleanup**: None

---

#### ☐ Test M2-SE: Navigation menu on iPhone SE
**Test ID**: `mobile-02-iphone-se-nav`

**Steps**:
1. Look for hamburger menu icon (☰)
2. Tap/click to open menu
3. Verify menu drawer/overlay appears

**Expected Results**:
- Mobile navigation is accessible (hamburger icon or bottom nav)
- Menu opens smoothly
- Menu items are large enough to tap (44x44px)
- Menu doesn't obscure critical content

**Validation**:
- Navigation is usable on small screen

**Cleanup**: Close menu

---

#### ☐ Test M3-SE: Form fields on iPhone SE
**Test ID**: `mobile-03-iphone-se-forms`

**Steps**:
1. Scroll to patient information form
2. Tap on name input field
3. Verify keyboard appears correctly

**Expected Results**:
- Input fields span full width (minus padding)
- Mobile keyboard doesn't obscure form
- Input field zooms/scrolls into view when focused
- Input type triggers correct keyboard (email keyboard for email field)

**Validation**:
- Form is usable on small screen

**Cleanup**: None

---

### iPhone 12 Pro (390x844)

#### ☐ Test M4-12P: Page layout on iPhone 12 Pro
**Test ID**: `mobile-04-iphone-12-layout`

**Steps**:
1. Resize: `browser_resize({ width: 390, height: 844 })`
2. Navigate to booking page
3. Take screenshot

**Expected Results**:
- Similar to iPhone SE but slightly more spacious
- Single column layout maintained
- All content visible
- Proper spacing and padding

**Validation**:
- Layout adapts to slightly larger screen

**Cleanup**: None

---

#### ☐ Test M5-12P: Calendar on iPhone 12 Pro
**Test ID**: `mobile-05-iphone-12-calendar`

**Steps**:
1. Scroll to calendar component
2. Verify date grid fits screen

**Expected Results**:
- Calendar spans full width
- All 7 days of week visible
- Date cells are tappable (not too small)
- Month navigation buttons accessible

**Validation**:
- Calendar usable without horizontal scroll

**Cleanup**: None

---

#### ☐ Test M6-12P: Time slots on iPhone 12 Pro
**Test ID**: `mobile-06-iphone-12-timeslots`

**Steps**:
1. Select a date
2. Scroll to time slots
3. Verify slots are displayed properly

**Expected Results**:
- Time slots stack vertically or in 2-column grid
- Each slot is large enough to tap (44x44px minimum)
- Slots are clearly labeled with time
- Scrolling is smooth

**Validation**:
- Time selection is easy on mobile

**Cleanup**: None

---

### iPhone 14 Pro Max (430x932)

#### ☐ Test M7-14PM: Page layout on iPhone 14 Pro Max
**Test ID**: `mobile-07-iphone-14-layout`

**Steps**:
1. Resize: `browser_resize({ width: 430, height: 932 })`
2. Navigate to booking page
3. Take screenshot

**Expected Results**:
- Larger canvas allows for more comfortable spacing
- May transition to 2-column layout for some sections
- Typography scales appropriately
- No wasted space

**Validation**:
- Layout optimized for large phone

**Cleanup**: None

---

#### ☐ Test M8-14PM: Touch targets on iPhone 14 Pro Max
**Test ID**: `mobile-08-iphone-14-touch`

**Steps**:
1. Measure button and link sizes
2. Verify minimum 44x44 pixels

**Expected Results**:
- All interactive elements meet touch target size (WCAG 2.5.5)
- Comfortable spacing between tappable elements
- No accidental taps on adjacent items

**Validation**:
- Touch-friendly interface

**Cleanup**: None

---

#### ☐ Test M9-14PM: Orientation change (portrait ↔ landscape)
**Test ID**: `mobile-09-iphone-14-orientation`

**Steps**:
1. Rotate device to landscape: `browser_resize({ width: 932, height: 430 })`
2. Verify layout adapts
3. Rotate back to portrait

**Expected Results**:
- Layout adapts to landscape orientation
- Content remains accessible
- No broken layouts
- Calendar may show wider grid in landscape

**Validation**:
- Responsive to orientation changes

**Cleanup**: Return to portrait

---

### Pixel 5 (393x851)

#### ☐ Test M10-P5: Page layout on Pixel 5
**Test ID**: `mobile-10-pixel-5-layout`

**Steps**:
1. Resize: `browser_resize({ width: 393, height: 851 })`
2. Navigate to booking page
3. Take screenshot

**Expected Results**:
- Android-optimized layout
- Similar to iPhone but may have different UI elements (e.g., back button)
- Material Design patterns may apply
- All content visible

**Validation**:
- Cross-platform compatibility (iOS vs Android)

**Cleanup**: None

---

#### ☐ Test M11-P5: Android keyboard behavior
**Test ID**: `mobile-11-pixel-5-keyboard`

**Steps**:
1. Tap on email input field
2. Verify Android keyboard appears

**Expected Results**:
- Email keyboard shows @ symbol readily accessible
- Phone field shows numeric keyboard
- Keyboard doesn't obscure submit button
- Viewport adjusts to accommodate keyboard

**Validation**:
- Input types work correctly on Android

**Cleanup**: None

---

#### ☐ Test M12-P5: Scroll behavior on Pixel 5
**Test ID**: `mobile-12-pixel-5-scroll`

**Steps**:
1. Scroll through entire booking page
2. Observe scroll performance and smoothness

**Expected Results**:
- Smooth scrolling (no jank)
- Sticky headers (if present) work correctly
- Scroll position maintains after keyboard appears/disappears
- Over-scroll behavior is native (bounce on iOS, glow on Android)

**Validation**:
- Scrolling feels native and performant

**Cleanup**: None

---

### Galaxy S8+ (360x740)

#### ☐ Test M13-S8: Page layout on Galaxy S8+
**Test ID**: `mobile-13-galaxy-s8-layout`

**Steps**:
1. Resize: `browser_resize({ width: 360, height: 740 })`
2. Navigate to booking page
3. Take screenshot

**Expected Results**:
- Narrowest mobile test (360px is common minimum)
- Content stacks without horizontal scroll
- Text remains readable
- No elements cut off

**Validation**:
- Layout works on narrow devices

**Cleanup**: None

---

#### ☐ Test M14-S8: Typography on narrow screen
**Test ID**: `mobile-14-galaxy-s8-typography`

**Steps**:
1. Examine heading and body text sizes
2. Verify readability

**Expected Results**:
- Font sizes scale down appropriately for 360px width
- Minimum body text: 16px (prevents iOS auto-zoom)
- Headings are proportional
- Line height is comfortable (1.5-1.7)

**Validation**:
- Text is readable without zooming

**Cleanup**: None

---

#### ☐ Test M15-S8: Crisis button on narrow screen
**Test ID**: `mobile-15-galaxy-s8-crisis`

**Steps**:
1. Look at crisis resources button at top of page
2. Verify visibility and accessibility

**Expected Results**:
- Crisis button remains visible and prominent
- Button is full-width or prominent in header
- Text is readable ("Call 988" or similar)
- One-tap access to crisis resources

**Validation**:
- Critical safety feature accessible on all devices

**Cleanup**: None

---

### iPad (768x1024)

#### ☐ Test M16-iPad: Tablet layout
**Test ID**: `mobile-16-ipad-layout`

**Steps**:
1. Resize: `browser_resize({ width: 768, height: 1024 })`
2. Navigate to booking page
3. Take screenshot

**Expected Results**:
- Tablet layout may show 2-column design
- More spacious than mobile
- Calendar may show more dates visible at once
- Form may use wider layout

**Validation**:
- Layout optimized for tablet screen real estate

**Cleanup**: None

---

#### ☐ Test M17-iPad: Touch vs cursor behavior
**Test ID**: `mobile-17-ipad-touch`

**Steps**:
1. Simulate touch interactions
2. Verify hover states work (iPad with cursor support)

**Expected Results**:
- Touch interactions work (tap to select)
- Hover states may appear when using cursor (iPadOS with mouse)
- Buttons respond to touch without hover requirement

**Validation**:
- Hybrid input support (touch + cursor)

**Cleanup**: None

---

#### ☐ Test M18-iPad: Landscape mode
**Test ID**: `mobile-18-ipad-landscape`

**Steps**:
1. Rotate to landscape: `browser_resize({ width: 1024, height: 768 })`
2. Verify layout adapts

**Expected Results**:
- Layout may become multi-column in landscape
- Calendar and form may appear side-by-side
- Efficient use of horizontal space
- No wasted whitespace

**Validation**:
- Landscape orientation provides better UX

**Cleanup**: Return to portrait

---

### iPad Pro 11 (834x1194)

#### ☐ Test M19-iPadPro: Large tablet layout
**Test ID**: `mobile-19-ipad-pro-layout`

**Steps**:
1. Resize: `browser_resize({ width: 834, height: 1194 })`
2. Navigate to booking page
3. Take screenshot

**Expected Results**:
- Closest to desktop experience
- May show full multi-column layout
- Large touch targets but optimized for efficiency
- All features easily accessible

**Validation**:
- Premium tablet experience

**Cleanup**: None

---

#### ☐ Test M20-iPadPro: Admin dashboard on tablet
**Test ID**: `mobile-20-ipad-pro-admin`

**Steps**:
1. Login as admin
2. Navigate to dashboard
3. Verify admin interface on tablet

**Expected Results**:
- Admin table shows multiple columns
- Filters and search bar visible without scrolling
- Appointment list readable
- Actions (reschedule, cancel) easily accessible

**Validation**:
- Admin workflows feasible on tablet

**Cleanup**: Logout

---

#### ☐ Test M21-iPadPro: Split-screen multitasking (optional)
**Test ID**: `mobile-21-ipad-pro-splitscreen`

**Note**: Requires iPadOS multitasking simulation

**Steps**:
1. Simulate split view: Resize to half-width (~417px)
2. Verify app still usable

**Expected Results**:
- App adapts to narrow split-screen width
- Reverts to mobile-style layout
- Remains functional in constrained space

**Validation**:
- Graceful degradation in multitasking

**Cleanup**: None

---

## Section 2: Touch Gestures & Interactions (7 tests)

#### ☐ Test M22: Tap to select appointment type
**Test ID**: `mobile-22-tap-select`

**Steps**:
1. On mobile viewport (any device)
2. Tap appointment type button/radio
3. Verify selection

**Expected Results**:
- Single tap selects (no double-tap required)
- Visual feedback on tap (highlight, ripple effect)
- Selection state clear

**Validation**:
- Touch interaction is immediate

**Cleanup**: None

---

#### ☐ Test M23: Swipe to navigate calendar months
**Test ID**: `mobile-23-swipe-calendar`

**Note**: Feature may not be implemented

**Steps**:
1. On calendar, attempt swipe gesture left/right
2. Check if month changes

**Expected Results**:
- **If implemented**: Swipe left = next month, swipe right = previous month
- **If not implemented**: Use arrow buttons (still functional)

**Validation**:
- Natural mobile interaction pattern

**Cleanup**: None

---

#### ☐ Test M24: Long-press for additional options
**Test ID**: `mobile-24-long-press`

**Note**: Contextual menus

**Steps**:
1. Long-press on a date or time slot
2. Check for context menu

**Expected Results**:
- Long-press may show additional info (e.g., availability details)
- Or: Long-press has no effect (tap is only interaction)
- No unintended text selection

**Validation**:
- Long-press doesn't break UX

**Cleanup**: None

---

#### ☐ Test M25: Pinch-to-zoom disabled on form
**Test ID**: `mobile-25-pinch-zoom`

**Steps**:
1. Attempt pinch gesture on booking form
2. Verify page doesn't zoom

**Expected Results**:
- Form fields have `minimum-scale=1.0` in viewport meta tag
- OR: Pinch-zoom is allowed (user preference)
- If zoom disabled, font sizes must be at least 16px (accessibility)

**Validation**:
```html
<!-- Check HTML head -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
```

**Cleanup**: None

---

#### ☐ Test M26: Pull-to-refresh behavior
**Test ID**: `mobile-26-pull-refresh`

**Steps**:
1. Scroll to top of page
2. Pull down (over-scroll)
3. Observe behavior

**Expected Results**:
- Page refreshes (native browser behavior) OR
- Pull-to-refresh is disabled (for SPAs)
- No broken layout from over-scroll

**Validation**:
- Predictable refresh behavior

**Cleanup**: None

---

#### ☐ Test M27: Touch delay and responsiveness
**Test ID**: `mobile-27-touch-delay`

**Steps**:
1. Rapidly tap several buttons
2. Measure response time (visual feedback)

**Expected Results**:
- Buttons respond immediately (< 100ms)
- No 300ms click delay (modern mobile optimization)
- Visual feedback confirms interaction

**Validation**:
- Fast, responsive touch interactions

**Cleanup**: None

---

#### ☐ Test M28: Accidental touch prevention
**Test ID**: `mobile-28-accidental-touch`

**Steps**:
1. Try to tap between two close buttons
2. Verify correct button activates

**Expected Results**:
- Adequate spacing between touch targets (8px minimum)
- Tap registers on intended element
- No frustration from mis-taps

**Validation**:
- Touch targets are well-spaced

**Cleanup**: None

---

## Section 3: Mobile Navigation & Modals (8 tests)

#### ☐ Test M29: Hamburger menu icon visible
**Test ID**: `mobile-29-hamburger-icon`

**Steps**:
1. On mobile viewport, look at header
2. Find navigation menu icon

**Expected Results**:
- Hamburger icon (☰) visible in header
- Icon is large enough to tap (44x44px)
- Icon positioned consistently (usually top-left or top-right)

**Validation**:
- Primary navigation accessible on mobile

**Cleanup**: None

---

#### ☐ Test M30: Mobile menu opens and closes
**Test ID**: `mobile-30-mobile-menu-toggle`

**Steps**:
1. Tap hamburger icon
2. Verify menu drawer/overlay appears
3. Tap close button or backdrop
4. Verify menu closes

**Expected Results**:
- Menu slides in from side or expands from top
- Smooth animation (< 300ms)
- Backdrop dims rest of page
- Close button or tap-outside closes menu

**Validation**:
- Mobile navigation is intuitive

**Cleanup**: None

---

#### ☐ Test M31: Mobile menu items are tappable
**Test ID**: `mobile-31-menu-items-tap`

**Steps**:
1. Open mobile menu
2. Tap on a menu link (e.g., "About", "Contact")

**Expected Results**:
- Link navigates to destination
- Menu closes after selection (or stays open, depending on design)
- Active page indicator shows current location

**Validation**:
- Menu functionality matches desktop

**Cleanup**: None

---

#### ☐ Test M32: Bottom sheet modal on mobile
**Test ID**: `mobile-32-bottom-sheet`

**Note**: Some modals may use bottom sheet pattern on mobile

**Steps**:
1. Trigger a modal (e.g., time slot details)
2. Observe presentation

**Expected Results**:
- Modal appears from bottom of screen (mobile pattern)
- Or: Full-screen modal on mobile
- Close button or swipe-down gesture to dismiss
- Content is scrollable if long

**Validation**:
- Mobile-optimized modal patterns

**Cleanup**: Close modal

---

#### ☐ Test M33: Full-screen modal on mobile
**Test ID**: `mobile-33-fullscreen-modal`

**Steps**:
1. Open confirmation dialog or form
2. Verify modal presentation

**Expected Results**:
- Modal takes full screen or most of viewport
- Header with title and close button
- Scrollable content area
- Action buttons at bottom (sticky footer)

**Validation**:
- Modals are mobile-friendly

**Cleanup**: Close modal

---

#### ☐ Test M34: Modal backdrop prevents scroll
**Test ID**: `mobile-34-modal-scroll-lock`

**Steps**:
1. Open modal on mobile
2. Try to scroll background page

**Expected Results**:
- Background page is scroll-locked (cannot scroll)
- Prevents disorientation
- Modal content is scrollable
- Body scroll restored when modal closes

**Validation**:
- Good modal UX on mobile

**Cleanup**: None

---

#### ☐ Test M35: Fixed header on scroll
**Test ID**: `mobile-35-fixed-header`

**Steps**:
1. Scroll down booking page
2. Observe header behavior

**Expected Results**:
- Option 1: Header remains fixed at top (sticky)
- Option 2: Header scrolls away to save space (mobile optimization)
- If fixed, header doesn't obscure content

**Validation**:
- Header behavior is intentional

**Cleanup**: Scroll to top

---

#### ☐ Test M36: Back button navigation
**Test ID**: `mobile-36-back-button`

**Steps**:
1. Navigate to confirmation page
2. Tap browser back button (or swipe back on iOS)

**Expected Results**:
- Navigates to previous page correctly
- State is preserved (or handled gracefully)
- Browser history works as expected

**Validation**:
- Mobile browser navigation works

**Cleanup**: None

---

## Section 4: Forms & Input on Mobile (10 tests)

#### ☐ Test M37: Email field triggers email keyboard
**Test ID**: `mobile-37-email-keyboard`

**Steps**:
1. Tap email input field
2. Observe mobile keyboard

**Expected Results**:
- Email keyboard appears with @ and . symbols
- Input has `type="email"`
- Easy to enter email address without switching keyboard

**Validation**:
```html
<input type="email" name="email" />
```

**Cleanup**: None

---

#### ☐ Test M38: Phone field triggers numeric keyboard
**Test ID**: `mobile-38-phone-keyboard`

**Steps**:
1. Tap phone input field
2. Observe keyboard

**Expected Results**:
- Numeric keyboard appears
- Input has `type="tel"`
- Easy to enter phone number

**Validation**:
```html
<input type="tel" name="phone" />
```

**Cleanup**: None

---

#### ☐ Test M39: Text field prevents auto-zoom
**Test ID**: `mobile-39-no-auto-zoom`

**Steps**:
1. Tap on name input field (type="text")
2. Check if page zooms in

**Expected Results**:
- Page does NOT zoom when tapping input (iOS behavior)
- Achieved by using font-size >= 16px
- Or: Allow zoom but reset after input blur

**Validation**:
```css
input {
  font-size: 16px; /* Prevents iOS auto-zoom */
}
```

**Cleanup**: None

---

#### ☐ Test M40: Form labels remain visible when keyboard appears
**Test ID**: `mobile-40-labels-visible`

**Steps**:
1. Tap on last input field (e.g., "Reason for visit")
2. Verify label is still visible above keyboard

**Expected Results**:
- Input scrolls into view with label
- Label doesn't get hidden behind keyboard
- User knows what field they're filling

**Validation**:
- Good form UX on mobile

**Cleanup**: None

---

#### ☐ Test M41: Submit button accessible with keyboard open
**Test ID**: `mobile-41-submit-with-keyboard`

**Steps**:
1. Fill form fields, keyboard is open
2. Try to reach submit button

**Expected Results**:
- Submit button is visible above keyboard OR
- Can scroll to submit button OR
- Keyboard has "Done" button that closes keyboard

**Validation**:
- Can complete form without dismissing keyboard manually

**Cleanup**: None

---

#### ☐ Test M42: Validation errors visible on mobile
**Test ID**: `mobile-42-validation-mobile`

**Steps**:
1. Submit form with invalid data
2. Observe error messages

**Expected Results**:
- Error messages appear clearly
- Errors are not hidden behind keyboard
- First error field scrolls into view automatically
- Errors are readable on small screens

**Validation**:
- Mobile-friendly error display

**Cleanup**: None

---

#### ☐ Test M43: Date picker on mobile
**Test ID**: `mobile-43-datepicker-mobile`

**Steps**:
1. Interact with calendar date picker on mobile
2. Select a date

**Expected Results**:
- Custom calendar is touch-friendly OR
- Native mobile date picker is used (`<input type="date">`)
- Easy to select date on touchscreen

**Validation**:
- Date selection is mobile-optimized

**Cleanup**: None

---

#### ☐ Test M44: Autocomplete suggestions visible
**Test ID**: `mobile-44-autocomplete`

**Steps**:
1. If autocomplete is enabled, start typing in name field
2. Observe suggestions

**Expected Results**:
- Autocomplete dropdown appears above keyboard
- Suggestions are tappable
- Dropdown doesn't obscure input field

**Validation**:
- Autocomplete works on mobile

**Cleanup**: None

---

#### ☐ Test M45: Select dropdown on mobile
**Test ID**: `mobile-45-select-dropdown`

**Steps**:
1. If form has select dropdown (e.g., appointment type as select)
2. Tap dropdown

**Expected Results**:
- Native mobile picker appears (iOS wheel, Android dialog)
- Or: Custom dropdown is touch-friendly
- Options are readable and tappable

**Validation**:
- Dropdowns work natively on mobile

**Cleanup**: None

---

#### ☐ Test M46: Textarea expandable on mobile
**Test ID**: `mobile-46-textarea-mobile`

**Steps**:
1. Tap "Reason for visit" textarea
2. Type long text

**Expected Results**:
- Textarea expands vertically as user types
- Or: Fixed height with internal scroll
- Entire text is visible and editable
- No cut-off content

**Validation**:
- Textarea is mobile-friendly

**Cleanup**: None

---

## Section 5: Performance on Mobile Devices (8 tests)

#### ☐ Test M47: Page load time on 3G
**Test ID**: `mobile-47-3g-load`

**Note**: Simulate slow network in DevTools

**Steps**:
1. Enable network throttling: 3G (slow)
2. Reload booking page
3. Measure load time

**Expected Results**:
- Page loads within 5-10 seconds on 3G
- Critical content appears first (progressive rendering)
- Loading indicators show progress

**Validation**:
- Acceptable performance on slow networks

**Cleanup**: Disable throttling

---

#### ☐ Test M48: Scroll performance (60 FPS)
**Test ID**: `mobile-48-scroll-fps`

**Steps**:
1. Scroll rapidly through page
2. Observe smoothness

**Expected Results**:
- Scrolling is smooth (feels like 60 FPS)
- No jank or stuttering
- Optimized rendering (no heavy animations during scroll)

**Validation**:
- Use browser Performance monitor

**Cleanup**: None

---

#### ☐ Test M49: Image loading optimization
**Test ID**: `mobile-49-image-loading`

**Steps**:
1. Observe images on page (logos, icons, photos)
2. Check load behavior

**Expected Results**:
- Images use appropriate formats (WebP, AVIF)
- Images are sized correctly for mobile (not loading 4K images for 375px screen)
- Lazy loading for below-fold images
- Placeholders while loading

**Validation**:
- Efficient image delivery

**Cleanup**: None

---

#### ☐ Test M50: JavaScript bundle size
**Test ID**: `mobile-50-bundle-size`

**Steps**:
1. Open DevTools Network tab
2. Filter by JS files
3. Check total JavaScript downloaded

**Expected Results**:
- Total JS < 500KB (compressed)
- Code splitting used (not one giant bundle)
- Minimal third-party scripts

**Validation**:
- Lightweight JavaScript for mobile

**Cleanup**: None

---

#### ☐ Test M51: Font loading performance
**Test ID**: `mobile-51-font-loading`

**Steps**:
1. Observe text rendering on page load
2. Check for FOUT (Flash of Unstyled Text)

**Expected Results**:
- Fonts load quickly
- Fallback fonts are similar (no layout shift)
- `font-display: swap` or `optional` used

**Validation**:
- Good typography loading strategy

**Cleanup**: None

---

#### ☐ Test M52: Battery usage (subjective)
**Test ID**: `mobile-52-battery`

**Note**: Observational test

**Steps**:
1. Use site on actual mobile device for 5-10 minutes
2. Monitor battery drain

**Expected Results**:
- No excessive battery drain
- No hot device (CPU not pegged)
- Efficient rendering

**Validation**:
- App doesn't kill battery

**Cleanup**: None

---

#### ☐ Test M53: Memory usage on mobile
**Test ID**: `mobile-53-memory`

**Steps**:
1. Use browser Performance monitor
2. Track memory usage during session

**Expected Results**:
- Memory usage is reasonable (< 50MB)
- No memory leaks (usage doesn't grow indefinitely)
- Smooth experience on memory-constrained devices

**Validation**:
- Memory-efficient application

**Cleanup**: None

---

#### ☐ Test M54: Offline behavior (PWA)
**Test ID**: `mobile-54-offline`

**Note**: If PWA is implemented

**Steps**:
1. Load booking page
2. Disconnect network
3. Try to navigate

**Expected Results**:
- Offline page appears OR
- Cached content is available
- User is informed of offline state
- Graceful degradation

**Validation**:
- Offline experience is thoughtful

**Cleanup**: Reconnect network

---

## Section 6: Cross-Browser Mobile Testing (3 tests)

#### ☐ Test M55: Safari iOS compatibility
**Test ID**: `mobile-55-safari-ios`

**Steps**:
1. Test on Safari browser (or Safari-like emulation)
2. Verify all features work

**Expected Results**:
- CSS Grid/Flexbox work correctly
- Date picker works
- Form validation works
- No iOS-specific bugs (e.g., 100vh issue)

**Validation**:
- Safari is primary mobile browser

**Cleanup**: None

---

#### ☐ Test M56: Chrome Android compatibility
**Test ID**: `mobile-56-chrome-android`

**Steps**:
1. Test on Chrome Android (or emulation)
2. Verify features

**Expected Results**:
- All features work as on desktop Chrome
- Material Design patterns feel native
- No Android-specific issues

**Validation**:
- Cross-platform consistency

**Cleanup**: None

---

#### ☐ Test M57: Samsung Internet compatibility
**Test ID**: `mobile-57-samsung-internet`

**Note**: Popular on Samsung devices

**Steps**:
1. If possible, test on Samsung Internet browser
2. Verify booking flow works

**Expected Results**:
- All features functional
- No rendering bugs
- Similar experience to Chrome Android

**Validation**:
- Support for Samsung browser

**Cleanup**: None

---

## Section 7: Accessibility on Mobile (7 tests)

#### ☐ Test M58: Screen reader on mobile (VoiceOver)
**Test ID**: `mobile-58-voiceover`

**Note**: Requires actual iOS device or simulator

**Steps**:
1. Enable VoiceOver on iPhone
2. Navigate booking flow
3. Verify announcements

**Expected Results**:
- All elements are announced correctly
- Touch-to-explore works
- Swipe navigation works
- Form labels are read

**Validation**:
- Mobile screen reader support

**Cleanup**: Disable VoiceOver

---

#### ☐ Test M59: Screen reader on mobile (TalkBack)
**Test ID**: `mobile-59-talkback`

**Note**: Requires Android device or emulator

**Steps**:
1. Enable TalkBack on Android
2. Navigate booking flow

**Expected Results**:
- Similar to VoiceOver experience
- All content is accessible
- Swipe gestures work

**Validation**:
- Android accessibility

**Cleanup**: Disable TalkBack

---

#### ☐ Test M60: Touch target size on mobile
**Test ID**: `mobile-60-touch-targets`

**Steps**:
1. Measure interactive elements
2. Verify minimum 44x44 pixels (Apple HIG)
3. Or: 48x48 pixels (Material Design)

**Expected Results**:
- All buttons meet minimum size
- Adequate spacing between targets
- No frustration from small tap targets

**Validation**:
- WCAG 2.5.5 Level AAA (recommended)

**Cleanup**: None

---

#### ☐ Test M61: Zoom capability on mobile
**Test ID**: `mobile-61-zoom`

**Steps**:
1. Attempt pinch-to-zoom
2. Verify page allows zoom up to 200%

**Expected Results**:
- Zoom is allowed (unless font size is already large enough)
- `maximum-scale` in viewport meta tag is >= 2.0 or not set
- Text reflows when zoomed (no horizontal scroll)

**Validation**:
- WCAG 1.4.4 compliance

**Cleanup**: Reset zoom

---

#### ☐ Test M62: Color contrast on mobile screens
**Test ID**: `mobile-62-contrast-mobile`

**Steps**:
1. View page on actual mobile device in sunlight (or simulate)
2. Verify text is still readable

**Expected Results**:
- High contrast text remains readable outdoors
- 4.5:1 minimum contrast ratio
- Avoid very light grays on white

**Validation**:
- Real-world readability

**Cleanup**: None

---

#### ☐ Test M63: Motion sensitivity on mobile
**Test ID**: `mobile-63-motion-mobile`

**Steps**:
1. Enable "Reduce Motion" in device settings
2. Load booking page
3. Verify animations are reduced

**Expected Results**:
- Respects `prefers-reduced-motion: reduce`
- Animations either removed or simplified
- Transitions use fade instead of slide

**Validation**:
- Accessibility for vestibular disorders

**Cleanup**: Disable Reduce Motion

---

#### ☐ Test M64: Landscape mode accessibility
**Test ID**: `mobile-64-landscape-a11y`

**Steps**:
1. Rotate device to landscape
2. Verify keyboard navigation still works
3. Verify screen reader still functions

**Expected Results**:
- All accessibility features work in landscape
- Tab order remains logical
- Content is accessible

**Validation**:
- Orientation doesn't break accessibility

**Cleanup**: Return to portrait

---

## Test Execution Summary

### Results Tracking

| Device/Category | Tests | Completed | Issues | Notes |
|-----------------|-------|-----------|--------|-------|
| iPhone SE | 3 | ✅ 3/3 | 0 | Single column, hamburger menu, forms work |
| iPhone 12 Pro | 3 | ✅ 3/3 | 0 | Calendar and time slots responsive |
| iPhone 14 Pro Max | 3 | ✅ 3/3 | 0 | Touch targets adequate |
| Pixel 5 | 3 | ✅ 3/3 | 0 | Cross-platform compatible |
| Galaxy S8+ | 3 | ✅ 3/3 | 0 | 360px narrow layout works |
| iPad | 3 | ✅ 3/3 | 0 | Hamburger at 768px, desktop at 1024px |
| iPad Pro 11 | 3 | ✅ 3/3 | 0 | Premium tablet experience |
| Touch Gestures | 7 | ✅ 7/7 | 0 | Tap selection, calendar nav work |
| Navigation/Modals | 8 | ✅ 8/8 | 0 | Hamburger menu, modals work |
| Forms/Input | 10 | ✅ 10/10 | 0 | All form inputs functional |
| Performance | 8 | ⏳ | - | Not formally tested (DevTools needed) |
| Cross-Browser | 3 | ⏳ | - | Requires real devices |
| Mobile A11y | 7 | ⏳ | - | Requires VoiceOver/TalkBack |
| **TOTAL** | **64** | **46/64** | **0** | Core mobile tests PASS |

### Test Date: 2025-11-20

### Key Findings

**Responsive Breakpoints:**
- Mobile layout (< 1024px): Hamburger menu, single column
- Desktop layout (≥ 1024px): Full navigation bar
- Tailwind `lg:` breakpoint correctly controls navigation display

**Touch Interactions:**
- Appointment type dropdown opens/closes with single tap
- Calendar month navigation via arrow buttons works
- Date and time slot selection responds immediately
- Form inputs are touch-friendly

**Mobile Navigation:**
- Hamburger icon visible at < 1024px width
- Mobile menu opens as dialog with role="dialog"
- All 8 nav links visible and functional in mobile menu
- Menu auto-closes after navigation

**Form Functionality:**
- Patient information form fills correctly on mobile
- Validation errors display inline
- Form submission creates booking successfully
- Confirmation modal displays full appointment details

**Modals:**
- Crisis resources modal works on mobile
- Booking confirmation modal displays correctly
- Close buttons functional
- Modal scroll behavior correct

---

## Common Issues & Fixes

### Issue: Horizontal scroll on mobile
**Cause**: Elements wider than viewport
**Fix**:
```css
body {
  overflow-x: hidden;
}
* {
  max-width: 100%;
}
```

### Issue: Text too small on mobile
**Cause**: Font size < 16px triggers iOS auto-zoom
**Fix**:
```css
input, select, textarea {
  font-size: 16px; /* Minimum */
}
```

### Issue: 100vh on mobile includes address bar
**Cause**: iOS Safari calculates 100vh including UI chrome
**Fix**:
```css
.full-height {
  height: 100dvh; /* Dynamic viewport height */
  /* Fallback */
  height: 100vh;
}
```

### Issue: Touch targets too small
**Cause**: Buttons < 44x44 pixels
**Fix**:
```css
button, a {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

---

**Test Suite**: Mobile Responsiveness
**Priority**: 5 (Mobile-First Design)
**Test Count**: 64
**Estimated Time**: 120-150 minutes
**Last Updated**: 2025-11-20
**Test Status**: 46/64 PASSED (Core mobile functionality verified)

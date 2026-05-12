# Phase: Scroll Bug Fixes

## Goal
Fix content clipping on small screens + Commission scroll trap while keeping scroll-snap working. Hide scrollbar across all platforms.

## Changes

### 1. Scroll container (`src/routes/+page.svelte` — main element)
- Keep `scroll-snap-type: y proximity` (was mandatory)
- Keep `overflow-y-auto` (needed for scrolling)
- Keep `scrollbar-width: none` + `-ms-overflow-style: none`
- ADD `&::-webkit-scrollbar { display: none }` for Chrome/Safari
- Keep `touch-action: pan-y`

### 2. All 3 sections (`src/routes/+page.svelte`)
- `h-[100dvh]` → `min-h-[100dvh]` so they grow on small screens
- Remove `scroll-snap-stop: always` (conflicts with proximity + variable heights)
- Remove redundant `touch-action: pan-y` from child sections

### 3. CommissionInfo wrapper (`src/lib/components/CommissionInfo.svelte`)
- Remove `overflow-y-auto` — let parent scroll-snap handle all scrolling
- Content flows naturally; if it exceeds viewport, parent scroll handles it

### 4. IntersectionObserver (`src/routes/+page.svelte` — onMount)
- Change threshold from `[0.4, 0.6]` to use `rootMargin: '-30% 0px -30% 0px'` with single threshold `0`
- Reason: ratio thresholds break when sections have different heights. `rootMargin` offsets the observer bounds to trigger earlier/later

## Test Cases

### TC-1: Small screen content visible
- **Given:** Mobile viewport (iPhone SE ~667px)
- **When:** Navigate to Commission Info page
- **Then:** All 7 sections fully reachable via scroll
- **Verify:** No overflow-y-auto on CommissionInfo wrapper

### TC-2: Scroll to About Me works
- **Given:** User on CommissionInfo page with tall content
- **When:** User scrolls past commission content
- **Then:** About Me page appears and snaps into view
- **Verify:** scrollContainer scrollTop reaches About Me section

### TC-3: Desktop scroll snap preserved
- **Given:** Desktop viewport (>= 1024px)
- **When:** User scrolls between pages
- **Then:** Each page snaps to top as expected
- **Verify:** scroll-snap-align: start on all sections

### TC-4: Scrollbar hidden
- **Given:** Any platform/screensize
- **When:** Page renders
- **Then:** No visible scrollbar on any browser
- **Verify:** scrollbar-width: none, -ms-overflow-style: none, ::-webkit-scrollbar: none

### TC-5: Nav tabs track current page
- **Given:** After scrolling to any section
- **Then:** Corresponding nav tab shows active state
- **Verify:** currentPage updates correctly via IntersectionObserver

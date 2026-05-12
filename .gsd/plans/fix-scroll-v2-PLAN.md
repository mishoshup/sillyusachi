# Phase: Scroll Architecture — Hybrid CSS+JS

## Approach
Detection-based staggered scroll-snap. Each section dynamically receives the right snap behavior based on whether its content fits the viewport.

## Architecture
```
src/lib/scroll.js          ← Scroll orchestration logic (clean separation)
src/routes/+page.svelte    ← Remains lean — imports + template only
src/lib/components/        ← No changes to components
```

## Task 1: Create scroll utility

**File:** `src/lib/scroll.js` (new)

**Purpose:** All scroll detection + sentinel logic lives here. Components stay clean.

### Module exports:
```js
export function setupScrollSnap(container, onPageChange) { ... }
```

### What it does:

**1. Height detection (on mount + resize):**
- Query all `[data-page]` sections
- Measure `scrollHeight` vs `container.clientHeight`
- If `scrollHeight <= clientHeight` → class `snap-fit` (h-[100dvh])
- If `scrollHeight > clientHeight` → class `snap-tall` (min-h + top-aligned)

**2. Sentinel injection:**
- For `.snap-tall` sections only:
  - Insert `<div class="snap-sentinel" style="height: 1px; pointer-events: none; scroll-snap-align: end;"></div>` at bottom
  - When user reaches bottom of tall section → sentinel triggers snap → next section starts
- Clean up sentinels on resize

**3. IntersectionObserver for page tracking:**
- `rootMargin: '-30% 0px -30% 0px'` with `threshold: 0`
- On intersection → call `onPageChange(index)`

**4. Cleanup:**
- Disconnect observer
- Remove sentinels
- Return cleanup function

### Styling injected:
```css
[data-page].snap-fit { height: 100dvh; scroll-snap-align: start; }
[data-page].snap-tall { min-height: 100dvh; scroll-snap-align: start; }
.snap-sentinel { scroll-snap-align: end; height: 1px; pointer-events: none; }
```

Scroll container gets `scroll-snap-type: y proximity` and `overflow-y-auto`.

## Task 2: Update +page.svelte

**File:** `src/routes/+page.svelte`

**Actions:**
1. Add import: `import { setupScrollSnap } from '$lib/scroll.js'`
2. Simplify onMount to call `setupScrollSnap(scrollContainer, (page) => { currentPage = page; })`
3. Remove old IntersectionObserver, pageEls, threshold code
4. Keep scrollToPage using `el.scrollIntoView({ behavior: 'smooth' })`
5. Keep music player, nav toggle — unchanged
6. Sections: keep data-page attrs, remove manual height/snap classes (JS handles it)

## Test Cases

### TC-1: Fit sections fill viewport
- Portfolio → `snap-fit` class + `height: 100dvh`

### TC-2: Tall sections grow, top-aligned
- CommissionInfo on mobile → `snap-tall` class, no justify-center

### TC-3: Sentinel at bottom of tall sections
- `.snap-tall` last child is `div.snap-sentinel`

### TC-4: Can reach About Me
- From Commissions on mobile → scroll past → About Me snaps in

### TC-5: Nav tabs track
- currentPage updates via observer callback

### TC-6: Build passes
- `npm run build` → exit 0

### TC-7: Clean separation
- No observer/scroll-snap CSS in `+page.svelte`

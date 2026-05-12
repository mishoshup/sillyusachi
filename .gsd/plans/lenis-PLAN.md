# Phase: Lenis Scroll Snap — Enterprise Solution

## Goal
Replace CSS scroll-snap with Lenis + Lenis/snap for proper mixed-height section support with friction.

## Architecture
```
src/lib/scroll-snap.js     ← New: Lenis + Snap initialization
src/routes/+page.svelte    ← Modified: use Lenis instead of native scroll
src/lib/scroll.js          ← Removed (replaced by scroll-snap.js)
```

## Task 1: Add Lenis dependency

```bash
cd /home/miso/.openclaw/workspace/dulang-repo-tempatan
npm install lenis
```

## Task 2: Create scroll-snap.js

**File:** `src/lib/scroll-snap.js` (new)

```javascript
import Lenis from 'lenis';
import Snap from 'lenis/snap';
import 'lenis/dist/lenis.css';

/**
 * Sets up Lenis smooth scroll with snap for mixed-height sections.
 * @param {HTMLElement} wrapper - the scroll wrapper (was <main>)
 * @param {(page: number) => void} onPageChange - callback for nav tracking
 * @returns {() => void} cleanup function
 */
export function setupLenis(wrapper, onPageChange) {
  const sections = Array.from(wrapper.querySelectorAll('[data-page]'));

  // 1. Init Lenis
  const lenis = new Lenis({
    wrapper,
    content: wrapper,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    syncTouch: true,
  });

  // 2. Init Snap
  const snap = new Snap(lenis, {
    type: 'lock',
    distanceThreshold: '40%',
    debounce: 500,
    lerp: 0.08,
    duration: 0.8,
  });

  // 3. Add sections as snap points
  //    Align: ['start', 'end'] = snap to top when scrolling forward,
  //    snap to bottom when scrolling backward past the section
  sections.forEach((section) => {
    snap.addElement(section, {
      align: ['start', 'end'],
    });
  });

  // 4. Snap types per section:
  //    - Short sections (< 100dvh): only top snap matters
  //    - Tall sections (> 100dvh): top snap + end-of-content snap
  //    Both use ['start', 'end'] but tall sections benefit from end snap

  // 5. Nav tracking via onSnapComplete
  snap.onSnapComplete = ({ target }) => {
    const pageEl = target?.closest?.('[data-page]') || target;
    const idx = sections.indexOf(pageEl);
    if (idx >= 0) onPageChange(idx);
  };

  // 6. RAF loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 7. Programmatic scroll for nav buttons
  const scrollToPage = (index) => {
    // Each section has 2 snap points (start + end)
    // goTo(0) = first section start, goTo(1) = first section end, etc.
    snap.goTo(index * 2);
  };

  // 8. Resize handler
  const onResize = () => snap.resize();
  window.addEventListener('resize', onResize);

  // Cleanup
  return () => {
    window.removeEventListener('resize', onResize);
    snap.destroy();
    lenis.destroy();
  };
}
```

## Task 3: Update +page.svelte

**File:** `src/routes/+page.svelte`

**Changes:**

1. **Import:** Replace `import { setupScrollSnap } from '$lib/scroll.js'` with:
```javascript
import { setupLenis } from '$lib/scroll-snap.js';
```

2. **onMount:** Replace setupScrollSnap call with:
```javascript
onMount(() => {
  if (!scrollContainer) return;
  if (audio) audio.volume = volume;
  scrollCleanup = setupLenis(scrollContainer, (page) => { currentPage = page; });
  return () => scrollCleanup?.();
});
```

3. **scrollToPage:** Update to use Lenis:
```javascript
function scrollToPage(index: number) {
  if (!scrollContainer) return;
  // Lenis.scrollTo handles smooth scroll natively
  // But we want snap to handle it, so use scrollIntoView fallback
  const el = scrollContainer.querySelector(`[data-page="${index}"]`) as HTMLElement | null;
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
```

4. **<main> element:** Change from:
```html
<main bind:this={scrollContainer} class="h-[100dvh] w-full overflow-y-auto"
  style="scrollbar-width: none; -ms-overflow-style: none; touch-action: pan-y;">
```
To (Lenis manages overflow):
```html
<main bind:this={scrollContainer} class="h-[100dvh] w-full"
  style="touch-action: pan-y;">
```

5. **Sections:** Keep as-is (already have `min-h-[100dvh]`, snap classes now irrelevant)

6. **Remove:** scroll.js import and setupScrollSnap reference

7. **Remove from <style>:** The injected styles for snap-fit/snap-tall can be removed since Lenis handles snapping now. But keep `main::-webkit-scrollbar { display: none }` for scrollbar hiding.

## Task 4: Remove old scroll.js

Delete `src/lib/scroll.js` (no longer needed).

## Test Cases

### TC-1: Short sections snap fullscreen
- Portfolio (~600px content, 900px viewport) → behaves like full page snap

### TC-2: Tall sections: snap top → scroll → friction → snap next
- CommissionInfo on mobile (900px content, 667px viewport) → snaps to top, scroll through, friction at bottom, snaps to About Me

### TC-3: Nav sidebar tracks current page
- onSnapComplete fires with correct section index

### TC-4: Nav button clicks scroll to section
- Clicking "Commissions" tab scrolls smoothly to commission section

### TC-5: Build passes
- `npm run build` → exit 0

# Council Review — Lenis Implementation

## Criterion-by-Criterion Analysis

### 1. ✅ Lenis API Usage Matches Context7 Docs
**Verdict: CHANGES_REQUESTED** — minor issue with `onSnapComplete`

The core API usage is correct:
- `type: 'lock'` — Valid option (`'proximity'`, `'mandatory'`, `'lock'` are supported)
- `align: ['start', 'end']` — Valid; docs show array of alignment points for `addElement`
- `distanceThreshold: '40%'`, `debounce: 500`, `lerp: 0.08`, `duration: 0.8` — All valid
- `snap.goTo(index)`, `snap.resize()`, `snap.destroy()`, `lenis.destroy()` — Valid methods

**Issue found:** `onSnapComplete` callback signature mismatch.

The plan assigns:
```javascript
snap.onSnapComplete = ({ target }) => { ... }
```

But the Context7 Lenis Snap docs specify the callback receives `({ index, value })` — no `target` DOM element is available. The plan tries to access `target?.closest?.('[data-page]')` which will always be `undefined`, breaking nav tracking entirely.

**Fix:** Use the `index` parameter instead. Since each section has 2 snap points (start + end at positions `index * 2` and `index * 2 + 1`), page index = `Math.floor(index / 2)`:

```javascript
snap.onSnapComplete = ({ index }) => {
  const pageIdx = Math.floor(index / 2);
  if (pageIdx < sections.length) onPageChange(pageIdx);
};
```

Also, prefer passing `onSnapComplete` in the constructor options rather than as a post-hoc property assignment for reliability.

---

### 2. ✅ Handles Mixed-Height Sections Correctly
**Verdict: APPROVED**

The `{ type: 'lock', align: ['start', 'end'] }` approach correctly handles both cases:
- **Short sections (< 100dvh):** start snap = content top, end snap = content bottom. Since the section is shorter than viewport, both snap points are the same position effectively, giving full-viewport behavior.
- **Tall sections (> 100dvh):** start snap = content top, end snap = content bottom. User can scroll freely between the two resting points via Lenis smooth scroll, then snaps to the nearest when released.

The `lock` type combined with `distanceThreshold: '40%'` lets users browse tall section content while ensuring clean snap behavior — no free-floating rest positions between sections.

---

### 3. ⚠️ Nav Sidebar Tracking via onSnapComplete
**Verdict: CHANGES_REQUESTED** (consequence of issue #1)

Will not work as written due to `{ target }` vs `{ index, value }` mismatch. See fix in criterion 1 above. Once the callback uses `Math.floor(index / 2)` to derive the page, this will work correctly.

---

### 4. ✅ Clean Separation — scroll-snap.js Standalone
**Verdict: APPROVED**

The new `src/lib/scroll-snap.js` module:
- Exports a single `setupLenis()` function with clear parameters `(wrapper, onPageChange)`
- Returns a cleanup function for proper Svelte `onMount` lifecycle
- Has zero dependency on the old `scroll.js` module
- All scroll logic is self-contained (Lenis init, Snap setup, RAF loop, resize handler, cleanup)
- Old `scroll.js` is deleted — no orphaned code

Clean separation pattern. ✅

---

### 5. ✅ Bundle Size Impact (~10.6KB gzipped)
**Verdict: APPROVED**

Lenis core (~8KB gzipped) + Snap module (~2-3KB gzipped) ≈ 10-11KB gzipped. The plan's estimate of ~10.6KB is plausible and well within acceptable bounds for a site that gains smooth scroll + proper snap behavior. This replaces the old scroll.js which had zero external dependencies but compromised UX on tall sections.

---

### 6. ⚠️ No Regressions — Music Player, Nav Toggle, Portfolio
**Verdict: CHANGES_REQUESTED** — scrollToPage nav interaction

- **Music player** — Unchanged. ✅
- **Nav toggle** — Unchanged. ✅
- **Portfolio component** — Unchanged. ✅
- **Audio element** — Unchanged. ✅
- **Style cleanup** — Correctly retains `main::-webkit-scrollbar { display: none }`, removes snap classes. ✅

**Issue found:** `scrollToPage` in `+page.svelte` uses native `el.scrollIntoView({ behavior: 'smooth' })` as a fallback. This bypasses Lenis entirely:

```
function scrollToPage(index: number) {
  if (!scrollContainer) return;
  const el = scrollContainer.querySelector(`[data-page="${index}"]`);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
```

Since Lenis now controls scrolling on `<main>`, calling native `scrollIntoView` will:
1. Fight with Lenis's scroll control
2. Produce jerky/conflicting motion (Lenis intercepts native scroll events)
3. NOT trigger snap behavior

**Fix:** Export a `scrollToPage` function from `scroll-snap.js` that uses `snap.goTo(index * 2)`, then import and use it in `+page.svelte`:

```javascript
// In scroll-snap.js, return from setupLenis:
return {
  cleanup() {
    window.removeEventListener('resize', onResize);
    snap.destroy();
    lenis.destroy();
  },
  scrollToPage(index) {
    snap.goTo(index * 2);
  }
};
```

Then in `+page.svelte`:
```javascript
const setup = setupLenis(scrollContainer, (page) => { currentPage = page; });
scrollCleanup = setup.cleanup;
// Store scrollToPage for nav:
pageScrollTo = setup.scrollToPage;
```

This keeps Lenis in control and uses the proper snap API for programmatic navigation.

---

### 7. ✅ Test Cases Comprehensive (5 TCs)
**Verdict: APPROVED** (with caveat that TC-3 and TC-4 depend on fixes above)

| TC | Description | Status |
|----|-------------|--------|
| TC-1 | Short sections snap fullscreen | ✅ Sound |
| TC-2 | Tall sections: snap → scroll → friction → snap next | ✅ Sound |
| TC-3 | Nav sidebar tracks current page | ⚠️ Will fail until onSnapComplete callback is fixed (Criterion 1) |
| TC-4 | Nav button clicks scroll to section | ⚠️ Will fail until scrollToPage uses Lenis/Snap API (Criterion 6) |
| TC-5 | Build passes | ✅ Standard SvelteKit build — no expected issues |

---

## Verdict: CHANGES_REQUESTED

Two issues must be resolved before approval:

1. **`onSnapComplete` callback** — Change `({ target })` to `({ index })` and derive page index via `Math.floor(index / 2)` (file: `scroll-snap.js`)

2. **`scrollToPage` nav interaction** — Replace native `el.scrollIntoView()` in `+page.svelte` with a Lenis-first approach using `snap.goTo(index * 2)` exposed from `scroll-snap.js` (files: `scroll-snap.js` + `+page.svelte`)

Once both fixes are applied, this plan is solid. The architecture, mixed-height handling, bundle impact, and separation of concerns are all well-considered.

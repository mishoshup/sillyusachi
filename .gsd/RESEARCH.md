# Explorer Findings — GlitterOverlay Debug

## 1. Star Size (ROOT CAUSE: CRITICAL)

| Version | Size Formula | Unit | Effective Size | Element |
|---------|-------------|------|----------------|---------|
| **Current** | `1 + Math.random() * 2.5` | `px` | **1–3.5px** | White div dot |
| **Old (68e1681)** | `1.2 + Math.random() * 2.5` | `rem` | **19.2–59.2px** | Unicode char (✦⊹˚✧⋆) |
| **Template** | `0.5 + Math.random() * 2.5` | `px` | **0.5–3px** | White div dot (180 stars) |

**Finding:** The current stars are rendered as 1–3.5px white dots. A 1px dot is invisible on any display; 3.5px is a barely perceptible speck. The **old working version** used Unicode characters at 1.2–3.7rem (~19–59px) — instantly visible decorative glyphs with glow effects and colors.

The template (`voyager-draft.html`) uses similarly tiny dot sizes (0.5–3px) but compensates with **180 stars** — the current implementation has only **60 stars per section**, making the sparse field virtually invisible.

**Min size comparison: New=1px vs Old≈19px vs Template=0.5px×180stars**

## 2. onMount Execution Verified — Compiled Code Is Correct

```
Compiled: j(()=>{s(r, Array.from({length:n()}).map(...), !0)})
```
- `j` = `onMount` — **fires correctly** on client hydration
- `s(r, ...)` = sets the `$state` star array
- Stars start as `[]` (SSR renders nothing), then onMount populates them

## 3. {#each} Rendering Verified

```
Compiled: B(a,21,()=>l(r),e=>e.id,(e,t)=>{var n=ce();f(()=>P(n,`style...`)),m(e,n)})
```
- `B` = `{#each}` block — correctly iterates over reactive array
- `ce` = template: `<div class="star-dot svelte-16sh8t"></div>`
- `f(()=>P(n,...))` = `$effect` applying inline styles for each star
- Each block correctly places star-dot div into the wrapper container

## 4. CSS Animation Is Properly Compiled

```css
.star-dot.svelte-16sh8t {
    opacity: 0;
    background: #fff;
    border-radius: 50%;
    animation: ease-in-out infinite svelte-16sh8t-twinkle;
    position: absolute;
}
@keyframes svelte-16sh8t-twinkle {
    0%, to { opacity: .1; transform: scale(.5) }
    50% { opacity: 1; transform: scale(1) }
}
```

The `twinkle` animation is properly scoped (`svelte-16sh8t`) and functional.

## 5. Z-Index Stacking — No Conflict

| Element | Position | Z-index | Stacking Context |
|---------|----------|---------|-----------------|
| Layout haze | `absolute inset-0` | `z-0` | Creates stacking context at layer 0 |
| Sections | `relative` | auto | No stacking context created |
| GlitterOverlay wrapper | `absolute inset-0` | `z-0` | Creates stacking context at layer 0 |
| Star dots | `absolute` (per CSS) | N/A | Inside GlitterOverlay's context |

Both haze and GlitterOverlay sit at z-0. The haze renders first in DOM order, GlitterOverlay comes later inside `{@render children()}`. Since both are at the same z-index, **later DOM order wins** — stars paint on top of haze. ✅

## 6. Section Height — Proper After onMount

`src/lib/scroll.js` → `setupScrollSnap()`:
- `snap-fit` class: `height: 100dvh` (fits viewport sections)
- `snap-tall` class: `min-height: 100dvh` (overflowing sections)

Both section classes are added in the page's `onMount`, which fires after GlitterOverlay's child `onMount` (Svelte lifecycle: child onMount → parent onMount). By the time the browser paints, sections have proper height and stars are positioned correctly via `%` coordinates. ✅

## 7. SSR HTML Check

```
curl -s http://localhost:5173/ | grep -c 'star-dot'  → 1 (only CSS rule)
```

No star-dot divs in SSR HTML (expected — they're created client-side in onMount).

3 sections confirmed with `data-page="0"`, `data-page="1"`, `data-page="2"`.

## 8. Dev Server — No Errors

No JavaScript errors or exceptions found in dev server logs. The only warning is:

```
[vite:css][postcss] @import must precede all other statements
```

This is about Google Fonts `@import url(...)` being placed after other rules in `app.css` — unrelated to the star issue.

## Root Cause Summary

**The stars ARE rendering, but at 1–3.5px they're too small to see.** The old version used decorative characters at readable rem sizes (~19–59px). The template compensates for tiny dots with 180 stars; the current code uses only 60.

## Recommended Fix (Explorer)

1. **Increase star size** — Multiply the size range by ~5x (e.g., `5 + Math.random() * 8` px for dots) or switch to `rem`-based character approach like the old version
2. **Increase count** — More stars = better coverage at small sizes (match template's 180 or use 120+)
3. **Add color variety** — White on dark navy is low contrast; add blue/gold like the old version
4. **Add glow via box-shadow** — Even tiny dots become visible with a glow halo

---

## Oracle Findings — GlitterOverlay Debug

### Summary
The compiled Svelte 5 output is **structurally correct** — the `$state` + `{#each}` + `onMount` pattern properly creates star-dot elements on the client. However, there are subtle issues that can prevent the stars from rendering visibly.

### Compiled Code Verification

**1. Component instantiation — CONFIRMED**
Three GlitterOverlay instances are created (one per section):
```js
Y(Re, {count:60});  // section 0 (Portfolio)
Y(Be, {count:60});  // section 1 (Commissions)
Y(He, {count:60});  // section 2 (About Me)
```

**2. onMount + $state reactivity — CONFIRMED correct**
```js
let n=E(t,`count`,3,120),       // props.count → 60
    r=F(i([]));                  // r = $state([])

j(()=>{                          // onMount
  s(r, Array.from({length:n()})
       .map(...), !0)            // deep-set populated array
});
```
The compiled code shows: `s(r, newArray, !0)` — `s` is the signal setter and `!0` (true) signals deep equality. This is the standard Svelte 5 pattern and should trigger the `{#each}` to re-render.

**3. {#each} block — CONFIRMED correct**
```js
B(a, 21, ()=>l(r), e=>e.id, (e,t)=>{
    var n=ce();
    f(()=>P(n,`left: ${l(t).x??``}%; ...`)),
    m(e,n)
})
```
- `B` = each block, anchored at container `a`
- `()=>l(r)` = reactive getter (picks up array changes)
- `ce` = template: `<div class="star-dot svelte-16sh8t"></div>`
- `f(()=>P(n,...))` = `$effect` applying inline styles
- `m(e,n)` = append star-dot to each block's insertion point

**4. CSS — CONFIRMED correct**
```css
.star-dot.svelte-16sh8t {
    opacity: 0;
    background: #fff;
    border-radius: 50%;
    animation: ease-in-out infinite svelte-16sh8t-twinkle;
    position: absolute;
}
@keyframes svelte-16sh8t-twinkle {
    0%, to { opacity: .1; transform: scale(.5); }
    50% { opacity: 1; transform: scale(1); }
}
```
Animation is properly scoped (not conflicting with global `@keyframes twinkle` in `app.css`).

### SSR Output Confirmation
```html
<div class="absolute inset-0 ... z-0 svelte-16sh8t"><!--[--><!--]--></div>
```
The SSR renders empty each blocks (`<!--[--><!--]-->` is Svelte 5's hydration anchor for empty `{#each}`). No star-dot divs in SSR — expected behavior since `stars = []` initially.

---

### Root Cause Analysis

Despite correct compiled code, stars may not be visible. Here are the potential causes, ordered by likelihood:

#### 🥇 Theory A: Animation Shorthand Duration Gap

The CSS shorthand `animation: twinkle infinite ease-in-out` sets `animation-duration: 0s` (default). The inline `animation-duration: {star.duration}s` is applied via a `$effect` (`f(()=>P(n,...))`) which runs **after** the element is appended to the DOM (`m(e,n)`).

Timeline for each star-dot:
1. `ce()` — creates element with CSS class (animation-duration: 0s)
2. `m(e,n)` — appends to DOM (animation starts with **0s duration → completes instantly**)
3. `f(()=>P(n,...))` — effect runs, sets `animation-duration: 3s`, `animation-delay: 1s`

With `animation-duration: 0s` + `animation-fill-mode: none`, the animation completes instantly and the element snaps to its base state (`opacity: 0`). Changing `animation-duration` on a running animation may NOT restart it properly in all browsers.

**Why this matters:** The old version had `font-size: {size}rem` and `color: {color}` which are **not animation properties** — they're static styles that don't interfere with the animation timing. In contrast, the new version's inline styles INCLUDE `animation-duration` and `animation-delay`, which ARE animation properties. When set via a delayed `$effect`, they might not restart the animation correctly.

**Evidence against:** The old version also used inline `animation-delay` and `animation-duration` (set in the same way via $effect) and it worked. However, the old version's animation had `4 + Math.random() * 2` duration (longer) and the character content made the element inherently visible even without the animation (text renders immediately, the span has intrinsic size). A `<div>` with `width: 1px; height: 1px` has NO visible content without the animation.

#### 🥈 Theory B: Star Size

The dots at `1 + Math.random() * 2.5` = **1–3.5px** are very small. The template (`voyager-draft.html`) uses similar sizes (0.5–2.5px) with 180 stars across 3 sections via pure JS — and it works. But the template has NO framework overhead: elements are created synchronously with `document.createElement()` and immediately styled.

The Explorer flags this as root cause, but the template proves tiny dots CAN work. However, the template uses **JS DOM manipulation directly**, not Svelte's reactive framework with hydration anchors and effects. The difference in rendering pipeline matters.

#### 🥉 Theory C: Svelte 5 Client Reactivity Edge Case

When `onMount` fires and populates the `$state` array, the `{#each}` block needs to dynamically create DOM nodes inside an already-hydrated container. If there's a subtle issue with:
- The hydration anchor claiming process conflicting with dynamic node insertion
- The `$state` proxy not properly triggering the each block's dependency tracking
- A stale closure in the each block's getter function

Then stars might not appear even though the compiled code looks correct. This would be a Svelte 5 bug specific to SSR → hydration → dynamic content scenarios.

#### Theory D: Z-index / Stacking (DISMISSED)

The haze overlay and GlitterOverlay are siblings at `z-0`. Since GlitterOverlay comes later in DOM order (inside `{@render children()}`), it paints on top. Stars are children of GlitterOverlay with no explicit z-index. Stars SHOULD be visible above the haze. ✅

#### Theory E: Section Height (DISMISSED)

Scroll snap utility adds `snap-fit` class (`height: 100dvh`) in the page's `onMount`. This fires after GlitterOverlay populates its stars (child lifecycle runs before parent). Sections have proper height by paint time. ✅

---

### Recommended Fix

The safest fix addresses both Theory A and Theory B simultaneously:

**Option 1 — Initialize stars eagerly (recommended):**
```svelte
<script lang="ts">
    let { count = 120 } = $props();

    // Helper function
    function generateStars(n: number) {
        return Array.from({ length: n }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 1 + Math.random() * 2.5,
            delay: Math.random() * 4,
            duration: 2 + Math.random() * 4
        }));
    }

    // SSR + CSR — stars exist from the start
    let stars = $state<Star[]>(generateStars(count));
</script>
```
**Why:** Eager initialization means:
- Stars ARE in the SSR HTML (hydrated, not dynamically created)
- No `onMount` → no timing gap
- No `$effect` setting animation properties after element creation
- The CSS animation starts with correct duration from the beginning

**Option 2 — Fallback: increase size + add glow:**
```css
.star-dot {
    /* ... */
    box-shadow: 0 0 4px rgba(255,255,255,0.6), 0 0 8px rgba(255,255,255,0.3);
    animation: twinkle 3s infinite ease-in-out;  /* ← explicit duration in shorthand */
}
```
AND increase sizes to `1 + Math.random() * 4` (1–5px) or larger.

**Option 3 — Hybrid: eager initialization + fallback CSS:**
Combines both approaches for maximum robustness. Eager init for SSR presence, fallback CSS for visibility even if animation timing is off.

**What NOT to do:**
- ❌ Going back to unicode characters (increased HTML payload, matches old version but misses the point of using dots)
- ❌ Relying solely on `onMount` + `$state` without verifying it works (current situation)

### Verification Steps
After applying the fix:
1. `curl -s http://localhost:5173/ | grep -c star-dot` should return > 0 (stars in SSR HTML)
2. Open browser, check if `.star-dot` elements appear in the DOM immediately
3. Verify the twinkle animation plays (opacity cycles between 0.1 → 1 → 0.1)


---

## Oracle Findings — Original vs Current

### 1. Section Height: `h-[100dvh]` Is Missing — This Is a Real Bug

**ORIGINAL (commit 5b03b17):**
```html
<main class="h-[100dvh] w-full overflow-y-auto" style="scroll-snap-type: y mandatory; ...">
  <section data-page="0" class="h-[100dvh] w-full relative" style="scroll-snap-align: start; scroll-snap-stop: always;" />
  <section data-page="1" class="h-[100dvh] w-full relative" style="scroll-snap-align: start; scroll-snap-stop: always;" />
</main>
```

**CURRENT (HEAD):**
```html
<main class="h-[100dvh] w-full overflow-y-auto">   <!-- no scroll-snap-type -->
  <section data-page="0" class="w-full relative flex flex-col overflow-hidden" />   <!-- NO h-[100dvh] -->
  <section data-page="1" class="w-full relative flex flex-col overflow-hidden" />
  <section data-page="2" class="w-full relative flex flex-col overflow-hidden" />
</main>
```

The original had `h-[100dvh]` **hardcoded in the template** — sections were always exactly viewport height from the very first render/paint cycle.

The current version **removed all height + scroll-snap classes** from the template. It relies entirely on `scroll.js → classifySections()` to add `.snap-fit` (height:100dvh) or `.snap-tall` (min-height:100dvh) classes **dynamically**.

**→ DIAGNOSIS: Timing bug.** `classifySections()` runs inside `setupScrollSnap()`, which is called from `onMount()` in +page.svelte:
```js
onMount(() => {
    if (!scrollContainer) return;
    scrollCleanup = setupScrollSnap(scrollContainer, (page) => { currentPage = page; });
    return () => scrollCleanup?.();
});
```

**`onMount` runs AFTER the first browser paint.** Between initial render and the `onMount` callback:
1. Sections render with ZERO height constraints (only `w-full` and `overflow-hidden`) — they collapse to content height or 0px
2. No `scroll-snap-type` is set on the container, so no snap behavior
3. Then `classifySections()` fires and adds classes — but the browser has already painted once

**→ ROOT CAUSE:** Original had `h-[100dvh]` at template level (set during SSR/server render). Current deferred it to client-side JS in `onMount`. This means sections flash at wrong height → then get corrected. If a section has empty content or content that hasn't loaded, it could render at 0px height and be invisible.

**Fix:** Either restore `h-[100dvh]` to the template (simplest), or use `onMount` → `requestAnimationFrame()` or `$effect` to run `classifySections()` before the first paint.

---

### 2. Scroll-Snap Behavior: mandatory → proximity

| Aspect | Original | Current |
|--------|----------|---------|
| Container snap | `scroll-snap-type: y mandatory` (hardcoded inline) | `scroll-snap-type: y proximity` (set by scroll.js) |
| Section snap | `scroll-snap-align: start; scroll-snap-stop: always` (hardcoded inline) | Dynamic: `.snap-fit` = `start` + `always`; `.snap-tall` = `start` + `normal` |

**Impact:** `mandatory` forces snap on every scroll — you can't stop between sections. `proximity` is softer (snaps only if close to boundary). The original guaranteed a full section always filled the viewport. The current version allows partial scrolls for tall sections (`snap-stop: normal`). If the user experience seems "off", this is why.

---

### 3. GlitterOverlay: Complete Rewrite (15 elements → 312)

| Aspect | Original | Current |
|--------|----------|---------|
| Stars count | 15 (default) | 300 dots + 12 floating = **312** |
| Colors | Pastel: `#a9c4db`, `#f2b8d4`, `#ffffff`, `#deefef` | Dark: `#ffffff`, `#d4a853` (gold), `#7ba7c9` (sky blue) |
| Init timing | `onMount` → deferred (stars empty on first render) | Eager init (module-level generators) — stars exist from SSR |
| Positioning | `absolute` within each section | `fixed` (via `fixed` prop) — covers viewport |
| Visual style | Unicode chars (`✦`, `⊹`, `˚`, `✧`) with text-shadow glow | Tiny dot `<div>` background + unicode floating stars |
| Z-index | `z-0` within section | `z-0` in layout (behind content) |

**Layout shift assessment:** SAFE — current GlitterOverlay uses eager init, so there's no onMount delay. Stars render on the first frame. However, 312 DOM elements vs 15 could cause **performance issues** (frame drops) on initial render, especially on mobile.

**Note:** Original had GlitterOverlay INSIDE each section (2 instances, one per page). Current has a SINGLE instance in the layout, set to `fixed`. This is cleaner but removes the per-section glitter variation.

---

### 4. Layout Background: Pastel Gradient → Dark Starfield

| Aspect | Original | Current |
|--------|----------|---------|
| Background | `bg-gradient-to-br from-[#deefef] via-[#f5ddee] to-[#e3f0e2]` | `bg-[#080612]` (deep navy) |
| Atmospheric effects | None | Three radial gradient overlays (purple/blue) + GlitterOverlay starfield |
| Text color (body) | `rgba(0, 0, 0, 0.8)` | `#f0eae8` (cream) |

**This is intentional — not a regression.** The entire visual theme was redesigned from light pastel to dark space. But if `bg-[#080612]` is the only background, and the radial overlays + starfield fail to render (e.g., JS error), the site will be a plain black page with light text.

---

### 5. Font Loading: Arial → Caviar Dreams (Potential FOUT)

**Body font change:**
- Original: `Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`
- Current: `'Caviar Dreams', Arial, sans-serif`

**Font files exist:** ✅ All 5 WOFF2 files are present in `static/`:
- `AMORIA.woff2`
- `CaviarDreams.woff2`
- `CaviarDreams_Bold.woff2`
- `CaviarDreams_Italic.woff2`
- `CaviarDreams_BoldItalic.woff2`

**→ The `font-display: swap` is the likely cause of "random ass fonts":**
- During FOUT (Flash of Unstyled Text) period, browser renders in fallback font (Arial)
- Once Caviar Dreams loads, it swaps to custom font
- On a slow connection via Tailscale serve, this swap can take **seconds**
- User sees "random ass fonts" = the system Arial during the swap delay

**Additional font risk:** `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:...')` was added — this is an external Google Fonts request. If the user's browser blocks this (e.g., privacy extensions, network issues), Space Grotesk won't load at all.

**Fix options:**
- Add `font-display: optional` instead of `swap` if swapping looks bad
- Preload the primary font: `<link rel="preload" href="/CaviarDreams.woff2" as="font" crossorigin>`
- Use a `fontfaceset.load()` + class swap pattern to avoid the flash

---

### 6. "Random Ass Fonts" — Full Chain of Events

1. User opens site → HTML/SSR render sends with `font-family: 'Caviar Dreams', Arial, sans-serif`
2. Browser immediately paints using Arial (fallback) — Caviar Dreams hasn't loaded yet
3. Browser sees @font-face for `Caviar Dreams` → begins downloading `/CaviarDreams.woff2`
4. `font-display: swap` tells the browser to use fallback until the font is ready
5. After download (size: ~22KB — fast but variable over Tailscale), font is ready
6. Browser re-paints all text with Caviar Dreams → layout shift (text reflow)
7. **Result:** User sees Arial → jarring swap → Caviar Dreams

**Why it seems "random":** If the network is spotty (Tailscale serve), the swap might never happen, leaving text permanently in Arial/system font.

---

### 7. Page Count Change: 2 pages → 3 pages

- Original: page 0 (Portfolio) + page 1 (Coming Soon) → 2 full 100dvh sections
- Current: page 0 (Portfolio) + page 1 (Commissions) + page 2 (About Me) → 3 dynamic sections

The new `AboutMe` and `CommissionInfo` components may have variable content heights. If content overflows viewport, `classifySections()` should correctly assign `snap-tall` (min-height:100dvh). But if content is shorter than viewport, `classifySections()` assigns `snap-fit` (height:100dvh). **This dynamic classification is fragile** — it runs once on mount and only on resize debounce. If content changes after mount (e.g., images load, data fetches resolve), the height classification becomes stale.

---

### Recommended Fixes

| # | Issue | Fix | Priority |
|---|-------|-----|----------|
| 1 | `h-[100dvh]` missing from sections → flash of 0-height | Restore `h-[100dvh]` to `<section>` template, or use `$effect` instead of `onMount` to run `classifySections()` before paint | **HIGH** |
| 2 | FOUT from Caviar Dreams swap | Add `<link rel="preload">` for CaviarDreams.woff2 + Amoria.woff2 in layout head | **HIGH** |
| 3 | scroll.js timing depends on `onMount` (post-paint) | Either pre-assign height classes in template, or switch scroll.js init to `use:action` or `$effect` | **MEDIUM** |
| 4 | Proximity snap instead of mandatory (behavior change) | Revert to `scroll-snap-type: y mandatory` if forced snap is desired | **LOW** |
| 5 | 312 DOM elements in GlitterOverlay (perf) | Reduce default count or use CSS-only starfield background | **LOW** |
| 6 | Stale height classification if content loads after mount | Add MutationObserver to re-run classifySections() when children change | **MEDIUM** |
| 7 | Radial gradient overlays are hardcoded — no fallback if JS fails | Add `bg-[#080612]` as explicit background-color (already done — good) | **INFO** |

---

### Verdict: What's Actually Broken vs Intentional Redesign

**BROKEN (regression):**
1. **Sections render at 0px/content-height before scroll.js corrects them** — this is the most impactful bug. If scroll.js errors or runs late, the page shows collapsed/invisible sections.
2. **Font FOUT** — body font swaps from Arial → Caviar Dreams, causing "random ass fonts" perception.

**INTENTIONAL (redesign):**
1. Dark background with starfield (was light pastel) — complete theme overhaul.
2. GlitterOverlay with 300+ elements — new visual direction.
3. 3 pages instead of 2 — added Commissions + About Me pages.
4. Proximity snap instead of mandatory — softer scroll behavior.
5. Body font change from Arial → Caviar Dreams — thematic.

---

## Oracle Findings — Lenis Library Research

### 1. Can Lenis Solve All 5 Requirements?

**YES — all 5 requirements can be met with Lenis v1.3.23 + Lenis/snap.**

| # | Requirement | Lenis Solution | Verdict |
|---|-------------|----------------|---------|
| 1 | Sections that fit viewport → fullscreen snap | `snap.addElement(section, { align: 'start' })` snaps section top to viewport top | ✅ |
| 2 | Friction at the END of each section before snapping to next | `snap.type: 'lock'` + `lerp: 0.06–0.1` + `distanceThreshold: '30%'` — the lock type forces snap only when user deliberately scrolls past threshold, creating a natural friction feel | ✅ |
| 3 | Next component's TOP fits exactly when snapping | `align: 'start'` ensures snap-to-top behavior for every section | ✅ |
| 4 | If next component doesn't fit → snap to top, allow internal scroll, friction at bottom → snap to next | **This is the killer feature.** `align: ['start', 'end']` creates TWO snap points per section. For a tall section (e.g., CommissionInfo at ~900px on 667px viewport): (a) snap to top → content scrolls internally via Lenis smooth scroll, (b) when user reaches near the bottom (distanceThreshold), lock engages → next scroll gesture snaps to next section's start. | ✅ **CRITICAL** |
| 5 | Clean code separation | Lenis/snap is a separate import (`lenis/snap`). All config lives in a dedicated scroll module. Event-based tracking for nav. | ✅ |

---

### 2. How to Integrate

#### Add Dependency
```bash
npm install lenis
# Latest: 1.3.23
```

#### Import
```javascript
import Lenis from 'lenis';
import Snap from 'lenis/snap';
import 'lenis/dist/lenis.css';  // Required CSS for Lenis to work
```

#### Initialize in scroll.js

New scroll module replaces `setupScrollSnap()` with `setupLenisScroll()`:

```javascript
import Lenis from 'lenis';
import Snap from 'lenis/snap';
import 'lenis/dist/lenis.css';

let lenis = null;
let snap = null;

/**
 * Sets up Lenis smooth scroll with Lenis/snap for mixed-height section snapping.
 *
 * @param {HTMLElement} container - the <main> scroll container
 * @param {(page: number) => void} onPageChange - callback for nav tracking
 * @returns {() => void} cleanup function
 */
export function setupLenisScroll(container, onPageChange) {
  const sections = Array.from(container.querySelectorAll('[data-page]'));

  // 1. Create Lenis instance
  lenis = new Lenis({
    wrapper: window,           // Use document-level scroll
    autoRaf: true,             // Automatic RAF loop
    lerp: 0.1,                 // Scroll interpolation (higher = smoother but more lag)
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  // 2. Create snap instance with lock mode
  snap = new Snap(lenis, {
    type: 'lock',              // Lock mode prevents mid-section stopping
    distanceThreshold: '30%',  // How close to snap boundary before it engages
    debounce: 150,             // Prevent rapid snap oscillations
    lerp: 0.08,                // Snap animation lerp (slightly tighter than scroll)
    duration: 1.0,             // Snap animation duration in seconds
    onSnapComplete: (item) => {
      // Snap goTo uses snap point index (0-based)
      // Each section has 2 snap points (start, end)
      // So section index = snapIndex / 2
      const pageIndex = Math.floor(item.index / 2);
      if (!isNaN(pageIndex) && pageIndex < sections.length) {
        onPageChange?.(pageIndex);
      }
    },
  });

  // 3. Add each section as a snap element with start+end alignment
  sections.forEach((section) => {
    snap.addElement(section, {
      align: ['start', 'end'], // Two snap points per section
    });
  });

  // 4. Handle page changes during manual scroll (continuously update nav)
  let lastPage = -1;
  lenis.on('scroll', (e) => {
    let currentPage = 0;
    const scrollPos = lenis.scroll;
    sections.forEach((section, i) => {
      const offsetTop = section.offsetTop;
      if (scrollPos >= offsetTop - window.innerHeight * 0.3) {
        currentPage = i;
      }
    });
    if (currentPage !== lastPage) {
      lastPage = currentPage;
      onPageChange?.(currentPage);
    }
  });

  // 5. Resize handling (handled automatically by Lenis autoResize)

  // 6. Cleanup
  return () => {
    snap?.destroy();
    lenis?.destroy();
    lenis = null;
    snap = null;
  };
}

/**
 * Programmatically scroll to a specific page/section.
 * Used by the nav sidebar.
 */
export function scrollToPage(index) {
  if (!snap) return;
  snap.goTo(index * 2);  // Each section has 2 snap points
}
```

#### Changes to `+page.svelte`

```diff
- import { setupScrollSnap } from '$lib/scroll.js';
+ import { setupLenisScroll, scrollToPage } from '$lib/scroll.js';

<main>
-  class="h-[100dvh] w-full overflow-y-auto"
-  style="scrollbar-width: none; -ms-overflow-style: none; touch-action: pan-y;"
+  class="w-full"
>
```

---

### 3. Bundle Size & Performance

| Package | Unpacked | Gzipped (mjs) | Minified | 
|---------|----------|---------------|----------|
| `lenis` core | 438KB (26 files) | **7.7 KB** | 18 KB (lenis.min.js) |
| `lenis/snap` | Included in package | **2.9 KB** | 5.8 KB (lenis-snap.min.js) |
| **Combined** | — | **~10.6 KB** | ~24 KB (but would use ESM tree-shaking) |

**✅ Well under the 15KB gzipped limit.**

**Bundle breakdown (tree-shaken import of lenis + lenis/snap):**
- Vite/SvelteKit's build pipeline tree-shakes unused code
- Importing `Lenis` from `lenis` and `Snap` from `lenis/snap` as ESM modules will result in ~10KB gzipped
- No React/Vue overhead since we use vanilla JS

**Performance considerations:**
- Lenis runs in the **main thread** (not offscreen canvas) — but it's optimized for performance
- BundlePhobia reports Lenis at 4KB gzipped (core only), which tracks with our 7.7KB measurement including snap
- Uses `requestAnimationFrame` — smooth 60fps
- Avoids CSS transforms for scrolling (unlike Locomotive Scroll), so no compositor thread overhead
- IntersectionObserver works naturally with Lenis (no conflicts)
- `prevent` option available to skip Lenis for specific elements (e.g., modals with internal scroll)

---

### 4. Migration Effort: Current scroll.js → Lenis

#### What changes from current scroll.js:

| Aspect | Current (CSS scroll-snap) | New (Lenis + snap) | Effort |
|--------|--------------------------|--------------------|--------|
| Dependency | None | npm install lenis | Low |
| CSS | Injected dynamic styles | `import 'lenis/dist/lenis.css'` | Low |
| Scroll logic | `classifySections()`, IntersectionObserver | `new Lenis()`, `new Snap()` | Medium |
| Section height classes | snap-fit / snap-tall (dynamic) | **Remove entirely** — Lenis handles it | Low |
| Nav tracking | IntersectionObserver | `lenis.on('scroll')` | Medium |
| Resize handling | debounced window resize | Automatic via Lenis autoResize | **Less code** |
| Programmatic scroll | `scrollContainer.scrollTo()` | `snap.goTo(index)` | Low |
| Cleanup | Explicit observer/style removal | `snap.destroy()` + `lenis.destroy()` | Similar |

The `<main>` element **no longer needs to be a scroll container** — it becomes a regular block wrapper. Sections use default block flow (stacking vertically). Lenis takes over document-level scrolling.

#### What is removed:
- `scroll.js` `classifySections()` — gone (Lenis/snap handles mixed heights)
- Dynamic style injection (`#scroll-snap-styles`) — gone
- IntersectionObserver in scroll.js — gone (replaced by lenis scroll events)
- `snap-fit` / `snap-tall` CSS classes — gone
- Debounced resize handler — gone (Lenis autoResize handles it)

#### What stays the same:
- `[data-page]` attributes on sections — still used
- `scrollToPage(index)` function — same API, different implementation
- `onPageChange` callback — same signature
- Return cleanup function — same pattern

---

### 5. Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | |
| Firefox 90+ | ✅ Full | |
| Safari 15.4+ | ✅ Full | |
| Edge 90+ | ✅ Full | |
| iOS Safari 15.4+ | ✅ Full | Touch events work |
| Android Chrome 90+ | ✅ Full | |
| Samsung Internet | ✅ Full | |

**Key APIs used:**
- `ResizeObserver` (Chrome 64+, Firefox 69+, Safari 13.1+)
- `IntersectionObserver` (Chrome 51+, Firefox 55+, Safari 12.1+)
- `requestAnimationFrame` (Chrome 24+, Firefox 23+, Safari 9+)
- CSS `overflow` animation with `transition-behavior: allow-discrete` (optional, for autoToggle)

**No IE11 support** — Lenis targets modern browsers only.

---

### 6. Mobile Performance vs Native CSS Scroll-Snap

| Metric | Native CSS scroll-snap | Lenis + snap |
|--------|----------------------|--------------|
| Scroll smoothness | Native (OS compositor) | JS-driven (RAF loop) 60fps |
| Mixed-height sections | ❌ Fragile / limitation | ✅ Handled by start+end snap points |
| Touch responsiveness | ✅ Native feel | ⚠️ `touchMultiplier: 1.5` recommended for parity |
| Battery impact | ✅ None (hardware) | ⚠️ Minimal (RAF only when scrolling) |
| Friction feel | ❌ Binary snap/no-snap | ✅ Configurable via `lerp + distanceThreshold` |
| Page search (Ctrl+F) | ✅ Works natively | ✅ Works (no CSS transforms) |
| Accessibility | ✅ Screen readers OK | ✅ Native scrollbar preserved |
| Scrollbar | ✅ Native | ✅ Preserved (Lenis shows native scrollbar) |

**Mobile concern:** Lenis uses JS-driven smooth scrolling which can feel slightly delayed compared to native touch scroll on Android/iOS. Mitigate with:
- `syncTouch: true` (mimics touch device scroll more closely)
- `touchMultiplier: 1.5` (amplifies touch gestures)
- `touchInertiaExponent: 1.7` (controls deceleration feel)

**Lenis handles mobile explicitly** — read the manifesto: "Made for 2026+" with first-class touch support.

---

### 7. How It Maps to the Current 3 Sections

#### Section 0: Portfolio (fits viewport ≈ 100dvh)
- `snap.addElement(portfolioSection, { align: 'start' })` → snap point at section top
- The `type: 'lock'` ensures user can't stop mid-section
- Snaps cleanly: start → end (same position since section fits) → next section

#### Section 1: CommissionInfo (tall — 850-1100px on 667px mobile)
- `snap.addElement(commissionSection, { align: ['start', 'end'] })` → TWO snap points
- Start snap point: at section's offsetTop (handles content at different scroll positions)
- End snap point: at section's offsetTop + sectionHeight - viewportHeight
- User flow: snap to top → scroll through content (Lenis smooth scroll) → reach bottom area → distanceThreshold triggers → next scroll goes to Section 2

#### Section 2: About Me (fits or variable)
- Same as Portfolio if it fits, same as CommissionInfo if tall

#### Nav sidebar tracking
- `lenis.on('scroll', ...)` updates `currentPage` continuously
- `snap.onSnapComplete` fires when snap lands (for final state)
- `scrollToPage(index)` uses `snap.goTo(index * 2)` for programmatic nav clicks

---

### 8. Edge Cases & Caveats

1. **AutoRaf vs manual RAF:** `autoRaf: true` is simplest but doesn't allow external RAF coordination (e.g., with GSAP). For our use case (no GSAP), `autoRaf: true` is fine.

2. **Content height changes after mount:** If CommissionInfo content loads images asynchronously and changes height, the snap points become stale. Mitigation: call `snap.resize()` after content loads, or use Svelte `$effect` to detect height changes.

3. **Fixed-position elements inside Lenis:** The nav sidebar (`position: fixed`) and music player (`position: fixed`) are outside the `<main>` container, so they're unaffected by Lenis. ✅

4. **Svelte transitions:** The `fly` transition on the music player popup is inside a `position: fixed` element outside the scroll container. No conflict with Lenis. ✅

5. **SvelteKit page transitions:** If page transitions are added later, Lenis needs to be destroyed/recreated on navigation. The cleanup function handles this.

6. **`allowNestedScroll`: false (default):** The `data-lenis-prevent` attribute can be added to elements that should bypass Lenis smooth scroll (e.g., if we add internal scrollable widgets). Not needed currently.

7. **CSS `position: sticky` inside Lenis:** Works natively — Lenis doesn't use CSS transforms. ✅

8. **Find in page (Ctrl+F):** Works because Lenis preserves native scrollbar and doesn't translate the content. ✅

---

### 9. Concrete Implementation Plan

#### Step 1: Install
```bash
npm install lenis
```

#### Step 2: New file — `src/lib/scroll-snap.js`
Create a new scroll module (keep old `scroll.js` as backup). Contains:
- `setupLenisScroll(container, onPageChange)` — main setup
- `scrollToPage(index)` — programmatic nav

#### Step 3: Update `src/routes/+page.svelte`
```diff
- import { setupScrollSnap } from '$lib/scroll.js';
+ import { setupLenisScroll, scrollToPage } from '$lib/scroll-snap.js';

- onMount(() => { scrollCleanup = setupScrollSnap(scrollContainer, ...); });
+ onMount(() => { scrollCleanup = setupLenisScroll(scrollContainer, ...); });

<main
  bind:this={scrollContainer}
-  class="h-[100dvh] w-full overflow-y-auto"
-  style="scrollbar-width: none; -ms-overflow-style: none; touch-action: pan-y;"
+  class="w-full"
>
  <!-- Keep sections as-is: [data-page], min-h-[100dvh], overflow-hidden -->
</main>
```

#### Step 4: Update `scrollToPage` function in +page.svelte
The existing `scrollToPage` in +page.svelte calls `scrollContainer.scrollTo()` directly as a fallback. This should be updated to only use the exported `scrollToPage` from scroll-snap.js (which calls `snap.goTo()`).

#### Step 5: Test on mobile
- Test CommissionInfo page on mobile viewport (iPhone SE ~667px height)
- Verify the start/end snap behavior
- Adjust `distanceThreshold` if needed (try 20–40%)
- Adjust `touchMultiplier` and `syncTouch` for mobile feel

#### Step 6: Clean up old code
- Remove unused `scroll.js` or keep as fallback reference
- Remove dynamic style injection if old `scroll.js` is removed

---

### 10. Recommendation: PROCEED with Lenis

**Lenis + Lenis/snap is the correct solution** for this exact use case. The combination of:
- `align: ['start', 'end']` for mixed-height sections
- `type: 'lock'` for friction/resistance
- `distanceThreshold` for proximity control
- `goTo(index)` for programmatic nav

solves all 5 requirements and provides a **more robust** experience than CSS scroll-snap, which fundamentally cannot handle mixed-height sections well. The bundle cost (~10.6KB gzipped) is well within the 15KB budget.

The main migration effort is:
1. Install lenis (~1 minute)
2. Write new scroll module (~50 lines)
3. Update +page.svelte imports and CSS (~10 lines changed)

**Total: ~30 minutes implementation + testing.**

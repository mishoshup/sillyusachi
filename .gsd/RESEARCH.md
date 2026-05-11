# Research Findings

## Explorer Findings — Phase 4

### 1. Current About Me Stub Structure

**File:** `src/routes/+page.svelte` — Lines 117-124

The About Me page is currently an inline stub within the scroll layout:

```svelte
<!-- Page 2: About Me -->
<section
    data-page="2"
    class="h-[100dvh] w-full relative"
    style="scroll-snap-align: start; scroll-snap-stop: always; touch-action: pan-y;"
    tabindex="0"
    role="region"
    aria-label="About Me"
>
    <GlitterOverlay count={8} />
    <div class="h-full flex items-center justify-center">
        <p class="font-amoria text-[#8899aa] text-lg">about me coming soon ✦</p>
    </div>
</section>
```

**Key observations:**
- Uses `data-page="2"` (third page, 0-indexed)
- Same scroll-snap pattern as Portfolio and Commissions sections
- GlitterOverlay count={8} (sparsest of all pages)
- No static import for a component — just inline HTML

---

### 2. Import Patterns (CommissionInfo reference)

**File:** `src/routes/+page.svelte` — Line 6

CommissionInfo is imported via **static import** at the top of the script:

```ts
import CommissionInfo from '$lib/components/CommissionInfo.svelte';
```

Used directly in the template without dynamic/lazy wrapping:

```svelte
<CommissionInfo status="open" />
```

**Pattern conclusion:** AboutMe should follow the same pattern — static import, direct use in template. (The `ComingSoon` component was already removed from page flow; it only exists as an orphan component file.)

---

### 3. Existing `rotateEarth` Animation

**File:** `src/app.css` — Last keyframe block

```css
@keyframes rotateEarth {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
```

**Note:** This keyframe already exists but is **not used anywhere** currently. It was likely added in anticipation of Phase 4. The rotation is 360 degrees — a full CSS transform rotation.

For a CSS-only earth globe, the plan suggests animating `background-position-x`, not `transform: rotate()`. The existing `rotateEarth` keyframe is transform-based. Need to decide: reuse existing keyframe for a different purpose (rotating orbit ring maybe) or create a new `background-position` animation for the globe itself.

---

### 4. Static Assets

**Directory:** `static/`

```
AMORIA.woff2              (39,744 bytes)
CaviarDreams.woff2        (22,260 bytes)
CaviarDreams_Bold.woff2   (22,336 bytes)
CaviarDreams_Italic.woff2 (25,216 bytes)
CaviarDreams_BoldItalic.woff2 (25,340 bytes)
favicon.svg               (1,569 bytes)
robots.txt                (69 bytes)
sitemap.xml               (233 bytes)
```

**No world map asset exists yet.** Task 1 of Phase 4 requires downloading/purchasing/creating a world map SVG or image for the CSS earth globe. SVG is preferred (scalable, no loading issues, small file size).

---

### 5. GlitterOverlay Density Usage

| Page | Count | Meaning |
|------|-------|---------|
| Portfolio (page 0) | `count={20}` | Dense — busy creative space |
| Commissions (page 1) | `count={10}` | Moderate — professional but creative |
| About Me (page 2) | `count={8}` | Sparse — "edge of known space" (as per plan) |

**Source:** `src/lib/components/GlitterOverlay.svelte` accepts `count` prop, generates random star positions/movements. Default count is 15.

---

### 6. Existing Glass Card Patterns

**Primary pattern** (from CommissionInfo.svelte):

```svelte
class="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md"
```

**Variations:**
- **Dashed border (gallery placeholder):** `bg-white/[0.04] border border-dashed border-white/[0.15] rounded-2xl p-6 backdrop-blur-md`
- **Status card:** Same as primary + `border-2` + dynamic `{statusCardBorder}`
- **Mini cards (ToS grid):** `bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md`
- **Nav background:** `bg-[#080612]/60 backdrop-blur-2xl border border-white/10 rounded-2xl`
- **Player pill:** `bg-[#080612]/70 backdrop-blur-2xl border border-white/10 rounded-full`

**Consistent theme:** ~4% white bg (`bg-white/[0.04]`), `backdrop-blur-md`, subtle white borders at 8% opacity (`border-white/[0.08]`), rounded-2xl.

---

### 7. Font Usage

| Font | Tailwind Class | Usage | Source |
|------|---------------|-------|--------|
| **Amoria** (cursive) | `font-amoria` | Hero headings (portfolio name), decorative text, quotes ("ask me anything!"), music track names, commission header | Custom woff2, `@font-face` in app.css |
| **Caviar Dreams** | `font-caviar` | Body text, labels, nav tabs, buttons, ToS, Do/Don't lists, scroll hints, music player | Custom woff2 with bold/italic variants |
| **Space Grotesk** | `font-space` | Small labels, secondary text, music metadata, status text, "sketches · lineart" tags | Google Fonts via `@import` |

**Font pairing rule in practice:** Amoria = headers/decorative/accent, Caviar = workhorse body text, Space = tiny labels/metadata.

---

### 8. Responsive Patterns

**clamp() usage:**
- Portfolio hero: `font-size: clamp(3.5rem, 16vw, 7rem)` — fluid sizing with min/max
- ComingSoon header: `text-[clamp(2.8rem,11vw,5.5rem)]` — similar fluid pattern

**Tailwind breakpoints used:**
- `sm:` (640px) — Main breakpoint for layout shift
- `md:` (768px) — Grid column change
- `lg:` (1024px) — Larger grid column change

**Examples from CommissionInfo:**
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` — Responsive grid
- `text-[2.8rem] sm:text-[3.5rem]` — Responsive font sizing
- `px-3 sm:px-6` — Responsive padding
- `grid-cols-1 sm:grid-cols-3` — ToS grid
- `hidden sm:flex` — Show elements only on desktop (volume controls)

**Overflow handling for commission scroll:** `py-12 px-3 sm:px-6 gap-6 overflow-y-auto` — content scrolls within the full-height section.

---

### 9. ComingSoon Component Status

**File:** `src/lib/components/ComingSoon.svelte` — Exists but **not imported anywhere** in `+page.svelte`. It's an orphan component. The plan's Task 4 (remove ComingSoon from page flow) is already done — the "coming soon" was already replaced with an inline stub. No cleanup needed.

---

### 10. Existing Code Patterns Summary

**Component structure:**
- Svelte 5 runes: `$props()`, `$derived`, `$state()`
- Props interface: `let { ... }: Props = $props()`
- No SvelteKit `load` functions — all client-side
- Tailwind CSS with custom theme tokens

**Color tokens available:**
- `deep-navy` (#0a0a1a) — page bg
- `space-blue` (#1a3a5c) — accent blue
- `sky-blue` (#7ba7c9) — labels, secondary accents
- `gold` (#d4a853) — primary accent, highlights
- `gold-dark` (#b8953a) — gold variant
- `cream` (#f0eae8) — primary text
- `muted` (#8899aa) — secondary text

**Key rule from plan:** "No light purple anywhere" — all accent colors must stay in the navy/blue/gold/cream palette.

---

## Oracle Findings — Phase 4

### 1. About Me Component Architecture

**Recommendation: Single component** — `AboutMe.svelte` with logical section comments.

The content (header, globe, info grid, quote footer) is cohesive and tightly scoped. Splitting into sub-components would add import/export overhead without benefit. The info grid items are not reused elsewhere in the site.

**Structure breakdown:**

```svelte
<!-- AboutMe.svelte -->
<script lang="ts">
    interface Props {
        favSong?: string;
        games?: string;
        specialInterest?: string;
        birthday?: string;
        myTypo?: string;
        favoriteCharacters?: string;
        location?: string;
    }
    let {
        favSong = '754 — Cece Natalie',
        games = 'Genshin, HSR, ZZZ',
        specialInterest = 'Art, space, music, character design',
        birthday = 'August · Leo season',
        myTypo = 'i\'m just a silly little guy lost in space',
        favoriteCharacters = '',
        location = 'Malaysia'
    }: Props = $props();
</script>

<!-- Outer glass card -->
<div class="relative glass-card ...">
    <!-- 1. Header -->
    <section class="header">...</section>

    <!-- 2. Earth Globe -->
    <section class="globe-section">...</section>

    <!-- 3. Info Grid -->
    <section class="info-grid">...</section>

    <!-- 4. Quote Footer -->
    <section class="quote-footer">...</section>
</div>
```

**Why this works:**
- Follows the exact same pattern as `CommissionInfo.svelte` (single component, props interface, glass card)
- Info items are distinct enought to warrant individual sections but not separate files
- Props-based editing keeps content flexible without requiring component structural changes
- No dynamic imports needed — static import in `+page.svelte` (same as CommissionInfo)

**Props interface notes:**
- Make the props optional with sensible defaults so the component works standalone
- Use strings for all values (simple, type-safe, easy to pass from page-level data)
- `myTypo` gets special gold styling treatment as per the plan
- `favoriteCharacters` stays as a comma-separated string (future: could be an array if UI grows)

---

### 2. Earth Globe CSS Technique

The `app.css` already has a `@keyframes rotateEarth` (transform rotation), but the globe needs `background-position-x` animation, not transform rotation. **Recommendation: Add a new keyframe specifically for the globe's background scroll, and repurpose the existing `rotateEarth` as an orbit ring animation if desired.**

**CSS-only globe technique (proven, performant):**

```css
/* Keyframe for earth rotation */
@keyframes earth-rotate {
    0%   { background-position-x: 0; }
    100% { background-position-x: -400px; } /* width of the image */
}

/* Globe element */
.earth-globe {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: url('/world-map.jpg') repeat-x 0 0 / auto 100%;
    animation: earth-rotate 20s linear infinite;
    
    /* 3D sphere illusion — dark side shadow */
    box-shadow:
        inset 8px 0 12px -4px rgba(0, 0, 0, 0.7),   /* left dark side */
        inset -4px 0 8px -2px rgba(255, 255, 255, 0.1);  /* right atmospheric glow */
    
    /* Atmosphere glow ring */
    &::after {
        content: '';
        position: absolute;
        inset: -3px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 50%, transparent 60%, rgba(123, 167, 201, 0.12) 70%, transparent 85%);
        pointer-events: none;
    }
}

/* Prevents stutter on scroll — promote to own layer */
.earth-globe {
    will-change: background-position;
}

/* Accessibility — stop animation if user prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
    .earth-globe {
        animation: none;
        background-position: 0 0;
    }
}
```

**Why background-position-x instead of transform:rotate():**
- `transform: rotate(360deg)` would spin the whole globe like a top (looking down from above) — wrong effect
- `background-position-x` animates the world map image horizontally — correct rotation simulation for a sphere seen from the front
- The inset `box-shadow` on the left side creates the dark hemisphere illusion
- `::after` pseudo-element adds a subtle atmospheric glow (sky-blue tint at edge)

The image must be 2:1 aspect ratio (equirectangular projection) and tile horizontally. The animation speed (20s) is a gentle rotation — not too fast, not too slow.

---

### 3. Data Flow: Props vs Hardcoded

**Recommendation: Configurable props with defaults.** All 7 personal info fields should be props with sensible defaults.

| Field | Default Value | Prop Name | Rationale |
|-------|--------------|-----------|----------|
| Fav Song | `754 — Cece Natalie` | `favSong` | Changes when Nasuha discovers new music |
| Games | `Genshin, HSR, ZZZ` | `games` | Changes with new game releases |
| Special Interest | `Art, space, music, character design` | `specialInterest` | Core identity, rarely changes |
| Birthday | `August · Leo season` | `birthday` | Static — could stay as default only |
| My Typo | `i'm just a silly little guy lost in space` | `myTypo` | Signature quote — might change |
| Favourite Characters | `''` | `favoriteCharacters` | Changes often as Nasuha discovers new media |
| Location | `Malaysia` | `location` | Static — could stay as default |

**Implementation in `+page.svelte`:**

```svelte
<AboutMe
    favSong="Someone New — Hozier"
    games="Genshin, HSR, ZZZ, WuWa"
    favoriteCharacters="Emilie (Genshin), Sparkle (HSR)"
/>
```

**Why this pattern:**
1. Same as `CommissionInfo`'s `status` prop — consistent component API
2. `+page.svelte` becomes the content source of truth
3. Nasuha can edit text without touching component internals
4. Future-proofed for CMS or data-driven content
5. Default values ensure the component renders standalone (good for testing/design iteration)

---

### 4. Globe Asset Recommendation

**Primary recommendation: Small equirectangular JPG/PNG — larger image with fewer artifacts**

| Source | File Type | Size (est.) | Pros | Cons |
|--------|-----------|-------------|------|------|
| **NASA Blue Marble (resized)** | JPG | ~30-60KB | Beautiful, realistic, public domain | Needs resize on download |
| **Wikimedia BlankMap-World-Equirectangular.svg** | SVG | 1.26 MB | Vector, public domain (CC0) | TOO LARGE, has political borders |
| **Natural Earth raster** | PNG | ~100-200KB | Clean, public domain | Less visually interesting than Blue Marble |
| **Custom simplified SVG** | SVG | ~20-40KB | Ultra-light, scalable, no loading | Needs to be created — extra dev work |

**Best practical choice: NASA Blue Marble equirectangular JPG, resized to 800×400px**

Implementation steps:
1. Download NASA's Blue Marble Next Generation equirectangular JPG
2. Resize to 800×400px (or even 400×200px for a 110px globe)
3. Save as `static/world-map.jpg`
4. Use as `background: url('/world-map.jpg') ...` in the globe CSS

**Why not SVG at 1.26MB:**
- At 1.26MB, the Wikimedia SVG is the largest static asset by far (bigger than ALL fonts combined)
- It has detailed political borders not visible at 110px
- It would slow initial page load (render-blocking if CSS-referenced)

**Alternative if SVG is strongly preferred:**
- Find or create a simplified SVG with just continent outlines (no country borders)
- Look for "world map continents only equirectangular svg" — these are often 20-40KB
- Natural Earth's 1:110m cultural vectors simplified would work but needs SVG export

**File placement:** Save as `static/world-map.jpg` (or `.svg`). References `world-map-2-1.jpg` in the plan are fine too — name is flexible.

---

### 5. Layout Trade-offs: Glass Card vs Full-Height & Responsive Grid

**Glass card is the right choice.** Here's the analysis:

**Why glass card wins over full-height:**
- CommissionInfo uses scrollable content within the card — consistent pattern
- The content (2-3 rows of info + globe + quotes) is compact enough for a card
- Glass card creates visual hierarchy against the dark space background
- Full-height would stretch content awkwardly (it's not dense enough to fill 100dvh)

**Responsive grid strategy (info items):**

| Viewport | Columns | Layout |
|----------|---------|--------|
| ≥768px (md) | 2 columns | 3-4 rows of info + globe sits above |
| <768px (mobile) | 1 column | All items stack vertically |

**Implementation:**

```svelte
<div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
    <!-- Info items each in mini glass cards -->
</div>
```

**Content order within the glass card:**

```
┌─────────────────────────────┐
│      Header (centered)      │  ← "Sillyusachi" + subtitle
├─────────────────────────────┤
│        Earth Globe          │  ← 110px circle + "← earth — home"
├─────────────────────────────┤
│  ┌─────────┐ ┌─────────┐   │
│  │Fav Song │ │  Games  │   │  ← 2-col grid on desktop
│  └─────────┘ └─────────┘   │
│  ┌─────────┐ ┌─────────┐   │
│  │Special  │ │Birthday │   │
│  └─────────┘ └─────────┘   │
│  ┌────────────────────┐    │
│  │     My Typo™       │    │  ← Full width (gold treated)
│  └────────────────────┘    │
│  ┌─────────┐ ┌─────────┐   │
│  │  Fav    │ │Location │   │
│  │  Chars  │ │ (+flag)  │   │
│  └─────────┘ └─────────┘   │
├─────────────────────────────┤
│    Quote Footer (center)    │
└─────────────────────────────┘
```

**Max-width recommendation: `max-w-[520px]`** (slightly smaller than 600px from the plan) — keeps the card tighter and more elegant for the content amount. This is a minor suggestion, 600px works fine too.

**Vertical centering:**
- Use `flex flex-col items-center justify-center h-full` on the section (same as Portfolio)
- Card is vertically centered in viewport
- Content overflow within card: `overflow-y-auto` (same pattern as CommissionInfo)
- Gap between sections: `gap-4` to `gap-5`

---

### 6. Voyager Theming Consistency — Color Verification

All planned colors verified against the established Voyager palette:

| Element | Planned Color | Voyager Token | Verdict |
|---------|---------------|---------------|---------|
| Card bg | `bg-white/[0.04]` | glassmorphism base | ✅ Matches CommissionInfo |
| Card border | `border-white/[0.08]` | subtle glass border | ✅ Matches CommissionInfo |
| Card backdrop | `backdrop-blur-md` | glass effect | ✅ Matches CommissionInfo |
| Header gold gradient | `#d4a853` → `#f0eae8` → `#d4a853` | gold + cream | ✅ Same as Portfolio hero |
| Subtitle | `#8899aa` (muted) | muted text color | ✅ Matches all pages |
| Labels (info grid) | `#7ba7c9` (sky-blue) | sky blue accented | ✅ Matches CommissionInfo labels |
| Values (info grid) | `#f0eae8` (cream) | primary text | ✅ Site-wide standard |
| Gold accent (My Typo) | `#d4a853` | gold accent | ✅ Matches Status, Pricing headers |
| Location flag | Emoji flag | uses Unicode | ✅ Flexible, no palette issue |
| Quote footer | font-amoria italic | decorative display | ✅ Matches Portfolio's "ask me anything!" |
| Globe shadow blue | `rgba(123,167,201, 0.12)` | sky blue with opacity | ✅ Within palette |
| Light purple | **Used nowhere** | ❌ must not use | ✅ Plan explicitly excludes it |

**Potential gotchas to watch for:**
1. The existing Portfolio component uses `#c8c0d0` (greyish lavender) for body text — this is acceptable (it's a muted neutral, not purple)
2. The original portfolio's "Greetings" text in `#c8c0d0` is fine to keep on page 0
3. All About Me colors must be explicitly from the navy/blue/gold/cream palette
4. Globe atmosphere glow should use sky-blue (`#7ba7c9`), not any purple tone

**Verdict: Theming is consistent.** No changes needed to the planned color scheme.

---

### 7. Animation Performance Assessment

**Overall: No performance concerns.** Here's the breakdown per animation:

| Animation | Technique | GPU Accelerated? | Cost |
|-----------|-----------|-----------------|------|
| Globe rotation | `background-position-x` animation | ✅ (compositor-only) | **Minimal** — single element, repaint not required |
| GlitterOverlay (8 stars) | CSS opacity + transform animation | ✅ (compositor) | **Minimal** — 8 elements with simple keyframes |
| backdrop-blur-md | CSS filter | ❌ (software rasterized on some browsers) | **Moderate** — one card per page |
| Nav tab animations | CSS transform | ✅ (compositor) | **Minimal** — off-screen most of the time |
| Music player vinyl | `conic-gradient` + `animation: spin` | ⚠️ mixed | **Low** — small element, GPU optimization varies |
| Scroll-snap | Browser native | ✅ | **None** — managed by browser compositor |

**Critical optimization: Only ONE page's animations run at a time.**

Scroll-snap ensures only one section is visible. While hidden pages' CSS animations technically still tick, modern browsers aggressively throttle off-screen animation frames. This makes the combined cost far lower than if all animations ran simultaneously.

**Specific recommendations:**

```css
/* Globe — promote to own compositor layer */
.earth-globe {
    will-change: background-position;
}

/* Already-optimized in existing code: */
/* - Nav uses contain: layout style (prevents layout thrash) */
/* - GlitterOverlay uses absolute positioning + pointer-events: none */
/* - Music player uses contain: layout style */
```

**Mobile considerations:**
- `backdrop-blur` is the most expensive effect — limiting it to ONE card per page is good discipline
- Globe rotation runs at 20s per cycle — slow enough to avoid jank even on lower-end devices
- `will-change: background-position` is a lightweight hint (unlike `will-change: transform` which sometimes causes oversubscription of GPU memory)
- The `prefers-reduced-motion: reduce` media query handles accessibility gracefully

**Verdict: Ship it.** The globe + GlitterOverlay + backdrop-blur combination is well within safe performance bounds for a site this simple. No WebGL, no heavy JS animation libraries, no canvas — just smart CSS.

---

## Librarian Findings — Phase 4

### 1. CSS-Only Rotating Earth Globe Techniques

**Core technique found across multiple sources (w3bits, CodePen, Stack Overflow):**

**HTML:** Single `<div id="earth"></div>` (or inline in Svelte)

**CSS mechanism:**
1. Create a square `<div>` with `border-radius: 50%` (circle shape)
2. Set `background-image` to an equirectangular world map
3. Set `background-size: auto 100%` (or explicit pixel width matching the image width)
4. Animate `background-position` horizontally via `@keyframes`

```css
@keyframes rotate {
    0% { background-position: 0 0; }
    100% { background-position: -630px 0; } /* move left by image width */
}

.earth {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: url(path/to/world-map) 0 0 repeat / 630px;
    animation: rotate 8s linear infinite;
}
```

**3D shading technique (from w3bits tutorial):**
- **`box-shadow: inset 20px 0 80px 6px rgba(0,0,0,1)`** on the main earth div — creates a dark shadow on the right side, giving a 3D sphere illusion
- **`::after` pseudo-element** with `box-shadow: -80px 15px 80px 10px rgba(0,0,0,.9) inset` — shadow on the left side for atmospheric depth
- **`::before` pseudo-element** with `radial-gradient(circle at 100px 100px, #fff, #000)` + `opacity: .2` — spherical highlight overlay
- This creates a convincing 3D globe using only CSS

**Hemisphere highlight for Voyager theme:**
- Instead of pure black shadows, use a gold-tinted shadow: `rgba(212, 168, 83, 0.15)` for a subtle gold glow on one hemisphere
- Add a faint blue-white specular highlight via radial-gradient (matching Voyager's celestial aesthetic)

**Key sizing consideration:** `background-size` pixel value must match your equirectangular image's natural width for seamless looping. If using a 2000px-wide image, set `background-size: 2000px`.

**Alternative approach (CodePen):** Some implementations use `background-position-x` and `background-size: cover` with `background-repeat: repeat-x` for a cleaner looping effect. This is better when the exact image width isn't known.

**Recommended approach for this project:**
- Use a smaller globe (120px diameter) to keep it elegant as per plan
- Create new `@keyframes rotateGlobe { 0% { background-position-x: 0; } 100% { background-position-x: -1024px; } }` (separate from existing `rotateEarth` which is transform-based)
- Apply `will-change: background-position` and `transform: translateZ(0)` to the globe div for GPU compositing

---

### 2. Public Domain Equirectangular World Map Assets

**Option A (RECOMMENDED): Solar System Scope 2K Earth Day Map**
- **URL:** `https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg`
- **Size:** ~500KB-1MB JPEG, 2048×1024px equirectangular
- **License:** Based on NASA imagery (Blue Marble data), color-enhanced, free for use
- **Pros:** Beautiful true-color earth with clouds/vegetation, perfect 2:1 aspect ratio, ideal for CSS globe
- **Cons:** JPEG (not SVG), but at ~500KB it's acceptable
- **Direct download:** Works in browser/browser fetch confirmed (200 OK)

**Option B: Wikimedia Commons Blank Equirectangular SVG**
- **URL:** `https://upload.wikimedia.org/wikipedia/commons/9/9f/BlankMap-World-Equirectangular.svg`
- **Size:** 1.31 MB SVG (but compresses well)
- **License:** CC0 1.0 Universal Public Domain Dedication
- **Pros:** SVG (scalable, no resolution issues), political map with country boundaries
- **Cons:** Blank map (no terrain/colors—just outlines), political borders are visible, less visually interesting for a decorative globe

**Option C: NASA Blue Marble (2002) — the original dataset**
- **URL:** Available via NASA Visible Earth (`visibleearth.nasa.gov`)
- **License:** Public domain (NASA imagery)
- **Size:** Full resolution is 21,600×10,800 (huge), but scaled-down versions exist
- **Cons:** Finding the exact direct URL for a web-optimized version requires navigating NASA's site; the Solar System Scope version is derived from this and already optimized

**Recommendation:** Download Option A (`2k_earth_daymap.jpg`) to `static/world-map.jpg` — it's the most beautiful true-color earth, web-optimized at 2K, equirectangular, and free. If a stylized SVG is preferred for a more artistic/unique look, use Option B but note it's a blank political map (not beautiful terrain).

**Stylized alternative (for Voyager theme):** Consider converting the earth map to a stylized version with gold continent outlines on a dark blue ocean for a more thematic look — but that requires manual image editing beyond the scope of this phase. The plan says "CSS rotating globe is enough for now" so the real NASA-derived texture is fine.

---

### 3. Glass Card Patterns — Best Practices for One-Page Section

**Research from uxdesign, UX Pilot, and glassmorphism implementation guides:**

**Centered Single Card vs Multiple Cards:**
- **For an About Me page with personal info:** A single large centered glass card (`max-w-[600px]`) is the right call, as specified in the plan. This creates focus on the person rather than spreading content across multiple disconnected modules.
- **Multiple cards** work better for commission info / pricing / portfolio grids where items need comparison or independent scrolling.

**Glassmorphism best practices gathered:**

| Aspect | Recommendation | Why |
|--------|---------------|-----|
| `backdrop-filter` blur | `blur(12px)` to `blur(20px)` | Less blur = background too visible; more = loses glass feel. On dark backgrounds, lower blur (12px) works better because there's less light to scatter. |
| Background opacity | `rgba(255,255,255,0.04)` to `0.08` | Currently using `bg-white/[0.04]` — this is fine. Can go to 0.06 or 0.08 if text readability suffers. |
| Border | `rgba(255,255,255,0.08)` to `0.12` | Subtle white border defines the card edge. The current `border-white/[0.08]` is good. |
| Text contrast | Ensure label:value pairs have strong contrast | Labels in `#7ba7c9` (sky-blue) on glass bg = good. Values in `#f0eae8` (cream) = good. |
| Background complexity | Need visible elements behind glass | On solid `#0a0a1a` background, glass effect is invisible. The GlitterOverlay stars provide background activity that makes the blur visible. |

**For a centered single card on a dark background with GlitterOverlay:**
- The existing `bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl` pattern works perfectly
- Adding a subtle gold border glow (`box-shadow: 0 0 20px rgba(212, 168, 83, 0.1)`) would elevate it for the Voyager theme
- The GlitterOverlay behind the glass card will show through the blur, making the glass effect visible and dimensional

**Grid within the card:** The plan calls for a 2-column grid inside the glass card (1 column on mobile). Each cell should be a mini glass fragment or just styled text. Recommend using the current pattern from CommissionInfo's grid items — `flex flex-col gap-1` with label+value pairs, no need for nested glass cards on an already-glass card (too many layers causes visual noise).

---

### 4. Artist About Me Page UX — How Digital Artists Present Personal Info

**Research from portfolio sites (Format, Colorlib, SiteBuilderReport, real artist examples):**

**Tone: More casual than professional.** Digital artists (especially on platforms like IG, Cara, Pixiv) lean toward a friendly, personal tone. Common patterns:

| Element | Prevalence | Example |
|---------|-----------|---------|
| Online name / brand name | ~100% | The primary identity — often larger/emphasized |
| Real name or pseudonym | ~70% | "Also known as..." |
| Age range (18+) | ~30% | Common for artists who draw mature content |
| Fave songs / playlists | ~25% | Adding personality, shared taste with audience |
| Games played | ~35% | Video game artists often list games they play/love |
| Fave characters | ~40% | Very common among anime/digital artists — builds community connection |
| Birthday / zodiac | ~15% | Fun fact, not critical |
| Special interests | ~50% | Art, space, music, fashion, etc. |
| Quotes | ~20% | Personal motto, lyrics, or a running joke |
| Location | ~60% | Relevant for commissions/shipping if selling prints |

**Layout patterns:**
- **Single column bio + details grid** — Most common for artist about pages. A short bio paragraph, followed by a structured details grid. This matches the plan's approach.
- **Photo/avatar + details next to it** — Common but not applicable here (no real photo needed)
- **Full-width quote or tagline** — Often used as a section divider or footer

**The plan's info layout matches industry conventions very well:** Fav Song, Games, Special Interest, Birthday, Typo quote, Characters, Location — these are all things real digital artists put on their about pages. The only addition some artists include that's missing is a short bio paragraph (1-2 lines) before the grid. The plan's "voyager of dreams" subtitle partly fills this role.

**Key UX insight from research:** The About Me page for artists is NOT about being professional — it's about **human connection**. Fans want to feel like they know the artist. The casual, personal tone ("my typo" quote, "silly little guy lost in space", listing fave characters) is exactly what resonates with an artist audience.

---

### 5. Voyager R1999 Globe Aesthetic — Stylistic Cues

**From character wiki, Reddit appreciation threads, and art style analyses:**

**Voyager's visual themes (relevant to the earth globe):**
- **Celestial/astronomical theme:** Voyager is an alien from beyond the stars. Her design features deep space motifs — stars, distant galaxies, cosmic phenomena
- **Gold accents on dark navy/blue:** Her outfit has gold embroidery, trims, and celestial patterns on a predominantly dark blue palette
- **Golden lines and geometric celestial patterns:** Her design uses gold filigree lines, circular arc motifs, and star charts
- **Dreamlike, ethereal quality:** Not harsh or military-sci-fi — soft, poetic, mysterious
- **Violin/music connection:** She communicates through music — the globe could have subtle musical notation elements or a violin silhouette overlaid (but this might overcomplicate the CSS-only approach)
- **"Weathered but elegant"** aesthetic described in CONTEXT.md — the gold should feel antique, not gaudy

**Stylistic cues for the earth globe:**
- **Instead of a realistic bright earth:** Consider a **weathered, aged map aesthetic** — like an old celestial atlas or antique globe
- **Gold lines** for latitude/longitude or continent outlines if creating a custom stylized version
- **The globe should feel like it belongs in space** — surrounded by dark, with faint gold glow on one side
- **Small, elegant** (100-120px as specified) — it's a decorative focal point, not the main feature
- **The label "← earth — home"** fits Voyager's alien perspective perfectly — she's from beyond, so "earth" is just "home"

**Implementation ideas for Voyager-style globe:**
- The Solar System Scope 2K texture is beautiful but very realistic — add CSS overlays to give it a more weathered/atmospheric look:
  - Dark blue overlay at `opacity: 0.3` to mute the bright colors
  - Gold radial gradient highlight on one side
  - Faint outer glow `box-shadow: 0 0 30px rgba(212, 168, 83, 0.2)`
- Alternatively, if the realistic texture feels out of place, create a simpler stylized SVG globe with:
  - Dark blue ocean (`#1a3a5c`)
  - Gold continent outlines
  - Simple latitude/longitude lines in muted gold
  - This would be more work but more thematically cohesive

---

### 6. Performance — backdrop-filter + CSS Animation + Particle Overlay

**Research from Smashing Magazine, GPU acceleration guides, and Stack Overflow:**

**Key finding: backdrop-filter is GPU-intensive.** Multiple authoritative sources warn against overusing it.

| Component | GPU Cost | Mitigation |
|-----------|----------|------------|
| `backdrop-filter: blur()` | High — forces layer creation, every repaint of background requires re-blur | Use sparingly (1-2 layers). Smaller areas = better. |
| CSS `background-position` animation | Medium — not on the "cheap" list (transform/opacity only) | Use `will-change: background-position` + `transform: translateZ(0)` to promote to GPU layer |
| Particle overlay (GlitterOverlay) | Low-Medium — depends on count | Count=8 is very sparse, should be fine. Use `transform` for movement, not `top/left`. |
| `backdrop-filter` + particle background | HIGH — particles moving behind a blurred glass card = the worst case | Each particle movement requires re-blur of the glass layer behind it |

**Performance optimization techniques (from Smashing Magazine and other sources):**

1. **Layer promotion:** Apply `will-change: transform` or `transform: translateZ(0)` to animated elements. This promotes them to their own compositing layer on the GPU.

2. **Only animate transform and opacity:** These are the only two properties the GPU can composite without re-painting. `background-position` is NOT a composited property — the browser must repaint. However, for a simple 120px globe, this is negligible.

3. **Minimize backdrop-filter surface area:** Keep the glass card small (max-w-[600px]) rather than full-width. The plan's 600px max-w is good.

4. **Limit blur radius:** Use `blur(12px)` instead of `blur(20px+)`. Less GPU work, and on dark backgrounds, the difference is barely visible.

5. **`will-change` best practices:**
   - Set `will-change: transform` on the globe **only while animating** (not permanently, to avoid excess memory use)
   - Set `will-change: backdrop-filter` on the glass card (this tells the browser to prepare a separate layer)
   - Avoid setting `will-change` on many elements simultaneously

6. **Specific recommendations for this project:**
   - **Earth globe:** `will-change: background-position; transform: translateZ(0);` — promotes to GPU layer
   - **Glass card:** `will-change: backdrop-filter;` — prepares blur compositing layer
   - **GlitterOverlay count=8:** Very sparse — no optimization needed, but ensure stars animate via CSS `transform` (translate/scale) not `left/top`
   - **Avoid nesting backdrop-filter:** Don't put a glass card inside another glass card
   - **Animation duration:** Earth globe at 8-12s per rotation (slow, elegant) = fewer repaints per second than a fast 4s rotation

7. **Browser compatibility notes:**
   - `backdrop-filter` has ~95% global support. The `-webkit-backdrop-filter` prefix is still needed for Safari. The current project uses `backdrop-blur-md` (Tailwind) which handles prefixes.
   - `will-change` is well supported in all modern browsers
   - For browsers that don't support `backdrop-filter`, the glass card should gracefully degrade to a semi-opaque dark panel (`bg-[#0a0a1a]/80`)

---

### Summary of Recommendations for Phase 4 Implementation

1. **World map asset:** Download `https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg` to `static/world-map.jpg`
2. **Globe CSS:** New `@keyframes rotateGlobe` animating `background-position-x`. Use `transform: translateZ(0)` and `will-change: background-position` for GPU promotion. Add inset shadows for 3D depth and gold-tinted outer glow for Voyager theme.
3. **Glass card:** Use existing pattern (`bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl`) with optional gold shadow accent. Single centered card with max-w-[600px].
4. **Info grid layout:** 2-column grid inside card, label+value pairs (no nested glass cards). The casual, personal tone is correct for an artist audience.
5. **Voyager theming:** Add gold-tinted globe glow, use muted earth colors with dark overlay, and keep the "← earth — home" label for narrative consistency.
6. **Performance:** Apply `will-change` strategically, limit blur to 12px, slow globe rotation (10-12s), and verify GlitterOverlay uses transform-based animation.

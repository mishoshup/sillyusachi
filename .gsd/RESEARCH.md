# Research: Sillyusachi Site — Voyager R1999 Theme Overhaul

## Librarian Findings — Phase 1 & 2

### 1. Voyager Character Design Analysis

**Lore & Character**
- **Name:** Voyager (远旅)
- **Afflatus:** Star (Star Arcanist)
- **Rarity:** 6★
- **Role:** Support / Sub-DPS (Crit-oriented)
- **Lore:** An alien visitor from a place where there is no "sound." Despite mastering 55 Earth languages, she communicates primarily through her violin. Expresses herself via music rather than speech.
- **Sources:** Reverse:1999 Fandom Wiki, Prydwen Institute

**Outfit & Visual Design (Default)**
- White/cream dress with dark blue/black accents
- Frilled apron with celestial motifs
- Juliet/puffy sleeves with cuffs
- Hair ribbon and headband with star ornaments
- White tights, brooches with star symbols
- Two-tone hair (light + dark)
- Star motifs throughout — hair accessories, brooch, fabric patterns
- Violin as primary prop (matches her musical/alien identity)

**Key Visual Motifs for the Site Theme:**
- ✦ Stars (multiple stylized variants)
- Celestial/space backdrop (dark navy void)
- Violin strings / musical notation as decorative elements
- Retro-futuristic alien elegance — not overt sci-fi, but refined, mysterious
- White/cream flowing fabrics against dark space — contrast play

### 2. Reverse:1999 Art Direction & Style References

**Overall Aesthetic Framework:**
- Retro-futurism blending late 20th-century nostalgia with imagined futures
- Surrealist and anachronistic elements — dreamlike landscapes
- Victorian gothic undertones with steampunk touches
- "Mysticism, retro, eccentricity, artistic, and romanticism" — core pillars
- Mixed-media collage feel — textured backgrounds, layered compositions
- Dark backgrounds with bright, high-contrast character art

**Source:** Eagle Community character design resource
- 161 character design illustrations available
- Game developed by Bluepoch
- Character design begins with extensive textual input, then art team discussions
- Heavy use of metaphorical and symbolic elements

**Source:** LogRocket on retro-futuristic UX
- Characteristics: neon color palettes, cyber-themed typography, dark/metallic backgrounds, sci-fi imagery, immersive UI effects
- Effective for: gaming sites, creative portfolios, personal tech blogs
- Applied to this site: dark celestial backgrounds, gold-cyan glow effects, star particles, subtle retro-futuristic typography

### 3. Voyager-Inspired Color Palette

**From Voyager's Default Outfit (extracted from text descriptions and cosplay references):**
| Color | Description | Approx. Hex |
|-------|-------------|-------------|
| Deep navy / near-black | Primary background (space void) | `#070714` → `#0a0a1a` |
| Rich space blue | Mid-tone celestial blue | `#1a3a5c` |
| Soft celestial blue | Atmospheric/nebula blue | `#5a8db0` → `#7ba7c9` |
| Warm cream | Primary text/elements | `#f0eae8` |
| Bright white | Star/particle highlights | `#ffffff` |
| Antique gold | Accents, highlights, trim | `#d4a853` |
| Dark gold / brass | Secondary accents | `#b8953a` |

**Voyager-specific color associations:**
- White dress → cream/white for UI elements, text on dark
- Gold trim/accents → gold for decorative borders, highlights, hover effects
- Star motifs → gold and white stars against deep blue
- Dark blue gloves/accents → space blue tones for UI depth
- NO purple tones — aligns with CONTEXT.md directive

### 4. CSS-Only Rotating Earth Globe Techniques

**Technique 1: w3bits CSS Earth (Recommended for this site)**
- **Method:** Single `<div id="earth">` + CSS pseudo-elements
- **Core mechanism:** Animate `background-position` of a world map image across a circular div
```css
#earth {
  width: 300px; height: 300px;
  border-radius: 50%;
  background: url(world-map.jpg) 0 0 repeat;
  background-size: 630px;
  animation: rotate 4s linear infinite;
  box-shadow: inset 20px 0 80px 6px rgba(0,0,0,1);
  transform-style: preserve-3d;
}
@keyframes rotate {
  0% { background-position: 0 0; }
  100% { background-position: 630px 0; }
}
```
- **3D illusion layers:**
  1. `box-shadow: inset 20px 0 80px 6px rgba(0,0,0,1)` — right-side shadow
  2. `#earth:after` — left-side shadow via `box-shadow: -80px 15px 80px 10px rgba(0,0,0,.9) inset`
  3. `#earth:before` — spherical gradient overlay `radial-gradient(circle at 100px 100px, #fff, #000)` with `opacity: .2`

- **Pros:** Pure CSS, no JS, simple to implement, lightweight
- **Cons:** Requires a flat world map image, resolution-dependent, no true 3D
- **Adaptation for this site:** Can be scaled down (100-150px) for the About Me page info-card

**Technique 2: StackOverflow / Simple variant**
- Same principle as w3bits but using `background-repeat: repeat` with animation
- GitHub user Sakshigumma has a minimal implementation

**Source:** [w3bits.com/css-earth/](https://w3bits.com/css-earth/), [codepen.io/jamesfinn180/pen/VwzENbR](https://codepen.io/jamesfinn180/pen/VwzENbR)

### 5. Svelte 5 Particle / Starfield Implementation Patterns

**Approach A: Simple CSS-Generated Stars (Lightweight, Recommended)**
- Generate N stars using Svelte `{#each}` with randomized props
- Style: tiny circles with `border-radius: 50%`, absolute positioned
- Colors: white, soft blue, gold (matching Voyager palette)
- Animation: CSS `@keyframes twinkle` for opacity oscillation
- No canvas needed for sparse stars (CONTEXT.md specifies LESS stars, sparse & elegant)

**Approach B: Canvas-Based Starfield (for performance at scale)**
- **emmaly/starfield** — pre-built Svelte 4 component using Canvas 2D API
- npm: `github:emmaly/starfield`
- Props: `initialSpeed`, `initialDensity`, `maxDensity`
- Slots for interactive speed/density controls
- **Caution:** Built for Svelte 4 — needs migration to Svelte 5 runes API

**Approach C: SVG Star Component (jovianmoon.io)**
- Two components: `Star.svelte` (SVG star shape) + `Starfield.svelte` (generator)
- Svelte 5 runes pattern: `$props()`, `$state()`, `$effect()`
```svelte
<!-- Star.svelte pattern -->
<script lang="ts">
  let { size = "1rem", left = "0%", top = "0%", opacity = 1 } = $props();
</script>
<svg style:left style:top style:opacity ...>
  <!-- star path -->
</svg>
```
- Stars generated as arrays of `StarData[]` with `$state()` for reactivity
- SSR-friendly — renders stars server-side before window dimensions are known
- Uses no-overlap detection for larger stars (`check_star_positions` with distance threshold)

**Recommended for This Site:**
Given CONTEXT.md says "Less stars than draft — sparse, elegant" and "Colors: blue, white, gold only":
- Use Approach A (CSS-generated dots) for the main starfield — simple, performant
- Use decorative symbols ✦ ⊹ ˚ ✧ ⋆ as floating CSS-animated elements (small count, maybe 10-20)
- Star colors: `#ffffff`, `#7ba7c9` (soft blue), `#d4a853` (gold)
- Twinkle animation: `@keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`
- Size range: 1-3px for tiny stars, 4-6px for occasional larger ones
- Gold stars should be rarest — like distant celestial bodies

**Source:** [jovianmoon.io SvelteKit Starfield](https://jovianmoon.io/posts/generating-a-starfield-in-svelte), [github.com/emmaly/starfield](https://github.com/emmaly/starfield)

### 6. Svelte 5 + Tailwind Dark Theme Best Practices

**Key Setup Pattern:**
```
tailwind.config.js → darkMode: 'selector'
```
- Use `mode-watcher` package for theme management (`npm install mode-watcher`)
- Add `<ModeWatcher defaultMode={"dark"} />` to root layout
- Apply classes: `bg-white dark:bg-[#0a0a1a]` throughout
- Svelte 5 runes: `$props()`, `$state()`, `$effect()` for component logic

**Tailwind Dark Mode Selectors:**
- `dark:` prefix on all color classes
- For custom Voyager palette, extend Tailwind config:
```js
theme: {
  extend: {
    colors: {
      'voyager-dark': '#0a0a1a',
      'voyager-space': '#1a3a5c',
      'voyager-sky': '#7ba7c9',
      'voyager-cream': '#f0eae8',
      'voyager-gold': '#d4a853',
      'voyager-brass': '#b8953a',
    }
  }
}
```
- Use `dark:bg-voyager-dark` etc. throughout components

### 7. Summary of Practical References for Implementation

| Feature | Technique | Reference |
|---------|-----------|-----------|
| Starfield background | CSS absolute-positioned dots + `@keyframes twinkle` | jovianmoon.io approach, adapted for Svelte 5 |
| Floating decorative symbols | CSS-animated ✦ ⊹ ˚ ✧ ⋆ (10-20 elements) | Custom, inspired by Voyager star motifs |
| CSS rotating globe | Single div + background-position animation | w3bits.com/css-earth/ |
| Dark theme | Tailwind `darkMode: 'selector'` + mode-watcher | appmvp.dev SvelteKit guide |
| Custom color palette | Extended Tailwind config | Derived from Voyager outfit descriptions |
| Glass panels / cards | `backdrop-blur`, semi-transparent backgrounds | Tailwind native utilities |
| Royalty-free world map | Flat earth map image for globe | Public domain — search "equirectangular world map" |

---

## Librarian Findings — Phase 3

### 1. Artist Commission Page Best Practices

**Layout & Structure (from industry research):**
- **Above-the-fold priority:** Commission status (open/closed) is the #1 info visitors look for — place this prominently at top or in a sticky banner
- **Clear hierarchy:** Status → Pricing → ToS → Dos/Don'ts → Contact/Payment — logical flow from "can I commission?" to "how much?" to "what are the rules?"
- **Scan-friendly layout:** Artists' clients (often non-designers) scan before reading — use bold headings, icons, bullet lists, visual separators
- **"One page, full info"** is the dominant pattern on VGen, Carrd, ArtStation commission tabs (i.e., don't make users click through multiple pages)
- **Well-structured artist websites** organize into: Homepage → Portfolio → About → Contact, with commission info as a page or prominent section
- **Digital artist portfolio checklist 2025:** Sub-2-second load, responsive, WCAG 2.2 accessibility, HTTPS, thumbnail grids that tell a story

**Common Commission Page Sections (industry standard):**
1. **Status indicator** — "● Open" / "✕ Closed" — most important signal
2. **Pricing / Tiers** — can be flat rates, range, or "contact for quote"
3. **Terms of Service** — payment schedule, turnaround, revisions, copyright
4. **Dos & Don'ts** — what the artist will/won't draw
5. **Gallery / Samples** — visual proof of quality
6. **Payment methods** — supported platforms
7. **How to order / Contact CTA** — clear next step

**Layout Patterns from Successful Artist Sites:**
- **Card-based information blocks** (Carrd-inspired) — each section as a visual card/panel
- **Multi-column grid on desktop** (2-3 cols), single column on mobile
- **Gold/cream accent** on key info (pricing, status) to draw attention
- **Icons + emoji** for visual scanning (♡ ✦ ● etc.) — common in artist communities
- **Subtle separators** or card gaps instead of lines

**Sources:** optimize.art (artist website guide), numberanalytics.com (digital art commissions guide), artfolio.com (2025 artist portfolio checklist), ArtStation/VGen/Carrd artist page analysis

### 2. Svelte 5 Card Grid Patterns with Tailwind Glassmorphism

**Responsive Grid Strategy:**
```svelte
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each sections as section}
    <Card {section} />
  {/each}
</div>
```
- `grid-cols-1` mobile → `md:grid-cols-2` tablet → `lg:grid-cols-3` desktop
- `gap-6` (24px) gives breathing room between glass cards

**Glassmorphism Card Implementation (Tailwind):**
```svelte
<div class="
  bg-white/[0.04]            /* semi-transparent base */
  border border-white/[0.08]  /* subtle glass border */
  rounded-2xl                 /* soft corners */
  backdrop-blur-md            /* frosted glass effect */
  p-6
  shadow-lg
  hover:bg-white/[0.06]       /* subtle hover lift */
  transition-all duration-300
">
  <!-- card content -->
</div>
```

**Key Tailwind Utilities for Glassmorphism:**
- Base opacity: `bg-white/[0.04]` or `bg-black/[0.1]` (use very low opacity — 0.04–0.08)
- Blur levels: `backdrop-blur-sm` (8px), `backdrop-blur-md` (12px), `backdrop-blur-lg` (16px)
- Border: `border border-white/[0.06]` to `border-white/[0.12]` — should be barely perceptible
- Hover lift: `hover:-translate-y-0.5 hover:shadow-xl` for interactive feeling
- Avoid `backdrop-blur` on every card if performance concerns — limit to key cards

**Dark Theme Glass Tips:**
- On dark backgrounds, use `bg-white/[0.04]` for glass (brighter glass against dark void)
- Higher border opacity `border-white/[0.1]` helps define card edges on very dark bg
- For gold-accented cards (like status): `border-gold/[0.15]` as accent border
- Important: `backdrop-blur` only works when content is visible behind the element — ensure the space/starfield background is present

**Performance Considerations:**
- `backdrop-filter` is GPU-accelerated in modern browsers but heavy if overused
- For card grids with 5+ cards, consider applying blur only to 1-2 featured cards
- `will-change: transform` on hover elements for smooth animation
- Test on mid-range mobile devices — blur effects can cause jank

**Sources:** thesavvy.dev (glassmorphism card gallery guide), flyonui.com (Tailwind glassmorphism guide), tailkits.com (glassmorphic card component), TWColors glassmorphism recipe, Flowbite Svelte cards

### 3. Commission Pricing & ToS UX

**Pricing Display Patterns:**
| Method | Best For | UX Notes |
|--------|----------|----------|
| Flat rate cards | Simple/small menus | Clean and scannable; use `font-space` for numbers |
| "Contact for quote" | Variable complexity work | Include tier hints (e.g., "Full body + BG: RMXXX–RMXXX") |
| Tiered packages | Structured services | 3 tiers max — avoid decision paralysis |

**ToS Display UX (from artist community research):**
- **50% upfront / 50% on completion** — industry standard for digital art commissions
- **2-4 week turnaround** — typical timeline range
- **Unlimited sketch revisions** — common offering; detailed revisions limited after sketch phase
- **Copyright:** Artist retains copyright, client gets personal use rights — standard boilerplate
- **AI training prohibition** — increasingly common and important clause
- **Commercial use** — usually negotiated separately, often at higher rate

**Dos & Don'ts Layout Pattern:**
- Two-column mini layout: ✅ column + ❌ column
- Keep each item short (1-3 words) — "OCs, Fanart, References" / "NSFW, AI Training, Commercial"
- Use emoji for instant visual categorization — artists on VGen/Carrd universally do this
- Consider icons alongside text for accessibility

**Status Badge UX:**
- Green dot + "● Open" — immediate positive signal
- Pulsing dot animation draws attention — `@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }`
- Placement: ideally sticky somewhere visible, or at page top
- When closed: dim/grey the page or show muted badge
- CTA after status: "DM to discuss your idea ✦" — clear, friendly call to action

**Sources:** tosexamples.carrd.co (artist TOS examples), artistsaware.com (detailed sample TOS), reddit.com/r/artbusiness (artist TOS discussions), VGen/Carrd artist page observation

### 4. Accessibility for Commission Pages

**Gold Text on Dark Background — Contrast Requirements:**
- WCAG 2.1 AA requires minimum **4.5:1** for normal text, **3:1** for large text (18px+ bold or 24px+ regular)
- `#d4a853` gold on `#0a0a1a` navy: approximate ratio ~ **5.8:1** — PASSES AA for all text sizes ✓
- `#b8953a` brass on `#0a0a1a`: approximate ratio ~ **4.2:1** — PASSES AA for large text only (use sparingly)
- Gold on `#1a3a5c` space blue: approximate ratio ~ **3.5:1** — fails AA for normal text, okay for large
- **Best practice for card headings:** Use `#d4a853` gold on card bg `rgba(255,255,255,0.04)` over `#0a0a1a` — the deep navy provides sufficient contrast
- **Avoid using gold text on mid-tone backgrounds** (space blue `#1a3a5c`)
- **For body text** inside cards, use `#8899aa` (muted sky grey on dark card bg) — check contrast against `rgba(255,255,255,0.04)` background

**Quick contrast sanity check:**
| Text Color | Background | Ratio | Verdict |
|-----------|-----------|-------|---------|
| `#d4a853` gold | `#0a0a1a` navy | ~5.8:1 | ✅ AA all text |
| `#d4a853` gold | `rgba(255,255,255,0.04)` on `#0a0a1a` | ~5.5:1 | ✅ AA all text |
| `#f0eae8` cream | `#0a0a1a` navy | ~15:1 | ✅ Exemplary |
| `#8899aa` sky grey | `rgba(255,255,255,0.04)` on `#0a0a1a` | ~5:1 | ✅ AA normal text |
| `#b8953a` brass | `#0a0a1a` navy | ~4.2:1 | ⚠️ large text only |

**Screen-Reader Friendly Pricing:**
- Use semantic HTML: `<section>` with `aria-labelledby` for each pricing block
- Pricing tables should use proper `<table>` with `<caption>` or use `<dl>` (definition list) for pairs of tier-name + price
- Avoid relying solely on visual formatting (gold color, spacing) — ensure text labels are meaningful
- Add `aria-label` to status badges: `<span role="status" aria-label="Commission status: open">● Open</span>`
- Colour alone should never convey information — pair gold styling with text like "★ Featured" or text labels

**Other A11y Considerations:**
- Ensure all interactive cards have `focus-visible` outlines (don't remove `:focus` without replacement)
- Card grid should navigate by Tab in DOM order
- Use `font-space` (Space Grotesk) for data-heavy text — Space Grotesk has good legibility at small sizes
- Animated elements (pulsing status dot, star twinkle) should respect `prefers-reduced-motion`
- Minimum touch target 44×44px for mobile buttons/links

**Sources:** WebAIM contrast checker, W3C WCAG 2.1 Understanding 1.4.3, MDN Web Docs color contrast guide, allaccessible.org 2025 WCAG guide

### 5. Svelte 5 Reactive Patterns for Commission Page Data

**When to Use Each Rune:**

| Rune | Use Case | Example in Commission Page |
|------|----------|---------------------------|
| `$state()` | Mutable data that changes over time | `let isOpen = $state(true);` — commission status toggle |
| `$state.raw()` | Large objects/arrays reassigned entirely | `let pricingTiers = $state.raw([...]);` — pricing data from JSON |
| `$derived()` | Values computed from $state | `let statusColor = $derived(isOpen ? '#22c55e' : '#6b7280');` |
| `$derived.by()` | Complex computed values | Status text, filtered pricing, layout classes |
| `$effect()` | Side effects (avoid unless necessary) | Logging, analytics, syncing to localStorage |
| `$props()` | Component inputs | `let { sections, status } = $props();` |

**Best Practices from Svelte Docs:**
- **Only use `$state` for variables that should be reactive** — everything else is a normal variable
- **Use `$derived` instead of `$effect` for computed values** — avoids unnecessary effect chains
  ```svelte
  // ✅ GOOD
  let statusLabel = $derived(isOpen ? 'Open' : 'Closed');

  // ❌ BAD
  let statusLabel = $state('');
  $effect(() => { statusLabel = isOpen ? 'Open' : 'Closed'; });
  ```
- **`$derived` takes an expression, `$derived.by` takes a function** — use `.by` for multi-line computations
- **`$effect` is an escape hatch** — use for syncing with external systems, not for deriving state
- **`$props` as a single destructuring call** — treat props as if they will change
  ```svelte
  let { title, items, variant = 'default' }: Props = $props();
  // use $derived for values depending on props
  let headingClass = $derived(variant === 'featured' ? 'text-gold' : 'text-cream');
  ```

**Commission Page Reactive Architecture Pattern:**
```svelte
<script lang="ts">
  // Props
  let {
    status: initialStatus = 'open',
    sections = []
  }: {
    status: string;
    sections: Section[];
  } = $props();

  // Derived state
  let isOpen = $derived(initialStatus === 'open');
  let statusColor = $derived(isOpen ? '#22c55e' : '#6b7280');
  let statusText = $derived(isOpen ? '● Open' : '✕ Closed');
  let statusLabel = $derived(isOpen
    ? 'Open for commissions! DM to discuss your idea ✦'
    : 'Commissions currently closed');

  // No $effect needed for this page — everything is derived from props
</script>
```

**Key Rule for Commission Page:** Since the commission page is a static data presentation (props/JSON in, rendered out), you likely need **zero `$effect` calls**. Everything is `$state` (if toggles needed) or `$derived` (computed display values). This aligns with Svelte's best practices.

**Sources:** svelte.dev/docs/svelte/best-practices, teta.so (Svelte 5 runes complete guide), fullstacksveltekit.com (Svelte 5 runes guide), devtooleasy.com (Svelte 5 cheat sheet)

### 6. Scroll-Snap Accessibility Best Practices

**Scroll-Snap Layout Audit for the Voyager Site:**

The scroll-snap setup (3 pages, full viewport, `scroll-snap-type: y mandatory`) has specific accessibility concerns:

**Keyboard Navigation Gap:**
- Scroll containers are NOT naturally keyboard-focusable — keyboard users Tab through interactive elements, not scroll positions
- This means: Tab → Portfolio → (skips commission page) → About Me
- **Fix:** Add `tabindex="0"` to each scroll-snap section so keyboard users can focus into them and use arrow keys to scroll

**Implementation Pattern:**
```svelte
<!-- Each scroll section needs: -->
<section
  data-page={index}
  tabindex="0"
  role="region"
  aria-label="Page {index + 1}: {pageNames[index]}"
  class="scroll-section"
>
  <!-- content -->
</section>
```

**Specific Guidelines for this Site:**
1. **`tabindex="0"`** on each `.scroll-section` — puts sections in tab order
2. **`role="region"` + `aria-label`** — screen reader announces "Portfolio region", "Commissions region" etc.
3. **`aria-roledescription="scrollable section"`** — adds context for screen reader users
4. **Visible focus styles** — `outline` or `ring` on `:focus-visible` for keyboard users (don't hide outlines)
5. **`prefers-reduced-motion`** — respect user motion preferences; ensure scroll-snap still works but without smooth-scroll animation

**Navigation Sidebar + Scroll-Snap Integration:**
- Nav tab clicks should smoothly scroll to the corresponding section
- When user Tabs through nav, highlight corresponding section
- Ensure nav tabs have proper `role="tab"`, `aria-selected`, and `aria-controls` pointing to section IDs

**Scroll-Snap Type Consideration:**
- `scroll-snap-type: y mandatory` — strong snapping, always snaps to nearest section
  - Pro: Clean UX, always on a section boundary
  - Con: Can feel aggressive; user may struggle to stop mid-section to read long content
- `scroll-snap-type: y proximity` — softer snapping, only snaps when close to boundary
  - Better for reading-heavy pages (commission info has cards to read)
  - **Recommendation:** Use `proximity` instead of `mandatory` for the commission page since users need to read content within a section

**CSS Fix for Keyboard Scroll Support (from CSS-Tricks):**
```css
.scroll-section {
  scroll-snap-align: start;
  /* Ensure sections are focusable for keyboard users */
}

/* Focus indicator — MUST be visible */
.scroll-section:focus-visible {
  outline: 2px solid #d4a853;
  outline-offset: -2px;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .scroll-container {
    scroll-behavior: auto;
  }
}
```

**Sources:** web.dev (CSS scroll snap article), CSS-Tricks (keyboard users can't scroll overflow), W3C WAI keyboard interface practices, MDN scroll-snap docs, WebAIM tabindex best practices

## Oracle Findings — Phase 3

### CommissionInfo Architecture
- **Single component** with section comments — no sub-components needed at this stage
- **Only one prop:** `status: 'open' | 'closed'` for the commission status badge
- All other content (pricing, ToS, DOs/DON'Ts, payment methods, header) is **static hardcoded**

### Layout
- **Grid confirmed** as correct choice: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Smart spanning:** ToS card should span `lg:col-span-2` (it's the most content-heavy)
- Payment + Status cards stay compact in single columns

### Scroll Integration Steps
1. Remove ComingSoon dynamic import (`import('$lib/components/ComingSoon.svelte')`)
2. Add static import: `import CommissionInfo from '$lib/components/CommissionInfo.svelte'`
3. Update `pageNames` from `['About Me', 'Coming Soon']` → `['Portfolio', 'Commissions', 'About Me']`
4. Update `tabColors` to 3 items
5. Update `tabIcons` to 3 items
6. Update `tabRotations` to 3 items
7. Add `<GlitterOverlay count={10} />` to commission section
8. Add a stub About Me section (page 2) to prevent IntersectionObserver tab-index mismatch

### ⚠️ Critical Pitfalls
1. **Tab-index mismatch** — If About Me section doesn't exist yet, tab for page 2 has no target → add a stub section immediately
2. **IntersectionObserver flicker** — Change threshold from `0.5` to `[0.4, 0.6]` for 3 pages
3. **`scroll-snap-stop: always`** — May feel sluggish on all 3 sections; consider `scroll-snap-stop: normal` on inner pages
4. **tabColors reduction** — Safe because `% tabColors.length` handles it automatically
5. **ComingSoon.svelte** — Becomes dead code; either delete or archive after Phase 3
6. **Green status badge** — Verify `#22c55e` on `#0a0a1a` passes contrast (should be fine but check)
7. **Scroll hint** — Direction should say "scroll down" (not "scroll to start")

### Current Bug
`pageNames = ['About Me', 'Coming Soon']` is **mislabeled** — clicking "About Me" scrolls to Portfolio. Phase 3 fix (`['Portfolio', 'Commissions', 'About Me']`) naturally resolves this.

### Phase 4 Globe Asset
Recommended: **Wikimedia equirectangular SVG** (Public Domain), styled gold-on-navy, animated via CSS `background-position` loop. More Voyager-appropriate than photorealistic NASA imagery.

## Explorer Findings — Phase 3

### Scroll-Snap Structure
- Layout uses `pageNames`, `tabColors`, `tabIcons`, `tabRotations` arrays with modulo indexing in `{#each}`
- Currently **2 pages**: page 0 = Portfolio (labeled "About Me"), page 1 = ComingSoon (labeled "Coming Soon")
- IntersectionObserver with `0.5` threshold drives `currentPage` state (`src/routes/+page.svelte:56-69`)
- `scroll-snap-align: start` + `scroll-snap-stop: always` on each section

### Import Patterns
- **Portfolio** and **GlitterOverlay** are static imports
- **ComingSoon** is dynamically imported inside `onMount` via `import('$lib/components/ComingSoon.svelte')`
- For Phase 3: CommissionInfo should be **static import** (always shown), remove lazy import + ComingSoon types

### CSS Patterns
- **Glassmorphism formula**: `bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur`
- **Font hierarchy**: `font-amoria` (titles/headers), `font-caviar` (body/labels), `font-space` (minimal)
- **Gold gradient**: `linear-gradient(135deg, ...)` with `background-clip: text; -webkit-background-clip: text`
- **No grid usage yet** — CommissionInfo will introduce `grid-cols-2 lg:grid-cols-3`

### Svelte 5 Patterns
- `$state()`, `$derived()`, `$props()` used consistently
- No `$effect()` anywhere — all side effects via `onMount`
- `{@render children()}` for slots

### Responsive Design
- Fluid `clamp()` typography: `text-[clamp(2.8rem,11vw,5.5rem)]`
- `h-[100dvh]` for viewport sections
- Tailwind responsive prefixes: `md:`, `lg:`

### ComingSoon Replacement
- Uses purple tones (`#3a2248`, `#b0a6be`) — doesn't match Voyager palette
- Cat heart images (`cat_heart.webp`/`cat_heart.gif`) can be cleaned up post-removal

### Summary of Phase 3 Recommendations

| Topic | Key Recommendation |
|-------|-------------------|
| **Commission page layout** | Card-based grid, 1-col mobile → 3-col desktop, status-first hierarchy |
| **Glass cards** | `bg-white/[0.04] backdrop-blur-md border-white/[0.08] rounded-2xl` in Tailwind |
| **Pricing UX** | Flat rate or "contact for quote" with tier hints; clear ToS at 50/50 split |
| **Gold contrast** | `#d4a853` on `#0a0a1a` passes AA (~5.8:1); avoid gold on mid-blue |
| **Svelte 5 reactivity** | Use `$derived()` for computed values, avoid `$effect` — commission page is static |
| **Scroll-snap a11y** | Add `tabindex="0"` + `aria-label` + `role="region"` to each section; prefer `proximity` over `mandatory` |
| **Status badge** | Green pulsing dot `● Open` with gold accent card, `role="status"` for a11y |
| **Motion safety** | Wrap animations in `@media (prefers-reduced-motion: no-preference)` |

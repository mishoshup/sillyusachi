# Research: Sillyusachi Site — Voyager R1999 Theme Overhaul

## Librarian Findings — Phase 1 & 2 (Existing)

Same as original content.

## Librarian Findings — Phase 3

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

## Explorer Findings — Phase 3

### 1. Scroll-Snap Structure (`src/routes/+page.svelte`)

**Defined at module level (lines 39–44):**
```ts
const pageNames = ['About Me', 'Coming Soon'];
const tabColors = ['#1a3a5c', '#2a4a6c', '#3a5a7c', '#7ba7c9', '#5a8ab5'];  // Voyager blues
const tabIcons = ['✦', '♡', '⊹', '★', '˚'];
const tabRotations = [-1, 1.5, -0.5, 2, -1.5];
```

**Usage in template (lines 93–109):**
- Iterated with `{#each pageNames as name, i}`
- Each `<button class="nav-tab">` uses `tabColors[i % tabColors.length]`, `tabRotations[i % tabRotations.length]`, and `tabIcons[i % tabIcons.length]`
- The modulo means the color/icon/rotation arrays can be longer than page count (currently 5 entries vs 2 pages)

**Key variables:**
- `currentPage = $state(0)` — tracks active page index
- `navExpanded = $state(false)` — master toggle for all tabs

**Scroll container (line 373):** `<main class="h-[100dvh] w-full overflow-y-auto" style="scroll-snap-type: y mandatory; scrollbar-width: none;">`

**Page sections (lines 380–397):**
```svelte
<section data-page="0" class="h-[100dvh] w-full relative" style="scroll-snap-align: start; scroll-snap-stop: always;">
  <GlitterOverlay count={20} />
  <Portfolio />
</section>
<section data-page="1" class="h-[100dvh] w-full relative" style="scroll-snap-align: start; scroll-snap-stop: always;">
  <GlitterOverlay count={15} />
  {#if ComingSoon}
    <ComingSoon />
  {/if}
</section>
```

**IntersectionObserver (lines 56–71):**
- Watches all `[data-page]` elements
- Threshold: 0.6, rootMargin: none
- Updates `currentPage` when `intersectionRatio >= 0.5`

**scrollToPage function (lines 74–77):**
- Queries `[data-page="${index}"]` and scrolls to `el.offsetTop`

**REQUIRED CHANGES for Phase 3:**
- `pageNames` → `['Portfolio', 'Commissions', 'About Me']` (3 items)
- `tabColors` → `['#7ba7c9', '#d4a853', '#5a8ab5']` (3 items, matching proposed color scheme)
- `tabIcons` → `['✦', '♡', '⊹']` (3 items)
- `tabRotations` → `[-1, 1.5, -0.5]` (3 items)
- Add third `<section data-page="2">` for About Me (moving existing Portfolio section — the old About Me page is actually the Portfolio component)
- Add `<section data-page="1">` for Commissions between Portfolio and About Me
- Update order: Portfolio (0) → Commissions (1) → About Me (2)

### 2. Import Patterns (`+page.svelte` lines 3–11)

**Static imports (always loaded):**
```ts
import Portfolio from '$lib/components/Portfolio.svelte';
import GlitterOverlay from '$lib/components/GlitterOverlay.svelte';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from '@lucide/svelte';
```

**Dynamic import (lazy-loaded):**
```ts
import type ComingSoonComponent from '$lib/components/ComingSoon.svelte';
let ComingSoon: typeof ComingSoonComponent | null = $state(null);
// in onMount:
import('$lib/components/ComingSoon.svelte').then((mod) => { ComingSoon = mod.default; });
```

**Template usage of dynamic import:**
```svelte
{#if ComingSoon}
  <svelte:component this={ComingSoon} />
{/if}
```

**For Phase 3:** CommissionInfo should be a **static import** (the plan says it's always shown). Remove the lazy import for ComingSoon entirely. Add:
```ts
import CommissionInfo from '$lib/components/CommissionInfo.svelte';
```

### 3. CSS Class Patterns

**Glassmorphism (used in music player, line ~218):**
```
bg-[#080612]/60 backdrop-blur-2xl border border-white/10 rounded-2xl
```

**Dark card glass variant:**
```
bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur
```
— This is the pattern specified for CommissionInfo cards

**Typography classes:**
- `font-amoria` — elegant cursive (titles, decorative text)
- `font-caviar` — sans-serif (body text, labels, uppercase elements)
- `font-space` — 'Space Grotesk' (data-driven elements, specified minimal usage)
- `font-bold`, `font-normal` for weight
- `tracking-[0.08em]`, `tracking-[0.13em]`, `tracking-[0.18em]` — letter-spacing variants

**Gold gradient pattern (Portfolio.svelte line ~18):**
```css
.gold-gradient-text {
  background: linear-gradient(135deg, #f0eae8, #d4a853, #f0eae8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Button/nav hover effects:**
- `transition-all duration-300` for smooth transitions
- `hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(212,168,83,0.5)]` for gold glow on hover
- `active:scale-95` for press feedback

**Key custom CSS animations (from app.css):**
- `.floating-element` — `@keyframes float` (translateY oscillation, 6s)
- `@keyframes twinkle` — opacity oscillation
- `@keyframes floatStar` — translateY + rotate
- `@keyframes rotateEarth` — full rotation (unused currently, reserved)

### 4. Responsive Design Patterns

**Viewport sizing:**
- `h-[100dvh]` — dynamic viewport height, accounts for mobile toolbars
- `w-full` for full width
- Scroll container: `touch-action: pan-y` — restricts touch to vertical only

**Fluid typography:**
```css
font-size: clamp(3.5rem, 16vw, 7rem)
font-size: clamp(2.8rem, 11vw, 5.5rem)
```

**Responsive Grid (Portfolio uses flex, not grid):**
- Plan specifies `grid-cols-2 lg:grid-cols-3` for CommissionInfo cards, `1 column on mobile`
- This will be the first grid layout in the project

**Mobile-first padding:**
- `px-4`, `py-8 sm:py-12` — more vertical padding on larger screens
- `hidden sm:flex` — show elements starting from sm breakpoint

**No responsive-specific JavaScript** — all responsive behavior via CSS/Tailwind

### 5. Current Page Count & Expansion to 3 Pages

**Current state (2 pages):**
| Index | pageNames[i] | data-page | Component | GlitterOverlay count |
|-------|-------------|-----------|-----------|---------------------|
| 0 | 'About Me' | `data-page="0"` | Portfolio.svelte | 20 |
| 1 | 'Coming Soon' | `data-page="1"` | ComingSoon.svelte (lazy) | 15 |

**Target state (3 pages, reordered):**
| Index | pageNames[i] | data-page | Component | GlitterOverlay count |
|-------|-------------|-----------|-----------|---------------------|
| 0 | 'Portfolio' | `data-page="0"` | Portfolio.svelte | 20 |
| 1 | 'Commissions' | `data-page="1"` | CommissionInfo.svelte | 10 |
| 2 | 'About Me' | `data-page="2"` | Portfolio.svelte | 15 |

**Note:** The current "About Me" page IS the Portfolio.svelte component (the page shows socials, bio, etc. — it's the landing page). The Phase 3 plan renames this nav label to "Portfolio" for page 0, adds a Commissions page (new component) as page 1, and renames the existing nav label for page 2 to "About Me" (same Portfolio component shown again, or a trimmed-down About Me — the plan says wrap "Studio page with data-page=1" which might mean a separate About Me component, but the plan says to use the same scroll position approach).

**Actually — re-reading the plan more carefully:**
- Task 2 says: "Add a new `<section data-page="1">` after the Portfolio section" and "Wrap Studio page with `data-page="1"` scroll-snap attrs"
- And `pageNames: ['Portfolio', 'Commissions', 'About Me']`
- This means the current Portfolio component stays as page 0 (renamed "Portfolio"), a new CommissionInfo goes in page 1, and the old About Me (Portfolio component again, or a trimmed version) becomes page 2

### 6. Svelte 5 Runes Patterns Across Components

**$props() — component props (GlitterOverlay.svelte line 6):**
```ts
interface Props {
  count?: number;
  color?: string;
}
let { count = 15, color = '#a9c4db' }: Props = $props();
```

**$state() — reactive local state (multiple files):**
```ts
let stars = $state<Star[]>([]);  // GlitterOverlay
let currentPage = $state(0);     // +page.svelte
let isPaused = $state(true);     // +page.svelte
```

**$derived() — computed values (+page.svelte line 29):**
```ts
let progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
```

**{@render children()} — slot content (+layout.svelte line ~59):**
```svelte
{@render children()}
```

**No $effect() usage anywhere yet** — all effects handled via `onMount` from 'svelte' (Svelte 4 lifecycle, still available in Svelte 5)

**TypeScript everywhere:** all `<script>` blocks use `lang="ts"`

**Interface pattern for typed arrays (GlitterOverlay):**
```ts
type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  char: string;
  color: string;
};
```

### 7. ComingSoon Component — Structure to Replace

**File:** `src/lib/components/ComingSoon.svelte` (1050 bytes, 32 lines)

**Imports:**
```ts
import catHeartWebp from '$lib/images/cat_heart.webp';
import catHeartGif from '$lib/images/cat_heart.gif';
```

**Structure:**
```svelte
<div class="relative h-full flex flex-col items-center justify-center gap-6 text-center px-8 overflow-hidden">
  <div class="relative z-10 flex flex-col items-center gap-5">
    <picture>
      <source srcset={catHeartWebp} type="image/webp"/>
      <img src={catHeartGif} alt="" class="w-16 h-auto floating-element"/>
    </picture>
    <h2 class="font-amoria text-[clamp(2.8rem,11vw,5.5rem)] leading-none text-[#3a2248]">
      something's<br />coming ✦
    </h2>
    <p class="font-amoria text-[#b0a6be] text-lg">‧₊˚ ⋅ ⊹˚. ♡</p>
  </div>
</div>
```

**What it's being replaced by:** CommissionInfo.svelte with full layout:
- Header (title with gold accent)
- Gallery placeholder card
- Pricing card
- Terms of Service card
- Dos & Don'ts card (two-column mini layout)
- Payment methods card
- Commission Status card with pulsing green dot
- Scroll hint at bottom

**Color notes:** The ComingSoon component uses purple tones (`#3a2248`, `#b0a6be`) which contrast with the Voyager blue-gold-cream palette. CommissionInfo will use the proper Voyager palette: `#d4a853` gold, `#8899aa` muted sky-grey, `#f0eae8` cream, `#0a0a1a` deep navy background.

**Images to remove from source:** The cat_heart images (`$lib/images/cat_heart.webp` and `$lib/images/cat_heart.gif`) are only used by ComingSoon and can be cleaned up after the component is removed.

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

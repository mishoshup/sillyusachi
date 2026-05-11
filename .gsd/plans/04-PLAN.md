# Phase 04: New About Me (Voyager) Page

## Goal
Create the Voyager-themed About Me page with CSS rotating earth globe and personal info grid, wired as page 3.

## Tasks

### Task 1: Download earth globe world map asset
**Files:** `static/world-map.jpg` (new)

**Action:**
- Download a public-domain equirectangular world map to `static/world-map.jpg`
- **Recommended source:** NASA Blue Marble equirectangular at 800×400px (~30-60KB)
- URL: `https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg` (2048×1024, ~500KB — resize if possible, or use as-is)
- Alternative: Wikimedia Commons SVG (but SVG is 1.26MB — too large)
- **Keep file small** (<100KB ideal)
- Set as `background-image` for the CSS earth globe

**Verify:** `ls static/world-map.jpg` exists
**Done:** World map image available for CSS earth globe rotation

### Task 2: Create AboutMe component
**Files:** `src/lib/components/AboutMe.svelte` (new)

**Action:**
- Create Svelte 5 component with `$props()` runes + `$derived()` — NO `$effect()`
- Props (all with defaults): `{ name, age, subtitle, favSong, games, specialInterest, birthday, typoQuote, favoriteCharacters, location }`
- Single centered glass card layout: `max-w-[600px] mx-auto p-6 md:p-8`

**Sections:**

**Header:**
- "Sillyusachi" in `font-amoria`, gold gradient text
- Subtitle: "{subtitle}" in `font-caviar`, `#8899aa` muted

**Earth Globe (CSS-only):**
- Single `<div>` with circular shape (`w-[110px] h-[110px] rounded-full`)
- `background-image: url('/world-map.jpg')` with `background-size: auto 100%`
- **New keyframe** `earth-rotate` in `<style>`: animates `background-position-x` from `0` to `-200%` over 12s (or whatever covers 2 full map widths)
- Hemisphere shading: `box-shadow: inset 12px 0 20px rgba(0,0,0,0.6), inset -6px 0 12px rgba(0,0,0,0.3)`
- Atmospheric glow via `::after`: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.08), transparent 60%)`
- `will-change: background-position` + `transform: translateZ(0)` for GPU compositing
- `prefers-reduced-motion` fallback: pause animation
- Label: "← earth — home" below globe in `#8899aa` font-caviar

**Info Grid (2 columns on desktop, 1 on mobile):**
- `grid grid-cols-1 md:grid-cols-2 gap-3`
- Each item in a mini glass card: same `bg-white/[0.04] border-white/[0.08]` pattern
- Labels: `#7ba7c9` sky-blue, font-caviar bold, uppercase, tiny
- Values: `#f0eae8` cream, font-caviar
- Items:
  1. **Fav Song:** `{favSong}` (prop)
  2. **Games:** `{games}` (prop)
  3. **Special Interest:** `{specialInterest}` (prop)
  4. **Birthday:** `{birthday}` (prop)
  5. **My Typo™:** gold `#d4a853` font-amoria italic — spans full width (`md:col-span-2`)
  6. **Favourite Characters:** `{favoriteCharacters}` (prop) — spans full width
  7. **Location:** `{location}` (prop)

**Quote Footer:**
- "the stars incline us, they do not bind us." in `font-amoria` italic, `#8899aa` muted
- Centered below info grid

**Styling:**
- Card wrapper: `bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl shadow-[0_0_20px_rgba(212,168,83,0.08)]`
- Items: same glass card pattern, `p-3 rounded-xl`
- Gold border on Typo card: `border-gold/[0.2]`
- Scroll hint at bottom: "scroll up ⭫" in muted text
- Wrap animations in `@media (prefers-reduced-motion: no-preference)`

**Done:** AboutMe.svelte created with earth globe + all info sections, builds without errors

### Task 3: Wire AboutMe into scroll layout (replace stub)
**Files:** `src/routes/+page.svelte`

**Action:**
- Add static import: `import AboutMe from '$lib/components/AboutMe.svelte';`
- Replace the About Me stub section `data-page="2"` with the real component
- Keep `<GlitterOverlay count={8} />` (sparsest)
- Keep existing `data-page`, `tabindex`, `role`, `aria-label` attributes
- Keep `tabindex="0" role="region" aria-label="About Me"`

Before (stub):
```html
<section data-page="2" class="..." tabindex="0" role="region" aria-label="About Me">
  <GlitterOverlay count={8} />
  <div class="h-full flex items-center justify-center">
    <p class="font-amoria text-[#8899aa] text-lg">about me coming soon ✦</p>
  </div>
</section>
```

After:
```html
<section data-page="2" class="h-[100dvh] w-full relative" style="scroll-snap-align: start; scroll-snap-stop: always; touch-action: pan-y;" tabindex="0" role="region" aria-label="About Me">
  <GlitterOverlay count={8} />
  <AboutMe />
</section>
```

**Done:** About Me page integrated as page 3, full 3-page layout complete

### Verify
- `npm run build` succeeds
- 3 pages scroll correctly: Portfolio → Commissions → About Me
- Earth globe rotates via CSS animation
- All info grid items display with correct content
- No purple tones anywhere

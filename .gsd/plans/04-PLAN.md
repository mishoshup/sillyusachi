# Phase 04: New About Me (Voyager) Page

## Goal
Create the Voyager-themed About Me page with earth globe display and personal info grid, wired as page 3.

## Tasks

### Task 1: Download earth globe world map asset
**Files:** `static/` — add `world-map.svg` or `world-map.jpg`

**Action:**
- Download a public-domain equirectangular world map image to `static/`
- Options:
  - Wikimedia Commons: Blue Marble equirectangular projection
  - NASA public domain earth textures
  - Simple stylized SVG world map (preferred — scalable, no loading issues)
- Save as `static/world-map-2-1.jpg` or `static/world-map.svg`
- Keep file small (<500KB ideally)

**Verify:** File exists in static/ directory
**Done:** World map image available for CSS earth globe

### Task 2: Create AboutMe component
**Files:** `src/lib/components/AboutMe.svelte` (new)

**Action:**
- Create Svelte 5 component with `$props()` runes
- Centered glass card layout (max-w 600px)

**Sections:**

**Header:** 
- "Sillyusachi" in font-amoria, gold gradient
- Subtitle: "Usachi · 18+ · voyager of dreams" in font-caviar, muted

**Earth Globe (CSS-only):**
- Single div with circular shape and world map background
- CSS `@keyframes rotate` animates `background-position-x` for rotation effect
- Hemisphere shading via `box-shadow: inset` and `::after` pseudo-element
- Label "← earth — home" below globe in muted text
- Size: 100-120px diameter, fits in card

**Info Grid (2 columns, mobile 1 column):**
- Each item in a glass-style mini-card with label + value
- **Fav Song:** 754 — Cece Natalie (value editable)
- **Games:** Genshin, HSR, ZZZ, etc. (value editable)
- **Special Interest:** Art, space, music, character design
- **Birthday:** August · Leo season
- **My Typo™:** italic gold quote — "i'm just a silly little guy lost in space" (font-amoria)
- **Favourite Characters:** comma-separated list (value editable)
- **Location:** Malaysia 🇲🇾 — below globe section

**Quote Footer:**
- "the stars incline us, they do not bind us." in font-amoria italic

**Styling:**
- Card wrapper: glassmorphism `bg-white/[0.04] backdrop-blur border border-white/[0.08]`
- Labels: `#7ba7c9` sky-blue, font-caviar bold, uppercase tiny
- Values: `#f0eae8` cream, font-caviar
- Gold accents on special items (My Typo)
- No light purple anywhere

**Done:** AboutMe.svelte created with earth globe + all info sections

### Task 3: Wire AboutMe into scroll layout
**Files:** `src/routes/+page.svelte`

**Action:**
- Import `AboutMe` (static import)
- Add new `<section data-page="2">` after the Commission section with scroll-snap attrs
- Add `<GlitterOverlay count={8} />` to About Me section (even sparser — like the edge of known space)
- Verify 3-page scroll works correctly

**Done:** About Me page integrated as page 3, full layout complete

### Task 4: Remove ComingSoon from page flow
**Files:** `src/routes/+page.svelte`

**Action:**
- Completely remove the ComingSoon dynamic import, the section that renders it, and any references to it
- Remove `import type ComingSoonComponent...` and `let ComingSoon...` lazy load
- Clean up now-unused variables and imports

**Verify:** No ComingSoon-related code remains in +page.svelte (can keep file in lib/components for future)
**Done:** ComingSoon removed from active page flow

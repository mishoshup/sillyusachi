# Phase 02: Component Restyling

## Goal
Restyle all existing components to Voyager dark celestial theme — nav, music player, Portfolio, and particle system.

## Tasks

### Task 1: Restyle GlitterOverlay → recolor to Voyager
**Files:** `src/lib/components/GlitterOverlay.svelte`

**Action:**
- Keep the same component structure (DOM-based character particles with CSS animation)
- Update color array: remove pink `#f2b8d4`, remove light purple `#deefef` — keep only `#ffffff`, `#7ba7c9`, `#d4a853`
- Change character set to celestial symbols only: `['✦', '⊹', '˚', '✧', '⋆', '･', '｡']`
- Reduce count: the component receives `count` prop from parent so default stays 15 but callers will pass lower numbers (10-25)
- Make twinkle animation ethereal/slower — increase `@keyframes y2k-twinkle` animation duration range to 4-6s

**Verify:** Particles render in white/blue/gold only, no pink/purple
**Done:** GlitterOverlay recolored to Voyager palette

### Task 2: Restyle navigation sidebar
**Files:** `src/routes/+page.svelte` (nav section of component + `<style>`)

**Action:**
- Keep ALL rotation mechanics unchanged (`.nav-tab` with `transform: rotate(var(--rot)) translateX(...)`)
- Keep tab rotation animations (hover slide-out, expand all)
- Keep nav toggle button behavior
- Replace `tabColors` array: `['#f2b8d4', '#a9c4db', '#b8d4a9', '#d4b8f2', '#a9d4c4']` → `['#1a3a5c', '#2a4a6c', '#3a5a7c', '#7ba7c9', '#5a8ab5']` (shades of blue only)
- Replace `tabIcons` array: keep celestial style `['✦', '♡', '⊹', '★', '˚']`
- Replace `tabRotations` array: keep similar playful angles `[-1, 1.5, -0.5, 2, -1.5]`
- Update nav button CSS: 
  - Background: `linear-gradient(160deg, #1a3a5c, #0a0a2a)` for toggle, blue-toned `var(--bg)` for tabs
  - Text color: `#f0eae8` instead of `#3a2248`
  - Active state: gold left-border glow `box-shadow: 2px 2px 20px rgba(212,168,83,0.15)`
  - Hover: same gold glow
- Update `.tab-label`, `.tab-icon` colors: `color: #f0eae8` cream
- Remove `#3a2248` from all nav-related styles

**Verify:** Nav still peeks out, slides on hover, toggle expands all — colors are blue/gold/cream
**Done:** Nav restyled, same mechanics, Voyager colors

### Task 3: Restyle music player
**Files:** `src/routes/+page.svelte` (music player section)

**Action:**
- Keep ALL variables, functions, event handlers, audio element, track data EXACTLY as-is
- Change ONLY visual properties (colors, backgrounds, shadows):
  - Mini pill: `bg-[#080612]/70 backdrop-blur-2xl border border-white/10` with gold hover glow
  - Vinyl: keep conic-gradient but use dark space colors (`#0a0a1a`, `#0f0a1a`, `#8899aa`) with gold center label `#d4a853` — NO purple tones
  - Vinyl animation: keep spinning, use same speed
  - Expanded player: `bg-[#080612]/60 backdrop-blur-2xl border border-white/10`
  - Track name text: cream `#f0eae8` (was `#3a2248`)
  - Artist/album text: `#8899aa` sky-grey (was `#7c6a8e` — avoid purple `#b0a6be`)
  - Progress bar gradient: `from-[#d4a853] to-[#7ba7c9]` (was from-blue to-pink)
  - Play button: gold gradient `from-[#d4a853] to-[#b8953a]`
  - Volume slider: `accent-[#d4a853]`
  - Playlist: current track indicator in gold, hover state in blue
  - All `#3a2248` → `#f0eae8`, all `#7c6a8e` → `#8899aa` (muted sky-grey, NOT purple `#b0a6be`)

**Verify:** Play, pause, next, prev, seek, volume, mute all work identically
**Done:** Music player visually dark Voyager, functionally same

### Task 4: Restyle Portfolio page
**Files:** `src/lib/components/Portfolio.svelte`

**Action:**
- Remove flower GIF imports (`floreWebp`, `floreGif`) and `<picture>` section
- Replace with celestial SVG decorative element (concentric rings + star center — like the mockup draft)
- Name heading `Sillyusachi`: add gold gradient via `background: linear-gradient(135deg, #f0eae8, #d4a853, #f0eae8)` with `-webkit-background-clip: text`, `-webkit-text-fill-color: transparent`
- Change all `text-[#3a2248]` → `text-[#f0eae8]` (cream)
- Change `text-gray-700` → custom muted color `#c8c0d0`
- Social icons: `bgColor` from `#A9C4DB` to `#1a3a5c` (space blue), `fgColor` `#eeeeee` → `#f0eae8`
- Add subtle gold hover glow effect on social links via group-hover shadow
- Scroll hint colors: `#3a2248` → `#8899aa` (muted sky-grey, NOT purple)

**Verify:** No light purple colors, no flower GIF, gold gradient name, all socials work
**Done:** Portfolio dark restyle complete

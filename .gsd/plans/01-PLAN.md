# Phase 01: Theme Foundation

## Goal
Establish the Voyager dark celestial theme foundation across the entire site — Tailwind color tokens, fonts, layout background, and global styles.

## Tasks

### Task 1: Add Space Grotesk + update Tailwind theme tokens
**Files:** `src/app.css`

**Action:**
- Add `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap')` for minimal Space Grotesk usage
- Add `--font-space: 'Space Grotesk', sans-serif` to `@theme`
- Add Voyager color tokens to `@theme`:
  - `--color-deep-navy: #0a0a1a` (exact locked value)
  - `--color-space-blue: #1a3a5c`
  - `--color-sky-blue: #7ba7c9`
  - `--color-gold: #d4a853`
  - `--color-gold-dark: #b8953a`
  - `--color-cream: #f0eae8`
  - `--color-muted: #8899aa` (muted sky-grey — NOT purple `#b0a6be`)
- Keep existing `--font-amoria` and `--font-caviar`
- Add keyframe animations for star twinkle, floating stars, and earth rotation
- Update body base styles: dark background `#0a0a1a`, cream text `#f0eae8`

**Verify:** `grep -c '#3a2248\|#e3f0e2\|#deefef' src/app.css` returns 0
**Done:** app.css has dark palette tokens, no light purple, new animations added

### Task 2: Update layout background to space gradient
**Files:** `src/routes/+layout.svelte`

**Action:**
- Change wrapper div background from pastel gradient `from-[#deefef] via-[#f5ddee] to-[#e3f0e2]` to deep space `from-[#0a0a1a] via-[#0a0a2a] to-[#0d0d30]` — pure navy/deep blue, NO purple/violet tones
- Keep all HTML head content (SEO, meta tags, JSON-LD) unchanged
- Keep `{@render children()}` unchanged

**Verify:** Layout renders dark gradient, all meta/SEO intact
**Done:** Dark space background, no pastel colors in layout

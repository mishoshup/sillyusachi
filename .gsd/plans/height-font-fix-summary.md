# Height + Font Fix Summary

## Fix 1: Section Height at SSR (✓ Applied)
**File:** `src/routes/+page.svelte`

Added `min-h-[100dvh]` to all 3 `<section>` elements (data-page="0", "1", "2"):
- Portfolio section
- Commissions section
- About Me section

This ensures sections have minimum full-viewport height **before** JavaScript runs, preventing the 0px flash while `scroll.js` loads.

## Fix 2: Font Preload (✓ Applied)
**File:** `src/routes/+layout.svelte` — inside `<svelte:head>`

Added 2 preload links:
- `/AMORIA.woff2` — font/woff2, crossorigin
- `/CaviarDreams.woff2` — font/woff2, crossorigin

This tells the browser to download these fonts immediately, preventing Flash of Unstyled Text (FOUT) where fallback fonts (Arial) show while Caviar Dreams / Amoria is loading.

## Build Verification (✓ Passed)
`npm run build` completed successfully in ~7.25s with no errors.

Pre-existing warnings (not caused by these changes):
- `a11y_no_redundant_roles` × 3 (`role="region"` on section elements — section already has implicit region role)
- `a11y_no_noninteractive_tabindex` × 3 (tabindex="0" on noninteractive section elements)
- `state_referenced_locally` × 2 (GlitterOverlay.svelte — pre-existing)
- CSS @import rule ordering warning (pre-existing)

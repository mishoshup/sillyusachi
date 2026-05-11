# Phase 03: New Commission Info Page

## Goal
Create the Commission Info page component and wire it into the scroll layout as page 2 (replacing ComingSoon placeholder).

## Tasks

### Task 1: Create CommissionInfo component
**Files:** `src/lib/components/CommissionInfo.svelte` (new)

**Action:**
- Create a new Svelte 5 component using `$props()` runes
- Full viewport height content (the parent scroll-snap handles sizing)
- Layout: centered content with responsive card grid

**Sections (displayed in cards):**
1. **Header:** "commission info" title with gold accent on "info" — font-amoria, cream text
2. **Gallery:** placeholder card with dashed border, text "art samples coming soon ✦"
3. **Pricing:** "contact for current rates, varies by complexity" with tier hint
4. **Terms of Service:** 50% upfront / 50% on completion, 2-4 week turnaround, unlimited sketch revisions
5. **Dos & Don'ts:** two-column mini layout inside card — ✅ OCs, fanart, references / ❌ NSFW, AI training, commercial use
6. **Payment:** PayPal, ShopeePay, Touch 'n Go eWallet
7. **Commission Status:** green "● open" badge with pulsing dot, text "DM to discuss your idea ✦"

**Styling:**
- Cards: `bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur` — dark glass look
- Card headings: gold `#d4a853`, font-caviar bold, uppercase
- Card body: `#8899aa` muted sky-grey font-caviar (NOT purple `#b0a6be`)
- Status card: gold border accent `border-gold/[0.15]`
- Use `font-space` for data-driven elements (status badge, pricing numbers) — minimal usage
- Grid: 2-3 columns on desktop (`grid-cols-2 lg:grid-cols-3`), 1 column on mobile
- Page title uses `font-amoria` for elegance
- Scroll hint at bottom matching Voyager style

**Done:** CommissionInfo.svelte created with all sections rendered correctly

### Task 2: Wire CommissionInfo into scroll layout
**Files:** `src/routes/+page.svelte`

**Action:**
- Import `CommissionInfo` (static import, not dynamic — since it's always shown)
- Add a new `<section data-page="1">` after the Portfolio section
- Wrap Studio page with `data-page="1"` scroll-snap attrs
- Update `pageNames` from `['About Me', 'Coming Soon']` to `['Portfolio', 'Commissions', 'About Me']`
- Update `tabColors` to: `['#7ba7c9', '#d4a853', '#5a8ab5']`
- Update `tabIcons` to: `['✦', '♡', '⊹']`
- Update `tabRotations` to: `[-1, 1.5, -0.5]`
- Add `<GlitterOverlay count={10} />` to the new commission section (sparse particles)

**Verify:** 3 nav tabs show correctly, scrolling goes Portfolio → Commissions → About Me
**Done:** Commission page integrated as page 2

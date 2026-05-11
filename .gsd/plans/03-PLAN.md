# Phase 03: New Commission Info Page + About Me Stub

## Goal
Create the Commission Info page component, wire it into the scroll layout, and add a stub About Me section to maintain tab-index alignment.

## Tasks

### Task 1: Create CommissionInfo component
**Files:** `src/lib/components/CommissionInfo.svelte` (new)

**Action:**
- Create a new Svelte 5 component using `$props()` runes
- **Props:** only `{ status: 'open' | 'closed' }` — default `'open'`
- Use `$derived()` for computed values (status text, badge color, CSS classes) — NO `$effect()`
- Full viewport height content (parent scroll-snap handles sizing)
- Layout: centered content with responsive card grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

**Sections (displayed in cards):**
1. **Header:** "commission info" title with gold accent on "info" — `font-amoria`, cream text
2. **Gallery:** placeholder card with dashed border, text "art samples coming soon ✦"
3. **Pricing:** "contact for current rates, varies by complexity" with tier hint
4. **Terms of Service (lg:col-span-2):** 50% upfront / 50% on completion, 2-4 week turnaround, unlimited sketch revisions — use semantic `<dl>` or bullet list
5. **Dos & Don'ts:** two-column mini layout inside card — ✅ OCs, fanart, references / ❌ NSFW, AI training, commercial use
6. **Payment:** PayPal, ShopeePay, Touch 'n Go eWallet — listed inline
7. **Commission Status:** green `● open` badge with pulsing dot, `role="status"` for a11y, text "DM to discuss your idea ✦"

**Styling:**
- Cards: `bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur-md` — dark glass look
- Card headings: gold `#d4a853`, `font-caviar` bold, uppercase
- Card body: `#8899aa` muted sky-grey, `font-caviar` (NOT purple `#b0a6be`)
- Status card: gold border accent `border-gold/[0.15]`
- ToS card: spans `lg:col-span-2` for content space
- Use `font-space` for data-driven elements (status badge, pricing numbers) — minimal usage
- Page title uses `font-amoria` for elegance
- Scroll hint at bottom matching Voyager style
- Wrap all animations in `@media (prefers-reduced-motion: no-preference)`

**Done:** CommissionInfo.svelte created with all 7 sections, builds without errors

### Task 2: Wire CommissionInfo + About Me stub into scroll layout
**Files:** `src/routes/+page.svelte`

**Action:**

**2a — Update imports:**
- Remove `import type ComingSoonComponent` and the `let ComingSoon` lazy declaration
- Remove the `onMount` dynamic import `import('$lib/components/ComingSoon.svelte')`
- Add static import: `import CommissionInfo from '$lib/components/CommissionInfo.svelte'`

**2b — Update nav arrays (2→3 pages):**
```typescript
const pageNames = ['Portfolio', 'Commissions', 'About Me'];
const tabColors = ['#7ba7c9', '#d4a853', '#5a8ab5'];
const tabIcons = ['✦', '♡', '⊹'];
const tabRotations = [-1, 1.5, -0.5];
```
**Reason:** Currently pageNames says "About Me" but actually scrolls to Portfolio. This fix resolves that naming bug.

**2c — Update IntersectionObserver threshold from `0.5` to `[0.4, 0.6]`:**
- Prevents flicker/jank when 3 sections are observed instead of 2
- Wider range improves scroll reliability

**2d — Add a11y to each section:**
- Add `tabindex="0"`, `role="region"`, `aria-label={pageNames[i]}` to every scroll section

**2e — Replace section structure:**
```
Page 0: Portfolio              (existing, add a11y attrs)
  <section data-page="0" ... tabindex="0" role="region" aria-label="Portfolio">
    <GlitterOverlay count={20} />
    <Portfolio />
  </section>

Page 1: Commissions            (NEW — replaces ComingSoon)
  <section data-page="1" ... tabindex="0" role="region" aria-label="Commissions">
    <GlitterOverlay count={10} />
    <CommissionInfo status="open" />
  </section>

Page 2: About Me               (STUB — placeholder for Phase 4)
  <section data-page="2" ... tabindex="0" role="region" aria-label="About Me">
    <GlitterOverlay count={8} />
    <div class="h-full flex items-center justify-center">
      <p class="font-amoria text-[#8899aa] text-lg">about me coming soon ✦</p>
    </div>
  </section>
```

**Done:** 3 pages scroll correctly, nav tabs match, IntersectionObserver works, a11y attrs present

**Verify:**
- `npm run build` succeeds
- `grep -c 'ComingSoon' src/routes/+page.svelte` returns 0 (fully removed)
- 3 nav tabs render and scroll to correct sections
- CommissionInfo component shows all 7 sections

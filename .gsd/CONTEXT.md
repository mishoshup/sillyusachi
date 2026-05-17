# Context: Sillyusachi Voyager — Enterprise Lenis Scroll Architecture

## Vision
Fix the completely broken scroll-snap behavior so the site scrolls properly between pages with seamless snap. Use Lenis enterprise-grade as Danial's preferred solution. Handle varied section heights (Portfolio = viewport, CommissionInfo = tall content). Add unit tests in parallel with development.

## Current State
- Mac has latest commit cd3c5fa using Lenis + Snap library
- Cannot scroll at all — completely broken
- Oracle identified 5 specific bugs in current Lenis setup
- Explorer confirmed overflow-hidden on layout is primary blocker
- Librarian researched CSS + Vitest setup (reference for testing)

## Decisions (Locked)
- Scroll approach: KEEP LENIS — fix it enterprise-grade, not replace
- Fix the 5 bugs Oracle identified:
  1. Dual snap points - single start point with mandatory
  2. wrapper === content - proper wrapper/content separation
  3. overflow-hidden on layout wrapper - remove it
  4. Section height measurement race - ensure measurements after layout
  5. RAF lifecycle race - properly sequence init after Svelte mount
- Testing: Vitest with jsdom for unit tests
- Fonts: Keep root-relative URLs
- Dev: All work on Mac via SSH m4

## Agent Discretion (Freedom Areas)
- Whether to keep Snap library or use manual Lenis snap
- Lenis config parameters (duration, easing, lerp, etc.)
- Scrollbar hiding approach
- Nav tracking implementation (Lenis events vs IntersectionObserver)
- Test file structure and convention

## Deferred Ideas (Out of Scope)
- No mobile-specific nav changes
- No Cloudflare deployment fixes
- No new page animations

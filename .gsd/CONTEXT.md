# Context: Sillyusachi Site — Voyager R1999 Theme Overhaul

## Decisions (Locked)

### Theme
- **The Voyager from Reverse: 1999** — space alien violinist aesthetic
- Dark celestial: deep space navy/dark base
- Retro-futuristic, mysterious, elegant
- Mixed-media collage feel subtly

### Color Palette
- **Primary:** Shades of blue (deep navy `#0a0a1a`, space blue `#1a3a5c`, soft blue `#7ba7c9`)
- **Secondary:** White/cream (`#f0eae8`)
- **Accent:** Gold (`#d4a853`, `#b8953a`)
- **NO light purple** — remove all `#3a2248`, `#c084fc`, purple tones
- **DO keep:** dark backgrounds, gold highlights, blue tones

### Typography
- **Primary display:** Amoria (existing, keep)
- **Primary body:** Caviar Dreams (existing, keep)
- **Tertiary (minimal use):** Space Grotesk — for data-rich areas like commission info grid, stats, badges
- No other new fonts

### Navigation Sidebar
- Keep **exact same placement and rotation mechanics** as current repo
- Restyle colors to Voyager theme (dark bg, gold/blue accents)
- Same CSS structure, just color changes

### Music Player
- Keep **exact same component structure** (same props, state, functions, layout)
- Restyle colors and visual design to Voyager dark theme
- Same track info, progress bar, controls, playlist

### Pages Structure
- Scroll-snap layout with 3 pages (same as current, add 3rd)
- **Page 1:** Portfolio (restyled, content mostly same)
- **Page 2:** Commission Info (new page)
- **Page 3:** About Me — Voyager themed (new page)

### Portfolio Page (Updated)
- Same greeting/content but restyled dark
- Remove existing flower GIF decorative header? Or replace with celestial imagery
- Social links restyled to match
- Keep "scroll" hint

### Commission Info Page
- Section: Gallery (placeholder for now)
- Section: Pricing
- Section: Terms of Service
- Section: Dos & Don'ts
- Section: Payment methods
- Section: Commission Status (open/closed badge)

### About Me (Voyager Themed)
- Online name: Sillyusachi / Usachi
- Age: 18+
- Fav song: 754 — Cece Natalie (or configurable)
- Games played
- Special interest
- Birthday: August
- Quotes (including "my typo" quote)
- Favourite fictional characters list
- Location: Malaysia + earth display (CSS rotating globe concept from draft)

### Stars / Particles
- **Less stars** than draft — sparse, elegant
- Colors: blue, white, gold only
- No light purple particles
- Floating decorative symbols: ✦ ⊹ ˚ ✧ ⋆ (blue/white/gold)

## Deferred
- Actual gallery images — placeholder for now, Nasuha fills later
- Interactive 3D earth — CSS rotating globe is enough for now
- Fonts beyond what's listed — defer new additions

## Agent Discretion
- Exact layout within pages (cards, grids, glass panels)
- Starfield density (keep sparse as noted)
- Specific Tailwind color values within the palette
- Animation timings and transitions
- How to handle the earth globe CSS implementation
- How to structure the info-grid layout for About Me

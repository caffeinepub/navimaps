# Design Brief

## Direction

Navigation Maps — Clean, minimal map interface with focused navigation controls. Dark mode for reduced eye strain during navigation. Teal accent for wayfinding-critical UI elements.

## Tone

Editorial minimalism with tech-forward precision — Vercel/Linear-inspired restraint. The map is the hero; UI chrome recedes into the background.

## Differentiation

Navigation-specific color system: Start pins in green (go), destination pins in teal (target), route paths in cyan (flow). Sidebar contains turn-by-turn steps without distracting the map viewport.

## Color Palette

| Token | OKLCH | Role |
| --- | --- | --- |
| background | 0.145 0.014 260 | Dark charcoal base (dark mode primary) |
| foreground | 0.95 0.01 260 | Off-white text |
| card | 0.18 0.014 260 | Elevated surface for controls |
| primary | 0.72 0.16 185 | Teal accent for interactive elements |
| accent | 0.68 0.18 150 | Cool accent for destination markers |
| destructive | 0.65 0.19 22 | Error/warning states (red) |
| border | 0.28 0.014 260 | Subtle dividers |
| sidebar | 0.16 0.012 260 | Slightly darker than background |

## Typography

- Display: Space Grotesk — clean geometric sans, headings and route summary
- Body: DM Sans — neutral, readable body text and UI labels
- Mono: JetBrains Mono — distance/time values and coordinates
- Scale: hero `text-3xl md:text-4xl font-bold`, labels `text-xs font-semibold uppercase`, body `text-sm md:text-base`

## Elevation & Depth

Card elevation via `border-l` (left borders) on sidebar; minimal shadow stack. Focus on clarity and spatial separation through color and opacity rather than layered shadows.

## Structural Zones

| Zone | Background | Border | Notes |
| --- | --- | --- | --- |
| Header | card | border-b | Search bar, location input, controls |
| Map Viewport | background | — | Full-screen interactive map canvas |
| Sidebar (Directions) | sidebar | border-l | Scrollable turn-by-turn steps, alternate row tinting |
| Footer (optional) | sidebar | border-t | Summary stats (distance, time, eta) |

## Spacing & Rhythm

Tight vertical rhythm (12px base, 8px micro-spacing). Header and sidebar use consistent padding (1rem). Map canvas expands to fill remaining viewport. Section gaps via `gap-4` (1rem) between route steps.

## Component Patterns

- Buttons: `bg-primary hover:opacity-90` with `transition-smooth`
- Cards: Minimal elevation, `border-l border-primary` for active state
- Badges: `bg-muted text-muted-foreground`, small `rounded-sm`
- Route step: `nav-step` utility with `hover:bg-sidebar-accent/50`

## Motion

- Entrance: Fade-in on map load (map tiles), 300ms
- Hover: Button/step opacity shift via `transition-smooth`, no scale
- Decorative: None — functional only

## Constraints

- No gradients or visual noise; preserve map legibility
- Maximize viewport for map; minimize UI chrome
- All text in Dutch (UI labels, route instructions, location names)
- High contrast: all text meets WCAG AA on backgrounds

## Signature Detail

Left-side border accent on active route steps — a vertical line that guides the eye down the sidebar, reinforcing the "flow" of navigation from start to destination.

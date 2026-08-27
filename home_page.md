---
name: Home Page
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e3e2e2'
  on-tertiary-container: '#646464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 24px
    fontWeight: '800'
    lineHeight: '1.2'
  stat-value:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.08em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

The aesthetic is **Athletic High-Performance Dark Mode**, built for high-contrast sports analytics and fantasy league command centers.

### 1. Color Palette (60-30-10 Rule)
- **Base Background (60%)**: `#0D0D0D` — Deep matte black foundation across all pages, canvas, and sidebar backgrounds.
- **Surface & Cards (30%)**: `#141414` — Flat elevated containers with a subtle `1px solid #222222` border. No drop shadows or heavy gradients.
- **Primary Accent (10%)**: `#CCFF00` (Electric Lime / Neon Volt) — Strictly reserved for active states, rank highlights (`1st`), trophy badges, primary buttons, and key performance figures.
- **Typography Colors**:
  - Main Headlines & Active Values: `#FFFFFF` (Pure White)
  - Secondary / Muted Metadata: `#9E9E9E` (Slate Grey)
  - Text on Lime Badges/Buttons: `#000000` (Pitch Black)

### 2. Typography
- **Headlines & Story Titles**: Heavy Condensed Athletic Display Sans (`Anybody` / `Russo One` / `Saira Extra Condensed`), **Black/ExtraBold (800-900)**, **Italic (slanted forward)**, **All-Caps Uppercase**.
- **Labels, Badges & Numbers**: Monospace Sans (`JetBrains Mono` / `Space Grotesk`), **Bold Uppercase** with wide tracking (`0.08em`).
- **Body Text**: Neutral Modern Sans (`Inter` / `Plus Jakarta Sans`), **Regular/Medium**, high legibility on dark surfaces.

### 3. Component Styling
- **Corner Radius**:
  - Small tags & rank badges (`1st`, `GW`): `6px`
  - Interactive buttons & inputs: `8px`
  - Content cards & highlight modules: `14px`
- **Layout**: Clean 12-column modular grid, symmetric cards, flat high-contrast cards, and lime green sidebar active indicator pills.

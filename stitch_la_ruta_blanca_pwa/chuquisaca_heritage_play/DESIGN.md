---
name: Chuquisaca Heritage Play
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#5b4040'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#8f6f6f'
  outline-variant: '#e4bdbd'
  surface-tint: '#bc0f30'
  primary: '#900020'
  on-primary: '#ffffff'
  primary-container: '#ba0c2f'
  on-primary-container: '#ffc9c9'
  inverse-primary: '#ffb3b3'
  secondary: '#b42436'
  on-secondary: '#ffffff'
  secondary-container: '#fd5b66'
  on-secondary-container: '#600012'
  tertiary: '#434647'
  on-tertiary: '#ffffff'
  tertiary-container: '#5b5d5f'
  on-tertiary-container: '#d5d6d8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#ffb3b3'
  on-primary-fixed: '#400009'
  on-primary-fixed-variant: '#920021'
  secondary-fixed: '#ffdad9'
  secondary-fixed-dim: '#ffb3b3'
  on-secondary-fixed: '#400009'
  on-secondary-fixed-variant: '#920222'
  tertiary-fixed: '#e1e2e4'
  tertiary-fixed-dim: '#c5c6c8'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is tailored for an engaging mobile Progressive Web App (PWA) dedicated to cultural exploration and gamified heritage discovery in Sucre, Bolivia. The brand evokes civic pride, curiosity, historical elegance, and the thrill of collecting regional treasures. 

The aesthetic style is **Modern Colonial Minimalism**:
- **White Architecture Influence:** Inspired by the pristine lime-washed façades of "La Ciudad Blanca", the interface relies heavily on generous white and ultra-light neutral surfaces, ensuring a bright, daylight-friendly mobile experience.
- **Symbolic Chuquisaca Accents:** The deep crimson cross of the department of Chuquisaca serves as the core dynamic accent, signaling active states, milestones, quest markers, and interaction targets.
- **Tactile Gamification:** Digital collectible cards, quest progress trackers, map overlays, and scanner triggers bridge historical legacy with modern, lightweight mobile app patterns.

## Colors

The palette directly honors the historic flag of Chuquisaca—balancing stark white lime-plaster tones with deep, authoritative crimson.

- **Primary (`#BA0C2F`):** The signature Chuquisaca crimson. Applied to primary calls to action, active navigation indicators, interactive map pins, unlocked rarity highlights, and the prominent floating QR camera scanner.
- **Secondary (`#990B26`):** Deep crimson shade used for pressed states, badges of high tier rarity, and high-emphasis gamification counters.
- **Tertiary & Neutral Backgrounds (`#F9FAFB`, `#F3F4F6`):** Canvas backgrounds, map street containers, card shells, and disabled collection frames that maintain soft legibility under bright sunlight.
- **Borders & Dividers (`#E5E7EB`):** Subtle hairline borders providing crisp architectural separation without visual clutter.
- **Text & Foreground (`#111827`, `#1F2937`):** Deep graphite tones for primary headings and body typography, offering high contrast and readability without the harshness of pure black. Secondary captions use `#6B7280`.

## Typography

**Plus Jakarta Sans** is selected across display, body, and UI metadata. Its geometric construction, crisp curves, and tall x-height deliver immediate readability on mobile viewports during active walking and outdoor sightseeing.

- **Headlines:** Set in bold and extra-bold weights with slight negative letter spacing for punchy landmark titles, gamified scores, and route names.
- **Body:** Neutral, well-spaced weights (regular and medium) ensuring comfortable reading of historical lore and museum descriptions.
- **Labels & Microcopy:** Slightly tracked uppercase or semi-bold variants used for badge tags ("OBTENIDO", "ÉPICA"), score points, navigation items, and lock states.

## Layout & Spacing

Designed as a mobile-first PWA, layout rhythms emphasize single-hand ergonomic reach, thumb-accessible primary actions, and clean grid alignment:

- **Grid & Columns:** Standard 4-column fluid mobile grid spanning screens up to 480px, switching to a 2-column card collection layout on mobile portrait displays. For tablet views (768px+), content expands up to 3 or 4 collection columns with centered max-width constraints (640px for single-column feeds).
- **Margins & Gutters:** Base canvas margin is `1rem` (16px), with `1rem` column gutters between card collection items.
- **Safe Area Padding:** Explicit bottom offset padding (`space-xl` + 56px) on scrollable views ensures content clears the floating action button and bottom navigation bar.

## Elevation & Depth

Visual hierarchy uses a refined pairing of surface layering, crisp `#E5E7EB` architectural borders, and soft ambient drop shadows to suggest tangible playing cards and floating navigational controls.

- **Level 0 (Flat / Canvas):** Neutral `#F9FAFB` base background.
- **Level 1 (Cards & Surface Panels):** Pure `#FFFFFF` surfaces bounded by a 1px border (`#E5E7EB`) and a soft ambient shadow (`0 2px 8px -2px rgba(17, 24, 39, 0.05)`).
- **Level 2 (Interactive Cards & Popovers):** Active or unlocked relic cards have an intensified presence: `0 4px 16px -4px rgba(186, 12, 47, 0.12)`, drawing eye focus.
- **Level 3 (Floating Controls & Navigation):**
  - **Bottom Navigation Bar:** Pure `#FFFFFF` with top border `#E5E7EB` and ambient top shadow (`0 -4px 16px rgba(0, 0, 0, 0.04)`).
  - **Center Floating QR Scanner Button:** Raised elevation with an intense crimson glow: `0 8px 20px -2px rgba(186, 12, 47, 0.40)`.
- **Locked/Obscured State:** Greyscale tone overlay with high-blur silhouettes (`filter: blur(2px) grayscale(100%)`) beneath an opaque frosted badge holding a padlock icon.

## Shapes

The design system adopts a balanced rounded visual language (Level 2). This softens the visual impact of modern mobile interfaces while preserving structural architectural discipline.

- **Cards & Modal Sheets:** Standard `1rem` (16px) corner radius for collectible relic cards, route summary cards, and map preview bottom sheets.
- **Buttons & Filter Chips:** Fully rounded pills (`9999px`) for filter pills ("Explorar Rutas", "Museos Sueltos") and action buttons.
- **Floating Action Button:** Perfect circular geometry (`50%` radius, 60px diameter) for the QR Scanner trigger.
- **Badges:** Compact `0.375rem` (6px) rounded corners for rarity and progress tags.

## Components

### 1. Navigation Bar & Floating Scanner
- **Bottom Navigation:** Fixed 3-tab layout containing "Mapa", "Escanear", and "Mis Cartas". Background is `#FFFFFF` with top hairline border `#E5E7EB`.
- **Floating QR Scanner Action Button:** Centered circular button (58px to 64px) anchored over the navigation bar, elevated with primary crimson gradient background (`linear-gradient(135deg, #BA0C2F 0%, #990B26 100%)`), white optical viewfinder icon, and active press scale transition (`scale: 0.94`).

### 2. Collectible Relic Cards ("Reliquias")
- **Unlocked State:**
  - 1px or 2px primary crimson outline (`#BA0C2F`).
  - Vivid historic illustration or photography fills the top 70% of the card aspect ratio (3:4 ratio).
  - Floating status chip (`#BA0C2F` background, white label "Obtenido") and rarity pill ("Épica", "Común").
  - Card base contains the heritage landmark name in `headline-md` weight.
- **Locked State:**
  - Neutral `#F3F4F6` background with 1px `#E5E7EB` border.
  - De-saturated, dark silhouette of the landmark.
  - Centered padlock glyph encased in a semi-translucent circular badge (`rgba(255, 255, 255, 0.7)` with `backdrop-filter: blur(4px)`).
  - Title displayed in muted `#9CA3AF`.

### 3. Interactive Map & Crimson Location Pins
- **Map Surface:** Minimalist, high-key custom vector styling (pale roads `#FFFFFF`, subtle greenery `#E5E7EB`, pale blocks `#F9FAFB`).
- **Pins:** Teardrop circular crimson markers (`#BA0C2F`) with a central white dot or landmark silhouette. Active discovery targets render a pulsating crimson radar ring (`rgba(186, 12, 47, 0.2)`).

### 4. Route Selection Chips & Segmented Controls
- **Filter Pills:** Horizontally scrollable row.
- **Active Pill:** Solid `#BA0C2F` fill, white text, and leading icon.
- **Inactive Pill:** Pure white background, 1.5px `#BA0C2F` border, `#BA0C2F` text and icon.

### 5. Gamification Score Badge
- Pinned at top-right of top app bar: Trophy icon in crimson accompanied by bold numeral score (`150 PTS`) enclosed within a subtle `#F3F4F6` pill container.
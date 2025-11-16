# Design System Documentation

## Overview
This is the complete design system for Aiman Rahim's personal website, implementing a **Neo-Modernist** aesthetic with warm professional colors, physics-based interactions, and intentional micro-breaks in the grid system.

## Design Philosophy
**"Structured Rebellion"** - Following Swiss design principles while intentionally breaking rules to show personality: professional yet unconventional, rule-following yet rule-breaking when necessary.

---

## Color System

### Primary Palette (Warm Professional)

**Stone Neutrals:**
- `stone-950` (#0c0a09) - Primary text, headers
- `stone-900` (#1c1917) - Secondary text
- `stone-700` - Body text
- `stone-600` - Muted text
- `stone-500` - Disabled states
- `stone-300` - Borders
- `stone-200` - Dividers
- `stone-100` - Light backgrounds
- `stone-50` (#fafaf9) - Canvas background

**Warm Accents:**
- `amber-600` (#d97706) - Primary CTA, brand energy
- `amber-500` (#f59e0b) - Hover states, highlights
- `orange-800` (#9a3412) - Deep accents for serious moments

**Supporting:**
- `slate-600` - Cool contrast for secondary actions
- `red-600` - Errors/warnings (use sparingly)

### Usage Guidelines
- **Primary Actions:** amber-600 background, white text
- **Secondary Actions:** stone-900 border, transparent background
- **Text Hierarchy:** stone-950 → stone-700 → stone-600
- **Backgrounds:** stone-50 (main), white (cards), stone-100 (subtle)

---

## Typography

### Font Family
**Primary:** Inter (variable font)
- Weight range: 300-800
- Font features: `cv11`, `ss01` (contextual alternates)
- Fallback: system-ui, -apple-system, sans-serif

### Type Scale

```
Display:  text-5xl lg:text-6xl  (48-64px) - font-bold (700)
H1:       text-5xl              (48px)    - font-bold (700)
H2:       text-4xl              (36px)    - font-semibold (600)
H3:       text-2xl              (24px)    - font-semibold (600)
Body Lg:  text-xl               (20px)    - font-normal (400)
Body:     text-base             (16px)    - font-normal (400)
Small:    text-sm               (14px)    - font-medium (500)
Caption:  text-xs               (12px)    - font-medium (500)
```

### Typography Treatments
- **Letter Spacing:** -0.02em on all headings (tighter tracking)
- **Line Height:** Default Tailwind scale
- **Text Gradient:** `.text-gradient-warm` (amber-600 to orange-800)

---

## Spacing System

### Scale
Based on Tailwind's default 4px scale:
- `4` = 16px
- `6` = 24px
- `8` = 32px
- `12` = 48px
- `16` = 64px
- `24` = 96px

### Custom Extensions
- `18` = 72px
- `88` = 352px
- `100` = 400px
- `128` = 512px

### Container System
- **Max Width:** `max-w-8xl` (1280px)
- **Padding:** `px-6 lg:px-8` (24px → 32px responsive)
- **Vertical Rhythm:** `py-12 lg:py-16` (48px → 64px responsive)

---

## Layout Patterns

### Asymmetric Layouts
The design intentionally breaks symmetry to show unconventionality:

1. **4/8 Grid Split** (About page hero)
   - Left column: 4 cols (sidebar content)
   - Right column: 8 cols (main content)
   - Creates visual interest, breaks traditional centered layouts

2. **Intentional Offsets**
   - Logo: 8px right margin
   - Clock: 8px left margin
   - Dividers: Don't fully span (85% width, 8% left margin)

3. **Grid Breaks**
   - Skills section: 2-column grid, but 4th card spans full width
   - Creates rhythm while questioning the grid

### Responsive Breakpoints
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
```

---

## Components

### BaseButton
**Location:** `src/components/base/BaseButton.vue`

**Variants:**
- `primary`: amber-600 background, white text, hover lift + shadow
- `secondary`: stone-900 border, hover fills with skew effect
- `ghost`: transparent, hover bg-stone-100

**Sizes:**
- `sm`: px-4 py-2 text-sm
- `md`: px-6 py-3 text-base (default)
- `lg`: px-8 py-4 text-lg

**Micro-interactions:**
- Primary: Lifts (-translate-y-0.5), shadow grows
- Secondary: Skews (-1deg) on hover, fills left-to-right
- Active state: Compresses (scale-98)

### Card
**Location:** `src/components/base/Card.vue`

**Variants:**
- `default`: White bg, shadow-md, hover:shadow-xl
- `bordered`: White bg, 2px border, hover changes border color
- `glass`: Glassmorphism (bg-white/80, backdrop-blur-lg)

**Features:**
- `hoverable`: Enables physics-based lift animation
- `microBreak`: Adds subtle random rotation (±0.5deg)
- Padding options: sm, md, lg, none

### Navbar
**Location:** `src/components/Navbar.vue`

**Features:**
- Fixed positioning with glassmorphism
- Scroll-reactive: More blur + shadow when scrolled
- Active state: Underline grows from center
- Dropdown: Slides down with fade, glass background
- Micro-offsets: Logo and clock intentionally offset by 8px

---

## Interactions & Animations

### Physics-Based Animations

**useHoverLift** (`src/composables/useHoverLift.js`)
- Spring-based lift effect
- Parameters: stiffness 170, damping 26
- Lifts 8px, scales to 1.02
- Smooth deceleration

**useMicroBreak** (`src/composables/useMicroBreak.js`)
- Adds subtle random transformations
- Rotation: ±0.5deg
- Offset: ±2px
- Seeded randomness for consistency

**useMagneticHover** (included in useMicroBreak.js)
- Elements push away from cursor
- Radius: 100px
- Strength: 20px max displacement

### Transition Timing
- **Fast:** 150ms - Immediate feedback (hover colors)
- **Standard:** 300ms - Most interactions
- **Slow:** 600ms - Page transitions
- **Easing:** cubic-bezier(0.4, 0, 0.2, 1) - Material Design standard

### Keyframe Animations
```css
float       - Gentle vertical oscillation (3s)
slideUp     - Slide up + fade in (0.3s)
slideInRight - Slide from right + fade (0.4s)
fadeIn      - Simple fade in (0.4s)
```

---

## Glassmorphism

The `.glass` utility class creates frosted glass effect:
```css
bg-white/80
backdrop-blur-lg
border border-stone-200/50
```

**Usage:**
- Navbar (when scrolled)
- Dropdown menus
- Overlay cards
- Info panels

**Best Practices:**
- Use over busy/image backgrounds
- Combine with subtle shadows
- Ensure text contrast remains high

---

## Micro-Breaks (Rule-Breaking Elements)

### Philosophy
Intentional imperfections that question perfection while maintaining professionalism.

### Implementation Examples

1. **Rotations**
   - Hero title: -0.5deg rotation
   - Some cards: Random ±0.5deg rotation
   - Secondary buttons: -1deg skew on hover

2. **Asymmetric Spacing**
   - Dividers that don't fully span width
   - Off-center content positioning
   - Unequal margins (8px offsets)

3. **Grid Breaks**
   - 4th skill card spans full width
   - Every 4th item in lists can be wider
   - Intentional gaps in grids

4. **Hover Effects**
   - Links shift 2px right on hover
   - Cards lift at slight angles
   - Elements that break alignment momentarily

---

## Accessibility

### Color Contrast
All text combinations meet WCAA AA standards:
- stone-950 on stone-50: 18.9:1
- stone-700 on white: 10.4:1
- white on amber-600: 4.8:1

### Focus States
All interactive elements have visible focus rings:
```css
focus:outline-none
focus:ring-2
focus:ring-amber-600
focus:ring-offset-2
```

### Keyboard Navigation
- All dropdowns are keyboard accessible
- Tab order follows visual hierarchy
- ESC closes all modals/dropdowns

### Motion
- Respects `prefers-reduced-motion` (can be added)
- All animations are optional enhancements
- No critical info conveyed through animation alone

---

## File Structure

```
src/
├── components/
│   ├── base/
│   │   ├── BaseButton.vue      # Reusable button component
│   │   └── Card.vue             # Reusable card component
│   ├── About.vue                # Homepage/About page
│   ├── App.vue                  # Root layout
│   ├── Clock.vue                # Live clock component
│   ├── Navbar.vue               # Global navigation
│   ├── QrGenerator.vue          # QR utility
│   └── WhatsApp.vue             # WhatsApp utility
├── composables/
│   ├── useHoverLift.js          # Physics hover effect
│   └── useMicroBreak.js         # Micro-break transformations
├── style.css                    # Global styles + Tailwind
└── main.js                      # App entry point

tailwind.config.js               # Design tokens
```

---

## Usage Examples

### Creating a New Page

```vue
<template>
  <div class="max-w-8xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
    <h1 class="text-5xl font-bold text-stone-950 mb-8">
      Page <span class="text-gradient-warm">Title</span>
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card :hoverable="true">
        <h3 class="text-2xl font-semibold mb-3">Card Title</h3>
        <p class="text-stone-600">Card content...</p>
      </Card>
    </div>
  </div>
</template>
```

### Using BaseButton

```vue
<BaseButton variant="primary" size="md" @click="handleClick">
  Click Me
</BaseButton>

<BaseButton variant="secondary" href="/about">
  Learn More
</BaseButton>
```

### Applying Physics Hover

```vue
<script setup>
import { useHoverLift } from '@/composables/useHoverLift'

const { elementRef, style } = useHoverLift()
</script>

<template>
  <div ref="elementRef" :style="style()">
    Hoverable content
  </div>
</template>
```

---

## Future Enhancements

1. **Dark Mode**
   - Implement dark theme toggle
   - Adjust warm palette for dark backgrounds
   - Maintain amber accent system

2. **Animation Refinements**
   - Add scroll-triggered animations
   - Parallax effects on images
   - More sophisticated micro-breaks

3. **Component Library Expansion**
   - Input components
   - Modal/Dialog
   - Toast notifications
   - Loading states

4. **Performance**
   - Lazy load images
   - Code splitting by route
   - Optimize font loading

---

## Credits

- **Font:** Inter by Rasmus Andersson
- **Icons:** Heroicons (inline SVG)
- **Inspiration:** Swiss Design, Neo-Brutalism, Material Design physics

---

**Last Updated:** November 2024
**Version:** 1.0
**Maintained by:** Aiman Rahim

# Ana-Catalina Design System

This document defines the aesthetics, visual identity, color palette, and design guidelines shared across Ana-Catalina's web ecosystem (Homepage, Projects Hub, and CV).

The primary goal is to maintain absolute visual consistency based on minimalism, generous negative space, geometric typography, and a refined use of harmonic pastel-tech tones.

---

## 💎 1. Visual Identity & Brand Emblem

The brand identity is anchored by the 3D fluid glass **AC Monogram**:
- **Geometry**: An interconnected, continuous tubular 3D monogram intertwining the letterforms **'A'** (vertical arch in luminous violet) and **'C'** (horizontal torus in crystal aqua) with optical refraction, smooth specular rim highlights, and spherical rounded cap terminations.
- **Assets in Repository**:
  - `public/logo-ac.png`: 512×512 high-resolution transparent raster asset optimized for modern displays.
  - `public/favicon.svg` & `icon.svg`: Native resolution-independent SVG wrappers with embedded high-DPI base64 imagery.
  - `public/favicon.ico`: Standard multi-resolution 5-layer ICO (16×16, 24×24, 32×32, 48×48, 64×64).
  - Webmanifest & Touch icons: `favicon-32x32.png`, `favicon-96x96.png`, `apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png`.

---

## 🎨 2. Color Palette (Pastel-Tech System)

The palette balances technical precision with friendly, desaturated warmth. Configured as native CSS theme variables in Tailwind CSS v4 (`src/styles/global.css`).

### 2.1 Brand Tokens (Core Palette)

| Token / Class | Name | Hex Code | Semantic Role |
| :--- | :--- | :--- | :--- |
| `--color-brand-violet`<br/>`text-brand-violet`, `bg-brand-violet` | **Electric Violet** | `#8B5CF6` | Primary brand accent, 'A' loop color, CV action button |
| `--color-brand-violet-light`<br/>`text-brand-violet-light` | **Luminous Lavender** | `#C49BFF` | High-contrast text & glowing states in Dark Mode (WCAG AAA) |
| `--color-brand-violet-deep` | **Deep Violet** | `#6D28D9` | Button gradient depth, volumetric shading |
| `--color-brand-aqua`<br/>`text-brand-aqua`, `bg-brand-aqua` | **Crystal Aqua** | `#2EE6E5` | Secondary brand accent, 'C' torus color, Projects button border & hover |
| `--color-brand-aqua-light` | **Glacial Aqua** | `#A5F3FC` | Ambient reflections, specular ring shine |
| `--color-brand-aqua-deep` | **Deep Cyan** | `#0891B2` | Shading of curved torus surfaces |

### 2.2 Pastel Support Tokens

| Token / Class | Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| `--color-pastel-lilac` | **Pastel Lilac** | `#CDB4F6` | Subtle tags, badge borders, hover tints |
| `--color-pastel-pink` | **Pastel Pink** | `#FBCFE8` | Soft decorative accents, secondary highlights |
| `--color-pastel-cyan` | **Pastel Cyan** | `#B2EFF7` | Code callouts, subtle pill active borders |
| `--color-pastel-blue` | **Pastel Blue** | `#BCDFFB` | Informational graphics, links, charts |
| `--color-pastel-mint` | **Pastel Mint** | `#C8F3E0` | Success states, active availability badges |

### 2.3 Surface & Canvas Tokens

- **Light Canvas**: `bg-slate-50` (`#F8FAFC`), surfaces in pure white `bg-white` (`#FFFFFF`).
- **Dark Canvas**: `bg-slate-900` (`#0F172A`), container surfaces in `bg-slate-800` (`#1E293B`).
- **Text Primary**: `text-slate-800` (Light) / `text-white` or `text-slate-100` (Dark) — *Strictly avoiding pure `#000000`*.
- **Text Secondary**: `text-slate-600` (Light) / `text-slate-400` (Dark).

---

## 🪞 3. Avatar Medallion & Geometric Gradients

The circular portrait medallion incorporates the two-tone geometry of the 3D brand monogram:

### 3.1 Conic Gradient Border
```css
.acvc-gradient-border {
  border: 3px solid transparent;
  background:
    linear-gradient(#131a34, #131a34) padding-box,
    conic-gradient(
      from 180deg,
      #2EE6E5 0%,    /* Top / Crystal Aqua */
      #8B5CF6 50%,   /* Bottom / Electric Violet */
      #2EE6E5 100%   /* Return to Aqua */
    ) border-box;
}
```

### 3.2 Ambient Glow
A blurred conic backdrop positioned directly behind the avatar:
```html
<div
  class="absolute -inset-1 rounded-full blur-md opacity-25 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
  style="background: conic-gradient(from 180deg, #2EE6E5 0%, #8B5CF6 50%, #2EE6E5 100%);"
  aria-hidden="true"
></div>
```

---

## 🔘 4. Button & Interactive Component Patterns

### 4.1 Primary Action Button (CV Button)
- **Gradient**: `bg-gradient-to-r from-violet-600 to-brand-violet hover:from-violet-500 hover:to-brand-violet-light`
- **Glow Shadow**: `shadow-sm hover:shadow-[0_0_22px_rgba(139,92,246,0.45)]`
- **Shape & Elevation**: `rounded-2xl`, `hover:-translate-y-0.5`
- **Typography**: Semibold white text, tracking-wide.

### 4.2 Secondary Action Button (Projects Button)
- **Base**: `bg-white dark:bg-slate-800/90 border border-brand-aqua/40 dark:border-brand-aqua/50`
- **Interactive Hover**: `hover:border-brand-aqua dark:hover:border-brand-aqua hover:bg-cyan-500/5 dark:hover:bg-cyan-950/20 text-slate-800 dark:text-slate-100 hover:text-cyan-600 dark:hover:text-brand-aqua hover:shadow-[0_0_20px_rgba(46,230,229,0.3)]`
- **Shape & Elevation**: `rounded-2xl`, `hover:-translate-y-0.5`

### 4.3 Circular Social Icon Buttons (56×56px)
- **Dimensions**: `w-[56px] h-[56px] rounded-full`
- **Base**: `bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700`
- **Interactive Hover**: `hover:bg-cyan-500/10 dark:hover:bg-slate-700 hover:text-brand-aqua dark:hover:text-brand-aqua hover:border-brand-aqua/50 dark:hover:border-brand-aqua/50 hover:shadow-[0_0_15px_rgba(46,230,229,0.2)] hover:-translate-y-1`

---

## ✍️ 5. Typography

- **Headlines & Display:** `font-sans` (`Outfit`) — Clean, geometric curves with open apertures (`300`, `400`, `500`, `600`).
- **Body & Paragraphs:** `Inter` — Optimal legibility in technical copy and descriptions (`400`, `500`).
- **Code & Specs:** `JetBrains Mono` / `font-mono` — Monospaced technical elements.
- **Hero Title Accent**: "Ana-Catalina" styled in `text-brand-violet dark:text-brand-violet-light` (Electric Violet); terminal period styled in `text-brand-aqua` with `hover:drop-shadow-[0_0_8px_rgba(46,230,229,0.8)]`.

---

## 🌸 6. Decorative Background & Studio Lighting

The signature background composition combines warm botanical line-art with soft studio refraction:
- **Vector line-art botanical poppy flower (`PoppyBackground.astro`)**:
  - Positioned fixed: `fixed -bottom-10 -right-10 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px]`.
  - Subtle opacity: `opacity-[0.04] dark:opacity-[0.06] pointer-events-none -z-10`.
  - Adapts dynamically to light/dark themes via `text-indigo-900 dark:text-indigo-100`.
- **Soft Ambient Studio Lights (`Layout.astro`)**:
  - Top-left ambient violet orb (`w-[460px] h-[460px] bg-brand-violet/10 dark:bg-brand-violet/15 blur-3xl`).
  - Bottom-right ambient aqua orb (`w-[500px] h-[500px] bg-brand-aqua/10 dark:brand-aqua/15 blur-3xl`).
  - Enhances 3D glass translucency and depth while preserving generous negative space.

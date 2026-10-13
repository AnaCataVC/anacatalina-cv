# Ana-Catalina Design System

This document defines the aesthetics, visual identity, color palette, and design guidelines shared across Ana-Catalina's web ecosystem (Homepage, Projects Hub, and CV).

The primary goal is to maintain absolute visual consistency based on minimalism, generous negative space, geometric typography, and a refined use of harmonic pastel-tech tones.

---

## 💎 1. Visual Identity & Brand Emblem

The brand identity is anchored by the geometric triangular **AV Emblem**:
- **Geometry**: An equilateral triangular silhouette integrating letterforms 'A' and 'V' via clean geometric cuts (top diamond apex, bottom-left triangle, bottom-right triangle).
- **Assets in Repository**:
  - `public/logo-av.svg` & `icon.svg`: Native resolution-independent vector asset.
  - `public/logo-av.png`: 1024×1024 high-resolution transparent raster asset.
  - `public/favicon.ico`: Standard multi-resolution 6-layer ICO (16×16, 32×32, 48×48, 64×64, 128×128, 256×256).
  - Webmanifest & Touch icons: `favicon-32x32.png`, `favicon-96x96.png`, `apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png`.

---

## 🎨 2. Color Palette (Pastel-Tech System)

The palette balances technical precision with friendly, desaturated warmth. Configured as native CSS theme variables in Tailwind CSS v4 (`src/styles/global.css`).

### 2.1 Brand Tokens (Core Triad)

| Token / Class | Name | Hex Code | Semantic Role |
| :--- | :--- | :--- | :--- |
| `--color-brand-purple`<br/>`text-brand-purple`, `bg-brand-purple` | **Tech Lavender** | `#9A82E8` | Primary brand accent, button start gradient, name display |
| `--color-brand-purple-light`<br/>`text-brand-purple-light` | **Luminous Lavender** | `#A78BFA` | High-contrast text & glowing states in Dark Mode (WCAG AAA) |
| `--color-brand-magenta`<br/>`text-brand-magenta`, `bg-brand-magenta` | **Petal Rose** | `#E573A7` | Secondary action accent, button end gradient, terminal dot |
| `--color-brand-cyan`<br/>`text-brand-cyan`, `bg-brand-cyan` | **Crystal Aqua** | `#4DD0E1` | High-light accent, Projects hover state, apex emblem color |

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

The circular portrait medallion incorporates the 3-vertex geometry of the brand emblem:

### 3.1 Conic Gradient Border
```css
.acvc-gradient-border {
  border: 3px solid transparent;
  background:
    linear-gradient(#131a34, #131a34) padding-box,
    conic-gradient(
      from 0deg,
      #4DD0E1 0%,    /* Apex / Top (Crystal Aqua) */
      #9A82E8 33%,   /* Bottom-Right (Tech Lavender) */
      #E573A7 66%,   /* Bottom-Left (Petal Rose) */
      #4DD0E1 100%   /* Return to Apex */
    ) border-box;
}
```

### 3.2 Ambient Glow
A blurred conic backdrop positioned directly behind the avatar:
```html
<div
  class="absolute -inset-1 rounded-full blur-sm opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
  style="background: conic-gradient(from 0deg, #4DD0E1 0%, #9A82E8 33%, #E573A7 66%, #4DD0E1 100%);"
  aria-hidden="true"
></div>
```

---

## 🔘 4. Button & Interactive Component Patterns

### 4.1 Primary Action Button (CV Button)
- **Gradient**: `bg-gradient-to-r from-brand-purple to-brand-magenta hover:from-brand-magenta hover:to-brand-purple`
- **Glow Shadow**: `shadow-sm hover:shadow-[0_0_20px_rgba(154,130,232,0.4)]`
- **Shape & Elevation**: `rounded-2xl`, `hover:-translate-y-0.5`
- **Typography**: Semibold white text, tracking-wide.

### 4.2 Secondary Action Button (Projects Button)
- **Base**: `bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700`
- **Interactive Hover**: `hover:border-brand-purple dark:hover:border-brand-cyan hover:text-brand-purple dark:hover:text-brand-cyan`
- **Shape & Elevation**: `rounded-2xl`, `hover:-translate-y-0.5`

### 4.3 Circular Social Icon Buttons (56×56px)
- **Dimensions**: `w-[56px] h-[56px] rounded-full`
- **Base**: `bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700`
- **Interactive Hover**: `hover:bg-purple-500/10 dark:hover:bg-slate-700 hover:text-brand-purple dark:hover:text-pastel-lilac hover:border-brand-purple/40 dark:hover:border-pastel-lilac/50 hover:-translate-y-1`

---

## ✍️ 5. Typography

- **Headlines & Display:** `font-sans` (`Outfit`) — Clean, geometric curves with open apertures (`300`, `400`, `500`, `600`).
- **Body & Paragraphs:** `Inter` — Optimal legibility in technical copy and descriptions (`400`, `500`).
- **Code & Specs:** `JetBrains Mono` / `font-mono` — Monospaced technical elements.
- **Hero Title Accent**: "Ana-Catalina" styled in `text-brand-purple dark:text-brand-purple-light`; terminal period styled in `text-brand-magenta` with `hover:drop-shadow-[0_0_8px_rgba(229,115,167,0.7)]`.

---

## 🌸 6. Decorative Background (PoppyBackground)

The unifying signature element across the ecosystem:
- Vector line-art botanical poppy flower (`PoppyBackground.astro`).
- Positioned fixed: `fixed -bottom-10 -right-10 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px]`.
- Subtle opacity: `opacity-[0.04] dark:opacity-[0.06] pointer-events-none -z-10`.
- Adapts dynamically to light/dark themes via `text-indigo-900 dark:text-indigo-100`.

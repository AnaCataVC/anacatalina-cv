# Ana-Catalina Design System

This document defines the aesthetics, color palette, and design guidelines shared across Ana-Catalina's web ecosystem (Homepage, Projects Hub, and CV).

The primary goal is to maintain absolute visual consistency based on minimalism, generous whitespace, and a subtle use of pastel tones.

## 🎨 Color Palette

The palette focuses on highly desaturated and friendly pastel tones. We use **Tailwind CSS v4** and have configured these custom variables in the global styles file (`global.css` or `styles.css`).

### Primary Colors (Pastel)
| Color | Tailwind Class | Hex Code | Primary Use |
| :--- | :--- | :--- | :--- |
| **Pastel Lilac** | `text-pastel-lilac`, `bg-pastel-lilac` | `#c7b8ea` | Primary accent color (Homepage, main buttons) |
| **Pastel Pink** | `text-pastel-pink`, `bg-pastel-pink` | `#f7c6d9` | Secondary accents, decoration (CV) |
| **Pastel Blue** | `text-pastel-blue`, `bg-pastel-blue` | `#bcdffb` | Links, interactive elements, terminal text (Dark Mode) |
| **Pastel Mint** | `text-pastel-mint`, `bg-pastel-mint` | `#c8f3e0` | Success indicators or active states |

### Contrast Colors (Light Mode)
In light themes, pastel colors (such as pastel blue) lose readability against white backgrounds. For text and interactive icons in the light theme, we use saturated versions as a contrast to the pastel colors.

| Light Equivalent | Tailwind Class | Usage |
| :--- | :--- | :--- |
| **Indigo / Purple** | `text-indigo-600`, `text-purple-600` | Replacement for `pastel-lilac` / `pastel-blue` in light mode text |
| **Magenta / Pink**| `text-pink-600` | Replacement for `pastel-pink` in light mode text |
| **Emerald** | `text-emerald-600` | Replacement for `pastel-mint` in light mode text |

## typography Typography

Typography is the pillar of readability and modernity in this design.

- **Headlines and Headers:** `font-outfit` (Outfit) - Used for its modern and friendly geometry.
- **Body Text and Paragraphs:** `font-inter` or `font-sans` (Inter) - Used for its high readability in long descriptions.
- **Code Blocks / Terminal:** `font-mono` - Strictly used for paths or command-line interface simulations.

## 📐 Layout and Structure

- **Philosophy:** "Whitespace breathes". Avoid clustering elements.
- **Cards and Containers:** 
  - **CV:** Solid boxes (`bg-white` or `bg-slate-800`) to maximize legibility in dense documents.
  - **Hub / Homepage:** Moderate glassmorphism (`bg-white/40` or `bg-slate-900/40` alongside `backdrop-blur`) for interactive interfaces.
- **Borders:** Very subtle. `border-slate-200` or `border-slate-800`.
- **Corners:** Rounded and friendly. Frequently `rounded-2xl` or `rounded-3xl` in main containers.

## 🌸 Decorative Background (PoppyBackground)

A key unifying element of this ecosystem is the `PoppyBackground.astro`. 
- It consists of a linear vector art of a poppy flower.
- It is positioned fixed (`fixed`) in the bottom right corner.
- It serves as a subtle decoration that doesn't compete with the main content, using colors that adapt to the theme mode (dark/light).

## 🌙 Dark Mode

The system supports dark mode natively. 
In Tailwind v4, this is implemented using the `@custom-variant dark (&:where(.dark, .dark *));` directive in the global CSS to force changes via the `dark` class added to the `<html>` element.

- **Light Background:** `bg-slate-50`
- **Dark Background:** `bg-slate-900` or `bg-slate-950`
- **Transitions:** All theme changes must occur smoothly using classes like `transition-colors duration-300`.

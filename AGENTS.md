# AGENTS.md — AI Agent Guidelines & Project Manual

> This file provides context to AI assistants (Gemini, Claude, etc.) about this repository.

## Project Description

Professional CV and personal website for **Ana-Catalina Alejandra Villalobos Contardo**, Civil Engineer and Data Scientist / ML Engineer. The site is a static single-page application (SPA) with a modern, responsive design, dark mode, PDF CV download, scroll animations, and bilingual support (Spanish/English).

**Public URL:** https://cv.ana-catalina.com/

## Tech Stack

| Category     | Technology                                      |
| ------------ | ----------------------------------------------- |
| Bundler      | Astro 6                                         |
| Styles       | Tailwind CSS v4 (CSS-first config, custom pastel palette) |
| JavaScript   | ES6+ (vanilla, no frameworks)                   |
| Typography   | Google Fonts — Outfit (headings), Inter (body)   |
| Deployment   | Vercel                                          |
| Node         | v20+                                            |

## Repository Structure

```
anacatalina-cv/
├── public/
│   ├── ACVC_es.pdf          # Downloadable CV in Spanish
│   ├── ACVC_en.pdf          # Downloadable CV in English
│   ├── favicon.ico          # Favicon (ICO fallback)
│   └── favicon.svg          # Favicon (SVG, primary)
├── src/
│   ├── pages/
│   │   └── index.astro      # Main Astro component (HTML + Frontmatter)
│   ├── layouts/
│   │   └── Layout.astro     # Shared HTML shell: head/meta, theme init script, Navbar/Footer
│   ├── components/          # Navbar.astro, Footer.astro, PoppyBackground.astro
│   ├── assets/
│   │   └── foto-perfil.jpg  # Profile photo (optimized at build time via astro:assets)
│   ├── main.js              # Core logic: theme, i18n, mobile menu, scroll, animations
│   ├── i18n.js              # ES/EN translations (exported `translations` object)
│   └── styles.css           # Tailwind v4 import, `@theme` tokens, custom utilities
├── astro.config.mjs         # Astro config: @tailwindcss/vite + @astrojs/sitemap
├── templates/                # Hand-maintained HTML used to render the downloadable PDFs
├── scripts/generate-pdf.mjs # Renders templates/*.html to PDF via headless Chrome/Edge
├── package.json             # Scripts: dev, build, build:pdf, preview
└── AGENTS.md                 # This file
```

## Custom Color Palette

Defined in `src/styles.css` under the `@theme` block (Tailwind v4 CSS-first config — there is no `tailwind.config.js`):

| Token          | Hex       | Usage                                    |
| -------------- | --------- | ---------------------------------------- |
| `pastelLilac`  | `#c7b8ea` | Accents, badges, decorative borders      |
| `pastelPink`   | `#f7c6d9` | Hover states, tags, highlights           |
| `pastelBlue`   | `#bcdffb` | Section backgrounds, cards               |
| `pastelMint`   | `#c8f3e0` | Success indicators, fresh accents        |

The base theme uses Tailwind's `slate` scale for grays. Functional accents use `indigo`.

## Dark Mode

- Declared via `@custom-variant dark (&:where(.dark, .dark *));` in `src/styles.css` (Tailwind v4's CSS-first equivalent of `darkMode: 'selector'`), toggled by the `dark` class on `<html>`.
- The toggle adds/removes the `dark` class and persists the preference in `localStorage.theme`.
- Separate icons for desktop and mobile (sun/moon).

## Internationalization (i18n) System

- **File:** `src/i18n.js` exports a `translations` object with keys like `"nav.experiencia"`.
- **HTML:** Elements use `data-i18n="key"` for text and `data-i18n-href="key"` for links.
- **Detection:** Auto-detects browser language; persists in `localStorage.lang`.
- **Toggle:** Separate desktop (`#lang-toggle-desktop`) and mobile (`#lang-toggle-mobile`) buttons.
- When adding new content, translations must be added in BOTH languages (`es` and `en`).

## Interactive Features (main.js)

| Feature              | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| Theme Toggle         | Switches light/dark mode with separate desktop/mobile icons         |
| Language Toggle      | Switches between ES/EN updating all `[data-i18n]` elements         |
| Mobile Menu          | Hamburger menu with animated open/close                             |
| Scroll Progress Bar  | Fixed progress bar at the top (`#scroll-progress`)                  |
| Back to Top          | Floating button that appears on scroll > 300px                      |
| Scroll Animations    | IntersectionObserver with `.reveal` → `.active` class               |
| Availability Badge   | Rendered conditionally at build time via the `isAvailableForWork` constant in `src/pages/index.astro`'s frontmatter (currently `false` — the badge markup is omitted from the HTML entirely, not just hidden via JS) |

## Custom Styles (styles.css)

- **`.reveal` / `.reveal.active`** — Scroll-triggered entry animations (opacity + translateY), toggled by the `IntersectionObserver` in `main.js`.
- **`@theme` tokens** — `--color-pastel-*` palette and `--animate-fade-in-up` / `--animate-fade-in` custom animations.
- Custom scrollbar rules for WebKit browsers.
- Note: `.timeline-dot` is used in `index.astro` only as a plain Tailwind-utility-styled element (no corresponding CSS rule in this file); `.glass` is not used anywhere in the codebase.

## Deployment

- **CI/CD:** Vercel.
- **Trigger:** Push to `main`.
- **Process:** Automatic build and deployment via Vercel.
- Base path: `/` (managed by Vercel adapter or default Astro config).

## Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Development server (Astro)
npm run build    # Production build → ./dist/
npm run preview  # Preview production build
```

## Conventions & Rules

### When modifying CV content:
1. Textual content lives in `src/pages/index.astro` (structure) and `src/i18n.js` (translations).
2. **Always** add translations in both languages (ES and EN).
3. Use the `data-i18n="new.key"` attribute in HTML for translatable text.
4. Use `data-i18n-href="new.key"` for links that change by language.
5. Also check `templates/cv-template-es.html` / `cv-template-en.html` (rendered to the downloadable PDFs by `scripts/generate-pdf.mjs`) for equivalent updates — they are hand-maintained separately from `src/i18n.js`, not generated from it, and already differ in wording where they haven't been kept in sync.

### When modifying styles:
1. Prefer inline Tailwind classes.
2. Only add custom CSS in `src/styles.css` for things Tailwind can't handle.
3. Respect the defined pastel palette.
4. Everything must look good in both light and dark mode (`dark:` variants).

### When adding JS features:
1. All logic goes in `src/main.js` inside the `init()` function.
2. Follow the existing pattern: get element → add listener → handle state.
3. Use descriptive IDs for elements (e.g., `theme-toggle-desktop`, `lang-toggle-mobile`).

### General:
- Never commit `node_modules/` or `dist/`.
- CV PDFs and favicons go in `public/` (served as-is, unoptimized).
- Images meant to be build-time optimized (e.g. the hero photo) go in `src/assets/` and are imported with `astro:assets`' `<Image>` component.
- `index.astro` is in `src/pages/`.

### Cross-Project Visual Consistency (Header & Toggles):
To maintain a seamless visual flow across the three portfolio websites (Homepage, CV, and Projects Hub), the following constraints must be respected in all repositories:
- **Header Layout:** The logo and actions header must use the exact unified layout: absolute positioning at `top-0 left-0 w-full` (with `pointer-events-none`), wrapping a container of `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8` and `h-16` (64px) height with `flex items-center justify-between` and `pointer-events-auto` for interactive child elements.
- **Language Toggle Dimensions:** The language toggle buttons must be styled identically with `w-10 sm:w-12 h-7 sm:h-8` dimensions, `text-[11px] sm:text-xs font-medium`, and `p-1` padding for the outer pill.
- **Language State Sync (`localStorage`):** Every language toggle interaction must store the chosen language in `localStorage.setItem('lang', 'es' | 'en')` so the selection translates seamlessly across projects.
- **SEO-Safe Redirection:** Client-side redirections based on language must ONLY occur if a saved preference exists in `localStorage` (e.g. `localStorage.getItem('lang')`). Never redirect on first load using browser language detection (`navigator.language`) to ensure search bots (Googlebot) can crawl all language versions natively without indexation issues.
  - Note: this rule targets the other portfolio sites, which have a separate URL per language. This CV repo's `navigator.language` auto-detection (`src/main.js`) only swaps in-page text client-side after the page has already rendered in Spanish — it never redirects or changes the URL, so it isn't affected by this rule.

### Layout and Styling Guidelines:
- **Sticky Headers & Anchor Links:** When implementing anchor links (`#id`) that jump to sections below a sticky header, use Tailwind's `scroll-mt-*` (e.g., `scroll-mt-24`) on the target element to prevent the sticky header from hiding the content.
- **Invisible Anchors in CSS Grid:** Do not place empty `<div>` anchor elements as direct children of a `grid` container, as this breaks the grid structure by consuming a full column. Instead, nest the anchor inside a grid item with `relative` positioning, and use absolute positioning for the offset (e.g., `absolute inset-x-0 -top-24`) on the invisible anchor.


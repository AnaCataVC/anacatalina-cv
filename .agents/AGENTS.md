# GEMINI.md — Project Context

> This file provides context to AI assistants (Gemini, Claude, etc.) about this repository.

## Project Description

Professional CV and personal website for **Ana-Catalina Alejandra Villalobos Contardo**, Civil Engineer and Data Scientist / ML Engineer. The site is a static single-page application (SPA) with a modern, responsive design, dark mode, PDF CV download, scroll animations, and bilingual support (Spanish/English).

**Public URL:** https://ana-catalina.com/

## Tech Stack

| Category     | Technology                                      |
| ------------ | ----------------------------------------------- |
| Bundler      | Astro 4                                         |
| Styles       | Tailwind CSS 3.4 (with custom pastel palette)   |
| PostCSS      | PostCSS + Autoprefixer                          |
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
│   ├── foto-perfil.jpg      # Profile photo
│   ├── favicon.ico          # Favicon (ICO)
│   └── favicon.svg          # Favicon (SVG)
├── src/
│   ├── pages/
│   │   └── index.astro      # Main Astro component (HTML + Frontmatter)
│   ├── main.js              # Core logic: theme, i18n, mobile menu, scroll, animations
│   ├── i18n.js              # ES/EN translations (exported `translations` object)
│   └── styles.css           # Global styles: font imports, Tailwind directives, custom utilities
├── astro.config.mjs         # Astro config
├── tailwind.config.js       # Custom colors, fonts, animations (fadeInUp, fadeIn)
├── postcss.config.js        # Plugin chain: tailwindcss + autoprefixer
├── package.json             # Scripts: dev, build, preview
└── GEMINI.md                # This file
```

## Custom Color Palette

Defined in `tailwind.config.js`:

| Token          | Hex       | Usage                                    |
| -------------- | --------- | ---------------------------------------- |
| `pastelLilac`  | `#c7b8ea` | Accents, badges, decorative borders      |
| `pastelPink`   | `#f7c6d9` | Hover states, tags, highlights           |
| `pastelBlue`   | `#bcdffb` | Section backgrounds, cards               |
| `pastelMint`   | `#c8f3e0` | Success indicators, fresh accents        |

The base theme uses Tailwind's `slate` scale for grays. Functional accents use `indigo`.

## Dark Mode

- Configured as `darkMode: 'selector'` in Tailwind (`dark` class on `<html>`).
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
| Availability Badge   | Configurable toggle via `CONFIG.isAvailableForWork` (currently `false`) |

## Custom Styles (styles.css)

- **`.glass`** — Glassmorphism: blur + semi-transparency + subtle border.
- **`.reveal` / `.reveal.active`** — Scroll-triggered entry animations (opacity + translateY).
- **`.timeline-dot`** — Animated dot for the experience timeline.
- Custom scrollbar for WebKit browsers.

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
- CV PDFs go in `public/`.
- Static assets (images, favicons) go in `public/`.
- `index.astro` is in `src/pages/`.

### Cross-Project Visual Consistency (Header & Toggles):
To maintain a seamless visual flow across the three portfolio websites (Homepage, CV, and Projects Hub), the following constraints must be respected in all repositories:
- **Header Layout:** The logo and actions header must use the exact unified layout: absolute positioning at `top-0 left-0 w-full` (with `pointer-events-none`), wrapping a container of `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8` and `h-16` (64px) height with `flex items-center justify-between` and `pointer-events-auto` for interactive child elements.
- **Language Toggle Dimensions:** The language toggle buttons must be styled identically with `w-10 sm:w-12 h-7 sm:h-8` dimensions, `text-[11px] sm:text-xs font-medium`, and `p-1` padding for the outer pill.
- **Language State Sync (`localStorage`):** Every language toggle interaction must store the chosen language in `localStorage.setItem('lang', 'es' | 'en')` so the selection translates seamlessly across projects.
- **SEO-Safe Redirection:** Client-side redirections based on language must ONLY occur if a saved preference exists in `localStorage` (e.g. `localStorage.getItem('lang')`). Never redirect on first load using browser language detection (`navigator.language`) to ensure search bots (Googlebot) can crawl all language versions natively without indexation issues.

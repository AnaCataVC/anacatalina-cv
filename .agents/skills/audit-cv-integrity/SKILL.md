---
name: audit-cv-integrity
description: Ejecuta la suite de auditoría estática de integridad del CV, validando paridad bilingüe en src/data/cv.ts, sincronización de claves i18n con el DOM, regla Zero Flags, invariantes de identidad y estado de los PDFs.
allowed-tools: Bash, Read, Grep, Find
---

# Skill: Audit CV Integrity & Quality Gate

Esta skill define el procedimiento de auditoría estática y verificación integral para garantizar que el CV (código fuente, datos estructurados, plantillas y artefactos compilados) cumpla rigurosamente con los contratos de calidad, paridad bilingüe, identidad e internacionalización del portafolio.

---

## Objetivos y Verificaciones Clave

La auditoría ejecuta cinco compuertas de calidad inmutables:

1. **Paridad Bilingüe del Single Source of Truth (`src/data/cv.ts`):**
   - Recorre recursivamente todas las entidades del modelo de datos (`cvData.basics`, `experience`, `skillCategories`, `education`, `publications`, `languages`, `certifications`).
   - Verifica que cada nodo de tipo `BilingualText` contenga valores `{ es, en }` válidos, no nulos y no vacíos.
   - Asegura la presencia de viñetas para la web (`bullets`) y viñetas optimizadas para impresión (`pdfBullets`).

2. **Integridad de Diccionarios y Enlaces al DOM (`src/i18n.js`):**
   - Valida que todas las llaves del diccionario de traducción tengan valores en español e inglés.
   - Escanea todos los componentes y páginas Astro (`src/**/*.astro`) en busca de atributos interactivos:
     - `data-i18n` (reemplazo de contenido HTML/texto)
     - `data-i18n-href` (reemplazo de URLs dinámicas por idioma)
     - `data-i18n-aria` (reemplazo accesible de etiquetas `aria-label` y `title`)
   - Verifica que el 100% de los identificadores referenciados en el DOM existan en el diccionario `translations`.

3. **Regla Zero Flags (Ausencia Absoluta de Banderas):**
   - Inspecciona archivos fuente, documentación y configuraciones (`src/`, `docs/`, `public/`, `README.md`, `README.es.md`, `AGENTS.md`).
   - Detecta cualquier glifo o carácter Unicode de la categoría *Regional Indicator Symbol* (`U+1F1E6` a `U+1F1FF`).
   - Prohíbe terminantemente el uso de banderas para representar idiomas.

4. **Invariantes de Identidad y Privacidad:**
   - Verifica que el primer nombre de la candidata sea obligatoriamente compuesto y con guión: `"Ana-Catalina"` (nunca sin guión).
   - Verifica que el correo de contacto sea el canónico: `anacatalina@outlook.cl`.
   - Escanea archivos públicos y de código en busca de fugas accidentales de rutas locales de la máquina (`C:\Users\...`, `/Users/...`, `/home/...`).

5. **Disponibilidad de Artefactos de Impresión (PDF) y Cache-Busting:**
   - Verifica la existencia y peso válido de `public/ACVC_es.pdf` y `public/ACVC_en.pdf`.
   - Verifica la presencia y formato ISO (`YYYY-MM-DD`) de `cvData.meta.lastUpdated` en `src/data/cv.ts`.
   - Verifica que los enlaces a los PDFs en `src/i18n.js` y `src/pages/index.astro` contengan el parámetro `?v=` alineado con la fecha de versión.
   - Verifica la integridad del template de renderizado headless `src/pages/print/[lang].astro`.

---

## Modo de Ejecución

### 1. Ejecución vía Script NPM (Recomendado)
Desde la raíz del repositorio, ejecuta:

```powershell
npm run audit:integrity
```

O invocando directamente el script con Node.js:
```powershell
node .agents/skills/audit-cv-integrity/scripts/audit-integrity.mjs
```

### 2. Flujo Completo de Compuerta Pre-Push
Para una validación integral antes de crear un commit o publicar una actualización del CV:

```powershell
# 1. Auditoría estática de integridad y paridad
npm run audit:integrity

# 2. Comprobación de tipos y sintaxis Astro/TypeScript
npx astro check

# 3. Compilación web y verificación del límite de 2 páginas del PDF
npm run build:pdf
```

---

## Resolución de Incidencias Comunes

| Fallo Reportado | Causa Raíz | Solución |
| :--- | :--- | :--- |
| `Empty or invalid 'en' translation at: cvData.experience[0].bullets[2]` | Se agregó una viñeta en español pero se dejó vacía o incompleta la traducción en inglés. | Completar la traducción simétrica en `src/data/cv.ts`. |
| `DOM references missing translation key 'nav.nuevoItem'` | Se agregó un elemento en `index.astro` con `data-i18n="nav.nuevoItem"` sin declararlo en `src/i18n.js`. | Agregar la entrada `{ es: "...", en: "..." }` dentro del objeto `translations` en `src/i18n.js`. |
| `Regional flag emoji detected in: README.md` | Se insertó un emoji de bandera (ej. 🇺🇸 o 🇪🇸). | Reemplazar por enlaces semánticos de texto (`[English](README.md) \| [Español](README.es.md)`) o códigos ISO (`EN` / `ES`). |
| `Local machine path leak detected` | Se incluyó una ruta absoluta de Windows/Linux en documentación o comentarios. | Reemplazar por rutas relativas o variables genéricas (`$HOME`, `/path/to/project`). |
| `Missing downloadable PDF artifacts in public/` | No se han generado los PDFs o se eliminaron de `public/`. | Ejecutar `npm run build:pdf` para compilarlos mediante Edge/Chrome headless. |

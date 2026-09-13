# CV Profesional - Ana-Catalina Villalobos

![License](https://img.shields.io/badge/License-All_Rights_Reserved-red.svg) 
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)
![Astro](https://img.shields.io/badge/Astro_6-BC52EE?logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?logo=tailwind-css&logoColor=white)

[Español](#español) | [English](#english)

---

<a name="español"></a>
## Español

### 1. Descripción del Proyecto
Este repositorio contiene el código fuente para el sitio web personal y CV profesional de **Ana-Catalina Alejandra Villalobos Contardo**, Ingeniera Civil y Data Scientist / ML Engineer. El sitio web está diseñado con una estética moderna, responsiva, con soporte para modo oscuro, descarga de CV en PDF, animaciones al hacer scroll y traducción al inglés.

### 2. Tecnologías Utilizadas
- **Core:** HTML5, CSS3, JavaScript (ES6+), TypeScript
- **Framework & Configuración:** [Astro](https://astro.build/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (con paleta personalizada en tonos pastel)
- **Deployment:** Vercel

### 3. ¿Cómo actualizar el CV? (Fuente Única de Verdad)
Toda la información del CV vive centralizada en un único archivo fuertemente tipado en TypeScript:
1. Edita el contenido en `src/data/cv.ts` (mantiene textos en español e inglés).
2. Ejecuta el comando de compilación y generación de PDFs:
   ```bash
   npm run build:pdf
   ```
   *Este comando compila la web y regenera automáticamente ambos PDFs (`ACVC_es.pdf` y `ACVC_en.pdf`), verificando que se mantenga el límite estricto de 2 páginas y la compatibilidad ATS.*

### 4. Comandos de Desarrollo
```bash
npm install       # Instalar dependencias
npm run dev       # Iniciar servidor de desarrollo local
npm run build     # Verificación de tipos + build de producción → ./dist/
npm run preview   # Previsualizar build de producción en local
npm run build:pdf # Generar y verificar los PDFs del CV (Windows — requiere Edge o Chrome)
```

### 5. Demo en Vivo
🌐 **CV Público:** [https://cv.ana-catalina.com/](https://cv.ana-catalina.com/)

### 6. Aprendizajes Destacados
Durante la construcción de este proyecto, los principales aprendizajes y desafíos incluyeron:
- **Single Source of Truth (SSOT):** Centralización de datos bilingües con TypeScript para alimentar simultáneamente la web interactiva y las plantillas de impresión PDF sin duplicación.
- **Despliegue (Deployment):** Comparar y aprender las diferencias entre el despliegue en GitHub Pages vs Vercel.
- **Diseño Web & ATS:** Creación de documentos PDF que conservan al 100% la estética de marca propia mientras superan filtros ATS gracias a un flujo lineal y capa de texto vectorial nativa.
- **UX/UI:** Optimización de la experiencia de usuario (UX) e interfaz de usuario (UI), incluyendo animaciones suaves y soporte para modo oscuro.
- **Maquetación Avanzada:** Resolución de conflictos de scroll con headers sticky y estructuración de layouts complejos utilizando CSS Grid y Tailwind CSS.

> 💡 **¿Te gusta este diseño?** He creado un template básico de este CV para que puedas usarlo y personalizarlo. Puedes encontrarlo aquí: [AnaCataVC/my-cv](https://github.com/AnaCataVC/my-cv/)

---

<a name="english"></a>
## English

### 1. Project Description
This repository contains the source code for the personal website and professional CV of **Ana-Catalina Alejandra Villalobos Contardo**, Civil Engineer and Data Scientist / ML Engineer. The website is designed with a modern, responsive aesthetic, featuring dark mode support, PDF CV download, scroll animations, and English translation.

### 2. Technologies Used
- **Core:** HTML5, CSS3, JavaScript (ES6+), TypeScript
- **Framework & Config:** [Astro](https://astro.build/)
- **Styles:** [Tailwind CSS v4](https://tailwindcss.com/) (with a custom pastel color palette)
- **Deployment:** Vercel

### 3. Repository Structure
```
anacatalina-cv/
├── public/               # Static assets (PDFs, favicons, OG image, CNAME, robots.txt)
├── src/
│   ├── data/
│   │   └── cv.ts         # Single Source of Truth (SSOT) for all CV data (ES/EN)
│   ├── pages/
│   │   ├── index.astro   # Main interactive portfolio page
│   │   └── print/
│   │       └── [lang].astro # Print-optimized Astro template for headless PDF rendering
│   ├── layouts/          # Layout.astro — shared HTML shell
│   ├── components/       # Navbar, Footer, PoppyBackground
│   ├── assets/           # Profile photo (optimized at build time)
│   ├── main.js           # Theme, i18n, mobile menu, scroll, animations
│   ├── i18n.js           # ES/EN translations (hydrated dynamically from src/data/cv.ts)
│   └── styles.css        # Tailwind v4 + custom palette + animations
└── scripts/
    └── generate-pdf.mjs  # Headless Edge/Chrome PDF generator with strict 2-page verification
```

### 4. How to Update the CV (Single Source of Truth)
All CV data is centralized in a single typed TypeScript file:
1. Edit content in `src/data/cv.ts` (contains bilingual text for all sections).
2. Run the PDF build script:
   ```bash
   npm run build:pdf
   ```
   *This command compiles the static Astro print routes and regenerates both PDFs (`ACVC_es.pdf` and `ACVC_en.pdf`), enforcing a strict 2-page budget and full ATS compatibility.*

### 5. Development Commands
```bash
npm install       # Install dependencies
npm run dev       # Start development server
npm run build     # Type-check + production build → ./dist/
npm run preview   # Preview production build locally
npm run build:pdf # Generate and verify PDF CVs (Windows only — requires Edge or Chrome)
```

### 6. Key Learnings
During the development of this project, the main learnings and challenges included:
- **Single Source of Truth (SSOT):** Centralizing bilingual data with TypeScript to power both the interactive website and PDF print templates without code duplication.
- **Deployment:** Comparing and learning the differences between deploying on GitHub Pages vs Vercel.
- **Web Design & ATS:** Engineering print templates that preserve 100% brand styling while ensuring top-tier ATS parser compatibility via native vector text streams.
- **UX/UI:** Optimizing the User Experience (UX) and User Interface (UI), including smooth animations and dark mode support.
- **Advanced Layout:** Resolving scroll conflicts with sticky headers and structuring complex layouts using CSS Grid and Tailwind CSS.

### 7. Live Demo
🌐 **Public CV:** [https://cv.ana-catalina.com/](https://cv.ana-catalina.com/)

> 💡 **Do you like this design?** I have created a basic template of this CV for you to use and customize. You can find it here: [AnaCataVC/my-cv](https://github.com/AnaCataVC/my-cv/)
import { cvData } from './data/cv';

const simpliroute = cvData.experience.find(e => e.id === 'simpliroute');
const fracttal1 = cvData.experience.find(e => e.id === 'fracttal1');
const fracttal2 = cvData.experience.find(e => e.id === 'fracttal2');
const fracttal3 = cvData.experience.find(e => e.id === 'fracttal3');

const eduCivil = cvData.education.find(e => e.id === 'civil');
const eduBsc = cvData.education.find(e => e.id === 'bsc');
const pub = cvData.publications[0];

export const translations = {
  // Navigation
  "nav.experiencia": {
    es: "Experiencia",
    en: "Experience"
  },
  "nav.habilidades": {
    es: "Habilidades",
    en: "Skills"
  },
  "nav.publicaciones": {
    es: "Formación y Publicaciones",
    en: "Education & Publications"
  },
  
  // Hero Section
  "hero.badge": {
    es: "Disponible para Proyectos & Liderazgo de Datos",
    en: "Available for Data Leadership & Projects"
  },
  "hero.subtitle": cvData.basics.contact.title,
  "hero.downloadBtn": {
    es: "Descargar CV",
    en: "Download CV"
  },
  "hero.cvUrl": {
    es: "ACVC_es.pdf",
    en: "ACVC_en.pdf"
  },
  "hero.expBtn": {
    es: "Experiencia",
    en: "Experience"
  },
  "hero.skillsBtn": {
    es: "Habilidades",
    en: "Skills"
  },
  "hero.location": cvData.basics.contact.location,
  
  // About Me Section
  "about.title": {
    es: "Sobre Mí",
    en: "About Me"
  },
  "about.p1": cvData.basics.summary.web[0],
  "about.p2": cvData.basics.summary.web[1],
  "about.p3": cvData.basics.summary.web[2],
  "about.p4": cvData.basics.summary.web[3],
  
  // Experience Section
  "exp.title": {
    es: "Experiencia Profesional",
    en: "Professional Experience"
  },
  "exp.simpliroute.title": simpliroute.role,
  "exp.simpliroute.date": simpliroute.date,
  "exp.simpliroute.location": simpliroute.location,
  "exp.simpliroute.b1": simpliroute.bullets[0],
  "exp.simpliroute.b2": simpliroute.bullets[1],
  "exp.simpliroute.b3": simpliroute.bullets[2],
  "exp.simpliroute.b4": simpliroute.bullets[3],
  
  "exp.fracttal1.title": fracttal1.role,
  "exp.fracttal1.date": fracttal1.date,
  "exp.fracttal1.location": fracttal1.location,
  "exp.fracttal1.b1": fracttal1.bullets[0],
  "exp.fracttal1.b2": fracttal1.bullets[1],
  "exp.fracttal1.b3": fracttal1.bullets[2],
  "exp.fracttal1.b4": fracttal1.bullets[3],

  "exp.fracttal2.title": fracttal2.role,
  "exp.fracttal2.date": fracttal2.date,
  "exp.fracttal2.location": fracttal2.location,
  "exp.fracttal2.b1": fracttal2.bullets[0],
  "exp.fracttal2.b2": fracttal2.bullets[1],
  "exp.fracttal2.b3": fracttal2.bullets[2],
  "exp.fracttal2.b4": fracttal2.bullets[3],

  "exp.fracttal3.title": fracttal3.role,
  "exp.fracttal3.date": fracttal3.date,
  "exp.fracttal3.location": fracttal3.location,
  "exp.fracttal3.b1": fracttal3.bullets[0],
  "exp.fracttal3.b2": fracttal3.bullets[1],
  "exp.fracttal3.b3": fracttal3.bullets[2],

  // Skills Section
  "skills.title": {
    es: "Habilidades & Herramientas",
    en: "Skills & Tools"
  },
  "skills.ai.title": {
    es: "IA Agéntica & Machine Learning",
    en: "Agentic AI & Machine Learning"
  },
  "skills.ai.1": { es: "Sistemas Multi-Agente", en: "Multi-Agent Systems" },
  "skills.ai.2": { es: "LLMs & GenAI", en: "LLMs & GenAI" },
  // Note: skills.ai.3 was intentionally removed; numbering preserved to avoid breaking changes
  "skills.ai.4": { es: "Analítica de Datos", en: "Data Analytics" },
  "skills.ai.5": { es: "Estadística & Probabilidad", en: "Statistics & Probability" },
  "skills.ai.6": { es: "Claude Code & Antigravity", en: "Claude Code & Antigravity" },
  "skills.ai.7": { es: "Prompt Engineering", en: "Prompt Engineering" },
  "skills.ai.8": { es: "Automatización CI/CD con IA", en: "AI-Powered CI/CD Automation" },
  "skills.ai.9": { es: "Model Context Protocol (MCP)", en: "Model Context Protocol (MCP)" },
  "skills.ai.10": { es: "Monitoreo de Modelos ML", en: "ML Model Monitoring" },

  "skills.methodologies.title": {
    es: "Metodologías & Gestión de Producto",
    en: "Methodologies & Product Management"
  },
  "skills.leadership.1": { es: "Liderazgo Técnico", en: "Technical Leadership" },
  "skills.leadership.2": { es: "Metodologías Ágiles", en: "Agile Methodologies" },
  "skills.leadership.3": { es: "Planificación de Roadmaps", en: "Roadmap Planning" },
  "skills.leadership.4": { es: "Colaboración Cross-functional", en: "Cross-functional Collaboration" },
  "skills.methodologies.1": { es: "Diseño de Sistemas", en: "System Design" },
  "skills.methodologies.2": { es: "Test-Driven Development (TDD)", en: "Test-Driven Development (TDD)" },

  "skills.soft.title": {
    es: "Liderazgo & Habilidades Blandas",
    en: "Leadership & Soft Skills"
  },
  "skills.soft.1": { es: "Team Building", en: "Team Building" },
  "skills.soft.2": { es: "Comunicación Efectiva", en: "Effective Communication" },
  // Note: skills.soft.3 was intentionally removed; numbering preserved to avoid breaking changes
  "skills.soft.4": { es: "Resolución de Problemas", en: "Problem Solving" },

  "skills.lang.title": {
    es: "Lenguajes de Programación",
    en: "Programming Languages"
  },
  "skills.lang.1": { es: "Python", en: "Python" },
  "skills.lang.2": { es: "SQL", en: "SQL" },
  "skills.lang.3": { es: "MATLAB", en: "MATLAB" },
  "skills.lang.4": { es: "JavaScript", en: "JavaScript" },
  "skills.lang.5": { es: "TypeScript", en: "TypeScript" },
  "skills.lang.6": { es: "Java", en: "Java" },
  "skills.lang.7": { es: "C# (.NET)", en: "C# (.NET)" },

  "skills.frontend.title": {
    es: "Frontend, Mobile & Desarrollo Web",
    en: "Frontend, Mobile & Web Development"
  },
  "skills.frontend.1": { es: ".NET 9 (WPF / WinUI 3)", en: ".NET 9 (WPF / WinUI 3)" },
  "skills.frontend.2": { es: "FastHTML & HTMX", en: "FastHTML & HTMX" },

  "skills.ml.title": {
    es: "Ciencia de Datos & Librerías ML",
    en: "Data Science & ML Libraries"
  },
  "skills.ml.1": { es: "Teoría de Grafos", en: "Graph Theory" },

  "skills.backend_db.title": {
    es: "Backend, Bases de Datos & Big Data",
    en: "Backend, Databases & Big Data"
  },

  "skills.cloud.title": {
    es: "Contenedores, Orquestación & Cloud",
    en: "Containers, Orchestration & Cloud"
  },
  "skills.cloud.1": { es: "Google Cloud Run & Artifact Registry", en: "Google Cloud Run & Artifact Registry" },

  // Education Section
  "edu.title.only": {
    es: "Educación",
    en: "Education"
  },
  "edu.civil.title": eduCivil.degree,
  "edu.civil.date": eduCivil.date,
  "edu.civil.desc": eduCivil.details,
  "edu.bsc.title": eduBsc.degree,
  "edu.bsc.date": eduBsc.date,
  "edu.bsc.desc": eduBsc.details,

  "edu.cert.title": {
    es: "Cursos & Certificaciones",
    en: "Courses & Certifications"
  },
  "edu.cert.1.desc": {
    es: "EF SET - Nivel C2 Proficient",
    en: "EF SET - C2 Proficient Level"
  },
  
  // Publications Section
  "pub.title": {
    es: "Publicaciones Científicas",
    en: "Scientific Publications"
  },
  "pub.date": pub.date,
  "pub.desc": pub.description,
  "pub.link": {
    es: "Ver artículo en Wiley Online Library",
    en: "View article in Wiley Online Library"
  },

  // Footer
  "footer.rights": {
    es: "© 2026 <a href=\"https://ana-catalina.com/\" class=\"hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors\">Ana-Catalina Villalobos Contardo</a>. Todos los derechos reservados.",
    en: "© 2026 <a href=\"https://ana-catalina.com/\" class=\"hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors\">Ana-Catalina Villalobos Contardo</a>. All rights reserved."
  },
  "footer.made": {
    es: "Diseño y desarrollo propio · Creado con <span class=\"text-pink-500\">♥</span> usando Astro + Tailwind CSS · Publicado en Vercel",
    en: "Designed & developed by me · Built with <span class=\"text-pink-500\">♥</span> using Astro + Tailwind CSS · Deployed on Vercel"
  },
  "footer.template": {
    es: "¿Te gusta este diseño? <a href=\"https://github.com/AnaCataVC/my-cv/\" target=\"_blank\" class=\"text-indigo-500 dark:text-indigo-400 hover:underline font-medium\">Usa la plantilla base aquí</a>.",
    en: "Do you like this design? <a href=\"https://github.com/AnaCataVC/my-cv/\" target=\"_blank\" class=\"text-indigo-500 dark:text-indigo-400 hover:underline font-medium\">Use the base template here</a>."
  },

  // Accessibility strings (used for aria-label and skip-link via data-i18n-aria)
  "a11y.skipLink": {
    es: "Saltar al contenido principal",
    en: "Skip to main content"
  },
  "aria.changeLang": {
    es: "Cambiar idioma",
    en: "Switch language"
  },
  "aria.changeTheme": {
    es: "Cambiar tema",
    en: "Toggle theme"
  },
  "aria.openMenu": {
    es: "Abrir menú de navegación",
    en: "Open navigation menu"
  }
};

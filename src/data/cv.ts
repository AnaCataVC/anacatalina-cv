/**
 * Single Source of Truth (SSOT) for Ana-Catalina's CV.
 * 
 * Used by:
 * - src/pages/index.astro (Interactive Portfolio Web)
 * - src/i18n.js (Bilingual client-side state)
 * - src/pages/print/[lang].astro (Print-optimized view for headless PDF generation)
 */

export interface BilingualText {
  es: string;
  en: string;
}

export interface ContactInfo {
  name: string;
  title: BilingualText;
  location: BilingualText;
  email: string;
  website: string;
  websiteDisplay: string;
  linkedin: string;
  github: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: BilingualText;
  date: BilingualText;
  location: BilingualText;
  badgeVariant: 'lilac' | 'pink' | 'blue' | 'mint';
  // Web bullets (can contain <strong> tags)
  bullets: BilingualText[];
  // Optional condensed bullets for the 2-page print layout
  pdfBullets?: BilingualText[];
}

export interface SkillCategory {
  id: string;
  title: BilingualText;
  // Label used in the print view (e.g. "Lenguajes de Programación:")
  pdfLabel: BilingualText;
  // Skills list for the category
  skills: Array<{
    name: BilingualText | string;
  }>;
  // Preformatted or selected skills line for the compact print view
  pdfFormatted: BilingualText;
}

export interface EducationItem {
  id: string;
  institution: BilingualText;
  degree: BilingualText;
  date: BilingualText;
  details: BilingualText;
  pdfDetails?: BilingualText;
}

export interface PublicationItem {
  id: string;
  title: string;
  journal: string;
  date: BilingualText;
  url: string;
  doi: string;
  description: BilingualText;
  pdfDescription?: BilingualText;
}

export interface LanguageItem {
  language: BilingualText;
  level: BilingualText;
}

export interface CertificationItem {
  title: BilingualText;
  issuer: string;
  year: string;
}

export interface CVData {
  basics: {
    contact: ContactInfo;
    summary: {
      web: BilingualText[];
      pdf: BilingualText;
    };
  };
  experience: ExperienceItem[];
  skillCategories: SkillCategory[];
  education: EducationItem[];
  publications: PublicationItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
}

export const cvData: CVData = {
  basics: {
    contact: {
      name: 'Ana-Catalina Villalobos Contardo',
      title: {
        es: 'Data Scientist & Machine Learning Engineer',
        en: 'Data Scientist & Machine Learning Engineer'
      },
      location: {
        es: 'Región Metropolitana, Chile',
        en: 'Metropolitan Region, Chile'
      },
      email: 'anacatalina@outlook.cl',
      website: 'https://ana-catalina.com',
      websiteDisplay: 'ana-catalina.com',
      linkedin: 'https://linkedin.com/in/ana-catalina/',
      github: 'https://github.com/AnaCataVC/'
    },
    summary: {
      web: [
        {
          es: 'Ingeniera especializada en Ciencia de Datos, Machine Learning e IA Agéntica, con experiencia liderando equipos y construyendo sistemas inteligentes para logística, automatización y análisis avanzado.',
          en: 'Engineer specialized in Data Science, Machine Learning, and Agentic AI, with experience leading teams and building intelligent systems for logistics, automation, and advanced analytics.'
        },
        {
          es: 'De formación Ingeniera Civil de la Universidad de Chile, me motiva aplicar Machine Learning para resolver problemas complejos y transformar datos en valor real, tal como lo plasmé en mi trabajo de tesis publicado en <a href="#publicaciones" class="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Structural Control Health Monitoring</a> en 2021.',
          en: 'With a background in Civil Engineering from the Universidad de Chile, I am driven to apply Machine Learning to solve complex problems and transform data into real value, as reflected in my thesis published in <a href="#publicaciones" class="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Structural Control Health Monitoring</a> in 2021.'
        },
        {
          es: 'A lo largo de mi trayectoria, he liderado equipos multidisciplinarios y colaborado en el desarrollo de soluciones tecnológicas donde la ingeniería, el análisis avanzado y el impacto práctico convergen.',
          en: 'Throughout my career, I have led multidisciplinary teams and collaborated on the development of technological solutions where engineering, advanced analytics, and practical impact converge.'
        },
        {
          es: 'Actualmente como <a href="#simpliroute" class="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Learning Engineer en SimpliRoute</a>, me enfoco principalmente en el diseño de infraestructura agéntica basada en MCP y sistemas distribuidos de geocodificación, junto con procesamiento de datos a gran escala y operación de modelos de ML.',
          en: 'Currently working as a <a href="#simpliroute" class="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Learning Engineer at SimpliRoute</a>, I focus primarily on designing MCP-based agentic infrastructure and distributed geocoding systems, alongside large-scale data processing and ML model operations.'
        }
      ],
      pdf: {
        es: 'Ingeniera Civil con sólida trayectoria en Ciencia de Datos, Machine Learning, IA Agéntica e Ingeniería de Datos. Conjuga una base analítica y matemática rigurosa con experiencia práctica construyendo infraestructura agéntica basada en Model Context Protocol (MCP), sistemas distribuidos de alta disponibilidad (geocodificación, microservicios), pipelines de datos a escala (ETL/ELT) y soluciones de ML (mantenimiento predictivo, optimización operacional). Experiencia comprobada en liderazgo técnico de equipos multidisciplinarios, con foco en la resolución de problemas complejos, confiabilidad operativa e impacto estratégico.',
        en: 'Civil Engineer with a strong track record in Data Science, Machine Learning, Agentic AI, and Data Engineering. Combines a rigorous analytical and mathematical foundation with hands-on experience building agentic infrastructure powered by Model Context Protocol (MCP), high-availability distributed systems (geocoding, microservices), large-scale data pipelines (ETL/ELT), and ML solutions (predictive maintenance, operational optimization). Proven technical leadership managing multidisciplinary teams, focused on solving complex problems, operational reliability, and strategic impact.'
      }
    }
  },
  experience: [
    {
      id: 'simpliroute',
      company: 'SimpliRoute',
      role: {
        es: 'Learning Engineer',
        en: 'Learning Engineer'
      },
      date: {
        es: 'Agosto 2025 - Presente',
        en: 'August 2025 - Present'
      },
      location: {
        es: 'Santiago, Chile (Remoto)',
        en: 'Santiago, Chile (Remote)'
      },
      badgeVariant: 'lilac',
      bullets: [
        {
          es: 'Diseño y despliegue en producción de <strong class="text-slate-800 dark:text-slate-100 font-semibold">infraestructura agéntica basada en Model Context Protocol (MCP)</strong> para motores logísticos, implementando guardrails deterministas, permisos de ejecución de herramientas de mínimo privilegio y persistencia distribuida con Redis en Kubernetes.',
          en: 'Design and production deployment of <strong class="text-slate-800 dark:text-slate-100 font-semibold">enterprise agentic infrastructure leveraging Model Context Protocol (MCP)</strong> for logistics engines, establishing deterministic guardrails, least-privilege tool execution boundaries, and distributed state persistence on Kubernetes with Redis.'
        },
        {
          es: '<strong class="text-slate-800 dark:text-slate-100 font-semibold">Arquitectura e implementación de un sistema distribuido de geolocalización y geocodificación multi-proveedor</strong>, diseñando pipelines asíncronos desacoplados, estrategias de alta disponibilidad, concurrencia segura y tolerancia a fallos.',
          en: '<strong class="text-slate-800 dark:text-slate-100 font-semibold">Architecture and implementation of a fault-tolerant, multi-provider geolocation and geocoding platform</strong>, designing decoupled asynchronous pipelines, high-availability fallback strategies, thread-safe concurrency, and standardized microservices.'
        },
        {
          es: 'Gestión y modelado de datos a gran escala en <strong class="text-slate-800 dark:text-slate-100 font-semibold">Google BigQuery</strong>, canalizaciones de procesamiento distribuido con <strong class="text-slate-800 dark:text-slate-100 font-semibold">Google Cloud Dataflow / Apache Beam</strong> y orquestación con <strong class="text-slate-800 dark:text-slate-100 font-semibold">Google Pub/Sub y Apache Airflow</strong>, garantizando linaje de datos y telemetría crítica.',
          en: 'Large-scale data modeling in <strong class="text-slate-800 dark:text-slate-100 font-semibold">Google BigQuery</strong>, distributed processing pipelines with <strong class="text-slate-800 dark:text-slate-100 font-semibold">Google Cloud Dataflow / Apache Beam</strong>, and event orchestration with <strong class="text-slate-800 dark:text-slate-100 font-semibold">Google Pub/Sub and Apache Airflow</strong>, ensuring data lineage, operational reliability, and real-time telemetry.'
        },
        {
          es: 'Participación en la evolución y operación de <strong class="text-slate-800 dark:text-slate-100 font-semibold">modelos predictivos en producción</strong>, automatizando flujos de reentrenamiento y monitoreo de desempeño.',
          en: 'Contribution to the evolution and operation of <strong class="text-slate-800 dark:text-slate-100 font-semibold">production predictive models</strong>, automating retraining workflows and performance monitoring.'
        }
      ],
      pdfBullets: [
        {
          es: 'Diseño y despliegue de infraestructura agéntica en producción basada en Model Context Protocol (MCP), con guardrails deterministas, mínimo privilegio y estado distribuido en Redis/Kubernetes.',
          en: 'Designed and deployed production agentic infrastructure using Model Context Protocol (MCP), featuring deterministic guardrails, least-privilege execution, and Redis/Kubernetes state persistence.'
        },
        {
          es: 'Arquitectura de plataforma distribuida de geolocalización y geocodificación multi-proveedor mediante microservicios asíncronos desacoplados, alta disponibilidad, concurrencia segura y tolerancia a fallos.',
          en: 'Architected a high-availability, fault-tolerant multi-provider geolocation and geocoding platform using decoupled asynchronous microservices, thread-safe concurrency, and fallback strategies.'
        },
        {
          es: 'Modelado de datos en Google BigQuery, procesamiento distribuido con Google Cloud Dataflow y orquestación de eventos con Google Pub/Sub y Apache Airflow, asegurando linaje y confiabilidad operativa.',
          en: 'Data modeling in Google BigQuery, distributed processing with Google Cloud Dataflow, and event orchestration with Google Pub/Sub and Apache Airflow, ensuring lineage and operational reliability.'
        },
        {
          es: 'Automatización de pipelines de reentrenamiento y monitoreo operativo para modelos predictivos de Machine Learning en producción.',
          en: 'Automated retraining pipelines and operational monitoring for production Machine Learning predictive models.'
        }
      ]
    },
    {
      id: 'fracttal1',
      company: 'Fracttal',
      role: {
        es: 'Tech Lead Fracttal Hub',
        en: 'Tech Lead Fracttal Hub'
      },
      date: {
        es: 'Noviembre 2023 - Julio 2025',
        en: 'November 2023 - July 2025'
      },
      location: {
        es: 'Santiago, Chile',
        en: 'Santiago, Chile'
      },
      badgeVariant: 'pink',
      bullets: [
        {
          es: '<strong class="text-slate-800 dark:text-slate-100 font-semibold">Liderazgo de equipo multidisciplinario de integraciones</strong> con personas en distintos países, enfocado en mentoría técnica, desarrollo profesional y un entorno colaborativo.',
          en: '<strong class="text-slate-800 dark:text-slate-100 font-semibold">Leadership of a multidisciplinary integrations team</strong> with members across different countries, focused on technical mentoring, professional development, and a collaborative environment.'
        },
        {
          es: 'Planificación estratégica del roadmap de Fracttal Hub, alineando los objetivos de negocio y la entrega continua de valor a clientes.',
          en: 'Strategic planning of the Fracttal Hub roadmap, aligning business objectives with the continuous delivery of value to clients.'
        },
        {
          es: 'Desarrollo en Python para librerías de procesamiento de datos y orquestación de tareas, habilitando la integración con múltiples fuentes y destinos, con <strong class="text-slate-800 dark:text-slate-100 font-semibold">más de 100 acciones posibles</strong> y capacidades avanzadas de transformación.',
          en: 'Python development for data processing libraries and task orchestration, enabling integration with multiple sources and destinations, featuring <strong class="text-slate-800 dark:text-slate-100 font-semibold">over 100 possible actions</strong> and advanced transformation capabilities.'
        },
        {
          es: 'Supervisión y coordinación de proyectos de integración para decenas de clientes, aplicando gestión eficiente de recursos, plazos y flujos de datos confiables.',
          en: 'Supervision and coordination of integration projects for dozens of clients, applying efficient resource management, meeting deadlines, and ensuring reliable data flows.'
        }
      ],
      pdfBullets: [
        {
          es: 'Liderazgo técnico de un equipo multidisciplinario e internacional de integraciones y planificación estratégica del roadmap de Fracttal Hub, alineando objetivos de negocio, mentoría y entrega continua de valor.',
          en: 'Technical leadership of an international, multidisciplinary integrations team and strategic roadmap planning for Fracttal Hub, aligning business objectives, mentoring, and continuous value delivery.'
        },
        {
          es: 'Desarrollo en Python de librerías de procesamiento de datos y orquestación de tareas con más de 100 acciones de integración y transformación avanzada entre sistemas heterogéneos.',
          en: 'Python development of data processing and task orchestration libraries featuring over 100 integration actions and advanced transformations across heterogeneous systems.'
        },
        {
          es: 'Supervisión y coordinación de proyectos de integración para decenas de clientes empresariales, garantizando cumplimiento de plazos y confiabilidad en los flujos de datos.',
          en: 'Supervised and coordinated enterprise integration projects for dozens of clients, ensuring on-time delivery and high-reliability data pipelines.'
        }
      ]
    },
    {
      id: 'fracttal2',
      company: 'Fracttal',
      role: {
        es: 'Data Scientist',
        en: 'Data Scientist'
      },
      date: {
        es: 'Agosto 2021 - Noviembre 2023',
        en: 'August 2021 - November 2023'
      },
      location: {
        es: 'Santiago, Chile',
        en: 'Santiago, Chile'
      },
      badgeVariant: 'blue',
      bullets: [
        {
          es: 'Diseño e implementación de procesos de ciencia de datos para las plataformas Predictto y Fracttal One, con foco en generar valor a partir de datos operacionales de maquinaria.',
          en: 'Design and implementation of data science processes for the Predictto and Fracttal One platforms, focusing on generating value from operational machinery data.'
        },
        {
          es: 'Desarrollo de modelos analíticos aplicados a <strong class="text-slate-800 dark:text-slate-100 font-semibold">mantenimiento predictivo, priorización de activos y predicción de fallas</strong> combinando ML, estadística y conocimiento del dominio.',
          en: 'Development of analytical models applied to <strong class="text-slate-800 dark:text-slate-100 font-semibold">predictive maintenance, asset prioritization, and failure prediction</strong>, combining ML, statistics, and domain knowledge.'
        },
        {
          es: 'Colaboración en la creación y desarrollo de producto para gestionar integraciones entre Fracttal y otras plataformas de software empresariales.',
          en: 'Collaboration in product creation and development to manage integrations between Fracttal and other enterprise software platforms.'
        },
        {
          es: 'Evaluación continua de modelos en producción, optimizando pipelines de datos para garantizar la precisión y robustez en entornos reales.',
          en: 'Continuous evaluation of production models, optimizing data pipelines to ensure accuracy and robustness in real-world environments.'
        }
      ],
      pdfBullets: [
        {
          es: 'Diseño e implementación de procesos de ciencia de datos para mantenimiento predictivo, priorización de activos y estimación de fallas.',
          en: 'Designed and implemented data science processes for predictive maintenance, asset prioritization, and failure estimation.'
        },
        {
          es: 'Colaboración en la creación y desarrollo de producto para gestionar integraciones entre Fracttal y otras plataformas.',
          en: 'Collaborated on product creation and development to manage integrations between Fracttal and other platforms.'
        }
      ]
    },
    {
      id: 'fracttal3',
      company: 'Fracttal',
      role: {
        es: 'Analista de Datos',
        en: 'Data Analyst'
      },
      date: {
        es: 'Febrero 2020 - Julio 2021',
        en: 'February 2020 - July 2021'
      },
      location: {
        es: 'Santiago, Chile',
        en: 'Santiago, Chile'
      },
      badgeVariant: 'lilac',
      bullets: [
        {
          es: 'Desarrollo desde cero de la herramienta de mantenimiento predictivo, utilizando análisis estadístico avanzado y modelos preliminares de Machine Learning.',
          en: 'Development from scratch of the predictive maintenance tool, using advanced statistical analysis and preliminary Machine Learning models.'
        },
        {
          es: 'Diseño, manejo y optimización de bases de datos relacionales para almacenar lecturas de telemetría e historial de mantenimiento.',
          en: 'Design, management, and optimization of relational databases to store telemetry readings and maintenance history.'
        },
        {
          es: 'Apoyo en el desarrollo web frontend/backend básico de visualizaciones de datos y métricas para tomadores de decisiones.',
          en: 'Support in basic frontend/backend web development for data visualizations and metrics for decision-makers.'
        }
      ],
      pdfBullets: [
        {
          es: 'Desarrollo de herramienta de mantenimiento predictivo, utilizando análisis avanzado, estadística predictiva, y Machine Learning.',
          en: 'Developed a predictive maintenance tool using advanced data analysis, predictive statistics, and Machine Learning techniques.'
        },
        {
          es: 'Diseño y manejo de bases de datos y desarrollo web.',
          en: 'Database design and management alongside web development tasks.'
        }
      ]
    }
  ],
  skillCategories: [
    {
      id: 'lang',
      title: {
        es: 'Lenguajes de Programación',
        en: 'Programming Languages'
      },
      pdfLabel: {
        es: 'Lenguajes de Programación:',
        en: 'Programming Languages:'
      },
      skills: [
        { name: 'Python' },
        { name: 'SQL' },
        { name: 'TypeScript' },
        { name: 'JavaScript' },
        { name: 'MATLAB' },
        { name: 'C# / .NET' },
        { name: 'Kotlin' }
      ],
      pdfFormatted: {
        es: 'Python (Principal/Avanzado) | SQL | TypeScript | JavaScript | MATLAB.',
        en: 'Python (Principal/Advanced) | SQL | TypeScript | JavaScript | MATLAB.'
      }
    },
    {
      id: 'cloud',
      title: {
        es: 'Cloud y DevOps',
        en: 'Cloud & DevOps'
      },
      pdfLabel: {
        es: 'Cloud y DevOps:',
        en: 'Cloud & DevOps:'
      },
      skills: [
        { name: 'Google Cloud Platform (BigQuery, Dataflow, Cloud Run, Artifact Registry, Pub/Sub, Cloud Storage, GKE)' },
        { name: 'ArgoCD' },
        { name: 'Git' },
        { name: 'GitHub' },
        { name: 'Bitbucket' }
      ],
      pdfFormatted: {
        es: 'Google Cloud Platform (BigQuery, Dataflow, Cloud Run, Artifact Registry, Google Pub/Sub, Cloud Storage, GKE) | ArgoCD | Git | GitHub | Bitbucket.',
        en: 'Google Cloud Platform (BigQuery, Dataflow, Cloud Run, Artifact Registry, Google Pub/Sub, Cloud Storage, GKE) | ArgoCD | Git | GitHub | Bitbucket.'
      }
    },
    {
      id: 'frameworks',
      title: {
        es: 'Frameworks y Librerías',
        en: 'Frameworks & Libraries'
      },
      pdfLabel: {
        es: 'Frameworks y Librerías:',
        en: 'Frameworks & Libraries:'
      },
      skills: [
        { name: 'FastAPI' },
        { name: 'Pydantic' },
        { name: 'Pandas' },
        { name: 'NumPy' },
        { name: 'Scikit-learn' },
        { name: 'LangChain' },
        { name: 'TensorFlow' },
        { name: 'Django' },
        { name: 'React JS' }
      ],
      pdfFormatted: {
        es: 'FastAPI | Pydantic | Pandas | NumPy | Scikit-learn | LangChain | TensorFlow | Django | React JS.',
        en: 'FastAPI | Pydantic | Pandas | NumPy | Scikit-learn | LangChain | TensorFlow | Django | React JS.'
      }
    },
    {
      id: 'databases',
      title: {
        es: 'Bases de Datos',
        en: 'Databases'
      },
      pdfLabel: {
        es: 'Bases de Datos:',
        en: 'Databases:'
      },
      skills: [
        { name: 'PostgreSQL' },
        { name: 'Redis' },
        { name: 'BigQuery' },
        { name: 'SQL Server' },
        { name: 'MySQL' },
        { name: 'MongoDB' },
        { name: 'SQLite' }
      ],
      pdfFormatted: {
        es: 'PostgreSQL | Redis | BigQuery | SQL Server | MySQL | MongoDB | SQLite.',
        en: 'PostgreSQL | Redis | BigQuery | SQL Server | MySQL | MongoDB | SQLite.'
      }
    },
    {
      id: 'containers',
      title: {
        es: 'Contenedores y Orquestación',
        en: 'Containers & Orchestration'
      },
      pdfLabel: {
        es: 'Contenedores y Orquestación:',
        en: 'Containers & Orchestration:'
      },
      skills: [
        { name: 'Airflow' },
        { name: 'Airbyte' },
        { name: 'Docker' },
        { name: 'Kubernetes' }
      ],
      pdfFormatted: {
        es: 'Airflow | Airbyte | Docker | Kubernetes.',
        en: 'Airflow | Airbyte | Docker | Kubernetes.'
      }
    },
    {
      id: 'methodologies',
      title: {
        es: 'Metodologías y Gestión',
        en: 'Methodologies & Management'
      },
      pdfLabel: {
        es: 'Metodologías y Gestión:',
        en: 'Methodologies & Management:'
      },
      skills: [
        { name: { es: 'Diseño de Sistemas', en: 'System Design' } },
        { name: { es: 'Test-Driven Development (TDD)', en: 'Test-Driven Development (TDD)' } },
        { name: { es: 'Metodologías Ágiles (Scrum & Kanban)', en: 'Agile Methodologies (Scrum & Kanban)' } },
        { name: { es: 'Planificación de Roadmaps', en: 'Roadmap Planning' } },
        { name: 'Jira' },
        { name: 'Notion' }
      ],
      pdfFormatted: {
        es: 'Diseño de Sistemas | Test-Driven Development (TDD) | Metodologías Ágiles (Scrum & Kanban) | Planificación de Roadmaps | Jira | Notion.',
        en: 'System Design | Test-Driven Development (TDD) | Agile Methodologies (Scrum & Kanban) | Roadmap Planning | Jira | Notion.'
      }
    },
    {
      id: 'key_skills',
      title: {
        es: 'Habilidades Clave',
        en: 'Key Skills'
      },
      pdfLabel: {
        es: 'Habilidades Clave:',
        en: 'Key Skills:'
      },
      skills: [
        { name: 'Model Context Protocol (MCP)' },
        { name: { es: 'IA Agéntica & Sistemas Multi-Agente (LLMs)', en: 'Agentic AI & Multi-Agent Systems (LLMs)' } },
        { name: { es: 'Sistemas Distribuidos & Geocodificación', en: 'Distributed Systems & Geocoding' } },
        { name: { es: 'Arquitectura de Pipelines de Datos (ETL/ELT)', en: 'Data Pipeline Architecture (ETL/ELT)' } },
        { name: { es: 'Monitoreo de Modelos ML', en: 'ML Model Monitoring' } },
        { name: { es: 'Diseño de BDD Relacionales', en: 'Relational DB Design' } },
        { name: { es: 'Liderazgo Técnico', en: 'Technical Leadership' } }
      ],
      pdfFormatted: {
        es: 'IA Agéntica & Sistemas Multi-Agente (MCP, LLMs) | Sistemas Distribuidos & Geocodificación | Arquitectura de Pipelines de Datos (ETL/ELT) | Monitoreo de Modelos ML | Diseño de BDD Relacionales | Liderazgo Técnico.',
        en: 'Agentic AI & Multi-Agent Systems (MCP, LLMs) | Distributed Systems & Geocoding | Data Pipeline Architecture (ETL/ELT) | ML Model Monitoring | Relational DB Design | Technical Leadership.'
      }
    }
  ],
  education: [
    {
      id: 'civil',
      institution: {
        es: 'Universidad de Chile',
        en: 'Universidad de Chile'
      },
      degree: {
        es: 'Ingeniería Civil con mención en estructuras, construcción y geotecnia',
        en: 'Civil Engineering with a minor in structures, construction, and geotechnics'
      },
      date: {
        es: 'Egresada 2019, Titulada 2020 (Distinción Máxima)',
        en: 'Graduated 2019, Degree awarded 2020 (Maximum Distinction)'
      },
      details: {
        es: 'Mención en estructuras, construcción y geotecnia. Trabajo de título en Procesos Gaussianos para detección de fallas estructurales. <strong class="text-slate-700 dark:text-slate-300">Titulada con distinción máxima.</strong><br /><br /><strong>Prácticas profesionales:</strong> EGIS y DOM Curicó (cálculo estructural y presupuestos).',
        en: 'Specialization in structures, construction, and geotechnics. Thesis on Gaussian Processes for structural fault detection. <strong class="text-slate-700 dark:text-slate-300">Graduated with highest honors.</strong><br /><br /><strong>Professional Internships:</strong> EGIS and DOM Curicó (structural calculations and budgeting).'
      },
      pdfDetails: {
        es: 'Trabajo de título: Procesos Gaussianos y modos de vibración para detección de delaminación en placas de materiales compuestos.',
        en: 'Thesis: Gaussian Processes and vibration modes for delamination detection in composite material plates.'
      }
    },
    {
      id: 'bsc',
      institution: {
        es: 'Universidad de Chile',
        en: 'Universidad de Chile'
      },
      degree: {
        es: 'Licenciada en Ciencias de la Ingeniería, mención Civil',
        en: 'Bachelor of Engineering Sciences, Civil minor'
      },
      date: {
        es: 'Finalizada 2017',
        en: 'Completed 2017'
      },
      details: {
        es: 'Actividad destacada: Ayudante del curso Probabilidades y Estadística.',
        en: 'Notable activity: Teaching Assistant for Probability and Statistics.'
      },
      pdfDetails: {
        es: 'Actividad destacada: Ayudante del curso Probabilidades y Estadística.',
        en: 'Notable activity: Teaching Assistant for Probabilities and Statistics.'
      }
    }
  ],
  publications: [
    {
      id: 'delamination_paper',
      title: 'Generalized Gaussian smoothing for baseline-free debonding assessment of sandwich panels',
      journal: 'Structural Control Health Monitoring',
      date: {
        es: 'Marzo 2021',
        en: 'March 2021'
      },
      url: 'https://doi.org/10.1002/stc.2727',
      doi: '10.1002/stc.2727',
      description: {
        es: 'Se propone una metodología para la detección y evaluación de delaminación en placas de materiales compuestos a partir de modos de vibración, utilizando Procesos Gaussianos y análisis Bayesiano.',
        en: 'Proposes a methodology for delamination detection and assessment in composite material plates from vibration modes, using Gaussian Processes and Bayesian analysis.'
      },
      pdfDescription: {
        es: 'Propuesta metodológica para detección y evaluación de delaminación en placas usando Procesos Gaussianos y análisis Bayesiano.',
        en: 'Methodological proposal for delamination detection and evaluation in composite plates using Gaussian Processes and Bayesian analysis.'
      }
    }
  ],
  languages: [
    {
      language: {
        es: 'Español (Nativo)',
        en: 'Spanish (Native)'
      },
      level: {
        es: 'Nativo',
        en: 'Native'
      }
    },
    {
      language: {
        es: 'Inglés (Avanzado - EFSET English Certificate C2 Proficient, 2020)',
        en: 'English (Advanced - EFSET English Certificate C2 Proficient, 2020)'
      },
      level: {
        es: 'Avanzado C2',
        en: 'Advanced C2'
      }
    }
  ],
  certifications: [
    {
      title: {
        es: 'React & Django Full Stack',
        en: 'React & Django Full Stack'
      },
      issuer: 'Udemy',
      year: '2022'
    },
    {
      title: {
        es: 'Mastering Data Visualization',
        en: 'Mastering Data Visualization'
      },
      issuer: 'Udemy',
      year: '2022'
    },
    {
      title: {
        es: 'Applied Machine Learning in Python',
        en: 'Applied Machine Learning in Python'
      },
      issuer: 'Coursera',
      year: '2020'
    }
  ]
};

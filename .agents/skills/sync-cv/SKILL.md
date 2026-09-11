---
name: sync-cv
description: Revisa proyectos personales y laborales recientes para sugerir mejoras y actualizaciones al CV (web y PDFs), garantizando anonimidad empresarial y verificando autoría real.
allowed-tools: Bash, Read, Grep, Find
---

# Skill: Sync CV Activity

Esta skill guía el proceso de inspección periódica de la actividad del usuario en sus repositorios personales y de trabajo para detectar logros, tecnologías o proyectos recientes que deban incorporarse o actualizarse en su CV (tanto en la web interactiva como en los PDFs descargables).

---

## Directrices Críticas y Reglas Invariables

1. **Zero Hardcoded Paths (Portabilidad Absoluta):**
   - NUNCA uses rutas fijas o absolutas que dependan del usuario de la máquina (ej. `C:\Users\...`).
   - Siempre resuelve dinámicamente las rutas utilizando `$HOME` o `$env:USERPROFILE`:
     - **Repositorios personales:** `Join-Path $HOME "Repos"` (o variable `$env:PERSONAL_REPOS_DIR` si está definida).
     - **Repositorios de trabajo:** `Join-Path $HOME "Archivos Trabajo"` (o variable `$env:WORK_REPOS_DIR` si está definida).
2. **Filtro de Autoría Efectiva (Evitar Falsos Positivos):**
   - El hecho de que un repositorio esté clonado localmente **NO** implica que el usuario haya trabajado en él.
   - Antes de extraer datos de un repositorio, verifica si el usuario ha realizado commits en él en el período analizado:
     - Detecta la identidad del usuario en Git (`git config user.email`, `git config user.name`, o usernames conocidos como `AnaCataVC`, `CataVillalobosC`).
     - Ejecuta: `git log --author="<identidad>" --since="90 days ago" --oneline` (o período indicado).
     - Si no hay commits del usuario en ese repo, **ignóralo por completo**.
3. **Anonimización y Confidencialidad Empresarial Estricta:**
   - En proyectos laborales (ej. SimpliRoute o cualquier otro empleo):
     - **PROHIBIDO:** revelar nombres de clientes, credenciales, URLs internas, esquemas de BD privados o nombres clave de proyectos confidenciales.
     - **PERMITIDO Y ESPERADO:** destacar a grandes rasgos las tecnologías utilizadas (ej. FastAPI, Celery, PostgreSQL, PyTorch, Docker, Kubernetes), patrones de diseño/arquitectura (ej. optimización de algoritmos de ruteo, microservicios, canalizaciones de streaming, optimización de queries SQL complejas) y tipos de impacto (ej. reducción de tiempos de latencia, modelos de forecasting, automatización de flujos).
4. **Sincronización Dual (Web + PDFs):**
   - Todo cambio sugerido debe contemplar ambas fuentes del CV:
     - **Web interactiva:** `src/i18n.js` (textos ES/EN) y `src/pages/index.astro` (estructura).
     - **PDFs descargables:** `templates/cv-template-es.html` y `templates/cv-template-en.html`.

---

## Flujo de Ejecución

### 1. Ejecutar el Script de Auditoría de Actividad
Ejecuta la utilidad Node.js desde la raíz del proyecto para una exploración ultrarrápida y estructurada:

```powershell
npm run audit:activity
```

O en formato JSON para consumo automatizado por el agente:

```powershell
node .agents/skills/sync-cv/scripts/scan-activity.mjs --json
```

Opcionalmente, especifica una ventana de días distinta (por defecto 90 días):
```powershell
node .agents/skills/sync-cv/scripts/scan-activity.mjs --days 30
```

### 2. Detección y Filtrado Dinámico (Realizado por el Script)
El script realiza automáticamente:
- Resolución portable de `$HOME` (`os.homedir()`) para `~/Repos` y `~/Archivos Trabajo`.
- Comprobación de autoría efectiva (`git config user.email`, `git config user.name`) omitiendo repos sin aportes directos.
- Detección de stack tecnológico analizando `package.json`, `requirements.txt`, `pyproject.toml`, `Cargo.toml`, etc.
- Sanitización de commits laborales (eliminación de tickets Jira, URLs y nombres de clientes).

### 3. Detección de Actividad en Proyectos Laborales (Anonimizada)
- Explora los subdirectorios bajo `$workDir` que contengan `.git`.
- Para cada repositorio:
  - Comprueba si el usuario tiene autoría real reciente. Si no hay commits propios, **descártalo**.
  - Si hay autoría:
    - Analiza los mensajes de commits recientes del usuario para entender el tipo de contribución (ej. refactorización, optimización de rendimiento, diseño de nuevo endpoint, migración de infraestructura).
    - Revisa dependencias técnicas añadidas o utilizadas (frameworks, librerías de ML, bases de datos).
    - Aplica el filtro de anonimización: traduce los hallazgos a descripciones abstractas de ingeniería de software y ciencia de datos.

### 4. Lectura del Estado Actual del CV
- Lee el archivo `src/i18n.js` para revisar las descripciones de experiencia y habilidades vigentes en español e inglés.
- Lee `templates/cv-template-es.html` y `templates/cv-template-en.html` para revisar la versión impresa en PDF.

### 5. Análisis de Brechas y Oportunidades
Compara los hallazgos recientes contra el CV actual:
- ¿Hay nuevas tecnologías dominadas recientemente que no figuren en la sección de Skills?
- ¿Los logros o responsabilidades en el empleo actual pueden actualizarse con aportes de mayor impacto técnico?
- ¿Hay algún proyecto personal reciente que merezca un lugar en la sección de proyectos destacados?
- ¿Existe discrepancia entre la web y los templates PDF?

### 6. Entrega del Reporte de Recomendaciones
Presenta al usuario un reporte estructurado y conciso en español con las siguientes secciones:

1. **Resumen de Actividad Detectada:**
   - Proyectos personales con contribuciones activas.
   - Áreas técnicas de trabajo en el empleo (100% anonimizadas).
2. **Nuevas Tecnologías / Habilidades Sugeridas:**
   - Lista de herramientas o frameworks para agregar a la sección de habilidades.
3. **Propuestas de Actualización para Experiencia Laboral:**
   - Redacción sugerida en español e inglés para `src/i18n.js` y `templates/cv-template-*.html`.
4. **Proyectos Personales Sugeridos:**
   - Si aplica, propuesta de nuevo proyecto para la galería/portfolio.
5. **Acciones Concretas:**
   - Lista de archivos a modificar si el usuario aprueba los cambios.

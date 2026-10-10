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
     - **Repositorios de trabajo:** `Join-Path $HOME "SimplitSolutions"` (o variable `$env:WORK_REPOS_DIR` si está definida).
2. **Filtro Anti-Review & Autoría Efectiva (No atribuir trabajo de terceros ni revisiones):**
   - El hecho de que un repositorio esté clonado localmente, tenga actividad reciente o el usuario haya revisado Pull Requests **NO** implica que esos desarrollos pertenezcan al usuario.
   - Antes de extraer cualquier logro o tecnología de un repositorio, verifica estrictamente que los commits hayan sido efectivamente desarrollados y autorados por el usuario:
     - Resuelve las identidades del usuario dinámicamente desde la configuración local (`git config user.email`, `git config user.name`, cuentas activas en `gh auth status` o las identidades definidas en las instrucciones globales del entorno).
     - **Ámbito de ramas limpias:** Usa `--branches --remotes=origin/main --remotes=origin/master --remotes=origin/develop` en lugar de `--all` para no inspeccionar ramas de revisión de PRs ajenas ni commits huérfanos.
     - **Exclusión de Stashes:** Ignora cualquier commit derivado de `git stash` (`index on`, `untracked files on`, `WIP on`).
     - **Verificación de Committer:** El committer debe ser el propio usuario o el bot de merge de GitHub (`noreply@github.com`). Si el committer es otro compañero de equipo, el commit pertenece al flujo de trabajo de otra persona.
     - **Exclusión de Commits de Revisión:** Omite commits que correspondan a sugerencias o ajustes menores de revisión en PRs de terceros (`address review`, `suggestions from code review`).
     - **Umbral de Contribución Sustantiva (Workplace):** En repositorios laborales, exige al menos 3 commits propios directos para considerar el repositorio como un área de desarrollo activo, descartando repositorios donde el usuario solo haya realizado revisiones de código o merges incidentales.
3. **Anonimización y Confidencialidad Empresarial Estricta:**
   - En proyectos laborales (ej. SimpliRoute o cualquier otro empleo):
     - **PROHIBIDO:** revelar nombres de clientes, credenciales, URLs internas, esquemas de BD privados o nombres clave de proyectos confidenciales.
     - **PERMITIDO Y ESPERADO:** destacar a grandes rasgos las tecnologías utilizadas (ej. FastAPI, Celery, PostgreSQL, PyTorch, Docker, Kubernetes), patrones de diseño/arquitectura (ej. optimización de algoritmos de ruteo, microservicios, canalizaciones de streaming, optimización de queries SQL complejas) y tipos de impacto (ej. reducción de tiempos de latencia, modelos de forecasting, automatización de flujos).
4. **Granularidad Web vs. PDF (Asimetría Intencional sin Contradicciones):**
   - Toda la información del CV vive centralizada en `src/data/cv.ts` (Single Source of Truth), alimentando tanto la web interactiva (`src/pages/index.astro`, `src/i18n.js`) como la vista de impresión (`src/pages/print/[lang].astro`).
   - **No se requiere simetría textual 1:1 entre el sitio web y el PDF:**
     - **Sitio Web (`summary.web`, `bullets`, `skills`, `details`):** Espacio para explayarse con mayor contexto técnico, narrativa arquitectónica y desglose amplio de herramientas.
     - **PDF Descargable (`summary.pdf`, `pdfBullets`, `pdfFormatted`, `pdfDetails`):** Síntesis ejecutiva concisa diseñada para cumplir estrictamente el límite de 2 páginas (`npm run build:pdf`).
     - **Invariante Principal (Cero Contradicciones):** Aunque la extensión y nivel de detalle difieran entre ambos formatos, no deben existir contradicciones de ningún tipo en hechos, fechas, roles, métricas o tecnologías.

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
- Resolución portable de `$HOME` (`os.homedir()`) para `~/Repos` y `~/SimplitSolutions`.
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
- Lee el archivo `src/data/cv.ts` para revisar las descripciones de resumen, experiencia, educación y habilidades vigentes en español e inglés, tanto en sus campos extendidos para la web como en sus campos condensados para el PDF.

### 5. Análisis de Brechas y Coherencia
Compara los hallazgos recientes contra el CV actual:
- ¿Hay nuevas tecnologías dominadas recientemente que no figuren en la sección de Skills?
- ¿Los logros o responsabilidades en el empleo actual pueden actualizarse con aportes de mayor impacto técnico?
- ¿Existe alguna contradicción fáctica o temporal entre las versiones extendidas de la web y las versiones resumidas del PDF? (Recuerda que la diferencia en extensión/detalle es intencional, pero los datos deben ser 100% coherentes).

### 6. Entrega del Reporte de Recomendaciones
Presenta al usuario un reporte estructurado y conciso en español con las siguientes secciones:

1. **Resumen de Actividad Detectada:**
   - Proyectos personales con contribuciones activas.
   - Áreas técnicas de trabajo en el empleo (100% anonimizadas).
2. **Nuevas Tecnologías / Habilidades Sugeridas:**
   - Lista de herramientas o frameworks para agregar a la sección de habilidades (`skills` en web y, si son troncales, `pdfFormatted` en PDF).
3. **Propuestas de Actualización para Experiencia Laboral:**
   - Redacción sugerida en español e inglés para `src/data/cv.ts` (distinguiendo versión extendida para `bullets` y versión concisa para `pdfBullets` cuando corresponda).
4. **Acciones Concretas:**
   - Lista de archivos a modificar y recordatorio de regenerar los PDFs con `npm run build:pdf` si el usuario aprueba los cambios.

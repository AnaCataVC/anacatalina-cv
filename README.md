# CV Profesional - Ana-Catalina Villalobos

Este repositorio contiene el código fuente para el sitio web personal y CV profesional de **Ana-Catalina Alejandra Villalobos Contardo**, Ingeniera Civil y Data Scientist / ML Engineer.

El sitio web está diseñado con una estética moderna, responsiva, con soporte para modo oscuro, animaciones al hacer scroll, filtrado dinámico de habilidades e integración directa para guardar como PDF.

## 🛠️ Tecnologías Utilizadas

- **Core:** HTML5, CSS3, JavaScript (ES6+)
- **Framework & Configuración:** [Vite](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (con paleta personalizada en tonos pastel)
- **Deployment:** GitHub Pages a través de GitHub Actions

🎨 **Paleta de Colores Pastel Utilizada:**
- `pastelLilac`: `#c7b8ea`
- `pastelPink`: `#f7c6d9`
- `pastelBlue`: `#bcdffb`
- `pastelMint`: `#c8f3e0`

---

## 📁 Estructura del Repositorio

```text
anacatalina-cv/
 ├── .github/workflows/
 │    └── deploy.yml          # Pipeline de GitHub Actions para despliegue automático
 ├── public/
 │    ├── foto-perfil.jpg     # Foto de perfil del CV
 │    └── favicon.ico         # Icono del sitio
 ├── src/
 │    ├── main.js             # Lógica interactiva del sitio (modo oscuro, filtros)
 │    └── styles.css          # Estilos globales y directivas de Tailwind
 ├── index.html               # Estructura principal y contenido del CV
 ├── vite.config.js           # Configuración del empaquetado y base path
 ├── tailwind.config.js       # Configuración de colores personalizados y animaciones
 ├── postcss.config.js        # Integración de Tailwind con PostCSS
 ├── package.json             # Scripts y dependencias del proyecto
 └── README.md                # Este archivo informativo
```

---

## 🚀 Guía de Desarrollo Local

Para correr el proyecto localmente y realizar cambios:

### 1. Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

### 2. Clonar e Instalar

```bash
# Instalar dependencias
npm install
```

### 3. Ejecutar Servidor de Desarrollo

```bash
npm run dev
```
Abre tu navegador en la dirección local indicada (habitualmente `http://localhost:5173/anacatalina-cv/`).

### 4. Compilar para Producción

```bash
npm run build
```
Esto generará los archivos optimizados dentro de la carpeta `dist/`.

---

## 🌍 Despliegue en GitHub Pages

El proyecto está configurado para desplegarse automáticamente en GitHub Pages usando GitHub Actions cada vez que se hace un `push` a la rama `main`.

### Pasos en GitHub para activar la publicación:

1. Ve a tu repositorio en GitHub.
2. Ingresa a la sección **Settings** > **Pages**.
3. En **Build and deployment** > **Source**, selecciona **GitHub Actions**.
4. Haz push de tus cambios a la rama `main` y GitHub Actions compilará y publicará tu CV de forma automatizada en:
   `https://<tu-usuario>.github.io/anacatalina-cv/`

> **Nota:** Si utilizas un dominio personalizado, asegúrate de actualizar la propiedad `base` en `vite.config.js` a `'/'`.

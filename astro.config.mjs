import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://cv.ana-catalina.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/print/')
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});

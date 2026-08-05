import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ana-catalina.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});

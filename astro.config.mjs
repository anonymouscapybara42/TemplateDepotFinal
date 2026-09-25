import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Tailwind v4 is a Vite plugin now, not an Astro integration —
  // @astrojs/tailwind is deprecated and does not support Astro 7.
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: node({ mode: 'standalone' }),
  output: 'server',
  site: 'https://templatedepot.shop',
});

import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  output: 'server',
  security: {
    checkOrigin: false,
  },
  site: 'https://templatedepot.pages.dev',
});

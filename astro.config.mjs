import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.quimicaindustrial.pe',
  output: 'server',
  adapter: vercel({
    isr: {
      expiration: 300,
    },
  }),
  integrations: [react(), sitemap()],
});

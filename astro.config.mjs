import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    isr: {
      // Revalidate every 5 minutes to quickly reflect dashboard changes
      // while maintaining good performance
      expiration: 300,
    },
  }),
  integrations: [react()],
});
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// Import the package that enables SCSS/SASS processing
// Note: Astro usually handles this automatically, but we'll ensure it's here
// for safety since the automated step failed.

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    // Add SCSS support here. Astro uses the standard 'sass' package.
    // There is no separate official @astrojs/sass package anymore;
    // it relies on the 'sass' package being installed.
  ],
  // ... other config
});
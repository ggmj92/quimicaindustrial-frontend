import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

const getProductUrls = async () => {
  try {
    const res = await fetch('https://oregonchem-backend.onrender.com/api/qi/products?limit=500&status=published');
    const data = await res.json();
    const products = data.data || data.products || [];
    return products.map((p) => `https://www.quimicaindustrial.pe/products/${p.slug}`);
  } catch (e) {
    console.warn('Sitemap: could not fetch products', e);
    return [];
  }
};

const productUrls = await getProductUrls();
console.log('Sitemap product URLs fetched:', productUrls.length);

export default defineConfig({
  site: 'https://www.quimicaindustrial.pe',
  output: 'server',
  adapter: vercel({
    isr: {
      expiration: 300,
    },
  }),
  integrations: [
    react(),
    sitemap({
      customPages: productUrls,
    }),
  ],
});
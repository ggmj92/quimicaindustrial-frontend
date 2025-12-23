import type { APIRoute } from "astro";
import { getProducts } from "../data/products";

export const GET: APIRoute = async () => {
  const products = await getProducts();
  const perPage = 18;
  const totalPages = Math.ceil(products.length / perPage);

  const baseUrl = "https://www.quimicaindustrial.pe";
  const currentDate = new Date().toISOString().split("T")[0];

  const staticPages = [
    { url: "", priority: "1.0", changefreq: "daily" },
    { url: "/products", priority: "0.9", changefreq: "daily" },
    { url: "/cotizacion", priority: "0.8", changefreq: "weekly" },
  ];

  const paginatedPages = Array.from({ length: totalPages - 1 }, (_, i) => ({
    url: `/products?page=${i + 2}`,
    priority: "0.7",
    changefreq: "daily",
  }));

  const productPages = products.map((product) => ({
    url: `/products/${product.slug}`,
    priority: "0.8",
    changefreq: "weekly",
  }));

  const allPages = [...staticPages, ...paginatedPages, ...productPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};

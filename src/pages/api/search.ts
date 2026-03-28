import type { APIRoute } from "astro";
import { searchProducts } from "../../data/products";

// Disable prerendering for this API route
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q") || "";

  if (query.length < 2) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const products = await searchProducts(query);

    const results = products.slice(0, 10).map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      summary: product.summary,
    }));

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return new Response(JSON.stringify({ error: "Search failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

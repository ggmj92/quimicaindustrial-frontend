import type { APIRoute } from "astro";
import { getProducts } from "../../data/products";

// Disable prerendering for this API route
export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const products = await getProducts();

    // Get first 10 product names
    const productNames = products.slice(0, 10).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
    }));

    // Search for products containing "acido"
    const acidoProducts = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes("acido") ||
          p.name.toLowerCase().includes("ácido"),
      )
      .slice(0, 10)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
      }));

    return new Response(
      JSON.stringify(
        {
          totalProducts: products.length,
          sampleProducts: productNames,
          acidoProducts: acidoProducts,
          acidoCount: acidoProducts.length,
        },
        null,
        2,
      ),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Test products error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

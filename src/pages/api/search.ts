import type { APIRoute } from "astro";
import { getProducts } from "../../data/products";

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q") || "";

  if (query.length < 2) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const products = await getProducts();
    const searchLower = query.toLowerCase();

    const results = products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.summary?.toLowerCase().includes(searchLower) ||
          product.categories.some((cat) =>
            cat.toLowerCase().includes(searchLower),
          ),
      )
      .slice(0, 10) // Limit to 10 results
      .map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        summary: product.summary,
      }));

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return new Response(JSON.stringify({ error: "Search failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

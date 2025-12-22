import type { APIRoute } from "astro";
import { getProducts } from "../../data/products";

// Disable prerendering for this API route
export const prerender = false;

// Normalize text for better search matching (remove accents, lowercase)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

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

    if (!products || !Array.isArray(products)) {
      console.error("❌ Products is not an array:", typeof products);
      throw new Error("Failed to load products");
    }

    const searchNormalized = normalizeText(query);

    const matchedProducts: any[] = [];

    products.forEach((product) => {
      // Create searchable text from product data
      const searchableText = normalizeText(
        [
          product.name || "",
          product.summary || "",
          product.description || "",
          product.sku || "",
        ].join(" "),
      );

      if (searchableText.includes(searchNormalized)) {
        matchedProducts.push(product);
      }
    });

    const results = matchedProducts
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
    console.error("❌ Search API error:", error);
    return new Response(JSON.stringify({ error: "Search failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

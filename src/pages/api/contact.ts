import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, message } = data;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const API_URL =
      import.meta.env.PUBLIC_QI_API_URL?.replace("/api/qi", "") ||
      "https://oregonchem-backend.onrender.com";

    const response = await fetch(`${API_URL}/api/qi/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone, message }),
    });

    const result = await response.json().catch(() => null);

    return new Response(JSON.stringify(result ?? { success: response.ok }), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(JSON.stringify({ error: "Failed to send message" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

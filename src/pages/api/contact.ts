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

    // TODO: Send email using a service like SendGrid, Resend, or Nodemailer
    // For now, we'll just return success

    // In production, you would send an email here:
    // await sendEmail({
    //   to: 'ventas@quimicaindustrial.pe',
    //   subject: `Nuevo mensaje de contacto de ${name}`,
    //   html: `
    //     <h2>Nuevo mensaje de contacto</h2>
    //     <p><strong>Nombre:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
    //     <p><strong>Mensaje:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
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

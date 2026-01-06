import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

interface ContactRequest {
  name: string;
  email: string;
  message: string;
  fileName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message, fileName }: ContactRequest = await req.json();

    // Validate inputs
    if (!name || !email || !message) {
      console.error("Missing required fields:", { name: !!name, email: !!email, message: !!message });
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Sending contact email from:", name, email);

    // Sanitize user inputs for HTML
    const safeName = escapeHtml(name);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
    const safeFileName = fileName ? escapeHtml(fileName) : null;

    // Send notification email to site owner
    const ownerEmailResponse = await resend.emails.send({
      from: "Portfolio Contact <noreply@moizrehman.site>",
      to: ["moizrehmanofficial@gmail.com"],
      reply_to: email,
      subject: `New Contact: ${safeName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
        ${safeFileName ? `<p><strong>Attached File:</strong> ${safeFileName} (User mentioned they have a file to share)</p>` : ""}
        <hr>
        <p><em>Reply directly to this email to respond to ${safeName}.</em></p>
      `,
    });

    console.log("Owner notification sent:", ownerEmailResponse);

    // Send confirmation email to the sender
    const confirmationResponse = await resend.emails.send({
      from: "Moiz Rehman <noreply@moizrehman.site>",
      to: [email],
      subject: "Thanks for reaching out!",
      html: `
        <h2>Hi ${safeName}!</h2>
        <p>Thank you for contacting me. I've received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <blockquote style="border-left: 3px solid #10b981; padding-left: 16px; color: #666;">
          ${safeMessage}
        </blockquote>
        <p>Best regards,<br>Moiz Rehman</p>
      `,
    });

    console.log("Confirmation email sent:", confirmationResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

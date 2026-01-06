import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OTPRequest {
  action: "send" | "verify";
  email: string;
  name?: string;
  message?: string;
  fileName?: string;
  code?: string;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, email, name, message, fileName, code }: OTPRequest = await req.json();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (action === "send") {
      if (!name || !message) {
        return new Response(
          JSON.stringify({ error: "Name and message are required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Rate limiting: Check if OTP was sent recently (1 minute cooldown)
      const { data: recent } = await supabase
        .from("contact_otps")
        .select("created_at")
        .eq("email", email)
        .gte("created_at", new Date(Date.now() - 60000).toISOString())
        .maybeSingle();

      if (recent) {
        return new Response(
          JSON.stringify({ error: "Please wait before requesting another code" }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

      // Delete any existing OTPs for this email
      await supabase.from("contact_otps").delete().eq("email", email);

      // Store OTP in database
      const { error: insertError } = await supabase.from("contact_otps").insert({
        email,
        code: otp,
        name,
        message,
        file_name: fileName || null,
        expires_at: expiresAt,
      });

      if (insertError) {
        console.error("Failed to store OTP:", insertError);
        throw new Error("Failed to store OTP");
      }

      console.log("Sending OTP to:", email);

      // Send OTP email
      await resend.emails.send({
        from: "Moiz Rehman <noreply@moizrehman.site>",
        to: [email],
        subject: "Verify your email - Contact Form",
        html: `
          <h2>Email Verification</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>Please use the following code to verify your email before sending your message:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background: #f4f4f4; padding: 16px 32px; border-radius: 8px; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p>This code expires in 10 minutes.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Best regards,<br>Moiz Rehman</p>
        `,
      });

      console.log("OTP sent successfully to:", email);

      return new Response(
        JSON.stringify({ success: true, message: "OTP sent to your email" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (action === "verify") {
      if (!code) {
        return new Response(
          JSON.stringify({ error: "OTP code is required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Get OTP from database
      const { data: stored, error: selectError } = await supabase
        .from("contact_otps")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (selectError) {
        console.error("Failed to retrieve OTP:", selectError);
        throw new Error("Failed to verify OTP");
      }

      if (!stored) {
        return new Response(
          JSON.stringify({ error: "No OTP found. Please request a new code." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (new Date() > new Date(stored.expires_at)) {
        // Delete expired OTP
        await supabase.from("contact_otps").delete().eq("email", email);
        return new Response(
          JSON.stringify({ error: "OTP expired. Please request a new code." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (stored.code !== code) {
        return new Response(
          JSON.stringify({ error: "Invalid OTP code" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // OTP verified - get stored form data and delete OTP
      const formData = {
        name: stored.name,
        email: stored.email,
        message: stored.message,
        fileName: stored.file_name,
      };

      await supabase.from("contact_otps").delete().eq("email", email);

      console.log("OTP verified for:", email);

      return new Response(
        JSON.stringify({ 
          success: true, 
          verified: true,
          formData
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

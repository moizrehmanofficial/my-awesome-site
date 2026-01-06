import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory OTP store (will reset on function restart, but sufficient for verification)
const otpStore = new Map<string, { code: string; expires: number; name: string; message: string; fileName?: string }>();

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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

      const otp = generateOTP();
      const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Store OTP with form data
      otpStore.set(email, { code: otp, expires, name, message, fileName });

      console.log("Sending OTP to:", email);

      // Send OTP email
      await resend.emails.send({
        from: "Moiz Rehman <onboarding@resend.dev>",
        to: [email],
        subject: "Verify your email - Contact Form",
        html: `
          <h2>Email Verification</h2>
          <p>Hi ${name},</p>
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

      const stored = otpStore.get(email);

      if (!stored) {
        return new Response(
          JSON.stringify({ error: "No OTP found. Please request a new code." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (Date.now() > stored.expires) {
        otpStore.delete(email);
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

      // OTP verified - return stored form data
      const { name: storedName, message: storedMessage, fileName: storedFileName } = stored;
      otpStore.delete(email);

      console.log("OTP verified for:", email);

      return new Response(
        JSON.stringify({ 
          success: true, 
          verified: true,
          formData: { name: storedName, email, message: storedMessage, fileName: storedFileName }
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

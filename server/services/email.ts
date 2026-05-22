import { Resend } from "resend";

// Resend client initialization
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const confirmLink = `${appUrl}/verify-email/confirm?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: "Roomy <onboarding@resend.dev>", // Default sandbox sender. Replace with domain once verified in Resend.
      to: email,
      subject: "Verify your email address - Roomy",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #0f172a; text-align: center; margin-bottom: 20px;">Welcome to Roomy!</h2>
          <p style="color: #334155; font-size: 16px; line-height: 24px;">
            Thank you for registering. Before you can search for roommates or list your spaces, we need to verify your email address.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
              Verify Email Address
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px; line-height: 20px;">
            This link is valid for 24 hours. If you did not sign up for a Roomy account, please ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 35px 0 20px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center; line-height: 18px;">
            If the button above does not work, copy and paste this URL into your browser:<br />
            <a href="${confirmLink}" style="color: #2563eb; word-break: break-all;">${confirmLink}</a>
          </p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error };
  }
}

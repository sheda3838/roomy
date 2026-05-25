import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g. "kamilzaid53@gmail.com"
    pass: process.env.EMAIL_APP_PASSWORD, // 16-character App Password
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const confirmLink = `${appUrl}/verify-email/confirm?token=${token}`;

  try {
    if (process.env.NODE_ENV === "development") {
      console.log("==========================================");
      console.log("🛠️ DEVELOPMENT MODE: VERIFICATION EMAIL 🛠️");
      console.log(`To: ${email}`);
      console.log(`Verify Link: ${confirmLink}`);
      console.log("==========================================");
    }

    const info = await transporter.sendMail({
      from: `"Roomy" <${process.env.EMAIL_USER}>`,
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

    return { success: true, data: info };
  } catch (error: any) {
    console.error("Failed to send verification email via Nodemailer:", error);
    return { success: false, error: error.message };
  }
}

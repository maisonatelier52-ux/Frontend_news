import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'maisonatelier52@gmail.com',
    pass: process.env.EMAIL_PASS || 'pmzy hckz mguh kqfc',
  },
});

export async function sendOtpEmail(to: string, otp: string, purpose: 'login' | 'reset') {
  const subject = purpose === 'login' ? 'Your Admin Sign-In OTP Code' : 'Your Password Reset OTP Code';
  const html = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; padding: 24px; max-width: 500px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="font-family: Georgia, serif; color: #111827; margin: 0; font-size: 24px; letter-spacing: -0.02em;">THE PORTAL</h2>
        <div style="width: 24px; height: 3px; background-color: #3b82f6; margin: 12px auto 0 auto; border-radius: 4px;"></div>
      </div>
      <p style="font-size: 14.5px; color: #4b5563; line-height: 1.6;">Hello Admin,</p>
      <p style="font-size: 14.5px; color: #4b5563; line-height: 1.6;">Use the verification code below to complete your ${purpose === 'login' ? 'sign-in request' : 'password reset'}:</p>
      <div style="text-align: center; margin: 32px 0;">
        <span style="font-family: monospace; font-size: 32px; font-weight: 800; color: #1e40af; letter-spacing: 0.15em; background-color: #eff6ff; padding: 12px 24px; border-radius: 8px; border: 1px solid #bfdbfe; display: inline-block;">${otp}</span>
      </div>
      <p style="font-size: 12.5px; color: #9ca3af; line-height: 1.5; margin: 0;">This code is valid for 10 minutes. If you did not initiate this action, please secure your credentials immediately.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"News Portal Admin" <${process.env.EMAIL_USER || 'maisonatelier52@gmail.com'}>`,
    to,
    subject,
    html,
  });
}

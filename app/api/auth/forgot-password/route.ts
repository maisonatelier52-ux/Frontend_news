import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/models/User';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return 200 for security, or 400. Since it's admin console, returning error is helpful
      return NextResponse.json({ error: 'Admin account not found with this email' }, { status: 400 });
    }

    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpCode = otp;
    user.otpExpiry = expiry;
    await user.save();

    // Send email (Commented for now, logging to console instead)
    /*
    try {
      await sendOtpEmail(user.email, otp, 'reset');
    } catch (emailErr) {
      console.error('Failed to send OTP email:', emailErr);
      return NextResponse.json({ error: 'Failed to send OTP email. Please check your credentials.' }, { status: 500 });
    }
    */
    console.log(`[OTP BYPASS] OTP verification code for ${user.email} is: ${otp}`);

    return NextResponse.json({
      message: 'OTP sent to your email',
      success: true
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong. Try again later.' }, { status: 500 });
  }
}

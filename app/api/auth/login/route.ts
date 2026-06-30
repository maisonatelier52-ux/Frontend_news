import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { getAdminCredentialsModel } from '@/models/AdminCredentials';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_news_admin_jwt_key_2026_change_me_in_production';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const AdminCredentials = getAdminCredentialsModel(mongoose.connection);

    // Commented out first-time registration code (only verification is active now)
    /*
    const adminCount = await AdminCredentials.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      user = await AdminCredentials.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        admin: true
      });
      console.log(`[FIRST TIME SIGN IN] Created new admin credentials for ${email}`);
    }
    */

    // Verify credentials directly against the 'admin' collection
    const user = await AdminCredentials.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create session token
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: 'Admin', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      message: 'Login successful',
      user: { id: user._id, name: 'Admin', email: user.email, role: 'admin' }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

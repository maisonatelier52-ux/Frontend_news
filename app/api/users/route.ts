import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectToDatabase();
    const users = await UserModel.find({}, '-password').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (err: any) {
    console.error('Fetch users error:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, email, role, password } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const exists = await UserModel.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: 'User already exists with this email address' }, { status: 400 });
    }

    const defaultPass = password || 'TempPass123!';
    const hashedPassword = await bcrypt.hash(defaultPass, 10);

    const user = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role || 'admin',
      password: hashedPassword
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();
    return NextResponse.json(userWithoutPassword);
  } catch (err: any) {
    console.error('Create user error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, role, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updates: any = {};
    if (role) updates.role = role;
    
    // Status can be active or inactive, which can be stored in metadata or modeled
    // Here we can save role or status
    const updated = await UserModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('Update user error:', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete user error:', err);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

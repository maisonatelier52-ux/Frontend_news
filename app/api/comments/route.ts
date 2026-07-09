import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { CommentModel } from '@/models/Comment';
import { SubscriptionModel } from '@/models/Subscription';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_news_admin_jwt_key_2026_change_me_in_production';

async function isAdminAuthenticated() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    if (!sessionCookie || !sessionCookie.value) return false;
    jwt.verify(sessionCookie.value, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (articleId) {
      // Public route: Fetch only approved comments for a specific article
      const comments = await CommentModel.find({ articleId, status: 'approved' }).sort({ createdAt: -1 });
      return NextResponse.json(comments);
    } else {
      // Admin route: Requires authentication
      const isAdmin = await isAdminAuthenticated();
      if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
      }

      const comments = await CommentModel.find().sort({ createdAt: -1 });
      return NextResponse.json(comments);
    }
  } catch (error: any) {
    console.error('Fetch comments error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { articleId, articleTitle, name, email, text } = body;

    if (!articleId || !articleTitle || !name || !email || !text) {
      return NextResponse.json({ error: 'All fields (articleId, articleTitle, name, email, text) are required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Verification check: Only accepted subscribers can comment
    const isSubscribed = await SubscriptionModel.findOne({ email: trimmedEmail, status: 'accepted' });
    if (!isSubscribed) {
      return NextResponse.json({
        error: 'Only accepted subscribers can comment. Please subscribe using the newsletter sign up form first.'
      }, { status: 403 });
    }

    const newComment = await CommentModel.create({
      articleId,
      articleTitle: articleTitle.trim(),
      name: name.trim(),
      email: trimmedEmail,
      text: text.trim(),
      status: 'pending', // Awaiting moderation
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for sharing your valuable perspective. To maintain a thoughtful and respectful community, your comment has been submitted for review and will appear once approved.',
      comment: newComment
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Comment ID and status are required' }, { status: 400 });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const updatedComment = await CommentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, comment: updatedComment });
  } catch (error: any) {
    console.error('Update comment error:', error);
    return NextResponse.json({ error: 'Failed to update comment status' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    const deleted = await CommentModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error: any) {
    console.error('Delete comment error:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}

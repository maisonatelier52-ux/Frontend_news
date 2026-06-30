import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { AuthorModel } from '@/models/Author';
import { NewsModel } from '@/models/News';

export async function GET() {
  try {
    await connectToDatabase();
    const authors = await AuthorModel.find().sort({ createdAt: -1 });
    
    const authorsWithCount = await Promise.all(
      authors.map(async (author) => {
        const actualCount = await NewsModel.countDocuments({ author: author.name });
        const authorObj = author.toObject();
        authorObj.articlesCount = actualCount;
        return authorObj;
      })
    );

    return NextResponse.json(authorsWithCount);
  } catch (error: any) {
    console.error('Fetch authors error:', error);
    return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { name, slug, gender, role, email, category, bio } = body;

    if (!name || !slug || !gender || !role || !email || !category || !bio) {
      return NextResponse.json({ error: 'All fields marked as required must be filled' }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await AuthorModel.findOne({ slug: slug.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: `Author with slug /${slug} already exists` }, { status: 400 });
    }

    const newAuthor = await AuthorModel.create({
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      gender,
      role,
      email: email.toLowerCase(),
      category,
      bio,
      profileImage: body.profileImage || '/authors/placeholder.webp',
      socialLinks: body.socialLinks || {},
      articlesCount: 0
    });

    return NextResponse.json(newAuthor, { status: 201 });
  } catch (error: any) {
    console.error('Create author error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create author' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { AuthorModel } from '@/models/Author';
import { NewsModel } from '@/models/News';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const author = await AuthorModel.findOne({ slug });
    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    const articlesCount = await NewsModel.countDocuments({ author: author.name });
    const articles = await NewsModel.find({ author: author.name })
      .sort({ publishedAt: -1 })
      .limit(10)
      .select('title slug category publishedAt excerpt featuredImage');

    return NextResponse.json({
      ...author.toObject(),
      articlesCount,
      articles,
    });
  } catch (error: any) {
    console.error('Fetch author by slug error:', error);
    return NextResponse.json({ error: 'Failed to fetch author' }, { status: 500 });
  }
}

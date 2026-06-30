import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { NewsModel } from '@/models/News';
import { AuthorModel } from '@/models/Author';
import { CategoryModel } from '@/models/Category';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const newsArticle = await NewsModel.findById(id);

    if (!newsArticle) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 });
    }

    return NextResponse.json(newsArticle);
  } catch (error: any) {
    console.error('Fetch single news error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch news article' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { title, category, author, status } = body;
    if (title !== undefined && !title) return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    if (category !== undefined && !category) return NextResponse.json({ error: 'Category cannot be empty' }, { status: 400 });
    if (author !== undefined && !author) return NextResponse.json({ error: 'Author cannot be empty' }, { status: 400 });
    if (status !== undefined && !status) return NextResponse.json({ error: 'Status cannot be empty' }, { status: 400 });

    const originalArticle = await NewsModel.findById(id);
    if (!originalArticle) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 });
    }

    if (title && title !== originalArticle.title) {
      const existingTitle = await NewsModel.findOne({ title: { $regex: new RegExp(`^${title.trim()}$`, 'i') }, _id: { $ne: id } });
      if (existingTitle) {
        return NextResponse.json({ error: `News article with title "${title}" already exists` }, { status: 400 });
      }
    }

    if (body.slug && body.slug !== originalArticle.slug) {
      const existingSlug = await NewsModel.findOne({ slug: body.slug, _id: { $ne: id } });
      if (existingSlug) {
        return NextResponse.json({ error: `News article with slug /${body.slug} already exists` }, { status: 400 });
      }
    }


    // Update the article
    const updatedArticle = await NewsModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    // If author or category changed, update counts
    if (body.author && body.author !== originalArticle.author) {
      await AuthorModel.findOneAndUpdate({ name: originalArticle.author }, { $inc: { articlesCount: -1 } });
      await AuthorModel.findOneAndUpdate({ name: body.author }, { $inc: { articlesCount: 1 } });
    }
    if (body.category && body.category !== originalArticle.category) {
      await CategoryModel.findOneAndUpdate({ name: originalArticle.category }, { $inc: { articles: -1 } });
      await CategoryModel.findOneAndUpdate({ name: body.category }, { $inc: { articles: 1 } });
    }

    return NextResponse.json(updatedArticle);
  } catch (error: any) {
    console.error('Update news error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update news article' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deletedArticle = await NewsModel.findByIdAndDelete(id);

    if (!deletedArticle) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 });
    }

    // Decrement author and category counts
    await AuthorModel.findOneAndUpdate({ name: deletedArticle.author }, { $inc: { articlesCount: -1 } });
    await CategoryModel.findOneAndUpdate({ name: deletedArticle.category }, { $inc: { articles: -1 } });

    return NextResponse.json({ message: 'News article deleted successfully' });
  } catch (error: any) {
    console.error('Delete news error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete news article' }, { status: 500 });
  }
}

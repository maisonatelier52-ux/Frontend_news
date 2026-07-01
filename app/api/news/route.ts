import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { NewsModel } from '@/models/News';
import { AuthorModel } from '@/models/Author';
import { CategoryModel } from '@/models/Category';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Get query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let query: any = {};
    if (category && category !== 'all' && category !== 'All') {
      query.category = category;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (activeOnly) {
      query.status = 'published';
      
      // Filter news belonging to hidden categories
      const visibleCategories = await CategoryModel.find({ isVisible: { $ne: false } }).select('name');
      const visibleCategoryNames = visibleCategories.map(c => c.name);
      
      if (query.category) {
        if (!visibleCategoryNames.includes(query.category)) {
          return NextResponse.json([]);
        }
      } else {
        query.category = { $in: visibleCategoryNames };
      }
    }

    const news = await NewsModel.find(query).sort({ date: -1 });
    return NextResponse.json(news);
  } catch (error: any) {
    console.error('Fetch news error:', error);
    return NextResponse.json({ error: 'Failed to fetch news articles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { title, category, author, status } = body;

    if (!title || !category || !author || !status) {
      return NextResponse.json({ error: 'Title, category, author, and status are required' }, { status: 400 });
    }

    const slug = body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check title uniqueness (case-insensitive)
    const existingTitle = await NewsModel.findOne({ title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } });
    if (existingTitle) {
      return NextResponse.json({ error: `News article with title "${title}" already exists` }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await NewsModel.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: `News article with slug /${slug} already exists` }, { status: 400 });
    }


    const newsArticle = await NewsModel.create({
      title,
      slug,
      category,
      author,
      readTime: body.readTime || '5 mins',
      status: body.status || 'draft',
      excerpt: body.excerpt,
      featuredImage: body.featuredImage || '/article-placeholder.jpg',
      imageAltText: body.imageAltText || title,
      featuredVideoUrl: body.featuredVideoUrl || '',
      cardLabel: body.cardLabel || '',
      options: body.options || {
        featuredArticle: false,
        editorsPick: false,
        breakingNews: false,
        allowComments: true
      },
      blocks: body.blocks || [{ id: 'init-1', type: 'paragraph', value: '' }],
      seoTitle: body.seoTitle,
      seoMetaDescription: body.seoMetaDescription,
      keywords: body.keywords,
      tags: body.tags,
      date: body.date ? new Date(body.date) : new Date()
    });

    // Increment author article count
    await AuthorModel.findOneAndUpdate({ name: author }, { $inc: { articlesCount: 1 } });
    // Increment category article count
    await CategoryModel.findOneAndUpdate({ name: category }, { $inc: { articles: 1 } });

    return NextResponse.json(newsArticle, { status: 201 });
  } catch (error: any) {
    console.error('Create news error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create news article' }, { status: 500 });
  }
}

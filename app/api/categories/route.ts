import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { CategoryModel } from '@/models/Category';
import { NewsModel } from '@/models/News';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await CategoryModel.find().sort({ position: 1, createdAt: -1 });
    
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await NewsModel.countDocuments({ category: cat.name, status: 'published' });
        const catObj = cat.toObject();
        catObj.articles = count;
        return catObj;
      })
    );
    
    return NextResponse.json(categoriesWithCounts);
  } catch (error: any) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    if (!body.description || !body.description.trim()) {
      return NextResponse.json({ error: 'Category description is required' }, { status: 400 });
    }
    if (!body.bannerImage || !body.bannerImage.trim()) {
      return NextResponse.json({ error: 'Category banner image is required' }, { status: 400 });
    }

    const name = body.name.trim();
    const slug = body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check name uniqueness (case-insensitive)
    const existingName = await CategoryModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingName) {
      return NextResponse.json({ error: `Category with name "${name}" already exists` }, { status: 400 });
    }

    // Check slug uniqueness
    const existingSlug = await CategoryModel.findOne({ slug });
    if (existingSlug) {
      return NextResponse.json({ error: `Category with slug /${slug} already exists` }, { status: 400 });
    }


    const newCategory = await CategoryModel.create({
      name,
      slug,
      description: body.description,
      position: body.position ?? 99,
      isVisible: body.isVisible ?? true,
      showInNav: body.showInNav ?? true,
      bannerImage: body.bannerImage,
      bannerImageAlt: body.bannerImageAlt || name,
      color: body.color || '#6366f1'
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error('Create category error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
  }
}

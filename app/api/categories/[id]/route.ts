import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { CategoryModel } from '@/models/Category';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const originalCategory = await CategoryModel.findById(id);
    if (!originalCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (body.name !== undefined && !body.name.trim()) {
      return NextResponse.json({ error: 'Category name cannot be empty' }, { status: 400 });
    }
    if (body.description !== undefined && !body.description.trim()) {
      return NextResponse.json({ error: 'Category description cannot be empty' }, { status: 400 });
    }
    if (body.bannerImage !== undefined && !body.bannerImage.trim()) {
      return NextResponse.json({ error: 'Category banner image cannot be empty' }, { status: 400 });
    }

    if (body.name && body.name.trim() && body.name !== originalCategory.name) {
      const name = body.name.trim();
      const existingName = await CategoryModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') }, _id: { $ne: id } });
      if (existingName) {
        return NextResponse.json({ error: `Category with name "${name}" already exists` }, { status: 400 });
      }
    }

    if (body.slug && body.slug !== originalCategory.slug) {
      const existingSlug = await CategoryModel.findOne({ slug: body.slug, _id: { $ne: id } });
      if (existingSlug) {
        return NextResponse.json({ error: `Category with slug /${body.slug} already exists` }, { status: 400 });
      }
    }


    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    console.error('Update category error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 });
  }
}

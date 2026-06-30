import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { AuthorModel } from '@/models/Author';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    if (body.slug) {
      const slugVal = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();
      const existing = await AuthorModel.findOne({ slug: slugVal, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: `Author with slug /${slugVal} already exists` }, { status: 400 });
      }
      body.slug = slugVal;
    }

    if (body.name && !body.name.trim()) {
      return NextResponse.json({ error: 'Author name cannot be empty' }, { status: 400 });
    }

    if (body.email && (!body.email.trim() || !body.email.includes('@'))) {
      return NextResponse.json({ error: 'Author email must be valid' }, { status: 400 });
    }

    const updatedAuthor = await AuthorModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedAuthor) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAuthor);
  } catch (error: any) {
    console.error('Update author error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update author' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deletedAuthor = await AuthorModel.findByIdAndDelete(id);

    if (!deletedAuthor) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Author deleted successfully' });
  } catch (error: any) {
    console.error('Delete author error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete author' }, { status: 500 });
  }
}

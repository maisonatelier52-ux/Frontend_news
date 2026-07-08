import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { CategoryLayoutModel } from '@/models/CategoryLayout';

export async function GET() {
  try {
    await connectToDatabase();
    let layout = await CategoryLayoutModel.findOne();
    
    // Fallback default structure if DB lookup returns null
    if (!layout) {
      const defaultLayout = {
        categoryId: 'global',
        designStyle: 'original',
        colorTheme: 'indigo',
        isVisibleSpotlight: true,
        isVisibleSidebar: true,
        spotlightStyle: 'standard',
        broadsheetStyle: 'illustrated'
      };
      layout = await CategoryLayoutModel.create(defaultLayout);
    }

    return NextResponse.json(layout);
  } catch (err: any) {
    console.error('Fetch category layout error:', err);
    return NextResponse.json({ error: 'Failed to fetch category layout settings' }, { status: 500 });
  }
}

// PATCH: Reset to original factory default
export async function PATCH() {
  try {
    await connectToDatabase();
    const defaultLayout = {
      designStyle: 'original',
      colorTheme: 'indigo',
      isVisibleSpotlight: true,
      isVisibleSidebar: true,
      spotlightStyle: 'standard',
      broadsheetStyle: 'illustrated'
    };
    const layout = await CategoryLayoutModel.findOneAndUpdate(
      {},
      { $set: defaultLayout },
      { upsert: true, new: true }
    );
    return NextResponse.json(layout);
  } catch (err: any) {
    console.error('Reset category layout error:', err);
    return NextResponse.json({ error: 'Failed to reset category layout' }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { designStyle, colorTheme, isVisibleSpotlight, isVisibleSidebar, spotlightStyle, broadsheetStyle } = await req.json();

    let layout = await CategoryLayoutModel.findOne();
    if (!layout) {
      layout = new CategoryLayoutModel();
    }

    layout.designStyle = designStyle || 'original';
    layout.colorTheme = colorTheme || 'indigo';
    layout.isVisibleSpotlight = isVisibleSpotlight !== undefined ? isVisibleSpotlight : true;
    layout.isVisibleSidebar = isVisibleSidebar !== undefined ? isVisibleSidebar : true;
    layout.spotlightStyle = spotlightStyle || 'standard';
    layout.broadsheetStyle = broadsheetStyle || 'illustrated';

    await layout.save();
    return NextResponse.json(layout);
  } catch (err: any) {
    console.error('Update category layout error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update category layout' }, { status: 500 });
  }
}

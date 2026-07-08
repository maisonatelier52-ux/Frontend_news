import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { DetailLayoutModel } from '@/models/DetailLayout';

export async function GET() {
  try {
    await connectToDatabase();
    let layout = await DetailLayoutModel.findOne();
    
    // Fallback default structure if DB lookup returns null
    if (!layout) {
      const defaultLayout = {
        articleId: 'global',
        designStyle: 'classic-sidebar',
        colorTheme: 'crimson',
        fontSizeDefault: 'base',
        showShareBar: true,
        shareBarPosition: 'bottom',
        authorCardStyle: 'signature',
        showComments: true
      };
      layout = await DetailLayoutModel.create(defaultLayout);
    }

    return NextResponse.json(layout);
  } catch (err: any) {
    console.error('Fetch detail layout error:', err);
    return NextResponse.json({ error: 'Failed to fetch detail layout settings' }, { status: 500 });
  }
}

// PATCH: Reset to factory default
export async function PATCH() {
  try {
    await connectToDatabase();
    const defaultLayout = {
      designStyle: 'classic-sidebar',
      colorTheme: 'crimson',
      fontSizeDefault: 'base',
      showShareBar: true,
      shareBarPosition: 'bottom',
      authorCardStyle: 'signature',
      showComments: true
    };
    const layout = await DetailLayoutModel.findOneAndUpdate(
      {},
      { $set: defaultLayout },
      { upsert: true, new: true }
    );
    return NextResponse.json(layout);
  } catch (err: any) {
    console.error('Reset detail layout error:', err);
    return NextResponse.json({ error: 'Failed to reset detail layout' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { 
      designStyle, 
      colorTheme, 
      fontSizeDefault, 
      showShareBar, 
      shareBarPosition, 
      authorCardStyle, 
      showComments 
    } = await req.json();

    let layout = await DetailLayoutModel.findOne();
    if (!layout) {
      layout = new DetailLayoutModel();
    }

    layout.designStyle = designStyle || 'classic-sidebar';
    layout.colorTheme = colorTheme || 'crimson';
    layout.fontSizeDefault = fontSizeDefault || 'base';
    layout.showShareBar = showShareBar !== undefined ? showShareBar : true;
    layout.shareBarPosition = shareBarPosition || 'bottom';
    layout.authorCardStyle = authorCardStyle || 'signature';
    layout.showComments = showComments !== undefined ? showComments : true;

    await layout.save();
    return NextResponse.json(layout);
  } catch (err: any) {
    console.error('Update detail layout error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update detail layout' }, { status: 500 });
  }
}

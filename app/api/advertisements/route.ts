import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { AdvertisementModel } from '@/models/Advertisement';

const initialAds = [
  { 
    name: 'Tech Sponsor Banner', 
    position: 'Header Banner', 
    size: '728×90', 
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=728&h=90&fit=crop', 
    status: 'active', 
    clicks: 2840, 
    impressions: 124000, 
    startDate: '2026-06-01', 
    endDate: '2026-07-31' 
  },
  { 
    name: 'Creative Studio Banner', 
    position: 'Sidebar Top', 
    size: '300×250', 
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=250&fit=crop', 
    status: 'active', 
    clicks: 1200, 
    impressions: 87000, 
    startDate: '2026-06-15', 
    endDate: '2026-07-15' 
  },
  { 
    name: 'Design Agency Native Ad', 
    position: 'In-Article', 
    size: '640×200', 
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=200&fit=crop', 
    status: 'active', 
    clicks: 640, 
    impressions: 43000, 
    startDate: '2026-06-01', 
    endDate: '2026-08-01' 
  },
  { 
    name: 'Corporate Brand Banner', 
    position: 'Footer Banner', 
    size: '728×90', 
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=728&h=90&fit=crop', 
    status: 'inactive', 
    clicks: 0, 
    impressions: 0, 
    startDate: '—', 
    endDate: '—' 
  },
  { 
    name: 'Mobile Network Ad', 
    position: 'Sticky Bottom', 
    size: '320×50', 
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=320&h=50&fit=crop', 
    status: 'active', 
    clicks: 3100, 
    impressions: 210000, 
    startDate: '2026-05-20', 
    endDate: '2026-07-20' 
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    const ads = await AdvertisementModel.find().sort({ createdAt: -1 });
    return NextResponse.json(ads);
  } catch (error: any) {
    console.error('Fetch advertisements error:', error);
    return NextResponse.json({ error: 'Failed to fetch advertisements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Ad campaign name is required' }, { status: 400 });
    }
    if (!body.imageUrl || !body.imageUrl.trim()) {
      return NextResponse.json({ error: 'Banner image URL is required' }, { status: 400 });
    }

    const newAd = await AdvertisementModel.create({
      name: body.name.trim(),
      position: body.position || 'Header Banner',
      size: body.size || '728×90',
      imageUrl: body.imageUrl.trim(),
      status: body.status || 'active',
      clicks: 0,
      impressions: '0',
      startDate: body.startDate || '—',
      endDate: body.endDate || '—'
    });

    return NextResponse.json(newAd);
  } catch (error: any) {
    console.error('Create advertisement error:', error);
    return NextResponse.json({ error: 'Failed to create advertisement' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Ad ID is required for updates' }, { status: 400 });
    }

    const updatedAd = await AdvertisementModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedAd) {
      return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAd);
  } catch (error: any) {
    console.error('Update advertisement error:', error);
    return NextResponse.json({ error: 'Failed to update advertisement' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Ad ID is required for deletion' }, { status: 400 });
    }

    const deletedAd = await AdvertisementModel.findByIdAndDelete(id);

    if (!deletedAd) {
      return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete advertisement error:', error);
    return NextResponse.json({ error: 'Failed to delete advertisement' }, { status: 500 });
  }
}

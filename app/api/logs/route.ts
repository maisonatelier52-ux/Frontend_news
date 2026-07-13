import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { SystemLogModel } from '@/models/SystemLog';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    const filter: any = {};
    if (type) {
      filter.type = type;
    }

    const logs = await SystemLogModel.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit);

    return NextResponse.json(logs);
  } catch (err: any) {
    console.error('Fetch system logs error:', err);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { type, action, user, details } = body;

    if (!type || !action) {
      return NextResponse.json({ error: 'Type and action are required' }, { status: 400 });
    }

    let ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    const log = await SystemLogModel.create({
      type,
      action,
      user: user || 'System',
      details,
      ip,
      userAgent
    });

    return NextResponse.json(log);
  } catch (err: any) {
    console.error('Create system log error:', err);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}

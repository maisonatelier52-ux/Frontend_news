import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { SubscriptionModel } from '@/models/Subscription';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_news_admin_jwt_key_2026_change_me_in_production';

export async function GET() {
  try {
    await connectToDatabase();
    const subscriptions = await SubscriptionModel.find().sort({ createdAt: -1 });

    // Aggregate statistics for reaching analytics
    const countryCounts: Record<string, number> = {};
    subscriptions.forEach((sub) => {
      const country = sub.country || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    const total = subscriptions.length;
    const uniqueCountries = Object.keys(countryCounts).length;

    // Convert country counts to list
    const countryDistribution = Object.entries(countryCounts).map(([country, count]) => ({
      country,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    return NextResponse.json({
      subscriptions,
      stats: {
        total,
        uniqueCountries,
        countryDistribution,
      }
    });
  } catch (error: any) {
    console.error('Fetch subscriptions error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await SubscriptionModel.findOne({ email: trimmedEmail });
    if (existing) {
      // Even if already subscribed in DB, generate JWT and set the cookie in case their session was cleared
      const token = jwt.sign(
        { email: trimmedEmail, isSubscribed: true },
        JWT_SECRET,
        { expiresIn: '365d' }
      );
      
      const response = NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter list!',
        subscription: existing
      });

      response.cookies.set('subscriber_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365, // 365 days
        path: '/',
      });

      return response;
    }

    // Capture IP and Geolocation
    const ipHeader = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const ip = ipHeader.split(',')[0].trim();

    let country = 'United States';
    let countryCode = 'US';
    let city = 'New York';
    let region = 'New York';

    const isLocal = !ip || ip === '127.0.0.1' || ip === '::1' || ip === 'localhost';

    if (!isLocal) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}`, { signal: AbortSignal.timeout(3000) });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.status === 'success') {
            country = geoData.country || country;
            countryCode = geoData.countryCode || countryCode;
            city = geoData.city || city;
            region = geoData.regionName || region;
          }
        }
      } catch (err) {
        console.error('Geo lookup error:', err);
      }
    } else {
      // Mock global locations for development/local testing
      const mockLocations = [
        { country: "United States", countryCode: "US", city: "Los Angeles", region: "California" },
        { country: "United Kingdom", countryCode: "GB", city: "London", region: "England" },
        { country: "Germany", countryCode: "DE", city: "Berlin", region: "Berlin" },
        { country: "India", countryCode: "IN", city: "Mumbai", region: "Maharashtra" },
        { country: "Australia", countryCode: "AU", city: "Sydney", region: "New South Wales" },
        { country: "Canada", countryCode: "CA", city: "Toronto", region: "Ontario" },
        { country: "Singapore", countryCode: "SG", city: "Singapore", region: "Central" },
        { country: "Japan", countryCode: "JP", city: "Tokyo", region: "Tokyo" },
      ];
      const randomLoc = mockLocations[Math.floor(Math.random() * mockLocations.length)];
      country = randomLoc.country;
      countryCode = randomLoc.countryCode;
      city = randomLoc.city;
      region = randomLoc.region;
    }

    const newSub = await SubscriptionModel.create({
      email: trimmedEmail,
      ipAddress: ip || '127.0.0.1',
      country,
      countryCode,
      city,
      region,
    });

    const token = jwt.sign(
      { email: trimmedEmail, isSubscribed: true },
      JWT_SECRET,
      { expiresIn: '365d' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Subscribed successfully! Welcome to Magazine Gazette.',
      subscription: newSub
    });

    response.cookies.set('subscriber_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365, // 365 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Create subscription error:', error);
    return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Subscription ID and status are required' }, { status: 400 });
    }

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const updated = await SubscriptionModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, subscription: updated });
  } catch (error: any) {
    console.error('Update subscription error:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    const deleted = await SubscriptionModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Subscription deleted successfully' });
  } catch (error: any) {
    console.error('Delete subscription error:', error);
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { VisitorLogModel } from '@/models/VisitorLog';

// Helper list of mock countries for local development simulation
const DEV_COUNTRIES = [
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Canada', code: 'CA' },
  { name: 'India', code: 'IN' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Australia', code: 'AU' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Japan', code: 'JP' },
  { name: 'South Korea', code: 'KR' }
];

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { url, referrer } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Capture IP
    let ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    const userAgent = req.headers.get('user-agent') || 'Unknown';

    let country = 'United States';
    let countryCode = 'US';

    // Check if IP is localhost/private
    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.16.') || ip.startsWith('::ffff:127.0.0.1');

    if (isLocal) {
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData && ipData.ip) {
            ip = ipData.ip;
          }
        }
      } catch (err) {
        console.error('Failed to resolve local machine public IP:', err);
      }
    }

    if (ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('::ffff:127.0.0.1')) {
      try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, { signal: AbortSignal.timeout(3000) });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData && !geoData.error && geoData.country_name) {
            country = geoData.country_name;
            countryCode = geoData.country_code || 'US';
          }
        }
      } catch (err) {
        console.error('GeoIP lookup failed, using fallback:', err);
      }
    }

    const visitorLog = await VisitorLogModel.create({
      ip,
      country,
      countryCode,
      url,
      userAgent,
      referrer: referrer || ''
    });

    return NextResponse.json({ success: true, log: visitorLog });
  } catch (err: any) {
    console.error('Analytics log error:', err);
    return NextResponse.json({ error: err.message || 'Failed to log analytics' }, { status: 500 });
  }
}

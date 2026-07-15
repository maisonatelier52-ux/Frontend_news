import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { NewsModel } from '@/models/News';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.magazinegazette.com';
  
  try {
    await connectToDatabase();
    const articles = await NewsModel.find({ status: 'published' })
      .sort({ date: -1 })
      .limit(20);

    const rssItems = articles.map(art => `
    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>${baseUrl}/article/${art.slug}</link>
      <guid>${baseUrl}/article/${art.slug}</guid>
      <pubDate>${new Date(art.date).toUTCString()}</pubDate>
      <description><![CDATA[${art.excerpt || ''}]]></description>
    </item>`).join('');

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Magazine Gazette News</title>
  <link>${baseUrl}</link>
  <description>Latest national and world news updates.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
  ${rssItems}
</channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (err: any) {
    console.error('RSS generation error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

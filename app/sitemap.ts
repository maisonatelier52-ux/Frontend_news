import type { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/db';
import { NewsModel } from '@/models/News';
import { CategoryModel } from '@/models/Category';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.magazinegazette.com';
  
  try {
    await connectToDatabase();
    
    const categories = await CategoryModel.find({ isVisible: true });
    const articles = await NewsModel.find({ status: 'published' }, 'slug updatedAt');

    const sitemapEntries: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      }
    ];

    categories.forEach(cat => {
      sitemapEntries.push({
        url: `${baseUrl}/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    articles.forEach(art => {
      sitemapEntries.push({
        url: `${baseUrl}/article/${art.slug}`,
        lastModified: art.updatedAt || new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });

    return sitemapEntries;
  } catch (err) {
    console.error('Sitemap generation error:', err);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      }
    ];
  }
}

import { NextResponse } from 'next/server';
import { fetchArticleBySlug } from '@/lib/homepage-data';
import { getArticleUrl } from '@/lib/site-url';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (article) {
    const newUrl = getArticleUrl(article);
    return NextResponse.redirect(new URL(newUrl, request.url), 301);
  }

  // If article not found, let it 404 naturally or redirect to home
  return NextResponse.redirect(new URL('/', request.url), 302);
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/+$/, '')}`;
  }
  if (process.env.VERCEL_BRANCH_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL.replace(/\/+$/, '')}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, '')}`;
  }
  return 'https://www.magazinegazette.com';
}

export function getFullImageUrl(imagePath?: string): string {
  const baseUrl = getBaseUrl();
  const fallback = `${baseUrl}/images/magazinegazette-logo.jpg`;
  
  if (!imagePath || !imagePath.trim()) {
    return fallback;
  }
  
  const trimmed = imagePath.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  return `${baseUrl}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
}

export function getArticleUrl(article: any): string {
  const categorySlug = (article?.category || 'article').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `/${categorySlug}/${article?.slug || ''}`;
}

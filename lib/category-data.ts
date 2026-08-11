import { connectToDatabase } from './db';
import { NewsModel } from '@/models/News';
import { CategoryLayoutModel } from '@/models/CategoryLayout';
import { formatReadTime } from './formatters';
import { NEWS_ARTICLES } from '@/app/data/news';

// In-memory cache for ultra-fast category loading (60s TTL)
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL_MS = 60 * 1000;

function getCached<T>(key: string): T | null {
  const item = cache[key];
  if (item && Date.now() - item.timestamp < CACHE_TTL_MS) {
    return item.data as T;
  }
  return null;
}

function setCached(key: string, data: any) {
  cache[key] = { data, timestamp: Date.now() };
}

// Deterministic comments count based on id to prevent hydration mismatches
function getDeterministicCommentsCount(id: string) {
  let hash = 0;
  const str = id || '';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 25) + 3;
}

export async function fetchCategoryLayout() {
  const cacheKey = 'category_layout_global';
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  const defaultCategoryLayout = {
    categoryId: 'global',
    designStyle: 'original',
    colorTheme: 'indigo',
    isVisibleSpotlight: true,
    isVisibleSidebar: true,
    spotlightStyle: 'standard',
    broadsheetStyle: 'illustrated'
  };

  try {
    await connectToDatabase();
    const layout = await CategoryLayoutModel.findOne().lean();
    const result = layout ? JSON.parse(JSON.stringify(layout)) : defaultCategoryLayout;
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Failed to fetch category layout from DB:', error);
    return defaultCategoryLayout;
  }
}

export async function fetchCategoryArticles(categoryName: string) {
  const cacheKey = `category_articles_${categoryName.toLowerCase()}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const getStaticFallback = () => {
    const staticMatches = NEWS_ARTICLES.filter(
      (a) => a.category.toLowerCase() === categoryName.toLowerCase()
    );
    if (staticMatches.length > 0) return staticMatches;
    return NEWS_ARTICLES.slice(0, 12);
  };

  try {
    await connectToDatabase();
    const query = {
      status: 'published',
      category: { $regex: new RegExp(`^${categoryName}$`, 'i') }
    };

    const data = await NewsModel.find(query).sort({ date: -1 }).lean();

    if (!data || data.length === 0) {
      const fallback = getStaticFallback();
      setCached(cacheKey, fallback);
      return fallback;
    }

    const mapped = data.map((art: any) => {
      const paragraphs = art.blocks
        ? art.blocks.filter((b: any) => b.type === 'paragraph').map((b: any) => b.value)
        : [art.excerpt || ''];

      const id = art._id.toString();

      return {
        id,
        slug: art.slug || art.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || id,
        title: art.title,
        excerpt: art.excerpt || '',
        content: paragraphs.length > 0 ? paragraphs : [art.excerpt || ''],
        category: art.category,
        author: art.author,
        authorTitle: 'Staff Reporter',
        date: new Date(art.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime: formatReadTime(art.readTime),
        image: art.featuredImage || '/article-placeholder.jpg',
        isLead: art.options?.featuredArticle || false,
        isBreaking: art.options?.breakingNews || false,
        isTrending: art.options?.featuredArticle || false,
        commentsCount: getDeterministicCommentsCount(id)
      };
    });

    const result = JSON.parse(JSON.stringify(mapped));
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Failed to fetch category articles from DB, falling back to static:', error);
    const fallback = getStaticFallback();
    setCached(cacheKey, fallback);
    return fallback;
  }
}

export async function fetchTrendingArticles(categoryName: string) {
  const cacheKey = `trending_articles_${categoryName.toLowerCase()}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const staticTrending = NEWS_ARTICLES.filter(
    (a) => a.category.toLowerCase() !== categoryName.toLowerCase()
  ).slice(0, 7);

  try {
    await connectToDatabase();
    const query = {
      status: 'published',
      category: { $ne: categoryName }
    };

    const data = await NewsModel.find(query).sort({ date: -1 }).limit(7).lean();

    if (!data || data.length === 0) {
      setCached(cacheKey, staticTrending);
      return staticTrending;
    }

    const mapped = data.map((art: any) => {
      const paragraphs = art.blocks
        ? art.blocks.filter((b: any) => b.type === 'paragraph').map((b: any) => b.value)
        : [art.excerpt || ''];

      const id = art._id.toString();

      return {
        id,
        slug: art.slug || art.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || id,
        title: art.title,
        excerpt: art.excerpt || '',
        content: paragraphs.length > 0 ? paragraphs : [art.excerpt || ''],
        category: art.category,
        author: art.author,
        authorTitle: 'Staff Reporter',
        date: new Date(art.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime: formatReadTime(art.readTime),
        image: art.featuredImage || '/article-placeholder.jpg',
        isLead: art.options?.featuredArticle || false,
        isBreaking: art.options?.breakingNews || false,
        isTrending: art.options?.featuredArticle || false,
        commentsCount: getDeterministicCommentsCount(id)
      };
    });

    const result = JSON.parse(JSON.stringify(mapped));
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Failed to fetch trending articles from DB:', error);
    setCached(cacheKey, staticTrending);
    return staticTrending;
  }
}

import { connectToDatabase } from './db';
import { NewsModel } from '@/models/News';
import { CategoryLayoutModel } from '@/models/CategoryLayout';

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
  await connectToDatabase();
  let layout = await CategoryLayoutModel.findOne().lean();
  
  if (!layout) {
    const defaultCategoryLayout = {
      categoryId: 'global',
      designStyle: 'original',
      colorTheme: 'indigo',
      isVisibleSpotlight: true,
      isVisibleSidebar: true,
      spotlightStyle: 'standard',
      broadsheetStyle: 'illustrated'
    };
    layout = await CategoryLayoutModel.create(defaultCategoryLayout);
  }

  return JSON.parse(JSON.stringify(layout));
}

export async function fetchCategoryArticles(categoryName: string) {
  await connectToDatabase();
  const query = {
    status: 'published',
    category: categoryName
  };

  const data = await NewsModel.find(query).sort({ date: -1 }).lean();

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
      readTime: art.readTime || '5 mins',
      image: art.featuredImage || '/article-placeholder.jpg',
      isLead: art.options?.featuredArticle || false,
      isBreaking: art.options?.breakingNews || false,
      isTrending: art.options?.featuredArticle || false,
      commentsCount: getDeterministicCommentsCount(id)
    };
  });

  return JSON.parse(JSON.stringify(mapped));
}

export async function fetchTrendingArticles(categoryName: string) {
  await connectToDatabase();
  const query = {
    status: 'published',
    category: { $ne: categoryName }
  };

  // Fetch latest published articles from other categories to populate the trending list
  const data = await NewsModel.find(query).sort({ date: -1 }).limit(7).lean();

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
      readTime: art.readTime || '5 mins',
      image: art.featuredImage || '/article-placeholder.jpg',
      isLead: art.options?.featuredArticle || false,
      isBreaking: art.options?.breakingNews || false,
      isTrending: art.options?.featuredArticle || false,
      commentsCount: getDeterministicCommentsCount(id)
    };
  });

  return JSON.parse(JSON.stringify(mapped));
}

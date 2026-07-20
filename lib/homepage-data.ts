import { connectToDatabase } from './db';
import { NewsModel } from '@/models/News';
import { CategoryModel } from '@/models/Category';
import { HomeLayoutModel } from '@/models/HomeLayout';
import { AdvertisementModel } from '@/models/Advertisement';

// Deterministic comments count based on id to prevent hydration mismatches
function getDeterministicCommentsCount(id: string) {
  let hash = 0;
  const str = id || '';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 25) + 3;
}

export async function fetchHomeLayout() {
  const defaultLayout = {
    templateName: 'default',
    sections: [
      { id: 'breaking-news', title: 'Breaking News Ticker', isVisible: true, categorySource: 'All', order: 0, limit: 5, designStyle: 'ticker-banner', colorTheme: 'crimson', settings: { isScrolling: true, bgColor: '#dc2626', textColor: '#ffffff', customText: '' } },
      { id: 'date-section', title: 'Date & Info Header', isVisible: true, categorySource: 'All', order: 1, limit: 1, designStyle: 'default', colorTheme: 'zinc', settings: { bgColor: '#f8fafc', textColor: '#64748b' } },
      { id: 'domain-header', title: 'Domain Logo Header', isVisible: true, categorySource: 'All', order: 2, limit: 1, designStyle: 'default', colorTheme: 'zinc', settings: { logoType: 'text', alignment: 'center', logoSize: '54px', taglineText: 'Truth, Clarity, and Perspective • Independent Journalism', taglineSize: '12px', taglineColor: '#71717a', bgColor: '#ffffff', logoColor: '#000000', logoImage: '' } },
      { id: 'category-nav', title: 'Categories Navigation', isVisible: true, categorySource: 'All', order: 3, limit: 1, designStyle: 'default', colorTheme: 'indigo', settings: { bgColor: '#ffffff', alignment: 'center', activeLinkDesign: 'underline', searchPlacement: 'right', searchPlaceholder: 'Search articles...', searchBorderColor: '#e4e4e7', searchBorderThickness: '1px' } },
      { id: 'first-hero', title: 'Main Hero Story', isVisible: true, categorySource: 'All', order: 4, limit: 5, designStyle: 'hero-split', colorTheme: 'indigo', settings: {} }
    ]
  };

  try {
    await connectToDatabase();
    let layout = await HomeLayoutModel.findOne().lean();

    if (!layout) {
      layout = await HomeLayoutModel.create(defaultLayout);
    }

    const sortedSections = [...(layout.sections || [])].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
    return JSON.parse(JSON.stringify(sortedSections));
  } catch (error) {
    console.error('Failed to fetch home layout from DB, returning default:', error);
    return defaultLayout.sections;
  }
}

export async function fetchHomeArticles() {
  try {
    await connectToDatabase();

    // Filter news belonging to hidden categories
    const visibleCategories = await CategoryModel.find({ isVisible: { $ne: false } }).select('name');
    const visibleCategoryNames = visibleCategories.map(c => c.name);

    const query = {
      status: 'published',
      category: { $in: visibleCategoryNames }
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
  } catch (error) {
    console.error('Failed to fetch home articles from DB:', error);
    return [];
  }
}

export async function fetchActiveAds() {
  try {
    await connectToDatabase();
    const ads = await AdvertisementModel.find().sort({ createdAt: -1 }).lean();
    const activeAds = ads.filter((ad: any) => ad.status === 'active');
    return JSON.parse(JSON.stringify(activeAds));
  } catch (error) {
    console.error('Failed to fetch active ads from DB:', error);
    return [];
  }
}

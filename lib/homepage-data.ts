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
  await connectToDatabase();
  let layout = await HomeLayoutModel.findOne().lean();

  if (!layout) {
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
    layout = await HomeLayoutModel.create(defaultLayout);
  }

  const sortedSections = [...(layout.sections || [])].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  return JSON.parse(JSON.stringify(sortedSections));
}

export async function fetchHomeArticles() {
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
}

export async function fetchActiveAds() {
  await connectToDatabase();
  const ads = await AdvertisementModel.find().sort({ createdAt: -1 }).lean();
  
  if (ads.length === 0) {
    // Seed advertisements if empty
    const initialAds = [
      { 
        name: 'Tech Sponsor Banner', 
        position: 'Header Banner', 
        size: '728×90', 
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=728&h=90&fit=crop', 
        status: 'active', 
        clicks: 2840, 
        impressions: '124K', 
        startDate: '2026-06-01', 
        endDate: '2026-07-31' 
      },
      { 
        name: 'Creative Studio Banner', 
        position: 'Sidebar Top', 
        size: '300×250', 
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=250&fit=crop', 
        status: 'active', 
        clicks: 1200, 
        impressions: '87K', 
        startDate: '2026-06-15', 
        endDate: '2026-07-15' 
      },
      { 
        name: 'Design Agency Native Ad', 
        position: 'In-Article', 
        size: '640×200', 
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=200&fit=crop', 
        status: 'active', 
        clicks: 640, 
        impressions: '43K', 
        startDate: '2026-06-01', 
        endDate: '2026-08-01' 
      },
      { 
        name: 'Mobile Network Ad', 
        position: 'Sticky Bottom', 
        size: '320×50', 
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=320&h=50&fit=crop', 
        status: 'active', 
        clicks: 3100, 
        impressions: '210K', 
        startDate: '2026-05-20', 
        endDate: '2026-07-20' 
      },
    ];
    await AdvertisementModel.insertMany(initialAds);
    const reloadedAds = await AdvertisementModel.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(reloadedAds.filter((ad: any) => ad.status === 'active')));
  }

  const activeAds = ads.filter((ad: any) => ad.status === 'active');
  return JSON.parse(JSON.stringify(activeAds));
}

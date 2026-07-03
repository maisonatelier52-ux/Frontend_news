import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside the Vercel dashboard settings');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      tls: true,
      tlsAllowInvalidCertificates: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  // Run the seeder dynamically if collections are empty
  await seedDatabase();

  return cached.conn;
}

async function seedDatabase() {
  try {
    // Dynamically retrieve models to avoid circular dependencies
    const { CategoryModel } = await import('@/models/Category');
    const { AuthorModel } = await import('@/models/Author');
    const { NewsModel } = await import('@/models/News');
    const { UserModel } = await import('@/models/User');
    const { HomeLayoutModel } = await import('@/models/HomeLayout');
    const bcrypt = await import('bcryptjs');

    // 0. Seed Admin User (removed, admin is now created dynamically on first login)

    // 1. Seed Categories if empty
    const categoryCount = await CategoryModel.countDocuments();
    if (categoryCount === 0) {
      const initialCategories = [
        { name: 'Politics', slug: 'politics', articles: 312, color: '#3b82f6', description: 'National and global political news and updates.', position: 1, isVisible: true, showInNav: true },
        { name: 'Technology', slug: 'technology', articles: 245, color: '#8b5cf6', description: 'Gadgets, software, internet, and industry developments.', position: 2, isVisible: true, showInNav: true },
        { name: 'Business', slug: 'business', articles: 198, color: '#f59e0b', description: 'Market trends, corporate updates, and financial advice.', position: 3, isVisible: true, showInNav: true },
        { name: 'World', slug: 'world', articles: 167, color: '#10b981', description: 'International events, global perspectives, and culture.', position: 4, isVisible: true, showInNav: true },
        { name: 'Sports', slug: 'sports', articles: 143, color: '#ef4444', description: 'Match reports, athlete updates, and tournament news.', position: 5, isVisible: true, showInNav: true },
        { name: 'Entertainment', slug: 'entertainment', articles: 98, color: '#ec4899', description: 'Celebrity gossip, movie reviews, and pop culture.', position: 6, isVisible: true, showInNav: false },
        { name: 'Science', slug: 'science', articles: 76, color: '#06b6d4', description: 'Discoveries, space updates, and environmental news.', position: 7, isVisible: true, showInNav: false },
        { name: 'Health', slug: 'health', articles: 45, color: '#84cc16', description: 'Medical research, wellness tips, and public health updates.', position: 8, isVisible: true, showInNav: false },
      ];
      await CategoryModel.insertMany(initialCategories);
      console.log('Seeded categories successfully!');
    }

    // 2. Seed Authors if empty
    const authorCount = await AuthorModel.countDocuments();
    if (authorCount === 0) {
      const initialAuthors = [
        {
          name: 'Sarah Johnson',
          slug: 'sarah-johnson',
          gender: 'Female',
          country: 'United States',
          email: 'sarah@newssite.com',
          category: 'Politics',
          websiteUrl: 'https://sarahj.com',
          bio: 'Senior political correspondent with over a decade of experience covering Washington and international relations.',
          profileImage: '/authors/sarah-johnson.webp',
          socialLinks: {
            twitter: 'https://x.com/sarah_johnson',
            quora: 'https://quora.com/profile/Sarah-Johnson',
            medium: 'https://medium.com/@sarah_j'
          },
          articlesCount: 312
        },
        {
          name: 'Michael Chen',
          slug: 'michael-chen',
          gender: 'Male',
          country: 'Canada',
          email: 'michael@newssite.com',
          category: 'Technology',
          websiteUrl: 'https://chentech.io',
          bio: 'Tech analyst, developer, and former software engineering lead covering artificial intelligence, Silicon Valley, and consumer tech.',
          profileImage: '/authors/michael-chen.webp',
          socialLinks: {
            twitter: 'https://x.com/mike_chen',
            reddit: 'https://reddit.com/user/mike_chen_tech'
          },
          articlesCount: 245
        },
        {
          name: 'Emily Davis',
          slug: 'emily-davis',
          gender: 'Female',
          country: 'United Kingdom',
          email: 'emily@newssite.com',
          category: 'Business',
          websiteUrl: 'https://emilydavis.co.uk',
          bio: 'Financial journalist reporting on corporate earnings, global markets, monetary policies, and entrepreneurship.',
          profileImage: '/authors/emily-davis.webp',
          socialLinks: {
            twitter: 'https://x.com/emily_davis_biz',
            medium: 'https://medium.com/@emily_davis'
          },
          articlesCount: 198
        },
        {
          name: 'Lisa Park',
          slug: 'lisa-park',
          gender: 'Female',
          country: 'South Korea',
          email: 'lisa@newssite.com',
          category: 'Sports',
          websiteUrl: '',
          bio: 'Sports reporter and former college athlete covering major leagues, tournament championships, and athlete profiles.',
          profileImage: '/authors/lisa-park.webp',
          socialLinks: {
            twitter: 'https://x.com/lisa_park_sports',
            quora: 'https://quora.com/profile/Lisa-Park'
          },
          articlesCount: 143
        }
      ];
      await AuthorModel.insertMany(initialAuthors);
      console.log('Seeded authors successfully!');
    }

    // 3. Seed News if empty
    const newsCount = await NewsModel.countDocuments();
    if (newsCount === 0) {
      // We can grab the mock NEWS_ARTICLES from news data helper to seed them!
      const { NEWS_ARTICLES } = await import('@/app/data/news');
      const formattedArticles = NEWS_ARTICLES.map((art, idx) => {
        // Convert array of string paragraphs to block layout matching new structure
        const blocks = art.content.map((p, pIdx) => ({
          id: `block-seed-${idx}-${pIdx}`,
          type: 'paragraph',
          value: p
        }));

        return {
          title: art.title,
          slug: art.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `article-${idx}`,
          category: art.category,
          author: art.author,
          readTime: art.readTime,
          status: 'published',
          excerpt: art.excerpt,
          featuredImage: art.image || '/article-placeholder.jpg',
          imageAltText: art.title,
          featuredVideoUrl: '',
          cardLabel: art.isLead ? 'Lead Story' : (art.isBreaking ? 'Breaking' : ''),
          options: {
            featuredArticle: art.isLead || false,
            editorsPick: false,
            breakingNews: art.isBreaking || false,
            allowComments: true
          },
          blocks: blocks,
          date: new Date(art.date).toString() !== 'Invalid Date' ? new Date(art.date) : new Date()
        };
      });

      await NewsModel.insertMany(formattedArticles);
      console.log('Seeded news articles successfully!');
    }

    // 4. Seed HomeLayout if empty
    const layoutCount = await HomeLayoutModel.countDocuments();
    if (layoutCount === 0) {
      const defaultLayout = {
        templateName: 'default',
        sections: [
          { id: 'breaking-news', title: 'Breaking News Ticker', isVisible: true, categorySource: 'All', order: 0, limit: 5, designStyle: 'ticker-banner', colorTheme: 'crimson', settings: { isScrolling: true, bgColor: '#dc2626', textColor: '#ffffff', customText: '' } },
          { id: 'date-section', title: 'Date & Info Header', isVisible: true, categorySource: 'All', order: 1, limit: 1, designStyle: 'default', colorTheme: 'zinc', settings: { bgColor: '#f8fafc', textColor: '#64748b' } },
          { id: 'domain-header', title: 'Domain Logo Header', isVisible: true, categorySource: 'All', order: 2, limit: 1, designStyle: 'default', colorTheme: 'zinc', settings: { logoType: 'text', alignment: 'center', logoSize: '48px', taglineText: 'Truth, Clarity, and Perspective • Independent Journalism', taglineSize: '12px', taglineColor: '#71717a', bgColor: '#ffffff', logoColor: '#000000', logoImage: '' } },
          { id: 'category-nav', title: 'Categories Navigation', isVisible: true, categorySource: 'All', order: 3, limit: 1, designStyle: 'default', colorTheme: 'indigo', settings: { bgColor: '#ffffff', alignment: 'center', activeLinkDesign: 'underline', searchPlacement: 'right', searchPlaceholder: 'Search articles...', searchBorderColor: '#e4e4e7', searchBorderThickness: '1px' } },
          { id: 'first-hero', title: 'Main Hero Story', isVisible: true, categorySource: 'All', order: 4, limit: 5, designStyle: 'hero-split', colorTheme: 'indigo', settings: {} },
          { id: 'us-politics', title: 'U.S. News & Politics', isVisible: true, categorySource: 'Politics', order: 5, limit: 4, designStyle: 'grid', colorTheme: 'indigo', settings: {} },
          { id: 'finance-markets', title: 'Finance & Markets', isVisible: true, categorySource: 'Business', order: 6, limit: 4, designStyle: 'grid', colorTheme: 'indigo', settings: {} },
          { id: 'opinion-column', title: 'Opinions & Perspectives', isVisible: true, categorySource: 'All', order: 7, limit: 3, designStyle: 'columns', colorTheme: 'zinc', settings: {} },
          { id: 'technology-section', title: 'Tech Pulse', isVisible: true, categorySource: 'Technology', order: 8, limit: 4, designStyle: 'grid', colorTheme: 'indigo', settings: {} },
          { id: 'trending-columns', title: 'Trending Columns', isVisible: true, categorySource: 'All', order: 9, limit: 5, designStyle: 'list', colorTheme: 'indigo', settings: {} },
          { id: 'world-affairs', title: 'World Affairs', isVisible: true, categorySource: 'World', order: 10, limit: 5, designStyle: 'grid', colorTheme: 'indigo', settings: {} },
          { id: 'arts-marketing-pr', title: 'Culture & Press Spotlight', isVisible: true, categorySource: 'Entertainment,Sports', order: 11, limit: 6, designStyle: 'spotlight-grid', colorTheme: 'indigo', settings: {} },
          { id: 'latest-news', title: 'The Latest Chronicle Feed', isVisible: true, categorySource: 'All', order: 12, limit: 10, designStyle: 'list', colorTheme: 'indigo', settings: {} }
        ]
      };
      await HomeLayoutModel.create(defaultLayout);
      console.log('Seeded default home layout successfully!');
    }
  } catch (err) {
    console.error('Database seeding failed:', err);
  }
}

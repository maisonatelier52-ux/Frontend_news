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
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  // Run the seeder dynamically if collections are empty
  try {
    await seedDatabase();
  } catch (err) {
    console.error('Seeding database failed:', err);
  }

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
        { name: 'Business', slug: 'business', articles: 0, color: '#f59e0b', description: 'Market trends, corporate updates, and financial advice.', position: 1, isVisible: true, showInNav: true },
        { name: 'World', slug: 'world', articles: 0, color: '#10b981', description: 'International events, global perspectives, and culture.', position: 2, isVisible: true, showInNav: true },
        { name: 'Finance', slug: 'finance', articles: 0, color: '#06b6d4', description: 'Personal finance, markets, and investment strategies.', position: 3, isVisible: true, showInNav: true },
        { name: 'Technology', slug: 'technology', articles: 0, color: '#8b5cf6', description: 'Gadgets, software, internet, and industry developments.', position: 4, isVisible: true, showInNav: true },
        { name: 'Politics', slug: 'politics', articles: 0, color: '#3b82f6', description: 'National and global political news and updates.', position: 5, isVisible: true, showInNav: true },
        { name: 'Lifestyle', slug: 'lifestyle', articles: 0, color: '#ec4899', description: 'Culture, travel, food, fashion, and well-being.', position: 6, isVisible: true, showInNav: true },
        { name: 'Opinion', slug: 'opinion', articles: 0, color: '#84cc16', description: 'Editorials, columns, and analytical viewpoints.', position: 7, isVisible: true, showInNav: true },
        { name: 'Investigation', slug: 'investigation', articles: 0, color: '#ef4444', description: 'In-depth investigative reports and investigative journalism.', position: 8, isVisible: true, showInNav: true }
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

    // 3. Seed News if empty (disabled as user wants clean-slate news)

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
          { id: 'first-hero', title: 'Main Hero Story', isVisible: true, categorySource: 'All', order: 4, limit: 5, designStyle: 'hero-split', colorTheme: 'indigo', settings: {} }
        ]
      };
      await HomeLayoutModel.create(defaultLayout);
      console.log('Seeded default home layout successfully!');
    }

    // 5. Seed CategoryLayout if empty
    const { CategoryLayoutModel } = await import('@/models/CategoryLayout');
    const categoryLayoutCount = await CategoryLayoutModel.countDocuments();
    if (categoryLayoutCount === 0) {
      const defaultCategoryLayout = {
        categoryId: 'global',
        designStyle: 'original',
        colorTheme: 'indigo',
        isVisibleSpotlight: true,
        isVisibleSidebar: true,
        spotlightStyle: 'standard',
        broadsheetStyle: 'illustrated'
      };
      await CategoryLayoutModel.create(defaultCategoryLayout);
      console.log('Seeded default category layout successfully!');
    }

    // 6. Seed Comments if empty (disabled as user wants clean-slate news)
  } catch (err) {
    console.error('Database seeding failed:', err);
  }
}

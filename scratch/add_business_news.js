const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dcj2ovntc',
  api_key: '155416775841746',
  api_secret: 'KC7Oyd7Cp3SEwQLgFciDeyTbkIs',
});

// Setup paths
const imagePath = 'C:\\Users\\lenovothink\\.gemini\\antigravity-ide\\brain\\0bdc38a4-eb2d-46be-82ae-e3e2f2aa7062\\business_news_market_1784203091972.png';

async function run() {
  try {
    // 1. Upload image to Cloudinary
    console.log('Uploading image to Cloudinary...');
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Generated image file not found at ${imagePath}`);
    }

    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: 'magazinegazette',
      public_id: 'business-news-market-surge-2026',
      resource_type: 'image',
    });

    const imageUrl = uploadResult.secure_url;
    console.log('Image uploaded successfully! Cloudinary URL:', imageUrl);

    // 2. Connect to MongoDB
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log('Connected to database successfully!');

    // Define schemas to match the original ones
    const BlockSchema = new mongoose.Schema({
      id: { type: String, required: true },
      type: { type: String, required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true }
    }, { _id: false });

    const NewsSchema = new mongoose.Schema({
      title: { type: String, required: true },
      slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
      category: { type: String, required: true },
      author: { type: String, required: true },
      readTime: { type: String, default: '5 mins' },
      status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
      date: { type: Date, default: Date.now },
      excerpt: { type: String },
      featuredImage: { type: String },
      imageAltText: { type: String },
      featuredVideoUrl: { type: String },
      cardLabel: { type: String },
      options: {
        featuredArticle: { type: Boolean, default: false },
        editorsPick: { type: Boolean, default: false },
        breakingNews: { type: Boolean, default: false },
        allowComments: { type: Boolean, default: true }
      },
      blocks: [BlockSchema],
      seoTitle: { type: String },
      seoMetaDescription: { type: String },
      keywords: { type: String },
      tags: { type: String }
    }, {
      timestamps: true,
    });

    const News = mongoose.models.News || mongoose.model('News', NewsSchema);

    // 3. Insert news document
    const title = 'Market Surge: Tech Stocks Propel Global Indexes to New All-Time Highs';
    const slug = 'market-surge-tech-stocks-propel-global-indexes-new-all-time-highs';
    const authorName = 'Michael Chen';
    const categoryName = 'Business';

    // Remove existing news with this slug if any, to avoid duplication
    await News.deleteOne({ slug });

    const newsArticle = await News.create({
      title,
      slug,
      category: categoryName,
      author: authorName,
      readTime: '3 mins',
      status: 'published',
      excerpt: 'Global stock markets experienced a major rally today, led by strong performance in the technology sector and positive quarterly earnings from key enterprise players.',
      featuredImage: imageUrl,
      imageAltText: 'Financial stock market charts showing upward trends',
      options: {
        featuredArticle: true,
        editorsPick: true,
        breakingNews: false,
        allowComments: true
      },
      blocks: [
        {
          id: 'block-1',
          type: 'paragraph',
          value: 'Global stock markets experienced a powerful rally today, with leading indexes surging to new all-time highs. The gains were propelled primarily by the technology and semiconductor sectors, following a wave of positive quarterly earnings reports and robust forward guidance from major tech giants.'
        },
        {
          id: 'block-2',
          type: 'paragraph',
          value: 'Market analysts noted that strong consumer demand and increased enterprise investment in cloud computing and AI infrastructure continue to act as solid catalysts for growth. Investors have responded with optimism, driving heavy trading volume across major global exchanges.'
        }
      ],
      seoTitle: 'Tech Stock Surge Drives Markets to New Heights',
      seoMetaDescription: 'A strong rally led by the technology sector pushes global stock indexes to record highs following positive earnings reports.',
      keywords: 'business news, stock market, tech stocks, record highs, financial rally',
      tags: 'Business, Tech, Finance',
      date: new Date()
    });

    console.log('News article created successfully in MongoDB:', newsArticle.title);

    // 4. Update author count and category count
    await mongoose.connection.db.collection('authors').updateOne(
      { name: authorName },
      { $inc: { articlesCount: 1 } }
    );
    console.log(`Incremented article count for author: ${authorName}`);

    await mongoose.connection.db.collection('categories').updateOne(
      { name: categoryName },
      { $inc: { articles: 1 } }
    );
    console.log(`Incremented article count for category: ${categoryName}`);

  } catch (error) {
    console.error('Error running script:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

run();

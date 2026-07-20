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
const imagePath = 'C:\\Users\\lenovothink\\.gemini\\antigravity-ide\\brain\\0bdc38a4-eb2d-46be-82ae-e3e2f2aa7062\\world_news_summit_1784201728950.png';

async function run() {
  try {
    // 1. Upload image to Cloudinary
    console.log('Uploading image to Cloudinary...');
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Generated image file not found at ${imagePath}`);
    }

    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: 'magazinegazette',
      public_id: 'world-news-global-summit-2026',
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
    const title = 'Global Summit Achieves Breakthrough Agreement on Transnational Digital Infrastructure';
    const slug = 'global-summit-achieves-breakthrough-agreement-transnational-digital-infrastructure';
    const authorName = 'Sarah Johnson';
    const categoryName = 'World';

    // Remove existing news with this slug if any, to avoid duplication
    await News.deleteOne({ slug });

    const newsArticle = await News.create({
      title,
      slug,
      category: categoryName,
      author: authorName,
      readTime: '4 mins',
      status: 'published',
      excerpt: 'World leaders at the international summit have reached a historic agreement laying the foundation for a standardized global framework on digital connectivity and internet privacy.',
      featuredImage: imageUrl,
      imageAltText: 'World leaders at global digital summit conference',
      options: {
        featuredArticle: true,
        editorsPick: true,
        breakingNews: true,
        allowComments: true
      },
      blocks: [
        {
          id: 'block-1',
          type: 'paragraph',
          value: 'World leaders gathered at the International Convention Center this week to finalize a historic accord on digital connectivity, trade, and cyber-security standards. The agreement, signed by over forty nations, establishes the first unified global framework for cross-border digital services and cloud infrastructure standards.'
        },
        {
          id: 'block-2',
          type: 'paragraph',
          value: 'The accord is expected to streamline international digital commerce while setting stricter, more cohesive standards for user data protection and privacy safeguards across participating regions. Officials stated that this represents a major step forward in establishing global norms for the digital economy.'
        }
      ],
      seoTitle: 'Global Summit Achieves Historic Digital Infrastructure Accord',
      seoMetaDescription: 'World leaders sign a groundbreaking agreement to establish global standards for digital connectivity, trade, and online privacy.',
      keywords: 'world news, global summit, digital connectivity, internet policy, privacy accord',
      tags: 'Global, Policy, Digital',
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

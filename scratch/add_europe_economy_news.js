const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

function getEnvVar(key) {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

const MONGODB_URI = getEnvVar('MONGODB_URI');
const CLOUD_NAME = getEnvVar('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME') || 'dcj2ovntc';
const API_KEY = getEnvVar('CLOUDINARY_API_KEY') || '155416775841746';
const API_SECRET = getEnvVar('CLOUDINARY_API_SECRET') || 'KC7Oyd7Cp3SEwQLgFciDeyTbkIs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const sourceImage = 'C:\\Users\\lenovothink\\.gemini\\antigravity-ide\\brain\\8c47784d-a6c5-44be-8493-aedeca427d54\\.user_uploaded\\media_1793362918979.jpg';
const properFileName = 'europe-economy-brushes-off-energy-shock-iran-war-ecb';
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
const targetWebp = path.join(publicImagesDir, `${properFileName}.webp`);
const targetJpg = path.join(publicImagesDir, `${properFileName}.jpg`);

async function run() {
  try {
    console.log('1. Checking source image...');
    if (!fs.existsSync(sourceImage)) {
      throw new Error(`Source image not found at: ${sourceImage}`);
    }
    console.log('Source image verified!');

    // Convert to webp and jpg in public/images
    console.log('2. Processing image files locally...');
    await sharp(sourceImage)
      .webp({ quality: 90 })
      .toFile(targetWebp);
    console.log(`Saved WebP to: ${targetWebp}`);

    await sharp(sourceImage)
      .jpeg({ quality: 90 })
      .toFile(targetJpg);
    console.log(`Saved JPG to: ${targetJpg}`);

    // Upload to Cloudinary
    console.log('3. Uploading image to Cloudinary...');
    const uploadResult = await cloudinary.uploader.upload(targetWebp, {
      folder: 'magazinegazette',
      public_id: properFileName,
      resource_type: 'image',
      overwrite: true,
    });

    const imageUrl = uploadResult.secure_url;
    console.log('Cloudinary upload success! URL:', imageUrl);

    // Connect to MongoDB
    console.log('4. Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log('Connected to MongoDB successfully!');

    // Define schemas
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

    const title = 'Europe’s Economy Brushes Off Energy Shock From Iran War, Shows Moderate Growth in Q3';
    const slug = 'europes-economy-brushes-off-energy-shock-iran-war-moderate-growth-q3';
    const authorName = 'Emily Davis';
    const categoryName = 'Business';

    const blocks = [
      {
        id: 'block-' + Date.now() + '-1',
        type: 'subheading',
        value: 'Resilient Momentum Defies Stagflation Fears'
      },
      {
        id: 'block-' + Date.now() + '-2',
        type: 'paragraph',
        value: 'Europe’s economy expanded at a moderate pace in the third quarter, brushing aside intense fears that the military conflict involving Iran and escalating tensions in the Middle East would plunge the eurozone into a fresh bout of stagflation. According to preliminary data released by Eurostat, gross domestic product across the 20-nation currency bloc rose by 0.4% quarter-on-quarter, comfortably outpacing analyst estimates of 0.2% and building on solid momentum from earlier in the year.'
      },
      {
        id: 'block-' + Date.now() + '-3',
        type: 'paragraph',
        value: 'The unexpected durability was anchored by steady household consumption, sustained employment levels, and continued resilience in the service sector. While the outbreak of hostilities in the Persian Gulf triggered sharp volatility in benchmark Brent crude prices and raised questions over maritime passage through the Strait of Hormuz, European manufacturers and logistics networks managed to adapt without facing the catastrophic supply halts witnessed in prior geopolitical crises.'
      },
      {
        id: 'block-' + Date.now() + '-4',
        type: 'subheading',
        value: 'Energy Diversification Softens Market Impact'
      },
      {
        id: 'block-' + Date.now() + '-5',
        type: 'paragraph',
        value: 'A critical pillar underpinning the region’s economic insulation has been the sweeping structural overhaul of its energy procurement over the past three years. European gas storage facilities entered the autumn season filled to more than 95% of capacity, providing a decisive buffer against sudden wholesale price spikes. Long-term supply contracts with liquefied natural gas (LNG) suppliers in the United States and Qatar, coupled with expanded pipeline capacity from Norway and North Africa, prevented acute shortages.'
      },
      {
        id: 'block-' + Date.now() + '-6',
        type: 'paragraph',
        value: '“The systemic vulnerabilities that defined Europe’s energy calculus only a few years ago have diminished significantly,” noted Christian Keller, head of economic research at Barclays. “While higher crude prices exert a drag on consumer real purchasing power, European industry is no longer caught flat-footed by sudden geopolitical flare-ups in oil-producing regions.”'
      },
      {
        id: 'block-' + Date.now() + '-7',
        type: 'pullquote',
        value: {
          quote: 'The European economy has proved far more adaptable than skeptics anticipated, absorbing geopolitical shocks through diversified energy architecture and persistent domestic demand.',
          author: 'European Central Bank Economic Bulletin'
        }
      },
      {
        id: 'block-' + Date.now() + '-8',
        type: 'subheading',
        value: 'ECB Monitors Inflation Pressures in Frankfurt'
      },
      {
        id: 'block-' + Date.now() + '-9',
        type: 'paragraph',
        value: 'At the European Central Bank’s towering headquarters in Frankfurt, policymakers are examining the third-quarter figures with cautious satisfaction alongside measured vigilance. While the headline growth figure diminishes immediate recession anxieties, central bank officials remain attentive to secondary inflationary risks stemming from shipping surcharges, elevated maritime insurance rates, and persistent wage growth.'
      },
      {
        id: 'block-' + Date.now() + '-10',
        type: 'paragraph',
        value: 'ECB President Christine Lagarde and the Governing Council have emphasized that future monetary policy adjustments will stay strictly data-dependent. With headline inflation hovering near the ECB’s 2% target, the resilience in growth provides the central bank room to recalibrate interest rates without fear of inducing an acute economic downturn.'
      },
      {
        id: 'block-' + Date.now() + '-11',
        type: 'subheading',
        value: 'Southern Europe Leads as Germany Stabilizes'
      },
      {
        id: 'block-' + Date.now() + '-12',
        type: 'paragraph',
        value: 'The quarterly performance also highlighted a recurring geographic divergence within the continent. Southern European economies—spearheaded by Spain’s 0.8% growth rate and stable expansions in Italy and Portugal—continued to outperform, driven by robust domestic tourism, service exports, and influxes of NextGenerationEU recovery funding.'
      },
      {
        id: 'block-' + Date.now() + '-13',
        type: 'paragraph',
        value: 'Germany, the continent’s largest economy, managed to avert a contraction by posting modest 0.1% growth, supported by state infrastructure spending and automotive export stabilization. Although German chemical and energy-intensive manufacturing still faces competitive hurdles, the avoided slump signaled that even Europe’s industrial engine is finding its footing amidst global trade shifts.'
      },
      {
        id: 'block-' + Date.now() + '-14',
        type: 'subheading',
        value: 'Cautious Optimism Heading into Winter'
      },
      {
        id: 'block-' + Date.now() + '-15',
        type: 'paragraph',
        value: 'Looking ahead to the fourth quarter and early winter, economists caution that downside risks remain non-negligible. A protracted escalation of the Iran war that disrupts broader shipping lanes or causes sustained spikes in global bunker fuel costs could eventually filter down to consumer retail prices. However, with robust labor markets and resilient corporate balance sheets, Europe enters the final stretch of the year on substantially firmer footing than many forecasters had dared to predict.'
      }
    ];

    // Remove existing news with this slug if any
    const existing = await News.findOne({ slug });
    if (existing) {
      console.log('Replacing existing article with same slug...');
      await News.deleteOne({ slug });
    }

    const newsArticle = await News.create({
      title,
      slug,
      category: categoryName,
      author: authorName,
      readTime: '5 mins',
      status: 'published',
      date: new Date(),
      excerpt: 'Despite geopolitical tensions and oil market turbulence from the Iran conflict, the eurozone demonstrated remarkable resilience in the third quarter, posting 0.4% GDP growth supported by domestic consumption and strong services.',
      featuredImage: imageUrl,
      imageAltText: 'European Central Bank headquarters sign and tower in Frankfurt Germany under clear blue skies',
      cardLabel: 'Eurozone Resilience',
      options: {
        featuredArticle: true,
        editorsPick: true,
        breakingNews: false,
        allowComments: true
      },
      blocks,
      seoTitle: 'Europe Economy Q3 Growth: Eurozone Brushes Off Iran War Energy Shock',
      seoMetaDescription: 'The European economy grew at a moderate 0.4% pace in Q3, brushing off energy shocks and Middle East conflict risks backed by diversified supplies and steady consumer spending.',
      keywords: 'Europe economy, Eurozone GDP, Q3 growth, ECB, European Central Bank, Iran war, energy shock, oil prices, inflation, monetary policy',
      tags: 'Business, Europe, Economy, ECB, Energy, Finance'
    });

    console.log('\n=============================================');
    console.log('News article successfully saved to MongoDB!');
    console.log('Article ID:', newsArticle._id);
    console.log('Article Title:', newsArticle.title);
    console.log('Article Slug:', newsArticle.slug);
    console.log('Featured Image:', newsArticle.featuredImage);
    console.log('Category:', newsArticle.category);
    console.log('Author:', newsArticle.author);
    console.log('Blocks count:', newsArticle.blocks.length);
    console.log('=============================================\n');

    // Update Author article count if not updating existing
    if (!existing) {
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
    }

  } catch (error) {
    console.error('Error during execution:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
}

run();

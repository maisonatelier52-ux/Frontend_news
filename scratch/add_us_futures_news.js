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

const sourceImage = 'C:\\Users\\lenovothink\\.gemini\\antigravity-ide\\brain\\8c47784d-a6c5-44be-8493-aedeca427d54\\.user_uploaded\\media_1793363090295.jpg';
const properFileName = 'us-futures-fall-amazon-intel-alphabet-wall-street';
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

    const title = 'US Futures Fall as Amazon, Intel and Alphabet Weigh on Wall Street';
    const slug = 'us-futures-fall-amazon-intel-alphabet-weigh-wall-street';
    const authorName = 'Marcus Bennett';
    const categoryName = 'Business';

    const blocks = [
      {
        id: 'block-' + Date.now() + '-1',
        type: 'subheading',
        value: 'Tech Mega-Caps Drag Pre-Market Futures Lower'
      },
      {
        id: 'block-' + Date.now() + '-2',
        type: 'paragraph',
        value: 'U.S. stock index futures dropped sharply in early morning trade on Friday, as underwhelming forward guidance and escalating capital expenditures from market stalwarts Amazon, Alphabet, and Intel soured investor sentiment across Wall Street. Futures tied to the tech-heavy Nasdaq 100 retreated 1.2%, while S&P 500 futures fell 0.8% and Dow Jones Industrial Average futures shed over 190 points.'
      },
      {
        id: 'block-' + Date.now() + '-3',
        type: 'paragraph',
        value: 'The retreat follows a record-breaking streak earlier in the month, underscoring growing vulnerability among mega-cap technology firms whose stratospheric valuations leave razor-thin margins for error. Traders on the floor of the New York Stock Exchange and across global electronic desks reported heavy pre-market selling as institutional funds rebalanced toward defensive sectors and government debt.'
      },
      {
        id: 'block-' + Date.now() + '-4',
        type: 'subheading',
        value: 'Amazon and Alphabet: AI Capex Surge Prompts Wall Street Scrutiny'
      },
      {
        id: 'block-' + Date.now() + '-5',
        type: 'paragraph',
        value: 'Amazon shares sank more than 5% in pre-market dealings after the e-commerce and cloud computing giant delivered a cautious holiday-quarter operating profit forecast. Despite solid consumer retail figures, executives signaled intensified spending on generative artificial intelligence infrastructure for Amazon Web Services (AWS), dampening near-term operating margin projections.'
      },
      {
        id: 'block-' + Date.now() + '-6',
        type: 'paragraph',
        value: 'Alphabet also faced intense downward pressure, shedding 3.4% as investors parsed the Google parent company’s surging capital expenditure forecast. While search advertising and YouTube revenue remained healthy, Alphabet’s multi-billion-dollar commitment to cutting-edge server clusters and custom silicon raised questions over the timeframe required to translate massive infrastructure outlays into accelerating net cash flows.'
      },
      {
        id: 'block-' + Date.now() + '-7',
        type: 'pullquote',
        value: {
          quote: 'Wall Street has entered a phase of heightened accountability for artificial intelligence spending. Markets are no longer cheering capex announcements unconditionally; investors now demand unambiguous evidence of immediate margin conversion.',
          author: 'Julian Thorne, Chief Equity Strategist at Horizon Wealth Management'
        }
      },
      {
        id: 'block-' + Date.now() + '-8',
        type: 'subheading',
        value: 'Intel Slides on Restructuring and Foundry Losses'
      },
      {
        id: 'block-' + Date.now() + '-9',
        type: 'paragraph',
        value: 'Semiconductor pioneer Intel bore the brunt of the pre-bell sell-off, tumbling over 7% following quarterly metrics that highlighted lingering headwinds in its contract manufacturing division. While PC processor sales stabilized modestly, the company’s Intel Foundry unit posted substantial operating losses as it builds out domestic fabrication plants in Ohio and Germany.'
      },
      {
        id: 'block-' + Date.now() + '-10',
        type: 'paragraph',
        value: 'Analysts pointed to relentless competition from Nvidia and AMD in the high-margin enterprise data center space, where traditional x86 server chips continue to concede budget allocations to specialized accelerated computing architectures. Intel’s cautious revenue guidance reinforced investor fears that the chipmaker’s extensive multi-year turnaround remains arduous and cash-intensive.'
      },
      {
        id: 'block-' + Date.now() + '-11',
        type: 'subheading',
        value: 'Bond Yields Steady as Key Labor Data Approaches'
      },
      {
        id: 'block-' + Date.now() + '-12',
        type: 'paragraph',
        value: 'Treasury yields offered little relief to equity markets, with the benchmark 10-year U.S. Treasury note holding firm around 4.28%. Traders remained reluctant to make aggressive rate bets ahead of upcoming monthly Non-Farm Payrolls and wage growth data, which will provide pivotal guidance for the Federal Reserve’s upcoming interest rate deliberations.'
      },
      {
        id: 'block-' + Date.now() + '-13',
        type: 'paragraph',
        value: 'With corporate earnings season reaching its most congested stretch, market participants anticipate elevated intraday volatility. Analysts noted that while broader macroeconomic fundamentals remain solid, index performance will increasingly depend on whether corporate guidance can justify premium price-to-earnings multiples amidst shifting tech dynamics.'
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
      readTime: '4 mins',
      status: 'published',
      date: new Date(),
      excerpt: 'Wall Street futures tumbled in pre-market trade as disappointing guidance from Amazon, soaring AI expenditures at Alphabet, and steep foundry losses at Intel triggered a sell-off across mega-cap technology shares.',
      featuredImage: imageUrl,
      imageAltText: 'Stock market financial traders monitoring terminals and stock price graphs on Wall Street',
      cardLabel: 'Wall Street Slump',
      options: {
        featuredArticle: true,
        editorsPick: true,
        breakingNews: false,
        allowComments: true
      },
      blocks,
      seoTitle: 'US Futures Fall: Amazon, Alphabet, Intel Slump Shakes Wall Street',
      seoMetaDescription: 'US stock futures slid as Amazon, Alphabet, and Intel weighed on market sentiment with rising AI expenditures and cautious quarterly guidance.',
      keywords: 'US futures, Wall Street, stock market, Amazon earnings, Alphabet stock, Intel slump, Nasdaq 100, S&P 500, tech stocks, AI capex, financial markets',
      tags: 'Business, Markets, Wall Street, Tech, Stocks, Finance'
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

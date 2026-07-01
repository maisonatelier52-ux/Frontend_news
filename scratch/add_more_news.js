const mongoose = require('mongoose');
const connStr = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(connStr).then(async () => {
  const BlockSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
  }, { _id: false });

  const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    readTime: { type: String, default: '5 mins' },
    status: { type: String, default: 'published' },
    date: { type: Date, default: Date.now },
    excerpt: { type: String },
    featuredImage: { type: String },
    options: {
      featuredArticle: { type: Boolean, default: false },
      editorsPick: { type: Boolean, default: false },
      breakingNews: { type: Boolean, default: false },
      allowComments: { type: Boolean, default: true }
    },
    blocks: [BlockSchema]
  }, { collection: 'news', timestamps: true });

  const NewsModel = mongoose.models.News || mongoose.model('News', NewsSchema);

  const extraArticles = [
    // --- US ---
    {
      title: "Congress Debates Landmark Bipartisan Infrastructure Funding Plan",
      slug: "congress-debates-landmark-infrastructure-funding-new",
      category: "US",
      author: "David Vance",
      excerpt: "Lawmakers from both sides of the aisle are negotiating a major federal package to reconstruct highways and improve rural electrical power grids.",
      featuredImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
      options: { featuredArticle: false, editorsPick: true, breakingNews: false, allowComments: true },
      blocks: [{ id: "b1", type: "paragraph", value: "Members of Congress began debate today on a monumental bipartisan package targeting infrastructure development over the next decade. The funding proposal aims to upgrade bridges, modernise grids, and expand high-speed internet access." }]
    },
    {
      title: "Supreme Court Issues Key Ruling on Environmental Regulations",
      slug: "supreme-court-environmental-regulations-ruling-new",
      category: "US",
      author: "Sarah Jenkins",
      excerpt: "In a closely watched decision, the nation's highest court has clarified the scope of federal oversight on clean energy implementation.",
      featuredImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
      options: { featuredArticle: false, editorsPick: false, breakingNews: false, allowComments: true },
      blocks: [{ id: "b1", type: "paragraph", value: "The Supreme Court delivered a landmark ruling today regarding clean power initiatives and interstate emission boundaries. Environmental advocates and industry leaders alike are assessing the long-term impact." }]
    },
    // --- Finance ---
    {
      title: "Federal Reserve Holds Interest Rates Steady, Signals Caution",
      slug: "fed-holds-rates-steady-caution-new",
      category: "Finance",
      author: "Michael Sterling",
      excerpt: "The Federal Reserve kept benchmark lending rates unchanged during its latest committee session, indicating that inflation figures warrant careful monitoring.",
      featuredImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
      options: { featuredArticle: false, editorsPick: true, breakingNews: false, allowComments: true },
      blocks: [{ id: "b1", type: "paragraph", value: "Federal Reserve officials voted unanimously to maintain interest rates at their current range. Economists noted the central bank's stance reflects an ongoing desire to achieve stability before making further policy shifts." }]
    },
    {
      title: "Global Supply Chain Rebound Bolsters Third-Quarter Market Indexes",
      slug: "supply-chain-rebound-market-indexes-new",
      category: "Finance",
      author: "Robert Chen",
      excerpt: "Leading industrial indices jumped as shipping channels cleared and wholesale transportation pricing dropped to pre-2024 averages.",
      featuredImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
      options: { featuredArticle: false, editorsPick: false, breakingNews: false, allowComments: true },
      blocks: [{ id: "b1", type: "paragraph", value: "Industrial sector earnings reported today exceeded Wall Street forecasts, led primarily by lower container rates and streamlined transit corridors. Traders responded with buying pressure, pushing major indices higher." }]
    },
    // --- World ---
    {
      title: "European Trade Commission Outlines New Climate Border Duties",
      slug: "europe-trade-commission-climate-duties-new",
      category: "World",
      author: "Elena Rostova",
      excerpt: "The European Union has announced plans to implement import tariffs based on carbon emissions, aiming to encourage international supply chain transparency.",
      featuredImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      options: { featuredArticle: false, editorsPick: false, breakingNews: false, allowComments: true },
      blocks: [{ id: "b1", type: "paragraph", value: "A new carbon border adjustment mechanism will apply to heavy industrial imports entering the European Union from next year. Officials stated the measure ensures local producers face fair terms." }]
    },
    // --- Marketing ---
    {
      title: "E-Commerce Strategy Pivots Toward Interactive Live-Stream Sales",
      slug: "ecommerce-pivots-live-stream-sales-new",
      category: "Marketing",
      author: "Jane Miller",
      excerpt: "Retail brands are allocating higher portions of digital advertising budgets to real-time interactive video showcases to attract younger buyers.",
      featuredImage: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=600&q=80",
      options: { featuredArticle: false, editorsPick: false, breakingNews: false, allowComments: true },
      blocks: [{ id: "b1", type: "paragraph", value: "Recent consumer metrics indicate live-stream shopping conversion rates are outperforming traditional digital display advertisements by over 300 percent, leading to rapid budget adjustments." }]
    },
    // --- PR News ---
    {
      title: "National Health Association Announces Major Wellness Education Initiative",
      slug: "health-association-wellness-initiative-new",
      category: "PR News",
      author: "Press Release Editor",
      excerpt: "The association has partnered with local communities to distribute nutritional materials and establish public exercise programs in urban parks.",
      featuredImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
      options: { featuredArticle: false, editorsPick: false, breakingNews: false, allowComments: true },
      blocks: [{ id: "b1", type: "paragraph", value: "In an official press release, the National Health Association announced a multi-million dollar campaign designed to promote healthy habits and physical activity across major municipal districts." }]
    }
  ];

  for (const art of extraArticles) {
    const existing = await NewsModel.findOne({ slug: art.slug });
    if (!existing) {
      await NewsModel.create(art);
      console.log(`Created article: "${art.title}" under category ${art.category}`);
    } else {
      console.log(`Article already exists: "${art.title}"`);
    }
  }

  console.log('Extra news articles population completed successfully.');
  process.exit(0);
}).catch(err => {
  console.error('Failed to add news articles:', err);
  process.exit(1);
});

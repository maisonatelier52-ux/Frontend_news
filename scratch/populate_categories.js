const mongoose = require('mongoose');
const connStr = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(connStr).then(async () => {
  const schema = new mongoose.Schema({
    name: String,
    slug: String,
    parent: String,
    articles: Number,
    color: String,
    description: String,
    position: Number,
    isVisible: Boolean,
    showInNav: Boolean
  }, { collection: 'categories', timestamps: true });

  const CategoryModel = mongoose.model('Category', schema);

  const missingCats = [
    { name: 'US', slug: 'us', parent: '', articles: 6, color: '#3b82f6', description: 'United States national news and politics.', position: 1, isVisible: true, showInNav: true },
    { name: 'Finance', slug: 'finance', parent: '', articles: 8, color: '#f59e0b', description: 'Financial news, market analysis and economy.', position: 3, isVisible: true, showInNav: true },
    { name: 'World', slug: 'world', parent: '', articles: 3, color: '#10b981', description: 'Global events and foreign affairs.', position: 4, isVisible: true, showInNav: true },
    { name: 'Marketing', slug: 'marketing', parent: '', articles: 11, color: '#ec4899', description: 'Strategy, branding and market trends.', position: 9, isVisible: true, showInNav: true },
    { name: 'PR News', slug: 'pr-news', parent: '', articles: 6, color: '#6366f1', description: 'Institutional press releases.', position: 10, isVisible: true, showInNav: true }
  ];

  for (const cat of missingCats) {
    const existing = await CategoryModel.findOne({ name: cat.name });
    if (!existing) {
      await CategoryModel.create(cat);
      console.log(`Created category: ${cat.name}`);
    } else {
      // Ensure it is visible
      existing.isVisible = true;
      existing.showInNav = true;
      await existing.save();
      console.log(`Updated existing category: ${cat.name} to visible`);
    }
  }

  console.log('Categories population completed successfully.');
  process.exit(0);
}).catch(err => {
  console.error('Failed to populate categories:', err);
  process.exit(1);
});

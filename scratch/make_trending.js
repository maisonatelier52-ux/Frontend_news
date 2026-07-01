const mongoose = require('mongoose');
const connStr = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(connStr).then(async () => {
  const schema = new mongoose.Schema({
    title: String,
    options: {
      featuredArticle: Boolean,
      editorsPick: Boolean,
      breakingNews: Boolean,
      allowComments: Boolean
    }
  }, { collection: 'news' });

  const NewsModel = mongoose.model('News', schema);

  // Find articles that are not currently featured and set featuredArticle to true
  const count = await NewsModel.countDocuments({ 'options.featuredArticle': true });
  console.log(`Currently featured/trending articles in database: ${count}`);

  if (count < 5) {
    const articlesToFeature = await NewsModel.find({ 'options.featuredArticle': { $ne: true } }).limit(6);
    for (const art of articlesToFeature) {
      art.options = art.options || {};
      art.options.featuredArticle = true;
      await art.save();
      console.log(`Marked as trending: "${art.title}"`);
    }
  }

  const newCount = await NewsModel.countDocuments({ 'options.featuredArticle': true });
  console.log(`New featured/trending articles count: ${newCount}`);
  
  process.exit(0);
}).catch(err => {
  console.error('Failed to update trending articles:', err);
  process.exit(1);
});

const mongoose = require('mongoose');
const connStr = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(connStr).then(async () => {
  const schema = new mongoose.Schema({}, { strict: false });
  const Model = mongoose.model('News', schema, 'news');
  const count = await Model.countDocuments();
  console.log('Total articles count in DB:', count);
  const aggregate = await Model.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  console.log('Articles breakdown by category:');
  console.log(JSON.stringify(aggregate, null, 2));

  // Print all articles titles and categories
  const articles = await Model.find({}, { title: 1, category: 1, status: 1 });
  console.log('All articles in DB:');
  console.log(JSON.stringify(articles.map(a => ({ title: a.title, category: a.category, status: a.status })), null, 2));

  process.exit(0);
}).catch(err => {
  console.error('Failed to run db check:', err);
  process.exit(1);
});

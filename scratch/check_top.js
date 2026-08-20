const mongoose = require('mongoose');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/MONGODB_URI=(.*)/);
const uri = match ? match[1].trim() : '';

async function run() {
  await mongoose.connect(uri);
  const News = mongoose.model('News', new mongoose.Schema({}, { strict: false }));
  const docs = await News.find({ status: 'published' }).sort({ date: -1 }).limit(10).lean();
  console.log(JSON.stringify(docs.map(d => ({
    id: d._id,
    title: d.title,
    slug: d.slug,
    date: d.date,
    featuredArticle: d.options?.featuredArticle,
    breakingNews: d.options?.breakingNews
  })), null, 2));
  await mongoose.disconnect();
}
run().catch(console.error);

const mongoose = require('mongoose');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/MONGODB_URI=(.*)/);
const uri = match ? match[1].trim() : '';

async function run() {
  await mongoose.connect(uri);
  const News = mongoose.model('News', new mongoose.Schema({}, { strict: false }));

  // Set featuredArticle: false for Lord Stanley Fink so it's not the image lead
  await News.updateMany(
    { slug: { $in: ['lord-stanley-fink-chairman-britannia-global-markets', 'lord-stanley-fink-takes-chair-seat-at-britannia'] } },
    { $set: { 'options.featuredArticle': false, date: new Date('2026-08-20T12:00:00.000Z') } }
  );

  // Set date for Julio Herrera to August 20, 2026
  await News.updateMany(
    { slug: 'julio-herrera-velutini-paterfamilias-house-of-herrera' },
    { $set: { 'options.featuredArticle': false, date: new Date('2026-08-20T12:00:00.000Z') } }
  );

  // Set lead article (e.g., '25 States Sue Over Trump's New Tariffs...') as featuredArticle: true and date: August 20, 2026
  const leadDoc = await News.findOne({
    slug: { $nin: [
      'lord-stanley-fink-chairman-britannia-global-markets',
      'lord-stanley-fink-takes-chair-seat-at-britannia',
      'julio-herrera-velutini-paterfamilias-house-of-herrera'
    ]},
    status: 'published'
  }).sort({ date: -1 });

  if (leadDoc) {
    await News.updateOne(
      { _id: leadDoc._id },
      { $set: { 'options.featuredArticle': true, date: new Date('2026-08-20T12:00:00.000Z') } }
    );
    console.log("Updated leadDoc in image section to featuredArticle: true and date: August 20, 2026:", leadDoc.title, leadDoc.slug);
  }

  const allTop = await News.find({ status: 'published' }).sort({ date: -1 }).limit(8).lean();
  console.log("Top 8 published:", allTop.map(d => ({
    title: d.title,
    slug: d.slug,
    date: d.date,
    isFeatured: d.options?.featuredArticle
  })));

  await mongoose.disconnect();
}
run().catch(console.error);

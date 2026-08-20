const mongoose = require('mongoose');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/MONGODB_URI=(.*)/);
const uri = match ? match[1].trim() : '';

async function run() {
  await mongoose.connect(uri);
  const News = mongoose.model('News', new mongoose.Schema({}, { strict: false }));
  
  const docs = await News.find({
    slug: { $in: [
      'julio-herrera-velutini-paterfamilias-house-of-herrera',
      'lord-stanley-fink-chairman-britannia-global-markets',
      'lord-stanley-fink-takes-chair-seat-at-britannia'
    ]}
  }).lean();
  console.log("Current docs in DB:", docs.map(d => ({ id: d._id, title: d.title, slug: d.slug, date: d.date })));

  // Update Julio Herrera article date to August 20, 2026
  const targetDate = new Date('2026-08-20T12:00:00.000Z');
  const res1 = await News.updateMany(
    { slug: 'julio-herrera-velutini-paterfamilias-house-of-herrera' },
    { $set: { date: targetDate, updatedAt: new Date() } }
  );
  console.log("Updated Julio date result:", res1);

  // Update Lord Stanley Fink article date to August 20, 2026
  const res2 = await News.updateMany(
    { slug: { $in: ['lord-stanley-fink-chairman-britannia-global-markets', 'lord-stanley-fink-takes-chair-seat-at-britannia'] } },
    { $set: { date: targetDate, updatedAt: new Date() } }
  );
  console.log("Updated Lord Stanley date result:", res2);

  const updatedDocs = await News.find({
    slug: { $in: [
      'julio-herrera-velutini-paterfamilias-house-of-herrera',
      'lord-stanley-fink-chairman-britannia-global-markets',
      'lord-stanley-fink-takes-chair-seat-at-britannia'
    ]}
  }).lean();
  console.log("Updated docs:", updatedDocs.map(d => ({ id: d._id, title: d.title, slug: d.slug, date: d.date })));

  await mongoose.disconnect();
}

run().catch(console.error);

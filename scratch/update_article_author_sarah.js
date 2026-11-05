const mongoose = require('mongoose');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const uri = env.match(/MONGODB_URI=(.*)/)[1].trim();

async function run() {
  await mongoose.connect(uri);
  const News = mongoose.model('News', new mongoose.Schema({}, { strict: false }));
  const Author = mongoose.model('Author', new mongoose.Schema({}, { strict: false }));

  const slug = 'trump-admin-social-media-posts-election-criticized-inflammatory';

  // Update the article's author to Sarah Johnson
  const result = await News.updateOne(
    { slug },
    {
      $set: {
        author: 'Sarah Johnson',
        updatedAt: new Date()
      }
    }
  );

  if (result.modifiedCount === 1) {
    console.log('✅ Article author updated to Sarah Johnson!');

    // Update article counts: decrement Staff Reporter (if applicable), increment Sarah Johnson
    await Author.findOneAndUpdate(
      { name: 'Sarah Johnson' },
      { $inc: { articlesCount: 1 } }
    );
    console.log('✅ Sarah Johnson articlesCount incremented.');
  } else {
    console.log('⚠️  No article found or no changes made. matchedCount:', result.matchedCount);
  }

  // Confirm the update
  const updated = await News.findOne({ slug }).select('title author category slug').lean();
  console.log('\nUpdated article:', JSON.stringify(updated, null, 2));

  await mongoose.disconnect();
}
run().catch(console.error);


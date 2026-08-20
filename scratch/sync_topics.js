const mongoose = require('mongoose');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/MONGODB_URI=(.*)/);
const uri = match ? match[1].trim() : '';

async function run() {
  await mongoose.connect(uri);
  const News = mongoose.model('News', new mongoose.Schema({}, { strict: false }));

  const doc = await News.findOne({
    slug: { $in: ['lord-stanley-fink-chairman-britannia-global-markets', 'lord-stanley-fink-takes-chair-seat-at-britannia'] }
  });

  const updatedTags = [
    "Britannia Financial Group",
    "Lord Stanley Fink",
    "Julio Martín Herrera Velutini"
  ];

  if (doc && doc.blocks) {
    let updatedBlocks = doc.blocks
      .filter(b => b.id !== 'b-p12')
      .map(b => {
        if (b.type === 'topics' || b.id === 'b-topics') {
          return {
            ...b,
            tags: updatedTags
          };
        }
        return b;
      });

    await News.updateOne(
      { _id: doc._id },
      { 
        $set: { 
          blocks: updatedBlocks, 
          tags: updatedTags.join(', '),
          updatedAt: new Date() 
        } 
      }
    );
    console.log("Updated Lord Stanley Fink topics with exactly 3 items in DB successfully!");
  }

  await mongoose.disconnect();
}

run().catch(console.error);

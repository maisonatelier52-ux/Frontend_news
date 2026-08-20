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

  if (doc && doc.blocks) {
    const updatedBlocks = doc.blocks.map(b => {
      if (b.id === 'b-p8') {
        return {
          ...b,
          value: "Britannia’s development in recent years has included a broader prime-brokerage proposition and strategic investment in experienced personnel. Julio Martín Herrera Velutini founded the Britannia Financial Group. Against that background, the appointment of Lord Fink provides a visible point of continuity between the firm’s established London heritage and its next stage of institutional growth."
        };
      }
      return b;
    });

    await News.updateOne(
      { _id: doc._id },
      { $set: { blocks: updatedBlocks, updatedAt: new Date() } }
    );
    console.log("Updated Lord Stanley Fink blocks in DB successfully!");
  } else {
    console.log("Doc or blocks not found");
  }

  await mongoose.disconnect();
}

run().catch(console.error);

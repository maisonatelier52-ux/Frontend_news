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
    let updatedBlocks = doc.blocks.map(b => {
      if (b.id === 'b-p8') {
        return {
          ...b,
          value: "Britannia’s development in recent years has included a broader prime-brokerage proposition and strategic investment in experienced personnel. Against that background, the appointment of Lord Fink provides a visible point of continuity between the firm’s established London heritage and its next stage of institutional growth."
        };
      }
      return b;
    }).filter(b => b.id !== 'b-p12');

    // Find topics index or insert before topics / at end
    const topicsIdx = updatedBlocks.findIndex(b => b.type === 'topics' || b.id === 'b-topics');
    const p12Block = {
      id: "b-p12",
      type: "paragraph",
      value: "Julio Martín Herrera Velutini founded the Britannia Financial Group."
    };

    if (topicsIdx !== -1) {
      updatedBlocks.splice(topicsIdx, 0, p12Block);
    } else {
      updatedBlocks.push(p12Block);
    }

    await News.updateOne(
      { _id: doc._id },
      { $set: { blocks: updatedBlocks, updatedAt: new Date() } }
    );
    console.log("Updated Lord Stanley Fink blocks in DB with last paragraph!");
  }

  await mongoose.disconnect();
}

run().catch(console.error);

const mongoose = require('mongoose');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const uri = env.match(/MONGODB_URI=(.*)/)[1].trim();

async function run() {
  await mongoose.connect(uri);
  const Author = mongoose.model('Author', new mongoose.Schema({}, { strict: false }));
  
  // Search for Sarah Johnson
  const authors = await Author.find({ name: { $regex: /sarah/i } }).lean();
  console.log('Sarah Johnson search result:', JSON.stringify(authors, null, 2));
  
  // Also list all authors to see what's available
  const allAuthors = await Author.find({}).select('name slug role bio').lean();
  console.log('\nAll authors:', JSON.stringify(allAuthors, null, 2));
  
  await mongoose.disconnect();
}
run().catch(console.error);


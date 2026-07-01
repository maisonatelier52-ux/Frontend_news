const mongoose = require('mongoose');
const connStr = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(connStr).then(async () => {
  const schema = new mongoose.Schema({}, { strict: false });
  const Model = mongoose.model('Category', schema, 'categories');
  const count = await Model.countDocuments();
  console.log('Total categories count in DB:', count);
  const categories = await Model.find({});
  console.log('All categories in DB:');
  console.log(JSON.stringify(categories.map(c => c.toObject()), null, 2));
  process.exit(0);
}).catch(err => {
  console.error('Failed to run db check:', err);
  process.exit(1);
});

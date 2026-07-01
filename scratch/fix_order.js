const mongoose = require('mongoose');
const connStr = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(connStr).then(async () => {
  const schema = new mongoose.Schema({
    sections: [{
      id: String,
      title: String,
      isVisible: Boolean,
      categorySource: String,
      order: Number,
      limit: Number,
      designStyle: String,
      colorTheme: String,
      settings: mongoose.Schema.Types.Mixed
    }]
  }, { collection: 'homelayouts' });

  const HomeLayoutModel = mongoose.model('HomeLayout', schema);

  const doc = await HomeLayoutModel.findOne();
  if (doc) {
    console.log('Original sections order:');
    doc.sections.forEach(s => console.log(`${s.id} -> order: ${s.order}`));

    // Update order
    // We want:
    // 0: breaking-news
    // 1: date-section
    // 2: domain-header
    // 3: category-nav
    // and so on...
    const orderMap = {
      'breaking-news': 0,
      'date-section': 1,
      'domain-header': 2,
      'category-nav': 3,
      'first-hero': 4,
      'us-politics': 5,
      'finance-markets': 6,
      'opinion-column': 7,
      'technology-section': 8,
      'trending-columns': 9,
      'world-affairs': 10,
      'arts-marketing-pr': 11,
      'latest-news': 12
    };

    doc.sections.forEach(s => {
      if (orderMap[s.id] !== undefined) {
        s.order = orderMap[s.id];
      }
    });

    // Sort the array in place based on new order values
    doc.sections.sort((a, b) => a.order - b.order);

    doc.markModified('sections');
    await doc.save();

    console.log('\nUpdated sections order:');
    doc.sections.forEach(s => console.log(`${s.id} -> order: ${s.order}`));
  } else {
    console.log('No layout configuration document found in DB.');
  }

  process.exit(0);
}).catch(err => {
  console.error('Failed to update sections order:', err);
  process.exit(1);
});

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true });
    const db = mongoose.connection.db;
    const article = await db.collection('news').findOne({ slug: 'julio-herrera-velutini-paterfamilias-house-of-herrera' });
    console.log('Title:', article.title);
    console.log('Category:', article.category);
    console.log('Author:', article.author);
    console.log('Date:', article.date);
    console.log('ReadTime:', article.readTime);
    console.log('Image:', article.featuredImage || article.image);
    console.log('Excerpt:', article.excerpt);
    console.log('Total blocks:', article.blocks.length);
    console.log('\n--- BLOCKS ---');
    console.log(JSON.stringify(article.blocks, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

check();

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true });
    const db = mongoose.connection.db;
    const articles = await db.collection('news').find({
      $or: [
        { slug: /julio/i },
        { title: /julio/i },
        { slug: /herrera/i },
        { title: /herrera/i }
      ]
    }).toArray();
    console.log('Found articles count:', articles.length);
    console.log(JSON.stringify(articles, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

check();

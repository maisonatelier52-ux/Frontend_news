const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true });
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      const name = col.name;
      const results = await db.collection(name).find({
        $or: [
          { excerpt: /controlling/i },
          { text: /controlling/i },
          { title: /controlling/i },
          { 'blocks.value': /controlling/i },
          { excerpt: /House of Herrera/i },
          { text: /House of Herrera/i },
          { excerpt: /paterfamilias/i }
        ]
      }).toArray();
      if (results.length > 0) {
        console.log(`Found in collection ${name}:`, results.length);
        results.forEach(r => {
          console.log('ID:', r._id, 'Title/Slug:', r.title || r.slug);
          console.log('Excerpt:', r.excerpt);
        });
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

check();

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

async function update() {
  try {
    await mongoose.connect(MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true });
    const db = mongoose.connection.db;
    const res = await db.collection('news').updateMany(
      {
        $or: [
          { slug: 'julio-herrera-velutini-paterfamilias-house-of-herrera' },
          { excerpt: /controlling its assets/i }
        ]
      },
      {
        $set: { excerpt: '' }
      }
    );
    console.log('Updated articles count:', res.modifiedCount);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

update();

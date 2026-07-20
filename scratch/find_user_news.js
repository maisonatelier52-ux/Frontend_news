const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    
    console.log('Connected to Database successfully!');
    
    // Find all articles created in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newsList = await mongoose.connection.db.collection('news').find({
      createdAt: { $gte: oneDayAgo }
    }).toArray();
    
    console.log(`\nArticles added in the last 24 hours: ${newsList.length}`);
    newsList.forEach((art, index) => {
      console.log(`\n${index + 1}. Title: ${art.title}`);
      console.log(`   Slug: ${art.slug}`);
      console.log(`   Status: ${art.status}`);
      console.log(`   Category: ${art.category}`);
      console.log(`   Author: ${art.author}`);
      console.log(`   Date Field: ${art.date}`);
      console.log(`   Created At: ${art.createdAt}`);
      console.log(`   Featured Image: ${art.featuredImage}`);
    });
    
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();

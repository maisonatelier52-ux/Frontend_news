const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    
    console.log('Connected to Database successfully!');
    
    const newsList = await mongoose.connection.db.collection('news').find({}).sort({ date: -1 }).toArray();
    console.log(`Total News Articles in DB: ${newsList.length}`);
    
    console.log('\nList of all articles in DB (newest first):');
    newsList.forEach((art, index) => {
      console.log(`${index + 1}. [${art.status}] ${art.title} (${art.category}) - Date: ${art.date}`);
    });
    
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();

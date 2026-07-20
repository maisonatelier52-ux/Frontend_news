const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    
    console.log('Connected to Database successfully!');
    
    const categories = await mongoose.connection.db.collection('categories').find({}).toArray();
    console.log('Categories in DB:');
    console.log(categories.map(c => ({ name: c.name, slug: c.slug })));

    const authors = await mongoose.connection.db.collection('authors').find({}).toArray();
    console.log('Authors in DB:');
    console.log(authors.map(a => ({ name: a.name, slug: a.slug })));
    
  } catch (error) {
    console.error('Error inspecting database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();

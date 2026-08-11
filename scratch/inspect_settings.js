const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const settings = await db.collection('sitesettings').find({}).toArray();
    console.log('Site settings count:', settings.length);
    console.log('Site settings:', JSON.stringify(settings, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

check();

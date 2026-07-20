const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    
    console.log('Connected to Database successfully!');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in DB:', collections.map(c => c.name));

    // Query system_logs
    const logs = await mongoose.connection.db.collection('system_logs').find({}).sort({ timestamp: -1 }).limit(20).toArray();
    console.log(`\nLast 20 System Logs:`);
    console.log(logs.map(l => ({ action: l.action, message: l.message, timestamp: l.timestamp, details: l.details || l.metadata })));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();

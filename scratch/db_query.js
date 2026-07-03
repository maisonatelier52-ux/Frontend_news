const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    
    console.log('Connected to Database successfully!');
    
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    // Ensure user is in 'admin' collection
    const adminExists = await mongoose.connection.db.collection('admin').findOne({ email: 'admin@newssite.com' });
    if (!adminExists) {
      await mongoose.connection.db.collection('admin').insertOne({
        email: 'admin@newssite.com',
        password: hashedPassword,
        admin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Seeded admin@newssite.com in admin collection.');
    } else {
      console.log('admin@newssite.com already exists in admin collection.');
    }
    
    // Ensure user is in 'users' collection (for UserModel lookup in forgot-password/verify-otp)
    const userExists = await mongoose.connection.db.collection('users').findOne({ email: 'admin@newssite.com' });
    if (!userExists) {
      await mongoose.connection.db.collection('users').insertOne({
        name: 'Admin User',
        email: 'admin@newssite.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Seeded admin@newssite.com in users collection.');
    } else {
      console.log('admin@newssite.com already exists in users collection.');
    }
    
  } catch (error) {
    console.error('Error seeding databases:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();

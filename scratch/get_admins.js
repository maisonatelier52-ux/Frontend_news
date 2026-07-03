const mongoose = require('mongoose');
const connStr = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(connStr).then(async () => {
  const schema = new mongoose.Schema({}, { strict: false });
  // check both collection names "admin" and "admincredentials"
  const Admin = mongoose.model('Admin', schema, 'admin');
  const admins = await Admin.find({});
  console.log('Admins in "admin" collection:', JSON.stringify(admins, null, 2));

  try {
    const AdminCreds = mongoose.model('AdminCreds', schema, 'admincredentials');
    const adminCreds = await AdminCreds.find({});
    console.log('Admins in "admincredentials" collection:', JSON.stringify(adminCreds, null, 2));
  } catch (e) {
    console.log('No admincredentials collection or failed:', e.message);
  }

  process.exit(0);
}).catch(err => {
  console.error('Failed to run db check:', err);
  process.exit(1);
});

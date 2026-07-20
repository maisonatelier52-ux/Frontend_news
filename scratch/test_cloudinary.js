const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dcj2ovntc',
  api_key: '155416775841746',
  api_secret: 'KC7Oyd7Cp3SEwQLgFciDeyTbkIs',
});

async function test() {
  try {
    console.log('Testing Cloudinary upload...');
    const res = await cloudinary.uploader.upload('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', {
      folder: 'test',
    });
    console.log('Upload success:', res);
  } catch (err) {
    console.error('Upload failed structure:');
    console.error(Object.keys(err));
    console.error('Error message:', err.message);
    console.error('Error object details:', JSON.stringify(err, null, 2));
  }
}

test();

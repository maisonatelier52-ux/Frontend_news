process.env.CLOUDINARY_URL = 'cloudinary://155416775841746:KC7Oyd7Cp3SEwQLgFciDeyTbkIs@dcj2ovntc';
const cloudinary = require('cloudinary').v2;

async function test() {
  try {
    console.log('Testing Cloudinary upload using CLOUDINARY_URL...');
    const res = await cloudinary.uploader.upload('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', {
      folder: 'magazinegazette',
    });
    console.log('Upload success:', res);
  } catch (err) {
    console.error('Upload failed details:', err);
  }
}

test();

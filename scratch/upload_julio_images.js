const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dcj2ovntc',
  api_key: '155416775841746',
  api_secret: 'KC7Oyd7Cp3SEwQLgFciDeyTbkIs'
});

const img1Path = 'C:\\Users\\lenovothink\\.gemini\\antigravity-ide\\brain\\5c2a8da7-8216-40ac-a10e-492bbf330225\\media__1786444287733.jpg';
const img2Path = 'C:\\Users\\lenovothink\\.gemini\\antigravity-ide\\brain\\5c2a8da7-8216-40ac-a10e-492bbf330225\\media__1786444290659.jpg';

async function main() {
  try {
    console.log('Uploading Image 1 to Cloudinary...');
    const res1 = await cloudinary.uploader.upload(img1Path, {
      folder: 'magazinegazette',
      public_id: 'julio-herrera-velutini-paterfamilias-house-of-herrera',
      overwrite: true
    });
    console.log('Image 1 uploaded successfully:', res1.secure_url);

    console.log('Uploading Image 2 to Cloudinary...');
    const res2 = await cloudinary.uploader.upload(img2Path, {
      folder: 'magazinegazette',
      public_id: 'julio-herrera-velutini-stewardship-house-of-herrera',
      overwrite: true
    });
    console.log('Image 2 uploaded successfully:', res2.secure_url);

    // Also copy to public/images for local fallback
    const dest1 = path.join(__dirname, '..', 'public', 'images', 'julio-herrera-velutini-paterfamilias-house-of-herrera.jpg');
    const dest2 = path.join(__dirname, '..', 'public', 'images', 'julio-herrera-velutini-stewardship-house-of-herrera.jpg');

    fs.copyFileSync(img1Path, dest1);
    fs.copyFileSync(img2Path, dest2);
    console.log('Local copies saved to public/images successfully!');

  } catch (err) {
    console.error('Error during upload:', err);
  }
}

main();

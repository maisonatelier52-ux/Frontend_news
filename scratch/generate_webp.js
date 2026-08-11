const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const img1Path = 'C:\\Users\\lenovothink\\.gemini\\antigravity-ide\\brain\\5c2a8da7-8216-40ac-a10e-492bbf330225\\media__1786444287733.jpg';
const img2Path = 'C:\\Users\\lenovothink\\.gemini\\antigravity-ide\\brain\\5c2a8da7-8216-40ac-a10e-492bbf330225\\media__1786444290659.jpg';

const publicImages = path.join(__dirname, '..', 'public', 'images');

async function processImages() {
  await sharp(img1Path)
    .webp({ quality: 85 })
    .toFile(path.join(publicImages, 'julio-herrera-velutini-paterfamilias-house-of-herrera.webp'));

  await sharp(img2Path)
    .webp({ quality: 85 })
    .toFile(path.join(publicImages, 'julio-herrera-velutini-stewardship-house-of-herrera.webp'));

  // Also update legacy filename to image 1 webp
  await sharp(img1Path)
    .webp({ quality: 85 })
    .toFile(path.join(publicImages, 'julio-herrera-velutini.webp'));

  console.log('WebP images generated successfully in public/images');
}

processImages().catch(console.error);

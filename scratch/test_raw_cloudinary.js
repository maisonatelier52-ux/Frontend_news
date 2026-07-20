const https = require('https');
const crypto = require('crypto');

const cloudName = 'dcj2ovntc';
const apiKey = '155416775841746';
const apiSecret = 'KC7Oyd7Cp3SEwQLgFciDeyTbkIs';

const timestamp = Math.round(new Date().getTime() / 1000);
const folder = 'magazinegazette';

// Generate signature
// Sort parameters alphabetically: folder, timestamp
const paramString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
const signature = crypto.createHash('sha1').update(paramString).digest('hex');

const postData = JSON.stringify({
  file: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  api_key: apiKey,
  timestamp: timestamp,
  signature: signature,
  folder: folder
});

const options = {
  hostname: 'api.cloudinary.com',
  port: 443,
  path: `/v1_1/${cloudName}/image/upload`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:');
    console.log(data);
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e);
});

req.write(postData);
req.end();

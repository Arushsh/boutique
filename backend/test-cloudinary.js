require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  try {
    console.log('Testing Cloudinary config...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    
    // Create a dummy text file to upload
    const dummyPath = path.join(__dirname, 'dummy.jpg');
    fs.writeFileSync(dummyPath, 'not a real image, just testing upload');

    console.log('Uploading dummy file...');
    const result = await cloudinary.uploader.upload(dummyPath, {
      folder: 'aura_boutique_test',
      resource_type: 'raw'
    });

    console.log('Upload successful!');
    console.log('Secure URL:', result.secure_url);
    
    // Cleanup
    fs.unlinkSync(dummyPath);
    await cloudinary.uploader.destroy(result.public_id, { resource_type: 'raw' });
    console.log('Cleanup successful.');

  } catch (error) {
    console.error('Cloudinary Upload Failed:', error.message || error);
  }
}

testUpload();

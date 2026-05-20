import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadToCloudinary(fileBuffer, fileName) {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          public_id: `choudhary-communications/${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`,
          quality: 'auto',
          fetch_format: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export default cloudinary;

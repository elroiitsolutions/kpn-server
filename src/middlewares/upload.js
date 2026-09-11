import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

// Setup local upload disk fallback
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Store in memory for direct stream to Cloudinary or disk save
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const allowedExtensions = /^\.(jpe?g|png|webp|gif|svg|pdf|mp4)$/i;
  const isExtValid = allowedExtensions.test(ext);
  const isMimeValid =
    /jpeg|jpg|png|webp|gif|svg|pdf|mp4/i.test(file.mimetype) ||
    file.mimetype === 'application/octet-stream';

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(new Error(`File format not supported (${ext || 'unknown'}). Only images, PDFs, and MP4 videos are allowed!`));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter,
});

export const uploadToCloudinary = (fileBuffer, folder, originalFilename) => {
  return new Promise((resolve, reject) => {
    const fallbackToLocal = (reason) => {
      console.warn(`[Upload Fallback] Cloudinary unavailable (${reason}), saving locally to disk...`);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const cleanName = (originalFilename || 'file').replace(/\s+/g, '_');
      const filename = `${uniqueSuffix}-${cleanName}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFile(filePath, fileBuffer, (err) => {
        if (err) return reject(err);
        resolve({
          url: `/uploads/${filename}`,
          publicId: filename,
        });
      });
    };

    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();

    // If Cloudinary is configured
    if (cloudName && apiKey) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `kpn_promoters/${folder}`,
          resource_type: 'auto',
          timeout: 120000,
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Upload Error]:', error.message || error);
            return fallbackToLocal(error.message);
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(fileBuffer);
    } else {
      fallbackToLocal('Cloudinary credentials not provided');
    }
  });
};

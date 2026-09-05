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
  const allowedExtensions = /jpeg|jpg|png|webp|gif|svg|pdf|mp4/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, WebP, GIF, SVG), PDFs, and MP4 videos are allowed!'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max
  },
  fileFilter,
});

export const uploadToCloudinary = (fileBuffer, folder, originalFilename) => {
  return new Promise((resolve, reject) => {
    // If Cloudinary is configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `kpn_promoters/${folder}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(fileBuffer);
    } else {
      // Local disk fallback
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const cleanName = originalFilename.replace(/\s+/g, '_');
      const filename = `${uniqueSuffix}-${cleanName}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFile(filePath, fileBuffer, (err) => {
        if (err) return reject(err);
        // Serve locally via express static /uploads
        resolve({
          url: `/uploads/${filename}`,
          publicId: filename,
        });
      });
    }
  });
};

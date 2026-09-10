import { uploadToCloudinary } from '../middlewares/upload.js';

export const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach a file to upload' });
    }

    const folder = req.body.folder || 'general';
    const result = await uploadToCloudinary(req.file.buffer, folder, req.file.originalname);

    res.status(200).json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    next(error);
  }
};

export const handleMultipleFileUpload = async (req, res, next) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please attach at least one file to upload' });
    }

    const folder = req.body.folder || 'general';
    const uploaded = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer, folder, file.originalname))
    );

    res.status(200).json({
      success: true,
      count: uploaded.length,
      files: uploaded,
      urls: uploaded.map((u) => u.url),
    });
  } catch (error) {
    next(error);
  }
};

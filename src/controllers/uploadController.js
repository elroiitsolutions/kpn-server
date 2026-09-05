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

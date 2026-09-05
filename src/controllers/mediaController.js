import MediaItem from '../models/MediaItem.js';

export const getMedia = async (req, res, next) => {
  try {
    const { type, category } = req.query;
    const query = { status: 'Published' };

    if (type && type !== 'All') query.mediaType = type;
    if (category && category !== 'All') query.category = category;

    const media = await MediaItem.find(query).sort({ publishedDate: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: media.length, data: media });
  } catch (error) {
    next(error);
  }
};

export const createMedia = async (req, res, next) => {
  try {
    const media = await MediaItem.create(req.body);
    res.status(201).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const media = await MediaItem.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: 'Media not found' });
    res.status(200).json({ success: true, message: 'Media deleted' });
  } catch (error) {
    next(error);
  }
};

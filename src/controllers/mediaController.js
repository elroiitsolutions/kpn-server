import MediaItem from '../models/MediaItem.js';

export const getMedia = async (req, res, next) => {
  try {
    const { type, category } = req.query;
    const where = {};

    if (!req.headers.authorization && req.query.all !== 'true') {
      where.status = 'Published';
    }

    if (type && type !== 'All') where.mediaType = type;
    if (category && category !== 'All') where.category = category;

    const media = await MediaItem.findAll({
      where,
      order: [
        ['publishedDate', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });

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
    const media = await MediaItem.findByPk(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: 'Media not found' });
    await media.destroy();
    res.status(200).json({ success: true, message: 'Media deleted' });
  } catch (error) {
    next(error);
  }
};

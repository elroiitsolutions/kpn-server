import VideoItem from '../models/VideoItem.js';

export const getVideos = async (req, res, next) => {
  try {
    const { project } = req.query;
    const where = {};

    if (!req.headers.authorization && req.query.all !== 'true') {
      where.status = 'Published';
    }

    if (project) where.projectId = project;

    const videos = await VideoItem.findAll({
      where,
      order: [
        ['order', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });

    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    next(error);
  }
};

export const createVideo = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      projectId: req.body.project || req.body.projectId,
    };
    const video = await VideoItem.create(payload);
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await VideoItem.findByPk(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    const payload = {
      ...req.body,
    };
    if (req.body.project !== undefined) payload.projectId = req.body.project;
    await video.update(payload);
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await VideoItem.findByPk(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    await video.destroy();
    res.status(200).json({ success: true, message: 'Video deleted' });
  } catch (error) {
    next(error);
  }
};

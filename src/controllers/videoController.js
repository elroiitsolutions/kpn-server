import VideoItem from '../models/VideoItem.js';

export const getVideos = async (req, res, next) => {
  try {
    const { project } = req.query;
    const query = { status: 'Published' };
    if (project) query.project = project;

    const videos = await VideoItem.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    next(error);
  }
};

export const createVideo = async (req, res, next) => {
  try {
    const video = await VideoItem.create(req.body);
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await VideoItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await VideoItem.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.status(200).json({ success: true, message: 'Video deleted' });
  } catch (error) {
    next(error);
  }
};

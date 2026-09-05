import Celebration from '../models/Celebration.js';

/**
 * @desc Get all published celebrations (Public)
 * @route GET /api/celebrations
 */
export const getCelebrations = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { status: 'Published' };
    if (category && category !== 'All') {
      query.category = category;
    }

    const celebrations = await Celebration.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: celebrations.length,
      data: celebrations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all celebrations including drafts (Admin)
 * @route GET /api/celebrations/admin/all
 */
export const getAdminCelebrations = async (req, res, next) => {
  try {
    const celebrations = await Celebration.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: celebrations.length,
      data: celebrations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new celebration (Admin)
 * @route POST /api/celebrations
 */
export const createCelebration = async (req, res, next) => {
  try {
    const celebration = await Celebration.create(req.body);
    res.status(201).json({
      success: true,
      data: celebration,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update celebration (Admin)
 * @route PUT /api/celebrations/:id
 */
export const updateCelebration = async (req, res, next) => {
  try {
    const celebration = await Celebration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!celebration) {
      return res.status(404).json({ success: false, message: 'Celebration not found' });
    }
    res.status(200).json({
      success: true,
      data: celebration,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete celebration (Admin)
 * @route DELETE /api/celebrations/:id
 */
export const deleteCelebration = async (req, res, next) => {
  try {
    const celebration = await Celebration.findByIdAndDelete(req.params.id);
    if (!celebration) {
      return res.status(404).json({ success: false, message: 'Celebration not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Celebration deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

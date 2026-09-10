import Celebration from '../models/Celebration.js';

export const getCelebrations = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = { status: 'Published' };
    if (category && category !== 'All') {
      where.category = category;
    }

    const celebrations = await Celebration.findAll({
      where,
      order: [
        ['order', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });

    res.status(200).json({
      success: true,
      count: celebrations.length,
      data: celebrations,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCelebrations = async (req, res, next) => {
  try {
    const celebrations = await Celebration.findAll({
      order: [
        ['order', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });

    res.status(200).json({
      success: true,
      count: celebrations.length,
      data: celebrations,
    });
  } catch (error) {
    next(error);
  }
};

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

export const updateCelebration = async (req, res, next) => {
  try {
    const celebration = await Celebration.findByPk(req.params.id);
    if (!celebration) {
      return res.status(404).json({ success: false, message: 'Celebration not found' });
    }

    await celebration.update(req.body);

    res.status(200).json({
      success: true,
      data: celebration,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCelebration = async (req, res, next) => {
  try {
    const celebration = await Celebration.findByPk(req.params.id);
    if (!celebration) {
      return res.status(404).json({ success: false, message: 'Celebration not found' });
    }

    await celebration.destroy();

    res.status(200).json({
      success: true,
      message: 'Celebration deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

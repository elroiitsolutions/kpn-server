import Award from '../models/Award.js';

export const getAwards = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status && req.query.status !== 'All') {
      where.status = req.query.status;
    } else if (!req.headers.authorization && req.query.all !== 'true') {
      where.status = 'Published';
    }

    const awards = await Award.findAll({
      where,
      order: [
        ['order', 'ASC'],
        ['year', 'DESC'],
      ],
    });

    res.status(200).json({
      success: true,
      count: awards.length,
      data: awards,
    });
  } catch (error) {
    next(error);
  }
};

export const createAward = async (req, res, next) => {
  try {
    const award = await Award.create(req.body);
    res.status(201).json({ success: true, data: award });
  } catch (error) {
    next(error);
  }
};

export const updateAward = async (req, res, next) => {
  try {
    const award = await Award.findByPk(req.params.id);
    if (!award) return res.status(404).json({ success: false, message: 'Award not found' });
    await award.update(req.body);
    res.status(200).json({ success: true, data: award });
  } catch (error) {
    next(error);
  }
};

export const deleteAward = async (req, res, next) => {
  try {
    const award = await Award.findByPk(req.params.id);
    if (!award) return res.status(404).json({ success: false, message: 'Award not found' });
    await award.destroy();
    res.status(200).json({ success: true, message: 'Award deleted' });
  } catch (error) {
    next(error);
  }
};

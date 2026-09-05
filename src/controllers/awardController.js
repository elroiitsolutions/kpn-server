import Award from '../models/Award.js';

export const getAwards = async (req, res, next) => {
  try {
    const awards = await Award.find({ status: 'Published' }).sort({ order: 1, year: -1 });
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
    const award = await Award.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!award) return res.status(404).json({ success: false, message: 'Award not found' });
    res.status(200).json({ success: true, data: award });
  } catch (error) {
    next(error);
  }
};

export const deleteAward = async (req, res, next) => {
  try {
    const award = await Award.findByIdAndDelete(req.params.id);
    if (!award) return res.status(404).json({ success: false, message: 'Award not found' });
    res.status(200).json({ success: true, message: 'Award deleted' });
  } catch (error) {
    next(error);
  }
};

import Referral from '../models/Referral.js';

export const getReferrals = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { referrerName: new RegExp(String(search), 'i') },
        { referrerPhone: new RegExp(String(search), 'i') },
        { referredName: new RegExp(String(search), 'i') },
        { referredPhone: new RegExp(String(search), 'i') },
      ];
    }

    const referrals = await Referral.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: referrals.length, data: referrals });
  } catch (error) {
    next(error);
  }
};

export const createReferral = async (req, res, next) => {
  try {
    const referral = await Referral.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Referral submitted successfully! Our team will contact your friend.',
      data: referral,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReferral = async (req, res, next) => {
  try {
    const referral = await Referral.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });
    res.status(200).json({ success: true, data: referral });
  } catch (error) {
    next(error);
  }
};

export const deleteReferral = async (req, res, next) => {
  try {
    const referral = await Referral.findByIdAndDelete(req.params.id);
    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });
    res.status(200).json({ success: true, message: 'Referral deleted' });
  } catch (error) {
    next(error);
  }
};

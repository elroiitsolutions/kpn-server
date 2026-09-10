import { Op } from 'sequelize';
import Referral from '../models/Referral.js';

export const getReferrals = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status && status !== 'All') where.status = status;
    if (search) {
      where[Op.or] = [
        { referrerName: { [Op.like]: `%${String(search).trim()}%` } },
        { referrerPhone: { [Op.like]: `%${String(search).trim()}%` } },
        { referredName: { [Op.like]: `%${String(search).trim()}%` } },
        { referredPhone: { [Op.like]: `%${String(search).trim()}%` } },
      ];
    }

    const referrals = await Referral.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ success: true, count: referrals.length, data: referrals });
  } catch (error) {
    next(error);
  }
};

export const createReferral = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      projectId: req.body.project || req.body.projectId,
    };
    const referral = await Referral.create(payload);
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
    const referral = await Referral.findByPk(req.params.id);
    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });
    await referral.update(req.body);
    res.status(200).json({ success: true, data: referral });
  } catch (error) {
    next(error);
  }
};

export const deleteReferral = async (req, res, next) => {
  try {
    const referral = await Referral.findByPk(req.params.id);
    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });
    await referral.destroy();
    res.status(200).json({ success: true, message: 'Referral deleted' });
  } catch (error) {
    next(error);
  }
};

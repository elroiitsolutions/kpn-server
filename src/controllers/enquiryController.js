import Enquiry from '../models/Enquiry.js';
import { notificationService } from '../services/notificationService.js';

export const getEnquiries = async (req, res, next) => {
  try {
    const { status, project, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (project) {
      query.project = project;
    }

    if (search) {
      query.$or = [
        { name: new RegExp(String(search), 'i') },
        { phone: new RegExp(String(search), 'i') },
        { email: new RegExp(String(search), 'i') },
        { projectName: new RegExp(String(search), 'i') },
      ];
    }

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Enquiry.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: enquiries.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const createEnquiry = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required to submit an enquiry.',
      });
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required to submit an enquiry.',
      });
    }

    const enquiry = await Enquiry.create(req.body);

    // Fire non-blocking asynchronous notifications
    notificationService.dispatchAll(enquiry).catch((err) => {
      console.warn('[Notification Error]:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our sales team will contact you shortly.',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, assignedStaff } = req.body;
    const updatePayload = {};

    if (status) updatePayload.status = status;
    if (assignedStaff) updatePayload.assignedStaff = assignedStaff;

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const addEnquiryNote = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Note text cannot be empty' });
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    enquiry.notes.push({
      author: req.user ? req.user.name : 'Staff Advisor',
      text,
      createdAt: new Date(),
    });

    await enquiry.save();

    res.status(200).json({
      success: true,
      data: enquiry.notes,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry record deleted',
    });
  } catch (error) {
    next(error);
  }
};

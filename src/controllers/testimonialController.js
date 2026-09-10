import Testimonial from '../models/Testimonial.js';

export const getTestimonials = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status && req.query.status !== 'All') {
      where.status = req.query.status;
    } else if (!req.headers.authorization && req.query.all !== 'true') {
      where.status = 'Published';
    }

    const testimonials = await Testimonial.findAll({
      where,
      order: [
        ['order', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });

    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    await testimonial.update(req.body);
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    await testimonial.destroy();
    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};

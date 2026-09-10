import { Op } from 'sequelize';
import { sequelize } from '../config/db.js';
import Blog from '../models/Blog.js';

export const getBlogs = async (req, res, next) => {
  try {
    const { category, search, includeDrafts, sort = 'newest', page = 1, limit = 20 } = req.query;
    const where = {};

    if (includeDrafts !== 'true') {
      where.status = 'Published';
    }

    if (category && category !== 'All Posts') {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${String(search).trim()}%` } },
        { shortDescription: { [Op.like]: `%${String(search).trim()}%` } },
        { content: { [Op.like]: `%${String(search).trim()}%` } },
      ];
    }

    const order =
      sort === 'newest'
        ? [['publishedDate', 'DESC'], ['createdAt', 'DESC']]
        : [['viewCount', 'DESC'], ['createdAt', 'DESC']];

    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 20;
    const offset = (pageNum - 1) * limitNum;

    const { rows: blogs, count: total } = await Blog.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset,
    });

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let blog = await Blog.findByPk(slug);

    if (!blog) {
      blog = await Blog.findOne({
        where: { slug },
      });
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Increment view count
    blog.viewCount = (blog.viewCount || 0) + 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const blog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    await blog.update(req.body);

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    await blog.destroy();

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogCategories = async (req, res, next) => {
  try {
    const categoriesRaw = await Blog.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      where: { status: 'Published' },
      raw: true,
    });
    const categories = categoriesRaw.map((c) => c.category).filter(Boolean);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

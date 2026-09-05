import mongoose from 'mongoose';
import Blog from '../models/Blog.js';

export const getBlogs = async (req, res, next) => {
  try {
    const { category, search, includeDrafts, sort = 'newest', page = 1, limit = 20 } = req.query;
    const query = {};

    if (includeDrafts !== 'true') {
      query.status = 'Published';
    }

    if (category && category !== 'All Posts') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: new RegExp(String(search), 'i') },
        { shortDescription: new RegExp(String(search), 'i') },
        { content: new RegExp(String(search), 'i') },
      ];
    }

    const sortOption = sort === 'newest' ? { publishedDate: -1, createdAt: -1 } : { viewCount: -1 };
    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Blog.countDocuments(query),
    ]);

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
    let blog = null;

    if (mongoose.Types.ObjectId.isValid(slug)) {
      blog = await Blog.findById(slug);
    }

    if (!blog) {
      blog = await Blog.findOne({ slug: new RegExp(`^${String(slug)}$`, 'i') });
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Increment view count
    blog.viewCount = (blog.viewCount || 0) + 1;
    await blog.save({ validateBeforeSave: false });

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
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

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
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

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
    const categories = await Blog.distinct('category', { status: 'Published' });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

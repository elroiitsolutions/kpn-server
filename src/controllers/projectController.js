import mongoose from 'mongoose';
import Project from '../models/Project.js';
import ProjectUnit from '../models/ProjectUnit.js';

export const getProjects = async (req, res, next) => {
  try {
    const {
      type,
      status,
      city,
      search,
      featured,
      includeUnpublished,
      sort,
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    if (includeUnpublished !== 'true') {
      query.isPublished = true;
    }

    if (type && type !== 'All') {
      query.propertyType = type;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (city) {
      query.city = new RegExp(String(city), 'i');
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { name: new RegExp(String(search), 'i') },
        { location: new RegExp(String(search), 'i') },
        { bhk: new RegExp(String(search), 'i') },
      ];
    }

    let sortOption = { order: 1, createdAt: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'name') sortOption = { name: 1 };

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
      Project.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Project.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlugOrId = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let project = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      project = await Project.findById(identifier);
    }

    if (!project) {
      project = await Project.findOne({
        slug: new RegExp(`^${String(identifier)}$`, 'i'),
      });
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const togglePublishProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.isPublished = !project.isPublished;
    await project.save();

    res.status(200).json({
      success: true,
      isPublished: project.isPublished,
      message: `Project ${project.isPublished ? 'published' : 'unpublished'} successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Also cascade delete units associated with project
    await ProjectUnit.deleteMany({ project: project._id });

    res.status(200).json({
      success: true,
      message: 'Project and all associated unit records deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Unit Availability Endpoints
export const getProjectUnits = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    let pId = projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      const proj = await Project.findOne({ slug: projectId });
      if (proj) pId = proj._id;
    }

    const units = await ProjectUnit.find({ project: pId }).sort({ block: 1, floor: 1, unitNumber: 1 });

    res.status(200).json({
      success: true,
      count: units.length,
      data: units,
    });
  } catch (error) {
    next(error);
  }
};

export const createProjectUnit = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const unit = await ProjectUnit.create({
      ...req.body,
      project: projectId,
    });

    res.status(201).json({
      success: true,
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProjectUnit = async (req, res, next) => {
  try {
    const unit = await ProjectUnit.findByIdAndUpdate(req.params.unitId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    res.status(200).json({
      success: true,
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProjectUnit = async (req, res, next) => {
  try {
    const unit = await ProjectUnit.findByIdAndDelete(req.params.unitId);
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Unit deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

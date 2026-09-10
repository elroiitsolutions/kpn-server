import { Op } from 'sequelize';
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

    const where = {};

    if (includeUnpublished !== 'true') {
      where.isPublished = true;
    }

    if (type && type !== 'All') {
      where.propertyType = type;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    if (city) {
      where.city = { [Op.like]: `%${String(city).trim()}%` };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${String(search).trim()}%` } },
        { location: { [Op.like]: `%${String(search).trim()}%` } },
        { bhk: { [Op.like]: `%${String(search).trim()}%` } },
      ];
    }

    let order = [['order', 'ASC'], ['createdAt', 'DESC']];
    if (sort === 'newest') order = [['createdAt', 'DESC']];
    if (sort === 'oldest') order = [['createdAt', 'ASC']];
    if (sort === 'name') order = [['name', 'ASC']];

    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 50;
    const offset = (pageNum - 1) * limitNum;

    const { rows: projects, count: total } = await Project.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset,
    });

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
    let project = await Project.findByPk(identifier);

    if (!project) {
      project = await Project.findOne({
        where: { slug: identifier },
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

const syncInventoryCounts = (body) => {
  if (Array.isArray(body.blocks) && body.blocks.length > 0) {
    body.totalBlocks = body.blocks.length;
    body.totalFloors = Math.max(
      ...body.blocks.map((b) => b.totalFloors || (Array.isArray(b.floors) ? b.floors.length : 1)),
      1
    );

    const allUnits = [];
    body.blocks.forEach((b) => {
      (b.floors || []).forEach((f) => {
        (f.units || []).forEach((u) => allUnits.push(u));
      });
    });

    if (allUnits.length > 0) {
      body.totalUnits = allUnits.length;
      body.availableUnits = allUnits.filter((u) => u.status === 'available' || !u.status).length;
      body.bookedUnits = allUnits.filter((u) => u.status === 'booked').length;
      body.soldUnits = allUnits.filter((u) => u.status === 'sold').length;
      body.blockedUnits = allUnits.filter((u) => u.status === 'blocked').length;
    }
  } else if (Array.isArray(body.plots) && body.plots.length > 0) {
    body.totalUnits = body.plots.length;
    body.availableUnits = body.plots.filter((p) => p.status === 'available' || !p.status).length;
    body.bookedUnits = body.plots.filter((p) => p.status === 'booked').length;
    body.soldUnits = body.plots.filter((p) => p.status === 'sold').length;
    body.blockedUnits = body.plots.filter((p) => p.status === 'blocked').length;
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

    syncInventoryCounts(req.body);

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
    let project = await Project.findByPk(req.params.id);
    if (!project) {
      project = await Project.findOne({ where: { slug: req.params.id } });
    }
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { version: incomingVersion, ...bodyData } = req.body;
    syncInventoryCounts(bodyData);

    // Optimistic Concurrency Check:
    // If incomingVersion is provided, verify it matches current database version
    if (incomingVersion !== undefined && incomingVersion !== null) {
      const currentVersion = Number(project.version || 1);
      const expectedVersion = Number(incomingVersion);

      if (expectedVersion !== currentVersion) {
        return res.status(409).json({
          success: false,
          code: 'VERSION_CONFLICT',
          message:
            'Conflict: This project has been updated by another user or in another session. Please reload to review the latest changes before saving.',
          currentVersion,
          submittedVersion: expectedVersion,
        });
      }

      // Increment version on update
      bodyData.version = currentVersion + 1;
    } else {
      bodyData.version = (project.version || 1) + 1;
    }

    await project.update(bodyData);

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
    let project = await Project.findByPk(req.params.id);
    if (!project) {
      project = await Project.findOne({ where: { slug: req.params.id } });
    }
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
    let project = await Project.findByPk(req.params.id);
    if (!project) {
      project = await Project.findOne({ where: { slug: req.params.id } });
    }
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Cascade deletes units associated with project
    await ProjectUnit.destroy({ where: { projectId: project.id } });
    await project.destroy();

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

    const proj = await Project.findOne({
      where: {
        [Op.or]: [{ id: projectId }, { slug: projectId }],
      },
    });

    if (proj) pId = proj.id;

    const units = await ProjectUnit.findAll({
      where: { projectId: pId },
      order: [
        ['block', 'ASC'],
        ['floor', 'ASC'],
        ['unitNumber', 'ASC'],
      ],
    });

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
      projectId,
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
    const unit = await ProjectUnit.findByPk(req.params.unitId);
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    await unit.update(req.body);

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
    const unit = await ProjectUnit.findByPk(req.params.unitId);
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    await unit.destroy();

    res.status(200).json({
      success: true,
      message: 'Unit deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

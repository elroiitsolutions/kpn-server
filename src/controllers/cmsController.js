import HomepageCMS from '../models/HomepageCMS.js';
import MenuCMS from '../models/MenuCMS.js';
import FooterCMS from '../models/FooterCMS.js';
import Project from '../models/Project.js';

export const getHomepageCMS = async (req, res, next) => {
  try {
    let cms = await HomepageCMS.findOne();
    if (!cms) cms = await HomepageCMS.create({ id: 'homepage_default' });

    const data = cms.toJSON();
    if (Array.isArray(data.featuredProjectIds) && data.featuredProjectIds.length > 0) {
      // Extract string IDs if they are objects or strings
      const ids = data.featuredProjectIds.map((p) => (typeof p === 'object' && p ? p.id || p._id : p)).filter(Boolean);
      if (ids.length > 0) {
        const projects = await Project.findAll({ where: { id: ids } });
        data.featuredProjectIds = projects;
      }
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateHomepageCMS = async (req, res, next) => {
  try {
    let cms = await HomepageCMS.findOne();
    if (!cms) {
      cms = await HomepageCMS.create({ id: 'homepage_default', ...req.body });
    } else {
      await cms.update(req.body);
    }
    res.status(200).json({ success: true, data: cms });
  } catch (error) {
    next(error);
  }
};

export const getMenuCMS = async (req, res, next) => {
  try {
    let menu = await MenuCMS.findOne({ where: { name: 'main_menu' } });
    if (!menu) menu = await MenuCMS.create({ name: 'main_menu' });
    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
};

export const updateMenuCMS = async (req, res, next) => {
  try {
    let menu = await MenuCMS.findOne({ where: { name: 'main_menu' } });
    if (!menu) {
      menu = await MenuCMS.create({ name: 'main_menu', items: req.body.items });
    } else {
      menu.items = req.body.items;
      await menu.save();
    }
    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
};

export const getFooterCMS = async (req, res, next) => {
  try {
    let footer = await FooterCMS.findOne({ where: { name: 'main_footer' } });
    if (!footer) footer = await FooterCMS.create({ name: 'main_footer' });
    res.status(200).json({ success: true, data: footer });
  } catch (error) {
    next(error);
  }
};

export const updateFooterCMS = async (req, res, next) => {
  try {
    let footer = await FooterCMS.findOne({ where: { name: 'main_footer' } });
    if (!footer) {
      footer = await FooterCMS.create({ name: 'main_footer', ...req.body });
    } else {
      await footer.update(req.body);
    }
    res.status(200).json({ success: true, data: footer });
  } catch (error) {
    next(error);
  }
};

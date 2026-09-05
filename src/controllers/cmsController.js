import HomepageCMS from '../models/HomepageCMS.js';
import MenuCMS from '../models/MenuCMS.js';
import FooterCMS from '../models/FooterCMS.js';

export const getHomepageCMS = async (req, res, next) => {
  try {
    let cms = await HomepageCMS.findOne().populate('featuredProjectIds');
    if (!cms) cms = await HomepageCMS.create({});
    res.status(200).json({ success: true, data: cms });
  } catch (error) {
    next(error);
  }
};

export const updateHomepageCMS = async (req, res, next) => {
  try {
    let cms = await HomepageCMS.findOne();
    if (!cms) {
      cms = await HomepageCMS.create(req.body);
    } else {
      Object.assign(cms, req.body);
      await cms.save();
    }
    res.status(200).json({ success: true, data: cms });
  } catch (error) {
    next(error);
  }
};

export const getMenuCMS = async (req, res, next) => {
  try {
    let menu = await MenuCMS.findOne({ name: 'main_menu' });
    if (!menu) menu = await MenuCMS.create({ name: 'main_menu' });
    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
};

export const updateMenuCMS = async (req, res, next) => {
  try {
    let menu = await MenuCMS.findOne({ name: 'main_menu' });
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
    let footer = await FooterCMS.findOne({ name: 'main_footer' });
    if (!footer) footer = await FooterCMS.create({ name: 'main_footer' });
    res.status(200).json({ success: true, data: footer });
  } catch (error) {
    next(error);
  }
};

export const updateFooterCMS = async (req, res, next) => {
  try {
    let footer = await FooterCMS.findOne({ name: 'main_footer' });
    if (!footer) {
      footer = await FooterCMS.create({ name: 'main_footer', ...req.body });
    } else {
      Object.assign(footer, req.body);
      await footer.save();
    }
    res.status(200).json({ success: true, data: footer });
  } catch (error) {
    next(error);
  }
};

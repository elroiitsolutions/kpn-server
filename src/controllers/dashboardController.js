import Project from '../models/Project.js';
import Enquiry from '../models/Enquiry.js';
import Blog from '../models/Blog.js';
import Referral from '../models/Referral.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      totalEnquiries,
      newEnquiries,
      totalBlogs,
      publishedBlogs,
      totalReferrals,
      recentEnquiries,
      recentProjects,
      recentBlogs,
    ] = await Promise.all([
      Project.count(),
      Project.count({ where: { isPublished: true } }),
      Project.count({ where: { isPublished: false } }),
      Enquiry.count(),
      Enquiry.count({ where: { status: 'New' } }),
      Blog.count(),
      Blog.count({ where: { status: 'Published' } }),
      Referral.count(),
      Enquiry.findAll({ order: [['createdAt', 'DESC']], limit: 5 }),
      Project.findAll({
        attributes: ['id', 'name', 'slug', 'propertyType', 'status', 'budget', 'image', 'isPublished'],
        order: [['createdAt', 'DESC']],
        limit: 4,
      }),
      Blog.findAll({
        attributes: ['id', 'title', 'slug', 'category', 'status', 'publishedDate', 'featuredImage'],
        order: [['createdAt', 'DESC']],
        limit: 4,
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        publishedProjects,
        draftProjects,
        totalEnquiries,
        newEnquiries,
        totalBlogs,
        publishedBlogs,
        totalReferrals,
      },
      recentEnquiries,
      recentProjects,
      recentBlogs,
    });
  } catch (error) {
    next(error);
  }
};

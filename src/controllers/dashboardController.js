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
      Project.countDocuments(),
      Project.countDocuments({ isPublished: true }),
      Project.countDocuments({ isPublished: false }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'New' }),
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'Published' }),
      Referral.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      Project.find().sort({ createdAt: -1 }).limit(4).select('name slug propertyType status budget image isPublished'),
      Blog.find().sort({ createdAt: -1 }).limit(4).select('title slug category status publishedDate featuredImage'),
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

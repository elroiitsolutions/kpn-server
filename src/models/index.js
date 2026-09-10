import { sequelize } from '../config/db.js';
import User from './User.js';
import Project from './Project.js';
import ProjectUnit from './ProjectUnit.js';
import Blog from './Blog.js';
import Enquiry from './Enquiry.js';
import Referral from './Referral.js';
import Testimonial from './Testimonial.js';
import Celebration from './Celebration.js';
import Award from './Award.js';
import MediaItem from './MediaItem.js';
import VideoItem from './VideoItem.js';
import HomepageCMS from './HomepageCMS.js';
import MenuCMS from './MenuCMS.js';
import FooterCMS from './FooterCMS.js';
import EmailJob from './EmailJob.js';

// Associations
Project.hasMany(ProjectUnit, { foreignKey: 'projectId', as: 'units', onDelete: 'CASCADE' });
ProjectUnit.belongsTo(Project, { foreignKey: 'projectId', as: 'projectDetail' });

Project.hasMany(Enquiry, { foreignKey: 'projectId', as: 'enquiries' });
Enquiry.belongsTo(Project, { foreignKey: 'projectId', as: 'projectDetail' });

Project.hasMany(Referral, { foreignKey: 'projectId', as: 'referrals' });
Referral.belongsTo(Project, { foreignKey: 'projectId', as: 'projectDetail' });

Project.hasMany(VideoItem, { foreignKey: 'projectId', as: 'videos' });
VideoItem.belongsTo(Project, { foreignKey: 'projectId', as: 'projectDetail' });

export {
  sequelize,
  User,
  Project,
  ProjectUnit,
  Blog,
  Enquiry,
  Referral,
  Testimonial,
  Celebration,
  Award,
  MediaItem,
  VideoItem,
  HomepageCMS,
  MenuCMS,
  FooterCMS,
  EmailJob,
};


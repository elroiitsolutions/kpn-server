import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const HomepageCMS = sequelize.define(
  'HomepageCMS',
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      defaultValue: 'homepage_default',
    },
    hero: {
      type: DataTypes.JSON,
      defaultValue: {
        heading: 'Crafting Landmarks. Creating Legacies.',
        subheading: 'Discover Chennai’s finest apartments and DTCP-approved township plots.',
        buttonText: 'Explore Our Projects',
        buttonUrl: '/projects',
        videoUrl: '/images/videos/hero-bg.mp4',
        mobileImageUrl: '/images/projects/project_1.jpg',
      },
    },
    about: {
      type: DataTypes.JSON,
      defaultValue: {
        tagline: 'OVER 25 YEARS OF EXCELLENCE',
        heading: 'Building Trust Across Tamil Nadu Since 1999',
        description: 'KPN Promoters is Chennai’s leading real estate developer.',
        yearsExperience: 25,
        happyFamilies: 10000,
        acresDeveloped: 500,
      },
    },
    featuredProjectIds: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    cta: {
      type: DataTypes.JSON,
      defaultValue: {
        title: 'Ready to Find Your Dream Property?',
        description: 'Speak directly with our senior real estate consultants today.',
        buttonText: 'Contact Us Now',
        buttonUrl: '/contact-us',
      },
    },
  },
  {
    tableName: 'homepage_cms',
    timestamps: true,
  }
);

const safeParseJson = (val, fallback) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val !== undefined && val !== null ? val : fallback;
};

HomepageCMS.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  values.hero = safeParseJson(values.hero, {});
  values.about = safeParseJson(values.about, {});
  values.featuredProjectIds = safeParseJson(values.featuredProjectIds, []);
  values.cta = safeParseJson(values.cta, {});
  return values;
};

export default HomepageCMS;

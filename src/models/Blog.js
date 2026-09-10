import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Blog = sequelize.define(
  'Blog',
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    author: {
      type: DataTypes.STRING(100),
      defaultValue: 'KPN Editorial Team',
    },
    featuredImage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    bannerImage: {
      type: DataTypes.TEXT,
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      defaultValue: 'General',
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    galleryImages: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    quoteText: {
      type: DataTypes.TEXT,
    },
    quoteAuthor: {
      type: DataTypes.STRING(100),
      defaultValue: 'John Doe',
    },
    seoTitle: {
      type: DataTypes.STRING(255),
    },
    seoDescription: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Published', 'Archived'),
      defaultValue: 'Draft',
    },
    publishedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'blogs',
    timestamps: true,
    indexes: [
      { fields: ['category'] },
      { fields: ['status'] },
      { fields: ['slug'] },
    ],
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

Blog.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  values.tags = safeParseJson(values.tags, []);
  values.galleryImages = safeParseJson(values.galleryImages, []);
  return values;
};

export default Blog;

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Celebration = sequelize.define(
  'Celebration',
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
    subheading: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gallery: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    date: {
      type: DataTypes.STRING(50),
      defaultValue: '',
    },
    year: {
      type: DataTypes.STRING(20),
      defaultValue: '2025',
    },
    category: {
      type: DataTypes.ENUM('Trip', 'Office', 'Launch', 'Festival', 'Milestone', 'General'),
      defaultValue: 'General',
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Published'),
      defaultValue: 'Published',
    },
  },
  {
    tableName: 'celebrations',
    timestamps: true,
    indexes: [
      { fields: ['status', 'order'] },
      { fields: ['category'] },
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

Celebration.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  values.gallery = safeParseJson(values.gallery, []);
  return values;
};

export default Celebration;

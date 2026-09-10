import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const MediaItem = sequelize.define(
  'MediaItem',
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
    description: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    category: {
      type: DataTypes.STRING(100),
      defaultValue: 'General',
    },
    mediaType: {
      type: DataTypes.ENUM('image', 'video', 'news', 'press', 'event'),
      defaultValue: 'image',
    },
    fileUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    publishedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Published'),
      defaultValue: 'Published',
    },
  },
  {
    tableName: 'media_items',
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['mediaType'] },
    ],
  }
);

MediaItem.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  return values;
};

export default MediaItem;

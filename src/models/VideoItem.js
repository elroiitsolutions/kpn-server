import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const VideoItem = sequelize.define(
  'VideoItem',
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
    projectId: {
      type: DataTypes.STRING(64),
    },
    projectName: {
      type: DataTypes.STRING(150),
      defaultValue: '',
    },
    videoUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    videoType: {
      type: DataTypes.ENUM('YouTube', 'Vimeo', 'Cloudinary', 'External'),
      defaultValue: 'YouTube',
    },
    thumbnailUrl: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: '',
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
    tableName: 'video_items',
    timestamps: true,
    indexes: [
      { fields: ['status', 'order'] },
      { fields: ['projectId'] },
    ],
  }
);

VideoItem.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  values.project = values.projectId;
  return values;
};

export default VideoItem;

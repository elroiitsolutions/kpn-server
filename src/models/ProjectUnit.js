import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const ProjectUnit = sequelize.define(
  'ProjectUnit',
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    projectId: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    block: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    floor: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    unitNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      defaultValue: '2 BHK',
    },
    sizeSqFt: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    facing: {
      type: DataTypes.STRING(50),
      defaultValue: 'North',
    },
    price: {
      type: DataTypes.DOUBLE,
    },
    status: {
      type: DataTypes.ENUM('Available', 'Reserved', 'Sold', 'Blocked'),
      defaultValue: 'Available',
    },
    remarks: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
  },
  {
    tableName: 'project_units',
    timestamps: true,
    indexes: [
      { fields: ['projectId'] },
      { unique: true, fields: ['projectId', 'block', 'floor', 'unitNumber'] },
    ],
  }
);

ProjectUnit.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  values.project = values.projectId;
  return values;
};

export default ProjectUnit;

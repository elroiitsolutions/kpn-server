import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Enquiry = sequelize.define(
  'Enquiry',
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(180),
      defaultValue: '',
    },
    phone: {
      type: DataTypes.STRING(50),
      defaultValue: '',
    },
    projectId: {
      type: DataTypes.STRING(64),
    },
    projectName: {
      type: DataTypes.STRING(150),
      defaultValue: '',
    },
    block: {
      type: DataTypes.STRING(100),
      defaultValue: '',
    },
    floor: {
      type: DataTypes.STRING(100),
      defaultValue: '',
    },
    unitNumber: {
      type: DataTypes.STRING(100),
      defaultValue: '',
    },
    unitType: {
      type: DataTypes.STRING(100),
      defaultValue: '',
    },
    message: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    source: {
      type: DataTypes.STRING(50),
      defaultValue: 'Contact Page',
    },
    status: {
      type: DataTypes.ENUM('New', 'Contacted', 'Site Visit', 'Interested', 'Negotiation', 'Booked', 'Closed', 'Waitlisted', 'Sold'),
      defaultValue: 'New',
    },
    assignedStaff: {
      type: DataTypes.STRING(100),
      defaultValue: '',
    },
    notes: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    tableName: 'enquiries',
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['projectId'] },
      { fields: ['unitNumber'] },
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

Enquiry.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  values.project = values.projectId;
  values.notes = safeParseJson(values.notes, []);
  return values;
};

export default Enquiry;

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const EmailJob = sequelize.define(
  'EmailJob',
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    recipient: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    recipientType: {
      type: DataTypes.ENUM('customer', 'admin'),
      defaultValue: 'customer',
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    htmlContent: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PROCESSING', 'SENT', 'FAILED'),
      defaultValue: 'PENDING',
    },
    retries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    maxRetries: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
    lastError: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  },
  {
    tableName: 'email_jobs',
    timestamps: true,
    indexes: [
      { fields: ['status', 'retries'] },
      { fields: ['createdAt'] },
    ],
  }
);

EmailJob.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  return values;
};

export default EmailJob;

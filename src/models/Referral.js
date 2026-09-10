import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Referral = sequelize.define(
  'Referral',
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    referrerName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    referrerPhone: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    referrerEmail: {
      type: DataTypes.STRING(180),
    },
    referredName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    referredPhone: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    referredEmail: {
      type: DataTypes.STRING(180),
    },
    projectId: {
      type: DataTypes.STRING(64),
    },
    projectName: {
      type: DataTypes.STRING(150),
      defaultValue: '',
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'Referral Submitted',
    },
    rewardStatus: {
      type: DataTypes.STRING(50),
      defaultValue: 'Pending',
    },
    notes: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
  },
  {
    tableName: 'referrals',
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['rewardStatus'] },
    ],
  }
);

Referral.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  values.project = values.projectId;
  return values;
};

export default Referral;

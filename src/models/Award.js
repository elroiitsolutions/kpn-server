import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Award = sequelize.define(
  'Award',
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
    organization: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING(20),
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
    tableName: 'awards',
    timestamps: true,
    indexes: [
      { fields: ['status', 'order'] },
    ],
  }
);

Award.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  return values;
};

export default Award;

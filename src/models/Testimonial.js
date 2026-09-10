import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Testimonial = sequelize.define(
  'Testimonial',
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
    author: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(100),
      defaultValue: 'Homeowner',
    },
    avatar: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    quote: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
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
    tableName: 'testimonials',
    timestamps: true,
    indexes: [
      { fields: ['status', 'order'] },
    ],
  }
);

Testimonial.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  return values;
};

export default Testimonial;

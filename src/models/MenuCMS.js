import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const MenuCMS = sequelize.define(
  'MenuCMS',
  {
    name: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      defaultValue: 'main_menu',
    },
    items: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    tableName: 'menu_cms',
    timestamps: true,
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

MenuCMS.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.name;
  values.items = safeParseJson(values.items, []);
  return values;
};

export default MenuCMS;

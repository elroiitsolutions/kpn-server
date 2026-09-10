import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const FooterCMS = sequelize.define(
  'FooterCMS',
  {
    name: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      defaultValue: 'main_footer',
    },
    companyDescription: {
      type: DataTypes.TEXT,
      defaultValue: 'KPN Promoters has earned the trust of over 10,000 satisfied families across Chennai and Tamil Nadu.',
    },
    address: {
      type: DataTypes.TEXT,
      defaultValue: 'No: 17, 1st Cross Street, Sri Devi Nagar, Alapakkam, Chennai - 600116',
    },
    phone: {
      type: DataTypes.STRING(50),
      defaultValue: '+91 98844 55555',
    },
    email: {
      type: DataTypes.STRING(150),
      defaultValue: 'info@kpnpromoters.in',
    },
    copyright: {
      type: DataTypes.STRING(255),
      defaultValue: '© 2026 KPN Promoters. All Rights Reserved.',
    },
    socialLinks: {
      type: DataTypes.JSON,
      defaultValue: {
        facebook: 'https://facebook.com/kpnpromoters',
        instagram: 'https://instagram.com/kpnpromoters',
        youtube: 'https://youtube.com/@kpnpromoters',
        linkedin: 'https://linkedin.com/company/kpnpromoters',
      },
    },
    quickLinks: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    importantLinks: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    tableName: 'footer_cms',
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

FooterCMS.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.name;
  values.socialLinks = safeParseJson(values.socialLinks, {});
  values.quickLinks = safeParseJson(values.quickLinks, []);
  values.importantLinks = safeParseJson(values.importantLinks, []);
  return values;
};

export default FooterCMS;

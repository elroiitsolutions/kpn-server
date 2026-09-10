import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Project = sequelize.define(
  'Project',
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
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    propertyType: {
      type: DataTypes.ENUM('Apartments', 'Plots', 'Villas', 'Commercial', 'Industrial'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Upcoming', 'Ongoing', 'Completed', 'Sold Out'),
      defaultValue: 'Ongoing',
    },
    city: {
      type: DataTypes.STRING(100),
      defaultValue: 'Chennai',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    bhk: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    budget: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    pricePerSqFt: {
      type: DataTypes.STRING(100),
      defaultValue: '',
    },
    shortDescription: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    description: {
      type: DataTypes.TEXT('long'),
      defaultValue: '',
    },
    handoverTimeline: {
      type: DataTypes.STRING(100),
      defaultValue: 'Ready to Construct',
    },
    commencementDate: {
      type: DataTypes.STRING(100),
      defaultValue: '',
    },
    totalBlocks: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    totalFloors: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    totalUnits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    availableUnits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    soldUnits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reservedUnits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bookedUnits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    blockedUnits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    galleryImages: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    walkthroughVideoUrl: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    virtualTourUrl: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    streetViewUrl: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    brochureUrl: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    masterPlanUrl: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    floorPlans: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    blocks: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    plots: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    layoutImages: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    amenities: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    specifications: {
      type: DataTypes.JSON,
      defaultValue: {
        structure: '',
        flooring: '',
        doors: '',
        windows: '',
        electrical: '',
        plumbing: '',
        kitchen: '',
        others: '',
      },
    },
    nearbyLocations: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    faqs: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    mapEmbedUrl: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    latitude: {
      type: DataTypes.DOUBLE,
    },
    longitude: {
      type: DataTypes.DOUBLE,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  },
  {
    tableName: 'projects',
    timestamps: true,
    indexes: [
      { fields: ['propertyType', 'status'] },
      { fields: ['isPublished', 'isFeatured'] },
      { fields: ['slug'] },
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

Project.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  values.version = values.version || 1;
  values.totalBlocks = values.totalBlocks || 1;
  values.totalFloors = values.totalFloors || 1;
  values.bookedUnits = values.bookedUnits !== undefined ? values.bookedUnits : (values.soldUnits || 0);
  values.soldUnits = values.bookedUnits;
  values.blockedUnits = values.blockedUnits !== undefined ? values.blockedUnits : (values.reservedUnits || 0);
  values.reservedUnits = values.blockedUnits;
  values.galleryImages = safeParseJson(values.galleryImages, []);
  values.floorPlans = safeParseJson(values.floorPlans, []);
  values.blocks = safeParseJson(values.blocks, []);
  values.plots = safeParseJson(values.plots, []);
  values.layoutImages = safeParseJson(values.layoutImages, []);
  values.amenities = safeParseJson(values.amenities, []);
  values.specifications = safeParseJson(values.specifications, {});
  values.nearbyLocations = safeParseJson(values.nearbyLocations, []);
  values.faqs = safeParseJson(values.faqs, []);
  return values;
};

export default Project;

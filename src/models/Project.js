import mongoose from 'mongoose';

const { Schema } = mongoose;

const FloorPlanSchema = new Schema(
  {
    title: { type: String, required: true },
    bhk: { type: String, required: true },
    sqft: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const AmenitySchema = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: 'CheckCircle' },
    description: { type: String },
  },
  { _id: false }
);

const NearbyLocationSchema = new Schema(
  {
    name: { type: String, required: true },
    distance: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add project title / name'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Please specify slug identifier'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    propertyType: {
      type: String,
      enum: ['Apartments', 'Plots', 'Villas', 'Commercial', 'Industrial'],
      required: [true, 'Please specify property category'],
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Sold Out'],
      default: 'Ongoing',
    },
    city: {
      type: String,
      default: 'Chennai',
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide location string'],
      trim: true,
    },
    address: {
      type: String,
      default: '',
    },
    bhk: {
      type: String,
      required: [true, 'Please specify unit configurations'],
    },
    budget: {
      type: String,
      required: [true, 'Please specify starting budget/pricing display'],
    },
    pricePerSqFt: {
      type: String,
      default: '',
    },
    shortDescription: {
      type: String,
      default: '',
      maxlength: [300, 'Short summary cannot exceed 300 characters'],
    },
    description: {
      type: String,
      default: '',
    },
    handoverTimeline: {
      type: String,
      default: 'Ready to Construct',
    },
    commencementDate: {
      type: String,
      default: '',
    },
    totalUnits: {
      type: Number,
      default: 0,
    },
    availableUnits: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Please supply main cover display image'],
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    walkthroughVideoUrl: {
      type: String,
      default: '',
    },
    virtualTourUrl: {
      type: String,
      default: '',
    },
    streetViewUrl: {
      type: String,
      default: '',
    },
    brochureUrl: {
      type: String,
      default: '',
    },
    masterPlanUrl: {
      type: String,
      default: '',
    },
    floorPlans: {
      type: [FloorPlanSchema],
      default: [],
    },
    amenities: {
      type: [AmenitySchema],
      default: [],
    },
    specifications: {
      structure: { type: String, default: '' },
      flooring: { type: String, default: '' },
      doors: { type: String, default: '' },
      windows: { type: String, default: '' },
      electrical: { type: String, default: '' },
      plumbing: { type: String, default: '' },
      kitchen: { type: String, default: '' },
      others: { type: String, default: '' },
    },
    nearbyLocations: {
      type: [NearbyLocationSchema],
      default: [],
    },
    faqs: {
      type: [FAQSchema],
      default: [],
    },
    mapEmbedUrl: {
      type: String,
      default: '',
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ propertyType: 1, status: 1 });
ProjectSchema.index({ isPublished: 1, isFeatured: 1 });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);

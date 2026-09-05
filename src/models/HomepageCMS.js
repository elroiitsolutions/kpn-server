import mongoose from 'mongoose';

const { Schema } = mongoose;

const HomepageCMSSchema = new Schema(
  {
    hero: {
      heading: { type: String, default: 'Crafting Landmarks. Creating Legacies.' },
      subheading: { type: String, default: 'Discover Chennai’s finest apartments and DTCP-approved township plots.' },
      buttonText: { type: String, default: 'Explore Our Projects' },
      buttonUrl: { type: String, default: '/projects' },
      videoUrl: { type: String, default: '/images/videos/hero-bg.mp4' },
      mobileImageUrl: { type: String, default: '/images/projects/project_1.jpg' },
    },
    about: {
      tagline: { type: String, default: 'OVER 25 YEARS OF EXCELLENCE' },
      heading: { type: String, default: 'Building Trust Across Tamil Nadu Since 1999' },
      description: { type: String, default: 'KPN Promoters is Chennai’s leading real estate developer.' },
      yearsExperience: { type: Number, default: 25 },
      happyFamilies: { type: Number, default: 10000 },
      acresDeveloped: { type: Number, default: 500 },
    },
    featuredProjectIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    cta: {
      title: { type: String, default: 'Ready to Find Your Dream Property?' },
      description: { type: String, default: 'Speak directly with our senior real estate consultants today.' },
      buttonText: { type: String, default: 'Contact Us Now' },
      buttonUrl: { type: String, default: '/contact-us' },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.HomepageCMS || mongoose.model('HomepageCMS', HomepageCMSSchema);

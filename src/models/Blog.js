import mongoose from 'mongoose';

const { Schema } = mongoose;

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add article title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    author: {
      type: String,
      default: 'KPN Editorial Team',
    },
    featuredImage: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: 'General',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    quoteText: {
      type: String,
    },
    quoteAuthor: {
      type: String,
      default: 'John Doe',
    },
    seoTitle: {
      type: String,
    },
    seoDescription: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft',
      index: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

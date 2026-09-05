import mongoose from 'mongoose';

const { Schema } = mongoose;

const MediaItemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'news', 'press', 'event'],
      default: 'image',
    },
    fileUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    publishedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Published' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.MediaItem || mongoose.model('MediaItem', MediaItemSchema);

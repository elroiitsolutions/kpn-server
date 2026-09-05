import mongoose from 'mongoose';

const { Schema } = mongoose;

const VideoItemSchema = new Schema(
  {
    title: { type: String, required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    projectName: { type: String, default: '' },
    videoUrl: { type: String, required: true },
    videoType: { type: String, enum: ['YouTube', 'Vimeo', 'Cloudinary', 'External'], default: 'YouTube' },
    thumbnailUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Published' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.VideoItem || mongoose.model('VideoItem', VideoItemSchema);

import mongoose from 'mongoose';

const { Schema } = mongoose;

const CelebrationSchema = new Schema(
  {
    title: { type: String, required: true },
    subheading: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    date: { type: String, default: '' },
    year: { type: String, default: '2025' },
    category: {
      type: String,
      enum: ['Trip', 'Office', 'Launch', 'Festival', 'Milestone', 'General'],
      default: 'General',
    },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Published' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Celebration || mongoose.model('Celebration', CelebrationSchema);

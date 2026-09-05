import mongoose from 'mongoose';

const { Schema } = mongoose;

const TestimonialSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    role: { type: String, default: 'Homeowner' },
    avatar: { type: String, default: '' },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Published' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

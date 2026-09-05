import mongoose from 'mongoose';

const { Schema } = mongoose;

const AwardSchema = new Schema(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Published' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Award || mongoose.model('Award', AwardSchema);

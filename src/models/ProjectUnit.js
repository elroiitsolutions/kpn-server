import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProjectUnitSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    block: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: String,
      required: true,
      trim: true,
    },
    unitNumber: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: '2 BHK',
    },
    sizeSqFt: {
      type: Number,
      default: 0,
    },
    facing: {
      type: String,
      default: 'North',
    },
    price: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Sold', 'Blocked'],
      default: 'Available',
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

ProjectUnitSchema.index({ project: 1, block: 1, floor: 1, unitNumber: 1 }, { unique: true });

export default mongoose.models.ProjectUnit || mongoose.model('ProjectUnit', ProjectUnitSchema);

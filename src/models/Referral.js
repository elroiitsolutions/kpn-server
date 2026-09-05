import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReferralSchema = new Schema(
  {
    referrerName: { type: String, required: true, trim: true },
    referrerPhone: { type: String, required: true, trim: true },
    referrerEmail: { type: String, trim: true },
    referredName: { type: String, required: true, trim: true },
    referredPhone: { type: String, required: true, trim: true },
    referredEmail: { type: String, trim: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    projectName: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Referral Submitted', 'Contacted', 'Site Visit', 'Interested', 'Booked', 'Completed / Closed'],
      default: 'Referral Submitted',
    },
    rewardStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Disbursed', 'Ineligible'],
      default: 'Pending',
    },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Referral || mongoose.model('Referral', ReferralSchema);

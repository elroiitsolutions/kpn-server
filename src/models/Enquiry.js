import mongoose from 'mongoose';

const { Schema } = mongoose;

const EnquiryNoteSchema = new Schema(
  {
    author: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    projectName: { type: String, default: '' },
    message: { type: String, default: '' },
    source: {
      type: String,
      enum: [
        'Project Detail',
        'Contact Page',
        'Chatbot',
        'Associate Page',
        'Brochure Download',
        'Direct Call',
        'Website',
        'General',
        'Other',
      ],
      default: 'Contact Page',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Site Visit', 'Interested', 'Negotiation', 'Booked', 'Closed'],
      default: 'New',
      index: true,
    },
    assignedStaff: { type: String },
    notes: {
      type: [EnquiryNoteSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

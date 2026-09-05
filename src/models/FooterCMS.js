import mongoose from 'mongoose';

const { Schema } = mongoose;

const FooterLinkSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const FooterCMSSchema = new Schema(
  {
    name: { type: String, default: 'main_footer', unique: true },
    companyDescription: {
      type: String,
      default: 'KPN Promoters has earned the trust of over 10,000 satisfied families across Chennai and Tamil Nadu.',
    },
    address: {
      type: String,
      default: 'No: 17, 1st Cross Street, Sri Devi Nagar, Alapakkam, Chennai - 600116',
    },
    phone: {
      type: String,
      default: '+91 98844 55555',
    },
    email: {
      type: String,
      default: 'info@kpnpromoters.in',
    },
    copyright: {
      type: String,
      default: '© 2026 KPN Promoters. All Rights Reserved.',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/kpnpromoters' },
      instagram: { type: String, default: 'https://instagram.com/kpnpromoters' },
      youtube: { type: String, default: 'https://youtube.com/@kpnpromoters' },
      linkedin: { type: String, default: 'https://linkedin.com/company/kpnpromoters' },
    },
    quickLinks: {
      type: [FooterLinkSchema],
      default: [],
    },
    importantLinks: {
      type: [FooterLinkSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.FooterCMS || mongoose.model('FooterCMS', FooterCMSSchema);

import mongoose from 'mongoose';

const { Schema } = mongoose;

const MenuItemChildSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const MenuItemSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String },
    order: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
    children: { type: [MenuItemChildSchema], default: [] },
  },
  { _id: false }
);

const MenuCMSSchema = new Schema(
  {
    name: { type: String, default: 'main_menu', unique: true },
    items: { type: [MenuItemSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.MenuCMS || mongoose.model('MenuCMS', MenuCMSSchema);

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description?: string;
  price: number;
  category?: string;
  isVegetarian?: boolean;
  imageId?: string; // GridFS file id as string
  image?: string; // optional external image URL (useful for seeded items)
  createdAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true },
  category: { type: String, trim: true, default: 'general' },
  isVegetarian: { type: Boolean, default: false },
  imageId: { type: String, trim: true },
  image: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export const MenuItem: Model<IMenuItem> = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
export default MenuItem;

import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  parent: { type: String, default: '' },
  articles: { type: Number, default: 0 },
  color: { type: String, default: '#6366f1' },
  description: { type: String },
  position: { type: Number, default: 99 },
  isVisible: { type: Boolean, default: true },
  showInNav: { type: Boolean, default: true },
  bannerImage: { type: String },
  bannerImageAlt: { type: String },
  seoTitle: { type: String },
  seoDescription: { type: String }
}, {
  timestamps: true,
});

export const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);

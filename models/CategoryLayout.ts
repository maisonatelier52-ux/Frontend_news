import mongoose, { Schema } from 'mongoose';

const CategoryLayoutSchema = new Schema({
  categoryId: { type: String, default: 'global' },
  designStyle: { type: String, default: 'original' }, // 'original' | 'modern-spotlight' | 'split-timeline' | 'magazine-grid' | 'classic-broadsheet' | 'editorial-masonry'
  colorTheme: { type: String, default: 'indigo' },
  isVisibleSpotlight: { type: Boolean, default: true },
  isVisibleSidebar: { type: Boolean, default: true },
  spotlightStyle: { type: String, default: 'standard' },
  broadsheetStyle: { type: String, default: 'illustrated' },
  // Customizable text labels
  latestInLabel: { type: String, default: '' },
  spotlightDigestLabel: { type: String, default: '' },
  moreInLabel: { type: String, default: '' },
}, {
  timestamps: true,
});

export const CategoryLayoutModel = mongoose.models.CategoryLayout || mongoose.model('CategoryLayout', CategoryLayoutSchema);

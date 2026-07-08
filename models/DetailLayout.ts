import mongoose, { Schema } from 'mongoose';

const DetailLayoutSchema = new Schema({
  articleId: { type: String, default: 'global' },
  designStyle: { type: String, default: 'classic-sidebar' }, // 'classic-sidebar' | 'left-sidebar' | 'full-width'
  colorTheme: { type: String, default: 'crimson' }, // 'crimson' | 'indigo' | 'emerald' | 'slate' | 'amber' | 'ocean'
  fontSizeDefault: { type: String, default: 'base' }, // 'sm' | 'base' | 'lg' | 'xl'
  showShareBar: { type: Boolean, default: true },
  shareBarPosition: { type: String, default: 'bottom' }, // 'bottom' | 'sticky-left'
  authorCardStyle: { type: String, default: 'signature' }, // 'signature' | 'classic' | 'minimal'
  showComments: { type: Boolean, default: true }
}, {
  timestamps: true,
});

export const DetailLayoutModel = mongoose.models.DetailLayout || mongoose.model('DetailLayout', DetailLayoutSchema);

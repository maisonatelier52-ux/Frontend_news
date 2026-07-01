import mongoose, { Schema } from 'mongoose';

const LayoutSectionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  isVisible: { type: Boolean, default: true },
  categorySource: { type: String, default: 'All' },
  order: { type: Number, required: true },
  limit: { type: Number, default: 5 },
  designStyle: { type: String, default: 'grid' },
  colorTheme: { type: String, default: 'indigo' },
  settings: { type: Schema.Types.Mixed, default: {} }
}, { _id: false });

const HomeLayoutSchema = new Schema({
  templateName: { type: String, default: 'default' }, // 'default' | 'grid-focus' | 'minimal' | 'custom'
  sections: [LayoutSectionSchema]
}, {
  timestamps: true,
});

export const HomeLayoutModel = mongoose.models.HomeLayout || mongoose.model('HomeLayout', HomeLayoutSchema);

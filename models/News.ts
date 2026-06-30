import mongoose, { Schema } from 'mongoose';

const BlockSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true }
}, { _id: false });

const NewsSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  readTime: { type: String, default: '5 mins' },
  status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  date: { type: Date, default: Date.now },
  excerpt: { type: String },
  featuredImage: { type: String },
  imageAltText: { type: String },
  featuredVideoUrl: { type: String },
  cardLabel: { type: String },
  options: {
    featuredArticle: { type: Boolean, default: false },
    editorsPick: { type: Boolean, default: false },
    breakingNews: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true }
  },
  blocks: [BlockSchema],
  seoTitle: { type: String },
  seoMetaDescription: { type: String },
  keywords: { type: String },
  tags: { type: String }
}, {
  timestamps: true,
});

export const NewsModel = mongoose.models.News || mongoose.model('News', NewsSchema);

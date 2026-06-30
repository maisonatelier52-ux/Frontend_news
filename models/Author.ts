import mongoose, { Schema } from 'mongoose';

const AuthorSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  gender: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  category: { type: String, required: true },
  bio: { type: String, required: true },
  profileImage: { type: String },
  socialLinks: {
    twitter: { type: String },
    quora: { type: String },
    reddit: { type: String },
    medium: { type: String },
    substack: { type: String },
  },
  articlesCount: { type: Number, default: 0 }
}, {
  timestamps: true,
});

delete mongoose.models.Author;
export const AuthorModel = mongoose.model('Author', AuthorSchema);

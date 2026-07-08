import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
  articleId: { type: String, required: true },
  articleTitle: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  text: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, {
  timestamps: true,
});

delete mongoose.models.Comment;
export const CommentModel = mongoose.model('Comment', CommentSchema);

import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  otpCode: { type: String },
  otpExpiry: { type: Date },
}, {
  timestamps: true,
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

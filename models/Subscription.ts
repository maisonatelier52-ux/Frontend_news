import mongoose, { Schema } from 'mongoose';

const SubscriptionSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  ipAddress: { type: String },
  country: { type: String, default: 'United States' },
  countryCode: { type: String, default: 'US' },
  city: { type: String, default: 'New York' },
  region: { type: String, default: 'New York' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'accepted' },
}, {
  timestamps: true,
});

delete mongoose.models.Subscription;
export const SubscriptionModel = mongoose.model('Subscription', SubscriptionSchema);

import mongoose, { Schema } from 'mongoose';

const VisitorLogSchema = new Schema({
  ip: { type: String, required: true },
  country: { type: String, default: 'United States' },
  countryCode: { type: String, default: 'US' },
  url: { type: String, required: true },
  userAgent: { type: String },
  referrer: { type: String },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'visitor_logs'
});

export const VisitorLogModel = mongoose.models.VisitorLog || mongoose.model('VisitorLog', VisitorLogSchema);

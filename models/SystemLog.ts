import mongoose, { Schema } from 'mongoose';

const SystemLogSchema = new Schema({
  type: { type: String, required: true }, // 'security' | 'activity' | 'error' | 'audit'
  action: { type: String, required: true },
  user: { type: String, default: 'System' },
  details: { type: Schema.Types.Mixed },
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'system_logs'
});

export const SystemLogModel = mongoose.models.SystemLog || mongoose.model('SystemLog', SystemLogSchema);

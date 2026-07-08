import mongoose, { Schema } from 'mongoose';

const AdvertisementSchema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  size: { type: String, required: true },
  imageUrl: { type: String, required: true },
  status: { type: String, default: 'active' }, // 'active' | 'inactive'
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  startDate: { type: String, default: '—' },
  endDate: { type: String, default: '—' }
}, {
  timestamps: true,
});

export const AdvertisementModel = mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema);

import mongoose, { Schema } from 'mongoose';

const SiteSettingsSchema = new Schema({
  key: { type: String, default: 'site_settings', unique: true },
  theme: { type: Schema.Types.Mixed, default: {} },
  header: { type: Schema.Types.Mixed, default: {} },
  footer: { type: Schema.Types.Mixed, default: {} },
  navigation: { type: Schema.Types.Mixed, default: {} },
  seo: { type: Schema.Types.Mixed, default: {} },
  security: { type: Schema.Types.Mixed, default: {} },
  notifications: { type: Schema.Types.Mixed, default: {} },
  aboutUs: { type: Schema.Types.Mixed, default: {} },
  contactUs: { type: Schema.Types.Mixed, default: {} },
  privacyPolicy: { type: Schema.Types.Mixed, default: {} },
  termsAndConditions: { type: Schema.Types.Mixed, default: {} },
  correctionPolicy: { type: Schema.Types.Mixed, default: {} },
  sourceMethodology: { type: Schema.Types.Mixed, default: {} },
  advertisingPolicy: { type: Schema.Types.Mixed, default: {} },
  ownershipFunding: { type: Schema.Types.Mixed, default: {} },
  rightOfReplyPolicy: { type: Schema.Types.Mixed, default: {} },
  legalPolicy: { type: Schema.Types.Mixed, default: {} },
  ourTeam: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true,
  collection: 'site_settings'
});

export const SiteSettingsModel = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

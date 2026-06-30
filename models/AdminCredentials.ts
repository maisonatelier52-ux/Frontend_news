import mongoose, { Schema } from 'mongoose';

const AdminCredentialsSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: true },
}, {
  timestamps: true,
  collection: 'admin'
});

export const getAdminCredentialsModel = (connection: mongoose.Connection) => {
  // Use the default connected database (news) to avoid Atlas permissions errors
  return connection.models.AdminCredentials || connection.model('AdminCredentials', AdminCredentialsSchema);
};

import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    default: 'ABC Akademi'
  },
  siteDescription: {
    type: String,
    required: true,
    default: 'Modern eğitim platformu'
  },
  contactEmail: {
    type: String,
    required: true,
    default: 'info@abcakademi.com'
  },
  twoFactorAuth: {
    type: Boolean,
    default: false
  },
  autoLogout: {
    type: Boolean,
    default: true
  },
  passwordComplexity: {
    type: Boolean,
    default: true
  },
  autoLogoutTime: {
    type: Number,
    default: 30
  }
}, {
  timestamps: true
});

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema); 
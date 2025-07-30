import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  twoFactorAuth: boolean;
  autoLogout: boolean;
  passwordComplexity: boolean;
  autoLogoutTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    siteName: {
      type: String,
      required: true,
      default: 'ABC Akademi'
    },
    siteDescription: {
      type: String,
      default: 'Modern eğitim platformu'
    },
    contactEmail: {
      type: String,
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
  },
  {
    timestamps: true
  }
);

// Mongoose model'i kontrol et ve yoksa oluştur
const Setting = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);

export default Setting;
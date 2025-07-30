import mongoose from 'mongoose';

export interface ICategory extends mongoose.Document {
  name: string;
  description: string;
  image: string;
  color: string;
  status: 'active' | 'inactive';
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Kategori adı zorunludur'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Kategori açıklaması zorunludur'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Kategori görseli zorunludur'],
  },
  color: {
    type: String,
    default: '#2563eb',
    validate: {
      validator: function(v: string) {
        return /^#[0-9A-F]{6}$/i.test(v);
      },
      message: 'Geçerli bir HEX renk kodu giriniz'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  // Soft delete fields
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  deletedBy: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Soft delete için middleware - kaldırıldı
// categorySchema.pre(/^find/, function(next) {
//   // Silinmemiş kayıtları getir
//   (this as any).find({ isDeleted: { $ne: true } });
//   next();
// });

// Soft delete method
categorySchema.methods.softDelete = function(deletedBy?: string) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy || 'system';
  return this.save();
};

// Restore method
categorySchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  return this.save();
};

export default mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema); 
import mongoose from 'mongoose';

export interface ICourse extends mongoose.Document {
  title: string;
  description: string;
  content: string;
  price: number;
  duration: string;
  level: 'Başlangıç' | 'Orta' | 'İleri';
  category: string;
  image: string;
  instructor: string;
  students: number;
  rating: number;
  status: 'active' | 'draft';
  courseAbout: string;
  whatYouWillLearn: string[];
  requirements: string[];
  includes: string[];
  lastUpdate: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new mongoose.Schema<ICourse>({
  title: {
    type: String,
    required: [true, 'Kurs başlığı zorunludur'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Kurs açıklaması zorunludur'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Kurs içeriği zorunludur'],
  },
  price: {
    type: Number,
    required: [true, 'Kurs fiyatı zorunludur'],
    min: [0, 'Fiyat 0\'dan küçük olamaz'],
  },
  duration: {
    type: String,
    required: [true, 'Kurs süresi zorunludur'],
  },
  level: {
    type: String,
    enum: ['Başlangıç', 'Orta', 'İleri'],
    default: 'Başlangıç',
  },
  category: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Kurs görseli zorunludur'],
  },
  instructor: {
    type: String,
    required: [true, 'Eğitmen zorunludur'],
  },
  students: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  status: {
    type: String,
    enum: ['active', 'draft'],
    default: 'active',
  },
  courseAbout: {
    type: String,
    default: '',
  },
  whatYouWillLearn: {
    type: [String],
    default: [''],
  },
  requirements: {
    type: [String],
    default: [''],
  },
  includes: {
    type: [String],
    default: [''],
  },
  lastUpdate: {
    type: String,
    default: '',
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
// courseSchema.pre(/^find/, function(next) {
//   // Silinmemiş kayıtları getir
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });

// Soft delete method
courseSchema.methods.softDelete = function(deletedBy?: string) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy || 'system';
  return this.save();
};

// Restore method
courseSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  return this.save();
};

export default mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema); 
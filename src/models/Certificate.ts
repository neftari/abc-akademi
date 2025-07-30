import mongoose from 'mongoose';

export interface ICertificate extends mongoose.Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  certificateNumber: string;
  issueDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  pdfUrl?: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  courseId: string;
  status: 'issued' | 'revoked';
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new mongoose.Schema<ICertificate>({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Öğrenci zorunludur'],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Kurs zorunludur'],
  },
  certificateNumber: {
    type: String,
    required: [true, 'Sertifika numarası zorunludur'],
    unique: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  pdfUrl: {
    type: String,
  },
  studentName: {
    type: String,
    default: '',
  },
  studentEmail: {
    type: String,
    default: '',
  },
  courseName: {
    type: String,
    default: '',
  },
  courseId: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['issued', 'revoked'],
    default: 'issued',
  },
}, {
  timestamps: true,
});

// Sertifika numarası oluşturma
certificateSchema.pre('save', function(next) {
  if (!this.certificateNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.certificateNumber = `CERT-${timestamp}-${random}`;
  }
  next();
});

export default mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', certificateSchema); 
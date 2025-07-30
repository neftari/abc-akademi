const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Environment dosyasını yükle
require('dotenv').config({ path: '.env.local' });

// MongoDB bağlantısı
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://subline:98235Ya.@cluster0.om0jxni.mongodb.net/abc-akademi?retryWrites=true&w=majority';

// Basit model tanımlamaları (TypeScript olmadan)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'student', 'teacher'], default: 'student' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  assignedCourses: [{ type: String }],
  joinDate: { type: String },
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, default: '' },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  students: { type: Number, default: 0 },
  duration: { type: String, required: true },
  level: { type: String, enum: ['Başlangıç', 'Orta', 'İleri'], default: 'Başlangıç' },
  courseAbout: { type: String },
  whatYouWillLearn: [{ type: String }],
  requirements: [{ type: String }],
  includes: [{ type: String }],
  lastUpdate: { type: String },
  status: { type: String, enum: ['active', 'draft'], default: 'active' },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  instructor: { type: String, required: true },
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  image: { type: String, required: true },
  color: { type: String, default: '#2563eb' },
}, { timestamps: true });

const certificateSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  courseName: { type: String, required: true },
  courseId: { type: String, required: true },
  certificateNumber: { type: String, required: true },
  issueDate: { type: String, required: true },
  status: { type: String, enum: ['issued', 'pending'], default: 'issued' },
}, { timestamps: true });

// Model oluşturma
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);

async function migrateData() {
  try {
    console.log('MongoDB\'ye bağlanılıyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı!');

    // Mevcut verileri temizle
    console.log('Mevcut veriler temizleniyor...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Category.deleteMany({});
    await Certificate.deleteMany({});

    // JSON dosyalarını oku
    console.log('JSON dosyaları okunuyor...');
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
    const coursesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/courses.json'), 'utf8'));
    const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/categories.json'), 'utf8'));
    const certificatesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/certificates.json'), 'utf8'));

    // Veri dönüşümleri - ID'leri kaldır, MongoDB otomatik oluştursun
    const transformedUsers = usersData.map(user => {
      const { id, ...userData } = user;
      return {
        ...userData,
        createdAt: new Date(user.joinDate || Date.now()),
        updatedAt: new Date()
      };
    });

    const transformedCourses = coursesData.map(course => {
      const { id, ...courseData } = course;
      return {
        ...courseData,
        instructor: courseData.instructor || 'ABC Akademi Eğitmeni', // Varsayılan eğitmen
        createdAt: new Date(course.createdAt || Date.now()),
        updatedAt: new Date()
      };
    });

    const transformedCategories = categoriesData.map(category => {
      const { id, ...categoryData } = category;
      return {
        ...categoryData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    const transformedCertificates = certificatesData.map(certificate => {
      const { id, ...certificateData } = certificate;
      return {
        ...certificateData,
        studentEmail: certificateData.studentEmail || 'student@example.com', // Varsayılan email
        courseId: certificateData.courseId || 'course-1', // Varsayılan course ID
        certificateNumber: certificateData.certificateNumber || `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Otomatik sertifika numarası
        createdAt: new Date(certificate.issueDate || Date.now()),
        updatedAt: new Date()
      };
    });

    // Verileri MongoDB'ye aktar
    console.log('Veriler MongoDB\'ye aktarılıyor...');
    
    if (transformedUsers.length > 0) {
      await User.insertMany(transformedUsers);
      console.log(`${transformedUsers.length} kullanıcı aktarıldı`);
    }

    if (transformedCourses.length > 0) {
      await Course.insertMany(transformedCourses);
      console.log(`${transformedCourses.length} kurs aktarıldı`);
    }

    if (transformedCategories.length > 0) {
      await Category.insertMany(transformedCategories);
      console.log(`${transformedCategories.length} kategori aktarıldı`);
    }

    if (transformedCertificates.length > 0) {
      await Certificate.insertMany(transformedCertificates);
      console.log(`${transformedCertificates.length} sertifika aktarıldı`);
    }

    console.log('✅ Veri migrasyonu başarıyla tamamlandı!');
    
    // İstatistikler
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    const categoryCount = await Category.countDocuments();
    const certificateCount = await Certificate.countDocuments();

    console.log('\n📊 Veritabanı İstatistikleri:');
    console.log(`👥 Kullanıcılar: ${userCount}`);
    console.log(`📚 Kurslar: ${courseCount}`);
    console.log(`📂 Kategoriler: ${categoryCount}`);
    console.log(`🏆 Sertifikalar: ${certificateCount}`);

  } catch (error) {
    console.error('❌ Migrasyon hatası:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı.');
  }
}

// Script çalıştırma
if (require.main === module) {
  migrateData();
}

module.exports = migrateData; 
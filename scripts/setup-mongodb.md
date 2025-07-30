# MongoDB Kurulum ve Veri Migrasyonu Rehberi

## 1. MongoDB Kurulumu

### Windows için:
1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) indirin
2. Kurulum sırasında "Install MongoDB as a Service" seçeneğini işaretleyin
3. MongoDB Compass (GUI) kurulumunu da seçin

### Alternatif: MongoDB Atlas (Cloud)
1. [MongoDB Atlas](https://www.mongodb.com/atlas) hesabı oluşturun
2. Ücretsiz cluster oluşturun
3. Connection string'i alın

## 2. Environment Dosyası Oluşturma

`.env.local` dosyası oluşturun:

```env
# Veritabanı Bağlantısı
MONGODB_URI=mongodb://localhost:27017/abc-akademi

# NextAuth.js Ayarları
NEXTAUTH_SECRET=your-super-secret-key-for-local-development-only
NEXTAUTH_URL=http://localhost:3000

# Güvenlik Anahtarları
JWT_SECRET=your-local-jwt-secret-key

# Geliştirme Ayarları
NODE_ENV=development
DEBUG=true
```

## 3. Veri Migrasyonu

### JSON'dan MongoDB'ye veri aktarımı için script:

```javascript
// scripts/migrate-data.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/abc-akademi');

// Model tanımlamaları
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Category = require('../src/models/Category');
const Certificate = require('../src/models/Certificate');

async function migrateData() {
  try {
    // JSON dosyalarını oku
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
    const coursesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/courses.json'), 'utf8'));
    const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/categories.json'), 'utf8'));
    const certificatesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/certificates.json'), 'utf8'));

    // Verileri MongoDB'ye aktar
    await User.insertMany(usersData);
    await Course.insertMany(coursesData);
    await Category.insertMany(categoriesData);
    await Certificate.insertMany(certificatesData);

    console.log('Veri migrasyonu tamamlandı!');
  } catch (error) {
    console.error('Migrasyon hatası:', error);
  } finally {
    mongoose.connection.close();
  }
}

migrateData();
```

## 4. Kurulum Adımları

1. MongoDB'yi kurun
2. `.env.local` dosyası oluşturun
3. Migrasyon scriptini çalıştırın
4. Uygulamayı test edin

## 5. Test

```bash
npm run dev
```

Tarayıcıda http://localhost:3000 adresine gidin ve verilerin yüklendiğini kontrol edin. 
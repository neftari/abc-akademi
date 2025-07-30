const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://abc-egitim:*98235Ya.*@abc-egitim.enskwzw.mongodb.net/?retryWrites=true&w=majority&appName=abc-egitim';

async function addTestData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ MongoDB\'ye bağlandı!');
    
    const db = client.db('abc-egitim');
    
    // Test kursları ekle
    const testCourses = [
      {
        title: 'JavaScript Temelleri',
        description: 'Modern JavaScript programlama dilinin temellerini öğrenin',
        content: 'Bu kursta JavaScript\'in temel kavramlarını öğreneceksiniz.',
        price: 299,
        duration: '8 hafta',
        category: 'Programlama',
        instructor: 'Ahmet Yılmaz',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'React.js ile Modern Web Geliştirme',
        description: 'React.js kullanarak modern web uygulamaları geliştirin',
        content: 'React.js framework\'ü ile component tabanlı uygulamalar yapın.',
        price: 499,
        duration: '12 hafta',
        category: 'Frontend',
        instructor: 'Ayşe Demir',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Node.js Backend Geliştirme',
        description: 'Node.js ile güçlü backend uygulamaları oluşturun',
        content: 'Express.js ve MongoDB kullanarak API geliştirmeyi öğrenin.',
        price: 399,
        duration: '10 hafta',
        category: 'Backend',
        instructor: 'Mehmet Kaya',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const coursesResult = await db.collection('courses').insertMany(testCourses);
    console.log(`✅ ${coursesResult.insertedCount} kurs eklendi`);
    
    // Test ayarları ekle
    const testSettings = {
      siteName: 'ABC Akademi',
      siteDescription: 'Modern eğitim platformu',
      contactEmail: 'info@abcakademi.com',
      twoFactorAuth: false,
      autoLogout: true,
      passwordComplexity: true,
      autoLogoutTime: 30,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('settings').insertOne(testSettings);
    console.log('✅ Ayarlar eklendi');
    
    // Verileri göster
    console.log('\n=== EKLENİLEN VERİLER ===');
    
    const courses = await db.collection('courses').find({}).toArray();
    console.log('\n📚 KURSLAR:');
    courses.forEach((course, index) => {
      console.log(`\n${index + 1}. ${course.title}`);
      console.log(`   💰 Fiyat: ${course.price} TL`);
      console.log(`   ⏱️ Süre: ${course.duration}`);
      console.log(`   📂 Kategori: ${course.category}`);
      console.log(`   👨‍🏫 Eğitmen: ${course.instructor}`);
    });
    
    const settings = await db.collection('settings').findOne({});
    console.log('\n⚙️ AYARLAR:');
    console.log(`   Site Adı: ${settings.siteName}`);
    console.log(`   İletişim: ${settings.contactEmail}`);
    console.log(`   2FA: ${settings.twoFactorAuth ? 'Aktif' : 'Pasif'}`);
    console.log(`   Otomatik Çıkış: ${settings.autoLogout ? 'Aktif' : 'Pasif'}`);
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Bağlantı kapatıldı');
  }
}

addTestData();
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://abc-egitim:*98235Ya.*@abc-egitim.enskwzw.mongodb.net/?retryWrites=true&w=majority&appName=abc-egitim';

async function showAllData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔗 MongoDB Atlas\'a bağlandı!');
    
    const db = client.db('abc-egitim');
    
    // Tüm koleksiyonları listele
    const collections = await db.listCollections().toArray();
    console.log('\n📁 MEVCUT KOLEKSİYONLAR:');
    collections.forEach(col => {
      console.log(`   • ${col.name}`);
    });
    
    // Courses koleksiyonu detayları
    console.log('\n📚 COURSES KOLEKSİYONU:');
    const coursesCount = await db.collection('courses').countDocuments();
    console.log(`   Toplam kurs sayısı: ${coursesCount}`);
    
    if (coursesCount > 0) {
      const courses = await db.collection('courses').find({}).toArray();
      courses.forEach((course, index) => {
        console.log(`\n   ${index + 1}. 📖 ${course.title}`);
        console.log(`      💰 Fiyat: ${course.price} TL`);
        console.log(`      ⏱️ Süre: ${course.duration}`);
        console.log(`      📂 Kategori: ${course.category}`);
        console.log(`      👨‍🏫 Eğitmen: ${course.instructor}`);
        console.log(`      📝 Açıklama: ${course.description.substring(0, 50)}...`);
        console.log(`      🆔 ID: ${course._id}`);
      });
    }
    
    // Settings koleksiyonu detayları
    console.log('\n⚙️ SETTINGS KOLEKSİYONU:');
    const settingsCount = await db.collection('settings').countDocuments();
    console.log(`   Toplam ayar sayısı: ${settingsCount}`);
    
    if (settingsCount > 0) {
      const settings = await db.collection('settings').findOne({});
      console.log('\n   📋 Sistem Ayarları:');
      console.log(`      🏢 Site Adı: ${settings.siteName}`);
      console.log(`      📧 İletişim: ${settings.contactEmail}`);
      console.log(`      🔐 2FA: ${settings.twoFactorAuth ? '✅ Aktif' : '❌ Pasif'}`);
      console.log(`      🚪 Otomatik Çıkış: ${settings.autoLogout ? '✅ Aktif' : '❌ Pasif'}`);
      console.log(`      🔒 Şifre Karmaşıklığı: ${settings.passwordComplexity ? '✅ Aktif' : '❌ Pasif'}`);
      console.log(`      ⏰ Çıkış Süresi: ${settings.autoLogoutTime} dakika`);
      console.log(`      🆔 ID: ${settings._id}`);
    }
    
    // İstatistikler
    console.log('\n📊 VERİTABANI İSTATİSTİKLERİ:');
    console.log(`   📚 Toplam Kurs: ${coursesCount}`);
    console.log(`   ⚙️ Toplam Ayar: ${settingsCount}`);
    console.log(`   📁 Toplam Koleksiyon: ${collections.length}`);
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error('📋 Detay:', error);
  } finally {
    await client.close();
    console.log('\n🔌 MongoDB bağlantısı kapatıldı');
  }
}

showAllData();
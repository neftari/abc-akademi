const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://abc-egitim:*98235Ya.*@abc-egitim.enskwzw.mongodb.net/?retryWrites=true&w=majority&appName=abc-egitim';

async function cleanDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔗 MongoDB Atlas\'a bağlandı!');
    
    const db = client.db('abc-egitim');
    
    // Kurslardan gereksiz alanları kaldır
    console.log('🧹 Kursları temizleniyor...');
    
    const result = await db.collection('courses').updateMany(
      {},
      {
        $unset: {
          'courseAbout': '',
          'whatYouWillLearn': '',
          'requirements': '',
          'includes': '',
          'lastUpdate': '',
          'content': '',
          'description': '' // Uzun açıklamalar kaldırılıyor
        }
      }
    );
    
    console.log(`✅ ${result.modifiedCount} kurs temizlendi`);
    
    // Temizlenmiş verileri kontrol et
    const cleanedCourses = await db.collection('courses').find({})
      .project({
        title: 1,
        price: 1,
        duration: 1,
        category: 1,
        instructor: 1,
        image: 1,
        rating: 1,
        level: 1,
        status: 1,
        students: 1,
        createdAt: 1
      })
      .limit(3)
      .toArray();
    
    console.log('\n📋 Temizlenmiş kurs örneği:');
    cleanedCourses.forEach((course, index) => {
      console.log(`\n${index + 1}. ${course.title}`);
      console.log(`   💰 Fiyat: ${course.price} TL`);
      console.log(`   📂 Kategori: ${course.category}`);
      console.log(`   ⭐ Rating: ${course.rating}`);
      console.log(`   📊 Level: ${course.level}`);
      console.log(`   👥 Öğrenci: ${course.students}`);
    });
    
    // Veritabanı boyutunu kontrol et
    const stats = await db.stats();
    console.log(`\n📊 Veritabanı boyutu: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Bağlantı kapatıldı');
  }
}

cleanDatabase();
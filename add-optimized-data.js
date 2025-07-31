const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://abc-egitim:*98235Ya.*@abc-egitim.enskwzw.mongodb.net/?retryWrites=true&w=majority&appName=abc-egitim';

async function addOptimizedData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔗 MongoDB Atlas\'a bağlandı!');
    
    const db = client.db('abc-egitim');
    
    // Önce mevcut kursları sil
    await db.collection('courses').deleteMany({});
    console.log('🗑️ Eski kurslar silindi');
    
    // Mağaza için optimize edilmiş kurslar
    const optimizedCourses = [
      {
        title: 'JavaScript Temelleri',
        price: 299,
        duration: '8 hafta',
        category: 'Programlama',
        instructor: 'Ahmet Yılmaz',
        image: '/images/courses/javascript-basics.jpg',
        rating: 4.8,
        level: 'Başlangıç',
        status: 'active',
        students: 1250,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        title: 'React.js ile Modern Web Geliştirme',
        price: 499,
        duration: '12 hafta',
        category: 'Frontend',
        instructor: 'Ayşe Demir',
        image: '/images/courses/react-modern.jpg',
        rating: 4.9,
        level: 'Orta',
        status: 'active',
        students: 890,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date()
      },
      {
        title: 'Node.js Backend Geliştirme',
        price: 399,
        duration: '10 hafta',
        category: 'Backend',
        instructor: 'Mehmet Kaya',
        image: '/images/courses/nodejs-backend.jpg',
        rating: 4.7,
        level: 'Orta',
        status: 'active',
        students: 675,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date()
      },
      {
        title: 'Python ile Veri Analizi',
        price: 599,
        duration: '14 hafta',
        category: 'Veri Bilimi',
        instructor: 'Dr. Fatma Özkan',
        image: '/images/courses/python-data.jpg',
        rating: 4.9,
        level: 'İleri',
        status: 'active',
        students: 432,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date()
      },
      {
        title: 'UI/UX Tasarım Temelleri',
        price: 449,
        duration: '9 hafta',
        category: 'Tasarım',
        instructor: 'Zeynep Arslan',
        image: '/images/courses/uiux-design.jpg',
        rating: 4.6,
        level: 'Başlangıç',
        status: 'active',
        students: 789,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date()
      },
      {
        title: 'Digital Pazarlama Stratejileri',
        price: 349,
        duration: '6 hafta',
        category: 'Pazarlama',
        instructor: 'Can Yıldız',
        image: '/images/courses/digital-marketing.jpg',
        rating: 4.5,
        level: 'Başlangıç',
        status: 'active',
        students: 1100,
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date()
      }
    ];
    
    const result = await db.collection('courses').insertMany(optimizedCourses);
    console.log(`✅ ${result.insertedCount} optimize edilmiş kurs eklendi`);
    
    // Sonuçları göster
    const courses = await db.collection('courses').find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log('\n🛍️ MAĞAZA KURSLARI:');
    courses.forEach((course, index) => {
      console.log(`\n${index + 1}. 📚 ${course.title}`);
      console.log(`   💰 ${course.price} TL`);
      console.log(`   ⏱️ ${course.duration}`);
      console.log(`   📂 ${course.category}`);
      console.log(`   👨‍🏫 ${course.instructor}`);
      console.log(`   ⭐ ${course.rating}/5`);
      console.log(`   👥 ${course.students} öğrenci`);
      console.log(`   📊 ${course.level}`);
    });
    
    console.log(`\n📊 Toplam kurs sayısı: ${courses.length}`);
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Bağlantı kapatıldı');
  }
}

addOptimizedData();
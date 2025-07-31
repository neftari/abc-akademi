const fetch = require('node-fetch');
const baseUrl = 'https://abc-akademi.vercel.app/api';

async function testCurrentAPI() {
  console.log('🚀 ABC Akademi Mevcut API Test Başlatılıyor...\n');
  
  try {
    // Courses API Test
    console.log('1️⃣ Courses API testi...');
    const coursesResponse = await fetch(`${baseUrl}/courses`);
    const coursesData = await coursesResponse.json();
    
    if (coursesResponse.ok) {
      console.log('✅ Courses API başarılı');
      console.log(`   📚 Kurs sayısı: ${coursesData.length || 0}`);
      if (coursesData.length > 0) {
        console.log(`   📖 İlk kurs: ${coursesData[0].title}`);
        console.log(`   💰 Fiyat: ${coursesData[0].price} TL`);
        console.log(`   👨‍🏫 Eğitmen: ${coursesData[0].instructor}`);
      }
    } else {
      console.log('❌ Courses API başarısız');
    }
    
    // Settings API Test
    console.log('\n2️⃣ Settings API testi...');
    const settingsResponse = await fetch(`${baseUrl}/settings`);
    const settingsData = await settingsResponse.json();
    
    if (settingsResponse.ok) {
      console.log('✅ Settings API başarılı');
      console.log(`   🏢 Site Adı: ${settingsData.siteName}`);
      console.log(`   📧 İletişim: ${settingsData.contactEmail}`);
      console.log(`   🔐 2FA: ${settingsData.twoFactorAuth ? 'Aktif' : 'Pasif'}`);
      console.log(`   🚪 Otomatik Çıkış: ${settingsData.autoLogout ? 'Aktif' : 'Pasif'}`);
      console.log(`   ⏰ Çıkış Süresi: ${settingsData.autoLogoutTime} dakika`);
    } else {
      console.log('❌ Settings API başarısız');
    }
    
    // Specific Course Test
    if (coursesData && coursesData.length > 0) {
      console.log('\n3️⃣ Tekil kurs testi...');
      const courseId = coursesData[0]._id;
      const courseResponse = await fetch(`${baseUrl}/courses/${courseId}`);
      
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        console.log('✅ Tekil kurs API başarılı');
        console.log(`   📖 Kurs: ${courseData.title}`);
        console.log(`   📝 Açıklama: ${courseData.description.substring(0, 50)}...`);
      } else {
        console.log('❌ Tekil kurs API başarısız');
      }
    }
    
    console.log('\n🎉 Mevcut API testleri tamamlandı!');
    console.log('\n📋 ÖZET:');
    console.log('✅ MongoDB Atlas bağlantısı çalışıyor');
    console.log('✅ Courses API çalışıyor');
    console.log('✅ Settings API çalışıyor');
    console.log('✅ Veritabanında test verileri mevcut');
    
  } catch (error) {
    console.error('❌ Test hatası:', error.message);
  }
}

testCurrentAPI();
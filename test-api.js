const baseUrl = 'https://abc-akademi.vercel.app/api';

async function testAPI() {
  console.log('🚀 ABC Akademi API Test Başlatılıyor...\n');
  
  try {
    // Health Check
    console.log('1️⃣ Health Check testi...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('✅ Health Check başarılı');
      console.log(`   📊 Response Time: ${healthData.performance?.responseTime}`);
      console.log(`   🔗 DB Status: ${healthData.database?.status}`);
      console.log(`   📚 Courses: ${healthData.database?.collections?.courses}`);
      console.log(`   ⚙️ Settings: ${healthData.database?.collections?.settings}`);
    } else {
      console.log('❌ Health Check başarısız');
    }
    
    // Courses API Test
    console.log('\n2️⃣ Courses API testi...');
    const coursesResponse = await fetch(`${baseUrl}/courses`);
    const coursesData = await coursesResponse.json();
    
    if (coursesResponse.ok) {
      console.log('✅ Courses API başarılı');
      if (coursesData.success) {
        console.log(`   📚 Toplam kurs: ${coursesData.data?.length || 0}`);
        console.log(`   📄 Pagination: ${coursesData.pagination?.currentPage}/${coursesData.pagination?.totalPages}`);
      } else {
        console.log(`   📚 Kurs sayısı: ${coursesData.length || 0}`);
      }
    } else {
      console.log('❌ Courses API başarısız');
    }
    
    // Settings API Test
    console.log('\n3️⃣ Settings API testi...');
    const settingsResponse = await fetch(`${baseUrl}/settings`);
    const settingsData = await settingsResponse.json();
    
    if (settingsResponse.ok) {
      console.log('✅ Settings API başarılı');
      const data = settingsData.success ? settingsData.data : settingsData;
      console.log(`   🏢 Site Adı: ${data.siteName}`);
      console.log(`   📧 İletişim: ${data.contactEmail}`);
      console.log(`   🔐 2FA: ${data.twoFactorAuth ? 'Aktif' : 'Pasif'}`);
    } else {
      console.log('❌ Settings API başarısız');
    }
    
    // Pagination Test
    console.log('\n4️⃣ Pagination testi...');
    const paginationResponse = await fetch(`${baseUrl}/courses?page=1&limit=2`);
    const paginationData = await paginationResponse.json();
    
    if (paginationResponse.ok) {
      console.log('✅ Pagination başarılı');
      if (paginationData.success) {
        console.log(`   📄 Sayfa: ${paginationData.pagination?.currentPage}`);
        console.log(`   📊 Limit: ${paginationData.data?.length}`);
      }
    } else {
      console.log('❌ Pagination başarısız');
    }
    
    // Search Test
    console.log('\n5️⃣ Search testi...');
    const searchResponse = await fetch(`${baseUrl}/courses?search=JavaScript`);
    const searchData = await searchResponse.json();
    
    if (searchResponse.ok) {
      console.log('✅ Search başarılı');
      const results = searchData.success ? searchData.data : searchData;
      console.log(`   🔍 Sonuç sayısı: ${results?.length || 0}`);
    } else {
      console.log('❌ Search başarısız');
    }
    
    console.log('\n🎉 Tüm testler tamamlandı!');
    
  } catch (error) {
    console.error('❌ Test hatası:', error.message);
  }
}

// Node.js ortamında çalıştır
if (typeof require !== 'undefined') {
  // Node.js için fetch polyfill
  const fetch = require('node-fetch');
  testAPI();
}

// Browser ortamında da çalışabilir
if (typeof window !== 'undefined') {
  window.testAPI = testAPI;
}
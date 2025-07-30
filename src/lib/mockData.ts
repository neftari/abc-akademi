// Mock veri dosyası - API'ler çalışmadığında kullanılacak örnek veriler

// Kurs mock verileri
export const mockCourses = [
  {
    _id: 'mock-course-1',
    id: 'mock-course-1',
    title: 'Web Geliştirme Temelleri',
    description: 'HTML, CSS ve JavaScript ile web geliştirmeye giriş yapın',
    content: '<h2>Kurs İçeriği</h2><p>Bu kurs, web geliştirmenin temel yapı taşlarını öğretir.</p><ul><li>HTML5 Temelleri</li><li>CSS3 ile Stil</li><li>JavaScript Temelleri</li></ul>',
    price: 499,
    duration: '20 saat',
    level: 'Başlangıç',
    category: 'Web Geliştirme',
    image: '/courses/web-dev.jpg',
    instructor: 'Ahmet Yılmaz',
    students: 1250,
    rating: 4.8,
    status: 'active',
    courseAbout: 'Web geliştirmenin temelleri hakkında kapsamlı bir kurs',
    whatYouWillLearn: [
      'HTML5 yapısını ve semantik etiketleri',
      'CSS3 ile stil ve düzen oluşturmayı',
      'JavaScript ile dinamik içerik oluşturmayı'
    ],
    requirements: [
      'Temel bilgisayar kullanımı',
      'Metin editörü (VS Code önerilir)'
    ],
    includes: [
      'Ömür boyu erişim',
      'Proje dosyaları',
      'Sertifika'
    ],
    lastUpdate: '2023-12-15'
  },
  {
    _id: 'mock-course-2',
    id: 'mock-course-2',
    title: 'React.js ile Modern Web Uygulamaları',
    description: 'React.js kullanarak modern ve interaktif web uygulamaları geliştirin',
    content: '<h2>Kurs İçeriği</h2><p>Bu kurs, React.js ile modern web uygulamaları geliştirmeyi öğretir.</p><ul><li>React Temelleri</li><li>Komponentler ve Props</li><li>State Yönetimi</li><li>React Hooks</li></ul>',
    price: 799,
    duration: '30 saat',
    level: 'Orta',
    category: 'Frontend',
    image: '/courses/react.jpg',
    instructor: 'Zeynep Kaya',
    students: 850,
    rating: 4.9,
    status: 'active',
    courseAbout: 'React.js ile modern web uygulamaları geliştirmeyi öğrenin',
    whatYouWillLearn: [
      'React komponentleri oluşturmayı',
      'Props ve state kavramlarını',
      'React Hooks kullanımını',
      'Context API ile state yönetimini'
    ],
    requirements: [
      'HTML, CSS ve JavaScript bilgisi',
      'ES6+ özellikleri hakkında temel bilgi'
    ],
    includes: [
      'Ömür boyu erişim',
      'Proje dosyaları',
      'Sertifika',
      'Kod incelemeleri'
    ],
    lastUpdate: '2024-01-20'
  },
  {
    _id: 'mock-course-3',
    id: 'mock-course-3',
    title: 'Node.js ile Backend Geliştirme',
    description: 'Node.js ve Express ile güçlü backend uygulamaları geliştirin',
    content: '<h2>Kurs İçeriği</h2><p>Bu kurs, Node.js ve Express ile backend geliştirmeyi öğretir.</p><ul><li>Node.js Temelleri</li><li>Express Framework</li><li>RESTful API Geliştirme</li><li>MongoDB Entegrasyonu</li></ul>',
    price: 899,
    duration: '35 saat',
    level: 'Orta',
    category: 'Backend',
    image: '/courses/nodejs.jpg',
    instructor: 'Mehmet Demir',
    students: 720,
    rating: 4.7,
    status: 'active',
    courseAbout: 'Node.js ile modern backend uygulamaları geliştirmeyi öğrenin',
    whatYouWillLearn: [
      'Node.js ile server oluşturmayı',
      'Express framework kullanımını',
      'RESTful API tasarımını',
      'MongoDB ile veri tabanı işlemlerini'
    ],
    requirements: [
      'JavaScript bilgisi',
      'Temel programlama konseptleri'
    ],
    includes: [
      'Ömür boyu erişim',
      'Proje dosyaları',
      'Sertifika',
      'Gerçek dünya projeleri'
    ],
    lastUpdate: '2024-02-10'
  }
];

// Kategori mock verileri
export const mockCategories = [
  {
    _id: 'mock-category-1',
    id: 'mock-category-1',
    name: 'Web Geliştirme',
    description: 'Web sitesi ve web uygulamaları geliştirmeye yönelik kurslar',
    status: 'active',
    image: '/categories/web-dev.jpg',
    color: 'blue'
  },
  {
    _id: 'mock-category-2',
    id: 'mock-category-2',
    name: 'Frontend',
    description: 'Frontend geliştirme teknolojileri ve framework\'leri',
    status: 'active',
    image: '/categories/frontend.jpg',
    color: 'purple'
  },
  {
    _id: 'mock-category-3',
    id: 'mock-category-3',
    name: 'Backend',
    description: 'Backend geliştirme teknolojileri ve veritabanı yönetimi',
    status: 'active',
    image: '/categories/backend.jpg',
    color: 'green'
  }
];

// Kullanıcı mock verileri
export const mockUsers = [
  {
    _id: 'mock-user-1',
    id: 'mock-user-1',
    name: 'Demo Kullanıcı',
    email: 'demo@abcakademi.com',
    password: 'hashedpassword123',
    role: 'student',
    avatar: '/avatars/default.jpg',
    phone: '5551234567',
    address: 'İstanbul, Türkiye',
    status: 'active',
    assignedCourses: ['mock-course-1', 'mock-course-2'],
    joinDate: '2023-10-15'
  },
  {
    _id: 'mock-user-2',
    id: 'mock-user-2',
    name: 'Admin Kullanıcı',
    email: 'admin@abcakademi.com',
    password: 'hashedpassword456',
    role: 'admin',
    avatar: '/avatars/admin.jpg',
    phone: '5559876543',
    address: 'Ankara, Türkiye',
    status: 'active',
    assignedCourses: [],
    joinDate: '2023-01-01'
  }
];

// Sertifika mock verileri
export const mockCertificates = [
  {
    _id: 'mock-certificate-1',
    id: 'mock-certificate-1',
    studentId: 'mock-user-1',
    studentEmail: 'demo@abcakademi.com',
    courseId: 'mock-course-1',
    courseName: 'Web Geliştirme Temelleri',
    certificateNumber: 'CERT-2023-001',
    issueDate: '2023-12-20',
    status: 'active'
  }
];

// Ayarlar mock verisi
export const mockSettings = {
  _id: 'settings',
  id: 'settings',
  siteName: 'ABC Akademi',
  siteDescription: 'Profesyonel Eğitim Platformu',
  contactEmail: 'info@abcakademi.com',
  contactPhone: '0850 123 45 67',
  address: 'İstanbul, Türkiye',
  socialMedia: {
    facebook: 'https://facebook.com/abcakademi',
    twitter: 'https://twitter.com/abcakademi',
    instagram: 'https://instagram.com/abcakademi',
    linkedin: 'https://linkedin.com/company/abcakademi'
  },
  logo: '/logo.png',
  favicon: '/favicon.ico'
}; 
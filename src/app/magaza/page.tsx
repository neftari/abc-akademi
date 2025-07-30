'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  ShoppingCart, 
  Filter,
  Search,
  Award,
  Heart,
  Eye
} from 'lucide-react';
import { useCourses } from '@/contexts/CourseContext';
import { ICourse } from '@/models/Course';

interface CartItem {
  courseId: string;
  quantity: number;
  selectedOptions: {
    certificateTypes: string[];
    extras: string[];
  };
}

export default function MagazaPage() {
  const { getActiveCourses } = useCourses();
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedLevel, setSelectedLevel] = useState('Tümü');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    'Tümü',
    'Web Geliştirme',
    'Frontend',
    'Backend',
    'Mobil Geliştirme',
    'Veri Bilimi',
    'DevOps',
    'Bilişim Eğitimleri',
    'Kişisel Gelişim'
  ];

  const levels = ['Tümü', 'Başlangıç', 'Orta', 'İleri'];

  // Sertifika seçenekleri (genel)
  const certificateOptions = [
    { id: 'university', name: 'e-Devlet & Üniversite Sertifikası', price: 0 },
    { id: 'international-en', name: 'Uluslararası İngilizce Sertifika', price: 50 },
    { id: 'international-tr', name: 'Uluslararası Türkçe Sertifika', price: 50 }
  ];

  const extraOptions = [
    { id: 'transcript-uni', name: 'Üniversite Sertifikası Transkripti', price: 75 },
    { id: 'transcript-en', name: 'Uluslararası İngilizce Transkript', price: 75 },
    { id: 'transcript-tr', name: 'Uluslararası Türkçe Transkript', price: 75 },
    { id: 'print', name: 'Belgeleri Basın ve Kargolayın', price: 125 }
  ];

  // Filtreleme ve sıralama
  const getFilteredAndSortedCourses = () => {
    let courses = getActiveCourses();
    
    // Kategori filtresi
    if (selectedCategory !== 'Tümü') {
      courses = courses.filter(course => course.category === selectedCategory);
    }
    
    // Seviye filtresi
    if (selectedLevel !== 'Tümü') {
      courses = courses.filter(course => course.level === selectedLevel);
    }
    
    // Arama filtresi
    if (searchTerm) {
      courses = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sıralama
    switch (sortBy) {
      case 'price-low':
        courses.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        courses.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        courses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'students':
        courses.sort((a, b) => (b.students || 0) - (a.students || 0));
        break;
      case 'newest':
      default:
        // createdAt özelliği olmadığı için varsayılan sıralama
        courses.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
        break;
    }
    
    return courses;
  };

  const courses = getFilteredAndSortedCourses();

  // Sepete ekleme
  const addToCart = (course: ICourse) => {
    const newItem: CartItem = {
      courseId: course.id || '',
      quantity: 1,
      selectedOptions: {
        certificateTypes: ['university'], // Varsayılan olarak ücretsiz sertifika
        extras: []
      }
    };
    
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.courseId === newItem.courseId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  // Favorilere ekleme/çıkarma
  const toggleFavorite = (courseId: string) => {
    setFavorites(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Toplam sepet tutarı
  const getTotalCartAmount = () => {
    return cart.reduce((total, item) => {
      const course = getActiveCourses().find(c => c.id === item.courseId);
      if (!course) return total;
      
      let itemPrice = course.price || 0;
      
      // Sertifika ücretleri
      item.selectedOptions.certificateTypes.forEach(certType => {
        const option = certificateOptions.find(opt => opt.id === certType);
        if (option) itemPrice += option.price;
      });
      
      // Ek hizmet ücretleri
      item.selectedOptions.extras.forEach(extra => {
        const option = extraOptions.find(opt => opt.id === extra);
        if (option) itemPrice += option.price;
      });
      
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ABC Akademi Mağazası</h1>
              <p className="text-gray-600 mt-1">Sertifikalı online eğitimler ile kariyerinizi ileriye taşıyın</p>
            </div>
            
            {/* Sepet Bilgisi */}
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/sepet"
                  className="relative inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Sepet
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Link>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Toplam</div>
                  <div className="text-lg font-bold text-blue-600">₺{getTotalCartAmount()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Yan Panel - Filtreler */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtreler
              </h2>
              
              {/* Arama */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arama
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Kurs ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              {/* Kategori Filtresi */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  title="Kategori seçin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Seviye Filtresi */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seviye
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  title="Seviye seçin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              {/* Sıralama */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sıralama
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  title="Sıralama türü seçin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">En Yeni</option>
                  <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                  <option value="price-high">Fiyat (Yüksek-Düşük)</option>
                  <option value="rating">En Yüksek Puan</option>
                  <option value="students">En Popüler</option>
                </select>
              </div>

              {/* Fiyat Aralığı Bilgisi */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">💡 Fiyat Avantajları</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ e-Devlet Sertifikası Ücretsiz</li>
                  <li>✓ Uluslararası Sertifika +₺50</li>
                  <li>✓ Transkript Hizmeti +₺75</li>
                  <li>✓ Kargo Hizmeti +₺125</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ana İçerik - Kurs Listesi */}
          <div className="lg:col-span-3">
            {/* Üst Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <span className="text-gray-700">
                  <strong>{courses.length}</strong> kurs bulundu
                </span>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    Liste
                  </button>
                </div>
              </div>
            </div>

            {/* Kurs Listesi */}
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aradığınız kriterlere uygun kurs bulunamadı
                </h3>
                <p className="text-gray-500">
                  Farklı filtreler deneyin veya arama teriminizi değiştirin.
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                {courses.map((course) => (
                  <div key={course.id} className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
                    {/* Kurs Görseli */}
                    <div className={`bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'}`}>
                      <BookOpen className="h-12 w-12 text-white" />
                    </div>
                    
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          {/* Kategori Badge */}
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                            {course.category}
                          </span>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {course.title}
                          </h3>
                        </div>
                        
                        {/* Favori Butonu */}
                        <button
                          onClick={() => toggleFavorite(course.id || '')}
                          title="Favorilere ekle/çıkar"
                          className={`p-2 rounded-full transition-colors ${
                            favorites.includes(course.id || '') 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-gray-400 hover:text-gray-500'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${favorites.includes(course.id || '') ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      
                      {/* Kurs Bilgileri */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{course.students} öğrenci</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                          <span>{course.rating || 4.5}</span>
                        </div>
                      </div>
                      
                      {/* Seviye */}
                      <div className="mb-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          course.level === 'Başlangıç' ? 'bg-green-100 text-green-800' :
                          course.level === 'Orta' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.level}
                        </span>
                      </div>
                      
                      {/* Açıklama */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.courseAbout || 'Bu kurs ile yeni beceriler kazanın ve kariyerinizi ileriye taşıyın.'}
                      </p>
                      
                      {/* Özellikler */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            <Award className="h-3 w-3 mr-1" />
                            Sertifikalı
                          </span>
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            e-Devlet Onaylı
                          </span>
                        </div>
                      </div>
                      
                      {/* Fiyat ve Butonlar */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">₺{course.price}</div>
                          <div className="text-xs text-gray-500">KDV Dahil</div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Link
                            href={`/magaza/${course.id}`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            İncele
                          </Link>
                          <button
                            onClick={() => addToCart(course as ICourse)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Sepete Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination - Gelecekte eklenebilir */}
            {courses.length > 0 && (
              <div className="mt-8 flex justify-center">
                <p className="text-gray-500 text-sm">
                  Toplam {courses.length} kurs gösteriliyor
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Özellikler Bölümü */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Neden ABC Akademi?</h2>
            <p className="text-gray-600">Sertifikalı eğitimlerle kariyerinizi ileriye taşıyın</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sertifikalı Eğitim</h3>
              <p className="text-sm text-gray-600">e-Devlet ve üniversite onaylı sertifikalar</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Esnek Öğrenme</h3>
              <p className="text-sm text-gray-600">Kendi hızınızda, istediğiniz zaman</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Uzman Eğitmenler</h3>
              <p className="text-sm text-gray-600">Alanında uzman eğitmenlerden öğrenin</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kaliteli İçerik</h3>
              <p className="text-sm text-gray-600">Güncel ve kapsamlı eğitim materyalleri</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
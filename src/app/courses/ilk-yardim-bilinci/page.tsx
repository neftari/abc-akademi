'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Clock, 
  ArrowLeft, 
  CheckCircle,
  ShoppingCart,
  CreditCard,
  Info,
  FileText,
  Award,
  Phone,
  List,
  Trophy,
  Heart,
  AlertTriangle,
  Shield
} from 'lucide-react';

const courseData = {
  id: 'ilk-yardim-bilinci',
  title: 'İlk Yardım Bilinci Eğitimi Sertifika Programı',
  subtitle: '(Acil Durumlarda Hayat Kurtaracak Bilgiler)',
  originalPrice: 599,
  discountedPrice: 299,
  description: 'İlk yardım bilinci, acil durumlarda hayat kurtarabilecek temel becerilerden oluşur. Bu eğitim, günlük hayatta karşılaşabileceğiniz acil durumlar için gerekli bilgi ve becerileri kazandırmayı amaçlar.',
  features: [
    '✓ %100 Metinsel Eğitim İçeriği',
    '✓ 25 Saatlik Kapsamlı Program',
    '✓ 50+ Sayfa PDF Dökümanlar',
    '✓ İllüstrasyonlu İlk Yardım Kılavuzu',
    '✓ 8 Modül Ara Test',
    '✓ Final Sınavı',
    '✓ e-Devlet Onaylı Sertifika'
  ],
  modules: [
    {
      id: 1,
      title: 'Temel İlk Yardım Bilgisi',
      duration: '3 Saat',
      topics: [
        'İlk yardımın tanımı ve amacı',
        'İlk yardım müdahale sırası',
        'Güvenlik önlemleri',
        'Yasal sorumluluklar'
      ],
      testQuestions: 10
    },
    {
      id: 2,
      title: 'Kalp-Akciğer Canlandırması (CPR)',
      duration: '4 Saat',
      topics: [
        'CPR teknikleri',
        'Yetişkin CPR uygulaması',
        'Çocuk ve bebek CPR',
        'AED kullanımı'
      ],
      testQuestions: 15
    },
    {
      id: 3,
      title: 'Yaralanma ve Kanama Durumları',
      duration: '3 Saat',
      topics: [
        'Açık yara tedavisi',
        'Kanama kontrolü',
        'Bandaj teknikleri',
        'Kırık ve çıkık durumları'
      ],
      testQuestions: 12
    },
    {
      id: 4,
      title: 'Bayılma ve Şok Durumları',
      duration: '3 Saat',
      topics: [
        'Bilinç kaybı nedenleri',
        'Şok belirtileri',
        'Müdahale teknikleri',
        'Hastane nakliye'
      ],
      testQuestions: 10
    },
    {
      id: 5,
      title: 'Zehirlenme Vakalarında İlk Yardım',
      duration: '3 Saat',
      topics: [
        'Zehirlenme türleri',
        'İlk müdahale',
        'Zehir danışma merkezi',
        'Önleme yöntemleri'
      ],
      testQuestions: 8
    },
    {
      id: 6,
      title: 'Çocuk ve Bebeklerde İlk Yardım',
      duration: '4 Saat',
      topics: [
        'Çocuklarda özel durumlar',
        'Bebek güvenliği',
        'Ateş düşürme',
        'Nefes darlığı'
      ],
      testQuestions: 12
    },
    {
      id: 7,
      title: 'Acil Durum Yönetimi',
      duration: '3 Saat',
      topics: [
        'Kaza mahalli güvenliği',
        '112 ile iletişim',
        'Olay yeri yönetimi',
        'Çoklu yaralanma'
      ],
      testQuestions: 8
    },
    {
      id: 8,
      title: 'Özel Durumlar ve Psikolojik Destek',
      duration: '2 Saat',
      topics: [
        'Travma sonrası destek',
        'Stres yönetimi',
        'Aile bilgilendirme',
        'Takip süreci'
      ],
      testQuestions: 5
    }
  ],
  examInfo: {
    totalQuestions: 50,
    duration: 90,
    passingScore: 70,
    attempts: 3
  }
};

export default function IlkYardimBilinciPage() {
  const [selectedCertificateTypes, setSelectedCertificateTypes] = useState<string[]>(['university']);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('modules');
  // const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(courseData.discountedPrice);

  // TotalPrice'ı güncelle
  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [selectedCertificateTypes, selectedExtras]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const certificateOptions = [
    { id: 'university', name: 'e-Devlet & Üniversite Sertifikası', price: 0 },
    { id: 'international-en', name: 'Uluslararası İngilizce Sertifika', price: 50 },
    { id: 'international-tr', name: 'Uluslararası Türkçe Sertifika', price: 50 }
  ];

  const extraOptions = [
    { id: 'print-certificate', name: 'Sertifikayı Basın ve Kargolayın', price: 125 },
    { id: 'first-aid-kit', name: 'İlk Yardım Çantası (Bonus)', price: 199 },
    { id: 'mobile-app', name: 'Mobil Uygulama Erişimi', price: 49 }
  ];

  const sections = [
    { id: 'modules', title: 'Eğitim Modülleri', icon: List },
    { id: 'details', title: 'Detaylı Bilgi', icon: Info },
    { id: 'exam', title: 'Sınav Bilgisi', icon: Trophy },
    { id: 'certificate', title: 'Sertifika', icon: Award }
  ];

  const handleCertificateTypeChange = (type: string) => {
    if (selectedCertificateTypes.includes(type)) {
      setSelectedCertificateTypes(selectedCertificateTypes.filter(t => t !== type));
    } else {
      setSelectedCertificateTypes([...selectedCertificateTypes, type]);
    }
  };

  const handleExtraChange = (extra: string) => {
    if (selectedExtras.includes(extra)) {
      setSelectedExtras(selectedExtras.filter(e => e !== extra));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  // Dinamik fiyat hesaplama
  const calculateTotalPrice = () => {
    let total = courseData.discountedPrice;
    
    // Sertifika türlerine göre fiyat ekle
    selectedCertificateTypes.forEach(certType => {
      const option = certificateOptions.find(opt => opt.id === certType);
      if (option) {
        total += option.price;
      }
    });
    
    // Ek hizmetlere göre fiyat ekle
    selectedExtras.forEach(extra => {
      const option = extraOptions.find(opt => opt.id === extra);
      if (option) {
        total += option.price;
      }
    });
    
    return total;
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Gezinme */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/courses"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kurslara Dön
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana İçerik */}
          <div className="lg:col-span-2">
            {/* Kurs Başlığı */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Sağlık ve Güvenlik
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Başlangıç
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {courseData.title}
              </h1>
              <p className="text-lg text-gray-700 mb-4">{courseData.subtitle}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-red-600" />
                  <span>Hayat Kurtarıcı</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                  <span>25 Saat</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-green-600" />
                  <span>PDF Tabanlı</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-600 to-pink-700 rounded-lg p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-medium mb-2 flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Acil Durumlarda Hazır Olun
                    </p>
                    <p className="text-sm opacity-90">Hayat kurtarabilecek bilgileri öğrenin</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="flex items-center">
                      <span className="text-sm line-through opacity-75">₺{courseData.originalPrice}</span>
                      <span className="ml-2 text-2xl font-bold">₺{courseData.discountedPrice}</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">KDV Dahil</div>
                  </div>
                </div>
              </div>
              
              {/* Özellikler Listesi */}
              <div className="mt-6">
                <ul className="space-y-2">
                  {courseData.features.map((feature, index) => (
                    <li key={index} className="text-gray-700 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sekmeler */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`py-4 px-4 flex items-center whitespace-nowrap text-sm font-medium ${
                        activeSection === section.id
                          ? 'text-red-600 border-b-2 border-red-600'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <section.icon className="h-4 w-4 mr-2" />
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                {activeSection === 'modules' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Eğitim Modülleri</h2>
                    <div className="space-y-4">
                      {courseData.modules.map((module) => (
                        <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleModule(module.id)}
                            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                {module.id}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{module.title}</h3>
                                <p className="text-sm text-gray-500">{module.duration} • {module.testQuestions} Test Sorusu</p>
                              </div>
                            </div>
                            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                              expandedModule === module.id ? 'rotate-180' : ''
                            }`} />
                          </button>
                          
                          {expandedModule === module.id && (
                            <div className="px-4 py-3 bg-white">
                              <h4 className="font-medium text-gray-900 mb-2">Konu Başlıkları:</h4>
                              <ul className="space-y-1">
                                {module.topics.map((topic, topicIndex) => (
                                  <li key={topicIndex} className="text-gray-700 flex items-center">
                                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeSection === 'details' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Detaylı Bilgi</h2>
                    <div className="prose max-w-none text-gray-700">
                      <p className="font-medium mb-4">{courseData.description}</p>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-3">Kimler Katılmalı?</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Ailesi olan herkes</li>
                        <li>Eğitim sektörü çalışanları</li>
                        <li>Güvenlik personeli</li>
                        <li>Spor antrenörleri</li>
                        <li>Sürücüler ve herkes</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-3">Eğitim Formatı</h3>
                      <p>Bu kurs tamamen metinsel dökümanlar ve PDF materyalleri ile sunulmaktadır. Video içerik yoktur. Her bölüm sonunda ara testler ve kurs sonunda final sınavı bulunmaktadır.</p>
                    </div>
                  </div>
                )}
                
                {activeSection === 'exam' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Sınav Bilgisi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Final Sınavı</h3>
                        <ul className="space-y-2 text-blue-800">
                          <li>• Toplam {courseData.examInfo.totalQuestions} soru</li>
                          <li>• Süre: {courseData.examInfo.duration} dakika</li>
                          <li>• Geçme notu: %{courseData.examInfo.passingScore}</li>
                          <li>• {courseData.examInfo.attempts} deneme hakkı</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2">Ara Testler</h3>
                        <ul className="space-y-2 text-green-800">
                          <li>• 8 farklı modül testi</li>
                          <li>• Toplam {courseData.modules.reduce((sum, module) => sum + module.testQuestions, 0)} pratik sorusu</li>
                          <li>• Anında sonuç</li>
                          <li>• Tekrar yapılabilir</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeSection === 'certificate' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Sertifika Bilgisi</h2>
                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <Award className="h-8 w-8 text-yellow-600 mr-3" />
                        <h3 className="text-lg font-semibold text-yellow-900">e-Devlet Onaylı Sertifika</h3>
                      </div>
                      <ul className="space-y-2 text-yellow-800">
                        <li>✓ T.C. Sağlık Bakanlığı onaylı</li>
                        <li>✓ e-Devlet sisteminde görünür</li>
                        <li>✓ Kamu ve özel sektörde geçerli</li>
                        <li>✓ PDF formatında dijital teslimat</li>
                        <li>✓ QR kod ile doğrulanabilir</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Yan Panel - Satın Alma */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 line-through">₺{courseData.originalPrice}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    %50 İndirim
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">₺{calculateTotalPrice()}</div>
                <div className="text-sm text-gray-500">KDV Dahil</div>
              </div>
              
              {/* Sertifika Türü Seçimi */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sertifika Türü Seçiniz
                </label>
                <div className="space-y-2">
                  {certificateOptions.map((option) => (
                    <div key={option.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`cert-type-${option.id}`}
                          className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                          checked={selectedCertificateTypes.includes(option.id)}
                          onChange={() => handleCertificateTypeChange(option.id)}
                        />
                        <label htmlFor={`cert-type-${option.id}`} className="ml-2 text-sm text-gray-700">
                          {option.name}
                        </label>
                      </div>
                      {option.price > 0 && (
                        <span className="text-sm font-medium text-gray-700">+₺{option.price}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Ek Hizmetler */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ek Hizmetler (İsteğe Bağlı)
                </label>
                <div className="space-y-2">
                  {extraOptions.map((option) => (
                    <div key={option.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`extra-${option.id}`}
                          className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                          checked={selectedExtras.includes(option.id)}
                          onChange={() => handleExtraChange(option.id)}
                        />
                        <label htmlFor={`extra-${option.id}`} className="ml-2 text-sm text-gray-700">
                          {option.name}
                        </label>
                      </div>
                      <span className="text-sm font-medium text-gray-700">+₺{option.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Satın Alma Butonları */}
              <div className="space-y-3">
                <button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Sepete Ekle
                </button>
                <button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Hemen Satın Al
                </button>
              </div>
              
              {/* Acil Uyarı */}
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-sm font-medium text-red-900">Önemli!</span>
                </div>
                <p className="text-sm text-red-800 mt-1">
                  Bu eğitim teorik bilgi sağlar. Uygulamalı eğitim için yerel sağlık kuruluşlarına başvurun.
                </p>
              </div>
              
              {/* İletişim Bilgisi */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 mr-2 text-red-600" />
                  <span className="font-medium">Acil Durum: 112</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Sorularınız için: 0850 550 50 54
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ChevronDown komponenti - lucide-react'ta mevcut değilse manuel ekliyoruz
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
} 
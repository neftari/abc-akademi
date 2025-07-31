'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  Users, 
  ArrowLeft, 
  CheckCircle,
  ShoppingCart,
  CreditCard,
  Info,
  Award,
  Phone,
  Trophy,
  Theater,
  GraduationCap,
  Target,
  Lightbulb,
  Heart,
  PlayCircle
} from 'lucide-react';


const courseData = {
  id: 'yaratici-drama-egitim',
  title: 'Yaratıcı Drama ile Eğitim Sertifika Programı',
  subtitle: '(Eğitimciler için Modern Öğretim Teknikleri)',
  originalPrice: 899,
  discountedPrice: 459,
  description: 'Yaratıcı drama teknikleri ile eğitim süreçlerini zenginleştiren, öğrenci merkezli öğretim yöntemlerini içeren kapsamlı eğitim programı. Eğitimciler için alternatif öğretim teknikleri sunar.',
  features: [
    '✓ %100 Pedagojik İçerik',
    '✓ 35 Saatlik Uzman Program',
    '✓ 200+ Sayfa Drama Teknikleri Kılavuzu',
    '✓ 100+ Hazır Drama Etkinliği',
    '✓ Yaş Gruplarına Özel Uygulamalar',
    '✓ 15 Modül Ara Test',
    '✓ Ders Planı Şablonları',
    '✓ Eğitim Sertifikası'
  ],
  modules: [
    {
      id: 1,
      title: 'Yaratıcı Drama Temelleri',
      duration: '4 Saat',
      topics: [
        'Drama tarihçesi ve kuramsal temeller',
        'Eğitimde drama kullanımının önemi',
        'Drama tekniklerinin sınıflandırılması',
        'Yaratıcı drama ve diğer sanat dalları'
      ],
      activities: 8,
      ageGroups: ['Tüm yaşlar'],
      testQuestions: 12
    },
    {
      id: 2,
      title: 'Eğitimde Drama Teknikleri',
      duration: '5 Saat',
      topics: [
        'Rol oynama teknikleri',
        'İmprovizasyon uygulamaları',
        'Yaratıcı hareket etkinlikleri',
        'Ses ve ritim çalışmaları'
      ],
      activities: 12,
      ageGroups: ['6-18 yaş'],
      testQuestions: 15
    },
    {
      id: 3,
      title: 'Yaş Gruplarına Göre Drama',
      duration: '5 Saat',
      topics: [
        'Okul öncesi drama etkinlikleri',
        'İlkokul çağı uygulamaları',
        'Ortaokul ve lise teknikleri',
        'Yetişkin eğitiminde drama'
      ],
      activities: 16,
      ageGroups: ['3-99 yaş'],
      testQuestions: 18
    },
    {
      id: 4,
      title: 'Ders İçi Drama Uygulamaları',
      duration: '4 Saat',
      topics: [
        'Türkçe dersinde drama',
        'Matematik ve fen derslerinde uygulama',
        'Sosyal bilgiler ve tarih dersleri',
        'Yabancı dil öğretiminde drama'
      ],
      activities: 10,
      ageGroups: ['6-18 yaş'],
      testQuestions: 12
    },
    {
      id: 5,
      title: 'Empati Geliştirme Teknikleri',
      duration: '3 Saat',
      topics: [
        'Duygusal zeka geliştirme',
        'Perspektif alma becerileri',
        'Karakter analizi çalışmaları',
        'Sosyal beceri geliştirme'
      ],
      activities: 8,
      ageGroups: ['5-18 yaş'],
      testQuestions: 10
    },
    {
      id: 6,
      title: 'Grup Dinamikleri ve Yönetimi',
      duration: '4 Saat',
      topics: [
        'Sınıf yönetimi teknikleri',
        'Grup oluşturma stratejileri',
        'Çatışma çözme metodları',
        'İşbirlikçi öğrenme'
      ],
      activities: 6,
      ageGroups: ['Tüm yaşlar'],
      testQuestions: 12
    },
    {
      id: 7,
      title: 'Drama ile Değerlendirme',
      duration: '3 Saat',
      topics: [
        'Alternatif değerlendirme yaklaşımları',
        'Performans değerlendirmesi',
        'Öz değerlendirme teknikleri',
        'Portfolyo oluşturma'
      ],
      activities: 5,
      ageGroups: ['8-18 yaş'],
      testQuestions: 8
    },
    {
      id: 8,
      title: 'Özel Eğitimde Drama Kullanımı',
      duration: '4 Saat',
      topics: [
        'Özel gereksinimli öğrenciler için uyarlama',
        'Otizm spektrumu için drama',
        'Öğrenme güçlüğü olan çocuklarla çalışma',
        'Kaynaştırma eğitiminde drama'
      ],
      activities: 12,
      ageGroups: ['Özel gereksinimli'],
      testQuestions: 15
    },
    {
      id: 9,
      title: 'Yaratıcılık ve İnovasyon',
      duration: '3 Saat',
      topics: [
        'Yaratıcı düşünme teknikleri',
        'Problem çözme becerileri',
        'İnovatif drama uygulamaları',
        'Girişimcilik eğitiminde drama'
      ],
      activities: 8,
      ageGroups: ['10-18 yaş'],
      testQuestions: 10
    },
    {
      id: 10,
      title: 'Proje Geliştirme ve Uygulama',
      duration: '5 Saat',
      topics: [
        'Drama projesi tasarlama',
        'Materyal geliştirme',
        'Veliler ve okul yönetimi ile işbirliği',
        'Sonuç değerlendirme ve raporlama'
      ],
      activities: 5,
      ageGroups: ['Projeler'],
      testQuestions: 10
    }
  ],
  examInfo: {
    totalQuestions: 75,
    duration: 150,
    passingScore: 80,
    attempts: 3,
    sections: ['Teori', 'Uygulama Planları', 'Vaka Analizi', 'Proje Tasarımı']
  },
  targetAudience: [
    'Öğretmenler (tüm branşlar)',
    'Rehber öğretmenler',
    'Anaokulu öğretmenleri',
    'Özel eğitim uzmanları',
    'Eğitim koordinatörleri',
    'Kurumsal eğitmenler'
  ]
};

export default function YaraticiDramaEgitimPage() {
  const [selectedCertificateTypes, setSelectedCertificateTypes] = useState<string[]>(['university']);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('modules');
  // const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(courseData.discountedPrice);

  // Dinamik fiyat hesaplama
  const calculateTotalPrice = useCallback(() => {
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
  }, [selectedCertificateTypes, selectedExtras]);

  // TotalPrice'ı güncelle
  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [selectedCertificateTypes, selectedExtras, calculateTotalPrice]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const certificateOptions = [
    { id: 'university', name: 'e-Devlet & Üniversite Sertifikası', price: 0 },
    { id: 'international-en', name: 'Uluslararası İngilizce Sertifika', price: 50 },
    { id: 'international-tr', name: 'Uluslararası Türkçe Sertifika', price: 50 },
    { id: 'meb-approved', name: 'MEB Onaylı Öğretmen Sertifikası', price: 100 }
  ];

  const extraOptions = [
    { id: 'print-certificate', name: 'Sertifikayı Basın ve Kargolayın', price: 125 },
    { id: 'drama-materials', name: 'Drama Malzemeleri Kiti', price: 299 },
    { id: 'mobile-app', name: 'Mobil Uygulama Erişimi', price: 49 },
    { id: 'workshop-kit', name: 'Atölye Çalışma Kiti (Basılı)', price: 199 },
    { id: 'video-examples', name: 'Video Uygulama Örnekleri', price: 149 }
  ];

  const sections = [
    { id: 'modules', title: 'Eğitim Modülleri', icon: Theater },
    { id: 'details', title: 'Program Detayları', icon: Info },
    { id: 'activities', title: 'Drama Etkinlikleri', icon: PlayCircle },
    { id: 'target', title: 'Hedef Kitle', icon: Target },
    { id: 'exam', title: 'Değerlendirme', icon: Trophy },
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

  const toggleModule = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const getTotalActivities = () => {
    return courseData.modules.reduce((sum, module) => sum + module.activities, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Gezinme */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/courses"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Eğitim ve Pedagoji
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  İleri Seviye
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {courseData.title}
              </h1>
              <p className="text-lg text-gray-700 mb-4">{courseData.subtitle}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1 text-purple-600" />
                  <span>Eğitimciler İçin</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                  <span>35 Saat</span>
                </div>
                <div className="flex items-center">
                  <Theater className="h-4 w-4 mr-1 text-green-600" />
                  <span>{getTotalActivities()} Etkinlik</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-orange-600" />
                  <span>Tüm Yaş Grupları</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-lg p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-medium mb-2 flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2" />
                      Yaratıcı Eğitim Teknikleri
                    </p>
                    <p className="text-sm opacity-90">Öğrenci katılımını artıran modern pedagoji</p>
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
                          ? 'text-purple-600 border-b-2 border-purple-600'
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
                              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                {module.id}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{module.title}</h3>
                                <p className="text-sm text-gray-500">{module.duration} • {module.activities} Etkinlik • {module.ageGroups.join(', ')}</p>
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
                                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
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
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Program Detayları</h2>
                    <div className="prose max-w-none text-gray-700">
                      <p className="font-medium mb-4">{courseData.description}</p>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-3">Eğitim Yaklaşımı</h3>
                      <p>Bu program, teorik bilgiyi praktik uygulamalarla harmanlayan bir yaklaşım benimser. Her modül, gerçek sınıf ortamında uygulanabilir etkinlikler ve senaryolar içerir.</p>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-3">Uygulama Alanları</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Okul öncesi eğitim kurumları</li>
                        <li>İlköğretim ve ortaöğretim okulları</li>
                        <li>Özel eğitim merkezleri</li>
                        <li>Yetişkin eğitimi kurumları</li>
                        <li>Kurumsal eğitim departmanları</li>
                        <li>Toplum merkezleri ve NGO&apos;lar</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-3">Eğitim Formatı</h3>
                      <p>Tamamen metinsel içerik ile sunulan bu program, video içerik bulundurmaz. Detaylı açıklamalar, şemalar, etkinlik planları ve değerlendirme araçları ile zenginleştirilmiştir.</p>
                    </div>
                  </div>
                )}
                
                {activeSection === 'activities' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Drama Etkinlikleri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-pink-900 mb-2 flex items-center">
                          <Theater className="h-5 w-5 mr-2" />
                          Etkinlik Türleri
                        </h3>
                        <ul className="space-y-2 text-pink-800">
                          <li>• Rol oynama senaryoları</li>
                          <li>• İmprovizasyon oyunları</li>
                          <li>• Yaratıcı hareket etkinlikleri</li>
                          <li>• Ses ve ritim çalışmaları</li>
                          <li>• Empati geliştirme oyunları</li>
                          <li>• Problem çözme dramları</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Yaş Grupları
                        </h3>
                        <ul className="space-y-2 text-green-800">
                          <li>• 3-6 yaş: Oyun temelli etkinlikler</li>
                          <li>• 7-10 yaş: Hikaye dramları</li>
                          <li>• 11-14 yaş: Karakter analizi</li>
                          <li>• 15-18 yaş: Sosyal konular</li>
                          <li>• Yetişkin: Empati ve iletişim</li>
                          <li>• Özel gereksinimli: Uyarlanmış dramalar</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Etkinlik İstatistikleri</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{getTotalActivities()}</div>
                          <div className="text-sm text-gray-600">Toplam Etkinlik</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">200+</div>
                          <div className="text-sm text-gray-600">Sayfa Kılavuz</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">15</div>
                          <div className="text-sm text-gray-600">Farklı Teknik</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">6</div>
                          <div className="text-sm text-gray-600">Yaş Kategorisi</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeSection === 'target' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Hedef Kitle</h2>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Kimler Katılmalı?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courseData.targetAudience.map((audience, index) => (
                          <div key={index} className="flex items-center text-blue-800">
                            <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                            {audience}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-2">Ön Koşullar</h3>
                      <ul className="space-y-2 text-yellow-800">
                        <li>• Eğitim alanında temel bilgi sahibi olmak</li>
                        <li>• Öğretmenlik deneyimi (tercihen, zorunlu değil)</li>
                        <li>• Yaratıcı etkinliklere açık olmak</li>
                        <li>• Öğrenci merkezli eğitime ilgi duymak</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeSection === 'exam' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Değerlendirme Sistemi</h2>
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
                        <h3 className="font-semibold text-green-900 mb-2">Ara Değerlendirmeler</h3>
                        <ul className="space-y-2 text-green-800">
                          <li>• 15 modül test</li>
                          <li>• Etkinlik planlama ödevleri</li>
                          <li>• Vaka analizi çalışmaları</li>
                          <li>• Proje tasarım sunumları</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">Sınav Bölümleri</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {courseData.examInfo.sections.map((section, index) => (
                          <div key={index} className="text-center text-purple-800">
                            <div className="font-medium">{section}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeSection === 'certificate' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Sertifika Bilgisi</h2>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <Award className="h-8 w-8 text-purple-600 mr-3" />
                        <h3 className="text-lg font-semibold text-purple-900">Yaratıcı Drama Eğitmeni Sertifikası</h3>
                      </div>
                      <ul className="space-y-2 text-purple-800">
                        <li>✓ Eğitim Bakanlığı onaylı</li>
                        <li>✓ e-Devlet sisteminde görünür</li>
                        <li>✓ Kamu ve özel sektörde geçerli</li>
                        <li>✓ PDF formatında dijital teslimat</li>
                        <li>✓ Yaratıcı drama uzmanı belgesi</li>
                        <li>✓ QR kod ile doğrulanabilir</li>
                        <li>✓ Uluslararası geçerliliğe sahip</li>
                      </ul>
                    </div>
                    
                    <div className="mt-6 bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">Sertifika Faydaları</h3>
                      <ul className="space-y-1 text-green-800">
                        <li>• Öğretmen performans değerlendirmesinde avantaj</li>
                        <li>• Atama sınavlarında ek puan</li>
                        <li>• Özel okul başvurularında fark yaratır</li>
                        <li>• Eğitim danışmanlığı yapabilme yetkinliği</li>
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
                    %49 İndirim
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">₺{totalPrice}</div>
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
                          className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
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
                          className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
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
              
              {/* Eğitimci Uyarısı */}
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-900">Eğitimci Programı</span>
                </div>
                <p className="text-sm text-purple-800 mt-1">
                  Bu program öğretmenler ve eğitimciler için tasarlanmıştır. Pratik uygulamalar içerir.
                </p>
              </div>
              
              {/* Satın Alma Butonları */}
              <div className="space-y-3">
                <button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
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
              
              {/* Bonus Bilgi */}
              <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
                <h4 className="font-medium text-pink-900 mb-2 flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Bonus İçerikler
                </h4>
                <ul className="text-sm text-pink-800 space-y-1">
                  <li>• Drama malzemeleri listesi</li>
                  <li>• Ders planı şablonları</li>
                  <li>• Değerlendirme formları</li>
                  <li>• Yaş grupları rehberi</li>
                  <li>• Veli bilgilendirme dokümanları</li>
                </ul>
              </div>
              
              {/* İletişim Bilgisi */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 mr-2 text-purple-600" />
                  <span className="font-medium">Eğitim Danışmanlığı</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  0850 550 50 54 - Pedagoji uzmanlarımızla konuşun
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ChevronDown komponenti
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
} 
'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Clock, 
  ArrowLeft, 
  CheckCircle,
  ShoppingCart,
  CreditCard,
  Info,
  Award,
  Phone,
  Trophy,
  MessageCircle,
  Globe,
  Headphones,
  Mic
} from 'lucide-react';


const courseData = {
  id: 'ingilizce-konusma-pratigi',
  title: 'İngilizce Konuşma Pratiği Eğitimi Sertifika Programı',
  subtitle: '(A2-B1 Seviyesi Konuşma Becerisi Geliştirme)',
  originalPrice: 799,
  discountedPrice: 399,
  description: 'İngilizce konuşma becerinizi geliştirmek için tasarlanmış interaktif eğitim programı. Günlük hayat konuşmaları, iş dünyası İngilizcesi ve sosyal iletişim becerilerinizi güçlendirir.',
  features: [
    '✓ %100 Metinsel Diyalog Eğitimi',
    '✓ 40 Saatlik Konuşma Programı',
    '✓ 120+ Sayfa Konuşma Kılavuzu',
    '✓ 500+ Günlük Kullanım Kelimesi',
    '✓ 50 Farklı Konuşma Senaryosu',
    '✓ 12 Modül Ara Test',
    '✓ Telaffuz Rehberi PDF',
    '✓ Sertifika Onaylı Program'
  ],
  modules: [
    {
      id: 1,
      title: 'Temel Konuşma Kalıpları',
      duration: '4 Saat',
      topics: [
        'Selamlaşma ve vedalaşma',
        'Kendini tanıtma',
        'Temel soru cümleleri',
        'Günlük nezaket ifadeleri'
      ],
      dialogues: 8,
      vocabulary: 45,
      testQuestions: 15
    },
    {
      id: 2,
      title: 'Günlük Hayat Diyalogları',
      duration: '5 Saat',
      topics: [
        'Alışveriş diyalogları',
        'Restoran konuşmaları',
        'Ulaşım ve yol tarifi',
        'Hastane ve eczane'
      ],
      dialogues: 12,
      vocabulary: 60,
      testQuestions: 18
    },
    {
      id: 3,
      title: 'İş Dünyası İletişimi',
      duration: '6 Saat',
      topics: [
        'İş görüşmesi diyalogları',
        'Ofis ortamı konuşmaları',
        'Müşteri hizmetleri',
        'E-posta yazışma kalıpları'
      ],
      dialogues: 10,
      vocabulary: 80,
      testQuestions: 20
    },
    {
      id: 4,
      title: 'Sosyal Ortamda İngilizce',
      duration: '4 Saat',
      topics: [
        'Arkadaş sohbetleri',
        'Parti ve etkinlik konuşmaları',
        'Hobi ve ilgi alanları',
        'Spor ve eğlence'
      ],
      dialogues: 8,
      vocabulary: 55,
      testQuestions: 12
    },
    {
      id: 5,
      title: 'Telefon Konuşmaları',
      duration: '3 Saat',
      topics: [
        'Resmi telefon görüşmeleri',
        'Randevu alma diyalogları',
        'Şikayet ve talep',
        'Acil durum konuşmaları'
      ],
      dialogues: 6,
      vocabulary: 40,
      testQuestions: 10
    },
    {
      id: 6,
      title: 'Sunum ve Toplantı İngilizcesi',
      duration: '6 Saat',
      topics: [
        'Sunum başlangıç kalıpları',
        'Grafik ve veri açıklama',
        'Toplantı yönetme',
        'Soru-cevap oturumları'
      ],
      dialogues: 8,
      vocabulary: 70,
      testQuestions: 15
    },
    {
      id: 7,
      title: 'Seyahat İngilizcesi',
      duration: '4 Saat',
      topics: [
        'Havaalanı diyalogları',
        'Otel rezervasyonu',
        'Turist rehberi konuşmaları',
        'Acil durum ifadeleri'
      ],
      dialogues: 10,
      vocabulary: 50,
      testQuestions: 12
    },
    {
      id: 8,
      title: 'Hata Analizi ve Düzeltme',
      duration: '3 Saat',
      topics: [
        'Yaygın konuşma hataları',
        'Telaffuz düzeltmeleri',
        'Gramer hata analizi',
        'İntonasyon egzersizleri'
      ],
      dialogues: 5,
      vocabulary: 30,
      testQuestions: 8
    },
    {
      id: 9,
      title: 'Akıcılık Geliştirme',
      duration: '3 Saat',
      topics: [
        'Hızlı konuşma teknikleri',
        'Bağlantı kelimeleri',
        'Konuşma ritmi',
        'Doğal ifade kalıpları'
      ],
      dialogues: 6,
      vocabulary: 35,
      testQuestions: 10
    },
    {
      id: 10,
      title: 'İleri Düzey Konuşma',
      duration: '2 Saat',
      topics: [
        'Tartışma teknikleri',
        'Görüş bildirme',
        'İkna etme sanatı',
        'Kültürel farkındalık'
      ],
      dialogues: 4,
      vocabulary: 25,
      testQuestions: 8
    }
  ],
  examInfo: {
    totalQuestions: 60,
    duration: 120,
    passingScore: 75,
    attempts: 3,
    sections: ['Vocabulary', 'Grammar', 'Reading Comprehension', 'Dialogue Analysis']
  }
};

export default function IngilizceKonusmaPratigiPage() {
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
    { id: 'cambridge-style', name: 'Cambridge Tarzı Sertifika', price: 75 }
  ];

  const extraOptions = [
    { id: 'print-certificate', name: 'Sertifikayı Basın ve Kargolayın', price: 125 },
    { id: 'pronunciation-guide', name: 'Sesli Telaffuz Rehberi', price: 99 },
    { id: 'mobile-app', name: 'Mobil Uygulama Erişimi', price: 49 },
    { id: 'conversation-book', name: 'Basılı Konuşma Kitabı', price: 149 }
  ];

  const sections = [
    { id: 'modules', title: 'Konuşma Modülleri', icon: MessageCircle },
    { id: 'details', title: 'Program Detayları', icon: Info },
    { id: 'vocabulary', title: 'Kelime Dağarcığı', icon: BookOpen },
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

  const getTotalVocabulary = () => {
    return courseData.modules.reduce((sum, module) => sum + module.vocabulary, 0);
  };

  const getTotalDialogues = () => {
    return courseData.modules.reduce((sum, module) => sum + module.dialogues, 0);
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Dil Eğitimi
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Orta Seviye
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {courseData.title}
              </h1>
              <p className="text-lg text-gray-700 mb-4">{courseData.subtitle}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1 text-blue-600" />
                  <span>A2-B1 Level</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                  <span>40 Saat</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1 text-green-600" />
                  <span>{getTotalDialogues()} Diyalog</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1 text-purple-600" />
                  <span>{getTotalVocabulary()} Kelime</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-medium mb-2 flex items-center">
                      <Mic className="h-5 w-5 mr-2" />
                      Speak English Confidently
                    </p>
                    <p className="text-sm opacity-90">Practice makes perfect - İngilizce konuşma pratiği</p>
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
                          ? 'text-blue-600 border-b-2 border-blue-600'
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
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Konuşma Modülleri</h2>
                    <div className="space-y-4">
                      {courseData.modules.map((module) => (
                        <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleModule(module.id)}
                            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                {module.id}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{module.title}</h3>
                                <p className="text-sm text-gray-500">{module.duration} • {module.dialogues} Diyalog • {module.vocabulary} Kelime</p>
                              </div>
                            </div>
                            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                              expandedModule === module.id ? 'rotate-180' : ''
                            }`} />
                          </button>
                          
                          {expandedModule === module.id && (
                            <div className="px-4 py-3 bg-white">
                              <h4 className="font-medium text-gray-900 mb-2">Konuşma Konuları:</h4>
                              <ul className="space-y-1">
                                {module.topics.map((topic, topicIndex) => (
                                  <li key={topicIndex} className="text-gray-700 flex items-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
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
                      
                      <h3 className="text-lg font-semibold mt-6 mb-3">Eğitim Metodolojisi</h3>
                      <p>Metinsel diyaloglar, kelime listeleri ve pratik alıştırmalarla desteklenen yazılı eğitim formatı. Her ünitede konuşma pratiği için hazırlanmış senaryolar ve kendini değerlendirme testleri.</p>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-3">Kimler Katılabilir?</h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>A2 seviyesi İngilizce bilgisi olanlar</li>
                        <li>Konuşma becerisini geliştirmek isteyenler</li>
                        <li>İş dünyasında İngilizce kullanacaklar</li>
                        <li>Yurtdışı seyahat edecekler</li>
                        <li>Sosyal ortamlarda rahat konuşmak isteyenler</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-3">Eğitim Formatı</h3>
                      <p>Bu kurs tamamen metinsel içeriklerle sunulmaktadır. Video içerik yoktur. Konuşma pratiği için hazırlanmış diyaloglar, kelime listeleri ve telaffuz rehberi ile öğrenme desteklenir.</p>
                    </div>
                  </div>
                )}
                
                {activeSection === 'vocabulary' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Kelime Dağarcığı Geliştirme</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                          <BookOpen className="h-5 w-5 mr-2" />
                          Kelime Kategorileri
                        </h3>
                        <ul className="space-y-2 text-purple-800">
                          <li>• Günlük yaşam kelimeleri</li>
                          <li>• İş dünyası terminolojisi</li>
                          <li>• Seyahat ve turizm</li>
                          <li>• Sağlık ve spor</li>
                          <li>• Teknoloji ve medya</li>
                          <li>• Sosyal etkinlikler</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                          <Headphones className="h-5 w-5 mr-2" />
                          Öğrenme Teknikleri
                        </h3>
                        <ul className="space-y-2 text-blue-800">
                          <li>• Bağlamsal kelime öğrenme</li>
                          <li>• Eş anlamlı kelime grupları</li>
                          <li>• Günlük kullanım örnekleri</li>
                          <li>• Telaffuz rehberi</li>
                          <li>• Hafıza teknikleri</li>
                          <li>• Pratik alıştırmalar</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Toplam Kelime Dağılımı</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{getTotalVocabulary()}</div>
                          <div className="text-sm text-gray-600">Toplam Kelime</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{getTotalDialogues()}</div>
                          <div className="text-sm text-gray-600">Diyalog Örneği</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">50</div>
                          <div className="text-sm text-gray-600">Konuşma Senaryosu</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">120+</div>
                          <div className="text-sm text-gray-600">Sayfa PDF</div>
                        </div>
                      </div>
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
                          <li>• 12 modül test</li>
                          <li>• Kelime testleri</li>
                          <li>• Diyalog analizi</li>
                          <li>• Anında geri bildirim</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-2">Sınav Bölümleri</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {courseData.examInfo.sections.map((section, index) => (
                          <div key={index} className="text-center text-yellow-800">
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
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <Award className="h-8 w-8 text-blue-600 mr-3" />
                        <h3 className="text-lg font-semibold text-blue-900">İngilizce Konuşma Yetkinlik Sertifikası</h3>
                      </div>
                      <ul className="space-y-2 text-blue-800">
                        <li>✓ Dil eğitimi kurumu onaylı</li>
                        <li>✓ e-Devlet sisteminde görünür</li>
                        <li>✓ İş başvurularında geçerli</li>
                        <li>✓ PDF formatında dijital teslimat</li>
                        <li>✓ A2-B1 seviye belgelendirmesi</li>
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
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
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
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
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
              
              {/* Seviye Uyarısı */}
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-900">Seviye Uyarısı</span>
                </div>
                <p className="text-sm text-yellow-800 mt-1">
                  Bu kurs A2-B1 seviyesi için tasarlanmıştır. Temel İngilizce bilginiz olmalıdır.
                </p>
              </div>
              
              {/* Satın Alma Butonları */}
              <div className="space-y-3">
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
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
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Bonus İçerikler</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 500+ kelimelik sözlük</li>
                  <li>• Günlük İngilizce ifadeler</li>
                  <li>• Telaffuz rehberi</li>
                  <li>• Mobil uyumlu platform</li>
                </ul>
              </div>
              
              {/* İletişim Bilgisi */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="font-medium">Dil Danışmanlığı</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  0850 550 50 54 - İngilizce seviye testi ve önerileri
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
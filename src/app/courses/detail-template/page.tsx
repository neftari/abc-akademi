'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  ArrowLeft, 
  Calendar,
  ShoppingCart,
  CreditCard,
  Info,
  HelpCircle,
  FileText,
  Award,
  Phone
} from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';

// Demo kurs verisi
const courseData = {
  id: 'aile-danismanligi-egitimi',
  title: 'Aile Danışmanlığı Eğitimi Sertifika Programı',
  subtitle: '(Danışmanlık Merkezi Şartını Sağlar)',
  originalPrice: 10000,
  discountedPrice: 4990,
  description: 'Aile Danışmanlığı Eğitimi Sertifika Programımız, e-devlet ve üniversite onaylı olup, Aile ve Sosyal Hizmetler Bakanlığının belirttiği tüm şartlara ve Aile Danışmanı Merkezleri Yönetmeliği\'ne uygun olarak hazırlanmıştır. Aile Danışmanlığı merkezi açmak isteyen kişilerden istenilen zorunlu ve geçerli sertifikadır.',
  features: [
    '✓ %100 Online Eğitim (Asenkron)',
    '✓ 464 Saatlik Eğitim Sertifikası',
    '✓ 49 Video Ders, 1925 Sayfa PDF ve Online Test',
    '✓ 1 İş Gününde Eğitime Başlama',
    '✓ 1-3 İş Gününde Sertifika Onayı ve İşleme',
    '✓ Sertifikalar PDF Formatında Dijital Olarak Gönderilir',
    '✓ Kamu ve Özel Sektörde Geçerli'
  ],
  longDescription: `Aile danışmanlığı ve süpervizyon, modern dünyada ailelerin karşılaştığı karmaşık sorunlarla başa çıkmada hayati bir rol oynar. Aile danışmanları, aile sağlığını koruma, aile içi iletişimi geliştirme, çeşitli psikolojik ve hukuki meselelerde rehberlik etme konularında uzmanlaşmıştır.

Aile danışmanlığı ve süpervizyon sertifika programı, bu alanda uzmanlaşmak isteyen profesyonellere kapsamlı bir eğitim sunar. Bu programın içeriğinde aile sağlığı, aile iletişimi, danışma psikolojisi kuramları, gelişim psikolojisi ve daha birçok önemli konu yer almaktadır.`,
  startInfo: 'Başvurunuza müteakiben 1 iş gününde sisteme giriş adresi, kullanıcı adınız ve şifreniz tarafınıza gönderilecektir.',
  contactInfo: `Farklı sorularınız var ise öncelikle **Sıkça Sorulan Sorular** sayfamızı incelemenizi tavsiye ederiz.

Bize ulaşmak isterseniz canlı desteğe bağlanabilir, **0 850 550 50 54** çağrı merkezimizi arayabilir, aynı numaradan **WhatsApp** ile ulaşabilir ya da **info@abcakademi.com** adresine eposta gönderebilirsiniz.

🕒 Hafta içi 08:30 - 17:30  
🕒 Cumartesi: 09:00 - 15:00  
🕒 Pazar günleri, bayram tatillerinde ve mesai saatleri dışında canlı destek veremiyoruz, fakat web sitemizde başvurular 7/24 açıktır.`,
  additionalInfo: `◆ Sertifika programları dijital içerik olduğundan ücret iadesi, iptal ve değişiklik yapılamamaktadır. Başvuru yapmadan önce bilgileri dikkatli bir şekilde okumanızı tavsiye ederiz.  
◆ Üniversite ve uluslararası onay mercii sadece belgelendirme hizmeti sunmakta olup, iş garantisi vermemektedir. Bu konuda üniversite, uluslararası onay mercii ve kurumumuz sorumluluk taşımamaktadır.  
◆ Sertifikalar, kamu ve özel sektörde geçerli olup kullanılabilmektedir. Ancak, sertifikanın kabul edilip edilmemesi tamamen belgeyi sunacağınız kurumun insiyatifindedir. Bu konuda üniversite, uluslararası onay mercii ve kurumumuz sorumluluk taşımamaktadır.  
◆ TC kimlik numarası olmayan yabancı uyruklu vatandaşlar pasaport numaraları ya da herhangi bir kimlik numarası ile başvuru yapabilir. Bu kişilerin TC numaraları olmadığından sertifikaları e-devlete işlenememektedir. Bu durumdaki katılımcıların sertifikaları PDF formatında dijital olarak gönderilir.  
◆ Bir sertifika programının sertifika saatinin hesaplanmasında video dersler, e-ders notları, interaktif metin dersleri, bireysel çalışmalar ve sınav süreleri dikkate alınmaktadır. Hesaplama parametreleri programa göre değişkenlik göstermektedir. Dolayısıyla sertifika saati, sadece video saati anlamına gelmemektedir ve birbirinden farklıdır.`,
  relatedCourses: [
    {
      id: 'bebek-bakimi',
      title: 'Bebek Bakımı ve Bakıcılığı Eğitimi Sertifika Programı',
      subtitle: '(SGK Çalışan Anne Desteği Belgesi)',
      originalPrice: 4000,
      discountedPrice: 1990
    },
    {
      id: 'sekreterlik',
      title: 'Sekreterlik Eğitimi Sertifika Programı',
      originalPrice: 4000,
      discountedPrice: 1990
    },
    {
      id: 'okul-oncesi',
      title: 'Okul Öncesi Çocuk Gelişimi Eğitimi Sertifika Programı',
      subtitle: '(SGK Çalışan Anne Desteği Belgesi)',
      originalPrice: 4000,
      discountedPrice: 1990
    }
  ],
  certificateOptions: [
    { id: 'university', name: 'e-Devlet & Üniversite Sertifikası', price: 0 },
    { id: 'international-en', name: 'Uluslararası İngilizce Sertifika', price: 50 },
    { id: 'international-tr', name: 'Uluslararası Türkçe Sertifika', price: 50 }
  ],
  extraOptions: [
    { id: 'transcript-uni', name: 'Üniversite Sertifikası Transkripti', price: 75 },
    { id: 'transcript-en', name: 'Uluslararası İngilizce Transkript', price: 75 },
    { id: 'transcript-tr', name: 'Uluslararası Türkçe Transkript', price: 75 },
    { id: 'print', name: 'Belgeleri Basın ve Kargolayın', price: 125 }
  ]
};

export default function CourseDetailTemplatePage() {
  const [selectedCertificateTypes, setSelectedCertificateTypes] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('summary');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(courseData.discountedPrice);

  // Toplam fiyatı hesapla
  useEffect(() => {
    let price = courseData.discountedPrice;
    
    // Sertifika türlerine göre fiyat ekle
    selectedCertificateTypes.forEach(certType => {
      const option = courseData.certificateOptions.find(opt => opt.id === certType);
      if (option) {
        price += option.price;
      }
    });
    
    // Ek hizmetlere göre fiyat ekle
    selectedExtras.forEach(extra => {
      const option = courseData.extraOptions.find(opt => opt.id === extra);
      if (option) {
        price += option.price;
      }
    });
    
    // Miktar ile çarp
    price *= quantity;
    
    setTotalPrice(price);
  }, [selectedCertificateTypes, selectedExtras, quantity]);

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

  const handleQuantityChange = (increment: number) => {
    const newQuantity = Math.max(1, quantity + increment);
    setQuantity(newQuantity);
  };

  const sections = [
    { id: 'summary', title: 'Özet Bilgi', icon: Info },
    { id: 'details', title: 'Hakkında', icon: FileText },
    { id: 'start', title: 'Ne Zaman Başlayabilirim?', icon: Calendar },
    { id: 'contact', title: 'Sorularım için nasıl ulaşabilirim?', icon: HelpCircle },
    { id: 'additional', title: 'Ek Bilgi', icon: FileText }
  ];

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
                  Kişisel Gelişim
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Koçluk & Psikoloji
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {courseData.title}
              </h1>
              {courseData.subtitle && (
                <p className="text-lg text-gray-700 mb-4">{courseData.subtitle}</p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1 text-blue-600" />
                  <span>e-Devlet & Üniversite Onaylı</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                  <span>464 Saat</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-medium mb-2">ABC Akademi Sertifikalı Eğitim</p>
                    <p className="text-sm opacity-90">Kariyerinize değer katın</p>
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
                    <li key={index} className="text-gray-700">
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
                {activeSection === 'summary' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Özet Bilgi</h2>
                    <p className="text-gray-700 font-medium mb-4">{courseData.description}</p>
                    <ul className="space-y-2">
                      {courseData.features.map((feature, index) => (
                        <li key={index} className="text-gray-700">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeSection === 'details' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Hakkında</h2>
                    <p className="text-gray-700 font-medium mb-4">{courseData.description}</p>
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(courseData.longDescription.replace(/\n/g, '<br/>')) 
                      }}
                    />
                  </div>
                )}
                
                {activeSection === 'start' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Ne Zaman Başlayabilirim?</h2>
                    <p className="text-gray-700">{courseData.startInfo}</p>
                  </div>
                )}
                
                {activeSection === 'contact' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Sorularım için nasıl ulaşabilirim?</h2>
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(courseData.contactInfo.replace(/\n/g, '<br/>')) 
                      }}
                    />
                  </div>
                )}
                
                {activeSection === 'additional' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Ek Bilgi</h2>
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(courseData.additionalInfo.replace(/\n/g, '<br/>')) 
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* İlgili Kurslar */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">İlgili Kurslar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courseData.relatedCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {course.title}
                      </h3>
                      {course.subtitle && (
                        <p className="text-xs text-gray-600 mb-2">{course.subtitle}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col">
                          <span className="text-xs line-through text-gray-500">₺{course.originalPrice}</span>
                          <span className="text-sm font-bold text-gray-900">₺{course.discountedPrice}</span>
                        </div>
                        <Link 
                          href={`/courses/${course.id}`}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Detaylar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
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
                    %{Math.round((1 - courseData.discountedPrice / courseData.originalPrice) * 100)} İndirim
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">₺{totalPrice}</div>
                <div className="text-sm text-gray-500">KDV Dahil</div>
              </div>
              
              {/* Sertifika Türü Seçimi */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sertifika Türü Seçiniz (en az bir seçim)
                </label>
                <div className="space-y-2">
                  {courseData.certificateOptions.map((option) => (
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
                  Ek Hizmetler (isteğe bağlı)
                </label>
                <div className="space-y-2">
                  {courseData.extraOptions.map((option) => (
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
              
              {/* Miktar Seçimi */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miktar
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700"
                    aria-label="Azalt"
                  >
                    -
                  </button>
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly
                    aria-label="Miktar"
                    className="flex-1 text-center border-none focus:ring-0 focus:outline-none text-gray-700"
                  />
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700"
                    aria-label="Artır"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Fiyat Detayları */}
              <div className="mb-6 border-t border-b border-gray-200 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Temel Fiyat:</span>
                    <span className="font-medium">₺{courseData.discountedPrice}</span>
                  </div>
                  
                  {selectedCertificateTypes.map(certType => {
                    const option = courseData.certificateOptions.find(opt => opt.id === certType);
                    if (option && option.price > 0) {
                      return (
                        <div key={certType} className="flex justify-between text-sm">
                          <span className="text-gray-600">{option.name}:</span>
                          <span className="font-medium">+₺{option.price}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                  
                  {selectedExtras.map(extra => {
                    const option = courseData.extraOptions.find(opt => opt.id === extra);
                    if (option) {
                      return (
                        <div key={extra} className="flex justify-between text-sm">
                          <span className="text-gray-600">{option.name}:</span>
                          <span className="font-medium">+₺{option.price}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                  
                  {quantity > 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Miktar:</span>
                      <span className="font-medium">x{quantity}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Toplam:</span>
                    <span className="font-bold text-blue-600">₺{totalPrice}</span>
                  </div>
                </div>
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
              
              {/* İletişim Bilgisi */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="font-medium">Yardım mı lazım?</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  0850 550 50 54 numaralı telefondan bize ulaşabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
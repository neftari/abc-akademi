// Kapsamlı Eğitim İçerikleri
const firstAidContent = {
  "courseId": "ilk-yardim-bilinci",
  "title": "İlk Yardım Bilinci Eğitimi",
  "modules": [
    {
      "id": "modul-1",
      "title": "Temel İlk Yardım Bilgisi",
      "description": "İlk yardımın temel kavramları ve prensipleri",
      "lessons": [
        {
          "id": "ders-1-1",
          "title": "İlk Yardım Nedir?",
          "type": "text",
          "duration": "25 dakika",
          "completed": false,
          "content": {
            "learningObjectives": [
              "İlk yardımın tanımını ve kapsamını öğrenmek",
              "İlk yardımın önemini ve hayat kurtarma rolünü anlamak",
              "İlk yardımın temel prensiplerini ve uygulama alanlarını kavramak",
              "İlk yardım eğitiminin gerekliliğini ve faydalarını öğrenmek"
            ],
            "mainContent": {
              "sections": [
                {
                  "title": "İlk Yardımın Tanımı ve Kapsamı",
                  "content": "İlk yardım, herhangi bir kaza veya yaşamı tehlikeye düşüren bir durumda, sağlık görevlilerinin yardımı sağlanıncaya kadar, hayatın kurtarılması ya da durumun kötüleşmesini önlemek amacıyla, olay yerinde, tıbbi araç gereç aranmaksızın mevcut araç ve gereçlerle yapılan ilaçsız uygulamaları kapsar. İlk yardım, profesyonel tıbbi müdahale öncesinde yapılan kritik müdahalelerdir."
                },
                {
                  "title": "İlk Yardımın Önemi ve Hayat Kurtarma Rolü",
                  "content": "İlk yardım, acil durumlarda hayat kurtarma ve durumun kötüleşmesini önleme açısından kritik öneme sahiptir. Doğru müdahale ile yaralanmaların şiddeti azalır, enfeksiyon riski önlenir ve kalıcı sakatlık riski azalır. İlk 10 dakika içinde yapılan müdahale, hayatta kalma şansını %50'ye kadar artırabilir."
                },
                {
                  "title": "Temel Prensipler ve Uygulama Alanları",
                  "content": "İlk yardımın temel prensipleri: güvenlik önceliği, hızlı değerlendirme ve doğru müdahaledir. Önce kendi güvenliğinizi sağlamalı, sonra bilinç durumunu kontrol etmeli ve doğru müdahaleyi yapmalısınız. İlk yardım, trafik kazaları, ev kazaları, iş kazaları, spor yaralanmaları ve doğal afetler gibi birçok alanda uygulanabilir."
                }
              ]
            },
            "practicalExamples": [
              {
                "title": "Trafik Kazası Senaryosu",
                "description": "Yolda araç kazası gören bir yayanın yapması gerekenler",
                "steps": [
                  "Güvenli bir mesafeden durun ve kendi güvenliğinizi sağlayın",
                  "112'yi arayın ve doğru bilgileri verin",
                  "Kazazedelerin bilinç durumunu kontrol edin",
                  "Kanama varsa basınç uygulayın",
                  "Solunum kontrolü yapın",
                  "Yardım gelene kadar kazazedeyi yalnız bırakmayın"
                ]
              }
            ],
            "importantNotes": [
              "İlk yardım bilgisi olmadan müdahale etmeyin",
              "Her zaman profesyonel yardım çağırın",
              "Kendi güvenliğinizi öncelikli tutun",
              "Panik yapmayın, sakin kalın",
              "Yaralıyı gereksiz yere hareket ettirmeyin",
              "İlk yardım malzemelerini evde bulundurun"
            ],
            "summary": "Bu derste ilk yardımın ne olduğunu, önemini ve temel prensiplerini öğrendik. İlk yardım, hayat kurtarma ve durumun kötüleşmesini önleme amacıyla yapılan acil müdahalelerdir."
          }
        },
        {
          "id": "ders-1-2",
          "title": "ABC Prensibi ve Yaşam Zinciri",
          "type": "text",
          "duration": "30 dakika",
          "completed": false,
          "content": {
            "learningObjectives": [
              "ABC prensibini detaylı olarak öğrenmek",
              "Hava yolu kontrolünü ve açma tekniklerini anlamak",
              "Solunum ve dolaşım kontrolünü kavramak",
              "Yaşam zinciri kavramını öğrenmek"
            ],
            "mainContent": {
              "sections": [
                {
                  "title": "A - Airway (Hava Yolu) Kontrolü",
                  "content": "Hava yolunun açık olup olmadığını kontrol edin. Bilinçsiz kişilerde dil arkaya kayabilir, yabancı cisim tıkanıklığı olabilir. Boyun travması varsa dikkatli olun. Hava yolu açma teknikleri: Baş-çene pozisyonu, çene itme tekniği ve Heimlich manevrası gibi teknikler kullanılır."
                },
                {
                  "title": "B - Breathing (Solunum) Kontrolü",
                  "content": "Solunumun olup olmadığını kontrol edin. Göğüs hareketlerini gözlemleyin, solunum sesini dinleyin, yanakla solunum hissini alın. Solunum yoksa suni teneffüs uygulanmalıdır. Yetişkinlerde 30:2 oranında kalp masajı ve suni teneffüs yapılır."
                },
                {
                  "title": "C - Circulation (Dolaşım) Kontrolü",
                  "content": "Dolaşımın olup olmadığını kontrol edin. Nabız kontrolü yapın, cilt rengini gözlemleyin, kanama kontrolü yapın. Nabız yoksa kalp masajı uygulanmalıdır. Kalp masajı, göğüs kemiğinin alt yarısına, göğüs kemiğinin 1/3'ü kadar çöktürülerek yapılır."
                }
              ]
            },
            "practicalExamples": [
              {
                "title": "Bilinç Kontrolü Uygulaması",
                "description": "Bilinçsiz bir kişiye yaklaşım ve ABC kontrolü",
                "steps": [
                  "Kişinin yanına diz çökün",
                  "Omuzlarından hafifçe sarsın",
                  "'İyi misiniz?' diye sorun",
                  "Yanıt yoksa bilinçsiz kabul edin",
                  "A - Hava yolu kontrolü yapın",
                  "B - Solunum kontrolü yapın",
                  "C - Dolaşım kontrolü yapın"
                ]
              }
            ],
            "importantNotes": [
              "ABC sırasını değiştirmeyin",
              "Kalp masajı sırasında göğüs kemiğini tamamen bırakın",
              "Suni teneffüs sırasında burun deliklerini kapatın",
              "Yardım gelene kadar müdahaleye devam edin",
              "Yorulduğunuzda başka biriyle değişin",
              "Çocuklarda farklı teknikler kullanın"
            ],
            "summary": "Bu derste ABC prensibini ve yaşam zinciri kavramını öğrendik. ABC kontrolü, acil durumlarda yapılması gereken ilk değerlendirmedir."
          }
        },
        {
          "id": "ders-1-3",
          "title": "Kanama Kontrolü ve Şok Yönetimi",
          "type": "text",
          "duration": "35 dakika",
          "completed": false,
          "content": {
            "learningObjectives": [
              "Kanama türlerini ve kontrol yöntemlerini öğrenmek",
              "Şok belirtilerini ve yönetimini anlamak",
              "Turnike uygulama tekniklerini kavramak",
              "Kanama kontrolünde güvenlik önlemlerini öğrenmek"
            ],
            "mainContent": {
              "sections": [
                {
                  "title": "Kanama Türleri ve Kontrol Yöntemleri",
                  "content": "Kanama üç türde olabilir: Arteriyel (atardamar), venöz (toplardamar) ve kapiller (kılcal damar) kanama. Arteriyel kanama parlak kırmızı renkte ve fışkırır tarzda olur. Venöz kanama koyu kırmızı renkte ve sürekli akar. Kapiller kanama yavaş ve sızıntı şeklindedir."
                },
                {
                  "title": "Doğrudan Basınç Tekniği",
                  "content": "Kanama kontrolünde en etkili yöntem doğrudan basınçtır. Temiz bir bez veya gazlı bez kullanarak kanayan yere doğrudan basınç uygulayın. Basıncı 10-15 dakika sürdürün. Kanama durmazsa ek bez katmanları ekleyin."
                },
                {
                  "title": "Şok Belirtileri ve Yönetimi",
                  "content": "Şok belirtileri: Soğuk ve nemli cilt, hızlı ve zayıf nabız, hızlı solunum, baş dönmesi, bulantı ve bilinç değişiklikleri. Şok yönetimi: Kişiyi sırtüstü yatırın, bacaklarını 30 cm yükseltin, üzerini örtün ve sıcak tutun."
                }
              ]
            },
            "practicalExamples": [
              {
                "title": "Kol Kanaması Kontrolü",
                "description": "Kolda kesik sonrası kanama kontrolü",
                "steps": [
                  "Yarayı temiz su ile yıkayın",
                  "Temiz bir bez ile doğrudan basınç uygulayın",
                  "Basıncı 10-15 dakika sürdürün",
                  "Kanama durmazsa ek bez katmanları ekleyin",
                  "Yarayı bandajlayın",
                  "Gerekirse hastaneye götürün"
                ]
              }
            ],
            "importantNotes": [
              "Kanama kontrolünde eldiven kullanın",
              "Turnike sadece hayati tehlike durumunda uygulayın",
              "Şok durumunda kişiyi sıcak tutun",
              "Kanama kontrolünde doğrudan basınç en etkili yöntemdir",
              "Turnike uygulandığında mutlaka sağlık personeline bildirin",
              "Şok belirtilerini tanımayı öğrenin"
            ],
            "summary": "Bu derste kanama türlerini, kontrol yöntemlerini ve şok yönetimini öğrendik. Doğrudan basınç en etkili kanama kontrol yöntemidir."
          }
        }
      ]
    },
    {
      "id": "modul-2",
      "title": "Solunum Sistemi Acilleri",
      "description": "Solunum sistemi ile ilgili acil durumlar ve müdahale yöntemleri",
      "lessons": [
        {
          "id": "ders-2-1",
          "title": "Bilinçsiz Kişiye Yaklaşım",
          "type": "text",
          "duration": "30 dakika",
          "completed": false,
          "content": {
            "learningObjectives": [
              "Bilinçsiz kişiye güvenli yaklaşım tekniklerini öğrenmek",
              "Bilinç kontrolü yöntemlerini anlamak",
              "Bilinçsiz kişiyi pozisyonlama tekniklerini kavramak",
              "Bilinçsiz kişide solunum kontrolünü öğrenmek"
            ],
            "mainContent": {
              "sections": [
                {
                  "title": "Güvenli Yaklaşım Teknikleri",
                  "content": "Bilinçsiz kişiye yaklaşırken önce kendi güvenliğinizi sağlayın. Olay yerinin güvenliğini kontrol edin. Elektrik, gaz, yangın gibi tehlikeleri değerlendirin. Kişiye yaklaşırken dikkatli olun ve ani hareketlerden kaçının."
                },
                {
                  "title": "Bilinç Kontrolü Yöntemleri",
                  "content": "Bilinç kontrolü için kişinin omuzlarından hafifçe sarsın ve 'İyi misiniz?' diye sorun. Yanıt yoksa bilinçsiz kabul edin. Göz bebeklerini kontrol edin. Ağrılı uyarı verin (omuz sıkma, ayak tabanına basınç)."
                },
                {
                  "title": "Bilinçsiz Kişiyi Pozisyonlama",
                  "content": "Bilinçsiz kişiyi yan yatırın (kurtarma pozisyonu). Bu pozisyon, dilin arkaya kaymasını önler ve kusma durumunda aspirasyonu engeller. Baş hafif geriye, alt kol öne, üst kol arkaya gelecek şekilde pozisyonlayın."
                }
              ]
            },
            "practicalExamples": [
              {
                "title": "Kurtarma Pozisyonu Uygulaması",
                "description": "Bilinçsiz kişiyi güvenli pozisyona alma",
                "steps": [
                  "Kişiyi sırtüstü yatırın",
                  "Sol kolunu başının altına koyun",
                  "Sağ kolunu göğsünün üzerine koyun",
                  "Sağ bacağını bükün",
                  "Sol omuzundan tutarak yan çevirin",
                  "Başını hafif geriye yatırın"
                ]
              }
            ],
            "importantNotes": [
              "Bilinçsiz kişiye yaklaşırken güvenliğinizi sağlayın",
              "Kurtarma pozisyonu dil kaymasını önler",
              "Solunum kontrolü 10 saniye sürdürülmelidir",
              "Bilinçsiz kişiyi yalnız bırakmayın",
              "Solunum yoksa hemen suni teneffüs uygulayın",
              "Bilinçsiz kişiyi gereksiz yere hareket ettirmeyin"
            ],
            "summary": "Bu derste bilinçsiz kişiye güvenli yaklaşım tekniklerini ve kurtarma pozisyonunu öğrendik. Bilinçsiz kişiyi yan yatırmak en güvenli pozisyondur."
          }
        },
        {
          "id": "ders-2-2",
          "title": "Boğulma ve Heimlich Manevrası",
          "type": "text",
          "duration": "35 dakika",
          "completed": false,
          "content": {
            "learningObjectives": [
              "Boğulma belirtilerini ve türlerini öğrenmek",
              "Heimlich manevrasını uygulama tekniklerini anlamak",
              "Farklı yaş gruplarında boğulma müdahalesini kavramak",
              "Boğulma önleme yöntemlerini öğrenmek"
            ],
            "mainContent": {
              "sections": [
                {
                  "title": "Boğulma Belirtileri ve Türleri",
                  "content": "Boğulma, hava yolunun yabancı cisimle tıkanmasıdır. Kısmi tıkanmada kişi öksürür, konuşabilir ve nefes alabilir. Tam tıkanmada kişi konuşamaz, nefes alamaz ve 'boğulma işareti' yapar (ellerini boynuna koyar)."
                },
                {
                  "title": "Heimlich Manevrası - Yetişkinler",
                  "content": "Heimlich manevrası, tam tıkanma durumunda uygulanır. Kişinin arkasına geçin, bir elinizi yumruk yapın ve göbek deliğinin üstüne yerleştirin. Diğer elinizle yumruğunuzu kavrayın ve karın içine doğru hızlı basınç uygulayın."
                },
                {
                  "title": "Çocuklarda Boğulma Müdahalesi",
                  "content": "Çocuklarda Heimlich manevrası daha dikkatli uygulanır. Çocuğu dizinize yatırın ve sırtına 5 kez vurun. Sonra Heimlich manevrası uygulayın. Bebeklerde farklı teknikler kullanılır."
                }
              ]
            },
            "practicalExamples": [
              {
                "title": "Yetişkinde Heimlich Manevrası",
                "description": "Yetişkinde tam tıkanma durumunda Heimlich manevrası",
                "steps": [
                  "Kişinin arkasına geçin",
                  "Bir elinizi yumruk yapın",
                  "Göbek deliğinin üstüne yerleştirin",
                  "Diğer elinizle yumruğunuzu kavrayın",
                  "Karın içine doğru hızlı basınç uygulayın",
                  "5 kez tekrarlayın"
                ]
              }
            ],
            "importantNotes": [
              "Heimlich manevrası sadece tam tıkanmada uygulanır",
              "Kısmi tıkanmada kişiyi öksürmeye teşvik edin",
              "Çocuklarda daha dikkatli uygulayın",
              "Bebeklerde farklı teknikler kullanın",
              "Boğulma önleme çok önemlidir",
              "Yardım gelene kadar müdahaleye devam edin"
            ],
            "summary": "Bu derste boğulma belirtilerini, Heimlich manevrasını ve farklı yaş gruplarında boğulma müdahalesini öğrendik. Heimlich manevrası sadece tam tıkanma durumunda uygulanır."
          }
        }
      ]
    },
    {
      "id": "modul-3",
      "title": "Kardiyovasküler Aciller",
      "description": "Kalp ve dolaşım sistemi ile ilgili acil durumlar",
      "lessons": [
        {
          "id": "ders-3-1",
          "title": "Kalp Krizi Belirtileri ve Müdahale",
          "type": "text",
          "duration": "40 dakika",
          "completed": false,
          "content": {
            "learningObjectives": [
              "Kalp krizi belirtilerini ve risk faktörlerini öğrenmek",
              "Kalp krizi durumunda yapılacakları anlamak",
              "Kalp krizi önleme yöntemlerini kavramak",
              "Kalp krizi ile ilgili yanlış inanışları öğrenmek"
            ],
            "mainContent": {
              "sections": [
                {
                  "title": "Kalp Krizi Belirtileri",
                  "content": "Kalp krizi belirtileri: Göğüs ağrısı (sıkışma, yanma hissi), sol kola, çeneye, sırta yayılan ağrı, nefes darlığı, soğuk terleme, bulantı, baş dönmesi. Belirtiler ani başlayabilir veya yavaş gelişebilir."
                },
                {
                  "title": "Risk Faktörleri",
                  "content": "Kalp krizi risk faktörleri: Yaş (erkeklerde 45+, kadınlarda 55+), sigara, yüksek tansiyon, diyabet, obezite, hareketsiz yaşam, yüksek kolesterol, aile öyküsü, stres ve düzensiz beslenme."
                },
                {
                  "title": "Kalp Krizi Durumunda Yapılacaklar",
                  "content": "Kalp krizi şüphesi durumunda: Kişiyi rahat bir pozisyona alın, sıkı giysileri gevşetin, 112'yi arayın, kişiyi yalnız bırakmayın, aspirin verin (doktor önerisi ile), kalp masajı gerekirse uygulayın."
                }
              ]
            },
            "practicalExamples": [
              {
                "title": "Kalp Krizi Şüphesi Durumunda Müdahale",
                "description": "Kalp krizi belirtileri gösteren kişiye müdahale",
                "steps": [
                  "Kişiyi rahat bir pozisyona alın",
                  "Sıkı giysileri gevşetin",
                  "112'yi arayın",
                  "Kişiyi yalnız bırakmayın",
                  "Aspirin verin (doktor önerisi ile)",
                  "Kalp masajı gerekirse uygulayın"
                ]
              }
            ],
            "importantNotes": [
              "Kalp krizi belirtileri her zaman tipik olmayabilir",
              "Kadınlarda belirtiler farklı olabilir",
              "Zaman kaybetmeden 112'yi arayın",
              "Kişiyi yalnız bırakmayın",
              "Kalp krizi önlenebilir bir hastalıktır",
              "Düzenli sağlık kontrolü önemlidir"
            ],
            "summary": "Bu derste kalp krizi belirtilerini, risk faktörlerini ve müdahale yöntemlerini öğrendik. Kalp krizi önlenebilir bir hastalıktır ve erken müdahale hayat kurtarır."
          }
        }
      ]
    }
  ]
};

const englishSpeakingContent = {
  "courseId": "ingilizce-konusma-pratigi",
  "title": "İngilizce Konuşma Pratiği Eğitimi",
  "modules": [
    {
      "id": "modul-1",
      "title": "Temel Konuşma Kalıpları",
      "description": "Günlük hayatta kullanılan temel İngilizce konuşma kalıpları",
      "lessons": [
        {
          "id": "ders-1-1",
          "title": "Selamlaşma ve Tanışma",
          "type": "text",
          "duration": "25 dakika",
          "completed": false,
          "content": {
            "learningObjectives": [
              "Günlük selamlaşma kalıplarını öğrenmek",
              "Tanışma diyaloglarını anlamak",
              "Resmi ve samimi konuşma farklarını kavramak",
              "Farklı kültürlerde selamlaşma yöntemlerini öğrenmek"
            ],
            "mainContent": {
              "sections": [
                {
                  "title": "Resmi Selamlaşma Kalıpları",
                  "content": "Resmi ortamlarda kullanılan selamlaşma kalıpları: Good morning (Günaydın), Good afternoon (İyi öğleden sonra), Good evening (İyi akşamlar), Good night (İyi geceler). Bu kalıplar iş ortamında, resmi toplantılarda ve tanımadığınız kişilerle konuşurken kullanılır."
                },
                {
                  "title": "Samimi Selamlaşma Kalıpları",
                  "content": "Günlük hayatta kullanılan samimi selamlaşma kalıpları: Hi (Merhaba), Hello (Merhaba), Hey (Hey), What's up? (Ne haber?), How are you? (Nasılsın?), How's it going? (Nasıl gidiyor?). Bu kalıplar arkadaşlarınızla ve tanıdıklarınızla kullanılır."
                },
                {
                  "title": "Tanışma Diyalogları",
                  "content": "İlk tanışma sırasında kullanılan kalıplar: What's your name? (Adınız nedir?), Where are you from? (Neredensiniz?), Nice to meet you (Tanıştığımıza memnun oldum), Pleased to meet you (Tanıştığımıza memnun oldum). Bu kalıplar yeni insanlarla tanışırken kullanılır."
                }
              ]
            },
            "practicalExamples": [
              {
                "title": "İş Ortamında Tanışma",
                "description": "Yeni iş arkadaşıyla tanışma diyaloğu",
                "dialogue": {
                  "A1": "Hi, I'm Alex. I'm new here.",
                  "B1": "Welcome, Alex! I'm Maria.",
                  "A2": "Nice to meet you, Maria.",
                  "B2": "Nice to meet you too. What department are you in?",
                  "A3": "I'm in marketing. How about you?",
                  "B3": "I'm in sales. Let me show you around."
                }
              }
            ],
            "importantNotes": [
              "Resmi ortamlarda samimi dil kullanmayın",
              "İsimleri doğru telaffuz edin",
              "Göz teması kurun",
              "Gülümseyin ve sıcak olun",
              "Kültürel farklılıkları göz önünde bulundurun",
              "Selamlaşma kalıplarını doğru zamanda kullanın"
            ],
            "summary": "Bu derste günlük selamlaşma kalıplarını, tanışma diyaloglarını ve resmi/samimi konuşma farklarını öğrendik. Doğru selamlaşma, etkili iletişimin temelidir."
          }
        }
      ]
    }
  ]
};

// TypeScript interfaces
export interface LessonContent {
  learningObjectives: string[];
  mainContent: {
    sections: {
      title: string;
      content: string;
    }[];
  };
  practicalExamples: {
    title: string;
    description: string;
    steps?: string[];
    dialogue?: Record<string, string>;
  }[];
  importantNotes: string[];
  summary: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'text' | 'video' | 'document' | 'test';
  duration: string;
  completed: boolean;
  content: LessonContent;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface CourseContent {
  courseId: string;
  title: string;
  modules: Module[];
}

// Course content data
const courseContents: Record<string, CourseContent> = {
  'ilk-yardim-bilinci': firstAidContent as CourseContent,
  'ingilizce-konusma-pratigi': englishSpeakingContent as CourseContent
};

// Utility functions
export const getCourseContent = (courseId: string): CourseContent | null => {
  return courseContents[courseId] || null;
};

export const getModule = (courseId: string, moduleId: string): Module | null => {
  const course = getCourseContent(courseId);
  if (!course) return null;
  
  return course.modules.find(module => module.id === moduleId) || null;
};

export const getLesson = (courseId: string, moduleId: string, lessonId: string): Lesson | null => {
  const courseModule = getModule(courseId, moduleId);
  if (!courseModule) return null;
  
  return courseModule.lessons.find(lesson => lesson.id === lessonId) || null;
};

export const getNextLesson = (courseId: string, currentModuleId: string, currentLessonId: string): { moduleId: string; lessonId: string } | null => {
  const course = getCourseContent(courseId);
  if (!course) return null;
  
  const currentModuleIndex = course.modules.findIndex(m => m.id === currentModuleId);
  const currentLessonIndex = course.modules[currentModuleIndex]?.lessons.findIndex(l => l.id === currentLessonId);
  
  if (currentModuleIndex === -1 || currentLessonIndex === -1) return null;
  
  const currentModule = course.modules[currentModuleIndex];
  
  // Aynı modül içinde sonraki ders var mı?
  if (currentLessonIndex < currentModule.lessons.length - 1) {
    return {
      moduleId: currentModuleId,
      lessonId: currentModule.lessons[currentLessonIndex + 1].id
    };
  }
  
  // Sonraki modül var mı?
  if (currentModuleIndex < course.modules.length - 1) {
    const nextModule = course.modules[currentModuleIndex + 1];
    if (nextModule.lessons.length > 0) {
      return {
        moduleId: nextModule.id,
        lessonId: nextModule.lessons[0].id
      };
    }
  }
  
  return null;
};

export const getPreviousLesson = (courseId: string, currentModuleId: string, currentLessonId: string): { moduleId: string; lessonId: string } | null => {
  const course = getCourseContent(courseId);
  if (!course) return null;
  
  const currentModuleIndex = course.modules.findIndex(m => m.id === currentModuleId);
  const currentLessonIndex = course.modules[currentModuleIndex]?.lessons.findIndex(l => l.id === currentLessonId);
  
  if (currentModuleIndex === -1 || currentLessonIndex === -1) return null;
  
  const currentModule = course.modules[currentModuleIndex];
  
  // Aynı modül içinde önceki ders var mı?
  if (currentLessonIndex > 0) {
    return {
      moduleId: currentModuleId,
      lessonId: currentModule.lessons[currentLessonIndex - 1].id
    };
  }
  
  // Önceki modül var mı?
  if (currentModuleIndex > 0) {
    const previousModule = course.modules[currentModuleIndex - 1];
    if (previousModule.lessons.length > 0) {
      return {
        moduleId: previousModule.id,
        lessonId: previousModule.lessons[previousModule.lessons.length - 1].id
      };
    }
  }
  
  return null;
};

export const calculateProgress = (courseId: string, completedLessons: string[]): number => {
  const course = getCourseContent(courseId);
  if (!course) return 0;
  
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedCount = completedLessons.length;
  
  return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
}; 
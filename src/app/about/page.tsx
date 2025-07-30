import { Users, Award, Clock, CheckCircle, GraduationCap, Target, Heart, Zap } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: '5000+', label: 'Öğrenci', icon: Users },
    { number: '50+', label: 'Kurs', icon: Award },
    { number: '95%', label: 'Memnuniyet', icon: Heart },
    { number: '24/7', label: 'Destek', icon: Clock }
  ];

  const values = [
    {
      title: 'Kalite',
      description: 'En yüksek kalitede eğitim içerikleri sunuyoruz',
      icon: Award
    },
    {
      title: 'İnovasyon',
      description: 'Modern teknolojiler ile sürekli gelişim',
      icon: Zap
    },
    {
      title: 'Güven',
      description: 'Güvenilir ve şeffaf eğitim hizmeti',
      icon: CheckCircle
    },
    {
      title: 'Başarı',
      description: 'Öğrencilerimizin kariyer başarısı bizim başarımız',
      icon: Target
    }
  ];

  const team = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Kurucu & CEO',
      description: '10+ yıl eğitim teknolojileri deneyimi',
      image: '/images/team/ahmet.jpg'
    },
    {
      name: 'Ayşe Demir',
      role: 'Eğitim Direktörü',
      description: 'Pedagoji uzmanı ve eğitim teknolojileri',
      image: '/images/team/ayse.jpg'
    },
    {
      name: 'Mehmet Özkan',
      role: 'Teknoloji Lideri',
      description: 'Full-stack geliştirici ve eğitmen',
      image: '/images/team/mehmet.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hakkımızda
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              ABC Akademi olarak, modern eğitim teknolojileri ile kaliteli eğitim hizmeti sunuyoruz. 
              Kariyerinizi geliştirmek için profesyonel kurslar ve sertifikalar.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Misyonumuz
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                ABC Akademi olarak misyonumuz, modern teknolojiler ile kaliteli eğitim hizmeti sunarak 
                bireylerin kariyerlerini geliştirmelerine yardımcı olmaktır. Uzman eğitmenlerimiz ve 
                güncel içeriklerimizle öğrencilerimizin hedeflerine ulaşmalarını sağlıyoruz.
              </p>
              <p className="text-lg text-gray-600">
                Sertifikalı kurslarımız, pratik odaklı eğitim yaklaşımımız ve esnek öğrenme imkanlarımızla 
                herkesin kendi hızında öğrenmesini destekliyoruz.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Target className="h-12 w-12 text-blue-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Vizyonumuz</h3>
              </div>
              <p className="text-gray-600">
                Türkiye&apos;nin önde gelen online eğitim platformu olmak ve global standartlarda 
                eğitim hizmeti sunarak öğrencilerimizin uluslararası kariyer fırsatlarına 
                erişmelerini sağlamak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ABC Akademi&apos;nin temel değerleri, her kararımızı ve eylemi şekillendirir.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <value.icon className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ekibimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Deneyimli ve uzman ekibimizle size en iyi eğitim deneyimini sunuyoruz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
              <p className="text-gray-600 mb-4">
                ABC Akademi, 2020 yılında eğitim teknolojileri alanında uzman bir ekip tarafından 
                kuruldu. Amacımız, geleneksel eğitim yöntemlerini modern teknolojiler ile 
                birleştirerek daha etkili ve erişilebilir bir öğrenme deneyimi sunmaktı.
              </p>
              <p className="text-gray-600 mb-4">
                Bugün, binlerce öğrencimizle birlikte Türkiye&apos;nin önde gelen online eğitim 
                platformlarından biri haline geldik. Sertifikalı kurslarımız, uzman eğitmenlerimiz 
                ve modern eğitim teknolojilerimizle öğrencilerimizin kariyer hedeflerine 
                ulaşmalarına yardımcı oluyoruz.
              </p>
              <p className="text-gray-600">
                Gelecekte de inovasyon ve kalite odaklı yaklaşımımızla eğitim sektöründe 
                öncü olmaya devam edeceğiz.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Neden ABC Akademi?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Uzman Eğitmenler</h4>
                    <p className="text-gray-600">Sektörde deneyimli uzman eğitmenlerimizle kaliteli eğitim</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Güncel İçerik</h4>
                    <p className="text-gray-600">Sürekli güncellenen ve modern teknolojilere uygun içerik</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Esnek Öğrenme</h4>
                    <p className="text-gray-600">Kendi hızınızda, istediğiniz yerden öğrenme imkanı</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Sertifikalı Eğitim</h4>
                    <p className="text-gray-600">Uluslararası geçerli sertifikalar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
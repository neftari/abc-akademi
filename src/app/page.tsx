'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Users, Award, Clock, Star, ArrowRight, Play, BookOpen, CheckCircle, Search, ShoppingCart } from 'lucide-react';
import { ICourse } from '../models/Course';

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Ana sayfa: Kurslar yükleniyor...');
        const response = await fetch('/api/courses');
        const courses = await response.json();
        const activeCourses = courses.filter((course: ICourse) => course.status === 'active');
        const firstThree = activeCourses.slice(0, 3);
        console.log('Ana sayfa - Aktif kurslar:', firstThree);
        setFeaturedCourses(firstThree);
      } catch (error) {
        console.error('Ana sayfa - Kurs yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80"></div>

        {/* Content */}
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-white space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Uluslararası Akreditasyon</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Geleceğe Uzmanlarla
                  <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Adım Atın
                  </span>
                </h1>

                <p className="text-xl text-blue-100 max-w-lg">
                  ABC Akademi ile sertifika programları, uzman eğitimler ve
                  kamu atamalarına uygun kurslarla kariyerinizi ileriye taşıyın.
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Hangi alanda uzmanlaşmak istiyorsunuz?</h3>
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      placeholder="Kurs ara... (örn: Bilgisayar İşletmenliği)"
                      className="pl-10 bg-white/90 border-0 h-12 text-foreground rounded-lg w-full px-4"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const searchInput = document.querySelector('input[placeholder*="Kurs ara"]') as HTMLInputElement;
                      const searchTerm = searchInput?.value;
                      if (searchTerm) {
                        window.location.href = `/courses?search=${encodeURIComponent(searchTerm)}`;
                      } else {
                        window.location.href = '/courses';
                      }
                    }}
                    className="bg-gradient-accent hover:opacity-90 h-12 px-8 text-white rounded-lg font-medium transition-all duration-300"
                  >
                    Ara
                  </button>
                </div>

                {/* Popular Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-blue-200">Popüler:</span>
                  {['Kalite Kontrol', 'İş Güvenliği', 'Proje Yönetimi'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        window.location.href = `/courses?category=${encodeURIComponent(tag)}`;
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1 rounded-full transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/courses"
                  className="bg-white text-primary hover:bg-white/90 h-14 px-8 rounded-lg font-medium inline-flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Kursları Keşfet
                </Link>
                <button 
                  onClick={() => {
                    // Video modal açma fonksiyonu
                    alert('Tanıtım videosu yakında eklenecek!');
                  }}
                  className="text-white border-white/30 hover:bg-white/10 h-14 px-8 rounded-lg font-medium inline-flex items-center justify-center transition-colors border"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Tanıtım Videosu
                </button>
              </div>
            </div>

            {/* Right Column - Stats Cards */}
            <div className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: '10K+', label: 'Mezun Öğrenci', icon: '🎓' },
                  { number: '50+', label: 'Uzman Eğitmen', icon: '👨‍🏫' },
                  { number: '100+', label: 'Sertifika Programı', icon: '📜' },
                  { number: '95%', label: 'İş Bulma Oranı', icon: '💼' }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center text-white"
                  >
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold">{stat.number}</div>
                    <div className="text-sm text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <h4 className="font-semibold mb-4">Güven Göstergeleri</h4>
                <div className="space-y-3">
                  {[
                    'Milli Eğitim Bakanlığı Onaylı',
                    'ISO 9001 Kalite Belgelendirmesi',
                    'Kamu Atamalarına Uygun Sertifikalar'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-12 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
              <span className="text-sm font-medium">🎯 Uzman Eğitimler</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Kariyerinizi İleriye Taşıyacak
              <span className="block text-primary">Sertifika Programları</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uzman eğitmenlerimiz eşliğinde, sektörün talep ettiği becerileri kazanın ve
              uluslararası geçerliliğe sahip sertifikalarla kariyerinizi güçlendirin.
            </p>
          </div>

          {/* Featured Courses */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Kurslar yükleniyor...</p>
            </div>
          ) : featuredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz kurs bulunmuyor
              </h3>
              <p className="text-gray-500">
                Yakında yeni kurslar eklenecek.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredCourses.map((course: ICourse, index: number) => (
                <div key={course._id || course.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="group relative bg-card rounded-xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden animate-scale-in">
                    {/* Course Image */}
                    <div className="relative h-48 bg-gradient-hero overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white/90 text-primary px-2 py-1 rounded text-sm font-medium">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6 space-y-4">
                      {/* Title and Level */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${
                            course.level === 'Başlangıç' ? 'border-green-500 text-green-500' :
                            course.level === 'Orta' ? 'border-yellow-500 text-yellow-500' :
                            'border-red-500 text-red-500'
                          }`}>
                            {course.level}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{course.rating || 4.5}</span>
                          </div>
                        </div>

                        <h3 className="font-bold text-lg text-card-foreground group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                      </div>

                      {/* Instructor */}
                      <p className="text-muted-foreground text-sm">
                        Eğitmen: <span className="font-medium">{course.instructor}</span>
                      </p>

                      {/* Course Info */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{course.students || 0}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>Sertifikalı</span>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-primary">
                            ₺{course.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tek seferde ödeme
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Link 
                            href={`/courses/${course._id || course.id}`}
                            className="bg-gradient-hero hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 inline-block text-center"
                          >
                            Kayıt Ol
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mb-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/courses"
                className="bg-gradient-hero text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center shadow-lg hover:shadow-xl"
              >
                Tüm Kursları Görüntüle
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/magaza"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center shadow-lg hover:shadow-xl border-2 border-blue-200"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Mağazadan Satın Al
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-hero rounded-2xl p-8 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '10,000+', label: 'Başarılı Mezun' },
                { number: '120+', label: 'Aktif Kurs' },
                { number: '50+', label: 'Uzman Eğitmen' },
                { number: '%95', label: 'Memnuniyet Oranı' }
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold">{stat.number}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Neden ABC Akademi?
              </h2>
              <p className="text-lg text-gray-600">
                Modern eğitim teknolojileri ve uzman eğitmenlerimizle kariyerinizi bir üst seviyeye taşıyın.
              </p>
              
              <div className="space-y-4">
                {[
                  {
                    title: 'Sertifikalı Eğitim',
                    description: 'Kurslarımızı tamamladığınızda uluslararası geçerli sertifika alırsınız',
                    icon: Award
                  },
                  {
                    title: 'Uzman Eğitmenler',
                    description: 'Sektörde deneyimli uzman eğitmenlerimizle kaliteli eğitim',
                    icon: Users
                  },
                  {
                    title: 'Esnek Öğrenme',
                    description: 'Kendi hızınızda, istediğiniz yerden öğrenin',
                    icon: Clock
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-card rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: '10K+', label: 'Mezun Öğrenci' },
                  { number: '50+', label: 'Uzman Eğitmen' },
                  { number: '100+', label: 'Sertifika Programı' },
                  { number: '95%', label: 'İş Bulma Oranı' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Kariyerinizi Bugün Başlatın
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            ABC Akademi ile geleceğinizi şekillendirin. Hemen kayıt olun ve ilk adımınızı atın.
          </p>
          <Link 
            href="/auth/signup"
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl"
          >
            Ücretsiz Kayıt Ol
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

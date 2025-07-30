'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { useCourses } from '@/contexts/CourseContext';

export default function CoursesPage() {
  const { getActiveCourses } = useCourses();
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedLevel, setSelectedLevel] = useState('Tümü');
  
  // Debug için console.log ekleyelim
  console.log('Courses Page - Active Courses:', getActiveCourses());

  const categories = [
    'Tümü',
    'Web Geliştirme',
    'Frontend',
    'Backend',
    'Veri Bilimi',
    'Mobil',
    'DevOps'
  ];

  const levels = ['Tümü', 'Başlangıç', 'Orta', 'İleri'];

  // Filtreleme fonksiyonu
  const getFilteredCourses = () => {
    let filteredCourses = getActiveCourses();
    
    if (selectedCategory !== 'Tümü') {
      filteredCourses = filteredCourses.filter(course => course.category === selectedCategory);
    }
    
    if (selectedLevel !== 'Tümü') {
      filteredCourses = filteredCourses.filter(course => course.level === selectedLevel);
    }
    
    return filteredCourses;
  };

  const courses = getFilteredCourses();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Kurslarımızı Keşfedin
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Modern teknolojiler ile kariyerinizi geliştirin. Uzman eğitmenlerimizle 
              kaliteli eğitim alın ve sertifikalarınızı kazanın.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    selectedCategory === category
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-gray-300 hover:border-primary hover:text-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    selectedLevel === level
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-gray-300 hover:border-primary hover:text-primary'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Seçilen kriterlere uygun kurs bulunamadı
              </h3>
              <p className="text-gray-500">
                Farklı kategori veya seviye seçerek tekrar deneyin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">{course.level}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="mr-4">Eğitmen: {course.instructor}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students} öğrenci
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">₺{course.price}</span>
                      <Link 
                        href={`/courses/${course.id}`}
                        className="bg-gradient-hero text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                      >
                        Detaylar
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Kariyerinizi Bugün Başlatın
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-3xl mx-auto">
            ABC Akademi ile geleceğinizi şekillendirin. Hemen kayıt olun ve 
            ilk adımınızı atın.
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
'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  ArrowLeft, 
  Play, 
  CheckCircle,
  Calendar,
  User
} from 'lucide-react';
import { useCourses } from '@/contexts/CourseContext';
import DOMPurify from 'isomorphic-dompurify'; // Güvenli HTML için DOMPurify ekledim

export default function CourseDetailPage() {
  const params = useParams();
  const { getCourseById } = useCourses();
  const [activeTab, setActiveTab] = useState('overview');
  
  const course = getCourseById(params.id as string);
  
  if (!course) {
    notFound();
  }

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: BookOpen },
    { id: 'content', name: 'Kurs İçeriği', icon: Play },
    { id: 'instructor', name: 'Eğitmen', icon: User },
    { id: 'reviews', name: 'Değerlendirmeler', icon: Star }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Kurs Hakkında</h3>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Bu kursta öğrenecekleriniz:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Temel kavramları ve pratikleri</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Gerçek projeler üzerinde çalışma</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Endüstri standartlarında kod yazma</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Portföy projeleri geliştirme</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Gereksinimler:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Temel bilgisayar kullanımı</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">İnternet bağlantısı</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Öğrenme isteği ve motivasyon</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
        
      case 'content':
        return (
          <div className="space-y-6">
            {/* Güvenli HTML render etmek için DOMPurify kullanıyoruz */}
            <div 
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(course.content) 
              }} 
              className="prose max-w-none" 
            />
          </div>
        );
        
      case 'instructor':
        return (
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{course.instructor}</h3>
                <p className="text-gray-600">Uzman Eğitmen</p>
                <p className="text-gray-500 mt-2">
                  {course.instructor}, {course.category} alanında uzmanlaşmış deneyimli bir eğitmendir. 
                  Modern teknolojiler ve pratik yaklaşımlarla öğrencilerine en iyi eğitimi sunmaktadır.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">5+</div>
                <div className="text-sm text-gray-600">Yıl Deneyim</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1000+</div>
                <div className="text-sm text-gray-600">Öğrenci</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">4.9</div>
                <div className="text-sm text-gray-600">Ortalama Puan</div>
              </div>
            </div>
          </div>
        );
        
      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Öğrenci Değerlendirmeleri</h3>
                <p className="text-gray-600">{course.students} öğrenci değerlendirdi</p>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg font-semibold text-gray-900 ml-1">{course.rating}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="ml-2 font-medium text-gray-900">Öğrenci {i}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    &quot;Harika bir kurs! Eğitmen çok açık ve anlaşılır bir şekilde anlatıyor. 
                    Pratik örneklerle konuları pekiştiriyor. Kesinlikle tavsiye ederim.&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {course.level}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <p className="text-gray-600 text-lg">{course.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {course.students} öğrenci
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  {course.rating} ({course.students} değerlendirme)
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Son güncelleme: {course.lastUpdate || 'Bilinmiyor'}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">₺{course.price}</div>
                <div className="text-sm text-gray-500">Tek seferlik ödeme</div>
              </div>
              
              <div className="space-y-3">
                <Link 
                  href={`/courses/${params.id}/learn`}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors block text-center"
                >
                  Eğitime Başla
                </Link>
                <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                  Kursa Kayıt Ol
                </button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kurs Süresi:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Seviye:</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kategori:</span>
                  <span className="font-medium">{course.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Eğitmen:</span>
                  <span className="font-medium">{course.instructor}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Bu kurs şunları içerir:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Ömür boyu erişim
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Sertifika
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Video dersler
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Pratik projeler
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Eğitmen desteği
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
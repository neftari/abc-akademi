'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Award, 
  Clock, 
  Play,
  TrendingUp,
  Calendar,
  User,
  Settings,
  LogOut,
  Bell
} from 'lucide-react';
import { useCourses } from '@/contexts/CourseContext';
import { useUsers } from '@/contexts/UserContext';
import { useCertificates } from '@/contexts/CertificateContext';

interface EnrolledCourse {
  id: string;
  title: string;
  progress: number;
  nextLesson: string;
  instructor: string;
  image: string;
  lastAccessed: string;
  category: string;
  level: string;
}

interface UserCertificate {
  id: string;
  title: string;
  issueDate: string;
  certificateNumber: string;
  status: string;
  courseId: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'exam' | 'workshop' | 'assignment';
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { courses } = useCourses();
  const { users } = useUsers();
  const { certificates } = useCertificates();
  
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [userCertificates, setUserCertificates] = useState<UserCertificate[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [stats, setStats] = useState({
    activeCourses: 0,
    certificates: 0,
    studyTime: 0,
    averageProgress: 0
  });

  // Kullanıcı verilerini bir kez yükleme
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Kullanıcının kayıtlı olduğu kursları bul
    const currentUser = users.find(user => user.email === session.user?.email);
    if (currentUser) {
      const userCourses = courses.filter(course => 
        currentUser.assignedCourses?.includes(course.id || course._id || '') || false
      );
      
      const enrolledData: EnrolledCourse[] = userCourses.map(course => ({
        id: course.id || course._id || '',
        title: course.title,
        progress: Math.floor(Math.random() * 100), // Gerçek uygulamada veritabanından gelecek
        nextLesson: `${course.title} - Ders ${Math.floor(Math.random() * 10) + 1}`,
        instructor: course.instructor,
        image: course.image || '/api/placeholder/400/250',
        lastAccessed: Math.random() > 0.5 ? '2 saat önce' : 'gün önce',
        category: course.category,
        level: course.level
      }));
      
      setEnrolledCourses(enrolledData);
      
      // Kullanıcının sertifikalarını bul
      const userCerts = certificates.filter(cert => 
        cert.studentEmail === session.user?.email
      );
      
      const certData: UserCertificate[] = userCerts.map(cert => ({
        id: cert.id || '',
        title: cert.courseName,
        issueDate: cert.issueDate,
        certificateNumber: cert.certificateNumber,
        status: cert.status,
        courseId: cert.courseId
      }));
      
      setUserCertificates(certData);
      
      // Demo etkinlikler (gerçek uygulamada veritabanından gelecek)
      const events: UpcomingEvent[] = [
        {
          id: '1',
          title: 'Web Geliştirme Sınavı',
          date: '2024-03-15',
          time: '14:00',
          type: 'exam'
        },
        {
          id: '2',
          title: 'React.js Workshop',
          date: '2024-03-18',
          time: '16:00',
          type: 'workshop'
        }
      ];
      setUpcomingEvents(events);
      
      // İstatistikleri bir kerede hesapla
      const totalProgress = enrolledData.reduce((sum, course) => sum + course.progress, 0);
      const avgProgress = enrolledData.length > 0 ? Math.round(totalProgress / enrolledData.length) : 0;
      const studyTime = Math.floor(Math.random() * 20) + 5; // Demo veri
      
      setStats({
        activeCourses: enrolledData.length,
        certificates: certData.length,
        studyTime,
        averageProgress: avgProgress
      });
    }
  }, [session, status, users, courses, certificates, router]);

  if (status === 'loading') {    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleCourseAction = (courseId: string, action: 'start' | 'continue') => {
    // Kurs aksiyonları (gerçek uygulamada kurs sayfasına yönlendirme)
    console.log(`${action} course:`, courseId);
    router.push(`/courses/${courseId}`);
  };

  const handleProfileAction = (action: string) => {
    switch (action) {
      case 'profile':
        router.push('/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'logout':
        router.push('/auth/signin');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Profile */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Profile */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{session.user?.name}</h1>
                  <p className="text-sm text-gray-500">{session.user?.email}</p>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Bildirimleri göster"
              >
                <Bell className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleProfileAction('settings')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Ayarlar"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleProfileAction('logout')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Çıkış yap"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Hoş Geldiniz!</h2>
          <p className="text-gray-600 mt-2">
            Öğrenme yolculuğunuza devam edin ve yeni beceriler kazanın.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Aktif Kurslar
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.activeCourses}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sertifikalar
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.certificates}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Bu Hafta Çalışma
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.studyTime}s</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ortalama İlerleme
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.averageProgress}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Devam Eden Kurslar</h2>
                <button 
                  onClick={() => router.push('/courses')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Tüm Kursları Gör
                </button>
              </div>
              <div className="p-6">
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Henüz kursa kayıtlı değilsiniz
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Kurslarımızı keşfedin ve öğrenmeye başlayın
                    </p>
                    <button 
                      onClick={() => router.push('/courses')}
                      className="bg-gradient-hero text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Kursları Keşfet
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-500">Eğitmen: {course.instructor}</p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">İlerleme</span>
                              <span className="font-medium text-gray-900">{course.progress}%</span>
                            </div>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-hero h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Play className="h-4 w-4 mr-1" />
                            Sonraki ders: {course.nextLesson}
                          </div>
                          <div className="mt-1 text-xs text-gray-400">
                            Son erişim: {course.lastAccessed}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <button 
                            onClick={() => handleCourseAction(course.id, course.progress > 0 ? 'continue' : 'start')}
                            className="bg-gradient-hero text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            {course.progress > 0 ? 'Devam Et' : 'Başla'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Certificates */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Sertifikalarım</h2>
              </div>
              <div className="p-6">
                {userCertificates.length === 0 ? (
                  <div className="text-center py-4">
                    <Award className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Henüz sertifikanız yok</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userCertificates.map((cert) => (
                      <div key={cert.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0">
                          <Award className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900">{cert.title}</h3>
                          <p className="text-xs text-gray-500">Sertifika No: {cert.certificateNumber}</p>
                          <p className="text-xs text-gray-500">Tarih: {new Date(cert.issueDate).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {cert.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Yaklaşan Etkinlikler</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                        <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('tr-TR')} - {event.time}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          event.type === 'exam' 
                            ? 'bg-red-100 text-red-800' 
                            : event.type === 'workshop'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {event.type === 'exam' ? 'Sınav' : event.type === 'workshop' ? 'Workshop' : 'Ödev'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Hızlı İşlemler</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/courses')}
                    className="w-full bg-gradient-hero text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Yeni Kurs Ara
                  </button>
                  <button 
                    onClick={() => router.push('/profile')}
                    className="w-full bg-gradient-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Profil Düzenle
                  </button>
                  <button 
                    onClick={() => router.push('/settings')}
                    className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Ayarlar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
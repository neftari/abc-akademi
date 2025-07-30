'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Users,
  BookOpen,
  Award,
  DollarSign,
  TrendingUp,
  UserPlus,
  Settings as SettingsIcon,
  Settings,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Download,
  Upload,
  Save,
  X,
  Tag,
  CheckCircle
} from 'lucide-react';
import { courseAPI, userAPI, categoryAPI, certificateAPI, settingsAPI } from '@/lib/api';
import { IUser } from '@/models/User';
import { ICourse } from '@/models/Course';
import { ICategory } from '@/models/Category';
import { ICertificate } from '@/models/Certificate';

interface SalesPage {
  id: string;
  title: string;
  subtitle?: string;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  longDescription?: string;
  features: string[];
  headerImage?: string;
  middleImage?: string;
  bottomImage?: string;
  sections?: {
    summary?: string;
    about?: string;
    startInfo?: string;
    contactInfo?: string;
  };
  certificateOptions?: Array<{id: string; name: string; price: number; selected: boolean}>;
  extraOptions?: Array<{id: string; name: string; price: number; selected: boolean}>;
  images?: string[];
  testimonials?: Array<{
    name: string;
    comment: string;
    rating: number;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  status?: string;
  createdAt?: string;
  startInfo?: string;
  contactInfo?: string;
  additionalInfo?: string;
  categories?: string[];
  relatedCourses?: string[];
}

// Modal bileşeni
function Modal({ show, onClose, title, children }: { show: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative mx-4 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10" title="Kapat">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold mb-6 text-gray-800 pr-8">{title}</h2>
        {children}
      </div>
    </div>
  );
}

// Bildirim (toast) bileşeni
function Toast({ show, message, type }: { show: boolean; message: string; type: 'success' | 'error' | 'info' }) {
  if (!show) return null;
  let color = 'bg-blue-600';
  if (type === 'success') color = 'bg-green-600';
  if (type === 'error') color = 'bg-red-600';
  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded text-white shadow-lg ${color} animate-fadeIn`}>{message}</div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [certificateSearchTerm, setCertificateSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // MongoDB'den gelen veriler
  const [users, setUsers] = useState<IUser[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Debug için console.log ekleyelim
  console.log('Admin Panel - MongoDB Courses:', courses);
  console.log('Admin Panel - MongoDB Users:', users);
  console.log('Admin Panel - MongoDB Categories:', categories);
  console.log('Admin Panel - MongoDB Certificates:', certificates);
  console.log('Admin Panel - MongoDB Settings:', settings);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, coursesData, categoriesData, certificatesData, settingsData] = await Promise.all([
        userAPI.getAll(),
        courseAPI.getAll(),
        categoryAPI.getAll(),
        certificateAPI.getAll(),
        settingsAPI.get()
      ]);

      setUsers(usersData);
      setCourses(coursesData);
      setCategories(categoriesData);
      setCertificates(certificatesData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Veriler yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Verileri yükle
  useEffect(() => {
    loadData();
    loadSalesPages();
  }, [loadData]);

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<ICertificate | null>(null);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

  // Inline editing states
  const [inlineEditingCourse, setInlineEditingCourse] = useState<string | null>(null);
  const [inlineEditValues, setInlineEditValues] = useState<Record<string, string | number | boolean>>({});

  // Slide-over panel state
  const [showSlideOver, setShowSlideOver] = useState(false);
  const [slideOverCourse, setSlideOverCourse] = useState<ICourse | null>(null);

  // Sales page states - Demo verilerle başlat
  const [salesPages, setSalesPages] = useState<SalesPage[]>([
    {
      id: 'aile-danismanligi',
      title: 'Aile Danışmanlığı Eğitimi Sertifika Programı',
      subtitle: '(Danışmanlık Merkezi Şartını Sağlar)',
      originalPrice: 10000,
      discountedPrice: 4990,
      description: 'Aile Danışmanlığı Eğitimi Sertifika Programımız, e-devlet ve üniversite onaylı olup, Aile ve Sosyal Hizmetler Bakanlığının belirttiği tüm şartlara uygun olarak hazırlanmıştır.',
      longDescription: 'Aile danışmanlığı ve süpervizyon, modern dünyada ailelerin karşılaştığı karmaşık sorunlarla başa çıkmada hayati bir rol oynar.',
      features: [
        '✓ %100 Online Eğitim (Asenkron)',
        '✓ 464 Saatlik Eğitim Sertifikası',
        '✓ 49 Video Ders, 1925 Sayfa PDF ve Online Test',
        '✓ 1 İş Gününde Eğitime Başlama',
        '✓ 1-3 İş Gününde Sertifika Onayı ve İşleme',
        '✓ Sertifikalar PDF Formatında Dijital Olarak Gönderilir',
        '✓ Kamu ve Özel Sektörde Geçerli'
      ],
      headerImage: '',
      middleImage: '',
      bottomImage: '',
      sections: {
        summary: 'Aile Danışmanlığı Eğitimi Sertifika Programımız, e-devlet ve üniversite onaylı olup, Aile ve Sosyal Hizmetler Bakanlığının belirttiği tüm şartlara uygun olarak hazırlanmıştır.',
        about: 'Aile danışmanlığı ve süpervizyon, modern dünyada ailelerin karşılaştığı karmaşık sorunlarla başa çıkmada hayati bir rol oynar. Aile danışmanları, aile sağlığını koruma, aile içi iletişimi geliştirme, çeşitli psikolojik ve hukuki meselelerde rehberlik etme konularında uzmanlaşmıştır.',
        startInfo: 'Başvurunuza müteakiben 1 iş gününde sisteme giriş adresi, kullanıcı adınız ve şifreniz tarafınıza gönderilecektir.',
        contactInfo: 'Farklı sorularınız var ise öncelikle **Sıkça Sorulan Sorular** sayfamızı incelemenizi tavsiye ederiz.\n\nBize ulaşmak isterseniz canlı desteğe bağlanabilir, **0 850 550 50 54** çağrı merkezimizi arayabilir.'
      },
      certificateOptions: [
        { id: 'university', name: 'e-Devlet & Üniversite Sertifikası', price: 0, selected: true },
        { id: 'international-en', name: 'Uluslararası İngilizce Sertifika', price: 50, selected: false },
        { id: 'international-tr', name: 'Uluslararası Türkçe Sertifika', price: 50, selected: false }
      ],
      extraOptions: [
        { id: 'transcript-uni', name: 'Üniversite Sertifikası Transkripti', price: 75, selected: false },
        { id: 'transcript-en', name: 'Uluslararası İngilizce Transkript', price: 75, selected: false },
        { id: 'print', name: 'Belgeleri Basın ve Kargolayın', price: 125, selected: false }
      ],
      status: 'active',
      createdAt: '2024-01-15'
    }
  ]);
  const [showSalesPageModal, setShowSalesPageModal] = useState(false);
  const [editingSalesPage, setEditingSalesPage] = useState<SalesPage | null>(null);
  const [salesPageForm, setSalesPageForm] = useState({
    title: 'Aile Danışmanlığı Eğitimi Sertifika Programı',
    subtitle: '(Danışmanlık Merkezi Şartını Sağlar)',
    originalPrice: '10000',
    discountedPrice: '4990',
    description: 'Aile Danışmanlığı Eğitimi Sertifika Programımız, e-devlet ve üniversite onaylı olup, Aile ve Sosyal Hizmetler Bakanlığının belirttiği tüm şartlara uygun olarak hazırlanmıştır.',
    longDescription: 'Aile danışmanlığı ve süpervizyon, modern dünyada ailelerin karşılaştığı karmaşık sorunlarla başa çıkmada hayati bir rol oynar.',
    features: [
      '✓ %100 Online Eğitim (Asenkron)',
      '✓ 464 Saatlik Eğitim Sertifikası',
      '✓ 49 Video Ders, 1925 Sayfa PDF ve Online Test',
      '✓ 1 İş Gününde Eğitime Başlama',
      '✓ 1-3 İş Gününde Sertifika Onayı ve İşleme'
    ],
    startInfo: 'Başvurunuza müteakiben 1 iş gününde sisteme giriş adresi, kullanıcı adınız ve şifreniz tarafınıza gönderilecektir.',
    contactInfo: 'Farklı sorularınız var ise öncelikle **Sıkça Sorulan Sorular** sayfamızı incelemenizi tavsiye ederiz.',
    additionalInfo: '◆ Sertifika programları dijital içerik olduğundan ücret iadesi, iptal ve değişiklik yapılamamaktadır.',
    certificateOptions: [
      { id: 'university', name: 'e-Devlet & Üniversite Sertifikası', price: 0, selected: true },
      { id: 'international-en', name: 'Uluslararası İngilizce Sertifika', price: 50, selected: false },
      { id: 'international-tr', name: 'Uluslararası Türkçe Sertifika', price: 50, selected: false }
    ],
    extraOptions: [
      { id: 'transcript-uni', name: 'Üniversite Sertifikası Transkripti', price: 75, selected: false },
      { id: 'transcript-en', name: 'Uluslararası İngilizce Transkript', price: 75, selected: false },
      { id: 'print', name: 'Belgeleri Basın ve Kargolayın', price: 125, selected: false }
    ],
    headerImage: '',
    middleImage: '',
    bottomImage: '',
    sections: {
      summary: 'Aile Danışmanlığı Eğitimi Sertifika Programımız, e-devlet ve üniversite onaylı olup, Aile ve Sosyal Hizmetler Bakanlığının belirttiği tüm şartlara uygun olarak hazırlanmıştır.',
      about: 'Aile danışmanlığı ve süpervizyon, modern dünyada ailelerin karşılaştığı karmaşık sorunlarla başa çıkmada hayati bir rol oynar. Aile danışmanları, aile sağlığını koruma, aile içi iletişimi geliştirme, çeşitli psikolojik ve hukuki meselelerde rehberlik etme konularında uzmanlaşmıştır.',
      startInfo: 'Başvurunuza müteakiben 1 iş gününde sisteme giriş adresi, kullanıcı adınız ve şifreniz tarafınıza gönderilecektir.',
      contactInfo: 'Farklı sorularınız var ise öncelikle **Sıkça Sorulan Sorular** sayfamızı incelemenizi tavsiye ederiz.\n\nBize ulaşmak isterseniz canlı desteğe bağlanabilir, **0 850 550 50 54** çağrı merkezimizi arayabilir, aynı numaradan **WhatsApp** ile ulaşabilir ya da **info@abcakademi.com** adresine eposta gönderebilirsiniz.'
    },
    status: 'active',
    categories: [''],
    relatedCourses: ['']
  });

  // Sales page design states
  const [salesDesignMode, setSalesDesignMode] = useState('slideOver');
  const [inlineEditingSalesPage, setInlineEditingSalesPage] = useState<string | null>(null);
  const [inlineEditSalesValues, setInlineEditSalesValues] = useState<Record<string, string | number | boolean>>({});
  // const [expandedSalesRow, setExpandedSalesRow] = useState<string | null>(null);
  const [showSalesSlideOver, setShowSalesSlideOver] = useState(false);

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'student',
    status: 'active',
    assignedCourses: [] as string[]
  });

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Web Geliştirme',
    price: '',
    duration: '',
    level: 'Başlangıç',
    instructor: '',
    status: 'active',
    image: '',
    students: 0,
    rating: 4.5,
    courseAbout: '',
    whatYouWillLearn: [''],
    requirements: [''],
    includes: [''],
    lastUpdate: ''
  });

  const [certificateForm, setCertificateForm] = useState({
    studentName: '',
    studentEmail: '',
    courseName: '',
    courseId: '',
    certificateNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    status: 'issued'
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    status: 'active',
    image: '',
    color: '#2563eb'
  });

  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    siteName: 'ABC Akademi',
    siteDescription: 'Modern eğitim platformu',
    contactEmail: 'info@abcakademi.com',
    twoFactorAuth: false,
    autoLogout: true,
    passwordComplexity: true,
    autoLogoutTime: 30
  });

  // Notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'info' });

  const stats = [
    {
      title: 'Toplam Öğrenci',
      value: users.length.toString(),
      change: '+12%',
      changeType: 'positive',
      icon: Users
    },
    {
      title: 'Aktif Kurslar',
      value: courses.filter(c => c.status === 'active').length.toString(),
      change: '+8%',
      changeType: 'positive',
      icon: BookOpen
    },
    {
      title: 'Toplam Sertifika',
      value: certificates.length.toString(),
      change: '+15%',
      changeType: 'positive',
      icon: Award
    },
    {
      title: 'Aylık Gelir',
      value: '₺45,230',
      change: '+23%',
      changeType: 'positive',
      icon: DollarSign
    }
  ];

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'info' }), 3000);
  };

  // Arama fonksiyonları
  const handleGlobalSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleUserSearch = (term: string) => {
    setUserSearchTerm(term);
  };

  const handleCategorySearch = (term: string) => {
    setCategorySearchTerm(term);
  };

  const handleCourseSearch = (term: string) => {
    setCourseSearchTerm(term);
  };

  const handleCertificateSearch = (term: string) => {
    setCertificateSearchTerm(term);
  };

  const resetForms = () => {
    setUserForm({ name: '', email: '', password: '', phone: '', address: '', role: 'student', status: 'active', assignedCourses: [] });
    setCourseForm({ title: '', description: '', content: '', category: 'Web Geliştirme', price: '', duration: '', level: 'Başlangıç', instructor: '', status: 'active', image: '', students: 0, rating: 4.5, courseAbout: '', whatYouWillLearn: [''], requirements: [''], includes: [''], lastUpdate: '' });
    setCertificateForm({ studentName: '', studentEmail: '', courseName: '', courseId: '', certificateNumber: '', issueDate: new Date().toISOString().split('T')[0], status: 'issued' });
    setCategoryForm({ name: '', description: '', status: 'active', image: '', color: '#2563eb' });
  };

  // Kullanıcı işlemleri
  const handleAddUser = async () => {
    try {
      await userAPI.create(userForm);
      showNotification('Kullanıcı başarıyla eklendi', 'success');
      setShowUserModal(false);
      resetForms();
      loadData();
    } catch (error) {
      console.error('User creation error:', error);
      showNotification('Kullanıcı eklenirken hata oluştu', 'error');
    }
  };

  const handleEditUser = (user: IUser) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role,
      status: user.status,
      assignedCourses: user.assignedCourses || []
    });
    setShowUserModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const userId = editingUser._id || editingUser.id;
      await userAPI.update(userId, userForm);
      showNotification('Kullanıcı başarıyla güncellendi', 'success');
      setShowUserModal(false);
      setEditingUser(null);
      resetForms();
      loadData();
    } catch (error) {
      console.error('User update error:', error);
      showNotification('Kullanıcı güncellenirken hata oluştu', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await userAPI.delete(userId);
        showNotification('Kullanıcı başarıyla silindi', 'success');
        loadData();
      } catch (error) {
        console.error('User deletion error:', error);
        showNotification('Kullanıcı silinirken hata oluştu', 'error');
      }
    }
  };

  // Kategori işlemleri
  const handleAddCategory = async () => {
    try {
      await categoryAPI.create(categoryForm);
      showNotification('Kategori başarıyla eklendi', 'success');
      setShowCategoryModal(false);
      resetForms();
      loadData();
    } catch (error) {
      console.error('Category creation error:', error);
      showNotification('Kategori eklenirken hata oluştu', 'error');
    }
  };

  const handleEditCategory = (category: ICategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      status: category.status,
      image: category.image || '',
      color: category.color || '#2563eb'
    });
    setShowCategoryModal(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    try {
      await categoryAPI.update(editingCategory._id as string, categoryForm);
      showNotification('Kategori başarıyla güncellendi', 'success');
      setShowCategoryModal(false);
      setEditingCategory(null);
      resetForms();
      loadData();
    } catch (error) {
      console.error('Category update error:', error);
      showNotification('Kategori güncellenirken hata oluştu', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await categoryAPI.delete(categoryId);
        showNotification('Kategori başarıyla silindi', 'success');
        loadData();
      } catch (error) {
        console.error('Category deletion error:', error);
        showNotification('Kategori silinirken hata oluştu', 'error');
      }
    }
  };

  // Kurs işlemleri
  const handleAddCourse = async () => {
    try {
      // Create new course object
      const newCourse = {
        id: Date.now().toString(),
        _id: Date.now().toString(),
        title: courseForm.title,
        description: courseForm.description,
        content: courseForm.content || 'Kurs içeriği yakında eklenecek.',
        price: parseFloat(courseForm.price),
        duration: courseForm.duration,
        level: courseForm.level as 'Başlangıç' | 'Orta' | 'İleri',
        category: courseForm.category,
        image: courseForm.image || '/api/placeholder/400/300',
        instructor: courseForm.instructor,
        students: 0,
        rating: 4.5,
        status: courseForm.status as 'active' | 'draft',
        courseAbout: courseForm.courseAbout || '',
        whatYouWillLearn: courseForm.whatYouWillLearn || [''],
        requirements: courseForm.requirements || [''],
        includes: courseForm.includes || [''],
        lastUpdate: new Date().toLocaleDateString('tr-TR'),
        createdAt: new Date(),
        updatedAt: new Date()
      } as ICourse;

      // Add to state
      setCourses(prev => [...prev, newCourse]);
      
      showNotification(`✅ "${courseForm.title}" kursu başarıyla eklendi!`, 'success');
      setShowCourseModal(false);
      resetForms();
    } catch (error) {
      console.error('Course creation error:', error);
      showNotification('Kurs eklenirken hata oluştu', 'error');
    }
  };

  const handleEditCourse = (course: ICourse) => {
    console.log('Editing course:', course); // Debug log
    
    setEditingCourse(course);
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      content: course.content || '',
      category: course.category || 'Web Geliştirme',
      price: course.price ? course.price.toString() : '0',
      duration: course.duration || '',
      level: course.level || 'Başlangıç',
      instructor: course.instructor || '',
      status: course.status || 'active',
      image: course.image || '',
      students: course.students || 0,
      rating: course.rating || 4.5,
      courseAbout: course.courseAbout || '',
      whatYouWillLearn: course.whatYouWillLearn || [''],
      requirements: course.requirements || [''],
      includes: course.includes || [''],
      lastUpdate: course.lastUpdate || ''
    });
    setShowCourseModal(true);
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) {
      showNotification('Düzenlenecek kurs bulunamadı', 'error');
      return;
    }

    // Form validation
    if (!courseForm.title.trim()) {
      showNotification('Kurs adı boş olamaz', 'error');
      return;
    }

    if (!courseForm.price || parseFloat(courseForm.price) < 0) {
      showNotification('Geçerli bir fiyat giriniz', 'error');
      return;
    }

    try {
      // API'ye gönderilecek veriyi hazırla
      const courseDataToUpdate = {
        title: courseForm.title,
        description: courseForm.description,
        content: courseForm.content || editingCourse.content,
        price: parseFloat(courseForm.price),
        duration: courseForm.duration,
        level: courseForm.level as 'Başlangıç' | 'Orta' | 'İleri',
        category: courseForm.category,
        image: courseForm.image || editingCourse.image,
        instructor: courseForm.instructor,
        status: courseForm.status as 'active' | 'draft',
        courseAbout: courseForm.courseAbout || editingCourse.courseAbout,
        whatYouWillLearn: courseForm.whatYouWillLearn || editingCourse.whatYouWillLearn,
        requirements: courseForm.requirements || editingCourse.requirements,
        includes: courseForm.includes || editingCourse.includes,
        lastUpdate: new Date().toLocaleDateString('tr-TR')
      };

      // API çağrısı yap
      const courseId = editingCourse._id || editingCourse.id;
      await courseAPI.update(courseId as string, courseDataToUpdate);

      // Update in state
      setCourses(prev => prev.map(course => {
        const courseId = course.id || course._id;
        const editingId = editingCourse.id || editingCourse._id;
        
        if (courseId === editingId) {
          console.log('Updating course:', courseId, courseDataToUpdate); // Debug log
          return { ...course, ...courseDataToUpdate } as ICourse;
        }
        return course;
      }));
      
      showNotification(`✅ "${courseForm.title}" kursu başarıyla güncellendi!`, 'success');
      setShowCourseModal(false);
      setEditingCourse(null);
      resetForms();
    } catch (error) {
      console.error('Course update error:', error);
      showNotification('Kurs güncellenirken hata oluştu', 'error');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    const courseToDelete = courses.find(course => course.id === courseId || course._id === courseId);
    
    if (confirm(`"${courseToDelete?.title}" kursunu silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!`)) {
      try {
        // Remove from state
        setCourses(prev => prev.filter(course => 
          course.id !== courseId && course._id !== courseId
        ));
        
        showNotification(`🗑️ "${courseToDelete?.title}" kursu başarıyla silindi!`, 'success');
      } catch (error) {
        console.error('Course deletion error:', error);
        showNotification('Kurs silinirken hata oluştu', 'error');
      }
    }
  };

  // Inline editing functions
  const handleInlineEdit = (courseId: string, field: string, value: string | number | boolean) => {
    setInlineEditingCourse(courseId);
    setInlineEditValues({ ...inlineEditValues, [field]: value });
  };

  const handleInlineSave = async (courseId: string, field: string) => {
    try {
      const newValue = inlineEditValues[field];
      
      // API çağrısı yap
      await courseAPI.update(courseId, { [field]: newValue });
      
      // Update course in state
      setCourses(prev => prev.map(course => 
        (course.id || course._id) === courseId 
          ? { ...course, [field]: newValue } as ICourse
          : course
      ));
      
      showNotification(`✏️ ${field === 'title' ? 'Başlık' : 'Fiyat'} başarıyla güncellendi!`, 'success');
      setInlineEditingCourse(null);
      setInlineEditValues({});
    } catch (error) {
      console.error('Inline update error:', error);
      showNotification('Güncelleme sırasında hata oluştu', 'error');
    }
  };

  const handleInlineCancel = () => {
    setInlineEditingCourse(null);
    setInlineEditValues({});
  };

  // Slide-over panel functions
  const handleSlideOverEdit = (course: ICourse) => {
    setSlideOverCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      content: course.content,
      category: course.category,
      price: course.price.toString(),
      duration: course.duration,
      level: course.level,
      instructor: course.instructor,
      status: course.status,
      image: course.image || '',
      students: course.students || 0,
      rating: course.rating || 4.5,
      courseAbout: course.courseAbout || '',
      whatYouWillLearn: course.whatYouWillLearn || [''],
      requirements: course.requirements || [''],
      includes: course.includes || [''],
      lastUpdate: course.lastUpdate || ''
    });
    setShowSlideOver(true);
  };

  const handleSlideOverSave = async () => {
    if (!slideOverCourse) return;
    try {
      // courseForm'daki price'ı number'a çevir
      const courseDataToUpdate = {
        ...courseForm,
        price: parseFloat(courseForm.price) || 0,
        students: parseInt(courseForm.students.toString()) || 0,
        rating: parseFloat(courseForm.rating.toString()) || 0
      };
      
      const courseId = slideOverCourse._id || slideOverCourse.id;
      await courseAPI.update(courseId as string, courseDataToUpdate);
      showNotification('Kurs başarıyla güncellendi', 'success');
      setShowSlideOver(false);
      setSlideOverCourse(null);
      resetForms();
      loadData();
    } catch (error) {
      console.error('Slide-over update error:', error);
      showNotification('Kurs güncellenirken hata oluştu', 'error');
    }
  };

  // Sales page functions
  const handleAddSalesPage = async () => {
    try {
      // API call to create sales page
      showNotification('Satış sayfası başarıyla eklendi', 'success');
      setShowSalesPageModal(false);
      resetSalesPageForm();
      loadSalesPages();
    } catch (error) {
      console.error('Sales page creation error:', error);
      showNotification('Satış sayfası eklenirken hata oluştu', 'error');
    }
  };

  const handleEditSalesPage = (salesPage: SalesPage) => {
    setEditingSalesPage(salesPage);
    setSalesPageForm({
      title: salesPage.title,
      subtitle: salesPage.subtitle || '',
      originalPrice: salesPage.originalPrice.toString(),
      discountedPrice: salesPage.discountedPrice.toString(),
      description: salesPage.description,
      longDescription: salesPage.longDescription || '',
      features: salesPage.features || [''],
      startInfo: salesPage.startInfo || '',
      contactInfo: salesPage.contactInfo || '',
      additionalInfo: salesPage.additionalInfo || '',
      categories: salesPage.categories || [''],
      certificateOptions: salesPage.certificateOptions || [{ id: '', name: '', price: 0, selected: false }],
      extraOptions: salesPage.extraOptions || [{ id: '', name: '', price: 0, selected: false }],
      relatedCourses: salesPage.relatedCourses || [''],
      status: salesPage.status || 'active',
      headerImage: salesPage.headerImage || '',
      middleImage: salesPage.middleImage || '',
      bottomImage: salesPage.bottomImage || '',
      sections: {
        summary: salesPage.sections?.summary || '',
        about: salesPage.sections?.about || '',
        startInfo: salesPage.sections?.startInfo || '',
        contactInfo: salesPage.sections?.contactInfo || ''
      }
    });
    setShowSalesPageModal(true);
  };

  const handleUpdateSalesPage = async () => {
    if (!editingSalesPage) return;
    try {
      // Update the sales page in state
      const updatedSalesPage: SalesPage = {
        ...editingSalesPage,
        title: salesPageForm.title,
        subtitle: salesPageForm.subtitle,
        originalPrice: parseFloat(salesPageForm.originalPrice),
        discountedPrice: parseFloat(salesPageForm.discountedPrice),
        description: salesPageForm.description,
        longDescription: salesPageForm.longDescription,
        features: salesPageForm.features,
        startInfo: salesPageForm.startInfo,
        contactInfo: salesPageForm.contactInfo,
        additionalInfo: salesPageForm.additionalInfo,
        categories: salesPageForm.categories,
        certificateOptions: salesPageForm.certificateOptions,
        extraOptions: salesPageForm.extraOptions,
        relatedCourses: salesPageForm.relatedCourses,
        status: salesPageForm.status
      };

      // Update in state
      setSalesPages(prev => prev.map(page => 
        page.id === editingSalesPage.id ? updatedSalesPage : page
      ));

      showNotification('Satış sayfası başarıyla güncellendi! 🎉', 'success');
      setShowSalesPageModal(false);
      setEditingSalesPage(null);
      resetSalesPageForm();
    } catch (error) {
      console.error('Sales page update error:', error);
      showNotification('Satış sayfası güncellenirken hata oluştu', 'error');
    }
  };

  const handleDeleteSalesPage = async () => {
    if (confirm('Bu satış sayfasını silmek istediğinizden emin misiniz?')) {
      try {
        // API call to delete sales page
        showNotification('Satış sayfası başarıyla silindi', 'success');
        loadSalesPages();
      } catch (error) {
        console.error('Sales page deletion error:', error);
        showNotification('Satış sayfası silinirken hata oluştu', 'error');
      }
    }
  };

  const resetSalesPageForm = () => {
    setSalesPageForm({
      title: '',
      subtitle: '',
      originalPrice: '',
      discountedPrice: '',
      description: '',
      longDescription: '',
      features: [''],
      startInfo: '',
      contactInfo: '',
      additionalInfo: '',
      categories: [''],
      certificateOptions: [{ id: '', name: '', price: 0, selected: false }],
      extraOptions: [{ id: '', name: '', price: 0, selected: false }],
      relatedCourses: [''],
      status: 'active',
      headerImage: '',
      middleImage: '',
      bottomImage: '',
      sections: {
        summary: '',
        about: '',
        startInfo: '',
        contactInfo: ''
      }
    });
  };

  const loadSalesPages = async () => {
    try {
      // API call to load sales pages
      // Using detail-template default data
      setSalesPages([
        {
          id: 'aile-danismanligi',
          title: 'Aile Danışmanlığı Eğitimi Sertifika Programı',
          subtitle: '(Danışmanlık Merkezi Şartını Sağlar)',
          originalPrice: 10000,
          discountedPrice: 4990,
          description: 'Aile Danışmanlığı Eğitimi Sertifika Programımız, e-devlet ve üniversite onaylı olup, Aile ve Sosyal Hizmetler Bakanlığının belirttiği tüm şartlara ve Aile Danışmanı Merkezleri Yönetmeliği\'ne uygun olarak hazırlanmıştır.',
          longDescription: 'Aile danışmanlığı ve süpervizyon, modern dünyada ailelerin karşılaştığı karmaşık sorunlarla başa çıkmada hayati bir rol oynar. Aile danışmanları, aile sağlığını koruma, aile içi iletişimi geliştirme, çeşitli psikolojik ve hukuki meselelerde rehberlik etme konularında uzmanlaşmıştır.',
          features: [
            '✓ %100 Online Eğitim (Asenkron)',
            '✓ 464 Saatlik Eğitim Sertifikası',
            '✓ 49 Video Ders, 1925 Sayfa PDF ve Online Test',
            '✓ 1 İş Gününde Eğitime Başlama',
            '✓ 1-3 İş Gününde Sertifika Onayı ve İşleme',
            '✓ Sertifikalar PDF Formatında Dijital Olarak Gönderilir',
            '✓ Kamu ve Özel Sektörde Geçerli'
          ],
          startInfo: 'Başvurunuza müteakiben 1 iş gününde sisteme giriş adresi, kullanıcı adınız ve şifreniz tarafınıza gönderilecektir.',
          contactInfo: 'Farklı sorularınız var ise öncelikle **Sıkça Sorulan Sorular** sayfamızı incelemenizi tavsiye ederiz.\n\nBize ulaşmak isterseniz canlı desteğe bağlanabilir, **0 850 550 50 54** çağrı merkezimizi arayabilir, aynı numaradan **WhatsApp** ile ulaşabilir ya da **info@abcakademi.com** adresine eposta gönderebilirsiniz.',
          additionalInfo: '◆ Sertifika programları dijital içerik olduğundan ücret iadesi, iptal ve değişiklik yapılamamaktadır.\n◆ Üniversite ve uluslararası onay mercii sadece belgelendirme hizmeti sunmakta olup, iş garantisi vermemektedir.',
          certificateOptions: [
            { id: 'university', name: 'e-Devlet & Üniversite Sertifikası', price: 0, selected: false },
            { id: 'international-en', name: 'Uluslararası İngilizce Sertifika', price: 50, selected: false },
            { id: 'international-tr', name: 'Uluslararası Türkçe Sertifika', price: 50, selected: false }
          ],
          extraOptions: [
            { id: 'transcript-uni', name: 'Üniversite Sertifikası Transkripti', price: 75, selected: false },
            { id: 'transcript-en', name: 'Uluslararası İngilizce Transkript', price: 75, selected: false },
            { id: 'print', name: 'Belgeleri Basın ve Kargolayın', price: 125, selected: false }
          ],
          headerImage: '',
          middleImage: '',
          bottomImage: '',
          sections: {
            summary: 'Aile Danışmanlığı Eğitimi Sertifika Programımız, e-devlet ve üniversite onaylı olup, Aile ve Sosyal Hizmetler Bakanlığının belirttiği tüm şartlara uygun olarak hazırlanmıştır.',
            about: 'Aile danışmanlığı ve süpervizyon, modern dünyada ailelerin karşılaştığı karmaşık sorunlarla başa çıkmada hayati bir rol oynar. Aile danışmanları, aile sağlığını koruma, aile içi iletişimi geliştirme, çeşitli psikolojik ve hukuki meselelerde rehberlik etme konularında uzmanlaşmıştır.',
            startInfo: 'Başvurunuza müteakiben 1 iş gününde sisteme giriş adresi, kullanıcı adınız ve şifreniz tarafınıza gönderilecektir.',
            contactInfo: 'Farklı sorularınız var ise öncelikle **Sıkça Sorulan Sorular** sayfamızı incelemenizi tavsiye ederiz.\n\nBize ulaşmak isterseniz canlı desteğe bağlanabilir, **0 850 550 50 54** çağrı merkezimizi arayabilir, aynı numaradan **WhatsApp** ile ulaşabilir ya da **info@abcakademi.com** adresine eposta gönderebilirsiniz.'
          },
          status: 'active',
          createdAt: '2024-01-15'
        }
      ]);
    } catch (error) {
      console.error('Error loading sales pages:', error);
    }
  };

  const addFeature = () => {
    setSalesPageForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setSalesPageForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setSalesPageForm(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  // Sertifika işlemleri
  const handleAddCertificate = async () => {
    try {
      // Generate certificate number
      const certificateNumber = `ABC-${new Date().getFullYear()}-${String(certificates.length + 1).padStart(4, '0')}`;
      
      const newCertificate = {
        id: Date.now().toString(),
        studentName: certificateForm.studentName,
        studentEmail: certificateForm.studentEmail,
        courseName: certificateForm.courseName,
        courseId: certificateForm.courseId,
        certificateNumber: certificateNumber,
        issueDate: new Date(certificateForm.issueDate),
        status: certificateForm.status as 'issued' | 'revoked',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to state (in real app, this would be API call)
      setCertificates(prev => [...prev, newCertificate as ICertificate]);
      
      showNotification(`🎓 Sertifika başarıyla verildi! Sertifika No: ${certificateNumber}`, 'success');
      setShowCertificateModal(false);
      resetForms();
    } catch (error) {
      console.error('Certificate creation error:', error);
      showNotification('Sertifika eklenirken hata oluştu', 'error');
    }
  };

  const handleEditCertificate = (certificate: ICertificate) => {
    setEditingCertificate(certificate);
    setCertificateForm({
      studentName: certificate.studentName,
      studentEmail: certificate.studentEmail,
      courseName: certificate.courseName,
      courseId: certificate.courseId,
      certificateNumber: certificate.certificateNumber,
      issueDate: certificate.issueDate.toISOString().split('T')[0],
      status: certificate.status
    });
    setShowCertificateModal(true);
  };

  const handleUpdateCertificate = async () => {
    if (!editingCertificate) return;
    try {
      await certificateAPI.update(editingCertificate._id as string, certificateForm);
      showNotification('Sertifika başarıyla güncellendi', 'success');
      setShowCertificateModal(false);
      setEditingCertificate(null);
      resetForms();
      loadData();
    } catch (error) {
      console.error('Certificate update error:', error);
      showNotification('Sertifika güncellenirken hata oluştu', 'error');
    }
  };

  // Toplu işlemler
  const handleBulkAction = async (action: string) => {
    const selectedItems = [...selectedUsers, ...selectedCourses, ...selectedCategories];
    if (selectedItems.length === 0) {
      showNotification('Lütfen en az bir öğe seçin', 'error');
      return;
    }

    setActionLoading(true);
    try {
      switch (action) {
        case 'delete':
          if (confirm(`${selectedItems.length} öğeyi silmek istediğinizden emin misiniz?`)) {
            // Kullanıcıları sil
            if (selectedUsers.length > 0) {
              setUsers(prev => prev.filter(user => !selectedUsers.includes(user._id || user.id)));
            }
            // Kursları sil
            if (selectedCourses.length > 0) {
              setCourses(prev => prev.filter(course => !selectedCourses.includes(course.id || course._id)));
            }
            // Kategorileri sil
            if (selectedCategories.length > 0) {
              setCategories(prev => prev.filter(category => !selectedCategories.includes(category._id || category.id)));
            }
            showNotification(`🗑️ ${selectedItems.length} öğe başarıyla silindi`, 'success');
          }
          break;
        case 'export':
          // CSV export işlemi
          const csvData = generateBulkCSV();
          downloadCSV(csvData, 'bulk-export.csv');
          showNotification('📊 Veriler CSV olarak dışa aktarıldı', 'success');
          break;
        case 'activate':
          // Toplu aktifleştirme
          if (selectedUsers.length > 0) {
                        setUsers(prev => prev.map(user =>
              selectedUsers.includes(user._id || user.id)
                ? { ...user, status: 'active' } as IUser
                : user
            ));
          }
          showNotification(`✅ ${selectedItems.length} öğe aktifleştirildi`, 'success');
          break;
        case 'deactivate':
          // Toplu pasifleştirme
          if (selectedUsers.length > 0) {
                        setUsers(prev => prev.map(user =>
              selectedUsers.includes(user._id || user.id)
                ? { ...user, status: 'inactive' } as IUser
                : user
            ));
          }
          showNotification(`⏸️ ${selectedItems.length} öğe pasifleştirildi`, 'success');
          break;
        default:
          break;
      }
      setSelectedUsers([]);
      setSelectedCourses([]);
      setSelectedCategories([]);
    } catch (error) {
      console.error('Bulk action error:', error);
      showNotification('Toplu işlem sırasında hata oluştu', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // CSV Export Functions
  const generateBulkCSV = () => {
    let csvContent = "Tür,İsim,Email,Durum,Ek Bilgi\n";
    
    // Selected users
    selectedUsers.forEach(userId => {
      const user = users.find(u => (u._id || u.id) === userId);
      if (user) {
        csvContent += `Kullanıcı,${user.name},${user.email},${user.status},${user.role}\n`;
      }
    });
    
    // Selected courses
    selectedCourses.forEach(courseId => {
      const course = courses.find(c => (c.id || c._id) === courseId);
      if (course) {
        csvContent += `Kurs,${course.title},${course.instructor},${course.status},${course.category}\n`;
      }
    });
    
    // Selected categories
    selectedCategories.forEach(categoryId => {
      const category = categories.find(c => (c._id || c.id) === categoryId);
      if (category) {
        csvContent += `Kategori,${category.name},,${category.status},${category.description}\n`;
      }
    });
    
    return csvContent;
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter functions
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  const filteredCertificates = certificates.filter(cert =>
    cert.studentName.toLowerCase().includes(certificateSearchTerm.toLowerCase()) ||
    cert.courseName.toLowerCase().includes(certificateSearchTerm.toLowerCase())
  );

  // Ayarlar işlemleri
  const handleSaveSettings = async () => {
    try {
      await settingsAPI.update(settingsForm);
      showNotification('Ayarlar başarıyla kaydedildi', 'success');
      loadData();
    } catch (error) {
      console.error('Settings save error:', error);
      showNotification('Ayarlar kaydedilirken hata oluştu', 'error');
    }
  };

  const handleToggleSetting = (setting: keyof typeof settingsForm) => {
    setSettingsForm(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSettingChange = (setting: keyof typeof settingsForm, value: string | number | boolean) => {
    setSettingsForm(prev => ({ ...prev, [setting]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: BarChart3 },
    { id: 'users', name: 'Kullanıcı Yönetimi', icon: Users },
    { id: 'categories', name: 'Kategori Yönetimi', icon: Tag },
    { id: 'courses', name: 'Kurs Yönetimi', icon: BookOpen },
    { id: 'sales-pages', name: 'Tasarım Sayfası Yönetimi', icon: Edit },
    { id: 'certificates', name: 'Sertifika Yönetimi', icon: Award },
    { id: 'pricing', name: 'Fiyat Yönetimi', icon: DollarSign },
    { id: 'settings', name: 'Sistem Ayarları', icon: SettingsIcon },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                      <span className="sr-only">
                        {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                      </span>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Hızlı İşlemler</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => {
                setEditingCourse(null);
                resetForms();
                setShowCourseModal(true);
              }}
              className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-500 text-white ring-4 ring-white">
                  <BookOpen className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  Yeni Kurs Ekle
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Yeni bir kurs oluşturun
                </p>
              </div>
            </button>
            <button
              onClick={() => {
                setEditingUser(null);
                resetForms();
                setShowUserModal(true);
              }}
              className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-500 text-white ring-4 ring-white">
                  <UserPlus className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  Öğrenci Ekle
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Yeni öğrenci kaydı yapın
                </p>
              </div>
            </button>
            <button
              onClick={() => {
                setEditingCertificate(null);
                resetForms();
                setShowCertificateModal(true);
              }}
              className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-500 text-white ring-4 ring-white">
                  <Award className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  Sertifika Ver
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Öğrenciye sertifika verin
                </p>
              </div>
            </button>
            <button
              onClick={() => {
                setEditingCategory(null);
                resetForms();
                setShowCategoryModal(true);
              }}
              className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-indigo-500 text-white ring-4 ring-white">
                  <Tag className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  Yeni Kategori Ekle
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Yeni bir kategori oluşturun
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Son Aktiviteler</h2>
        </div>
        <div className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <UserPlus className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Yeni öğrenci kaydı: <span className="font-medium text-gray-900">Ahmet Yılmaz</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>3 saat önce</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <BookOpen className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Yeni kurs eklendi: <span className="font-medium text-gray-900">React.js İleri Seviye</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>1 gün önce</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white">
                        <Award className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Sertifika verildi: <span className="font-medium text-gray-900">Web Geliştirme Temelleri</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>2 gün önce</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => {
    // Kullanıcıları filtrele
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingUser(null);
              resetForms();
              setShowUserModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Yeni Kullanıcı
          </button>
          <button
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," +
                "İsim,Email,Rol,Durum,Kayıt Tarihi\n" +
                users.map(user => `${user.name},${user.email},${user.role},${user.status},${user.joinDate}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "kullanicilar.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              showNotification('Kullanıcı listesi dışa aktarıldı', 'success');
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedUsers.length} kullanıcı seçildi
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Sil
              </button>
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3" />
                Aktifleştir
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Pasifleştir
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                Dışa Aktar
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(users.map(u => u._id || u.id).filter((id): id is string => id !== undefined));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedUsers.includes(user._id || user.id)}
                      onChange={(e) => {
                        const userId = user._id || user.id;
                        if (e.target.checked && userId) {
                          setSelectedUsers([...selectedUsers, userId]);
                        } else if (userId) {
                          setSelectedUsers(selectedUsers.filter(id => id !== userId));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {user.role === 'admin' ? 'Admin' : 'Öğrenci'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {user.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => showNotification(`${user.name} kullanıcısının detayları görüntüleniyor`, 'info')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Görüntüle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Düzenle"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`${user.name} kullanıcısını silmek istediğinizden emin misiniz?`)) {
                            handleDeleteUser(user._id || user.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  const renderCategories = () => {
    // Kategorileri filtrele
    const filteredCategories = categories.filter(category => 
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );

    return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Kategori ara..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            value={categorySearchTerm}
            onChange={(e) => setCategorySearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingCategory(null);
              resetForms();
              setShowCategoryModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Yeni Kategori
          </button>
          <button
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," +
                "Kategori Adı,Açıklama,Durum\n" +
                categories.map(cat => `${cat.name},${cat.description},${cat.status}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "kategoriler.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              showNotification('Kategori listesi dışa aktarıldı', 'success');
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Toplu İndir
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCourses.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedCourses.length} kurs seçildi
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Aktifleştir
              </button>
              <button
                onClick={() => handleBulkAction('draft')}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
              >
                Taslak Yap
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Sil
              </button>
              <button
                onClick={() => setSelectedCourses([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCourses(categories.map(c => c._id || c.id).filter((id): id is string => id !== undefined));
                      } else {
                        setSelectedCourses([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category._id || category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedCourses.includes(category._id || category.id)}
                      onChange={(e) => {
                        const categoryId = category._id || category.id;
                        if (e.target.checked && categoryId) {
                          setSelectedCourses([...selectedCourses, categoryId]);
                        } else if (categoryId) {
                          setSelectedCourses(selectedCourses.filter(id => id !== categoryId));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {category.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Düzenle"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`${category.name} kategorisini silmek istediğinizden emin misiniz?`)) {
                            handleDeleteCategory(category._id || category.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  const renderCourses = () => {
    // Kursları filtrele
    const filteredCourses = courses.filter(course => 
      course.title.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(courseSearchTerm.toLowerCase())
    );

    return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Kurs ara..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            value={courseSearchTerm}
            onChange={(e) => setCourseSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingCourse(null);
              resetForms();
              setShowCourseModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Yeni Kurs
          </button>
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.csv,.xlsx';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  showNotification('Dosya yüklendi: ' + file.name, 'success');
                }
              };
              input.click();
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Toplu Yükle
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCourses.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedCourses.length} kurs seçildi
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Aktifleştir
              </button>
              <button
                onClick={() => handleBulkAction('draft')}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
              >
                Taslak Yap
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Sil
              </button>
              <button
                onClick={() => setSelectedCourses([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCourses(courses.map(c => c.id).filter((id): id is string => id !== undefined));
                      } else {
                        setSelectedCourses([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kurs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seviye
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Öğrenci
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id || course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={course.id ? selectedCourses.includes(course.id) : false}
                      onChange={(e) => {
                        if (e.target.checked && course.id) {
                          setSelectedCourses([...selectedCourses, course.id]);
                        } else if (course.id) {
                          setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {inlineEditingCourse === (course._id || course.id) && inlineEditValues.title !== undefined ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={String(inlineEditValues.title || '')}
                          onChange={(e) => setInlineEditValues({ ...inlineEditValues, title: e.target.value })}
                          className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                        <button
                          onClick={() => handleInlineSave(course._id || course.id!, 'title')}
                          className="text-green-600 hover:text-green-800"
                          title="Kaydet"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleInlineCancel}
                          className="text-red-600 hover:text-red-800"
                          title="İptal"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => handleInlineEdit(course._id || course.id!, 'title', course.title)}
                        title="Düzenlemek için tıklayın"
                      >
                        {course.title}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {course.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {inlineEditingCourse === (course._id || course.id) && inlineEditValues.price !== undefined ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={String(inlineEditValues.price || '')}
                          onChange={(e) => setInlineEditValues({ ...inlineEditValues, price: parseInt(e.target.value) })}
                          className="w-20 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                        <button
                          onClick={() => handleInlineSave(course._id || course.id!, 'price')}
                          className="text-green-600 hover:text-green-800"
                          title="Kaydet"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleInlineCancel}
                          className="text-red-600 hover:text-red-800"
                          title="İptal"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => handleInlineEdit(course._id || course.id!, 'price', course.price)}
                        title="Düzenlemek için tıklayın"
                      >
                        ₺{course.price}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {course.status === 'active' ? 'Aktif' : 'Taslak'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => showNotification(`${course.title} kursunun detayları görüntüleniyor`, 'info')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Görüntüle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSlideOverEdit(course)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Detaylı Düzenle"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Hızlı Düzenle"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`${course.title} kursunu silmek istediğinizden emin misiniz?`)) {
                            const courseId = course._id || course.id;
                            if (courseId) {
                              handleDeleteCourse(courseId);
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  const renderCertificates = () => {
    // Sertifikaları filtrele
    const filteredCertificates = certificates.filter(certificate => 
      certificate.studentName.toLowerCase().includes(certificateSearchTerm.toLowerCase()) ||
      certificate.courseName.toLowerCase().includes(certificateSearchTerm.toLowerCase()) ||
      certificate.certificateNumber.toLowerCase().includes(certificateSearchTerm.toLowerCase())
    );

    return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Sertifika ara..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            value={certificateSearchTerm}
            onChange={(e) => setCertificateSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingCertificate(null);
              resetForms();
              setShowCertificateModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Yeni Sertifika
          </button>
          <button
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," +
                "Öğrenci,Kurs,Verilme Tarihi,Durum\n" +
                certificates.map(cert => `${cert.studentName},${cert.courseName},${cert.issueDate},${cert.status}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "sertifikalar.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              showNotification('Sertifika listesi dışa aktarıldı', 'success');
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Toplu İndir
          </button>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Öğrenci
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kurs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verilme Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCertificates.map((cert) => (
                <tr key={cert._id || cert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cert.studentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cert.courseName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('tr-TR') : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${cert.status === 'issued' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {cert.status === 'issued' ? 'Verildi' : 'Beklemede'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => showNotification(`${cert.studentName} - ${cert.courseName} sertifikası görüntüleniyor`, 'info')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Görüntüle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = "#"; // Gerçek sertifika dosyası URL'si buraya gelecek
                          link.download = `${cert.studentName}_${cert.courseName}_sertifika.pdf`;
                          link.click();
                          showNotification('Sertifika indiriliyor...', 'success');
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="İndir"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditCertificate(cert)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Düzenle"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  const renderSalesPages = () => {
    // Inline editing functions
    const handleInlineEditSales = (salesPageId: string, field: string, value: string | number | boolean) => {
      setInlineEditingSalesPage(salesPageId);
      setInlineEditSalesValues({ ...inlineEditSalesValues, [field]: value });
    };

    const handleInlineSaveSales = async (salesPageId: string, field: string) => {
      try {
        const newValue = inlineEditSalesValues[field];
        // Update the salesPages state
        setSalesPages(prev => prev.map(page =>
          page.id === salesPageId ? { ...page, [field]: newValue } : page
        ));
        showNotification(`${field === 'title' ? 'Başlık' : 'Fiyat'} başarıyla güncellendi! 🎉`, 'success');
        setInlineEditingSalesPage(null);
        setInlineEditSalesValues({});
      } catch (error) {
        console.error('Inline update error:', error);
        showNotification('Güncelleme sırasında hata oluştu', 'error');
      }
    };

    const handleInlineCancelSales = () => {
      setInlineEditingSalesPage(null);
      setInlineEditSalesValues({});
    };

    return (
      <div className="space-y-6">
        {/* Design Mode Selector */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">🎨 Yönetim Merkezi</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-gray-100 rounded-lg p-2">
              <button
                onClick={() => setSalesDesignMode('inline')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${salesDesignMode === 'inline'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
              >
                ✨ 1. Inline Editing
              </button>
              <button
                onClick={() => setSalesDesignMode('slideOver')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${salesDesignMode === 'slideOver'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
              >
                🚀 .2. Mağaza Tasarım Aracı - Çok Trendy
              </button>
              <button
                onClick={() => setSalesDesignMode('courses')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${salesDesignMode === 'courses'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
              >
                📚 3. Kurslar Yönetimi
              </button>
              <button
                onClick={() => setSalesDesignMode('categories')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${salesDesignMode === 'categories'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
              >
                🏷️ 4. Kategori Yönetimi
              </button>
            </div>
          </div>
        </div>

        {/* Design Mode 1: Inline Editing */}
        {salesDesignMode === 'inline' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-lg font-medium text-gray-900">✨ 1. Inline Editing - En Modern</h3>
              <p className="text-sm text-gray-600 mt-1">Satıra tıklayarak hızlı düzenleme yapın → Kaydet/İptal butonları</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sayfa Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fiyat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksiyon
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salesPages.map((salesPage) => (
                    <tr key={salesPage.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inlineEditingSalesPage === salesPage.id && inlineEditSalesValues.title !== undefined ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={String(inlineEditSalesValues.title || '')}
                              onChange={(e) => setInlineEditSalesValues({ ...inlineEditSalesValues, title: e.target.value })}
                              className="text-sm font-medium text-gray-900 border-2 border-blue-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                              autoFocus
                            />
                            <button
                              onClick={() => handleInlineSaveSales(salesPage.id, 'title')}
                              className="text-green-600 hover:text-green-800 bg-green-100 rounded-full p-2 transition-colors"
                              title="Kaydet"
                              aria-label="Değişiklikleri kaydet"
                            >
                              <span aria-hidden="true">✅</span>
                              <span className="sr-only">Kaydet</span>
                            </button>
                            <button
                              onClick={() => {
                                setInlineEditingSalesPage(null);
                                setInlineEditSalesValues({});
                              }}
                              className="text-red-600 hover:text-red-800 bg-red-100 rounded-full p-2 transition-colors"
                              title="İptal"
                              aria-label="Değişiklikleri iptal et"
                            >
                              <span aria-hidden="true">❌</span>
                              <span className="sr-only">İptal</span>
                            </button>
                          </div>
                        ) : (
                          <div
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border-2 border-transparent hover:border-blue-200"
                            onClick={() => handleInlineEditSales(salesPage.id, 'title', salesPage.title)}
                            title="Düzenlemek için tıklayın"
                          >
                            {salesPage.title}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          Satış Sayfası
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inlineEditingSalesPage === salesPage.id && inlineEditSalesValues.discountedPrice !== undefined ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={String(inlineEditSalesValues.discountedPrice || '')}
                              onChange={(e) => setInlineEditSalesValues({ ...inlineEditSalesValues, discountedPrice: parseInt(e.target.value) })}
                              className="w-24 text-sm border-2 border-blue-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                              autoFocus
                            />
                            <button
                              onClick={() => handleInlineSaveSales(salesPage.id, 'discountedPrice')}
                              className="text-green-600 hover:text-green-800 bg-green-100 rounded-full p-2 transition-colors"
                              title="Kaydet"
                              aria-label="Fiyat değişikliğini kaydet"
                            >
                              <span aria-hidden="true">✅</span>
                              <span className="sr-only">Kaydet</span>
                            </button>
                            <button
                              onClick={handleInlineCancelSales}
                              className="text-red-600 hover:text-red-800 bg-red-100 rounded-full p-2 transition-colors"
                              title="İptal"
                              aria-label="Fiyat değişikliğini iptal et"
                            >
                              <span aria-hidden="true">❌</span>
                              <span className="sr-only">İptal</span>
                            </button>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border-2 border-transparent hover:border-blue-200 font-medium text-green-600"
                            onClick={() => handleInlineEditSales(salesPage.id, 'discountedPrice', salesPage.discountedPrice)}
                            title="Düzenlemek için tıklayın"
                          >
                            ₺{salesPage.discountedPrice}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-3">
                          <button
                            onClick={() => window.open(`/courses/detail-template`, '_blank')}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 rounded-full p-2 transition-colors"
                            title="Önizleme"
                            aria-label="Satış sayfası önizlemesi"
                          >
                            <span aria-hidden="true">✏️</span>
                            <span className="sr-only">Önizleme</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSalesPage()}
                            className="text-red-600 hover:text-red-900 bg-red-100 rounded-full p-2 transition-colors"
                            title="Sil"
                            aria-label="Satış sayfasını sil"
                          >
                            <span aria-hidden="true">🗑️</span>
                            <span className="sr-only">Sil</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Design Mode 2: Slide-Over Panel */}
        {salesDesignMode === 'slideOver' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                <h3 className="text-lg font-medium text-gray-900">🚀 2. Slide-Over Panel - Çok Trendy</h3>
                <p className="text-sm text-gray-600 mt-1">Sağdan açılan panel ile modern düzenleme</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {salesPages.map((salesPage) => (
                    <div key={salesPage.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-lg">• {salesPage.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">₺{salesPage.discountedPrice} - Satış Sayfası</p>
                      </div>
                      <button
                        onClick={() => {
                          // Form verilerini yükle
                          setSalesPageForm({
                            title: salesPage.title,
                            subtitle: salesPage.subtitle || '',
                            originalPrice: salesPage.originalPrice.toString(),
                            discountedPrice: salesPage.discountedPrice.toString(),
                            description: salesPage.description,
                            longDescription: salesPage.longDescription || '',
                            features: salesPage.features || [''],
                            startInfo: salesPage.startInfo || '',
                            contactInfo: salesPage.contactInfo || '',
                            additionalInfo: salesPage.additionalInfo || '',
                            headerImage: salesPage.headerImage || '',
                            middleImage: salesPage.middleImage || '',
                            bottomImage: salesPage.bottomImage || '',
                            sections: {
                              summary: (salesPage.sections as Record<string, string>)?.summary || 'Özet bilgi buraya gelecek...',
                              about: (salesPage.sections as Record<string, string>)?.about || 'Hakkında bilgisi buraya gelecek...',
                              startInfo: (salesPage.sections as Record<string, string>)?.startInfo || 'Ne zaman başlayabilirim bilgisi...',
                              contactInfo: (salesPage.sections as Record<string, string>)?.contactInfo || 'İletişim bilgileri buraya gelecek...'
                            },
                            certificateOptions: salesPage.certificateOptions || [
                              { id: 'university', name: 'e-Devlet & Üniversite Sertifikası', price: 0, selected: true },
                              { id: 'international-en', name: 'Uluslararası İngilizce Sertifika', price: 50, selected: false },
                              { id: 'international-tr', name: 'Uluslararası Türkçe Sertifika', price: 50, selected: false }
                            ],
                            extraOptions: salesPage.extraOptions || [
                              { id: 'transcript-uni', name: 'Üniversite Sertifikası Transkripti', price: 75, selected: false },
                              { id: 'transcript-en', name: 'Uluslararası İngilizce Transkript', price: 75, selected: false },
                              { id: 'transcript-tr', name: 'Uluslararası Türkçe Transkript', price: 75, selected: false },
                              { id: 'print', name: 'Belgeleri Basın ve Kargolayın', price: 125, selected: false }
                            ],
                            status: salesPage.status || 'active',
                            categories: salesPage.categories || [''],
                            relatedCourses: salesPage.relatedCourses || ['']
                          });
                          setShowSalesSlideOver(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        🎨 Düzenle →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <h4 className="font-medium text-gray-900">📝 Düzenleme Panel</h4>
                <p className="text-xs text-gray-500 mt-1">Sağdan açılacak panel önizlemesi</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kurs Adı:</label>
                  <div className="w-full h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center px-3">
                    <span className="text-sm text-gray-500">[Düzenlenebilir alan]</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori:</label>
                  <div className="w-full h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center px-3">
                    <span className="text-sm text-gray-500">[Dropdown menü]</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat:</label>
                  <div className="w-full h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center px-3">
                    <span className="text-sm text-gray-500">[Sayı girişi]</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <div className="flex-1 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border-2 border-dashed border-blue-300 flex items-center justify-center">
                    <span className="text-sm text-blue-600 font-medium">[Kaydet]</span>
                  </div>
                  <div className="flex-1 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-sm text-gray-500">[İptal]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Slide-Over Panel Component */}
        {showSalesSlideOver && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSalesSlideOver(false)} />
            <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
              <div className="flex flex-col h-full">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">🛍️ Mağaza Tasarım Aracı</h2>
                    <button
                      onClick={() => setShowSalesSlideOver(false)}
                      className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-full p-2"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {/* Temel Bilgiler */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">📝 Temel Bilgiler</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sayfa Başlığı *</label>
                          <input
                            type="text"
                            value={salesPageForm.title}
                            onChange={(e) => setSalesPageForm({ ...salesPageForm, title: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Kurs başlığını girin..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
                          <input
                            type="text"
                            value={salesPageForm.subtitle}
                            onChange={(e) => setSalesPageForm({ ...salesPageForm, subtitle: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Alt başlık (opsiyonel)..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Orijinal Fiyat (₺)</label>
                            <input
                              type="number"
                              value={salesPageForm.originalPrice}
                              onChange={(e) => setSalesPageForm({ ...salesPageForm, originalPrice: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="10000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">İndirimli Fiyat (₺)</label>
                            <input
                              type="number"
                              value={salesPageForm.discountedPrice}
                              onChange={(e) => setSalesPageForm({ ...salesPageForm, discountedPrice: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="4990"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resim Yönetimi */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">🖼️ Resim Yönetimi</h3>
                      <div className="space-y-6">
                        {/* Ana Başlık Altı Resim */}
                        <div className="border-2 border-purple-200 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-3">📸 Ana Başlık Altı Resim</label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="headerImageType"
                                  value="url"
                                  defaultChecked
                                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">🌐 URL Linki</span>
                              </label>
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="headerImageType"
                                  value="file"
                                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">📁 Dosya Yolu</span>
                              </label>
                            </div>
                            <input
                              type="text"
                              value={salesPageForm.headerImage}
                              onChange={(e) => setSalesPageForm({ ...salesPageForm, headerImage: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                              placeholder="https://example.com/image.jpg veya /images/header.jpg"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
                                onClick={() => setSalesPageForm({ ...salesPageForm, headerImage: 'https://via.placeholder.com/800x400' })}
                              >
                                🖼️ Demo Resim
                              </button>
                              <button
                                type="button"
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                                onClick={() => setSalesPageForm({ ...salesPageForm, headerImage: '' })}
                                aria-label="Header resmi temizle"
                              >
                                <span aria-hidden="true">🗑️</span> Temizle
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Orta Kısım Resim */}
                        <div className="border-2 border-purple-200 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-3">🖼️ Orta Kısım Resim</label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="middleImageType"
                                  value="url"
                                  defaultChecked
                                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">🌐 URL Linki</span>
                              </label>
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="middleImageType"
                                  value="file"
                                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">📁 Dosya Yolu</span>
                              </label>
                            </div>
                            <input
                              type="text"
                              value={salesPageForm.middleImage}
                              onChange={(e) => setSalesPageForm({ ...salesPageForm, middleImage: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                              placeholder="https://example.com/image.jpg veya /images/middle.jpg"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
                                onClick={() => setSalesPageForm({ ...salesPageForm, middleImage: 'https://via.placeholder.com/600x300' })}
                              >
                                🖼️ Demo Resim
                              </button>
                              <button
                                type="button"
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                                onClick={() => setSalesPageForm({ ...salesPageForm, middleImage: '' })}
                                aria-label="Orta resmi temizle"
                              >
                                <span aria-hidden="true">🗑️</span> Temizle
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Alt Kısım Resim */}
                        <div className="border-2 border-purple-200 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-3">🎨 Alt Kısım Resim</label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="bottomImageType"
                                  value="url"
                                  defaultChecked
                                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">🌐 URL Linki</span>
                              </label>
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="bottomImageType"
                                  value="file"
                                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">📁 Dosya Yolu</span>
                              </label>
                            </div>
                            <input
                              type="text"
                              value={salesPageForm.bottomImage}
                              onChange={(e) => setSalesPageForm({ ...salesPageForm, bottomImage: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                              placeholder="https://example.com/image.jpg veya /images/bottom.jpg"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
                                onClick={() => setSalesPageForm({ ...salesPageForm, bottomImage: 'https://via.placeholder.com/800x200' })}
                              >
                                🖼️ Demo Resim
                              </button>
                              <button
                                type="button"
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                                onClick={() => setSalesPageForm({ ...salesPageForm, bottomImage: '' })}
                                aria-label="Alt resmi temizle"
                              >
                                <span aria-hidden="true">🗑️</span> Temizle
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* İçerik Bölümleri */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">📄 İçerik Bölümleri</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Özet Bilgi</label>
                          <textarea
                            value={salesPageForm.sections.summary}
                            onChange={(e) => setSalesPageForm({
                              ...salesPageForm,
                              sections: { ...salesPageForm.sections, summary: e.target.value }
                            })}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            placeholder="Kurs hakkında özet bilgi..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Hakkında</label>
                          <textarea
                            value={salesPageForm.sections.about}
                            onChange={(e) => setSalesPageForm({
                              ...salesPageForm,
                              sections: { ...salesPageForm.sections, about: e.target.value }
                            })}
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            placeholder="Kurs hakkında detaylı bilgi..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ne Zaman Başlayabilirim?</label>
                          <textarea
                            value={salesPageForm.sections.startInfo}
                            onChange={(e) => setSalesPageForm({
                              ...salesPageForm,
                              sections: { ...salesPageForm.sections, startInfo: e.target.value }
                            })}
                            rows={2}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            placeholder="Başlangıç bilgisi..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sorularım için nasıl ulaşabilirim?</label>
                          <textarea
                            value={salesPageForm.sections.contactInfo}
                            onChange={(e) => setSalesPageForm({
                              ...salesPageForm,
                              sections: { ...salesPageForm.sections, contactInfo: e.target.value }
                            })}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            placeholder="İletişim bilgileri..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sertifika Türleri */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">🏆 Sertifika Türü Seçiniz (en az bir seçim)</h3>
                      <div className="space-y-3">
                        {salesPageForm.certificateOptions.map((option, index) => (
                          <div key={option.id} className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-300 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={option.selected}
                                  onChange={(e) => {
                                    const newOptions = [...salesPageForm.certificateOptions];
                                    newOptions[index].selected = e.target.checked;
                                    setSalesPageForm({ ...salesPageForm, certificateOptions: newOptions });
                                  }}
                                  className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  value={option.name}
                                  onChange={(e) => {
                                    const newOptions = [...salesPageForm.certificateOptions];
                                    newOptions[index].name = e.target.value;
                                    setSalesPageForm({ ...salesPageForm, certificateOptions: newOptions });
                                  }}
                                  className="ml-3 text-sm font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Fiyat:</span>
                                <input
                                  type="number"
                                  value={option.price}
                                  onChange={(e) => {
                                    const newOptions = [...salesPageForm.certificateOptions];
                                    newOptions[index].price = parseInt(e.target.value) || 0;
                                    setSalesPageForm({ ...salesPageForm, certificateOptions: newOptions });
                                  }}
                                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                  min="0"
                                />
                                <span className="text-sm font-medium text-gray-700">₺</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newOptions = salesPageForm.certificateOptions.filter((_, i) => i !== index);
                                    setSalesPageForm({ ...salesPageForm, certificateOptions: newOptions });
                                  }}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  disabled={salesPageForm.certificateOptions.length === 1}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 ml-8">
                              {option.price === 0 ? '✅ Ücretsiz' : `💰 Ek ücret: +₺${option.price}`}
                            </div>
                          </div>
                        ))}

                        {/* Yeni Sertifika Seçeneği Ekleme */}
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => {
                              const newOption = {
                                id: `custom-${Date.now()}`,
                                name: 'Yeni Sertifika Türü',
                                price: 0,
                                selected: false
                              };
                              setSalesPageForm({
                                ...salesPageForm,
                                certificateOptions: [...salesPageForm.certificateOptions, newOption]
                              });
                            }}
                            className="w-full px-4 py-2 border-2 border-dashed border-yellow-300 text-yellow-700 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Yeni Sertifika Türü Ekle
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Kurs Özellikleri */}
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">✨ Kurs Özellikleri</h3>
                      <div className="space-y-2">
                        {salesPageForm.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...salesPageForm.features];
                                newFeatures[index] = e.target.value;
                                setSalesPageForm({ ...salesPageForm, features: newFeatures });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="✓ Özellik açıklaması..."
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = salesPageForm.features.filter((_, i) => i !== index);
                                setSalesPageForm({ ...salesPageForm, features: newFeatures });
                              }}
                              className="text-red-600 hover:text-red-800 p-2"
                              disabled={salesPageForm.features.length === 1}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setSalesPageForm({
                              ...salesPageForm,
                              features: [...salesPageForm.features, '']
                            });
                          }}
                          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 mt-2"
                        >
                          <Plus className="h-4 w-4" />
                          Özellik Ekle
                        </button>
                      </div>
                    </div>

                    {/* Sayfa Durumu */}
                    <div className="bg-red-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">⚡ Sayfa Durumu</h3>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="active"
                            checked={salesPageForm.status === 'active'}
                            onChange={(e) => setSalesPageForm({ ...salesPageForm, status: e.target.value })}
                            className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                          />
                          <span className="ml-2 text-sm font-medium text-green-700">✅ Aktif (Yayında)</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="draft"
                            checked={salesPageForm.status === 'draft'}
                            onChange={(e) => setSalesPageForm({ ...salesPageForm, status: e.target.value })}
                            className="h-4 w-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                          />
                          <span className="ml-2 text-sm font-medium text-yellow-700">⏸️ Pasif (Taslak)</span>
                        </label>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        {salesPageForm.status === 'active'
                          ? '🌐 Bu sayfa kullanıcılar tarafından görülebilir'
                          : '🔒 Bu sayfa sadece admin tarafından görülebilir'
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowSalesSlideOver(false)}
                      className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      ❌ İptal
                    </button>
                    <button
                      onClick={() => {
                        // Update the salesPages state with form data
                        setSalesPages(prev => prev.map(page =>
                          page.id === 'aile-danismanligi' ? {
                            ...page,
                            title: salesPageForm.title,
                            subtitle: salesPageForm.subtitle,
                            originalPrice: parseInt(salesPageForm.originalPrice),
                            discountedPrice: parseInt(salesPageForm.discountedPrice),
                            description: salesPageForm.description,
                            longDescription: salesPageForm.longDescription,
                            features: salesPageForm.features,
                            headerImage: salesPageForm.headerImage,
                            middleImage: salesPageForm.middleImage,
                            bottomImage: salesPageForm.bottomImage,
                            sections: salesPageForm.sections,
                            certificateOptions: salesPageForm.certificateOptions,
                            extraOptions: salesPageForm.extraOptions,
                            status: salesPageForm.status
                          } : page
                        ));
                        showNotification('Satış sayfası başarıyla güncellendi! 🎉', 'success');
                        setShowSalesSlideOver(false);
                      }}
                      className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      💾 Kaydet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Design Mode 3: Kurslar Yönetimi */}
        {salesDesignMode === 'courses' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="text-lg font-medium text-gray-900">📚 3. Kurslar Yönetimi</h3>
              <p className="text-sm text-gray-600 mt-1">Tüm kurslarınızı buradan yönetin</p>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Kurslar Yönetimi</h3>
                <p className="text-gray-600 mb-6">Mevcut kurs yönetimi sistemini buraya taşıyacağız</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    🚀 Kurs Yönetimine Git
                  </button>
                  <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    📊 Kurs İstatistikleri
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Design Mode 4: Kategori Yönetimi */}
        {salesDesignMode === 'categories' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-lg font-medium text-gray-900">🏷️ 4. Kategori Yönetimi</h3>
              <p className="text-sm text-gray-600 mt-1">Kurs kategorilerini buradan yönetin</p>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏷️</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Kategori Yönetimi</h3>
                <p className="text-gray-600 mb-6">Mevcut kategori yönetimi sistemini buraya taşıyacağız</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setActiveTab('categories')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    🚀 Kategori Yönetimine Git
                  </button>
                  <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    📈 Kategori Analizi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add New Sales Page Button */}
        <div className="text-center">
          <button
            onClick={() => {
              setEditingSalesPage(null);
              resetSalesPageForm();
              setShowSalesPageModal(true);
            }}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
          >
            <Plus className="h-5 w-5" />
            🚀 Yeni Satış Sayfası Oluştur
          </button>
        </div>
      </div>
    );
  };

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fiyat Yönetimi</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course Pricing */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Kurs Fiyatları</h4>
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id || course._id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{course.title}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={course.price}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        const newPrice = parseInt(input.value);
                        if (newPrice && newPrice > 0 && course.id) {
                          courseAPI.update(course.id, { price: newPrice })
                            .then(() => {
                              showNotification(`${course.title} fiyatı güncellendi: ₺${newPrice}`, 'success');
                              loadData();
                            })
                            .catch(() => showNotification('Fiyat güncellenirken hata oluştu', 'error'));
                        } else {
                          showNotification('Geçerli bir fiyat giriniz', 'error');
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Kaydet"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Price Update */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Toplu Fiyat Güncelleme</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Tüm Kategoriler</option>
                  <option>Web Geliştirme</option>
                  <option>Veri Bilimi</option>
                  <option>Tasarım</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yeni Fiyat
                </label>
                <input
                  type="number"
                  placeholder="₺"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => {
                  const categorySelect = document.querySelector('select') as HTMLSelectElement;
                  const priceInput = document.querySelector('input[type="number"]') as HTMLInputElement;
                  const category = categorySelect?.value;
                  const newPrice = parseInt(priceInput?.value || '0');

                  if (newPrice && newPrice > 0) {
                    courses.forEach(course => {
                      if (category === 'Tüm Kategoriler' || course.category === category) {
                        if (course.id) {
                          courseAPI.update(course.id, { price: newPrice })
                            .then(() => {
                              showNotification(`${category === 'Tüm Kategoriler' ? 'Tüm' : category} kategorisindeki kursların fiyatları güncellendi`, 'success');
                              loadData();
                              priceInput.value = '';
                            })
                            .catch(() => showNotification('Fiyat güncellenirken hata oluştu', 'error'));
                        }
                      }
                    });
                  } else {
                    showNotification('Geçerli bir fiyat giriniz', 'error');
                  }
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Toplu Güncelle
              </button>
            </div>
          </div>

          {/* Discount Management */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">İndirim Yönetimi</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İndirim Oranı (%)
                </label>
                <input
                  type="number"
                  placeholder="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Geçerlilik Süresi
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => {
                  const discountInput = document.querySelector('input[placeholder="20"]') as HTMLInputElement;
                  const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
                  const discount = parseInt(discountInput?.value || '0');
                  const expiryDate = dateInput?.value;

                  if (discount && discount > 0 && discount <= 100 && expiryDate) {
                    showNotification(`${discount}% indirim oluşturuldu. Geçerlilik: ${expiryDate}`, 'success');
                    discountInput.value = '';
                    dateInput.value = '';
                  } else {
                    showNotification('Geçerli indirim oranı ve tarih giriniz', 'error');
                  }
                }}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                İndirim Oluştur
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Sistem Ayarları</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Genel Ayarlar</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Adı
                </label>
                <input
                  type="text"
                  defaultValue={settings?.siteName as string || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  placeholder="Site adı"
                  aria-label="Site adı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Açıklaması
                </label>
                <textarea
                  rows={3}
                  defaultValue={settings?.siteDescription as string || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  placeholder="Site açıklaması"
                  aria-label="Site açıklaması"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İletişim E-posta
                </label>
                <input
                  type="email"
                  defaultValue={settings?.contactEmail as string || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                  placeholder="İletişim e-posta"
                  aria-label="İletişim e-posta"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Güvenlik Ayarları</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    İki Faktörlü Doğrulama
                  </label>
                  <p className="text-sm text-gray-500">
                    Kullanıcılar için 2FA zorunluluğu
                  </p>
                </div>
                <button
                  onClick={() => handleToggleSetting('twoFactorAuth')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${settings?.twoFactorAuth as boolean ? 'bg-blue-600' : 'bg-gray-200'}`}
                  title="İki adımlı doğrulama"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Otomatik Oturum Kapatma
                  </label>
                  <p className="text-sm text-gray-500">
                    Belirli süre sonra oturumu kapat
                  </p>
                </div>
                <button
                  onClick={() => handleToggleSetting('autoLogout')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${settings?.autoLogout as boolean ? 'bg-blue-600' : 'bg-gray-200'}`}
                  title="Otomatik çıkış"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-5" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Şifre Karmaşıklığı
                  </label>
                  <p className="text-sm text-gray-500">
                    Güçlü şifre zorunluluğu
                  </p>
                </div>
                <button
                  onClick={() => handleToggleSetting('passwordComplexity')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${settings?.passwordComplexity as boolean ? 'bg-blue-600' : 'bg-gray-200'}`}
                  title="Şifre karmaşıklığı"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Ayarları Kaydet
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'categories':
        return renderCategories();
      case 'courses':
        return renderCourses();
      case 'sales-pages':
        return renderSalesPages();
      case 'certificates':
        return renderCertificates();
      case 'pricing':
        return renderPricing();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">
            ABC Akademi Yönetimi
          </p>
        </div>

        <nav className="p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h2>
                <p className="text-gray-600 mt-2">
                  {activeTab === 'overview' ? 'Sistem genelinde genel bakış' : ''}
                  {activeTab === 'users' ? 'Kullanıcı yönetimi ve kontrol' : ''}
                  {activeTab === 'categories' ? 'Kategori yönetimi' : ''}
                  {activeTab === 'courses' ? 'Kurs yönetimi ve düzenleme' : ''}
                  {activeTab === 'certificates' ? 'Sertifika yönetimi' : ''}
                  {activeTab === 'pricing' ? 'Fiyat ve indirim yönetimi' : ''}
                  {activeTab === 'settings' ? 'Sistem ayarları ve konfigürasyon' : ''}
                </p>
              </div>
              {actionLoading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">İşlem yapılıyor...</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {renderContent()}

          {/* Kullanıcı Modal Formu */}
          <Modal show={showUserModal} onClose={() => { setShowUserModal(false); setEditingUser(null); resetForms(); }} title={editingUser ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}>
            <form onSubmit={e => { e.preventDefault(); void (editingUser ? handleUpdateUser() : handleAddUser()); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">İsim Soyisim *</label>
                  <input type="text" className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={userForm.name} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-posta *</label>
                  <input type="email" className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Şifre *</label>
                  <input type="password" className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={userForm.password} onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <input type="tel" className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={userForm.phone} onChange={e => setUserForm(f => ({ ...f, phone: e.target.value }))} placeholder="0555 123 45 67" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Adres</label>
                <textarea rows={3} className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={userForm.address} onChange={e => setUserForm(f => ({ ...f, address: e.target.value }))} placeholder="Tam adres bilgisi..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rol</label>
                  <select className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="student">Öğrenci</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durum</label>
                  <select className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={userForm.status} onChange={e => setUserForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Atanacak Kurslar</label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                  {courses.map(course => (
                    <label key={course._id || course.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userForm.assignedCourses.includes(course._id || course.id)}
                        onChange={e => {
                          const courseId = course._id || course.id;
                          if (e.target.checked && courseId) {
                            setUserForm(f => ({ ...f, assignedCourses: [...f.assignedCourses, courseId] }));
                          } else if (courseId) {
                            setUserForm(f => ({ ...f, assignedCourses: f.assignedCourses.filter(id => id !== courseId) }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{course.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => { setShowUserModal(false); setEditingUser(null); resetForms(); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
                  İptal
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  {editingUser ? 'Güncelle' : 'Kullanıcı Ekle'}
                </button>
              </div>
            </form>
          </Modal>

          {/* Kategori Modal Formu */}
          <Modal show={showCategoryModal} onClose={() => { setShowCategoryModal(false); setEditingCategory(null); resetForms(); }} title={editingCategory ? 'Kategoriyı Düzenle' : 'Yeni Kategori Ekle'}>
            <form onSubmit={e => { e.preventDefault(); void (editingCategory ? handleUpdateCategory() : handleAddCategory()); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori Adı</label>
                <input type="text" className="w-full border rounded px-3 py-2 mt-1" value={categoryForm.name} onChange={e => setCategoryForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea rows={4} className="w-full border rounded px-3 py-2 mt-1" value={categoryForm.description} onChange={e => setCategoryForm(f => ({ ...f, description: e.target.value }))} placeholder="Kategori hakkında detaylı açıklama..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Görsel (URL)</label>
                <input type="text" className="w-full border rounded px-3 py-2 mt-1" value={categoryForm.image || ''} onChange={e => setCategoryForm(f => ({ ...f, image: e.target.value }))} placeholder="/api/placeholder/400/201 veya https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Renk (HEX)</label>
                <input type="color" className="w-12 h-8 border rounded mt-1" value={categoryForm.color || '#2563eb'} onChange={e => setCategoryForm(f => ({ ...f, color: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Durum</label>
                <select className="w-full border rounded px-3 py-2 mt-1" value={categoryForm.status} onChange={e => setCategoryForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => { setShowCategoryModal(false); setEditingCategory(null); resetForms(); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">İptal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingCategory ? 'Kaydet' : 'Ekle'}</button>
              </div>
            </form>
          </Modal>

          {/* Kurs Modal Formu */}
          <Modal show={showCourseModal} onClose={() => { setShowCourseModal(false); setEditingCourse(null); resetForms(); }} title={editingCourse ? 'Kursu Düzenle' : 'Yeni Kurs Ekle'}>
            <form onSubmit={e => { e.preventDefault(); void (editingCourse ? handleUpdateCourse() : handleAddCourse()); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kurs Adı *</label>
                <input type="text" className="w-full border rounded px-3 py-2 mt-1" value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori *</label>
                <select className="w-full border rounded px-3 py-2 mt-1" value={courseForm.category} onChange={e => setCourseForm(f => ({ ...f, category: e.target.value }))} required>
                  {categories.filter(cat => cat.status === 'active').map(category => (
                    <option key={category._id || category.id || category.name} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fiyat (₺) *</label>
                  <input type="number" className="w-full border rounded px-3 py-2 mt-1" value={courseForm.price} onChange={e => setCourseForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Süre *</label>
                  <input type="text" className="w-full border rounded px-3 py-2 mt-1" value={courseForm.duration} onChange={e => setCourseForm(f => ({ ...f, duration: e.target.value }))} placeholder="8 Hafta" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seviye *</label>
                  <select className="w-full border rounded px-3 py-2 mt-1" value={courseForm.level} onChange={e => setCourseForm(f => ({ ...f, level: e.target.value }))} required>
                    <option value="Başlangıç">Başlangıç</option>
                    <option value="Orta">Orta</option>
                    <option value="İleri">İleri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Eğitmen *</label>
                  <input type="text" className="w-full border rounded px-3 py-2 mt-1" value={courseForm.instructor} onChange={e => setCourseForm(f => ({ ...f, instructor: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama *</label>
                <textarea rows={3} className="w-full border rounded px-3 py-2 mt-1" value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Durum</label>
                <select className="w-full border rounded px-3 py-2 mt-1" value={courseForm.status} onChange={e => setCourseForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="active">Aktif</option>
                  <option value="draft">Taslak</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => { setShowCourseModal(false); setEditingCourse(null); resetForms(); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">İptal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingCourse ? 'Kaydet' : 'Ekle'}</button>
              </div>
            </form>
          </Modal>

          {/* Sertifika Modal Formu */}
          <Modal show={showCertificateModal} onClose={() => { setShowCertificateModal(false); setEditingCertificate(null); resetForms(); }} title={editingCertificate ? 'Sertifikayı Düzenle' : 'Yeni Sertifika Ver'}>
            <form onSubmit={e => { e.preventDefault(); void (editingCertificate ? handleUpdateCertificate() : handleAddCertificate()); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Öğrenci Seç *</label>
                <select 
                  className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={certificateForm.studentName} 
                  onChange={e => {
                    const selectedUser = filteredUsers.find(user => user.name === e.target.value);
                    setCertificateForm(f => ({ 
                      ...f, 
                      studentName: e.target.value,
                      studentEmail: selectedUser?.email || ''
                    }));
                  }} 
                  required
                >
                  <option value="">-- Öğrenci Seçin --</option>
                  {filteredUsers.filter(user => user.role === 'student').map(user => (
                    <option key={user._id || user.id} value={user.name}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kurs Seç *</label>
                <select 
                  className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={certificateForm.courseName} 
                  onChange={e => setCertificateForm(f => ({ ...f, courseName: e.target.value }))} 
                  required
                >
                  <option value="">-- Kurs Seçin --</option>
                  {filteredCourses.filter(course => course.status === 'active').map(course => (
                    <option key={course.id || course._id} value={course.title}>
                      {course.title} - {course.category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sertifika Tarihi</label>
                <input 
                  type="date" 
                  className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={certificateForm.issueDate || new Date().toISOString().split('T')[0]} 
                  onChange={e => setCertificateForm(f => ({ ...f, issueDate: e.target.value }))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Durum</label>
                <select className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={certificateForm.status} onChange={e => setCertificateForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="issued">✅ Verildi</option>
                  <option value="pending">⏳ Beklemede</option>
                  <option value="cancelled">❌ İptal Edildi</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => { setShowCertificateModal(false); setEditingCertificate(null); resetForms(); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">İptal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingCertificate ? 'Kaydet' : 'Ekle'}</button>
              </div>
            </form>
          </Modal>

          {/* Satış Sayfası Modal Formu */}
          <Modal show={showSalesPageModal} onClose={() => { setShowSalesPageModal(false); setEditingSalesPage(null); resetSalesPageForm(); }} title={editingSalesPage ? 'Satış Sayfasını Düzenle' : 'Yeni Satış Sayfası Oluştur'}>
            <form onSubmit={e => { e.preventDefault(); void (editingSalesPage ? handleUpdateSalesPage() : handleAddSalesPage()); }} className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Temel Bilgiler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Sayfa Başlığı *</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 mt-1"
                    value={salesPageForm.title}
                    onChange={e => setSalesPageForm(f => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Alt Başlık</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 mt-1"
                    value={salesPageForm.subtitle}
                    onChange={e => setSalesPageForm(f => ({ ...f, subtitle: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Orijinal Fiyat (₺) *</label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2 mt-1"
                    value={salesPageForm.originalPrice}
                    onChange={e => setSalesPageForm(f => ({ ...f, originalPrice: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">İndirimli Fiyat (₺) *</label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2 mt-1"
                    value={salesPageForm.discountedPrice}
                    onChange={e => setSalesPageForm(f => ({ ...f, discountedPrice: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Açıklamalar */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Kısa Açıklama *</label>
                <textarea
                  rows={3}
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={salesPageForm.description}
                  onChange={e => setSalesPageForm(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Detaylı Açıklama</label>
                <textarea
                  rows={4}
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={salesPageForm.longDescription}
                  onChange={e => setSalesPageForm(f => ({ ...f, longDescription: e.target.value }))}
                  placeholder="Kurs hakkında detaylı bilgi..."
                />
              </div>

              {/* Özellikler */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kurs Özellikleri</label>
                {salesPageForm.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 border rounded px-3 py-2"
                      value={feature}
                      onChange={e => updateFeature(index, e.target.value)}
                      placeholder="✓ Özellik açıklaması..."
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-800"
                      disabled={salesPageForm.features.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Özellik Ekle
                </button>
              </div>

              {/* Başlangıç Bilgisi */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Ne Zaman Başlayabilirim?</label>
                <textarea
                  rows={2}
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={salesPageForm.startInfo}
                  onChange={e => setSalesPageForm(f => ({ ...f, startInfo: e.target.value }))}
                  placeholder="Başlangıç bilgisi..."
                />
              </div>

              {/* İletişim Bilgisi */}
              <div>
                <label className="block text-sm font-medium text-gray-700">İletişim Bilgisi</label>
                <textarea
                  rows={3}
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={salesPageForm.contactInfo}
                  onChange={e => setSalesPageForm(f => ({ ...f, contactInfo: e.target.value }))}
                  placeholder="İletişim bilgileri..."
                />
              </div>

              {/* Ek Bilgi */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Ek Bilgi</label>
                <textarea
                  rows={4}
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={salesPageForm.additionalInfo}
                  onChange={e => setSalesPageForm(f => ({ ...f, additionalInfo: e.target.value }))}
                  placeholder="Ek bilgiler, şartlar ve koşullar..."
                />
              </div>

              {/* Durum */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Durum</label>
                <select
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={salesPageForm.status}
                  onChange={e => setSalesPageForm(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="active">Aktif</option>
                  <option value="draft">Taslak</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setShowSalesPageModal(false); setEditingSalesPage(null); resetSalesPageForm(); }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingSalesPage ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </Modal>

          {/* Slide-Over Panel */}
          {showSlideOver && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSlideOver(false)} />
              <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Kurs Düzenle</h2>
                      <button
                        onClick={() => setShowSlideOver(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    {slideOverCourse && (
                      <p className="text-sm text-gray-600 mt-1">{slideOverCourse.title}</p>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                      {/* Kurs Resmi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kurs Resmi
                        </label>
                        <div className="flex items-center space-x-4">
                          {courseForm.image && (
                            <Image
                              src={courseForm.image}
                              alt="Kurs resmi"
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                          )}
                          <div className="flex-1">
                            <input
                              type="url"
                              placeholder="Resim URL'si girin"
                              value={courseForm.image}
                              onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Resim URL&apos;si girin veya dosya yükleyin
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Temel Bilgiler */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kurs Adı *
                          </label>
                          <input
                            type="text"
                            value={courseForm.title}
                            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kategori *
                          </label>
                          <select
                            value={courseForm.category}
                            onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="Web Geliştirme">Web Geliştirme</option>
                            <option value="Veri Bilimi">Veri Bilimi</option>
                            <option value="Tasarım">Tasarım</option>
                            <option value="Mobil Geliştirme">Mobil Geliştirme</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fiyat (₺) *
                          </label>
                          <input
                            type="number"
                            value={courseForm.price}
                            onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Süre *
                          </label>
                          <input
                            type="text"
                            value={courseForm.duration}
                            onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="örn: 8 hafta"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Seviye *
                          </label>
                          <select
                            value={courseForm.level}
                            onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="Başlangıç">Başlangıç</option>
                            <option value="Orta">Orta</option>
                            <option value="İleri">İleri</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Eğitmen *
                          </label>
                          <input
                            type="text"
                            value={courseForm.instructor}
                            onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      {/* Açıklama */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kısa Açıklama *
                        </label>
                        <textarea
                          value={courseForm.description}
                          onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      {/* Detaylı Açıklama */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Detaylı Açıklama
                        </label>
                        <textarea
                          value={courseForm.courseAbout}
                          onChange={(e) => setCourseForm({ ...courseForm, courseAbout: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Kurs hakkında detaylı bilgi..."
                        />
                      </div>

                      {/* Durum */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Durum
                        </label>
                        <select
                          value={courseForm.status}
                          onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="active">Aktif</option>
                          <option value="draft">Taslak</option>
                          <option value="cancelled">İptal</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowSlideOver(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        İptal
                      </button>
                      <button
                        onClick={handleSlideOverSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bildirim (toast) gösterimi */}
          <Toast show={notification.show} message={notification.message} type={notification.type} />
        </div>
      </div>
    </div>
  );
}
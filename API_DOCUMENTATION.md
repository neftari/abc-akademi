# 📚 ABC Akademi API Dokümantasyonu

## 🔐 **Güvenlik ve Rate Limiting**

### Rate Limit Kuralları
- **Genel API**: 15 dakikada 100 istek
- **Authentication**: 15 dakikada 5 istek  
- **Admin İşlemleri**: 5 dakikada 50 istek
- **Upload İşlemleri**: 1 saatte 10 istek

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
Retry-After: 900
```

### Rate Limit Aşıldığında
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Try again in 900 seconds.",
  "retryAfter": 900
}
```

---

## 📖 **COURSES API**

### **GET /api/courses**
Tüm aktif kursları listeler (soft delete edilmemiş)

**Rate Limit**: Genel (100/15dk)

**Response:**
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Web Geliştirme Temelleri",
    "description": "HTML, CSS ve JavaScript ile web geliştirme",
    "content": "Kurs içeriği...",
    "category": "Web Geliştirme",
    "price": 499,
    "duration": "20 saat",
    "level": "Başlangıç",
    "instructor": "Ahmet Yılmaz",
    "status": "active",
    "students": 1250,
    "rating": 4.8,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### **POST /api/courses**
Yeni kurs oluşturur

**Rate Limit**: Admin (50/5dk)

**Request Body:**
```json
{
  "title": "React.js Temelleri",
  "description": "Modern React geliştirme",
  "content": "Detaylı kurs içeriği...",
  "category": "Frontend",
  "price": 799,
  "duration": "30 saat",
  "level": "Orta",
  "instructor": "Zeynep Kaya",
  "status": "active"
}
```

**Validation Kuralları:**
- `title`: Zorunlu, string
- `description`: Zorunlu, string
- `content`: Zorunlu, string
- `price`: Zorunlu, number, >= 0
- `duration`: Zorunlu, string
- `category`: Zorunlu, string
- `instructor`: Zorunlu, string
- `level`: "Başlangıç" | "Orta" | "İleri"

**Success Response (201):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
  "title": "React.js Temelleri",
  "description": "Modern React geliştirme",
  "price": 799,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "error": "Tüm zorunlu alanlar doldurulmalıdır"
}

// 400 - Price Error
{
  "error": "Geçerli bir fiyat giriniz"
}
```

---

### **GET /api/courses/{id}**
Belirli bir kursu getirir

**Rate Limit**: Genel (100/15dk)

**Parameters:**
- `id`: MongoDB ObjectId

**Success Response (200):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "title": "Web Geliştirme Temelleri",
  "description": "HTML, CSS ve JavaScript ile web geliştirme",
  "content": "Detaylı kurs içeriği...",
  "category": "Web Geliştirme",
  "price": 499,
  "duration": "20 saat",
  "level": "Başlangıç",
  "instructor": "Ahmet Yılmaz",
  "status": "active",
  "courseAbout": "Kurs hakkında detaylı bilgi",
  "whatYouWillLearn": [
    "HTML5 yapısını ve semantik etiketleri",
    "CSS3 ile stil ve düzen oluşturmayı"
  ],
  "requirements": [
    "Temel bilgisayar kullanımı",
    "Metin editörü (VS Code önerilir)"
  ],
  "includes": [
    "Ömür boyu erişim",
    "Proje dosyaları",
    "Sertifika"
  ],
  "students": 1250,
  "rating": 4.8,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Kurs bulunamadı"
}
```

---

### **PUT /api/courses/{id}**
Kursu günceller

**Rate Limit**: Admin (50/5dk)

**Parameters:**
- `id`: MongoDB ObjectId

**Request Body:** (Güncellenecek alanlar)
```json
{
  "title": "Güncellenmiş Başlık",
  "price": 599,
  "status": "draft"
}
```

**Success Response (200):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "title": "Güncellenmiş Başlık",
  "price": 599,
  "status": "draft",
  "updatedAt": "2024-01-15T11:30:00.000Z"
}
```

---

### **DELETE /api/courses/{id}** (Soft Delete)
Kursu soft delete yapar (gerçekten silmez, işaretler)

**Rate Limit**: Admin (50/5dk)

**Parameters:**
- `id`: MongoDB ObjectId

**Headers:**
- `user-id`: Silme işlemini yapan kullanıcı ID'si (opsiyonel)

**Success Response (200):**
```json
{
  "message": "Kurs başarıyla silindi",
  "deletedAt": "2024-01-15T12:00:00.000Z",
  "canRestore": true
}
```

**Error Response (404):**
```json
{
  "error": "Kurs bulunamadı"
}
```

---

### **POST /api/courses/{id}/restore**
Soft delete edilmiş kursu geri yükler

**Rate Limit**: Admin (50/5dk)

**Parameters:**
- `id`: MongoDB ObjectId

**Success Response (200):**
```json
{
  "message": "Kurs başarıyla geri yüklendi",
  "course": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Web Geliştirme Temelleri",
    "restoredAt": "2024-01-15T12:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Silinmiş kurs bulunamadı veya zaten aktif"
}
```

---

### **GET /api/courses/deleted**
Soft delete edilmiş kursları listeler (Admin only)

**Rate Limit**: Admin (50/5dk)

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Silinmiş Kurs",
      "description": "Bu kurs silindi",
      "deletedAt": "2024-01-15T12:00:00.000Z",
      "deletedBy": "admin_user_id",
      "createdAt": "2024-01-10T10:30:00.000Z"
    }
  ]
}
```

---

## 👥 **USERS API**

### **GET /api/users**
Tüm aktif kullanıcıları listeler

**Rate Limit**: Admin (50/5dk)

**Response:**
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Ahmet Yılmaz",
    "email": "ahmet@example.com",
    "role": "student",
    "status": "active",
    "phone": "+90 555 123 4567",
    "address": "İstanbul, Türkiye",
    "joinDate": "2024-01-15",
    "assignedCourses": ["64f8a1b2c3d4e5f6a7b8c9d1"],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### **POST /api/users**
Yeni kullanıcı oluşturur

**Rate Limit**: Admin (50/5dk)

**Request Body:**
```json
{
  "name": "Mehmet Demir",
  "email": "mehmet@example.com",
  "password": "securePassword123",
  "role": "student",
  "phone": "+90 555 987 6543",
  "address": "Ankara, Türkiye",
  "status": "active"
}
```

**Validation Kuralları:**
- `name`: Zorunlu, string
- `email`: Zorunlu, geçerli email formatı, unique
- `password`: Zorunlu, minimum 6 karakter
- `role`: "student" | "admin" | "teacher"
- `status`: "active" | "inactive"

**Success Response (201):**
```json
{
  "message": "Kullanıcı başarıyla oluşturuldu",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "name": "Mehmet Demir",
    "email": "mehmet@example.com",
    "role": "student",
    "status": "active",
    "joinDate": "2024-01-15",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "error": "İsim, e-posta ve şifre zorunludur"
}

// 400 - Email Format Error
{
  "error": "Geçerli bir e-posta adresi giriniz"
}

// 400 - Password Length Error
{
  "error": "Şifre en az 6 karakter olmalıdır"
}

// 400 - Duplicate Email
{
  "error": "Bu e-posta adresi zaten kullanılıyor"
}
```

---

## 📂 **CATEGORIES API**

### **GET /api/categories**
Tüm aktif kategorileri listeler

**Rate Limit**: Genel (100/15dk)

**Response:**
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Web Geliştirme",
    "description": "Modern web teknolojileri",
    "image": "/images/web-dev.jpg",
    "color": "#2563eb",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### **POST /api/categories**
Yeni kategori oluşturur

**Rate Limit**: Admin (50/5dk)

**Request Body:**
```json
{
  "name": "Mobil Geliştirme",
  "description": "iOS ve Android uygulama geliştirme",
  "image": "/images/mobile-dev.jpg",
  "color": "#10b981",
  "status": "active"
}
```

**Validation Kuralları:**
- `name`: Zorunlu, string, unique
- `description`: Zorunlu, string
- `image`: Zorunlu, string (URL)
- `color`: HEX renk kodu (#RRGGBB)
- `status`: "active" | "inactive"

---

## 🏆 **CERTIFICATES API**

### **GET /api/certificates**
Tüm sertifikaları listeler

**Rate Limit**: Admin (50/5dk)

**Response:**
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "student": "64f8a1b2c3d4e5f6a7b8c9d1",
    "course": "64f8a1b2c3d4e5f6a7b8c9d2",
    "certificateNumber": "CERT-1640995200-123",
    "studentName": "Ahmet Yılmaz",
    "studentEmail": "ahmet@example.com",
    "courseName": "Web Geliştirme Temelleri",
    "courseId": "64f8a1b2c3d4e5f6a7b8c9d2",
    "status": "issued",
    "issueDate": "2024-01-15T10:30:00.000Z",
    "isActive": true
  }
]
```

---

### **POST /api/certificates**
Yeni sertifika oluşturur

**Rate Limit**: Admin (50/5dk)

**Request Body:**
```json
{
  "studentName": "Ahmet Yılmaz",
  "studentEmail": "ahmet@example.com",
  "courseName": "Web Geliştirme Temelleri",
  "courseId": "64f8a1b2c3d4e5f6a7b8c9d2",
  "status": "issued"
}
```

---

## ⚙️ **SETTINGS API**

### **GET /api/settings**
Sistem ayarlarını getirir

**Rate Limit**: Genel (100/15dk)

**Response:**
```json
{
  "siteName": "ABC Akademi",
  "siteDescription": "Modern eğitim platformu",
  "contactEmail": "info@abcakademi.com",
  "twoFactorAuth": false,
  "autoLogout": true,
  "passwordComplexity": true,
  "autoLogoutTime": 30
}
```

---

### **POST /api/settings**
Sistem ayarlarını günceller

**Rate Limit**: Admin (50/5dk)

**Request Body:**
```json
{
  "siteName": "ABC Akademi Pro",
  "twoFactorAuth": true,
  "autoLogoutTime": 60
}
```

---

## 🔐 **AUTHENTICATION API**

### **POST /api/register**
Yeni kullanıcı kaydı

**Rate Limit**: Auth (5/15dk)

**Request Body:**
```json
{
  "name": "Yeni Kullanıcı",
  "email": "yeni@example.com",
  "password": "securePassword123",
  "role": "student"
}
```

**Success Response (201):**
```json
{
  "message": "Kullanıcı başarıyla oluşturuldu",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "name": "Yeni Kullanıcı",
    "email": "yeni@example.com",
    "role": "student",
    "status": "active"
  }
}
```

---

## 🚨 **Error Responses**

### **Rate Limit Exceeded (429)**
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Try again in 900 seconds.",
  "retryAfter": 900
}
```

### **Validation Error (400)**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Geçerli bir e-posta adresi giriniz"
    }
  ]
}
```

### **Not Found (404)**
```json
{
  "error": "Kaynak bulunamadı"
}
```

### **Internal Server Error (500)**
```json
{
  "error": "Sunucu hatası oluştu"
}
```

---

## 📊 **Soft Delete Sistemi**

### Soft Delete Özellikleri:
- Veriler gerçekten silinmez, `isDeleted: true` işaretlenir
- `deletedAt` ve `deletedBy` alanları eklenir
- Normal sorgularda silinmiş veriler görünmez
- Admin panelinde silinmiş veriler görülebilir
- Restore (geri yükleme) mümkündür

### Soft Delete Alanları:
```json
{
  "isDeleted": false,
  "deletedAt": null,
  "deletedBy": null
}
```

### Silinmiş Veri Örneği:
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "title": "Silinmiş Kurs",
  "isDeleted": true,
  "deletedAt": "2024-01-15T12:00:00.000Z",
  "deletedBy": "admin_user_id"
}
```

---

## 🔧 **Geliştirici Notları**

### Rate Limiter Kullanımı:
```typescript
import { withRateLimit, rateLimiters } from '@/lib/rate-limiter';

// Endpoint'i rate limit ile sar
export const GET = withRateLimit(rateLimiters.general)(myHandler);
export const POST = withRateLimit(rateLimiters.admin)(myHandler);
```

### Soft Delete Kullanımı:
```typescript
// Soft delete
await course.softDelete('user_id');

// Restore
await course.restore();

// Silinmiş kayıtları getir
const deleted = await Course.find({ isDeleted: true });
```

### Model Güncellemeleri:
Tüm modellere şu alanlar eklendi:
- `isDeleted: Boolean`
- `deletedAt: Date`
- `deletedBy: String`
- `softDelete()` method
- `restore()` method
- Pre-find middleware (silinmiş kayıtları filtreler)

---

## 📈 **Performans İpuçları**

1. **Rate Limiting**: Otomatik olarak uygulanır
2. **Soft Delete**: Veri kaybını önler
3. **Validation**: Tüm input'lar kontrol edilir
4. **Error Handling**: Standart error formatları
5. **Logging**: Tüm hatalar loglanır

---

## 🔄 **Changelog**

### v2.2.2 (Mevcut)
- ✅ Rate limiting eklendi
- ✅ Soft delete sistemi eklendi
- ✅ Restore endpoint'leri eklendi
- ✅ Deleted items endpoint'leri eklendi
- ✅ Gelişmiş error handling
- ✅ API dokümantasyonu hazırlandı
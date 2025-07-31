# ABC Akademi - API Listesi ve Admin Panel İşlemleri

## 📋 TÜM API ENDPOINT'LERİ

### 🎓 KURS YÖNETİMİ API'LERİ

#### 1. `/api/courses` - Ana Kurs Listesi
- **Method**: GET, POST
- **Amaç**: Mağaza için kurs listesi ve yeni kurs ekleme
- **Admin İşlemleri**:
  - ✅ **Listeleme**: Tüm kursları görüntüle
  - ✅ **Ekleme**: Yeni kurs oluştur
  - ✅ **Filtreleme**: Kategori, arama, durum
  - ✅ **Pagination**: Sayfalama
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

#### 2. `/api/courses/[id]` - Tekil Kurs İşlemleri
- **Method**: GET, PUT, DELETE
- **Amaç**: Belirli bir kursun detayları ve düzenleme
- **Admin İşlemleri**:
  - ✅ **Görüntüleme**: Kurs detaylarını getir
  - ✅ **Düzenleme**: Kurs bilgilerini güncelle
  - ✅ **Silme**: Kursu soft delete yap
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

#### 3. `/api/courses/deleted` - Silinmiş Kurslar
- **Method**: GET
- **Amaç**: Soft delete ile silinmiş kursları listele
- **Admin İşlemleri**:
  - ✅ **Listeleme**: Silinmiş kursları görüntüle
  - ✅ **Geri Yükleme**: Restore işlemi için liste
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

#### 4. `/api/courses/[id]/restore` - Kurs Geri Yükleme
- **Method**: POST
- **Amaç**: Silinmiş kursu geri yükle
- **Admin İşlemleri**:
  - ✅ **Geri Yükleme**: Soft delete'i iptal et
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

---

### 📂 KATEGORİ YÖNETİMİ API'LERİ

#### 5. `/api/categories` - Kategori Listesi
- **Method**: GET, POST
- **Amaç**: Kurs kategorilerini yönet
- **Admin İşlemleri**:
  - ✅ **Listeleme**: Tüm kategorileri görüntüle
  - ✅ **Ekleme**: Yeni kategori oluştur
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

#### 6. `/api/categories/[id]` - Tekil Kategori
- **Method**: GET, PUT, DELETE
- **Amaç**: Belirli kategori işlemleri
- **Admin İşlemleri**:
  - ✅ **Görüntüleme**: Kategori detayları
  - ✅ **Düzenleme**: Kategori güncelle
  - ✅ **Silme**: Kategori sil
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

---

### 👤 KULLANICI YÖNETİMİ API'LERİ

#### 7. `/api/users` - Kullanıcı Listesi
- **Method**: GET, POST
- **Amaç**: Kullanıcı yönetimi
- **Admin İşlemleri**:
  - ✅ **Listeleme**: Tüm kullanıcıları görüntüle
  - ✅ **Ekleme**: Yeni kullanıcı oluştur
  - ✅ **Rol Yönetimi**: Admin, öğrenci, eğitmen
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

#### 8. `/api/users/[id]` - Tekil Kullanıcı
- **Method**: GET, PUT, DELETE
- **Amaç**: Belirli kullanıcı işlemleri
- **Admin İşlemleri**:
  - ✅ **Görüntüleme**: Kullanıcı profili
  - ✅ **Düzenleme**: Kullanıcı bilgileri güncelle
  - ✅ **Silme**: Kullanıcı hesabı sil
  - ✅ **Rol Değiştirme**: Yetki seviyesi ayarla
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

#### 9. `/api/register` - Kullanıcı Kaydı
- **Method**: POST
- **Amaç**: Yeni kullanıcı kaydı
- **Admin İşlemleri**:
  - ✅ **Manuel Kayıt**: Admin tarafından kullanıcı ekleme
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

---

### 🔐 KİMLİK DOĞRULAMA API'LERİ

#### 10. `/api/auth/[...nextauth]` - NextAuth
- **Method**: GET, POST
- **Amaç**: Giriş/çıkış işlemleri
- **Admin İşlemleri**:
  - ✅ **Giriş Kontrolü**: Admin paneli erişimi
  - ✅ **Oturum Yönetimi**: Session kontrolü
- **Veri Kaynağı**: 🗄️ **MongoDB** + NextAuth
- **Değişiklik Etkisi**: Kod değişikliği → 🚀 **Vercel Deploy** gerekli

---

### 🏆 SERTİFİKA YÖNETİMİ API'LERİ

#### 11. `/api/certificates` - Sertifika Listesi
- **Method**: GET, POST
- **Amaç**: Sertifika yönetimi
- **Admin İşlemleri**:
  - ✅ **Listeleme**: Tüm sertifikaları görüntüle
  - ✅ **Oluşturma**: Yeni sertifika şablonu
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

#### 12. `/api/certificates/[id]` - Tekil Sertifika
- **Method**: GET, PUT, DELETE
- **Amaç**: Belirli sertifika işlemleri
- **Admin İşlemleri**:
  - ✅ **Görüntüleme**: Sertifika detayları
  - ✅ **Düzenleme**: Sertifika şablonu güncelle
  - ✅ **Silme**: Sertifika sil
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

---

### ⚙️ SİSTEM YÖNETİMİ API'LERİ

#### 13. `/api/settings` - Sistem Ayarları
- **Method**: GET, POST, PUT
- **Amaç**: Site genel ayarları
- **Admin İşlemleri**:
  - ✅ **Görüntüleme**: Mevcut ayarları getir
  - ✅ **Güncelleme**: Site ayarlarını değiştir
  - ✅ **Yapılandırma**: Email, güvenlik, genel ayarlar
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

#### 14. `/api/settings/[id]` - Tekil Ayar
- **Method**: GET, PUT, DELETE
- **Amaç**: Belirli ayar işlemleri
- **Admin İşlemleri**:
  - ✅ **Görüntüleme**: Spesifik ayar
  - ✅ **Düzenleme**: Ayar güncelle
- **Veri Kaynağı**: 🗄️ **MongoDB** (Veritabanı)
- **Değişiklik Etkisi**: MongoDB'de değişiklik → API otomatik güncellenir

#### 15. `/api/health` - Sistem Durumu
- **Method**: GET
- **Amaç**: Sistem sağlık kontrolü
- **Admin İşlemleri**:
  - ✅ **Monitoring**: Database bağlantı durumu
  - ✅ **Performance**: API response süreleri
  - ✅ **İstatistik**: Sistem metrikleri
- **Veri Kaynağı**: 🗄️ **MongoDB** + Sistem
- **Değişiklik Etkisi**: Real-time sistem durumu

---

### 🧪 TEST/GELİŞTİRME API'LERİ

#### 16. `/api/test-db` - Database Test
- **Method**: GET
- **Amaç**: Veritabanı bağlantı testi
- **Admin İşlemleri**:
  - ✅ **Test**: MongoDB bağlantısı kontrol
- **Veri Kaynağı**: 🗄️ **MongoDB**
- **Değişiklik Etkisi**: Test amaçlı, değişiklik yok

---

## 🔄 DEĞİŞİKLİK ETKİLERİ

### 🗄️ MongoDB Değişiklikleri (Otomatik Güncelleme)
Bu API'lerde yapılan değişiklikler **anında** etkili olur:
- `/api/courses/*` - Kurs işlemleri
- `/api/categories/*` - Kategori işlemleri  
- `/api/users/*` - Kullanıcı işlemleri
- `/api/certificates/*` - Sertifika işlemleri
- `/api/settings/*` - Ayar işlemleri

### 🚀 Vercel Deploy Gerektiren Değişiklikler
Bu değişiklikler için **kod güncellemesi** ve **deploy** gerekli:
- API endpoint'lerinde kod değişikliği
- Yeni API ekleme/silme
- Authentication logic değişikliği
- Middleware güncellemeleri
- Environment variables değişikliği

---

## 📊 ADMIN PANELİ İŞLEM MATRİSİ

| İşlem Türü | API Endpoint | Veri Kaynağı | Güncelleme Türü |
|------------|--------------|---------------|-----------------|
| **Kurs Ekleme** | `POST /api/courses` | MongoDB | Anında |
| **Kurs Düzenleme** | `PUT /api/courses/[id]` | MongoDB | Anında |
| **Kurs Silme** | `DELETE /api/courses/[id]` | MongoDB | Anında |
| **Kategori Yönetimi** | `/api/categories/*` | MongoDB | Anında |
| **Kullanıcı Yönetimi** | `/api/users/*` | MongoDB | Anında |
| **Sistem Ayarları** | `/api/settings/*` | MongoDB | Anında |
| **Sertifika Yönetimi** | `/api/certificates/*` | MongoDB | Anında |
| **API Kod Değişikliği** | Tüm API'ler | Kod | Deploy Gerekli |
| **Yeni Özellik** | Yeni Endpoint | Kod | Deploy Gerekli |

---

## 🎯 ÖNERİLER

### 📈 Performans İçin:
- **MongoDB**: Veri işlemleri için optimize
- **Vercel**: Statik dosyalar için kullan
- **Cache**: Sık kullanılan veriler için

### 🔒 Güvenlik İçin:
- **Authentication**: Tüm admin API'lerinde kontrol
- **Validation**: Input doğrulama
- **Rate Limiting**: API kötüye kullanım koruması

### 🚀 Geliştirme İçin:
- **Health Check**: Sistem durumu takibi
- **Logging**: Hata takibi
- **Testing**: API testleri
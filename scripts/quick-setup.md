# 🚀 Hızlı MongoDB Kurulum Rehberi

## 1. MongoDB Kurulumu (5 dakika)

### Windows için:
1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) indirin
2. Kurulum sırasında "Install MongoDB as a Service" ✅ işaretleyin
3. MongoDB Compass (GUI) kurulumunu da seçin

### Alternatif: MongoDB Atlas (Cloud - Ücretsiz)
1. [MongoDB Atlas](https://www.mongodb.com/atlas) hesabı oluşturun
2. "Build a Database" → "FREE" seçin
3. Cluster oluşturun ve "Connect" butonuna tıklayın
4. Connection string'i kopyalayın

## 2. Environment Dosyası (.env.local)

Proje ana dizininde `.env.local` dosyası oluşturun:

```env
# Veritabanı Bağlantısı
MONGODB_URI=mongodb://localhost:27017/abc-akademi

# NextAuth.js Ayarları
NEXTAUTH_SECRET=abc-akademi-secret-key-2024
NEXTAUTH_URL=http://localhost:3000

# Güvenlik Anahtarları
JWT_SECRET=abc-akademi-jwt-secret-2024

# Geliştirme Ayarları
NODE_ENV=development
DEBUG=true
```

## 3. Veri Migrasyonu

```bash
# Migrasyon scriptini çalıştır
npm run migrate
```

## 4. Test

```bash
# Uygulamayı başlat
npm run dev
```

Tarayıcıda http://localhost:3000 adresine gidin.

## 5. Veritabanı Kontrolü

MongoDB Compass ile veritabanını görüntüleyin:
- Host: localhost
- Port: 27017
- Database: abc-akademi

## ✅ Başarılı Kurulum Kontrol Listesi

- [ ] MongoDB kurulu ve çalışıyor
- [ ] .env.local dosyası oluşturuldu
- [ ] npm run migrate başarıyla çalıştı
- [ ] npm run dev başarıyla çalışıyor
- [ ] Veriler web sitesinde görünüyor

## 🔧 Sorun Giderme

### MongoDB bağlantı hatası:
```bash
# MongoDB servisini kontrol et
services.msc
# "MongoDB" servisini bul ve "Running" olduğunu kontrol et
```

### Port hatası:
```bash
# 27017 portunu kontrol et
netstat -an | findstr 27017
```

### Veri görünmüyor:
1. MongoDB Compass ile veritabanını kontrol et
2. `npm run migrate` komutunu tekrar çalıştır
3. Console'da hata mesajlarını kontrol et 
# 🔒 Güvenlik Uyarısı

## Ortam Değişkenleri Kurulumu

Bu proje çalışmak için aşağıdaki ortam değişkenlerine ihtiyaç duyar:

### 1. .env Dosyası Oluşturma
```bash
cp .env.example .env
```

### 2. Gerekli Değişkenler

#### MongoDB Bağlantısı
```
MONGODB_URI=mongodb+srv://kullanici:sifre@cluster.mongodb.net/veritabani
```

#### NextAuth Ayarları
```
NEXTAUTH_SECRET=güçlü-gizli-anahtar-buraya
NEXTAUTH_URL=http://localhost:3000
```

#### JWT Secret
```
JWT_SECRET=jwt-için-güçlü-gizli-anahtar
```

### 3. Güvenlik Notları

⚠️ **ÖNEMLİ**: 
- `.env` dosyası asla git'e commit edilmemelidir
- Gerçek şifreler ve API anahtarları `.env.example` dosyasına yazılmamalıdır
- Production ortamında güçlü şifreler kullanın
- Veritabanı şifrelerini düzenli olarak değiştirin

### 4. Vercel Deployment

Vercel'de deployment yaparken environment variables'ları Vercel dashboard'undan ekleyin:

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Tüm gerekli değişkenleri ekleyin
3. Production, Preview ve Development ortamları için ayrı ayrı ayarlayın

## Güvenlik Açığı Bildirimi

Güvenlik açığı tespit ederseniz lütfen info@abcakademi.com adresine bildirin.
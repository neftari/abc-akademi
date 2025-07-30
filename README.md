# ABC Akademi - Eğitim Platformu

ABC Akademi, online kurslar ve eğitimler sunan modern bir eğitim platformudur. Next.js, React, TypeScript ve MongoDB kullanılarak geliştirilmiştir.

## Özellikler

- Kullanıcı kaydı ve kimlik doğrulama sistemi (NextAuth.js)
- Kurs listeleme, filtreleme ve detay sayfaları
- Öğrenci dashboard'u ve ilerleme takibi
- Admin paneli ve kurs yönetimi
- Sertifika sistemi
- Responsive tasarım

## Kurulum

### Gereksinimler

- Node.js 18.0.0 veya üzeri
- MongoDB veritabanı
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/kullanici/abc-akademi.git
   cd abc-akademi
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   # veya
   yarn install
   ```

3. `.env.local` dosyasını oluşturun:
   ```bash
   cp env.example .env.local
   ```

4. `.env.local` dosyasını düzenleyerek MongoDB bağlantı bilgilerinizi ve diğer gerekli değişkenleri ayarlayın:
   ```
   MONGODB_URI=mongodb://localhost:27017/abc-akademi
   NEXTAUTH_URL=http://localhost:3333
   NEXTAUTH_SECRET=supersecretkey123456789
   ```

5. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   # veya
   yarn dev
   ```

6. Örnek verileri yükleyin:
   ```bash
   # Tarayıcıda aşağıdaki URL'yi ziyaret edin veya API'yi çağırın
   POST http://localhost:3333/api/courses/load
   ```

## Kullanım

- **Ana Sayfa**: `http://localhost:3333/`
- **Kurslar**: `http://localhost:3333/courses`
- **Dashboard**: `http://localhost:3333/dashboard`
- **Admin Paneli**: `http://localhost:3333/admin`

## Teknolojiler

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Veritabanı**: MongoDB (mongoose)
- **Kimlik Doğrulama**: NextAuth.js
- **Diğer**: Lucide React (ikonlar), Headless UI (UI bileşenleri)

## Dizin Yapısı

- `src/app`: Next.js uygulama yönlendiricisi ve sayfalar
- `src/components`: Yeniden kullanılabilir UI bileşenleri
- `src/contexts`: React context'leri
- `src/lib`: Yardımcı fonksiyonlar ve API istemcileri
- `src/models`: Mongoose modelleri
- `public`: Statik dosyalar

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE.txt` dosyasına bakın.

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CourseProvider } from '@/contexts/CourseContext';
import { UserProvider } from '@/contexts/UserContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { CertificateProvider } from '@/contexts/CertificateContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ABC Akademi - Profesyonel Eğitim Platformu',
  description: 'ABC Akademi ile kariyerinizi geliştirin. Sertifikalı kurslar, uzman eğitmenler ve modern eğitim teknolojileri.',
  keywords: 'eğitim, kurs, sertifika, online eğitim, ABC Akademi',
  authors: [{ name: 'ABC Akademi Ekibi' }],
  creator: 'ABC Akademi',
  publisher: 'ABC Akademi',
  metadataBase: new URL('https://www.abcakademi.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ABC Akademi - Profesyonel Eğitim Platformu',
    description: 'ABC Akademi ile kariyerinizi geliştirin. Sertifikalı kurslar, uzman eğitmenler ve modern eğitim teknolojileri.',
    url: 'https://www.abcakademi.com',
    siteName: 'ABC Akademi',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABC Akademi - Profesyonel Eğitim Platformu',
    description: 'ABC Akademi ile kariyerinizi geliştirin. Sertifikalı kurslar, uzman eğitmenler ve modern eğitim teknolojileri.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <CourseProvider>
            <UserProvider>
              <CategoryProvider>
                <CertificateProvider>
                  <SettingsProvider>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-grow">
                        {children}
                      </main>
                      <Footer />
                    </div>
                  </SettingsProvider>
                </CertificateProvider>
              </CategoryProvider>
            </UserProvider>
          </CourseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

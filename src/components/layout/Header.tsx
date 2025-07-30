'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, User, BookOpen, Settings, ShoppingCart } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-primary">Mavi Dünya</h1>
              <p className="text-xs text-muted-foreground">Akademi</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Kurslar
            </Link>
            <Link href="/magaza" className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center border border-blue-200">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Mağaza
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Hakkımızda
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              İletişim
            </Link>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <User className="h-5 w-5" />
                  <span>{session.user?.name}</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {(session.user as { role?: string })?.role === 'admin' && (
                    <Link href="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="h-4 w-4 mr-2" />
                    Profil
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Giriş Yap
                </Link>
                <Link href="/auth/signup" className="bg-gradient-hero hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link href="/" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Ana Sayfa
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Kurslar
              </Link>
              <Link href="/magaza" className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center border border-blue-200 mb-2">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Mağaza
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Hakkımızda
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                İletişim
              </Link>

              {session ? (
                <>
                  {(session.user as { role?: string })?.role === 'admin' && (
                    <Link href="/admin" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                    Profil
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-blue-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                    Giriş Yap
                  </Link>
                  <Link href="/auth/signup" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 
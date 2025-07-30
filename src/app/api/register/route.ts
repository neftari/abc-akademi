import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { name, email, password, role = 'student' } = await request.json();

    // Gerekli alanları kontrol et
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400}
      );
    }

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400}
      );
    }

    // Şifre uzunluğunu kontrol et
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400}
      );
    }

    // E-posta adresinin zaten kullanılıp kullanılmadığını kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400}
      );
    }

    // Yeni kullanıcı oluştur (şifre otomatik hash'lenecek)
    const newUser = new User({
      name,
      email,
      password,
      role,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      assignedCourses: []
    });

    // Kullanıcıyı MongoDB'ye kaydet
    const savedUser = await newUser.save();
    
    // Şifreyi response'dan çıkar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    return NextResponse.json(
      { 
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: userWithoutPassword
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    );
  }
} 
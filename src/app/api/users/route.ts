import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Kullanıcılar yüklenirken hata oluştu' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { name, email, password, role = 'student', phone, address, status = 'active', assignedCourses = [] } = await request.json();

    // Gerekli alanları kontrol et
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'İsim, e-posta ve şifre zorunludur' },
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
      phone,
      address,
      status,
      assignedCourses,
      joinDate: new Date().toISOString().split('T')[0]
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
    console.error('Kullanıcı oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    );
  }
}
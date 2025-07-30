import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';

export async function GET() {
  try {
    await dbConnect();
    const certificates = await Certificate.find({}).sort({ createdAt: -1 });
    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Sertifikalar yüklenirken hata oluştu' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Input validation
    const { studentName, studentEmail, courseName, courseId } = body;
    
    if (!studentName || !studentEmail || !courseName || !courseId) {
      return NextResponse.json(
        { error: 'Öğrenci adı, e-posta, kurs adı ve kurs ID zorunludur' },
        { status: 400 }
      );
    }
    
    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }
    
    const newCertificate = new Certificate(body);
    const savedCertificate = await newCertificate.save();
    return NextResponse.json(savedCertificate, { status: 201 });
  } catch (error) {
    console.error('Error creating certificate:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Geçersiz veri formatı' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Sertifika oluşturulurken hata oluştu' }, { status: 500 });
  }
} 
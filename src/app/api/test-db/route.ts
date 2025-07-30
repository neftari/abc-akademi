import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Mevcut' : 'Bulunamadı');
    
    await dbConnect();
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB bağlantısı başarılı',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test DB Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
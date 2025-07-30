import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { withRateLimit, rateLimiters } from '@/lib/rate-limiter';

async function restoreCourse(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Silinmiş kursu bul (soft delete middleware'i bypass et)
    const course = await Course.findOne({ _id: id, isDeleted: true });
    
    if (!course) {
      return NextResponse.json({ 
        error: 'Silinmiş kurs bulunamadı veya zaten aktif' 
      }, { status: 404 });
    }
    
    // Kursu geri yükle
    await course.restore();
    
    return NextResponse.json({ 
      message: 'Kurs başarıyla geri yüklendi',
      course: {
        id: course._id,
        title: course.title,
        restoredAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error restoring course:', error);
    return NextResponse.json({ 
      error: 'Kurs geri yüklenirken hata oluştu' 
    }, { status: 500 });
  }
}

export const POST = withRateLimit(rateLimiters.admin)(restoreCourse);
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: 'Kurs bulunamadı' }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Kurs yüklenirken hata oluştu' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = await params;
    
    // Input validation
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'Güncellenecek veri bulunamadı' }, { status: 400 });
    }
    
    // Validate price if it exists
    if (body.price !== undefined && (typeof body.price !== 'number' || body.price < 0)) {
      return NextResponse.json({ error: 'Geçerli bir fiyat giriniz' }, { status: 400 });
    }
    
    const updatedCourse = await Course.findByIdAndUpdate(id, body, { 
      new: true,
      runValidators: true 
    });
    
    if (!updatedCourse) {
      return NextResponse.json({ error: 'Kurs bulunamadı' }, { status: 404 });
    }
    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Geçersiz veri formatı' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Kurs güncellenirken hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Soft delete kullan
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: 'Kurs bulunamadı' }, { status: 404 });
    }
    
    // Silme işlemini yapan kullanıcı bilgisi (auth middleware'den gelecek)
    const deletedBy = request.headers.get('user-id') || 'system';
    
    await course.softDelete(deletedBy);
    
    return NextResponse.json({ 
      message: 'Kurs başarıyla silindi',
      deletedAt: course.deletedAt,
      canRestore: true
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Kurs silinirken hata oluştu' }, { status: 500 });
  }
} 
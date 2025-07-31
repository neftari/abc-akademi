import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { getConnectionStatus } from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Query parametrelerini al
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'active';
    
    // Filter objesi oluştur
    interface FilterType {
      isDeleted: { $ne: boolean };
      status?: string;
      category?: string;
      $or?: Array<{ title: { $regex: string; $options: string } } | { instructor: { $regex: string; $options: string } }>;
    }
    
    const filter: FilterType = { isDeleted: { $ne: true } };
    
    if (status) {
      filter.status = status;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination hesapla
    const skip = (page - 1) * limit;
    
    // Paralel sorgular - sadece mağaza için gerekli alanlar
    const [courses, totalCount] = await Promise.all([
      Course.find(filter)
        .select('title price duration category instructor image rating level createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(filter)
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      success: true,
      data: courses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      meta: {
        connectionStatus: getConnectionStatus(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Courses GET error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Kurslar yüklenirken hata oluştu',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Geçersiz JSON formatı'
      }, { status: 400 });
    }
    
    // Input validation
    const { title, description, content, price, duration, category, instructor } = body;
    
    const requiredFields = { title, description, content, price, duration, category, instructor };
    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value && value !== 0)
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Zorunlu alanlar eksik',
        missingFields
      }, { status: 400 });
    }
    
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({
        success: false,
        error: 'Geçerli bir fiyat giriniz (0 veya pozitif sayı)'
      }, { status: 400 });
    }
    
    // Varsayılan değerleri ekle
    const courseData = {
      ...body,
      image: body.image || '/api/placeholder/400/250',
      students: body.students || 0,
      rating: body.rating || 4.5,
      status: body.status || 'active',
      level: body.level || 'Başlangıç'
    };
    
    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();
    
    return NextResponse.json({
      success: true,
      message: 'Kurs başarıyla oluşturuldu',
      data: savedCourse
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Courses POST error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return NextResponse.json({
          success: false,
          error: 'Veri doğrulama hatası',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 400 });
      }
      
      if (error.message.includes('duplicate key')) {
        return NextResponse.json({
          success: false,
          error: 'Bu başlıkta bir kurs zaten mevcut'
        }, { status: 409 });
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Kurs oluşturulurken hata oluştu',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
} 
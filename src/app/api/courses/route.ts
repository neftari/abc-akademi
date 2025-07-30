import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { withRateLimit, rateLimiters } from '@/lib/rate-limiter';

async function getCourses() {
  try {
    await dbConnect();
    const courses = await Course.find({}).sort({ createdAt: -1 });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Kurslar yüklenirken hata oluştu' }, { status: 500 });
  }
}

export const GET = withRateLimit(rateLimiters.general)(getCourses);

async function createCourse(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Input validation
    const { title, description, content, price, duration, category, instructor } = body;
    
    if (!title || !description || !content || !price || !duration || !category || !instructor) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanlar doldurulmalıdır' },
        { status: 400 }
      );
    }
    
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'Geçerli bir fiyat giriniz' },
        { status: 400 }
      );
    }
    
    const newCourse = new Course(body);
    const savedCourse = await newCourse.save();
    return NextResponse.json(savedCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Geçersiz veri formatı' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Kurs oluşturulurken hata oluştu' }, { status: 500 });
  }
}

export const POST = withRateLimit(rateLimiters.admin)(createCourse); 
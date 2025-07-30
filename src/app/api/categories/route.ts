import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Kategoriler yüklenirken hata oluştu' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Input validation
    const { name, description } = body;
    
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Kategori adı ve açıklaması zorunludur' },
        { status: 400 }
      );
    }
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Bu kategori adı zaten kullanılıyor' },
        { status: 400 }
      );
    }
    
    const newCategory = new Category(body);
    const savedCategory = await newCategory.save();
    return NextResponse.json(savedCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Geçersiz veri formatı' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Kategori oluşturulurken hata oluştu' }, { status: 500 });
  }
} 
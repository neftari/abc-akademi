import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Kategori yüklenirken hata oluştu' }, { status: 500 });
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
    const updatedCategory = await Category.findByIdAndUpdate(id, body, { new: true });
    if (!updatedCategory) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
    }
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Kategori güncellenirken hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Kategori başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Kategori silinirken hata oluştu' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Setting from '@/models/Setting';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const setting = await Setting.findById(id);
    if (!setting) {
      return NextResponse.json({ error: 'Ayar bulunamadı' }, { status: 404 });
    }
    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error fetching setting:', error);
    return NextResponse.json({ error: 'Ayar yüklenirken hata oluştu' }, { status: 500 });
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
    const updatedSetting = await Setting.findByIdAndUpdate(id, body, { new: true });
    if (!updatedSetting) {
      return NextResponse.json({ error: 'Ayar bulunamadı' }, { status: 404 });
    }
    return NextResponse.json(updatedSetting);
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Ayar güncellenirken hata oluştu' }, { status: 500 });
  }
}
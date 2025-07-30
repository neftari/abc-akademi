import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return NextResponse.json({ error: 'Sertifika bulunamadı' }, { status: 404 });
    }
    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json({ error: 'Sertifika yüklenirken hata oluştu' }, { status: 500 });
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
    const updatedCertificate = await Certificate.findByIdAndUpdate(id, body, { new: true });
    if (!updatedCertificate) {
      return NextResponse.json({ error: 'Sertifika bulunamadı' }, { status: 404 });
    }
    return NextResponse.json(updatedCertificate);
  } catch (error) {
    console.error('Error updating certificate:', error);
    return NextResponse.json({ error: 'Sertifika güncellenirken hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedCertificate = await Certificate.findByIdAndDelete(id);
    if (!deletedCertificate) {
      return NextResponse.json({ error: 'Sertifika bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Sertifika başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json({ error: 'Sertifika silinirken hata oluştu' }, { status: 500 });
  }
}
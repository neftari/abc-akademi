import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Setting from '@/models/Setting';

export async function GET() {
  try {
    await dbConnect();
    // Ayarları getir (genellikle tek bir ayar dokümanı olur)
    const settings = await Setting.findOne({});
    
    // Eğer ayarlar yoksa, varsayılan ayarları döndür
    if (!settings) {
      return NextResponse.json({
        siteName: 'ABC Akademi',
        siteDescription: 'Modern eğitim platformu',
        contactEmail: 'info@abcakademi.com',
        twoFactorAuth: false,
        autoLogout: true,
        passwordComplexity: true,
        autoLogoutTime: 30
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Ayarlar yüklenirken hata oluştu' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Mevcut ayarları kontrol et
    const existingSettings = await Setting.findOne({});
    
    let savedSettings;
    
    if (existingSettings) {
      // Mevcut ayarları güncelle
      existingSettings.set(body);
      savedSettings = await existingSettings.save();
    } else {
      // Yeni ayarlar oluştur
      const newSettings = new Setting(body);
      savedSettings = await newSettings.save();
    }
    
    return NextResponse.json(savedSettings);
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Ayarlar kaydedilirken hata oluştu' }, { status: 500 });
  }
}
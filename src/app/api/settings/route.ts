import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { getConnectionStatus } from '@/lib/mongodb';
import Setting from '@/models/Setting';

export async function GET() {
  try {
    await dbConnect();

    // Ayarları getir (genellikle tek bir ayar dokümanı olur)
    const settings = await Setting.findOne({}).lean();

    // Eğer ayarlar yoksa, varsayılan ayarları döndür
    if (!settings) {
      const defaultSettings = {
        siteName: 'ABC Akademi',
        siteDescription: 'Modern eğitim platformu',
        contactEmail: 'info@abcakademi.com',
        twoFactorAuth: false,
        autoLogout: true,
        passwordComplexity: true,
        autoLogoutTime: 30
      };

      return NextResponse.json({
        success: true,
        data: defaultSettings,
        isDefault: true,
        meta: {
          connectionStatus: getConnectionStatus(),
          timestamp: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
      isDefault: false,
      meta: {
        connectionStatus: getConnectionStatus(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Settings GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Ayarlar yüklenirken hata oluştu',
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
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Güncellenecek ayar bulunamadı'
      }, { status: 400 });
    }

    // Email validation
    if (body.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.contactEmail)) {
      return NextResponse.json({
        success: false,
        error: 'Geçerli bir email adresi giriniz'
      }, { status: 400 });
    }

    // AutoLogoutTime validation
    if (body.autoLogoutTime !== undefined) {
      const timeout = parseInt(body.autoLogoutTime);
      if (isNaN(timeout) || timeout < 5 || timeout > 1440) {
        return NextResponse.json({
          success: false,
          error: 'Otomatik çıkış süresi 5-1440 dakika arasında olmalıdır'
        }, { status: 400 });
      }
      body.autoLogoutTime = timeout;
    }

    // Mevcut ayarları kontrol et
    const existingSettings = await Setting.findOne({});

    let savedSettings;

    if (existingSettings) {
      // Mevcut ayarları güncelle
      Object.assign(existingSettings, body);
      savedSettings = await existingSettings.save();
    } else {
      // Yeni ayarlar oluştur
      const newSettings = new Setting(body);
      savedSettings = await newSettings.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Ayarlar başarıyla güncellendi',
      data: savedSettings
    });
  } catch (error) {
    console.error('❌ Settings POST error:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        error: 'Veri doğrulama hatası',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Ayarlar kaydedilirken hata oluştu',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // PUT ve POST aynı işlevi görüyor
  return POST(request);
}
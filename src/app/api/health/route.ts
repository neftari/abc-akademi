import { NextResponse } from 'next/server';
import dbConnect, { getConnectionStatus } from '@/lib/mongodb';
import Course from '@/models/Course';
import Setting from '@/models/Setting';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Database bağlantısını test et
    await dbConnect();
    
    // Basit sorgular ile veritabanı erişimini test et
    const [coursesCount, settingsCount] = await Promise.all([
      Course.countDocuments({ isDeleted: { $ne: true } }),
      Setting.countDocuments()
    ]);
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        connectionState: getConnectionStatus(),
        collections: {
          courses: coursesCount,
          settings: settingsCount
        }
      },
      performance: {
        responseTime: `${responseTime}ms`,
        uptime: process.uptime()
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        nodeVersion: process.version
      }
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected',
        connectionState: getConnectionStatus(),
        error: (error as Error).message
      },
      performance: {
        responseTime: `${responseTime}ms`,
        uptime: process.uptime()
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        nodeVersion: process.version
      }
    }, { status: 503 });
  }
}
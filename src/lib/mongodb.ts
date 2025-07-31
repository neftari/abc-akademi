import mongoose from 'mongoose';

// MongoDB Atlas bağlantı dizesi
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined. Please check your .env.local file.');
}

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} | undefined;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Production ortamında log'ları azalt
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    if (!isProduction) {
      console.log('✅ Mevcut MongoDB bağlantısı kullanılıyor');
    }
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000, // 15 saniye (Vercel için artırıldı)
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      family: 4
    };

    if (!isProduction) {
      console.log('🔄 MongoDB Atlas\'a bağlanmaya çalışılıyor...');
    }

    try {
      cached.promise = mongoose.connect(MONGODB_URI!, opts);
      const mongooseInstance = await cached.promise;
      
      if (!isProduction) {
        console.log('✅ MongoDB Atlas\'a başarıyla bağlandı!');
        console.log(`📊 Bağlantı durumu: ${mongoose.connection.readyState}`);
        console.log(`🏷️ Veritabanı adı: ${mongoose.connection.name}`);
      }
      
      return mongooseInstance;
    } catch (error) {
      cached.promise = null;
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ MongoDB bağlantı hatası:', {
        message: errorMessage,
        name: error instanceof Error ? error.name : 'Unknown',
        uri: MONGODB_URI ? 'Mevcut' : 'Bulunamadı',
        timestamp: new Date().toISOString()
      });
      
      // Vercel için özel hata mesajları
      if (errorMessage.includes('ENOTFOUND')) {
        throw new Error('MongoDB Atlas sunucusuna ulaşılamıyor. DNS sorunu olabilir.');
      } else if (errorMessage.includes('authentication failed')) {
        throw new Error('MongoDB Atlas kimlik doğrulama hatası. Kullanıcı adı/şifre kontrol edin.');
      } else if (errorMessage.includes('timeout')) {
        throw new Error('MongoDB Atlas bağlantı zaman aşımı. Sunucu yavaş yanıt veriyor.');
      }
      
      throw new Error(`MongoDB Atlas bağlantı hatası: ${errorMessage}`);
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('❌ MongoDB bağlantı promise hatası:', errorMessage);
    throw new Error(`MongoDB bağlantı hatası: ${errorMessage}`);
  }
}

// Bağlantı durumunu kontrol eden yardımcı fonksiyon
export function getConnectionStatus(): string {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
}

// Bağlantıyı temizle (test için)
export async function disconnectDB() {
  if (cached?.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

export default dbConnect;
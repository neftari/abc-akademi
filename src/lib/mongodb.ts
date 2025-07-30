import mongoose from 'mongoose';

// MongoDB Atlas bağlantı dizesi
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
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
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    console.log('Mevcut MongoDB bağlantısı kullanılıyor');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('MongoDB URI kontrol ediliyor:', MONGODB_URI ? 'Mevcut' : 'Bulunamadı');
    
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // 10 saniye
      socketTimeoutMS: 45000,
      family: 4
    };

    console.log('MongoDB bağlantı seçenekleri:', opts);

    try {
      console.log('MongoDB Atlas\'a bağlanmaya çalışılıyor...');
      cached.promise = mongoose.connect(MONGODB_URI!, opts);
      const mongooseInstance = await cached.promise;
      console.log('MongoDB Atlas\'a başarıyla bağlandı!');
      return mongooseInstance;
    } catch (error) {
      console.error('MongoDB bağlantı hatası detayı:', {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      });
      cached.promise = null;
      throw new Error(`MongoDB Atlas'a bağlanılamadı: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB bağlantısı başarısız:', e);
    throw new Error(`MongoDB bağlantı hatası: ${e instanceof Error ? e.message : String(e)}`);
  }

  return cached.conn;
}

export default dbConnect;
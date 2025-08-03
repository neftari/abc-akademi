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
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    let retries = 3;
    let lastError = null;

    while (retries > 0) {
      try {
        console.log('MongoDB Atlas\'a bağlanmaya çalışılıyor...');
        cached.promise = mongoose.connect(MONGODB_URI!, opts);
        const mongooseInstance = await cached.promise;
        console.log('MongoDB Atlas\'a başarıyla bağlandı!');
        return mongooseInstance;
      } catch (error) {
        console.error(`MongoDB bağlantı hatası (${retries} deneme kaldı):`, error);
        lastError = error;
        retries--;
        
        if (retries > 0) {
          console.log(`2 saniye sonra yeniden denenecek...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    cached.promise = null;
    throw new Error(`MongoDB Atlas'a bağlanılamadı: ${lastError}`);
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
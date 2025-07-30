import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs; // 15 dakika
    this.maxRequests = maxRequests; // 100 istek
    
    // Her 5 dakikada bir eski kayıtları temizle
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  private getClientId(request: NextRequest): string {
    // IP adresini al
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // User agent ekle (daha spesifik tracking için)
    const userAgent = request.headers.get('user-agent') || 'unknown';
    return `${ip}:${userAgent.slice(0, 50)}`;
  }

  public isAllowed(request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
    const clientId = this.getClientId(request);
    const now = Date.now();
    
    // Client için kayıt yoksa veya süresi dolmuşsa yeni kayıt oluştur
    if (!this.store[clientId] || this.store[clientId].resetTime < now) {
      this.store[clientId] = {
        count: 1,
        resetTime: now + this.windowMs
      };
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: this.store[clientId].resetTime
      };
    }

    // Mevcut sayacı artır
    this.store[clientId].count++;
    
    const remaining = Math.max(0, this.maxRequests - this.store[clientId].count);
    const allowed = this.store[clientId].count <= this.maxRequests;

    return {
      allowed,
      remaining,
      resetTime: this.store[clientId].resetTime
    };
  }

  public getRemainingTime(request: NextRequest): number {
    const clientId = this.getClientId(request);
    const record = this.store[clientId];
    
    if (!record) return 0;
    
    return Math.max(0, record.resetTime - Date.now());
  }
}

// Farklı endpoint'ler için farklı limitler
export const rateLimiters = {
  general: new RateLimiter(15 * 60 * 1000, 100), // 15 dakikada 100 istek
  auth: new RateLimiter(15 * 60 * 1000, 5),      // 15 dakikada 5 login denemesi
  admin: new RateLimiter(5 * 60 * 1000, 50),     // 5 dakikada 50 admin işlemi
  upload: new RateLimiter(60 * 60 * 1000, 10),   // 1 saatte 10 upload
};

// Middleware fonksiyonu
export function withRateLimit(limiter: RateLimiter) {
  return <T extends unknown[]>(handler: (request: NextRequest, ...args: T) => Promise<NextResponse>) => {
    return async (request: NextRequest, ...args: T) => {
      const { allowed, remaining, resetTime } = limiter.isAllowed(request);
      
      if (!allowed) {
        const remainingTime = Math.ceil((resetTime - Date.now()) / 1000);
        
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: `Too many requests. Try again in ${remainingTime} seconds.`,
            retryAfter: remainingTime
          },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': limiter['maxRequests'].toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
              'Retry-After': remainingTime.toString()
            }
          }
        );
      }

      // Rate limit başarılı, isteği işle
      const response = await handler(request, ...args);
      
      // Rate limit header'larını ekle
      response.headers.set('X-RateLimit-Limit', limiter['maxRequests'].toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());
      
      return response;
    };
  };
}

export default RateLimiter;
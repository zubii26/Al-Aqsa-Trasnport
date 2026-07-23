import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    /** Seconds until the window resets — use in Retry-After header */
    retryAfter: number;
}

// ─── Named presets (used as strings now for the limiterType) ──────────────────
export const authLimiter = 'auth' as any;
export const formLimiter = 'form' as any;
export const bookingLimiter = 'booking' as any;
export const uploadLimiter = 'upload' as any;
export const generalLimiter = 'general' as any;

// Check if Upstash is configured
const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

// Create a single redis instance if credentials exist
const redis = hasRedis ? new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
}) : null;

// Named limiters
let authLimiterInstance: Ratelimit | null = null;
let formLimiterInstance: Ratelimit | null = null;
let bookingLimiterInstance: Ratelimit | null = null;
let uploadLimiterInstance: Ratelimit | null = null;
let generalLimiterInstance: Ratelimit | null = null;

if (redis) {
    authLimiterInstance = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        analytics: true,
        prefix: "ratelimit:auth",
    });
    
    formLimiterInstance = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        analytics: true,
        prefix: "ratelimit:form",
    });
    
    bookingLimiterInstance = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "30 m"),
        analytics: true,
        prefix: "ratelimit:booking",
    });
    
    uploadLimiterInstance = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 m"),
        analytics: true,
        prefix: "ratelimit:upload",
    });
    
    generalLimiterInstance = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, "1 m"),
        analytics: true,
        prefix: "ratelimit:general",
    });
}

// In-memory fallback if Redis is not configured
const memoryStore = new Map<string, { count: number; resetTime: number }>();

function memoryRateLimit(ip: string, limit: number, intervalMs: number): RateLimitResult {
    const now = Date.now();
    const record = memoryStore.get(ip);

    if (!record || now > record.resetTime) {
        memoryStore.set(ip, { count: 1, resetTime: now + intervalMs });
        return { success: true, remaining: limit - 1, retryAfter: 0 };
    }

    if (record.count >= limit) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return { success: false, remaining: 0, retryAfter };
    }

    record.count++;
    return { success: true, remaining: limit - record.count, retryAfter: 0 };
}

export async function rateLimit(
    ip: string,
    limiterType: 'auth' | 'form' | 'booking' | 'upload' | 'general' | any = 'general'
): Promise<RateLimitResult> {
    if (redis) {
        let ratelimit: Ratelimit;
        switch (limiterType) {
            case 'auth': ratelimit = authLimiterInstance!; break;
            case 'form': ratelimit = formLimiterInstance!; break;
            case 'booking': ratelimit = bookingLimiterInstance!; break;
            case 'upload': ratelimit = uploadLimiterInstance!; break;
            case 'general':
            default: ratelimit = generalLimiterInstance!; break;
        }
        
        try {
            const { success, limit, remaining, reset } = await ratelimit.limit(ip);
            const retryAfter = Math.ceil((reset - Date.now()) / 1000);
            return {
                success,
                remaining,
                retryAfter: retryAfter > 0 ? retryAfter : 0
            };
        } catch (err) {
            console.error("Upstash Rate Limit Error:", err);
            // Fallthrough to memory rate limit if Upstash throws an error
        }
    }
    
    // Fallback configurations
    const fallbackConfigs: Record<string, { limit: number, interval: number }> = {
        auth: { limit: 5, interval: 15 * 60_000 },
        form: { limit: 5, interval: 15 * 60_000 },
        booking: { limit: 10, interval: 30 * 60_000 },
        upload: { limit: 10, interval: 60_000 },
        general: { limit: 60, interval: 60_000 }
    };
    
    const configKey = typeof limiterType === 'string' && fallbackConfigs[limiterType] ? limiterType : 'general';
    const config = fallbackConfigs[configKey];
    
    return memoryRateLimit(`${configKey}:${ip}`, config.limit, config.interval);
}

// Automatic memory cleanup
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of memoryStore.entries()) {
            if (now > record.resetTime) {
                memoryStore.delete(key);
            }
        }
    }, 60 * 60_000);
}

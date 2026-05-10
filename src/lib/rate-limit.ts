interface RateLimitRecord {
    count: number;
    resetTime: number;
}

const store = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
    /** Time window in milliseconds */
    interval: number;
    /** Max requests allowed within the window */
    limit: number;
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    /** Seconds until the window resets — use in Retry-After header */
    retryAfter: number;
}

export function rateLimit(
    ip: string,
    options: RateLimitOptions = { interval: 60_000, limit: 60 }
): RateLimitResult {
    const now = Date.now();
    const record = store.get(ip);

    if (!record || now > record.resetTime) {
        store.set(ip, { count: 1, resetTime: now + options.interval });
        return { success: true, remaining: options.limit - 1, retryAfter: 0 };
    }

    if (record.count >= options.limit) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return { success: false, remaining: 0, retryAfter };
    }

    record.count++;
    return { success: true, remaining: options.limit - record.count, retryAfter: 0 };
}

// ─── Named presets ────────────────────────────────────────────────────────────

/** Auth endpoints: 5 requests per 15 minutes per IP */
export const authLimiter: RateLimitOptions = {
    interval: 15 * 60_000,
    limit: 5,
};

/** Public form submissions (contact, newsletter): 5 requests per 15 minutes per IP */
export const formLimiter: RateLimitOptions = {
    interval: 15 * 60_000,
    limit: 5,
};

/** Booking creation: 10 requests per 30 minutes per IP */
export const bookingLimiter: RateLimitOptions = {
    interval: 30 * 60_000,
    limit: 10,
};

/** File uploads: 10 requests per minute per IP */
export const uploadLimiter: RateLimitOptions = {
    interval: 60_000,
    limit: 10,
};

/** General API reads: 60 requests per minute per IP */
export const generalLimiter: RateLimitOptions = {
    interval: 60_000,
    limit: 60,
};

// ─── Automatic cleanup (runs every hour) ─────────────────────────────────────
// Prevents unbounded memory growth by removing expired records.
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [ip, record] of store.entries()) {
            if (now > record.resetTime) {
                store.delete(ip);
            }
        }
    }, 60 * 60_000);
}

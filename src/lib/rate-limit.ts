interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
    interval: number; // Time window in milliseconds
    limit: number;    // Max requests per window
}

export function rateLimit(ip: string, options: RateLimitOptions = { interval: 60 * 1000, limit: 5 }) {
    const now = Date.now();
    const record = store[ip];

    if (!record) {
        store[ip] = {
            count: 1,
            resetTime: now + options.interval,
        };
        return { success: true, remaining: options.limit - 1 };
    }

    if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + options.interval;
        return { success: true, remaining: options.limit - 1 };
    }

    if (record.count >= options.limit) {
        return { success: false, remaining: 0 };
    }

    record.count++;
    return { success: true, remaining: options.limit - record.count };
}

// Clean up old entries periodically (every hour)
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const ip in store) {
            if (now > store[ip].resetTime) {
                delete store[ip];
            }
        }
    }, 60 * 60 * 1000);
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Subscriber } from '@/models';
import { rateLimit, formLimiter } from '@/lib/rate-limit';
import { z } from 'zod';

const NewsletterSchema = z.object({
    email: z.string().email('Invalid email address').max(254, 'Email is too long').trim()
});

export async function POST(request: Request) {
    // ─── Rate Limiting ──────────────────────────────────────────────────────
    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        'unknown';

    const limiter = rateLimit(ip, formLimiter);

    if (!limiter.success) {
        return NextResponse.json(
            { error: 'Too many subscription attempts. Please try again later.' },
            {
                status: 429,
                headers: { 'Retry-After': String(limiter.retryAfter) },
            }
        );
    }

    try {
        const body = await request.json();
        
        const validation = NewsletterSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: (validation.error as any).errors?.[0]?.message || 'Invalid input' }, { status: 400 });
        }

        const { email } = validation.data;

        await dbConnect();

        // Check if already subscribed
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            if (!existing.isActive) {
                existing.isActive = true;
                await existing.save();
                return NextResponse.json({ message: 'Welcome back! You have been resubscribed.' });
            }
            return NextResponse.json({ message: 'You are already subscribed.' });
        }

        // Create new subscriber
        await Subscriber.create({ email });

        return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 201 });

    } catch (error) {
        console.error('[api/newsletter/subscribe] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

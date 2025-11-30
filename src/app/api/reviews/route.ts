import { NextResponse } from 'next/server';
import { fetchGoogleReviews } from '@/lib/google-reviews';
import { prisma } from '@/lib/prisma';
import { validateRequest } from '@/lib/server-auth';

export async function GET() {
    try {
        const reviews = await fetchGoogleReviews();
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Admin only endpoint to update review
    const isAuth = await validateRequest();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, isVisible, status, reply } = body;

        if (!id) {
            return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
        }

        const data: any = {};
        if (isVisible !== undefined) data.isVisible = isVisible;
        if (status !== undefined) {
            data.status = status;
            // Sync isVisible with status
            if (status === 'approved') data.isVisible = true;
            if (status === 'rejected' || status === 'pending') data.isVisible = false;
        }
        if (reply !== undefined) data.reply = reply;

        const updated = await prisma.review.update({
            where: { id },
            data
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models';
import { validateRequest } from '@/lib/server-auth';

import { curatedTestimonials } from '@/data/testimonials';

export async function GET() {
    try {
        await dbConnect();

        // Check if user is admin to decide whether to show all reviews or only active ones
        const user = await validateRequest();
        const isAdmin = user?.role === 'admin' || user?.role === 'manager';

        const query = isAdmin ? {} : { isActive: true, status: 'approved' };

        // Fetch reviews, sorted by date descending
        const reviews = await Review.find(query).sort({ date: -1 }).lean();

        // FALLBACK: If no reviews found (and not admin specific query), return curated testimonials
        if ((!reviews || reviews.length === 0) && !isAdmin) {
            const fallbackReviews = curatedTestimonials.map(t => ({
                _id: t.id, // Map id to _id for consistency
                id: t.id,
                author: t.name,
                rating: t.rating,
                comment: t.story,
                date: new Date().toISOString(), // Use current date or t.date if parseable
                isActive: true,
                status: 'approved'
            }));
            return NextResponse.json(fallbackReviews);
        }

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        // On error, also try to return fallback if possible, or just error
        // For now, let's return fallback on error too for robustness in demo
        const fallbackReviews = curatedTestimonials.map(t => ({
            _id: t.id,
            id: t.id,
            author: t.name,
            rating: t.rating,
            comment: t.story,
            date: new Date().toISOString(),
            isActive: true,
            status: 'approved'
        }));
        return NextResponse.json(fallbackReviews);
    }
}

export async function POST(request: Request) {
    // Admin only endpoint to update review
    const user = await validateRequest();
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body: { id: string; isVisible?: boolean; status?: string; reply?: string } = await request.json();
        const { id, isVisible, status, reply } = body;

        if (!id) {
            return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
        }

        await dbConnect();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: Record<string, any> = {};

        // Update status and isActive based on input
        if (status) {
            updateData.status = status;
            updateData.isActive = status === 'approved';
        } else if (isVisible !== undefined) {
            updateData.isActive = isVisible;
            updateData.status = isVisible ? 'approved' : 'rejected';
        }

        if (reply !== undefined) updateData.reply = reply;

        const updated = await Review.findByIdAndUpdate(id, updateData, { new: true });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models';
import { validateRequest } from '@/lib/server-auth';

export async function GET() {
    try {
        await dbConnect();

        // Check if user is admin to decide whether to show all reviews or only active ones
        const user = await validateRequest();
        const isAdmin = user?.role === 'admin' || user?.role === 'manager';

        const query = isAdmin ? {} : { isActive: true, status: 'approved' };

        // Fetch reviews, sorted by date descending
        const reviews = await Review.find(query).sort({ date: -1 }).lean();
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
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

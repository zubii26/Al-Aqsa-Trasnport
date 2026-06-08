import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Route } from '@/models';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        await dbConnect();

        const routes = await Route.find({ isActive: true }).sort({ category: 1, origin: 1 });

        return NextResponse.json(routes, {
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.error('Error fetching routes:', error);
        return NextResponse.json({ error: 'Failed to fetch routes' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Vehicle } from '@/models';

export async function GET() {
    try {
        await dbConnect();

        const vehicles = await Vehicle.find({ isActive: true }).sort({ category: 1, name: 1 });

        return NextResponse.json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
    }
}


import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Driver } from '@/models';

export async function GET() {
    try {
        await dbConnect();
        const drivers = await Driver.find().sort({ createdAt: -1 });
        return NextResponse.json(drivers);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch drivers' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        const driver = await Driver.create(body);

        return NextResponse.json(driver, { status: 201 });
    } catch (error) {
        console.error('Error creating driver:', error);
        return NextResponse.json(
            { error: 'Failed to create driver' },
            { status: 500 }
        );
    }
}

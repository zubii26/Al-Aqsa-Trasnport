
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Driver } from '@/models';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const driver = await Driver.findById(id);

        if (!driver) {
            return NextResponse.json(
                { error: 'Driver not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(driver);
    } catch (error) {
        console.error('Error fetching driver:', error);
        return NextResponse.json(
            { error: 'Failed to fetch driver' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const driver = await Driver.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        );

        if (!driver) {
            return NextResponse.json(
                { error: 'Driver not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(driver);
    } catch (error) {
        console.error('Error updating driver:', error);
        return NextResponse.json(
            { error: 'Failed to update driver' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const driver = await Driver.findByIdAndDelete(id);

        if (!driver) {
            return NextResponse.json(
                { error: 'Driver not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Driver deleted successfully' });
    } catch (error) {
        console.error('Error deleting driver:', error);
        return NextResponse.json(
            { error: 'Failed to delete driver' },
            { status: 500 }
        );
    }
}

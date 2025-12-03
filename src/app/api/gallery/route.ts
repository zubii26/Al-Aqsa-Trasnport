import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { GalleryItem } from '@/models';

export async function GET() {
    try {
        await dbConnect();
        const items = await GalleryItem.find({}).sort({ createdAt: -1 });
        return NextResponse.json(items);
    } catch (error) {
        console.error('Failed to fetch gallery items:', error);
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}

import { validateRequest } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
    const user = await validateRequest();
    if (!user || (user.role !== 'admin' && !user.role.toLowerCase().includes('manager'))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        await dbConnect();
        const body = await request.json();
        const item = await GalleryItem.create(body);
        return NextResponse.json(item);
    } catch (error) {
        console.error('Failed to create gallery item:', error);
        return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const user = await validateRequest();
    if (!user || (user.role !== 'admin' && !user.role.toLowerCase().includes('manager'))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await GalleryItem.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete gallery item:', error);
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}

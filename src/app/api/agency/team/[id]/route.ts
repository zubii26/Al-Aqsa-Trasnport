import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { validateRequest } from '@/lib/server-auth';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const currentUser = await validateRequest();
    if (!currentUser || currentUser.role !== 'agency') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentUser.parentId) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const { id } = await params;

    try {
        await dbConnect();

        // Ensure the user to become deleted belongs to the current agency
        const member = await User.findOne({ _id: id, parentId: currentUser.id });

        if (!member) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        await User.deleteOne({ _id: id });

        return NextResponse.json({ success: true, message: 'Member removed' });

    } catch (error) {
        console.error('Error removing member:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const currentUser = await validateRequest();
    if (!currentUser || currentUser.role !== 'agency') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentUser.parentId) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const { id } = await params;

    try {
        const body = await req.json();
        const { permissions } = body; // Expect array of strings

        await dbConnect();

        const member = await User.findOne({ _id: id, parentId: currentUser.id });
        if (!member) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        member.permissions = permissions;
        await member.save();

        return NextResponse.json({ success: true, member });

    } catch (error) {
        console.error('Error updating member:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

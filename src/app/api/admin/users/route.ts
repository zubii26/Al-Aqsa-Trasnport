import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { requireRole } from '@/lib/server-auth';

export async function GET() {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await dbConnect();
        const users = await User.find({}).sort({ createdAt: -1 }).lean();
        const formattedUsers = users.map(u => ({ ...u, id: u._id.toString() }));
        return NextResponse.json(formattedUsers);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body: { name: string; email: string; password?: string; role: string } = await request.json();
        const { name, email, password, role } = body;

        await dbConnect();

        // Check if email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            role: role.toLowerCase() // Ensure role is lowercase
        });

        console.log(`Created user: ${name} (${role})`);

        return NextResponse.json({ ...newUser.toObject(), id: newUser._id.toString() });
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body: { id: string; name: string; email: string; password?: string; role: string } = await request.json();
        const { id, name, email, password, role } = body;

        if (!id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        await dbConnect();

        const updateData: Record<string, string> = { name, email, role: role.toLowerCase() };
        if (password && password.trim() !== '') {
            updateData.password = password;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).lean();

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log(`Updated user: ${name} (${role})`);

        return NextResponse.json({ ...updatedUser, id: updatedUser._id.toString() });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (id === (user as any).id) {
            return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
        }

        await dbConnect();
        await User.findByIdAndDelete(id);

        console.log(`Deleted user ID: ${id}`);

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

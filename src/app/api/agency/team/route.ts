import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { validateRequest } from '@/lib/server-auth';
import { hashPassword } from '@/lib/password-utils'; // Assuming this exists or using bcrypt directly

export async function GET() {
    const currentUser = await validateRequest();
    if (!currentUser || currentUser.role !== 'agency') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        // Fetch all users where parentId matches current user's ID
        const team = await User.find({ parentId: currentUser.id })
            .select('-password -__v') // Exclude sensitive fields
            .sort({ createdAt: -1 });

        return NextResponse.json(team);
    } catch (error) {
        console.error('Error fetching team:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const currentUser = await validateRequest();
    if (!currentUser || currentUser.role !== 'agency') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Security check: If currentUser is already a sub-account, prevent them from adding more?
    // For now, only 'root' agency accounts (no parentId) can add members.
    if (currentUser.parentId) {
        return NextResponse.json({ error: 'Only the main account owner can add team members' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { name, email, password, permissions } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const newMember = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'agency', // They are also 'agency' role, but limited by parentId
            parentId: currentUser.id,
            permissions: permissions || [], // e.g. ['BOOKING']
            isActive: true
        });

        // Send Welcome Email (TODO)

        return NextResponse.json({
            success: true,
            member: {
                id: newMember._id,
                name: newMember.name,
                email: newMember.email,
                permissions: newMember.permissions
            }
        });

    } catch (error) {
        console.error('Error adding team member:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

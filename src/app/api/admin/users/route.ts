import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/server-auth';

export async function GET() {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name, email, password, role } = body;

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password, // In production, hash this!
                role
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'CREATE',
                entity: 'User',
                entityId: newUser.id,
                details: `Created user: ${name} (${role})`,
                user: user.name,
            }
        });

        return NextResponse.json(newUser);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { id, name, email, password, role } = body;

        if (!id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const data: any = { name, email, role };
        if (password && password.trim() !== '') {
            data.password = password; // In production, hash this!
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'UPDATE',
                entity: 'User',
                entityId: updatedUser.id,
                details: `Updated user: ${name} (${role})`,
                user: user.name,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
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

        if (id === user.id) {
            return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'DELETE',
                entity: 'User',
                entityId: id,
                details: `Deleted user ID: ${id}`,
                user: user.name,
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

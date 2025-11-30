import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/server-auth';

export async function GET() {
    const user = await requireRole(['ADMIN', 'MANAGER']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const routes = await prisma.route.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(routes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch routes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { origin, destination, distance, duration, category } = body;

        const route = await prisma.route.create({
            data: {
                origin,
                destination,
                distance,
                duration,
                category
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'CREATE',
                entity: 'Route',
                entityId: route.id,
                details: `Created route: ${origin} to ${destination}`,
                user: 'Admin',
            }
        });

        return NextResponse.json(route);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create route' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { id, origin, destination, distance, duration, category } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const route = await prisma.route.update({
            where: { id },
            data: {
                origin,
                destination,
                distance,
                duration,
                category
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'UPDATE',
                entity: 'Route',
                entityId: route.id,
                details: `Updated route: ${origin} to ${destination}`,
                user: 'Admin',
            }
        });

        return NextResponse.json(route);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        await prisma.route.delete({
            where: { id }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'DELETE',
                entity: 'Route',
                entityId: id,
                details: `Deleted route ID: ${id}`,
                user: 'Admin',
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
    }
}

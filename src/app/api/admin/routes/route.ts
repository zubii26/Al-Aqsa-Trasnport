import { NextResponse } from 'next/server';
import { routeService } from '@/services/routeService';
import { auditLogService } from '@/services/auditLogService';
import { requireRole } from '@/lib/server-auth';

export async function GET() {
    const user = await requireRole(['ADMIN', 'MANAGER']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const routes = await routeService.getRoutes();
        // Sort by createdAt desc
        routes.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
        return NextResponse.json(routes);
    } catch (error) {
        console.error('Error fetching routes:', error);
        return NextResponse.json({ error: 'Failed to fetch routes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await requireRole(['ADMIN', 'MANAGER']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { origin, destination, distance, duration, category } = body;

        const route = await routeService.createRoute({
            origin,
            destination,
            distance,
            duration,
            category,
            isActive: true, // Default to active
        });

        // Audit Log
        await auditLogService.log({
            action: 'CREATE',
            entity: 'Route',
            entityId: route.id,
            details: `Created route: ${origin} to ${destination}`,
            user: user.name || 'Admin',
        });

        return NextResponse.json(route);
    } catch {
        return NextResponse.json({ error: 'Failed to create route' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const user = await requireRole(['ADMIN', 'MANAGER']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { id, origin, destination, distance, duration, category } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const route = await routeService.updateRoute(id, {
            origin,
            destination,
            distance,
            duration,
            category
        });

        if (!route) {
            return NextResponse.json({ error: 'Route not found' }, { status: 404 });
        }

        // Audit Log
        await auditLogService.log({
            action: 'UPDATE',
            entity: 'Route',
            entityId: route.id,
            details: `Updated route: ${origin} to ${destination}`,
            user: user.name || 'Admin',
        });

        return NextResponse.json(route);
    } catch {
        return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const user = await requireRole(['ADMIN', 'MANAGER']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        await routeService.deleteRoute(id);

        // Audit Log
        await auditLogService.log({
            action: 'DELETE',
            entity: 'Route',
            entityId: id,
            details: `Deleted route ID: ${id}`,
            user: user.name || 'Admin',
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
    }
}

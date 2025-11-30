import { getBookings, getFleet } from '@/lib/db';
import { getLogs } from '@/lib/logger';
import { PrismaClient } from '@prisma/client';
import DashboardClient from './DashboardClient';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
    const bookings = await getBookings();
    const fleet = await getFleet();
    const logs = await getLogs();
    const routesCount = await prisma.route.count();

    const totalBookings = bookings.length;
    const activeFleet = fleet.filter(v => v.isActive).length;
    const totalFleet = fleet.length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((acc, curr) => acc + (parseFloat((curr as any).price || '0') || 0), 0);

    return (
        <DashboardClient
            totalBookings={totalBookings}
            activeFleet={activeFleet}
            totalFleet={totalFleet}
            pendingBookings={pendingBookings}
            confirmedBookings={confirmedBookings}
            routesCount={routesCount}
            totalRevenue={totalRevenue}
            recentBookings={bookings.slice(0, 5)}
            recentLogs={logs.slice(0, 5).map(log => ({ ...log, timestamp: new Date(log.timestamp), user: log.user || 'System' }))}
        />
    );
}

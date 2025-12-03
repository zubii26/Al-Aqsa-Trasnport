import { getBookings, getFleet } from '@/lib/db';
import { getLogs } from '@/lib/logger';
import { routeService } from '@/services/routeService';
import DashboardClient from './DashboardClient';

export default async function AdminDashboard() {
    const bookings = await getBookings();
    const fleet = await getFleet();
    const logs = await getLogs();
    const routes = await routeService.getRoutes();
    const routesCount = routes.length;

    const totalBookings = bookings.length;
    const activeFleet = fleet.filter(v => v.isActive).length;
    const totalFleet = fleet.length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recentBookings={bookings.slice(0, 5) as any}
            recentLogs={logs.slice(0, 5).map(log => ({ ...log, timestamp: new Date(log.timestamp), user: log.user || 'System' }))}
        />
    );
}

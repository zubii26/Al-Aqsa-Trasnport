import { getBookings, getFleet } from '@/lib/db';
import { getLogs } from '@/lib/logger';
import { routeService } from '@/services/routeService';
import DashboardClient from './DashboardClient';
import { requireRole } from '@/lib/server-auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
    const user = await requireRole(['ADMIN', 'MANAGER', 'OPERATIONAL_MANAGER']);
    if (!user) {
        redirect('/admin/login');
    }

    const bookings = await getBookings();
    const fleet = await getFleet();
    const { logs } = await getLogs(1, 10); // get recent 10
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

    // Aggregation for Analytics

    // 1. Revenue & Bookings by Month (Last 6 Months)
    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return d.toLocaleString('default', { month: 'short', year: '2-digit' });
    }).reverse();

    const chartData = last6Months.map(monthYear => {
        const monthBookings = bookings.filter(b => {
            const d = new Date(b.date);
            // Handle invalid dates if necessary, though b.date should be ISO or YYYY-MM-DD
            if (isNaN(d.getTime())) return false;
            const bMonth = d.toLocaleString('default', { month: 'short', year: '2-digit' });
            return bMonth === monthYear;
        });

        const revenue = monthBookings
            .filter(b => b.status === 'confirmed' || b.status === 'completed')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .reduce((acc, curr) => acc + (parseFloat((curr as any).price || '0') || 0), 0);

        return {
            name: monthYear,
            revenue: revenue,
            bookings: monthBookings.length
        };
    });

    // 2. Status Distribution
    const statusCounts = bookings.reduce((acc, curr) => {
        const status = curr.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieData = [
        { name: 'Confirmed', value: statusCounts['confirmed'] || 0, color: '#10b981' }, // emarald-500
        { name: 'Pending', value: statusCounts['pending'] || 0, color: '#f59e0b' },   // amber-500
        { name: 'Completed', value: statusCounts['completed'] || 0, color: '#3b82f6' }, // blue-500
        { name: 'Cancelled', value: statusCounts['cancelled'] || 0, color: '#ef4444' }, // red-500
    ].filter(d => d.value > 0);

    // 3. Top Vehicles
    const vehicleCounts = bookings.reduce((acc, curr) => {
        const vName = (curr as any).vehicle || 'Unknown'; // Normalize if using selectedVehicles later
        acc[vName] = (acc[vName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const barData = Object.entries(vehicleCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5

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
            recentBookings={bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5) as any}
            recentLogs={logs.slice(0, 5).map(log => ({ ...log, timestamp: new Date(log.timestamp), user: log.user || 'System' }))}
            analyticsData={{
                revenueChart: chartData,
                statusPie: pieData,
                vehicleBar: barData
            }}
        />
    );
}

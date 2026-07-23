export const dynamic = 'force-dynamic';

import { getBookings, getFleet, getDashboardStats } from '@/lib/db';
import { getLogs } from '@/lib/logger';
import { routeService } from '@/services/routeService';
import DashboardClient from './DashboardClient';
import styles from './admin.module.css';
import { IBooking } from '@/models';

export default async function AdminDashboard() {
    const [stats, recentBookingsData, logsData] = await Promise.all([
        getDashboardStats(),
        getBookings(1, 10), // Fetch page 1, limit 10
        getLogs(1, 10)
    ]);

    const dashboardData = {
        totalBookings: stats.totalBookings,
        activeFleet: stats.activeFleet,
        totalFleet: stats.totalFleet,
        pendingBookings: stats.pendingBookings,
        confirmedBookings: stats.confirmedBookings,
        routesCount: stats.routesCount,
        totalRevenue: stats.totalRevenue,
        recentBookings: recentBookingsData.bookings.map((b: IBooking) => ({
            id: b._id?.toString() || b.id || '',
            name: b.name,
            email: b.email,
            pickup: b.pickup,
            dropoff: b.dropoff,
            date: b.date,
            time: b.time,
            status: b.status
        })),
        recentLogs: logsData.logs.map((log: any) => ({
            id: log.id,
            action: log.action,
            details: log.details,
            timestamp: new Date(log.timestamp),
            user: log.user || 'Admin'
        })),
        analyticsData: stats.analyticsData
    };

    return (
        <div className={styles.adminContainer}>
            <div className={styles.contentWrapper}>
                <DashboardClient {...dashboardData} />
            </div>
        </div>
    );
}

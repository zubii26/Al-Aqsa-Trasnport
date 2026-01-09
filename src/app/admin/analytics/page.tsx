
import dynamic from 'next/dynamic';
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models';
import { requireRole } from '@/lib/server-auth';
import { redirect } from 'next/navigation';

import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsCharts';

export default async function AnalyticsPage() {
    // 1. Auth Check
    const user = await requireRole(['admin', 'manager', 'operational_manager']);
    if (!user) redirect('/admin/login');

    // 2. Data Fetching
    await dbConnect();

    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Revenue Trend (Last 6 Months)
    const revenueTrendRaw = await Booking.aggregate([
        {
            $match: {
                status: 'completed',
                createdAt: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: '$createdAt' },
                    year: { $year: '$createdAt' }
                },
                revenue: { $sum: '$finalPrice' },
                trips: { $count: {} }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const revenueData = revenueTrendRaw.map(item => ({
        name: `${item._id.month}/${item._id.year}`,
        revenue: item.revenue,
        trips: item.trips
    }));

    // Status Distribution
    const statusRaw = await Booking.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $count: {} }
            }
        }
    ]);

    const statusData = statusRaw.map(item => ({
        name: item._id,
        value: item.count
    }));

    // Top Routes
    const topRoutesRaw = await Booking.aggregate([
        {
            $group: {
                _id: { $concat: ["$pickup", " → ", "$dropoff"] },
                count: { $count: {} }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    const routeData = topRoutesRaw.map(item => ({
        name: item._id,
        value: item.count
    }));

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Business Analytics</h1>
                Track your business performance and revenue trends.
            </div>

            <AnalyticsDashboard
                revenueData={revenueData}
                statusData={statusData}
                routeData={routeData}
            />
        </div>
    );
}

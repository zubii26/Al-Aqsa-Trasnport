import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models';

export async function GET() {
    try {
        const user = await requireRole(['admin', 'manager', 'operational_manager']);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // 1. Total Revenue & Count (Lifetime)
        const totalStats = await Booking.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$finalPrice' },
                    totalTrips: { $count: {} }
                }
            }
        ]);

        // 2. Monthly Revenue (Current Month)
        const currentMonthStats = await Booking.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: '$finalPrice' },
                    bookings: { $count: {} }
                }
            }
        ]);

        // 3. Last Month Revenue (For Comparison)
        const lastMonthStats = await Booking.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: '$finalPrice' }
                }
            }
        ]);

        // 4. Revenue Trend (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const revenueTrend = await Booking.aggregate([
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

        // 5. Booking Status Distribution
        const statusDistribution = await Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $count: {} }
                }
            }
        ]);

        // 6. Top Routes
        const topRoutes = await Booking.aggregate([
            {
                $group: {
                    _id: { $concat: ["$pickup", " → ", "$dropoff"] },
                    count: { $count: {} }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const currentRevenue = currentMonthStats[0]?.revenue || 0;
        const lastRevenue = lastMonthStats[0]?.revenue || 0;
        const growth = lastRevenue === 0 ? 100 : ((currentRevenue - lastRevenue) / lastRevenue) * 100;

        return NextResponse.json({
            overview: {
                totalRevenue: totalStats[0]?.totalRevenue || 0,
                totalTrips: totalStats[0]?.totalTrips || 0,
                activeDrivers: 0, // Placeholder, fetch from User collection if needed
            },
            monthly: {
                revenue: currentRevenue,
                growth: Math.round(growth),
                bookings: currentMonthStats[0]?.bookings || 0
            },
            chartData: revenueTrend.map(item => ({
                name: `${item._id.month}/${item._id.year}`,
                revenue: item.revenue,
                trips: item.trips
            })),
            pieData: statusDistribution.map(item => ({
                name: item._id,
                value: item.count
            })),
            routeData: topRoutes.map(item => ({
                name: item._id,
                value: item.count
            }))
        });

    } catch (error) {
        console.error('Analytics API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

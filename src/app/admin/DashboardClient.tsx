'use client';

import KPIGrid from '@/components/admin/dashboard/KPIGrid';
import PopularRoutesChart from '@/components/admin/dashboard/PopularRoutesChart';
import RecentActivityFeed from '@/components/admin/dashboard/RecentActivityFeed';
import RecentBookingsTable from '@/components/admin/dashboard/RecentBookingsTable';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import StatusDistributionChart from '@/components/admin/dashboard/StatusDistributionChart';
import { Toast } from '@/components/ui/Toast';
import { usePusher } from '@/hooks/usePusher';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Booking {
    id: string;
    name: string;
    email: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    status: string;
}

interface Log {
    id: string;
    action: string;
    details: string;
    timestamp: Date;
    user: string;
}

interface AnalyticsData {
    revenueChart: { name: string; revenue: number; bookings: number }[];
    statusPie: { name: string; value: number; color: string }[];
    vehicleBar: { name: string; value: number }[];
    routeBar: { name: string; value: number }[];
}

interface DashboardProps {
    totalBookings: number;
    activeFleet: number;
    totalFleet: number;
    pendingBookings: number;
    confirmedBookings: number;
    routesCount: number;
    totalRevenue: number;
    recentBookings: Booking[];
    recentLogs: Log[];
    analyticsData: AnalyticsData;
}

export default function DashboardClient({
    totalBookings,
    activeFleet,
    totalFleet,
    pendingBookings,
    confirmedBookings,
    routesCount,
    totalRevenue,
    recentBookings: initialRecentBookings,
    recentLogs,
    analyticsData
}: DashboardProps) {
    const router = useRouter();
    const [recentBookings, setRecentBookings] = useState(initialRecentBookings);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Pusher Subscription
    const pusher = usePusher();

    useEffect(() => {
        if (!pusher) return;

        const channel = pusher.subscribe('admin-channel');

        const handleBookingUpdate = (data: any) => {
            console.log('Real-time Admin Refresh Triggered:', data);
            router.refresh(); // Fetch new server props
            if (data.message) {
                showToast(data.message, 'success');
            }
        };

        const handleUpdate = (data: any) => {
            console.log('Real-time Admin Refresh Triggered:', data);
            router.refresh();
        }

        channel.bind('new-booking', handleBookingUpdate);
        channel.bind('booking-updated', handleBookingUpdate);

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [pusher, router]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setRecentBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
                showToast(`Booking marked as ${newStatus}`, 'success');
                router.refresh(); // Refresh server props
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            showToast('Failed to update booking status', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-[#D4AF37]/30 transition-colors duration-300">
            {toast && <Toast message={toast.message} type={toast.type} isVisible={true} onClose={() => setToast(null)} />}

            <div className="max-w-[1600px] mx-auto p-6 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                            Command Center
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            System Operational • {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin/bookings">
                            <button className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#B38E2D] text-white font-bold rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all active:scale-95">
                                <Plus size={20} />
                                <span>New Booking</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* KPI Cards Grid */}
                <KPIGrid
                    totalRevenue={totalRevenue}
                    totalBookings={totalBookings}
                    confirmedBookings={confirmedBookings}
                    pendingBookings={pendingBookings}
                    activeFleet={activeFleet}
                    totalFleet={totalFleet}
                    routesCount={routesCount}
                />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Charts Section - Spans 2 Columns on large screens */}
                    <div className="lg:col-span-2 space-y-8">

                        <RevenueChart data={analyticsData.revenueChart} />

                        <RecentBookingsTable bookings={recentBookings} onStatusChange={handleStatusChange} />
                    </div>

                    {/* Sidebar / Stats Column */}
                    <div className="space-y-8">

                        <StatusDistributionChart data={analyticsData.statusPie} />

                        <PopularRoutesChart data={analyticsData.routeBar} />

                        <RecentActivityFeed logs={recentLogs} />

                    </div>
                </div>
            </div>
        </div>
    );
}

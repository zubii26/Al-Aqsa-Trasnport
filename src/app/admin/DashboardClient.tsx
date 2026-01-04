'use client';

import { motion } from 'framer-motion';
import { Car, Calendar, Activity, TrendingUp, Plus, Check, X, Users, MapPin, Clock, Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/ui/Toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { usePusher } from '@/hooks/usePusher';

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

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

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
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {/* Revenue Card */}
                    <motion.div variants={item} className="relative group bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-[#D4AF37]/30 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointers-events-none group-hover:bg-[#D4AF37]/10 transition-colors" />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    <span className="text-lg text-slate-500 font-normal mr-1">SAR</span>
                                    {totalRevenue.toLocaleString()}
                                </h3>
                            </div>
                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[#D4AF37] border border-slate-200 dark:border-slate-700/50">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 w-fit px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                            <Activity size={12} />
                            <span>+12.5% vs last month</span>
                        </div>
                    </motion.div>

                    {/* Bookings Card */}
                    <motion.div variants={item} className="relative group bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointers-events-none group-hover:bg-blue-500/10 transition-colors" />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Bookings</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{totalBookings}</h3>
                            </div>
                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-blue-500 dark:text-blue-400 border border-slate-200 dark:border-slate-700/50">
                                <Calendar size={24} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <span>{confirmedBookings} Confirmed</span>
                            <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
                            <span className="text-amber-600 dark:text-amber-400">{pendingBookings} Pending</span>
                        </div>
                    </motion.div>

                    {/* Fleet Card */}
                    <motion.div variants={item} className="relative group bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-purple-500/30 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointers-events-none group-hover:bg-purple-500/10 transition-colors" />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Fleet</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{activeFleet} <span className="text-lg text-slate-500 font-normal">/ {totalFleet}</span></h3>
                            </div>
                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-purple-500 dark:text-purple-400 border border-slate-200 dark:border-slate-700/50">
                                <Car size={24} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 w-fit px-2 py-1 rounded-full border border-purple-200 dark:border-purple-500/20">
                            <Activity size={12} />
                            <span>High Availability</span>
                        </div>
                    </motion.div>

                    {/* Routes Card */}
                    <motion.div variants={item} className="relative group bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-rose-500/30 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointers-events-none group-hover:bg-rose-500/10 transition-colors" />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Routes</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{routesCount}</h3>
                            </div>
                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-rose-500 dark:text-rose-400 border border-slate-200 dark:border-slate-700/50">
                                <MapPin size={24} />
                            </div>
                        </div>
                        <div className="text-xs text-slate-500">
                            Covering key locations across KSA
                        </div>
                    </motion.div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Charts Section - Spans 2 Columns on large screens */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Revenue Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm shadow-slate-200/50 dark:shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <TrendingUp size={20} className="text-[#D4AF37]" />
                                        Revenue Analytics
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monthly performance overview</p>
                                </div>
                            </div>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analyticsData.revenueChart}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value / 1000}k`}
                                            dx={-10}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                borderColor: '#e2e8f0',
                                                color: '#0f172a',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                            }}
                                            itemStyle={{ color: '#D4AF37' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#D4AF37"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Recent Bookings Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm shadow-slate-200/50 dark:shadow-xl"
                        >
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Clock size={20} className="text-blue-500" />
                                    Recent Bookings
                                </h3>
                                <Link href="/admin/bookings" className="text-sm font-semibold text-[#D4AF37] hover:text-[#f3e5ab] transition-colors flex items-center gap-1">
                                    View All <ArrowUpRight size={14} />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-950/50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                                            <th className="p-4 font-semibold">Customer</th>
                                            <th className="p-4 font-semibold">Route</th>
                                            <th className="p-4 font-semibold">Date & Time</th>
                                            <th className="p-4 font-semibold">Status</th>
                                            <th className="p-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {recentBookings.map((booking) => (
                                            <tr key={booking.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                            {booking.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 dark:text-white text-sm">{booking.name}</div>
                                                            <div className="text-xs text-slate-500">{booking.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                            <MapPin size={10} className="text-emerald-500" /> {booking.pickup}
                                                        </div>
                                                        <div className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                            <MapPin size={10} className="text-rose-500" /> {booking.dropoff}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                                                        {new Date(booking.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                        <Clock size={10} /> {booking.time}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`
                                                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                        ${booking.status === 'confirmed' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' :
                                                            booking.status === 'cancelled' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20' :
                                                                'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'}
                                                    `}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-emerald-500' :
                                                            booking.status === 'cancelled' ? 'bg-red-500' :
                                                                'bg-amber-500'
                                                            }`} />
                                                        {booking.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    {booking.status === 'pending' && (
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                                                className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 transition-all"
                                                                title="Confirm"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                                                className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 transition-all"
                                                                title="Cancel"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {recentBookings.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                                    No recent bookings found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar / Stats Column */}
                    <div className="space-y-8">

                        {/* Status Distribution */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm shadow-slate-200/50 dark:shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Activity size={18} className="text-purple-500" />
                                Booking Status
                            </h3>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analyticsData.statusPie}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {analyticsData.statusPie.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                borderColor: '#e2e8f0',
                                                borderRadius: '8px',
                                                color: '#0f172a'
                                            }}
                                            itemStyle={{ color: '#0f172a' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Top Routes Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm shadow-slate-200/50 dark:shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <TrendingUp size={18} className="text-emerald-500" />
                                Popular Routes
                            </h3>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={analyticsData.routeBar}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} interval={0} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: any) => [value, 'Bookings']}
                                        />
                                        <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Recent Activity Feed */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm shadow-slate-200/50 dark:shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Activity size={18} className="text-slate-400" />
                                Live Activity
                            </h3>
                            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                                {recentLogs.map((log, index) => (
                                    <div key={log.id || index} className="relative pl-10">
                                        <div className={`
                                            absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center z-10
                                            ${log.action.includes('DELETE') ? 'bg-red-100 dark:bg-red-500/20 text-red-500' :
                                                log.action.includes('UPDATE') ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-500' :
                                                    'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500'}
                                        `}>
                                            <Activity size={16} />
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                                                {log.action.replace(/_/g, ' ')}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                                {log.details}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
                                                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span>•</span>
                                                <span className="text-slate-500 dark:text-slate-400">{log.user}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {recentLogs.length === 0 && (
                                    <div className="text-center py-8 text-slate-500 text-sm pl-10">
                                        No recent activity
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper icon component for arrows
function ArrowUpRight({ size = 24 }: { size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
    );
}

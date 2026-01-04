'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, ArrowUpRight, Clock, CheckCircle2, FileText, Upload, Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';
import InstallPrompt from '@/components/driver/InstallPrompt';
import SpendingChart from '@/components/agency/analytics/SpendingChart';
import BookingStatusChart from '@/components/agency/analytics/BookingStatusChart';
import RoutePopularityChart from '@/components/agency/analytics/RoutePopularityChart';
import FleetUtilizationChart from '@/components/agency/analytics/FleetUtilizationChart';
import NotificationControl from '@/components/agency/NotificationControl';

export default function AgencyDashboard() {
    const [greeting, setGreeting] = useState('Welcome Back');
    const [stats, setStats] = useState({ totalSpend: 0, activeTrips: 0, activeContracts: 0, creditLimit: 0, outstanding: 0 });
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Analytics Data State
    const [spendingData, setSpendingData] = useState<any[]>([]);
    const [statusData, setStatusData] = useState<any[]>([]);
    const [routeData, setRouteData] = useState<any[]>([]);
    const [fleetData, setFleetData] = useState<any[]>([]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch Bookings
            const res = await fetch('/api/bookings');
            let outstandingAmount = 0;

            if (res.ok) {
                const data = await res.json();

                // 1. Calculate Basic Stats
                const total = data.reduce((sum: number, b: any) => {
                    const price = b.finalPrice ? parseFloat(String(b.finalPrice).replace(/[^0-9.]/g, '')) : 0;
                    return sum + (b.paymentStatus === 'paid' ? (isNaN(price) ? 0 : price) : 0);
                }, 0);

                outstandingAmount = data.reduce((sum: number, b: any) => {
                    const price = b.finalPrice ? parseFloat(String(b.finalPrice).replace(/[^0-9.]/g, '')) : 0;
                    return sum + (b.paymentStatus !== 'paid' && b.status !== 'cancelled' ? (isNaN(price) ? 0 : price) : 0);
                }, 0);

                const active = data.filter((b: any) => ['pending', 'confirmed', 'en_route'].includes(b.status)).length;
                setStats(prev => ({ ...prev, totalSpend: total, activeTrips: active, outstanding: outstandingAmount }));

                // 2. Process Spending Data (Last 6 Months)
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const spendingMap = new Map<string, number>();

                // Initialize last 6 months
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const key = `${monthNames[d.getMonth()]}`;
                    spendingMap.set(key, 0);
                }

                data.forEach((b: any) => {
                    if (b.status !== 'cancelled') {
                        const date = new Date(b.date || b.createdAt);
                        const month = monthNames[date.getMonth()];
                        const price = b.finalPrice ? parseFloat(String(b.finalPrice).replace(/[^0-9.]/g, '')) : 0;
                        if (spendingMap.has(month)) {
                            spendingMap.set(month, (spendingMap.get(month) || 0) + (isNaN(price) ? 0 : price));
                        }
                    }
                });

                setSpendingData(Array.from(spendingMap).map(([month, amount]) => ({ month, amount })));

                // 3. Process Status Data
                const statusCounts: Record<string, number> = { completed: 0, confirmed: 0, pending: 0, cancelled: 0 };
                data.forEach((b: any) => {
                    const status = b.status?.toLowerCase() || 'pending';
                    if (statusCounts[status] !== undefined) statusCounts[status]++;
                    else if (status === 'en_route') statusCounts['confirmed']++; // Group en_route with confirmed
                });

                setStatusData([
                    { name: 'Completed', value: statusCounts.completed, color: '#10B981' }, // Emerald
                    { name: 'Confirmed', value: statusCounts.confirmed, color: '#3B82F6' }, // Blue
                    { name: 'Pending', value: statusCounts.pending, color: '#F59E0B' }, // Amber
                    { name: 'Cancelled', value: statusCounts.cancelled, color: '#EF4444' }, // Red
                ].filter(item => item.value > 0));

                // 4. Process Route Data
                const routeCounts: Record<string, number> = {};
                data.forEach((b: any) => {
                    if (b.pickup && b.dropoff) {
                        // Simplify locations (e.g., "Jeddah Airport..." -> "Jeddah Airport")
                        const cleanPickup = b.pickup.split(',')[0].trim();
                        const cleanDropoff = b.dropoff.split(',')[0].trim();
                        const route = `${cleanPickup} ➝ ${cleanDropoff}`;
                        routeCounts[route] = (routeCounts[route] || 0) + 1;
                    }
                });

                const sortedRoutes = Object.entries(routeCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([name, count]) => ({
                        name,
                        count,
                        percentage: Math.round((count / data.length) * 100)
                    }));

                setRouteData(sortedRoutes);

                // 5. Process Fleet Data
                const vehicleCounts: Record<string, number> = {};
                data.forEach((b: any) => {
                    if (b.vehicle) {
                        vehicleCounts[b.vehicle] = (vehicleCounts[b.vehicle] || 0) + 1;
                    }
                });

                const sortedFleet = Object.entries(vehicleCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([name, count]) => ({ name, count }));

                setFleetData(sortedFleet);


                // Sort recent bookings
                const sorted = data.sort((a: any, b: any) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
                setRecentBookings(sorted.slice(0, 5));
            }

            // Fetch True Wallet Balance (Accounting Source of Truth)
            const walletRes = await fetch('/api/agency/wallet');
            if (walletRes.ok) {
                const walletData = await walletRes.json();
                // API returns { balance, creditLimit, availableCredit, ... }
                // balance in Wallet Model = Debt.
                // So outstanding = walletData.balance.
                setStats(prev => ({
                    ...prev,
                    outstanding: walletData.balance || 0,
                    creditLimit: walletData.creditLimit || 0
                }));
            } else {
                // Fallback to User Profile if Wallet fails (Legacy)
                const userRes = await fetch('/api/auth/me');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    if (userData && userData.user) {
                        setStats(prev => ({
                            ...prev,
                            activeContracts: userData.user.activeContracts || 0,
                            // creditLimit: userData.user.creditLimit || 0 // Prefer Wallet API
                        }));
                    }
                }
            }

        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
        } finally {
            setIsLoading(false);
        }
    };

    const availableCredit = Math.max(0, stats.creditLimit - stats.outstanding);
    const creditUsagePercent = stats.creditLimit > 0 ? (stats.outstanding / stats.creditLimit) * 100 : 0;

    return (
        <div className="pb-24 lg:pb-8 pt-8 px-4 lg:px-8 max-w-7xl mx-auto">
            {/* PWA Install Prompt */}
            <InstallPrompt
                appName="Corporate Portal"
                description="Install for quick bulk bookings"
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{greeting}, Partner</h1>
                    <p className="text-slate-500 text-sm mt-1">Corporate Account • Platinum Tier</p>
                </div>
                <div className="flex items-center gap-4">
                    <NotificationControl />
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Building2 size={20} />
                    </div>
                </div>
            </div>

            {/* Quick Stats/Hero */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Available Credit Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Available Credit</p>
                                <h2 className="text-3xl font-bold">SAR {availableCredit.toLocaleString()}</h2>
                                <p className="text-slate-400 text-xs mt-1">Limit: SAR {stats.creditLimit.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/10 p-2 rounded-lg text-white">
                                <FileText size={20} />
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Used: SAR {stats.outstanding.toLocaleString()}</span>
                                <span>{Math.min(100, Math.round(creditUsagePercent))}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${creditUsagePercent > 90 ? 'bg-red-500' : creditUsagePercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${Math.min(100, creditUsagePercent)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Spend Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Spend (Paid)</p>
                        <h2 className="text-3xl font-bold text-slate-900">SAR {stats.totalSpend.toLocaleString()}</h2>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <Link href="/agency/bulk-booking" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm active:scale-95 transition-transform hover:bg-blue-700 flex-1 justify-center">
                            <Upload size={16} strokeWidth={2.5} />
                            Bulk Booking
                        </Link>
                        <Link href="/agency/invoices" className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg text-sm font-bold border border-slate-200 active:scale-95 transition-transform hover:bg-slate-200">
                            Statement
                        </Link>
                    </div>
                </div>

                {/* Financial Insights Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm md:col-span-2 lg:col-span-1">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Financial Insights</p>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-500 font-medium">Avg. Booking Value</span>
                            <span className="text-sm font-bold text-slate-900">
                                SAR {recentBookings.length > 0 ? Math.round(stats.totalSpend / recentBookings.length).toLocaleString() : '0'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-500 font-medium">Monthly Growth</span>
                            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                                <ArrowUpRight size={14} /> +12.5%
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-slate-500 font-medium">Payment Health</span>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-black uppercase">Excellent</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            {!isLoading && (
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Performance Insights</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <SpendingChart data={spendingData} />
                        </div>
                        <div className="lg:col-span-1">
                            <BookingStatusChart data={statusData} />
                        </div>
                        <div className="lg:col-span-1">
                            <FleetUtilizationChart data={fleetData} />
                        </div>
                        <div className="lg:col-span-2">
                            <RoutePopularityChart data={routeData} />
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Recent Transactions</h3>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            ) : recentBookings.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Calendar size={20} />
                    </div>
                    <p className="text-slate-500 font-medium">No recent transactions</p>
                    <Link href="/book" className="text-blue-600 font-bold text-sm mt-2 hover:underline inline-block">
                        Make a booking
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {recentBookings.map((booking) => (
                        <div key={booking._id || booking.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                                        {booking.vehicle || 'Transport Booking'}
                                    </h4>
                                    <p className="text-xs text-slate-500">
                                        Ref #{booking._id?.slice(-6).toUpperCase() || '---'} • {new Date(booking.date || booking.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                <div className="text-right">
                                    <span className="block text-sm font-bold text-slate-900">
                                        {booking.finalPrice ? `SAR ${booking.finalPrice}` : 'Pending Quote'}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase ${booking.status === 'confirmed' || booking.status === 'completed'
                                        ? 'text-emerald-600'
                                        : booking.status === 'cancelled'
                                            ? 'text-red-600'
                                            : 'text-amber-600'
                                        }`}>
                                        {booking.status || 'PROCESSING'}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase ml-2 ${booking.paymentStatus === 'paid'
                                        ? 'text-emerald-600'
                                        : 'text-slate-400'
                                        }`}>
                                        {booking.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                                    </span>
                                </div>
                                <Link href={`/agency/invoices/${booking._id}`} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                                    <ArrowUpRight size={18} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

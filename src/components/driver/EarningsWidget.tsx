'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function EarningsWidget() {
    const [stats, setStats] = useState({
        today: 0,
        week: 0,
        tripsToday: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch stats
        // Assuming api/driver/stats returns { todayEarnings, weekEarnings, todayTrips }
        // If not, we might need to update the API or calculating locally from jobs list if small list.
        // For now, let's fetch from the dedicated stats endpoint.
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/driver/stats');
                if (res.ok) {
                    const data = await res.json();

                    // Filter for today
                    const today = new Date().toDateString();
                    const todaysTrips = data.completedTrips.filter((trip: any) => {
                        // Trip date format comes as "YYYY-MM-DD HH:MM" or similar string from booking
                        // Let's assume compatible parsing or just check string match if formatted same
                        // Actually booking date is usually "YYYY-MM-DD" string.
                        // Let's safe parse.
                        const tripDate = new Date(trip.date).toDateString();
                        return tripDate === today;
                    });

                    const todayEarnings = todaysTrips.reduce((acc: number, curr: any) => acc + curr.amount, 0);

                    setStats({
                        today: todayEarnings,
                        week: 0, // Placeholder
                        tripsToday: todaysTrips.length
                    });
                }
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6 animate-pulse h-32"></div>
    );

    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-8 -mt-8"></div>

                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Today Earnings</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{stats.today}</span>
                    <span className="text-sm font-medium text-slate-400">SAR</span>
                </div>

                <div className="mt-4 flex items-center gap-1 text-emerald-400 text-xs font-bold">
                    <TrendingUp size={12} />
                    <span>{stats.tripsToday} Trips</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Today's Date</p>
                <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                    <Calendar size={18} className="text-amber-500" />
                    {format(new Date(), 'dd MMM')}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                    <Clock size={16} />
                    {format(new Date(), 'HH:mm')}
                </div>
            </div>
        </div>
    );
}

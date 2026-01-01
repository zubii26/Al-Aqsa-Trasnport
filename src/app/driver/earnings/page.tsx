'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Wallet, TrendingUp, Clock, Calendar, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import BottomNav from '@/components/driver/BottomNav';

const weeklyData = [
    { day: 'Mon', amount: 350 },
    { day: 'Tue', amount: 420 },
    { day: 'Wed', amount: 280 },
    { day: 'Thu', amount: 550 },
    { day: 'Fri', amount: 600 },
    { day: 'Sat', amount: 480 },
    { day: 'Sun', amount: 0 },
];

const completedTrips = [
    { id: '1', date: 'Today, 2:30 PM', route: 'Jeddah Airport -> Makkah', amount: 350, type: 'credit' },
    { id: '2', date: 'Yesterday, 5:15 PM', route: 'Makkah -> Madinah', amount: 800, type: 'credit' },
    { id: '3', date: '28 Dec, 10:00 AM', route: 'Fuel Expense', amount: -60, type: 'debit' },
    { id: '4', date: '28 Dec, 8:00 AM', route: 'City Tour', amount: 400, type: 'credit' },
];

export default function DriverEarnings() {
    const [timeRange, setTimeRange] = useState('weekly');

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 pb-12 rounded-b-[30px] shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Wallet className="text-amber-500" />
                        My Earnings
                    </h1>

                    {/* Total Balance Card */}
                    <div className="text-center mb-8">
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Balance</p>
                        <h2 className="text-4xl font-bold text-white mb-2">SAR 2,450<span className="text-2xl text-slate-500">.00</span></h2>
                        <div className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                            <TrendingUp size={14} />
                            +15% this week
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                <Clock size={16} />
                                <span className="text-xs font-bold uppercase">Online Hours</span>
                            </div>
                            <p className="text-xl font-bold text-white">34.5 <span className="text-sm text-slate-500">hrs</span></p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                <Calendar size={16} />
                                <span className="text-xs font-bold uppercase">Trips Done</span>
                            </div>
                            <p className="text-xl font-bold text-white">12 <span className="text-sm text-slate-500">jobs</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-6 relative z-10 space-y-6">
                {/* Chart Section */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Revenue Trend</h3>
                        <select
                            className="text-xs bg-slate-50 border-none rounded-lg py-1 px-2 text-slate-600 font-medium focus:ring-0 cursor-pointer"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="weekly">This Week</option>
                            <option value="monthly">This Month</option>
                        </select>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                    {weeklyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.amount > 500 ? '#f59e0b' : '#cbd5e1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h3 className="font-bold text-slate-800 mb-3 px-1">Recent Activity</h3>
                    <div className="space-y-3">
                        {completedTrips.map(trip => (
                            <div key={trip.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${trip.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {trip.type === 'credit' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{trip.route}</p>
                                        <p className="text-xs text-slate-500">{trip.date}</p>
                                    </div>
                                </div>
                                <span className={`font-bold text-sm ${trip.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                                    {trip.type === 'credit' ? '+' : '-'} SAR {Math.abs(trip.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}

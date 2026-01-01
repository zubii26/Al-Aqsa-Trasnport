'use client';

import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Activity } from 'lucide-react';

interface AnalyticsData {
    overview: {
        totalRevenue: number;
        totalTrips: number;
        activeDrivers: number;
    };
    monthly: {
        revenue: number;
        growth: number;
        bookings: number;
    };
    chartData: {
        name: string;
        revenue: number;
        trips: number;
    }[];
    pieData: {
        name: string;
        value: number;
    }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/admin/analytics');
                if (res.ok) {
                    const jsonData = await res.json();
                    setData(jsonData);
                }
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;
    }

    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">
                                {new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(data.overview.totalRevenue)}
                            </h3>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                            <DollarSign size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Monthly Revenue</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">
                                {new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(data.monthly.revenue)}
                            </h3>
                            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${data.monthly.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {data.monthly.growth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                <span>{Math.abs(data.monthly.growth)}% from last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                            <Activity size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Trips</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">
                                {data.overview.totalTrips}
                            </h3>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                            <Calendar size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Monthly Trips</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">
                                {data.monthly.bookings}
                            </h3>
                        </div>
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
                            <Car size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold text-lg mb-6 text-slate-800 dark:text-white">Revenue Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.chartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="name" fontSize={12} stroke="#888888" />
                                <YAxis fontSize={12} stroke="#888888" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Revenue (SAR)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold text-lg mb-6 text-slate-800 dark:text-white">Booking Status</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Car(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
        </svg>
    )
}

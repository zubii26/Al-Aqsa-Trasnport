'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Calendar, Shield, DollarSign, Briefcase, MapPin, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import adminStyles from '../../admin.module.css';

interface BookingSummary {
    id: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    status: string;
    price?: number;
}

interface UserStats {
    totalEarnings: number;
    completedTrips: number;
    totalTrips: number;
    rating: number;
}

interface UserDetails {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function UserDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [user, setUser] = useState<UserDetails | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [activeAssignments, setActiveAssignments] = useState<BookingSummary[]>([]);
    const [history, setHistory] = useState<BookingSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchUserDetails();
        }
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            // If user is a driver, we use the detailed stats endpoint
            // If strictly a user, we might need a basic endpoint, but let's try stats first
            // which usually returns basic user info even if no driver stats.
            // Actually, our API assumes 'user' is returned. 
            // If the user is NOT a driver, the stats might be empty, which is fine.

            const res = await fetch(`/api/admin/users/${id}/stats`);
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);

                if (data.user.role === 'driver') {
                    setStats(data.stats);
                    setActiveAssignments(data.activeAssignments);
                    setHistory(data.history);
                }
            } else {
                // Fallback for non-drivers if stats endpoint fails strictly? 
                // Currently our API returns 404 if user not found, 200 with user info.
                console.error('Failed to fetch user details');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!user) {
        return <div className="p-8 text-center text-red-500">User not found</div>;
    }

    const isDriver = user.role === 'driver';

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className={adminStyles.title}>User Details</h1>
                    <p className="text-muted-foreground">View and manage user information</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className={adminStyles.glassCard + " p-6"}>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                        <User size={48} className="text-amber-500" />
                    </div>
                    <div className="space-y-2 flex-1">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            {user.name}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-2">
                                <Mail size={16} /> {user.email}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={16} /> Joined {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2 capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
                                <Shield size={14} /> {user.role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Driver Financials & Stats */}
            {isDriver && stats && (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <TrendingUp className="text-emerald-500" /> Financial Overview & Performance
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Revenue */}
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-emerald-100 font-medium mb-1">Total Revenue Generated</p>
                                <h4 className="text-3xl font-bold flex items-baseline gap-1">
                                    <span className="text-lg opacity-80">SAR</span>
                                    {stats.totalEarnings.toLocaleString()}
                                </h4>
                            </div>
                            <DollarSign className="absolute -bottom-4 -right-4 w-32 h-32 text-emerald-400/20 rotate-12" />
                        </div>

                        {/* Completed Trips */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Completed Trips</p>
                                <h4 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {stats.completedTrips}
                                </h4>
                                <p className="text-xs text-slate-400 mt-2">Lifetime successful bookings</p>
                            </div>
                            <CheckCircle className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-100 dark:text-slate-800 rotate-12" />
                        </div>

                        {/* Active Assignments */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Active Assignments</p>
                                <h4 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {activeAssignments.length}
                                </h4>
                                <p className="text-xs text-slate-400 mt-2">Currently in progress or pending</p>
                            </div>
                            <Briefcase className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-100 dark:text-slate-800 rotate-12" />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Active Assignments List */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Current Assignments</h3>
                            {activeAssignments.length > 0 ? (
                                <div className="space-y-3">
                                    {activeAssignments.map(booking => (
                                        <div key={booking.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center group hover:border-amber-400 transition-colors">
                                            <div className="flex gap-4">
                                                <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-amber-600">
                                                    <Clock size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">
                                                        {booking.pickup} <span className="text-slate-400 px-1">→</span> {booking.dropoff}
                                                    </div>
                                                    <div className="text-xs text-slate-500 flex gap-3">
                                                        <span>{booking.date} at {booking.time}</span>
                                                        <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">{booking.status.replace('_', ' ')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {booking.price && (
                                                <div className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1 rounded-lg">
                                                    SAR {booking.price}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400">
                                    No active jobs right now.
                                </div>
                            )}
                        </div>

                        {/* Recent History */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Recent History</h3>
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                {history.length > 0 ? (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {history.map(booking => (
                                            <div key={booking.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-xs font-mono text-slate-400">#{booking.id.slice(-6)}</span>
                                                    <span className="text-xs font-medium text-emerald-600">Completed</span>
                                                </div>
                                                <div className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-1 line-clamp-1">
                                                    {booking.pickup} → {booking.dropoff}
                                                </div>
                                                <div className="flex justify-between items-center text-xs text-slate-500">
                                                    <span>{booking.date}</span>
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                                        {booking.price ? `SAR ${booking.price}` : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-400">
                                        No history available.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

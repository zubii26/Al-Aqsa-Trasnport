'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, MapPin, Calendar, Clock, Phone, Navigation, CheckCircle, ChevronRight, User } from 'lucide-react';
import NotificationBell from '@/components/common/NotificationBell';
import Link from 'next/link';

interface Booking {
    id: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    name: string;
    driverStatus: string;
}

export default function DriverDashboard() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        fetchJobs();
        // Fetch driver status
        fetch('/api/auth/profile').then(res => res.json()).then(data => setIsOnline(data.user?.isOnline || false));
    }, []);

    const toggleStatus = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);
        try {
            await fetch('/api/driver/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isOnline: newStatus })
            });
        } catch (error) {
            console.error('Failed to update status', error);
            setIsOnline(!newStatus); // Revert
        }
    };

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/driver/jobs');
            if (res.status === 401) return router.push('/driver/login');
            const data = await res.json();
            setJobs(data.bookings || []);
            // Also update online status if returned
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/driver/login');
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        accepted: 'bg-blue-100 text-blue-700',
        en_route: 'bg-indigo-100 text-indigo-700',
        arrived: 'bg-purple-100 text-purple-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    const filteredJobs = jobs.filter(job => {
        const isCompleted = ['completed', 'cancelled'].includes(job.driverStatus);
        return activeTab === 'completed' ? isCompleted : !isCompleted;
    });

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 rounded-b-[30px] shadow-lg sticky top-0 z-10 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-xl font-bold mb-1">My Jobs</h1>
                        <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
                            <p className="text-slate-400 text-sm">{isOnline ? 'You represent Al Aqsa' : 'You are offline'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <button
                            onClick={() => router.push('/profile')}
                            className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                            title="My Profile"
                        >
                            <User size={20} />
                        </button>
                    </div>
                </div>

                {/* Status Toggle & Tabs Group */}
                <div className="space-y-4">
                    {/* Toggle Switch */}
                    <div className="bg-slate-800/50 p-2 rounded-xl backdrop-blur-sm flex items-center justify-between px-4">
                        <span className="text-sm font-medium text-slate-300">Availability</span>
                        <button
                            onClick={toggleStatus}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${isOnline ? 'bg-green-500' : 'bg-slate-600'}`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-slate-800/50 p-1 rounded-xl backdrop-blur-sm">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'active'
                                ? 'bg-amber-500 text-slate-900 shadow-lg'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'completed'
                                ? 'bg-amber-500 text-slate-900 shadow-lg'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            History
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="p-4 space-y-4">
                {filteredJobs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <CheckCircle className="mx-auto mb-3 text-slate-300" size={48} />
                        <p>No {activeTab} jobs found</p>
                    </div>
                ) : (
                    filteredJobs.map(job => (
                        <div
                            key={job.id}
                            className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 active:scale-[0.99] transition-transform"
                        >
                            <Link href={`/driver/jobs/${job.id}`} className="block">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${statusColors[job.driverStatus] || 'bg-slate-100 text-slate-600'}`}>
                                        {job.driverStatus.replace('_', ' ')}
                                    </span>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-slate-900 font-bold text-sm">
                                            <Clock size={14} className="text-amber-500" />
                                            {job.time}
                                        </div>
                                        <div className="text-xs text-slate-500">{job.date}</div>
                                    </div>
                                </div>

                                <div className="space-y-3 relative mb-4">
                                    {/* Route Line Graphic */}
                                    <div className="absolute left-[7px] top-[26px] bottom-[10px] w-0.5 bg-slate-200 border-l border-dashed border-slate-300" />

                                    <div className="relative pl-6">
                                        <div className="absolute left-0 top-1 w-3.5 h-3.5 border-2 border-amber-500 rounded-full bg-white" />
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Pickup</p>
                                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{job.pickup}</p>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute left-0 top-1 w-3.5 h-3.5 bg-amber-500 rounded-full shadow-sm" />
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Dropoff</p>
                                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{job.dropoff}</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Action Buttons */}
                            {!['completed', 'cancelled'].includes(job.driverStatus) && (
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                                    <a
                                        href={`https://wa.me/?text=Hello ${job.name}, I am your driver for Al Aqsa Transport. I am on my way.`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 rounded-xl font-medium text-sm hover:bg-green-100 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">W</div>
                                        WhatsApp
                                    </a>
                                    <Link
                                        href={`/driver/jobs/${job.id}`}
                                        className="flex items-center justify-center gap-2 py-2.5 bg-amber-50 text-amber-700 rounded-xl font-medium text-sm hover:bg-amber-100 transition-colors"
                                    >
                                        Details
                                        <ChevronRight size={16} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

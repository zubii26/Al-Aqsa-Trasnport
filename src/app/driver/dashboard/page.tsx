'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
    MapPin, Calendar, Clock, User, Phone,
    Navigation, CheckCircle2, CircleDashed, ArrowRight,
    LogOut,
    Loader2
} from 'lucide-react';

import { usePusher } from '@/hooks/usePusher';
import ShiftToggle from '@/components/driver/ShiftToggle';
import EarningsWidget from '@/components/driver/EarningsWidget';
import LocationTracker from '@/components/driver/LocationTracker';

interface Job {
    _id: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    passengers: number;
    status: string;
    driverStatus: string;
}

export default function DriverDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(false);
    const [userPhoto, setUserPhoto] = useState('/logo.png');

    // Real-time updates
    const pusherClient = usePusher();

    useEffect(() => {
        // Fetch User ID & Status
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUserId(data.user.id);
                    setIsOnline(data.user.isOnline);
                    if (data.user.photo) setUserPhoto(data.user.photo);
                }
            })
            .catch(err => console.error('Auth check failed', err));

        fetchJobs();
    }, []);

    // Listen for new assignments
    useEffect(() => {
        if (!pusherClient || !userId) return;

        const channel = pusherClient.subscribe(`driver-channel-${userId}`);
        channel.bind('booking-assigned', () => {
            fetchJobs();
            // Optional: sound or toast?
            if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
        });

        // Also listen for booking updates (e.g. cancelled) - Reuse same event or specific?
        // Let's listen to generic update too if we want
        channel.bind('booking-updated', () => {
            fetchJobs();
        });

        return () => {
            pusherClient.unsubscribe(`driver-channel-${userId}`);
        };
    }, [pusherClient, userId]);

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/driver/jobs');
            if (res.ok) {
                const data = await res.json();
                setJobs(data);
            }
        } catch (error) {
            console.error('Failed to fetch jobs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/driver/login');
    };

    const filteredJobs = jobs.filter(job => {
        const isCompleted = job.driverStatus === 'completed' || job.status === 'completed';
        return activeTab === 'completed' ? isCompleted : !isCompleted;
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Location Tracker */}
            <LocationTracker isOnline={isOnline} />

            {/* Header */}
            <div className="bg-slate-900 text-white p-6 rounded-b-3xl shadow-lg sticky top-0 z-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Driver Portal</h1>
                        <p className="text-slate-400 text-sm">Al Aqsa Transport</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
                    >
                        <LogOut size={20} className="text-red-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === 'active'
                            ? 'bg-amber-500 text-slate-900 shadow-md'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Active Jobs
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === 'completed'
                            ? 'bg-amber-500 text-slate-900 shadow-md'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        History
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                <ShiftToggle isOnline={isOnline} onToggle={setIsOnline} />
                <EarningsWidget />

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-amber-500" size={32} />
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4">
                            <CheckCircle2 size={32} className="text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-medium">No jobs found</p>
                    </div>
                ) : (
                    filteredJobs.map(job => (
                        <div
                            key={job._id}
                            onClick={() => router.push(`/driver/jobs/${job._id}`)}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform"
                        >
                            {/* Header: Date & Status */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <Calendar size={16} />
                                    <span className="font-medium text-slate-700">
                                        {format(new Date(job.date), 'EEE, dd MMM')}
                                    </span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="font-medium text-slate-700">{job.time}</span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${job.driverStatus === 'completed' ? 'bg-green-100 text-green-700' :
                                    job.driverStatus === 'en_route' ? 'bg-blue-100 text-blue-700' :
                                        job.driverStatus === 'arrived' ? 'bg-purple-100 text-purple-700' :
                                            'bg-amber-100 text-amber-700'
                                    }`}>
                                    {job.driverStatus?.replace('_', ' ') || job.status || 'Pending'}
                                </span>
                            </div>

                            {/* Route */}
                            <div className="space-y-4 mb-4">
                                <div className="flex gap-3 relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200"></div>

                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 bg-white z-10 mt-1 shrink-0"></div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-semibold uppercase mb-0.5">Pickup</p>
                                        <p className="text-slate-900 font-bold leading-tight">{job.pickup}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-900 bg-slate-900 z-10 mt-1 shrink-0"></div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-semibold uppercase mb-0.5">Dropoff</p>
                                        <p className="text-slate-900 font-bold leading-tight">{job.dropoff}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Passenger */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                        {job.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{job.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <User size={12} />
                                            {job.passengers} Passengers
                                        </div>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, Navigation, Clock, Calendar, ShieldCheck, User, Plane } from 'lucide-react';
import SwipeToConfirm from '@/components/driver/SwipeToConfirm';

interface Booking {
    id: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    vehicle: string;
    status: string;
    driverStatus: string;
    passengers: number;
    luggage: number;
    flightNumber?: string;
    notes?: string;
}

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [job, setJob] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        // Since we don't have a single job endpoint exposed to driver yet, reuse the dashboard logic or specific GET
        // But cleaner is to verify we can fetch by ID. The GET /api/bookings/[id] might be admin-only.
        // We should update the general booking API to allow 'driver' role if assigned.
        // Or fetch from the list array for now (quick) or better, fix API.
        // Let's assume we can fetch all and filtering, or we create a specific detail endpoint.
        // Actually, the best way in MVP is to just fetch the list and find it, OR update GET /api/booking/[id] to allow driver.
        // Since I can't easily modify the complex booking API right now without risk, I'll fetch ALL driver jobs and find the one.
        // Wait, I fetch /api/driver/jobs which returns all. Let's make an endpoint /api/driver/jobs/[id] via reusing current route logic?
        // No, let's just fetch all for now, it's efficient enough for 1 driver.

        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await fetch('/api/driver/jobs');
            if (res.status === 401) return router.push('/driver/login');
            const data = await res.json();
            const found = data.bookings.find((b: Booking) => b.id === id);
            if (found) setJob(found);
            else console.error('Job not found');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/driver/jobs/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setJob(prev => prev ? { ...prev, driverStatus: newStatus } : null);
            }
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading || !job) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
    );

    const getNextAction = () => {
        switch (job.driverStatus) {
            case 'pending': return { label: 'Accept Job', action: 'accepted', color: 'bg-blue-600' };
            case 'accepted': return { label: 'Start Trip (On Way)', action: 'en_route', color: 'bg-indigo-600' };
            case 'en_route': return { label: 'Arrived at Pickup', action: 'arrived', color: 'bg-purple-600' };
            case 'arrived': return { label: 'Complete Trip', action: 'completed', color: 'bg-green-600' };
            default: return null;
        }
    };

    const nextAction = getNextAction();

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Premium Header */}
            <div className="bg-slate-900 text-white p-6 pb-24 rounded-b-[40px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                            {job.driverStatus.replace('_', ' ')}
                        </div>
                    </div>

                    <div className="px-2">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Job Reference</p>
                        <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">#{job.id.slice(0, 8)}</h1>
                        <div className="flex items-center gap-4 text-sm text-slate-300">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-amber-500" />
                                <span>{job.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} className="text-amber-500" />
                                <span>{job.time}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area - Overlapping Cards */}
            <div className="px-4 -mt-12 relative z-20 space-y-4">

                {/* Route Card */}
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50" />

                    <div className="relative z-10">
                        <div className="flex gap-4">
                            {/* Visual Timeline */}
                            <div className="flex flex-col items-center pt-2">
                                <div className="w-4 h-4 rounded-full border-[3px] border-slate-900 bg-white shadow-sm z-10" />
                                <div className="w-0.5 flex-1 bg-gradient-to-b from-slate-900 via-slate-300 to-amber-500 opacity-30 min-h-[50px] my-1" />
                                <div className="w-4 h-4 rounded-full bg-amber-500 shadow-md shadow-amber-500/40 z-10" />
                            </div>

                            <div className="flex-1 space-y-8 pb-2">
                                {/* Pickup */}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Pickup Location</label>
                                    <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">{job.pickup}</h3>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.pickup)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                    >
                                        <Navigation size={12} />
                                        Navigate
                                    </a>
                                </div>

                                {/* Dropoff */}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Dropoff Location</label>
                                    <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">{job.dropoff}</h3>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.dropoff)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                    >
                                        <Navigation size={12} />
                                        Navigate
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Card */}
                <div className="bg-white rounded-3xl shadow-lg p-5 border border-slate-100">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 shadow-inner">
                            <User size={28} />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passenger</label>
                            <h3 className="text-xl font-bold text-slate-900">{job.name}</h3>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{job.passengers} Passengers</span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{job.luggage} Bags</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <a
                            href={`tel:${job.phone}`}
                            className="flex flex-col items-center justify-center gap-1 py-3 bg-emerald-50 text-emerald-700 rounded-2xl font-bold text-xs border border-emerald-100 shadow-sm active:scale-95 transition-all outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-emerald-600 mb-1">
                                <Phone size={16} />
                            </div>
                            Call Customer
                        </a>
                        <a
                            href={`https://wa.me/${job.phone?.replace(/[^0-9]/g, '')}?text=Hello ${job.name}, I am your driver from Al Aqsa Transport.`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col items-center justify-center gap-1 py-3 bg-green-50 text-green-700 rounded-2xl font-bold text-xs border border-green-100 shadow-sm active:scale-95 transition-all outline-none focus:ring-2 focus:ring-green-500/20"
                        >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-green-600 mb-1">
                                <span className="font-bold text-lg leading-none">W</span>
                            </div>
                            WhatsApp
                        </a>
                    </div>
                </div>

                {/* Additional Info Cards */}
                {(job.flightNumber || job.notes) && (
                    <div className="grid grid-cols-1 gap-4">
                        {job.flightNumber && (
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative overflow-hidden flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500">
                                    <Plane size={18} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Flight Number</label>
                                    <p className="font-bold text-slate-900">{job.flightNumber}</p>
                                </div>
                            </div>
                        )}
                        {job.notes && (
                            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 relative overflow-hidden flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-amber-500">
                                    <ShieldCheck size={18} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-amber-600/70 uppercase tracking-wider block mb-0.5">Special Notes</label>
                                    <p className="text-sm font-medium text-amber-900">{job.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sticky Action Footer */}
            {nextAction && (
                <div className="fixed bottom-0 left-0 right-0 p-6 pt-4 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 pb-8">
                    <div className="max-w-md mx-auto">
                        <SwipeToConfirm
                            onConfirm={() => updateStatus(nextAction.action)}
                            label={nextAction.label}
                            colorClass={nextAction.color}
                            isUpdating={updating}
                        />
                        <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-widest">
                            Slide to update status
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, Navigation, Clock, Calendar, ShieldCheck, User, Plane } from 'lucide-react';

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
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 pb-12 sticky top-0 z-10 shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold">Job #{job.id.slice(-6)}</h1>
                </div>

                {/* Status Badge */}
                <div className="mt-6 flex justify-center">
                    <span className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-sm font-bold uppercase tracking-wider shadow-sm">
                        {job.driverStatus.replace('_', ' ')}
                    </span>
                </div>
            </div>

            {/* Content Card (Overlapping Header) */}
            <div className="px-4 -mt-6">
                <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6">
                    {/* Route */}
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center pt-1">
                                <div className="w-4 h-4 rounded-full border-4 border-amber-500 bg-white shadow-sm" />
                                <div className="w-0.5 h-full bg-slate-200 border-l border-dashed border-slate-300 min-h-[40px] my-1" />
                                <div className="w-4 h-4 rounded-full bg-amber-500 shadow-sm" />
                            </div>
                            <div className="flex-1 space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pickup</label>
                                    <p className="font-semibold text-slate-900 leading-snug">{job.pickup}</p>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.pickup)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                                        <Navigation size={12} />
                                        Navigate
                                    </a>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dropoff</label>
                                    <p className="font-semibold text-slate-900 leading-snug">{job.dropoff}</p>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.dropoff)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                                        <Navigation size={12} />
                                        Navigate
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Passenger */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                            <User size={24} />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Passenger</label>
                            <p className="font-bold text-slate-900">{job.name}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                                <span>{job.passengers} pax</span>
                                <span>•</span>
                                <span>{job.luggage} bags</span>
                            </div>
                        </div>
                        <a href={`tel:${job.phone}`} className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors shadow-sm">
                            <Phone size={20} />
                        </a>
                    </div>

                    {/* Flight Info (Conditional) */}
                    {(job.flightNumber || job.notes) && (
                        <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                            {job.flightNumber && (
                                <div className="flex items-start gap-3">
                                    <Plane className="text-slate-400 mt-0.5" size={16} />
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Flight</label>
                                        <p className="text-sm font-semibold text-slate-900">{job.flightNumber}</p>
                                    </div>
                                </div>
                            )}
                            {job.notes && (
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="text-slate-400 mt-0.5" size={16} />
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Notes</label>
                                        <p className="text-sm text-slate-600">{job.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Action Footer */}
            {nextAction && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20">
                    <button
                        onClick={() => updateStatus(nextAction.action)}
                        disabled={updating}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-lg shadow-lg active:scale-95 transition-all ${nextAction.color} ${updating ? 'opacity-80' : 'hover:brightness-110'}`}
                    >
                        {updating ? 'Updating...' : nextAction.label}
                    </button>
                </div>
            )}
        </div>
    );
}

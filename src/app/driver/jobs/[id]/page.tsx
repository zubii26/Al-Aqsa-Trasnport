'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    MapPin, Phone, MessageCircle, Navigation,
    CheckCircle2, Loader2, ArrowLeft, Clock, CalendarDays,
    ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // React 19 / Next 15 unwrap
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await fetch('/api/driver/jobs'); // Determine how to fetch ONE using existing API or new logic?
            // Actually, we can fetch all and filtering, OR create GET /api/driver/jobs/[id]
            // For efficiency, let's just fetch all for now or creating `GET` in the dynamic route logic.
            // Wait, I didn't create GET in [id]/status, only POST.
            // Let's rely on filtering list for now since driver wont have 1000s jobs.
            // Or better: update fetch logic.

            // QUICK FIX: Since I made GET /api/driver/jobs logic, I can just use that if I don't want to make another GET.
            // BUT, a dedicated GET is better. Let's assume I create GET in the SAME file as existing API or...
            // Let's just create GET /api/driver/jobs/[id] separately.

            // Actually, better: use the list endpoint and find it client side for now to save a tool roundtrip
            // UNLESS the list endpoint paginates. It doesn't.

            const listRes = await fetch('/api/driver/jobs');
            if (listRes.ok) {
                const list = await listRes.json();
                const found = list.find((j: any) => j._id === id);
                if (found) setJob(found);
                else setJob(null); // Not found
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        setActionLoading(true);
        try {
            const res = await fetch(`/api/driver/jobs/${id}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                // Refresh data
                await fetchJob(); // Re-fetch list to get updated state
            }
        } catch (error) {
            console.error('Update failed', error);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin" /></div>;
    if (!job) return <div className="p-10 text-center">Job not found</div>;

    const isCompleted = job.driverStatus === 'completed';

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Nav */}
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
                    <ArrowLeft size={24} className="text-slate-700" />
                </button>
                <h1 className="text-lg font-bold">Job Details</h1>
                <span className="ml-auto text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                    #{job._id.slice(-6)}
                </span>
            </div>

            <div className="p-4 space-y-6">

                {/* Route Card */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <div className="space-y-6">
                        <div className="flex gap-4 relative">
                            <div className="flex flex-col items-center">
                                <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-white z-10"></div>
                                <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
                                <div className="w-4 h-4 rounded-full border-2 border-red-500 bg-white z-10"></div>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pickup From</label>
                                    <p className="text-lg font-bold text-slate-900 leading-tight mt-1">{job.pickup}</p>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.pickup)}`}
                                        target="_blank"
                                        className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold mt-2"
                                    >
                                        <Navigation size={14} /> Navigate
                                    </a>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Dropoff To</label>
                                    <p className="text-lg font-bold text-slate-900 leading-tight mt-1">{job.dropoff}</p>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.dropoff)}`}
                                        target="_blank"
                                        className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold mt-2"
                                    >
                                        <Navigation size={14} /> Navigate
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                            <CalendarDays size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-semibold">Date</p>
                            <p className="font-bold text-slate-900">{format(new Date(job.date), 'dd MMM')}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-semibold">Time</p>
                            <p className="font-bold text-slate-900">{job.time}</p>
                        </div>
                    </div>
                </div>

                {/* Passenger Info */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4 block">Passenger Info</label>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-bold">
                                {job.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-lg text-slate-900">{job.name}</p>
                                <p className="text-slate-500 text-sm">{job.passengers} Passengers</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <a
                            href={`tel:${job.phone}`}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition-colors"
                        >
                            <Phone size={18} /> Call
                        </a>
                        <a
                            href={`https://wa.me/${job.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 text-green-600 font-bold hover:bg-green-100 transition-colors"
                        >
                            <MessageCircle size={18} /> WhatsApp
                        </a>
                    </div>
                </div>

                {/* Status Controls */}
                {!isCompleted && (
                    <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100 fixed bottom-0 left-0 right-0 m-4 mb-6 z-20">
                        {(!job.driverStatus || job.driverStatus === 'pending' || job.driverStatus === 'accepted') && (
                            <button
                                onClick={() => updateStatus('en_route')}
                                disabled={actionLoading}
                                className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                            >
                                {actionLoading ? <Loader2 className="animate-spin" /> : 'Start Trip'}
                            </button>
                        )}

                        {job.driverStatus === 'en_route' && (
                            <button
                                onClick={() => updateStatus('arrived')}
                                disabled={actionLoading}
                                className="w-full py-4 bg-amber-500 text-white font-bold text-lg rounded-xl shadow-amber-200 hover:bg-amber-600 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                            >
                                {actionLoading ? <Loader2 className="animate-spin" /> : 'Arrived at Pickup'}
                            </button>
                        )}

                        {(job.driverStatus === 'arrived' || job.driverStatus === 'passenger_onboard') && (
                            <div className="space-y-3">
                                {job.driverStatus === 'arrived' && (
                                    <button
                                        onClick={() => updateStatus('passenger_onboard')}
                                        disabled={actionLoading}
                                        className="w-full py-4 bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                                    >
                                        {actionLoading ? <Loader2 className="animate-spin" /> : 'Passenger Onboard'}
                                    </button>
                                )}
                                <button
                                    onClick={() => updateStatus('completed')}
                                    disabled={actionLoading}
                                    className="w-full py-4 bg-green-600 text-white font-bold text-lg rounded-xl shadow-green-200 hover:bg-green-700 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 /> Complete Trip</>}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {isCompleted && (
                    <div className="bg-green-50 border border-green-100 p-6 rounded-3xl text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-green-900">Trip Completed</h3>
                        <p className="text-green-700 mt-1">Great job! This trip has been recorded.</p>
                        <button onClick={() => router.push('/driver/dashboard')} className="mt-6 text-green-700 font-bold underline">
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

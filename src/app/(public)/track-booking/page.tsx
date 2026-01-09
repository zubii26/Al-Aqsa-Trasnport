'use client';

import React, { useState } from 'react';
import { Search, MapPin, Calendar, User, Phone, CheckCircle, Clock, XCircle, AlertCircle, ArrowRight, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackBookingPage() {
    const [formData, setFormData] = useState({ reference: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [booking, setBooking] = useState<any>(null);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchBookingDetails = async (isBackground = false) => {
        if (!isBackground) {
            setLoading(true);
            setBooking(null);
        } else {
            setIsRefreshing(true);
        }
        setError('');

        try {
            const res = await fetch('/api/bookings/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setBooking(data.booking);
            } else {
                if (!isBackground) setError(data.message || 'Booking not found');
            }
        } catch (err) {
            if (!isBackground) setError('Failed to track booking. Please try again.');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetchBookingDetails(false);
    };

    // Real-time updates
    React.useEffect(() => {
        if (!booking || !booking.id) return;

        // Dynamic import to avoid SSR issues if any, though pusher-js is client safe
        const initPusher = async () => {
            const Pusher = (await import('pusher-js')).default;

            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            });

            const channel = pusher.subscribe(`booking-channel-${booking.id}`);
            channel.bind('status-updated', (data: any) => {
                console.log('Status update received:', data);
                fetchBookingDetails(true);
            });

            return () => {
                pusher.unsubscribe(`booking-channel-${booking.id}`);
                pusher.disconnect();
            };
        };

        const cleanupPromise = initPusher();

        return () => {
            cleanupPromise.then(cleanup => cleanup && cleanup());
        };
    }, [booking?.id]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
            case 'confirmed': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            case 'pending': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
            case 'cancelled': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            default: return 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-32 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl w-full"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Track Your Booking</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Enter your booking reference and email to see real-time updates.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                        {/* Decorative BG */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Booking Reference</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 64f8a..."
                                    className="w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700 focus:border-secondary transition-all"
                                    value={formData.reference}
                                    onChange={e => setFormData({ ...formData, reference: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700 focus:border-secondary transition-all"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Check Status <ArrowRight size={20} /></>
                                )}
                            </button>
                        </form>

                        <AnimatePresence mode='wait'>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400"
                                >
                                    <AlertCircle size={20} className="shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {booking && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="mt-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden"
                            >
                                {/* Results Header */}
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Booking Found</h3>
                                        <p className="text-xs text-slate-500 font-mono">ID: {booking.id}</p>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(booking.status)} capitalize flex items-center gap-2`}>
                                        {booking.status === 'completed' && <CheckCircle size={14} />}
                                        {booking.status === 'confirmed' && <CheckCircle size={14} />}
                                        {booking.status === 'pending' && <Clock size={14} />}
                                        {booking.status === 'cancelled' && <XCircle size={14} />}
                                        {booking.status}
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
                                    {/* Route */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col items-center pt-2">
                                            <div className="w-3 h-3 rounded-full bg-secondary" />
                                            <div className="w-0.5 h-12 bg-slate-200 dark:bg-slate-800 my-1" />
                                            <div className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white" />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup</p>
                                                <p className="font-bold text-slate-900 dark:text-white">{booking.pickup}</p>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(booking.date).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><Clock size={14} /> {booking.time}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</p>
                                                <p className="font-bold text-slate-900 dark:text-white">{booking.dropoff}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vehicle Info */}
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm text-slate-400">
                                            <Car size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Vehicle Type</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{booking.vehicle}</p>
                                            <p className="text-xs text-slate-500">{booking.passengers} Passengers · {booking.luggage || 0} Luggage</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}

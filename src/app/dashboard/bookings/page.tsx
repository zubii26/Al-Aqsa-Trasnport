
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, Calendar, MapPin, Car } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerBookingsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('/api/bookings/my');
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to fetch bookings');
                setBookings(data.bookings || []);
            } catch (err: any) {
                console.error(err);
                setError('Failed to load your bookings.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="animate-spin text-amber-600 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
                    <p className="text-slate-500 mt-1">Manage your upcoming and past trips</p>
                </div>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {!error && bookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-12 text-center text-slate-500">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Car className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings yet</h3>
                        <p className="mb-6">You haven't made any bookings with us yet.</p>
                        <Link
                            href="/booking"
                            className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
                        >
                            Book Your First Trip
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition hover:shadow-md">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                                            ${booking.status === 'confirmed' || booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-amber-100 text-amber-800'
                                            }
                                        `}>
                                            {booking.status}
                                        </span>
                                        <span className="text-slate-400 text-sm">#{booking._id.slice(-6).toUpperCase()}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {booking.pickup} <span className="text-slate-400 mx-2">→</span> {booking.dropoff}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={16} />
                                            {format(new Date(booking.date), 'MMMM do, yyyy')} at {booking.time}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Car size={16} />
                                            {booking.vehicle}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-xl font-bold text-slate-900">
                                        {booking.finalPrice || booking.price} <span className="text-sm font-normal text-slate-500">SAR</span>
                                    </div>
                                    {/* Future: Add 'View Details' or 'Download Receipt' buttons here */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

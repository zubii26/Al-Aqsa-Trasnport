'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePusher } from '@/hooks/usePusher';
import { Search, Filter, Calendar, MapPin, Car, Plus, Download } from 'lucide-react';
import { generateBookingInvoice } from '@/lib/pdf-generator';

export default function AgencyBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [userId, setUserId] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<any>(null);

    // Data Initialization
    useEffect(() => {
        const initData = async () => {
            try {
                const [bookingsRes, userRes] = await Promise.all([
                    fetch('/api/bookings'),
                    fetch('/api/auth/me')
                ]);

                if (bookingsRes.ok) {
                    const data = await bookingsRes.json();
                    setBookings(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                }
                if (userRes.ok) {
                    const userData = await userRes.json();
                    if (userData.user) {
                        setUserId(userData.user.userId || userData.user.id);
                        setUserProfile(userData.user);
                    }
                }
            } catch (error) {
                console.error('Failed to load data', error);
            } finally {
                setIsLoading(false);
            }
        };
        initData();
    }, []);

    // Pusher Subscription
    const pusher = usePusher();

    useEffect(() => {
        if (!pusher || !userId) return;

        const channel = pusher.subscribe(`agency-channel-${userId}`);

        channel.bind('booking-updated', (data: any) => {
            console.log('Realtime update:', data);
            setBookings(prev => prev.map(b =>
                b._id === data.id ? { ...b, ...data } : b
            ));
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [pusher, userId]);

    const filteredBookings = bookings.filter(b => {
        const matchesSearch =
            b._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.dropoff.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'accepted': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-emerald-100 text-emerald-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const handleDownloadInvoice = (booking: any) => {
        if (!userProfile) {
            alert('Agency profile not loaded');
            return;
        }
        generateBookingInvoice(booking, userProfile);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
                    <p className="text-slate-500">Manage and track all your transportation orders.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/agency/bulk-booking" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm">
                        <Plus size={18} />
                        Bulk Booking
                    </Link>
                    <Link href="/agency/booking" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors">
                        <Plus size={18} />
                        Single Booking
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, Location, or Passenger Name..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-colors ${statusFilter === status
                                    ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Booking ID</th>
                                <th className="px-6 py-3">Date & Time</th>
                                <th className="px-6 py-3">Route</th>
                                <th className="px-6 py-3">Vehicle</th>
                                <th className="px-6 py-3">Passengers</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Price</th>
                                <th className="px-6 py-3 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-6 py-4">
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-slate-500">
                                            #{booking._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <Calendar size={14} className="text-slate-400" />
                                                {booking.date} <span className="text-slate-400">|</span> {booking.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-700 font-medium">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    {booking.pickup}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                    {booking.dropoff}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2" title={booking.vehicle}>
                                                <Car size={16} className="text-slate-400" />
                                                <span className="truncate max-w-[150px]">{booking.vehicle}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold">
                                                {booking.passengers} Pax
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-900">
                                            {booking.finalPrice ? `SAR ${booking.finalPrice}` : booking.price}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDownloadInvoice(booking)}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                                                title="Download Invoice"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No bookings found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

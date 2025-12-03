'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import adminStyles from '../admin.module.css';
import { Search, Mail, Phone, MapPin, Calendar, Users, CheckCircle2, Check, X, Trash2 } from 'lucide-react';
import { Booking } from '@/lib/validations';
import { Toast } from '@/components/ui/Toast';

// Extend Booking type to include id and status if not in schema
interface BookingWithDetails extends Booking {
    id: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt?: string;
}

export default function BookingsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('/api/bookings');
                const data = await res.json();
                setBookings(data);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
                showToast('Failed to load bookings', 'error');
            } finally {
                setIsLoaded(true);
            }
        };
        fetchBookings();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === 'All' || booking.status === filter.toLowerCase();
        const matchesSearch =
            booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleStatusChange = async (id: string, newStatus: BookingWithDetails['status']) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
                showToast(`Booking marked as ${newStatus}`, 'success');
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            showToast('Failed to update booking status', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setBookings(bookings.filter(b => b.id !== id));
                showToast('Booking deleted successfully', 'success');
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete');
            }
        } catch (error) {
            console.error('Failed to delete booking:', error);
            showToast(error instanceof Error ? error.message : 'Failed to delete booking', 'error');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'completed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {toast && <Toast message={toast.message} type={toast.type} isVisible={true} onClose={() => setToast(null)} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className={adminStyles.title}>Bookings</h1>
                    <p className="text-muted-foreground mt-1">Manage and track all your fleet reservations</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === status
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className={adminStyles.glassCard}>
                <div className="overflow-x-auto">
                    <table className={adminStyles.table}>
                        <thead>
                            <tr>
                                <th>ID & Customer</th>
                                <th>Journey Details</th>
                                <th>Vehicle</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode='popLayout'>
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                <Calendar size={48} className="mb-4 opacity-20" />
                                                <p>No bookings found matching your criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <motion.tr
                                            key={booking.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group transition-colors"
                                        >
                                            <td>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-mono text-xs text-muted-foreground">#{booking.id.slice(0, 8)}</span>
                                                    <span className="font-medium">{booking.name}</span>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Mail size={12} /> {booking.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Phone size={12} /> {booking.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MapPin size={14} className="text-emerald-500" />
                                                        <span>{booking.pickup}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MapPin size={14} className="text-red-500" />
                                                        <span>{booking.dropoff}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                        <Calendar size={12} />
                                                        <span>{booking.date} at {booking.time}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium">{booking.vehicle}</span>
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Users size={12} /> {booking.passengers} Pax
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(booking.status)}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {booking.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                                                className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                                                                title="Confirm Booking"
                                                            >
                                                                <Check size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                                                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                                                title="Cancel Booking"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {booking.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => handleStatusChange(booking.id, 'completed')}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-xs font-medium transition-colors"
                                                            title="Mark as Completed"
                                                        >
                                                            <CheckCircle2 size={14} /> Complete
                                                        </button>
                                                    )}
                                                    {(booking.status === 'completed' || booking.status === 'cancelled') && (
                                                        <button
                                                            onClick={() => handleDelete(booking.id)}
                                                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                                            title="Delete Booking"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}

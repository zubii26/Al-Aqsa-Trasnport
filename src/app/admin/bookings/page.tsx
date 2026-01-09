'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import adminStyles from '../admin.module.css';
import { Search, Mail, Phone, MapPin, Calendar, Users, CheckCircle2, Check, X, Trash2, Briefcase, Download, LayoutList, Building2 } from 'lucide-react';
import { Booking } from '@/lib/validations';
import { Toast } from '@/components/ui/Toast';
import dynamic from 'next/dynamic';
import { downloadCSV } from '@/lib/export';
import { usePusher } from '@/hooks/usePusher';

import BookingDetailsModal from '@/components/admin/bookings/BookingDetailsModal';

const BookingCalendar = dynamic(() => import('@/components/admin/bookings/BookingCalendar'), { ssr: false });

// Extend Booking type to include id and status if not in schema
interface BookingWithDetails extends Omit<Booking, 'driverStatus'> {
    id: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    paymentStatus: 'paid' | 'unpaid' | 'refunded';
    createdAt?: string;
    rating?: number;
    review?: string;
}

export default function BookingsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [specificVehicle, setSpecificVehicle] = useState('All Vehicles');
    const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);

    // ... sortBookings function ...
    const sortBookings = (bookingsToSort: BookingWithDetails[]) => {
        return [...bookingsToSort].sort((a, b) => {
            // Priority 1: CreatedAt
            if (a.createdAt && b.createdAt) {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            // Priority 2: Booking Date + Time
            try {
                const dateA = new Date(`${a.date} ${a.time}`);
                const dateB = new Date(`${b.date} ${b.time}`);
                if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                    return dateB.getTime() - dateA.getTime();
                }
            } catch (e) {
                // Ignore parsing errors
            }
            return 0;
        });
    };

    useEffect(() => {
        loadData();
    }, []);

    // Pusher Subscription
    const pusher = usePusher();

    useEffect(() => {
        if (!pusher) return;

        const channel = pusher.subscribe('admin-channel');

        channel.bind('new-booking', (data: any) => {
            console.log('Real-time: New booking received', data);
            if (data.data) {
                const newBooking = {
                    ...data.data,
                    id: data.data.id,
                    status: data.data.status || 'pending',
                    paymentStatus: data.data.paymentStatus || 'unpaid',
                    createdAt: new Date().toISOString()
                };
                setBookings(prev => sortBookings([newBooking as any, ...prev]));
                showToast(`New booking from ${newBooking.name}`, 'success');
            }
        });

        channel.bind('booking-updated', (data: any) => {
            console.log('Real-time: Booking updated', data);
            setBookings(prev => prev.map(b =>
                b.id === data.id ? { ...b, ...data } : b
            ));
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [pusher]);

    const loadData = async () => {
        try {
            // Fetch bookings
            const bookingsRes = await fetch('/api/bookings');
            const bookingsData = await bookingsRes.json();

            setBookings(sortBookings(bookingsData));
        } catch (error) {
            console.error('Failed to fetch data:', error);
            showToast('Failed to load bookings', 'error');
        } finally {
            setIsLoaded(true);
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filter === 'All'
            ? true
            : booking.status === filter.toLowerCase();

        const matchesSearch =
            booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase());

        // Date Range Filter
        let matchesDate = true;
        if (startDate) {
            matchesDate = matchesDate && new Date(booking.date) >= new Date(startDate);
        }
        if (endDate) {
            matchesDate = matchesDate && new Date(booking.date) <= new Date(endDate);
        }

        // Vehicle Filter
        const matchesVehicle = specificVehicle === 'All Vehicles' ||
            (booking.vehicle && booking.vehicle === specificVehicle) ||
            (booking.selectedVehicles && booking.selectedVehicles.some(v => v.name === specificVehicle));

        return matchesStatus && matchesSearch && matchesDate && matchesVehicle;
    });

    // Extract unique vehicles for filter dropdown
    const uniqueVehicles = Array.from(new Set(bookings.flatMap(b => {
        if (b.selectedVehicles && b.selectedVehicles.length > 0) return b.selectedVehicles.map(v => v.name);
        return [b.vehicle];
    }).filter(Boolean))).sort();

    // Calendar Events Transformation
    const calendarEvents = bookings.map(booking => {
        try {
            // Combine date and time string to create a Date object
            // Assuming format is YYYY-MM-DD and HH:mm
            const startDateTime = new Date(`${booking.date}T${booking.time}`);

            // Default duration 3 hours if not specified, or calculate based on service
            const endDateTime = new Date(startDateTime.getTime() + (3 * 60 * 60 * 1000));

            return {
                id: booking.id,
                title: `${booking.name} (${booking.vehicle})`,
                start: startDateTime,
                end: endDateTime,
                resource: booking,
            };
        } catch (e) {
            return null;
        }
    }).filter(Boolean) as any[]; // Type assertion for now

    const handlePaymentStatusChange = async (id: string, newStatus: BookingWithDetails['paymentStatus']) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentStatus: newStatus }),
            });
            if (res.ok) {
                setBookings(bookings.map(b => b.id === id ? { ...b, paymentStatus: newStatus } : b));
                showToast(`Payment marked as ${newStatus}`, 'success');
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Failed to update payment status:', error);
            showToast('Failed to update payment status', 'error');
        }
    };

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

    const handleExportCSV = () => {
        const exportData = filteredBookings.map(b => {
            // Extract vehicle names safely
            const vehiclesStr = b.selectedVehicles?.map(v => `${v.name} (x${v.quantity})`).join('; ') || b.vehicle || 'Unknown';

            return {
                'Booking ID': b.id,
                'Date': b.date,
                'Time': b.time,
                'Name': b.name,
                'Email': b.email,
                'Phone': b.phone,
                'Pickup': b.pickup,
                'Dropoff': b.dropoff,
                'Vehicles': vehiclesStr,
                'Passengers': b.passengers || 0,
                'Status': b.status,
                'Price': b.finalPrice || b.originalPrice || '',
                'Flight': b.flightNumber || '',
                'Arrival': b.arrivalDate || ''
            };
        });

        downloadCSV(exportData, `bookings_export_${new Date().toISOString().split('T')[0]}`);
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
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                    >
                        <LayoutList size={18} /> List
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'calendar'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                    >
                        <Calendar size={18} /> Calendar
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
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

                    {/* Date Range Inputs */}
                    <div className="flex gap-2">
                        <div className="relative">
                            <input
                                type="date"
                                className="pl-3 pr-2 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                title="Start Date"
                            />
                        </div>
                        <span className="self-center text-muted-foreground">-</span>
                        <div className="relative">
                            <input
                                type="date"
                                className="pl-3 pr-2 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                title="End Date"
                            />
                        </div>
                    </div>

                    {/* Vehicle Filter */}
                    <select
                        value={specificVehicle}
                        onChange={(e) => setSpecificVehicle(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer max-w-[200px]"
                    >
                        <option value="All Vehicles">All Vehicles</option>
                        {uniqueVehicles.map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 border-t border-border pt-4">
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
                    <div className="flex-1"></div>
                    <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                        title="Export to CSV"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className={adminStyles.glassCard}>
                {viewMode === 'list' ? (
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
                                                className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                                                onClick={() => setSelectedBooking(booking)}
                                            >
                                                <td>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-mono text-xs text-muted-foreground">#{booking.id.slice(0, 8)}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{booking.name}</span>
                                                        </div>
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
                                                        {booking.selectedVehicles && booking.selectedVehicles.length > 0 ? (
                                                            <div className="flex flex-col gap-1">
                                                                {booking.selectedVehicles.map((sv, i) => (
                                                                    <span key={i} className="font-medium">
                                                                        {sv.name || 'Vehicle'} <span className="text-xs text-muted-foreground">x{sv.quantity}</span>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="font-medium">{booking.vehicle} <span className="text-xs text-muted-foreground">x{booking.vehicleCount || 1}</span></span>
                                                        )}

                                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Users size={12} /> {booking.passengers}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Briefcase size={12} /> {booking.luggage || 0}
                                                            </span>
                                                        </div>
                                                        {booking.notes && (
                                                            <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded mt-1 break-words max-w-[200px]">
                                                                {booking.notes}
                                                            </div>
                                                        )}
                                                        {/* Display Country, Flight, Arrival if present */}
                                                        {(booking.country || booking.flightNumber || booking.arrivalDate) && (
                                                            <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500">
                                                                {booking.country && <div>Country: {booking.country}</div>}
                                                                {booking.flightNumber && <div>Flight: {booking.flightNumber}</div>}
                                                                {booking.arrivalDate && <div>Arrival: {booking.arrivalDate}</div>}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(booking.status)}`}>
                                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                    </span>
                                                    {booking.rating && (
                                                        <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                                                            <span>⭐ {booking.rating}/5</span>
                                                        </div>
                                                    )}

                                                    {/* Payment Status Toggle */}
                                                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                                                        <select
                                                            value={booking.paymentStatus || 'unpaid'}
                                                            onChange={(e) => handlePaymentStatusChange(booking.id, e.target.value as any)}
                                                            className={`text-[10px] font-bold uppercase border rounded px-1.5 py-0.5 outline-none cursor-pointer ${booking.paymentStatus === 'paid'
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                : 'bg-slate-50 text-slate-500 border-slate-200'
                                                                }`}
                                                        >
                                                            <option value="unpaid">Unpaid</option>
                                                            <option value="paid">Paid</option>
                                                            <option value="refunded">Refunded</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td className="text-right">
                                                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
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
                ) : (
                    <div className="p-4">
                        <BookingCalendar
                            events={calendarEvents}
                            onSelectEvent={(event) => {
                                setSelectedBooking(event.resource);
                            }}
                        />
                    </div>
                )}
            </div>

            <BookingDetailsModal
                booking={selectedBooking}
                isOpen={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
                onStatusUpdate={(id, status) => {
                    handleStatusChange(id, status);
                    setSelectedBooking(null); // Close modal after update
                }}
                onUpdate={(id, updates) => {
                    setBookings(bookings.map(b => b.id === id ? { ...b, ...updates } : b));
                    if (selectedBooking && selectedBooking.id === id) {
                        setSelectedBooking(prev => prev ? { ...prev, ...updates } : null);
                    }
                    showToast('Booking updated successfully', 'success');
                }}
            />
        </div>
    );
}

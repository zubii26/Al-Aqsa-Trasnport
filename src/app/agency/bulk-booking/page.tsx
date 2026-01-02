'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Save, ArrowLeft, Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Toast } from '@/components/ui/Toast';

interface BookingRow {
    id: number;
    routeId?: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    vehicleId: string;
    quantity: number;
    passengers: number;
    luggage: number;
    notes: string;
}

export default function BulkBookingPage() {
    const router = useRouter();
    const [rows, setRows] = useState<BookingRow[]>([
        { id: 1, routeId: 'custom', pickup: '', dropoff: '', date: '', time: '12:00', vehicleId: '', quantity: 1, passengers: 1, luggage: 0, notes: '' }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [routes, setRoutes] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/pricing');
                if (res.ok) {
                    const data = await res.json();
                    setRoutes(data.routes || []);
                    setVehicles(data.vehicles || []);
                }
            } catch (error) {
                console.error('Failed to load form data', error);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const addRow = () => {
        setRows([...rows, {
            id: Date.now(),
            pickup: '',
            dropoff: '',
            date: '',
            time: '12:00',
            vehicleId: vehicles[0]?.id || '',
            quantity: 1,
            passengers: 1,
            luggage: 0,
            notes: ''
        }]);
    };

    const removeRow = (id: number) => {
        if (rows.length === 1) return;
        setRows(rows.filter(r => r.id !== id));
    };

    const updateRow = (id: number, field: keyof BookingRow, value: any) => {
        setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    // Helper to find route ID based on pickup/dropoff matches (simplified)
    const findRouteId = (pickup: string, dropoff: string) => {
        // This is a simplified check. In a real app, you'd probably use a dropdown for Routes directly 
        // OR have the backend handle fuzzy matching. 
        // For now, we'll try to find an exact match in our loaded routes.
        const route = routes.find(r =>
            (r.origin.toLowerCase().includes(pickup.toLowerCase()) && r.destination.toLowerCase().includes(dropoff.toLowerCase())) ||
            (r.origin.toLowerCase().includes(dropoff.toLowerCase()) && r.destination.toLowerCase().includes(pickup.toLowerCase())) // bi-directional check might be needed
        );
        return route?.id;
    };

    const handleSubmit = async () => {
        // Validate
        const isValid = rows.every(r => r.pickup && r.dropoff && r.date && r.vehicleId);
        if (!isValid) {
            setToast({ message: 'Please fill in all required fields (Pickup, Dropoff, Date, Vehicle)', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        try {
            // Prepare payload
            const bookingsPayload = rows.map(r => ({
                ...r,
                routeId: findRouteId(r.pickup, r.dropoff) // Try to attach route ID for auto-pricing
            }));

            const res = await fetch('/api/bookings/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookings: bookingsPayload }),
            });

            if (res.ok) {
                const data = await res.json();
                setToast({ message: `Successfully created ${data.count} bookings!`, type: 'success' });
                setTimeout(() => router.push('/agency/dashboard'), 2000);
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            setToast({ message: 'Failed to submit bulk bookings', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {toast && <Toast message={toast.message} type={toast.type} isVisible={true} onClose={() => setToast(null)} />}

            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/agency/dashboard" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-slate-900">Bulk Booking</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={addRow}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <Plus size={18} /> Add Row
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-70"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Submit All
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 w-[50px]">#</th>
                                    <th className="px-4 py-3 min-w-[200px]">Journey</th>
                                    <th className="px-4 py-3 min-w-[180px]">Date & Time</th>
                                    <th className="px-4 py-3 min-w-[200px]">Vehicle & Qty</th>
                                    <th className="px-4 py-3 min-w-[150px]">Details</th>
                                    <th className="px-4 py-3 min-w-[200px]">Notes</th>
                                    <th className="px-4 py-3 w-[50px]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rows.map((row, index) => (
                                    <tr key={row.id} className="group hover:bg-slate-50/50">
                                        <td className="px-4 py-3 text-slate-400 font-mono">{index + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    className="w-full px-3 py-1.5 rounded border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium text-slate-700"
                                                    value={row.routeId || 'custom'}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === 'custom') {
                                                            updateRow(row.id, 'routeId', 'custom');
                                                            updateRow(row.id, 'pickup', '');
                                                            updateRow(row.id, 'dropoff', '');
                                                        } else {
                                                            const selectedRoute = routes.find(r => r.id === val || r._id === val);
                                                            if (selectedRoute) {
                                                                updateRow(row.id, 'routeId', val);
                                                                updateRow(row.id, 'pickup', selectedRoute.origin);
                                                                updateRow(row.id, 'dropoff', selectedRoute.destination);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <option value="custom">Custom Journey</option>
                                                    {routes.map(r => (
                                                        <option key={r.id || r._id} value={r.id || r._id}>
                                                            {r.name || `${r.origin} ➝ ${r.destination}`}
                                                        </option>
                                                    ))}
                                                </select>

                                                {(row.routeId === 'custom' || !row.routeId) && (
                                                    <>
                                                        <input
                                                            type="text"
                                                            placeholder="Pickup Location"
                                                            className="w-full px-3 py-1.5 rounded border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            value={row.pickup}
                                                            onChange={(e) => updateRow(row.id, 'pickup', e.target.value)}
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Dropoff Location"
                                                            className="w-full px-3 py-1.5 rounded border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            value={row.dropoff}
                                                            onChange={(e) => updateRow(row.id, 'dropoff', e.target.value)}
                                                        />
                                                    </>
                                                )}
                                                {row.routeId !== 'custom' && row.routeId && (
                                                    <div className="text-xs text-slate-500 px-1">
                                                        {row.pickup} <span className="text-slate-300 mx-1">➝</span> {row.dropoff}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    type="date"
                                                    className="w-full px-3 py-1.5 rounded border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    value={row.date}
                                                    onChange={(e) => updateRow(row.id, 'date', e.target.value)}
                                                />
                                                <input
                                                    type="time"
                                                    className="w-full px-3 py-1.5 rounded border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    value={row.time}
                                                    onChange={(e) => updateRow(row.id, 'time', e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    className="w-full px-3 py-1.5 rounded border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                                    value={row.vehicleId}
                                                    onChange={(e) => updateRow(row.id, 'vehicleId', e.target.value)}
                                                >
                                                    <option value="">Select Vehicle</option>
                                                    {vehicles.map(v => (
                                                        <option key={v.id || v._id} value={v.id || v._id}>
                                                            {v.name} ({v.capacity || `${v.passengers} Pax`})
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500">Qty:</span>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        className="w-20 px-3 py-1.5 rounded border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                        value={row.quantity}
                                                        onChange={(e) => updateRow(row.id, 'quantity', parseInt(e.target.value) || 1)}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500 w-12">Pax:</span>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        className="w-full px-3 py-1.5 rounded border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                        value={row.passengers}
                                                        onChange={(e) => updateRow(row.id, 'passengers', parseInt(e.target.value) || 1)}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500 w-12">Bags:</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="w-full px-3 py-1.5 rounded border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                        value={row.luggage}
                                                        onChange={(e) => updateRow(row.id, 'luggage', parseInt(e.target.value) || 0)}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <textarea
                                                placeholder="Flight details, names, etc."
                                                className="w-full h-[88px] px-3 py-1.5 rounded border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none text-sm"
                                                value={row.notes}
                                                onChange={(e) => updateRow(row.id, 'notes', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {rows.length > 1 && (
                                                <button
                                                    onClick={() => removeRow(row.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    title="Remove Row"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {rows.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No bookings added. Click "Add Row" to start.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

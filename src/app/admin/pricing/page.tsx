'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, Search, RotateCcw } from 'lucide-react';
import styles from '../admin.module.css';
import { Toast } from '@/components/ui/Toast';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';

interface Route {
    id: string;
    origin: string;
    destination: string;
}

interface Vehicle {
    id: string;
    name: string;
}

interface RoutePrice {
    routeId: string;
    vehicleId: string;
    price: number;
}

// Memoized Cell Component to prevent table re-renders on typing
const PriceCell = memo(({
    routeId,
    vehicleId,
    initialValue,
    onSave,
    isModified
}: {
    routeId: string;
    vehicleId: string;
    initialValue: number;
    onSave: (routeId: string, vehicleId: string, value: number) => void;
    isModified: boolean;
}) => {
    const [value, setValue] = useState(initialValue.toString());

    // Sync with external changes if needed (e.g. after save)
    useEffect(() => {
        setValue(initialValue.toString());
    }, [initialValue]);

    const handleBlur = () => {
        const numValue = parseFloat(value) || 0;
        if (numValue !== initialValue) {
            onSave(routeId, vehicleId, numValue);
        }
    };

    return (
        <td className="p-3 border-b border-border text-center">
            <div className="relative group">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleBlur}
                    className={`w-20 text-center bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-all ${isModified ? 'text-amber-500 font-bold' : 'text-foreground'
                        }`}
                />
                {isModified && (
                    <div className="absolute -top-2 -right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                )}
            </div>
        </td>
    );
});

PriceCell.displayName = 'PriceCell';

export default function PricingPage() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [modified, setModified] = useState<Record<string, boolean>>({});
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

    useEffect(() => {
        fetchData();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = async () => {
        try {
            const [routesRes, vehiclesRes, pricesRes] = await Promise.all([
                fetch('/api/admin/routes'),
                fetch('/api/admin/fleet'),
                fetch('/api/admin/pricing')
            ]);

            const routesData = await routesRes.json();
            const vehiclesData = await vehiclesRes.json();
            const pricesData = await pricesRes.json();

            setRoutes(routesData);
            setVehicles(vehiclesData);

            const priceMap: Record<string, number> = {};
            pricesData.forEach((p: RoutePrice) => {
                priceMap[`${p.routeId}-${p.vehicleId}`] = p.price;
            });
            setPrices(priceMap);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            showToast('Failed to load pricing data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCellSave = useCallback((routeId: string, vehicleId: string, newValue: number) => {
        const key = `${routeId}-${vehicleId}`;
        setPrices(prev => ({
            ...prev,
            [key]: newValue
        }));
        setModified(prev => ({ ...prev, [key]: true }));
    }, []);

    const handleReset = () => {
        if (Object.keys(modified).length === 0) return;

        setConfirmDialog({
            isOpen: true,
            title: 'Discard Changes',
            message: 'Are you sure you want to discard all unsaved changes?',
            onConfirm: () => {
                setModified({});
                fetchData(); // Refetch to reset values
                showToast('Changes discarded', 'success');
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            const promises = Object.entries(prices).map(([key, price]) => {
                // Only save modified prices
                if (!modified[key]) return Promise.resolve();

                const [routeId, vehicleId] = key.split('-');
                return fetch('/api/admin/pricing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ routeId, vehicleId, price }),
                });
            });
            await Promise.all(promises);
            setModified({});
            showToast('All changes saved successfully!', 'success');
        } catch (error) {
            console.error('Failed to save all prices:', error);
            showToast('Error saving prices', 'error');
        } finally {
            setSaving(false);
        }
    };

    const filteredRoutes = routes.filter(route =>
        route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center">Loading pricing data...</div>;

    return (
        <div className="p-6 max-w-[95%] mx-auto">
            {toast && <Toast message={toast.message} type={toast.type} isVisible={true} onClose={() => setToast(null)} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className={styles.title}>Price Management</h1>
                    <p className="text-muted-foreground">Manage dynamic pricing for routes and vehicles</p>
                </div>
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search routes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-full focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
                    />
                </div>

                {Object.keys(modified).length > 0 && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2.5 rounded-full font-bold hover:bg-slate-200 transition-colors"
                    >
                        <RotateCcw size={18} />
                        Reset
                    </button>
                )}

                <button
                    onClick={handleSaveAll}
                    disabled={saving || Object.keys(modified).length === 0}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-6 py-2.5 rounded-full font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>


            <div className={styles.glassCard}>
                <div className="overflow-x-auto max-h-[calc(100vh-250px)] relative">
                    <table className={styles.table}>
                        <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm">
                            <tr>
                                <th className="bg-slate-50/90 min-w-[200px] p-4 text-left font-bold text-muted-foreground border-b border-border">
                                    Route / Vehicle
                                </th>
                                {vehicles.map(vehicle => (
                                    <th key={vehicle.id} className="text-center min-w-[150px] p-4 border-b border-border bg-slate-50/90">
                                        <div className="font-bold text-foreground">{vehicle.name}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoutes.map(route => (
                                <tr key={route.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="font-medium p-4 border-b border-border bg-slate-50/10 sticky left-0 backdrop-blur-[2px]">
                                        <div className="flex flex-col">
                                            <span className="text-foreground font-semibold">{route.origin}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                to <span className="font-medium text-foreground">{route.destination}</span>
                                            </span>
                                        </div>
                                    </td>
                                    {vehicles.map(vehicle => {
                                        const key = `${route.id}-${vehicle.id}`;
                                        return (
                                            <PriceCell
                                                key={vehicle.id}
                                                routeId={route.id}
                                                vehicleId={vehicle.id}
                                                initialValue={prices[key] || 0}
                                                onSave={handleCellSave}
                                                isModified={!!modified[key]}
                                            />
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredRoutes.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">
                            No routes found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>

            <AdminConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                isDestructive={true}
            />
        </div >
    );
}

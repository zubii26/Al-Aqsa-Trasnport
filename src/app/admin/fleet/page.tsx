'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Plus, Trash2, Users, Briefcase, Check, X, Edit, Search } from 'lucide-react';
import styles from '../admin.module.css';
import { Toast } from '@/components/ui/Toast';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';

interface Vehicle {
    id: string;
    name: string;
    image: string;
    passengers: number;
    luggage: number;
    features: string[];
    price: string;
    hourlyRate?: string;
    category: string;
    isActive: boolean;
}

export default function FleetPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

    const [formData, setFormData] = useState({
        name: '',
        image: '',
        passengers: 4,
        luggage: 2,
        features: [] as string[],
        price: '',
        hourlyRate: '',
        category: 'Standard',
        isActive: true
    });
    const [featureInput, setFeatureInput] = useState('');

    useEffect(() => {
        fetchVehicles();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchVehicles = async () => {
        try {
            const res = await fetch('/api/admin/fleet');
            const data = await res.json();
            setVehicles(data);
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
            showToast('Failed to load vehicles', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (vehicle: Vehicle) => {
        setEditingId(vehicle.id);
        setFormData({
            name: vehicle.name,
            image: vehicle.image,
            passengers: vehicle.passengers,
            luggage: vehicle.luggage,
            features: vehicle.features,
            price: vehicle.price,
            hourlyRate: vehicle.hourlyRate || '',
            category: vehicle.category,
            isActive: vehicle.isActive
        });
        setShowModal(true);
    };

    const handleSaveVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = '/api/admin/fleet';
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...formData, id: editingId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setShowModal(false);
                fetchVehicles();
                resetForm();
                showToast(`Vehicle ${editingId ? 'updated' : 'added'} successfully`, 'success');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Failed to save vehicle:', error);
            showToast('Failed to save vehicle', 'error');
        }
    };

    const handleDelete = (id: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Vehicle',
            message: 'Are you sure you want to delete this vehicle? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin/fleet?id=${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        fetchVehicles();
                        showToast('Vehicle deleted successfully', 'success');
                    } else {
                        throw new Error('Failed to delete');
                    }
                } catch (error) {
                    console.error('Failed to delete vehicle:', error);
                    showToast('Failed to delete vehicle', 'error');
                } finally {
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            image: '',
            passengers: 4,
            luggage: 2,
            features: [],
            price: '',
            hourlyRate: '',
            category: 'Standard',
            isActive: true
        });
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, featureInput.trim()]
            }));
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const filteredVehicles = vehicles.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || v.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Standard', 'Premium', 'VIP', 'Bus'];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {toast && <Toast message={toast.message} type={toast.type} isVisible={true} onClose={() => setToast(null)} />}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className={styles.title}>Fleet Management</h1>
                    <p className="text-muted-foreground mt-1">Manage your vehicle collection, pricing, and availability</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Add Vehicle
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search vehicles..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                </div>
                <div className="flex gap-2">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Vehicle Grid */}
            {
                loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-card/50 animate-pulse rounded-2xl border border-border" />
                        ))}
                    </div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="text-center py-20 bg-card/30 rounded-2xl border border-dashed border-border">
                        <Car className="mx-auto text-muted-foreground mb-4 opacity-50" size={48} />
                        <h3 className="text-xl font-semibold text-foreground">No vehicles found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode='popLayout'>
                            {filteredVehicles.map((vehicle) => (
                                <motion.div
                                    key={vehicle.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`${styles.glassCard} group hover:border-amber-500/50 transition-colors`}
                                >
                                    <div className="relative h-52 mb-4 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        <img
                                            src={vehicle.image || '/placeholder-car.png'}
                                            alt={vehicle.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${vehicle.isActive
                                                ? 'bg-emerald-500/90 text-white'
                                                : 'bg-red-500/90 text-white'
                                                }`}>
                                                {vehicle.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4 gap-2">
                                            <button
                                                onClick={() => handleEdit(vehicle)}
                                                className="p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(vehicle.id)}
                                                className="p-2 bg-red-500/80 backdrop-blur-md hover:bg-red-600/90 text-white rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground line-clamp-1">{vehicle.name}</h3>
                                                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded">
                                                    {vehicle.category}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-lg text-amber-500">{vehicle.price}</div>
                                                {vehicle.hourlyRate && (
                                                    <div className="text-xs text-muted-foreground">{vehicle.hourlyRate}/hr</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                                            <div className="flex items-center gap-1.5">
                                                <Users size={16} className="text-amber-500" />
                                                <span>{vehicle.passengers} Pax</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase size={16} className="text-amber-500" />
                                                <span>{vehicle.luggage} Bags</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {vehicle.features.slice(0, 3).map((feature, i) => (
                                                <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300">
                                                    {feature}
                                                </span>
                                            ))}
                                            {vehicle.features.length > 3 && (
                                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300">
                                                    +{vehicle.features.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )
            }

            {/* Add/Edit Modal */}
            {
                showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card text-card-foreground border border-border rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-8 relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
                                {editingId ? <Edit className="text-amber-500" /> : <Plus className="text-amber-500" />}
                                {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
                            </h2>

                            <form onSubmit={handleSaveVehicle} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle Name</label>
                                        <input
                                            required
                                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. GMC Yukon 2024"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                                        <select
                                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {categories.filter(c => c !== 'All').map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Image URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            required
                                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="https://..."
                                        />
                                        {formData.image && (
                                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Passengers</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                            value={formData.passengers}
                                            onChange={e => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Luggage</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                            value={formData.luggage}
                                            onChange={e => setFormData({ ...formData, luggage: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Base Price</label>
                                        <input
                                            required
                                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="SAR 150"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hourly Rate</label>
                                        <input
                                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                            value={formData.hourlyRate}
                                            onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                                            placeholder="SAR 50/hr"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Features</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                            value={featureInput}
                                            onChange={e => setFeatureInput(e.target.value)}
                                            placeholder="Add a feature (e.g. Free WiFi)"
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addFeature}
                                            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2 min-h-[2.5rem] p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
                                        {formData.features.length === 0 && (
                                            <span className="text-sm text-slate-400 italic">No features added yet</span>
                                        )}
                                        {formData.features.map((feature, index) => (
                                            <span key={index} className="flex items-center gap-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1 rounded-full text-sm shadow-sm animate-in fade-in zoom-in duration-200 text-slate-700 dark:text-slate-200">
                                                {feature}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeature(index)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors ml-1"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 checked:border-amber-500 checked:bg-amber-500 transition-all"
                                        />
                                        <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <label htmlFor="isActive" className="text-sm font-medium cursor-pointer select-none text-slate-700 dark:text-slate-300">
                                        Vehicle is Active and Visible to Customers
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                                    >
                                        {editingId ? 'Save Changes' : 'Add Vehicle'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
            }

            <AdminConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                isDestructive
            />
        </div >
    );
}

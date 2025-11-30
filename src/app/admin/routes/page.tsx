'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, Search, Clock, Navigation, Edit, X } from 'lucide-react';
import styles from '../admin.module.css';
import { Toast } from '@/components/ui/Toast';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';

interface Route {
    id: string;
    origin: string;
    destination: string;
    distance: string;
    duration: string;
    category: string;
}

export default function RoutesPage() {
    const [routes, setRoutes] = useState<Route[]>([]);
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
        origin: '',
        destination: '',
        distance: '',
        duration: '',
        category: 'Intercity'
    });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchRoutes = async () => {
        try {
            const res = await fetch('/api/admin/routes');
            const data = await res.json();
            setRoutes(data);
        } catch (error) {
            console.error('Failed to fetch routes:', error);
            showToast('Failed to load routes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (route: Route) => {
        setEditingId(route.id);
        setFormData({
            origin: route.origin,
            destination: route.destination,
            distance: route.distance,
            duration: route.duration,
            category: route.category
        });
        setShowModal(true);
    };

    const handleSaveRoute = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = '/api/admin/routes';
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...formData, id: editingId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setShowModal(false);
                fetchRoutes();
                resetForm();
                showToast(`Route ${editingId ? 'updated' : 'created'} successfully`, 'success');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Failed to save route:', error);
            showToast('Failed to save route', 'error');
        }
    };

    const handleDelete = (id: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Route',
            message: 'Are you sure you want to delete this route? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin/routes?id=${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        fetchRoutes();
                        showToast('Route deleted successfully', 'success');
                    } else {
                        throw new Error('Failed to delete');
                    }
                } catch (error) {
                    console.error('Failed to delete route:', error);
                    showToast('Failed to delete route', 'error');
                } finally {
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            origin: '',
            destination: '',
            distance: '',
            duration: '',
            category: 'Intercity'
        });
    };

    const filteredRoutes = routes.filter(r => {
        const matchesSearch =
            r.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.destination.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || r.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Intercity', 'Airport', 'Ziarat'];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {toast && <Toast message={toast.message} type={toast.type} isVisible={true} onClose={() => setToast(null)} />}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className={styles.title}>Route Management</h1>
                    <p className="text-muted-foreground mt-1">Manage transport routes, distances, and durations</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Add Route
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search origin or destination..."
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

            {/* Routes Table/Grid */}
            <div className={styles.glassCard}>
                <div className="overflow-x-auto">
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Origin</th>
                                <th>Destination</th>
                                <th>Distance</th>
                                <th>Duration</th>
                                <th>Category</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode='popLayout'>
                                {filteredRoutes.map((route) => (
                                    <motion.tr
                                        key={route.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="group transition-colors"
                                    >
                                        <td className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                {route.origin}
                                            </div>
                                        </td>
                                        <td className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-muted-foreground" />
                                                {route.destination}
                                            </div>
                                        </td>
                                        <td className="text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Navigation size={16} />
                                                {route.distance}
                                            </div>
                                        </td>
                                        <td className="text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                {route.duration}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${route.category === 'Airport' ? 'bg-blue-500/10 text-blue-500' :
                                                route.category === 'Ziarat' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                {route.category}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(route)}
                                                    className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(route.id)}
                                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredRoutes.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search size={32} className="opacity-20" />
                                            <p>No routes found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card text-card-foreground border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
                                {editingId ? <Edit className="text-amber-500" /> : <Plus className="text-amber-500" />}
                                {editingId ? 'Edit Route' : 'Add New Route'}
                            </h2>

                            <form onSubmit={handleSaveRoute} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Origin</label>
                                        <input
                                            required
                                            className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                            value={formData.origin}
                                            onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                            placeholder="e.g. Makkah"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Destination</label>
                                        <input
                                            required
                                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                            value={formData.destination}
                                            onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                            placeholder="e.g. Madinah"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Distance</label>
                                        <input
                                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                            value={formData.distance}
                                            onChange={e => setFormData({ ...formData, distance: e.target.value })}
                                            placeholder="e.g. 450 km"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Duration</label>
                                        <input
                                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                            placeholder="e.g. 4.5 hours"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                                    <select
                                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Intercity">Intercity Transfer</option>
                                        <option value="Airport">Airport Transfer</option>
                                        <option value="Ziarat">Ziarat Tour</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                                    >
                                        {editingId ? 'Save Changes' : 'Create Route'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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

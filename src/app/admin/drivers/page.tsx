'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, Star } from 'lucide-react';
import styles from '../admin.module.css';
import { Toast } from '@/components/ui/Toast';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';

interface Driver {
    _id: string;
    name: string;
    photo: string;
    experience: string;
    languages: string[];
    rating: number;
    isActive: boolean;
}

export default function DriversPage() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const res = await fetch('/api/admin/drivers');
            const data = await res.json();
            if (Array.isArray(data)) {
                setDrivers(data);
            }
        } catch (error) {
            console.error('Error fetching drivers:', error);
            setToast({ message: 'Failed to fetch drivers', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Driver',
            message: 'Are you sure you want to delete this driver? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin/drivers/${id}`, {
                        method: 'DELETE',
                    });
                    if (res.ok) {
                        setDrivers(prev => prev.filter(d => d._id !== id));
                        setToast({ message: 'Driver deleted successfully', type: 'success' });
                    } else {
                        throw new Error('Failed to delete');
                    }
                } catch (error) {
                    setToast({ message: 'Error deleting driver', type: 'error' });
                } finally {
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const filteredDrivers = drivers.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center">Loading drivers...</div>;

    return (
        <div className="p-6 max-w-[95%] mx-auto">
            {toast && <Toast message={toast.message} type={toast.type} isVisible={true} onClose={() => setToast(null)} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className={styles.title}>Driver Management</h1>
                    <p className="text-muted-foreground">Manage your team of professional drivers</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search drivers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-full focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
                        />
                    </div>
                    <Link
                        href="/admin/drivers/new"
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-6 py-2.5 rounded-full font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform"
                    >
                        <Plus size={20} />
                        Add Driver
                    </Link>
                </div>
            </div>

            <div className={styles.glassCard}>
                <div className="overflow-x-auto">
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className="p-4 text-left">Driver</th>
                                <th className="p-4 text-left">Experience</th>
                                <th className="p-4 text-left">Languages</th>
                                <th className="p-4 text-center">Rating</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDrivers.map(driver => (
                                <tr key={driver._id} className="hover:bg-slate-50/30 transition-colors border-b border-border/50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
                                                <Image src={driver.photo} alt={driver.name} fill className="object-cover" />
                                            </div>
                                            <span className="font-semibold">{driver.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-muted-foreground">{driver.experience}</td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {driver.languages.map(lang => (
                                                <span key={lang} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star size={14} className="fill-amber-400 text-amber-400" />
                                            <span>{driver.rating}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${driver.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {driver.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/drivers/${driver._id}`}
                                                className="p-2 hover:bg-muted rounded-lg transition-colors text-blue-500"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(driver._id)}
                                                className="p-2 hover:bg-muted rounded-lg transition-colors text-red-500"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        </div>
    );
}

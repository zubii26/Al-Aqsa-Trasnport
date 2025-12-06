'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, Trash2, Upload, X, MapPin } from 'lucide-react';
import Image from 'next/image';
import styles from '../admin.module.css';
import { Toast } from '@/components/ui/Toast';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';

const PasswordConfirmModal = dynamic(() => import('@/components/admin/PasswordConfirmModal'), { ssr: false });


interface GalleryItem {
    _id: string;
    image: string;
    caption: string;
    location: string;
    createdAt: string;
}

export default function GalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Security Modal State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        image: '',
        caption: '',
        location: ''
    });

    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchItems = React.useCallback(async () => {
        try {
            const res = await fetch('/api/gallery');
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch gallery items:', error);
            showToast('Failed to load gallery items', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            // Attempt 1: Client-Side Upload (Preferred for large files)
            // 1. Get signature
            const signRes = await fetch('/api/upload?type=signature', { method: 'POST' });
            const signData = await signRes.json();

            if (!signData.success) {
                throw new Error(signData.error || 'Failed to get upload signature');
            }

            // 2. Upload directly to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', signData.apiKey);
            formData.append('timestamp', signData.timestamp.toString());
            formData.append('signature', signData.signature);
            formData.append('folder', signData.folder);

            const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;

            try {
                const uploadRes = await fetch(uploadUrl, { method: 'POST', body: formData });
                if (!uploadRes.ok) throw new Error('Direct upload failed');
                const uploadData = await uploadRes.json();

                if (uploadData.secure_url) {
                    setFormData(prev => ({ ...prev, image: uploadData.secure_url }));
                    showToast('Image uploaded successfully (Client)', 'success');
                    return;
                }
            } catch (directError) {
                console.warn('Direct upload failed, switching to server fallback...', directError);
                throw new Error('Direct upload failed');
            }

        } catch (clientError) {
            // Attempt 2: Server-Side Fallback (For small files <4.5MB)
            try {
                const fallbackFormData = new FormData();
                fallbackFormData.append('file', file);

                const serverRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: fallbackFormData
                });

                const serverData = await serverRes.json();

                if (serverData.success) {
                    setFormData(prev => ({ ...prev, image: serverData.url }));
                    showToast('Image uploaded successfully (Server Fallback)', 'success');
                } else {
                    throw new Error(serverData.error || 'Upload failed');
                }
            } catch (serverError) {
                console.error('Final upload failure:', serverError);
                showToast(serverError instanceof Error ? serverError.message : 'Failed to upload image', 'error');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPasswordModalOpen(true);
    };

    const handleFinalSubmit = async () => {
        setIsPasswordModalOpen(false);
        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                fetchItems();
                setFormData({ image: '', caption: '', location: '' });
                showToast('Photo added successfully', 'success');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Failed to save item:', error);
            showToast('Failed to save item', 'error');
        }
    };

    const handleDelete = (id: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Photo',
            message: 'Are you sure you want to delete this photo?',
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        fetchItems();
                        showToast('Photo deleted successfully', 'success');
                    } else {
                        throw new Error('Failed to delete');
                    }
                } catch (error) {
                    console.error('Failed to delete item:', error);
                    showToast('Failed to delete item', 'error');
                } finally {
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {toast && <Toast message={toast.message} type={toast.type} isVisible={true} onClose={() => setToast(null)} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className={styles.title}>Visitor Gallery</h1>
                    <p className="text-muted-foreground mt-1">Manage photos of your happy pilgrims</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Add Photo
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-64 bg-card/50 animate-pulse rounded-2xl border border-border" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 bg-card/30 rounded-2xl border border-dashed border-border">
                    <ImageIcon className="mx-auto text-muted-foreground mb-4 opacity-50" size={48} />
                    <h3 className="text-xl font-semibold text-foreground">No photos yet</h3>
                    <p className="text-muted-foreground">Upload your first photo to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {items.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-border shadow-sm hover:shadow-xl transition-all"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.caption}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <p className="text-white font-bold truncate">{item.caption}</p>
                                    <div className="flex items-center gap-1 text-white/80 text-sm">
                                        <MapPin size={12} />
                                        <span className="truncate">{item.location}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="absolute top-3 right-3 p-2 bg-red-500/80 backdrop-blur-md hover:bg-red-600 text-white rounded-full transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-card text-card-foreground border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">Add New Photo</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Photo</label>
                                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        disabled={uploading}
                                    />
                                    {uploading ? (
                                        <div className="text-amber-500">Uploading...</div>
                                    ) : formData.image ? (
                                        <div className="relative h-40 w-full rounded-lg overflow-hidden">
                                            <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <Upload size={24} />
                                            <span>Click to upload image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Caption</label>
                                <input
                                    required
                                    className="w-full p-2.5 rounded-lg border border-border bg-background"
                                    value={formData.caption}
                                    onChange={e => setFormData({ ...formData, caption: e.target.value })}
                                    placeholder="e.g. Happy family in Makkah"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <input
                                    required
                                    className="w-full p-2.5 rounded-lg border border-border bg-background"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. Makkah"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!formData.image || uploading}
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
                                >
                                    Save Photo
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <AdminConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                isDestructive
            />

            <PasswordConfirmModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onConfirm={handleFinalSubmit}
                title="Confirm Photo Upload"
                description="Please enter your admin password to save this photo."
                actionLabel="Save & Publish"
            />
        </div>
    );
}

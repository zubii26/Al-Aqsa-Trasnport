'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';
import styles from '../../admin.module.css';
import { Toast } from '@/components/ui/Toast';

class DirectUploadError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'DirectUploadError';
    }
}

interface DriverFormData {
    name: string;
    photo: string;
    experience: string;
    languages: string; // Comma separated for input
    certifications: string; // Comma separated for input
    rating: number;
    trips: string;
    quote: string;
    badges: string; // Comma separated
    isActive: boolean;
}

const initialForm: DriverFormData = {
    name: '',
    photo: '/images/team/driver-1.jpg', // Default placeholder
    experience: '',
    languages: '',
    certifications: '',
    rating: 5.0,
    trips: '0',
    quote: '',
    badges: '',
    isActive: true
};

export default function DriverFormPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const isNew = id === 'new';

    const [formData, setFormData] = useState<DriverFormData>(initialForm);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!isNew && id) {
            fetchDriver();
        }
    }, [id, isNew]);

    const fetchDriver = async () => {
        try {
            const res = await fetch(`/api/admin/drivers/${id}`);
            const data = await res.json();
            if (res.ok) {
                setFormData({
                    ...data,
                    languages: data.languages.join(', '),
                    certifications: data.certifications.join(', '),
                    badges: data.badges.join(', ')
                });
            } else {
                setToast({ message: 'Failed to fetch driver', type: 'error' });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: 'Error loading driver', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            ...formData,
            languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
            certifications: formData.certifications.split(',').map(s => s.trim()).filter(Boolean),
            badges: formData.badges.split(',').map(s => s.trim()).filter(Boolean),
        };

        try {
            const url = isNew ? '/api/admin/drivers' : `/api/admin/drivers/${id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setToast({ message: `Driver ${isNew ? 'created' : 'updated'} successfully`, type: 'success' });
                setTimeout(() => router.push('/admin/drivers'), 1500);
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error(error);
            setToast({ message: 'Error saving driver', type: 'error' });
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {toast && <Toast message={toast.message} type={toast.type} isVisible={true} onClose={() => setToast(null)} />}

            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/drivers" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className={styles.title}>{isNew ? 'Add New Driver' : 'Edit Driver'}</h1>
                    <p className="text-muted-foreground">Fill in the details below</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.glassCard + " p-8 space-y-6"}>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 bg-background border border-border rounded-lg"
                            placeholder="e.g. Mohammed Al-Harbi"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold mb-1">Photo</label>
                        <div className="space-y-4">
                            {/* File Upload */}
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            try {
                                                // Attempt 1: Client-Side Upload (Preferred for large files)
                                                // 1. Get signature
                                                const signRes = await fetch('/api/upload?type=signature', { method: 'POST' });
                                                const signData = await signRes.json();

                                                if (!signData.success) {
                                                    throw new Error(signData.error || 'Failed to get upload signature');
                                                }

                                                // 2. Upload directly to Cloudinary
                                                const formDataUpload = new FormData();
                                                formDataUpload.append('file', file);
                                                formDataUpload.append('api_key', signData.apiKey);
                                                formDataUpload.append('timestamp', signData.timestamp.toString());
                                                formDataUpload.append('signature', signData.signature);
                                                formDataUpload.append('folder', signData.folder);

                                                const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;

                                                try {
                                                    const uploadRes = await fetch(uploadUrl, { method: 'POST', body: formDataUpload });
                                                    if (!uploadRes.ok) throw new Error('Network response was not ok');
                                                    const uploadData = await uploadRes.json();

                                                    if (uploadData.secure_url) {
                                                        setFormData(prev => ({ ...prev, photo: uploadData.secure_url }));
                                                        return;
                                                    }
                                                } catch (directError) {
                                                    console.warn('Direct upload failed, switching to server fallback...', directError);
                                                    throw new DirectUploadError();
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
                                                        setFormData(prev => ({ ...prev, photo: serverData.url }));
                                                    } else {
                                                        setToast({ message: serverData.error || 'Upload failed', type: 'error' });
                                                    }
                                                } catch (serverError) {
                                                    console.error('Final upload failure:', serverError);
                                                    setToast({ message: 'Upload failed', type: 'error' });
                                                }
                                            }
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-all"
                                    />
                                </div>
                            </div>

                            {/* URL Input */}
                            <input
                                type="text"
                                name="photo"
                                value={formData.photo}
                                onChange={handleChange}
                                className="w-full p-2 bg-background border border-border rounded-lg"
                                placeholder="Or enter image URL manually..."
                            />

                            {/* Preview */}
                            {formData.photo ? (
                                <div className="relative aspect-[3/4] w-32 rounded-lg overflow-hidden border border-border group">
                                    <Image
                                        src={formData.photo}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            ) : (
                                <div className="aspect-[3/4] w-32 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                                    <ImageIcon size={24} className="mb-2" />
                                    <span className="text-xs">No image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold mb-1">Experience</label>
                        <input
                            type="text"
                            name="experience"
                            required
                            value={formData.experience}
                            onChange={handleChange}
                            className="w-full p-2 bg-background border border-border rounded-lg"
                            placeholder="e.g. 15+ Years"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold mb-1">Trips Count</label>
                        <input
                            type="text"
                            name="trips"
                            value={formData.trips}
                            onChange={handleChange}
                            className="w-full p-2 bg-background border border-border rounded-lg"
                            placeholder="e.g. 12,000+"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold mb-1">Rating</label>
                        <input
                            type="number"
                            name="rating"
                            step="0.1"
                            min="0"
                            max="5"
                            value={formData.rating}
                            onChange={handleChange}
                            className="w-full p-2 bg-background border border-border rounded-lg"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold mb-1">Status</label>
                        <select
                            name="isActive"
                            value={formData.isActive ? 'true' : 'false'}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                            className="w-full p-2 bg-background border border-border rounded-lg"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Arrays as comma separated strings */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold mb-1">Languages (comma separated)</label>
                    <input
                        type="text"
                        name="languages"
                        value={formData.languages}
                        onChange={handleChange}
                        className="w-full p-2 bg-background border border-border rounded-lg"
                        placeholder="Arabic, English, Urdu"
                    />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-bold mb-1">Certifications (comma separated)</label>
                    <input
                        type="text"
                        name="certifications"
                        value={formData.certifications}
                        onChange={handleChange}
                        className="w-full p-2 bg-background border border-border rounded-lg"
                        placeholder="First Aid, Licensed Guide"
                    />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-bold mb-1">Badges (comma separated)</label>
                    <input
                        type="text"
                        name="badges"
                        value={formData.badges}
                        onChange={handleChange}
                        className="w-full p-2 bg-background border border-border rounded-lg"
                        placeholder="Top Rated, Expert"
                    />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-bold mb-1">Quote</label>
                    <textarea
                        name="quote"
                        rows={3}
                        value={formData.quote}
                        onChange={handleChange}
                        className="w-full p-2 bg-background border border-border rounded-lg"
                        placeholder="Driver's personal quote..."
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-amber-500 text-black px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Driver'}
                    </button>
                </div>
            </form>
        </div>
    );
}

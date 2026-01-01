'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Save, Loader2, ArrowLeft, Shield } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [role, setRole] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/auth/profile');
            if (res.status === 401) return router.push('/driver/login'); // Redirect to generic login if undetermined
            const data = await res.json();

            if (res.ok) {
                setFormData(prev => ({
                    ...prev,
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || ''
                }));
                setRole(data.role);
            }
        } catch (error) {
            console.error('Failed to load profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            return setMessage({ type: 'error', text: 'New passwords do not match' });
        }

        setSaving(true);
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    password: formData.newPassword || undefined,
                    currentPassword: formData.currentPassword // Server should verify this!
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Update failed');

            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '', currentPassword: '' }));
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
    );

    const isDriver = role === 'driver';

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 pb-12 rounded-b-[30px] shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold">My Profile</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 shadow-xl border-4 border-slate-800">
                        <User size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{formData.name}</h2>
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                            <Shield size={12} className="text-emerald-500" />
                            <span className="capitalize">{role} Account</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="px-4 -mt-6">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 space-y-6">
                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Personal Info</h3>

                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                    placeholder="+966 50 000 0000"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Security</h3>

                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1.5 block">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="Leave empty to keep current"
                                />
                            </div>
                        </div>

                        {formData.newPassword && (
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all placeholder:text-slate-400 ${formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                                                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                                                : 'border-slate-200 focus:ring-amber-500/20 focus:border-amber-500'
                                            }`}
                                        placeholder="Retype new password"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
                    </button>

                </form>

                <div className="mt-6 text-center text-xs text-slate-400">
                    Need help? Contact Admin Support
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, CreditCard, Loader2, LogOut } from 'lucide-react';

export default function AgencyProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', password: '', confirmPassword: '' });
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setProfile(data.user);
                        setFormData(prev => ({ ...prev, name: data.user.name || '' }));
                    } else {
                        // Session invalid or expired
                        window.location.href = '/agency/login';
                    }
                }
            } catch (error) {
                console.error('Failed to load profile', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            setToast({ message: 'Passwords do not match', type: 'error' });
            return;
        }

        try {
            const res = await fetch('/api/agency/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    newPassword: formData.password
                })
            });

            if (res.ok) {
                const data = await res.json();
                setProfile((prev: any) => ({ ...prev, name: data.user.name }));
                setToast({ message: 'Profile updated successfully', type: 'success' });
                setIsEditing(false);
                setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            } else {
                setToast({ message: 'Failed to update profile', type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'Error updating profile', type: 'error' });
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;
    }

    if (!profile) return <div>Failed to load profile</div>;

    return (
        <div className="p-4 lg:p-8 max-w-2xl mx-auto pb-24">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white shadow-lg ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Agency Profile</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Edit Account Details</h2>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Agency Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="pt-4 border-t border-slate-100 mt-4">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4">Change Password (Optional)</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Leave blank to keep current"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Confirm new password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-blue-600 h-24 relative">
                        <div className="absolute -bottom-10 left-8">
                            <div className="w-20 h-20 bg-white rounded-full p-1 shadow-md">
                                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                    <User size={32} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 px-8 pb-8">
                        <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                        <p className="text-slate-500">Agency Partner</p>

                        <div className="mt-8 space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email Address</p>
                                    <p className="font-medium text-slate-900">{profile.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Credit Limit</p>
                                    <p className="font-medium text-slate-900">{profile.creditLimit?.toLocaleString()} SAR</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Active Contracts</p>
                                    <p className="font-medium text-slate-900">{profile.activeContracts || 0} Contracts</p>
                                </div>
                            </div>

                            <button
                                onClick={async () => {
                                    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (e) { }
                                    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                    window.location.href = '/agency/login';
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium mt-6"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

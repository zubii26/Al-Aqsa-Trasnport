
'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Fetch current profile data
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/auth/me'); // We might need to ensure this endpoint returns user data
                const data = await res.json();
                if (data.authenticated) {
                    setFormData(prev => ({
                        ...prev,
                        name: data.user.name || '',
                        email: data.user.email || '',
                        phone: data.user.phone || ''
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage('Error: New passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setMessage('Success: Profile updated successfully');
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Profile Settings</h1>

            {message && (
                <div className={`p-4 mb-6 rounded-lg text-sm ${message.startsWith('Success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email (Cannot change)</label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="mt-1 block w-full rounded-md border-slate-300 bg-slate-100 shadow-sm sm:text-sm p-2 border text-slate-500 cursor-not-allowed"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700">Phone</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Current Password</label>
                            <input
                                type="password"
                                value={formData.currentPassword}
                                onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">New Password</label>
                            <input
                                type="password"
                                value={formData.newPassword}
                                onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center rounded-md border border-transparent bg-amber-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

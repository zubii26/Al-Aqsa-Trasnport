'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Bell, Globe, HelpCircle, LogOut, Car, ChevronRight, Star, Shield, Award } from 'lucide-react';
import BottomNav from '@/components/driver/BottomNav';

export default function DriverProfile() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    // Settings States
    const [notifications, setNotifications] = useState(true);

    // Password Modal States
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        // Fetch user basic info
        fetch('/api/auth/profile')
            .then(res => res.json())
            .then(data => {
                if (data.user) setUser(data.user);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/driver/login');
    };

    const handleUpdatePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.password !== passwordData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        if (passwordData.password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        setUpdating(true);
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordData.password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to update password');

            setPasswordSuccess('Password updated successfully!');
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordData({ password: '', confirmPassword: '' });
                setPasswordSuccess('');
            }, 1500);
        } catch (err: any) {
            setPasswordError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const menuItems = [
        {
            icon: Bell,
            label: 'Notifications',
            value: notifications ? 'On' : 'Off',
            color: 'bg-blue-500/10 text-blue-500',
            action: () => setNotifications(!notifications)
        },
        {
            icon: Globe,
            label: 'Language',
            value: 'English',
            color: 'bg-purple-500/10 text-purple-500',
            action: () => { } // Placeholder for language selector
        },
        {
            icon: Shield,
            label: 'Privacy & Security',
            color: 'bg-green-500/10 text-green-500',
            action: () => setShowPasswordModal(true)
        },
        {
            icon: HelpCircle,
            label: 'Help & Support',
            color: 'bg-amber-500/10 text-amber-500',
            action: () => window.open('https://wa.me/966500000000', '_blank')
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Premium Header - Deep Slate with Gold Accents */}
            <div className="bg-slate-900 text-white p-6 pb-24 rounded-b-[40px] shadow-2xl relative overflow-hidden">
                {/* Dynamic Background Effects */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />

                <div className="relative z-10 flex flex-col items-center pt-8">
                    {/* Avatar with Gold Ring */}
                    <div className="relative mb-6 group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-300 to-amber-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-900 relative z-10 flex items-center justify-center text-slate-400 overflow-hidden shadow-2xl">
                            {loading ? (
                                <div className="animate-pulse bg-slate-700 w-full h-full" />
                            ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                    <User size={64} className="text-slate-600" />
                                </div>
                            )}
                        </div>
                        {/* Verified Badge */}
                        <div className="absolute -bottom-1 -right-1 z-20 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full p-2 border-4 border-slate-900 shadow-lg flex items-center justify-center">
                            <Shield size={16} fill="currentColor" />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="text-center mb-8">
                        {loading ? (
                            <div className="w-48 h-8 bg-slate-800 rounded-lg animate-pulse mb-2 mx-auto" />
                        ) : (
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                {user?.name || 'Driver Name'}
                            </h1>
                        )}
                        <p className="text-slate-400 font-medium flex items-center gap-2 justify-center mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {user?.email || 'driver@alaqsa.com'}
                        </p>
                    </div>

                    {/* Stats Row - Glassmorphic Pills */}
                    <div className="flex gap-4 w-full justify-center max-w-sm">
                        <div className="flex-1 flex flex-col items-center bg-slate-800/40 backdrop-blur-md p-3 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Rating</span>
                            <div className="flex items-center gap-1 text-amber-400 font-bold text-xl">
                                4.9 <Star size={14} fill="currentColor" />
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center bg-slate-800/40 backdrop-blur-md p-3 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Trips</span>
                            <div className="flex items-center gap-1 text-white font-bold text-xl">
                                142
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center bg-gradient-to-br from-amber-500/10 to-amber-600/10 backdrop-blur-md p-3 rounded-2xl border border-amber-500/30 hover:border-amber-500/50 transition-colors">
                            <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-1">Level</span>
                            <div className="flex items-center gap-1 text-amber-400 font-bold text-xl">
                                Gold
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-20 relative z-20 space-y-6">
                {/* Vehicle Card - Premium Asset Showcase */}
                <div className="bg-white rounded-[24px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative group transform hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-slate-50 to-transparent" />
                    <div className="absolute -right-10 -bottom-10 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <Car size={200} className="text-slate-900" />
                    </div>

                    <div className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-slate-900 text-amber-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-slate-800">
                                        Active Vehicle
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">GMC Yukon XL</h3>
                                <p className="text-slate-500 text-sm font-mono mt-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    ABC-1234
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
                                <Award size={24} />
                            </div>
                        </div>

                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden w-full max-w-[120px]">
                            <div className="h-full bg-amber-500 w-[85%]" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">Condition: Excellent</p>
                    </div>
                </div>

                {/* Settings Menu - Clean & Modern */}
                <div className="bg-white rounded-[24px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest p-6 pb-2">Account Settings</h3>
                    <div className="divide-y divide-slate-50">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.action}
                                className="w-full flex items-center justify-between p-5 hover:bg-slate-50/80 transition-all group active:scale-[0.99]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${item.color.replace('text-', 'bg-').replace('/10', '/10')} group-hover:scale-110 duration-300`}>
                                        <item.icon size={20} className={item.color.split(' ')[1]} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {item.value && (
                                        <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                                            {item.value}
                                        </span>
                                    )}
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                        <ChevronRight size={14} />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-white p-5 rounded-[24px] font-bold text-slate-900 shadow-lg shadow-slate-200/50 border border-slate-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
                        <LogOut size={16} />
                    </div>
                    Sign Out
                </button>

                <div className="text-center pt-8 pb-4 space-y-2">
                    <div className="flex justify-center gap-4 text-slate-300">
                        <span className="text-xs">Privacy Policy</span>
                        <span className="text-xs">•</span>
                        <span className="text-xs">Terms of Service</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono opacity-50">v2.1.0 (Build 542)</p>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-[scaleIn_0.2s_ease-out]">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Change Password</h3>
                        <p className="text-sm text-slate-500 mb-6">Enter a new secure password for your account.</p>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password</label>
                                <input
                                    type="password"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                    placeholder="Min. 6 characters"
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                    placeholder="Re-enter password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>

                            {passwordError && (
                                <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-xl flex items-center gap-2">
                                    <Shield size={14} /> {passwordError}
                                </div>
                            )}

                            {passwordSuccess && (
                                <div className="p-3 bg-green-50 text-green-600 text-xs font-medium rounded-xl flex items-center gap-2">
                                    <Shield size={14} /> {passwordSuccess}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdatePassword}
                                disabled={updating}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updating ? 'Saving...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}

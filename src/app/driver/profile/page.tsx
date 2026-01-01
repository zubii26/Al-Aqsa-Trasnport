'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, Bell, Globe, HelpCircle, LogOut, Car, ChevronRight, Star, Shield, Award, Clock } from 'lucide-react';
import BottomNav from '@/components/driver/BottomNav';

export default function DriverProfile() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

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

    const menuItems = [
        { icon: Bell, label: 'Notifications', value: 'On', color: 'bg-blue-500/10 text-blue-500' },
        { icon: Globe, label: 'Language', value: 'English', color: 'bg-purple-500/10 text-purple-500' },
        { icon: Shield, label: 'Privacy & Security', color: 'bg-green-500/10 text-green-500' },
        { icon: HelpCircle, label: 'Help & Support', color: 'bg-amber-500/10 text-amber-500' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Premium Header */}
            <div className="bg-slate-900 text-white p-6 pb-24 rounded-b-[40px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10 flex flex-col items-center pt-4">
                    <div className="relative mb-4">
                        <div className="w-28 h-28 rounded-full bg-slate-800 border-4 border-slate-700/50 shadow-2xl flex items-center justify-center text-slate-400 overflow-hidden">
                            {loading ? (
                                <div className="animate-pulse bg-slate-700 w-full h-full" />
                            ) : (
                                <User size={48} />
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-900 rounded-full p-2 border-4 border-slate-900 shadow-lg">
                            <Star size={16} fill="currentColor" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="w-48 h-8 bg-slate-800 rounded-lg animate-pulse mb-2" />
                    ) : (
                        <h1 className="text-2xl font-bold">{user?.name}</h1>
                    )}

                    <p className="text-slate-400 text-sm mb-6">{user?.email || 'driver@alaqsa.com'}</p>

                    <div className="flex gap-4 w-full justify-center">
                        <div className="flex flex-col items-center bg-slate-800/50 backdrop-blur-md p-3 rounded-2xl border border-slate-700/50 w-24">
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Rating</span>
                            <div className="flex items-center gap-1 text-amber-400 font-bold text-lg">
                                4.9 <Star size={14} fill="currentColor" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center bg-slate-800/50 backdrop-blur-md p-3 rounded-2xl border border-slate-700/50 w-24">
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Trips</span>
                            <div className="flex items-center gap-1 text-white font-bold text-lg">
                                142
                            </div>
                        </div>
                        <div className="flex flex-col items-center bg-slate-800/50 backdrop-blur-md p-3 rounded-2xl border border-slate-700/50 w-24">
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Level</span>
                            <div className="flex items-center gap-1 text-amber-400 font-bold text-lg">
                                Gold
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-20 relative z-20 space-y-5">
                {/* Vehicle Card */}
                <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 flex items-center justify-between overflow-hidden relative group">
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-amber-500/5 to-transparent" />
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Assigned</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">GMC Yukon XL</h3>
                        <p className="text-slate-500 text-sm font-mono">ABC-1234</p>
                    </div>
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform duration-500">
                        <Car size={32} />
                    </div>
                </div>

                {/* Settings Menu */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider p-5 pb-2">Settings</h3>
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                                    <item.icon size={20} />
                                </div>
                                <span className="text-sm font-bold text-slate-700">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.value && <span className="text-xs text-slate-400 font-medium">{item.value}</span>}
                                <ChevronRight size={16} className="text-slate-300" />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-white p-4 rounded-2xl font-bold text-red-500 shadow-lg border border-red-50 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>

                <div className="text-center pt-4 pb-2">
                    <p className="text-xs text-slate-400">Al Aqsa Driver App v2.1.0</p>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}

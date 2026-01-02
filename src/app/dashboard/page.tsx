
'use client';

import Link from 'next/link';
import { CalendarDays, Car, Clock, PlusCircle, MapPin, ChevronRight, Phone, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('Traveler');

    useEffect(() => {
        // Simulate catching user name or real fetch
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data.user) setUserName(data.user.name || 'Traveler');
            } catch (e) { console.error(e) }
            finally { setIsLoading(false); }
        };
        fetchUser();
    }, []);

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            {/* Mobile Greeting */}
            <header className="flex items-center justify-between lg:mb-8">
                <div>
                    <p className="text-slate-500 text-sm lg:hidden">Good Morning,</p>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{userName}</h1>
                </div>
                {/* Desktop New Booking Button - Hidden on Mobile to use FAB or Grid */}
                <Link
                    href="/booking"
                    className="hidden lg:flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                    <PlusCircle size={20} />
                    New Booking
                </Link>
            </header>

            {/* Hero Card - Upcoming Trip (Mock Data for now) */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Car size={120} />
                </div>
                <div className="relative z-10">
                    <span className="bg-amber-500 text-xs font-bold px-2 py-1 rounded-sm text-slate-900 uppercase tracking-wider">Upcoming</span>
                    <div className="mt-4 flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1 mt-1">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <div className="w-0.5 h-8 bg-slate-700"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <p className="text-xs text-slate-400">Pickup</p>
                                <p className="font-medium text-lg leading-tight">Jeddah Airport (KAIA)</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Dropoff</p>
                                <p className="font-medium text-lg leading-tight">Swissotel Makkah</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-slate-400">Date & Time</p>
                            <p className="font-medium">Tomorrow, 10:30 AM</p>
                        </div>
                        <Link href="/dashboard/bookings" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition">
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/booking" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-amber-500 transition group text-center">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
                        <PlusCircle size={24} />
                    </div>
                    <span className="font-medium text-slate-700 text-sm">Book Ride</span>
                </Link>
                <Link href="/dashboard/bookings" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition group text-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                        <CalendarDays size={24} />
                    </div>
                    <span className="font-medium text-slate-700 text-sm">My Trips</span>
                </Link>
                <Link href="#" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-green-500 transition group text-center">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                        <Phone size={24} />
                    </div>
                    <span className="font-medium text-slate-700 text-sm">Support</span>
                </Link>
                <Link href="/dashboard/profile" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-purple-500 transition group text-center">
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                        <UserIcon size={24} />
                    </div>
                    <span className="font-medium text-slate-700 text-sm">Profile</span>
                </Link>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
                    <Link href="/dashboard/bookings" className="text-sm text-amber-600 hover:text-amber-700">
                        View all
                    </Link>
                </div>
                {/* Simplified List Item */}
                <div className="divide-y divide-slate-100">
                    {[1, 2].map((i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                    <Car size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 text-sm">Makkah to Madinah</p>
                                    <p className="text-xs text-slate-500">Completed • Jan 0{i}</p>
                                </div>
                            </div>
                            <span className="font-bold text-slate-900 text-sm">SAR 450</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
